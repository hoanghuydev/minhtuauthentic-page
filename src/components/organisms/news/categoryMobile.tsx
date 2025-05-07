import { useIsMobile } from '@/hooks/useDevice';
import { CategoryNewsDto } from '@/dtos/CategoryNews.dto';
import { generateSlugToHref } from '@/utils';
import Link from 'next/link';

type Props = {
  categoryNews: CategoryNewsDto[];
};

export default function NewsCategoryMobile({ categoryNews }: Props) {
  const isMobile = useIsMobile();
  return (
    <>
      {isMobile && (
        <div className={'w-full overflow-auto'}>
          <ul className={'flex flex-nowrap gap-3 pb-2'}>
            {categoryNews.map((item: CategoryNewsDto, key: number) => {
              return (
                <li
                  key={key}
                  className={
                    ' pr-3 border-r border-black font-semibold last:border-r-0 shrink-0'
                  }
                >
                  <Link href={generateSlugToHref(item?.slugs?.slug)}>
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}
