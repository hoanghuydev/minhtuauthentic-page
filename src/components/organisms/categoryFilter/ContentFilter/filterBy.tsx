import { ReactNode, useContext, useEffect, useState } from 'react';
import CategoryFilterContext from '@/contexts/categoryFilterContext';
import CloseCircle from '@/components/icons/closeCircle';
import { twMerge } from 'tailwind-merge';
import { BrandDto } from '@/dtos/Brand.dto';
import { getFilterFromQuery } from '@/utils';

type Props = {
  className?: string;
  brands?: BrandDto[];
};
export default function FilterBy({ className, brands }: Props) {
  const ctx = useContext(CategoryFilterContext);
  const _settings = ctx?.objFilterByValue;
  const [currentFilters, setCurrentFilters] = useState<
    Record<string, (number | string)[]>
  >(ctx?.filters || {});

  // Đồng bộ với URL khi URL thay đổi
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleURLChange = () => {
        const urlParams = window.location.search;
        const filters = getFilterFromQuery(urlParams);
        setCurrentFilters(filters);
      };

      window.addEventListener('popstate', handleURLChange);

      return () => {
        window.removeEventListener('popstate', handleURLChange);
      };
    }
  }, []);

  // Đồng bộ với context khi filters thay đổi
  useEffect(() => {
    if (ctx?.filters) {
      setCurrentFilters(ctx.filters);
    }
  }, [ctx?.filters]);

  const handleClose = (key: string, id: string | number) => {
    let _filter = { ...currentFilters };
    const value = _filter[key] || [];
    const indexValue = value.findIndex(
      (item) => item.toString() === id.toString(),
    );
    if (indexValue > -1) {
      value.splice(indexValue, 1);
    }
    _filter[key] = value;
    setCurrentFilters(_filter);
    ctx?.setFilters && ctx.setFilters(_filter);
    ctx?.updateRouter && ctx.updateRouter('filter', _filter);
  };

  const getBrandName = (brandId: string | number) => {
    if (!brands) return '';
    const brand = brands.find(
      (brand) => brand?.id?.toString() === brandId.toString(),
    );
    return brand?.name || '';
  };

  const renderFilterItem = (filter: string, item: string | number) => {
    let displayText = '';

    if (filter === 'brands' && brands) {
      displayText = getBrandName(item);
    } else {
      displayText = _settings?.[filter]?.[item as any] || '';
    }

    return (
      <div
        key={filter + '_' + item}
        className={
          'border border-gray-300 p-1 lg:p-2 rounded-[5px] flex gap-1 bg-primary text-white items-center'
        }
      >
        <button type={'button'} onClick={() => handleClose(filter, item)}>
          <CloseCircle className={'text-white w-5 h-5'} />
        </button>
        <span>{displayText}</span>
      </div>
    );
  };

  const renderItem = () => {
    let xhtml: ReactNode[] = [];
    if (_settings) {
      Object.keys(currentFilters || {}).map((filter) => {
        const value = currentFilters?.[filter];
        (value || []).map((item) => {
          xhtml.push(renderFilterItem(filter, item));
        });
      });
    }

    return xhtml;
  };
  return (
    <div
      className={twMerge('flex gap-3 items-center flex-wrap mt-3', className)}
    >
      {renderItem()}
    </div>
  );
}
