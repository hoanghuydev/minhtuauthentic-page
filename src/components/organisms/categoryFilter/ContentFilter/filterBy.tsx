import { ReactNode, useContext } from 'react';
import CategoryFilterContext from '@/contexts/categoryFilterContext';
import CloseCircle from '@/components/icons/closeCircle';
import { twMerge } from 'tailwind-merge';
import { BrandDto } from '@/dtos/Brand.dto';
type Props = {
  className?: string;
  brands?: BrandDto[];
};
export default function FilterBy({ className, brands }: Props) {
  const ctx = useContext(CategoryFilterContext);
  const _settings = ctx?.objFilterByValue;

  const handleClose = (key: string, id: string | number) => {
    let _filter = { ...ctx?.filters };
    const value = _filter[key] || [];
    const indexValue = value.findIndex(
      (item) => item.toString() === id.toString(),
    );
    if (indexValue > -1) {
      value.splice(indexValue, 1);
    }
    _filter[key] = value;
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
      Object.keys(ctx?.filters || {}).map((filter) => {
        const value = ctx?.filters?.[filter];
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
