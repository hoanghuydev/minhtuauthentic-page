import React from 'react';
import Link from 'next/link';
import { NewsDto } from '@/dtos/News.dto';
import { generateSlugToHref, getTitleNews, truncateString } from '@/utils';
import { CategoryNewsDto } from '@/dtos/CategoryNews.dto';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import NewsClock from '@/components/atoms/news/clock';

type Props = {
  newsData: {
    news: NewsDto[];
    categoryNews: CategoryNewsDto[];
  };
};

const MenuNews = ({ newsData }: Props) => {
  return (
    <div className="flex flex-col">
      <p className="mb-3 text-3xl font-[700] lg:font-bold">Tin tức</p>
      <div className="grid grid-cols-5 gap-3">
        <div className="col-span-1">
          <h3 className="text-xl font-semibold mb-3">Danh mục</h3>
          <ul className="flex flex-col gap-3">
            {newsData.categoryNews.map((item, index) => {
              return (
                <li key={index} className="hover:text-primary line-clamp-1">
                  <Link href={generateSlugToHref(item?.slugs?.slug || '')}>
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="col-span-4">
          <h3 className="text-xl font-semibold mb-3">Tin tức mới nhất</h3>
          <div className="grid grid-cols-2 items-stretch gap-3">
            {newsData.news.slice(0, 8).map((item, index) => {
              const imageDetail = item?.images?.[0];
              const image = imageDetail?.image || null;
              return (
                <div key={index} className={'flex items-center gap-2'}>
                  <div className={'overflow-hidden shrink-0'}>
                    <Link key={index} href={generateSlugToHref(item.slugs?.slug)}>
                      <ImageWithFallback
                        image={image}
                        alt={imageDetail?.alt || item.name || ''}
                        className={
                          'object-contain rounded-[10px] w-[55px] h-[55px]'
                        }
                        unoptimized={false}
                      />
                    </Link>
                  </div>
                  <div>
                    <p className={'line-clamp-2 mb-[1.5px] hover:text-primary'}>
                      <Link
                        key={index}
                        href={generateSlugToHref(item.slugs?.slug)}
                        dangerouslySetInnerHTML={{
                          __html: getTitleNews(item.content || item.name || ''),
                        }}
                      ></Link>
                    </p>
                    <NewsClock item={item} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <Link
          href="/tin-tuc"
          className="inline-block px-4 py-2 text-primary hover:text-primary-dark font-medium"
        >
          Xem tất cả
        </Link>
      </div>
    </div>
  );
};

export default MenuNews;
