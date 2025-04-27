import { Button, Checkbox, Input } from 'antd/es';
import {
  Fragment,
  useContext,
  useEffect,
  useState,
} from 'react';
import CategoryFilterContext from '@/contexts/categoryFilterContext';
import { twMerge } from 'tailwind-merge';

type ValueProps = {
  id: string | number;
  name: string;
}

type Props = {
  title: string;
  value: Partial<ValueProps>[];
  filterKey: string;
  entity?: string;
  isNav?: boolean;
};

export default function SettingFilterItem({
  title,
  value,
  filterKey,
  entity,
  isNav,
}: Props) {
  const [check, setCheck] = useState<Record<string | number, boolean>>({});
  const [valueFilter, setValueFilter] = useState<Partial<ValueProps>[]>([]);
  const [search, setSearch] = useState<string>('');
  const ctx = useContext(CategoryFilterContext);
  useEffect(() => {
    const _check: Record<string | number, boolean> = {};
    (ctx?.filters?.[filterKey] || []).map((item) => {
      _check[item] = true;
    });
    setCheck(_check);
    // setDebounceCheck(_check);
  }, [ctx?.filters]);

  useEffect(() => {
    if (search) {
      setValueFilter(value.filter((item: Partial<ValueProps>) => {
        if((item?.name || '').toLowerCase().includes(search.toLowerCase())) {
          return item;
        }
        return;
      }));
    } else {
      setValueFilter(value as ValueProps[]);
    }
  }, [search]);

  const onClickCheck = (id: string | number) => {
    let _filter = { ...ctx?.filters };
    const value = _filter[filterKey] || [];
    const checked = !check[id];
    const indexValue = value.findIndex(
      (item) => item.toString() === id.toString(),
    );
    if (indexValue === -1 && checked && !value.includes(id)) {
      value.push(id);
    } else if (indexValue > -1 && !checked) {
      value.splice(indexValue, 1);
    }
    _filter[filterKey] = value;
    ctx?.updateRouter && ctx.updateRouter('filter', _filter);
  };
  const renderValue = () => {
    return (
      <>
        {((valueFilter as ValueProps[]) || []).map((item: ValueProps, index: number) => {
          return (
            <Fragment key={filterKey + '_' + item.name + '_' + item.id + '_'}>
              {isNav ? (
                <Button
                  onClick={() => onClickCheck(item.id)}
                  disabled={
                    ctx?.loading ||
                    (ctx?.dataSlug?.model
                      ? ctx?.dataSlug?.model === entity
                      : false)
                  }
                  className={twMerge(
                    check[item.id]
                      ? '!bg-primary !text-white'
                      : '!bg-white !text-black',
                  )}
                >
                  {item.name}
                </Button>
              ) : (
                <Checkbox
                  checked={check[item.id]}
                  onClick={() => onClickCheck(item.id)}
                  className={'filter-checkbox'}
                  disabled={
                    ctx?.loading ||
                    (ctx?.dataSlug?.model
                      ? ctx?.dataSlug?.model === entity
                      : false)
                  }
                >
                  {item.name}
                </Checkbox>
              )}
            </Fragment>
          );
        })}
      </>
    );
  };
  return (
    <div className={'flex flex-col gap-2 mb-3'}>
      <div
        className={
          'font-semibold text-[16px] lg:pb-2 lg:border-b lg:border-gray-500'
        }
      >
        <span className={'text-primary'}>{title}</span>
        <Input className='p-0' placeholder="Tìm kiếm" variant="borderless" onChange={(e) => setSearch(e.target.value)}  />
      </div>
      <div
        className={
          'lg:max-h-[220px] overflow-auto flex max-lg:flex-wrap lg:flex-col max-lg:gap-1 filter-button'
        }
      >
        {renderValue()}
      </div>
    </div>
  );
}
