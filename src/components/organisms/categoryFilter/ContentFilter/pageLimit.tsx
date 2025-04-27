import { Select } from 'antd/es';
import { useContext } from 'react';
import CategoryFilterContext from '@/contexts/categoryFilterContext';
export default function PageLimit() {
  const ctx = useContext(CategoryFilterContext);
  const pages = [
    { value: 12, label: '12' },
    { value: 24, label: '24' },
    { value: 48, label: '48' },
    { value: -1, label: 'All' },
  ];
  return (
    <div className="flex lg:items-center">
      <Select
        className={'w-20'}
        defaultValue={ctx?.limit || 12}
        options={pages}
        onChange={(value) => {
          ctx?.updateRouter &&
            ctx.updateRouter('limit', value.toString() as string);
        }}
      />
    </div>
  );
}
