import { NewsDto } from '@/dtos/News.dto';
import NewsItem from '@/components/organisms/news/item';
import noImage from '@/static/images/no-image.png';
import Link from 'next/link';
import { generateSlugToHref, getTitleNews, truncateString } from '@/utils';
import Image from 'next/image';
import NewsClock from '@/components/atoms/news/clock';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
type Props = {
  news: NewsDto[];
};
export default function NewsSmallList({ news }: Props) {
  return (
    <>
      {news.map((item: NewsDto, key: number) => {
        const imageDetail = item?.images?.[0];
        const image = imageDetail?.image || null;
        return (
          <div key={key} className={'flex gap-3 mb-3 last:mb-0  '}>
            <div className={'w-[100px] overflow-hidden basis-[100px] shrink-0'}>
              <Link key={key} href={generateSlugToHref(item.slugs?.slug)}>
                <ImageWithFallback
                  image={image}
                  alt={imageDetail?.alt || item.name || ''}
                  className={
                    'object-contain rounded-[10px] w-[100px] h-[100px]'
                  }
                  unoptimized={false}
                />
              </Link>
            </div>
            <div className={'h-[100px]'}>
              <NewsClock item={item} />
              <h3 className={'font-semibold text-[14px] mb-1'}>
                <Link
                  key={key}
                  href={generateSlugToHref(item.slugs?.slug)}
                  dangerouslySetInnerHTML={{
                    __html: getTitleNews(item.content || item.name || ''),
                  }}
                ></Link>
              </h3>
              <div
                className={'h-[47px] overflow-hidden'}
                dangerouslySetInnerHTML={{
                  __html: truncateString(item?.description || '', 80) || '',
                }}
              ></div>
            </div>
          </div>
        );
      })}
    </>
  );
}
