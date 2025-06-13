import noImage from '@/static/images/no-image.png';
import { NewsDto } from '@/dtos/News.dto';
import Link from 'next/link';
import { generateSlugToHref, getTitleNews, truncateString } from '@/utils';
import Image from 'next/image';
import NewsClock from '@/components/atoms/news/clock';
type Props = {
  news: NewsDto;
};
export default function NewsItem({ news }: Props) {
  const imageDetail = news?.images?.[0];
  const image = imageDetail?.image || null;
  const url = image?.url || noImage;
  return (
    <div className={'p-3 rounded-[10px] border border-primary'}>
      <div className={'relative pt-[100%] rounded-[10px] overflow-hidden'}>
        <Link href={generateSlugToHref(news.slugs?.slug)}>
          <Image
            src={url}
            alt={imageDetail?.alt || news.name || ''}
            fill={true}
            className={'object-contain'}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </Link>
      </div>
      <div className={'mt-3'}>
        <div className={'overflow-hidden'}>
          <h3 className={'font-semibold '}>
            <NewsClock item={news} />
            <Link
              className={'!text-[16px] h-[70px] line-clamp-3 news-title'}
              href={generateSlugToHref(news.slugs?.slug)}
              dangerouslySetInnerHTML={{
                __html: getTitleNews(news.content || news.name || ''),
              }}
            ></Link>
          </h3>
        </div>

        {/*{*/}
        {/*  news?.description && (*/}
        {/*    <div*/}
        {/*      className={'container-html'}*/}
        {/*      dangerouslySetInnerHTML={{*/}
        {/*        __html: truncateString(news?.description || '', 250),*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  )*/}
        {/*}*/}
      </div>
    </div>
  );
}
