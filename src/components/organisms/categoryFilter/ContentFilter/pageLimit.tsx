import { Select } from 'antd/es';
import { useContext, useEffect, useState } from 'react';
import CategoryFilterContext from '@/contexts/categoryFilterContext';

export default function PageLimit() {
  const ctx = useContext(CategoryFilterContext);
  const [currentLimit, setCurrentLimit] = useState<number>(ctx?.limit || 12);

  // Đồng bộ với URL khi URL thay đổi
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleURLChange = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const limitParam = urlParams.get('limit');
        if (limitParam) {
          const limit = Number(limitParam);
          setCurrentLimit(limit);
        }
      };

      window.addEventListener('popstate', handleURLChange);

      return () => {
        window.removeEventListener('popstate', handleURLChange);
      };
    }
  }, []);

  // Đồng bộ với context khi limit thay đổi
  useEffect(() => {
    if (ctx?.limit && ctx.limit !== currentLimit) {
      setCurrentLimit(ctx.limit);
    }
  }, [ctx?.limit]);

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
        value={currentLimit}
        options={pages}
        onChange={(value) => {
          setCurrentLimit(value);
          ctx?.updateRouter &&
            ctx.updateRouter('limit', value.toString() as string);
        }}
      />
    </div>
  );
}
