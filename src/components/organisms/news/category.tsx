import { isDesktop } from 'react-device-detect';
import { CategoryNewsDto } from '@/dtos/CategoryNews.dto';
import { generateSlugToHref } from '@/utils';
import Link from 'next/link';

type Props = {
  categoryNews: CategoryNewsDto[];
};

export default function NewsCategory({ categoryNews }: Props) {
  return (
    <>
      {isDesktop && (
        <div
          className={
            'w-full rounded-[10px] shadow-custom bg-white overflow-hidden relative mx-auto p-3'
          }
        >
          <h2 className={'text-3xl text-primary font-[700] lg:font-bold mb-3'}>
            Danh mục tin tức
          </h2>
          <ul className={'flex flex-col gap-3'}>
            {categoryNews.map((item: CategoryNewsDto, key: number) => {
              return (
                <li
                  key={key}
                  className={'p-3 border border-gray-100 text-lg font-semibold'}
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
