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
            // Ô thật 358px trên viewport 412: hai lớp `p-3` (homeNews
            // /index.tsx:23 và item.tsx:15) ăn 48px, cộng viền. Khai `100vw`
            // làm trình duyệt lấy w=750 (44.378 B) thay vì w=640 (35.094 B).
            // Component này còn dùng ở lưới 2 cột (news/list.tsx:64); khai theo
            // ô LỚN NHẤT (1 cột ở trang chủ) để không chỗ nào bị mờ.
            sizes="(max-width: 768px) calc(100vw - 54px), 33vw"
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
