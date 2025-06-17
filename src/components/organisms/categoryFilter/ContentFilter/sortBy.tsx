import Link from 'next/link';
import { generateSlugToHref } from '@/utils';
import { twMerge } from 'tailwind-merge';
import { CATEGORY_FILTER } from '@/config/enum';
import { useContext, useEffect, useState } from 'react';
import CategoryFilterContext from '@/contexts/categoryFilterContext';

type SortBy = {
  name: string;
  value: string;
};
type Props = {
  isNeedWrapper?: boolean;
};
export default function SortBy({ isNeedWrapper }: Props) {
  const ctx = useContext(CategoryFilterContext);
  const [currentSort, setCurrentSort] = useState<string>(
    ctx?.sortBy || CATEGORY_FILTER.SORT_BY.DATE_DESC,
  );

  // Đồng bộ với URL khi URL thay đổi
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleURLChange = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const sortParam = urlParams.get('sort');
        if (sortParam) {
          setCurrentSort(sortParam);
        }
      };

      window.addEventListener('popstate', handleURLChange);

      return () => {
        window.removeEventListener('popstate', handleURLChange);
      };
    }
  }, []);

  // Đồng bộ với context khi sortBy thay đổi
  useEffect(() => {
    if (ctx?.sortBy && ctx.sortBy !== currentSort) {
      setCurrentSort(ctx.sortBy);
    }
  }, [ctx?.sortBy]);

  const sortBy: SortBy[] = [
    {
      name: 'Cũ nhất',
      value: CATEGORY_FILTER.SORT_BY.DATE_ASC,
    },
    {
      name: 'Mới nhất',
      value: CATEGORY_FILTER.SORT_BY.DATE_DESC,
    },
    {
      name: 'Tên: A-Z',
      value: CATEGORY_FILTER.SORT_BY.NAME_ASC,
    },
    {
      name: 'Tên: Z-A',
      value: CATEGORY_FILTER.SORT_BY.NAME_DESC,
    },
    {
      name: 'Giá: thấp đến cao',
      value: CATEGORY_FILTER.SORT_BY.PRICE_ASC,
    },
    {
      name: 'Giá: cao đến thấp',
      value: CATEGORY_FILTER.SORT_BY.PRICE_DESC,
    },
  ];
  const renderItem = () => {
    return (
      <>
        {sortBy.map((sort, index) => {
          return (
            <button
              type={'button'}
              key={index}
              onClick={() =>
                ctx?.updateRouter &&
                ctx.updateRouter(
                  'sort',
                  (sort.value.toString() || '') as string,
                )
              }
              className={twMerge(
                'bg-[#f3f4f6] border border-[#e5e7eb] rounded-[10px] text-[12px] p-[5px_10px] transition-colors duration-300',
                currentSort === sort.value && 'bg-primary text-white',
              )}
            >
              <span>{sort.name}</span>
            </button>
          );
        })}
      </>
    );
  };
  return (
    <>
      {isNeedWrapper ? (
        <div className={'flex gap-3 flex-wrap'}>{renderItem()}</div>
      ) : (
        renderItem()
      )}
    </>
  );
}
