import { ReactNode, useContext } from 'react';
import CategoryFilterContext from '@/contexts/categoryFilterContext';
import { ProductFilterOptionDto } from '@/dtos/ProductFilterSettingOption/ProductFilterOption.dto';
import CloseCircle from '@/components/icons/closeCircle';
import { getModelEntity } from '@/utils';
import { Entity } from '@/config/enum';
import { twMerge } from 'tailwind-merge';
type Props = {
  className?: string;
};
export default function FilterBy({ className }: Props) {
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
  const renderItem = () => {
    let xhtml: ReactNode[] = [];
    if (_settings) {
      Object.keys(ctx?.filters || {}).map((filter) => {
        const value = ctx?.filters?.[filter];
        (value || []).map((item) => {
          xhtml.push(
            <div
              key={filter + '_' + item}
              className={
                'border border-gray-300 p-1 lg:p-2 rounded-[5px] flex gap-1 bg-primary text-white items-center'
              }
            >
              <button type={'button'} onClick={() => handleClose(filter, item)}>
                <CloseCircle className={'text-white w-5 h-5'} />
              </button>
              <span>{_settings[filter] && _settings[filter][item as any]}</span>
            </div>,
          );
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
