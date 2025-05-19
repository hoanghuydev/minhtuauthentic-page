import NewsList from '@/components/organisms/news/list';
import { NewsDto } from '@/dtos/News.dto';
import { CategoryNewsDto } from '@/dtos/CategoryNews.dto';
import dynamic from 'next/dynamic';
import NewsSmallList from '@/components/organisms/news/smallList';
import NewsRelation from '@/components/organisms/news/relation';
import LayoutNews from '@/components/organisms/news/layout';
import NewsDetail from '@/components/organisms/news/detail';
import NewsCategoryMobile from '../organisms/news/categoryMobile';

const NewsCategory = dynamic(
  () => import('@/components/organisms/news/category'),
  {
    ssr: false,
  },
);

type Props = {
  news: NewsDto | NewsDto[];
  total?: number;
  categoryNews: CategoryNewsDto[];
  newest?: NewsDto[];
  relationNews?: NewsDto[];
  isDetail?: boolean;
  title?: string;
};

export default function NewsTemplate({
  news,
  categoryNews,
  newest,
  relationNews,
  title,
  isDetail,
  total,
}: Props) {
  return (
    <div className={'grid grid-cols-1 lg:grid-cols-6 gap-1 lg:gap-3'}>
      <>
        {!isDetail ? (
          <LayoutNews className={'col-span-4 '}>
            <NewsCategoryMobile categoryNews={categoryNews} />
            <NewsList
              title={title}
              news={news as NewsDto[]}
              total={total || 0}
            />
          </LayoutNews>
        ) : (
          <div className={'flex flex-col col-span-4 gap-3'}>
            <LayoutNews>
              <NewsDetail news={news as NewsDto} />
            </LayoutNews>
            <LayoutNews>
              <NewsRelation news={relationNews || []} />
            </LayoutNews>
          </div>
        )}
      </>
      <div className={'col-span-2 flex flex-col gap-3'}>
        <NewsCategory categoryNews={categoryNews} />
        {newest && (
          <div
            className={
              'w-full rounded-[10px] shadow-custom bg-white overflow-hidden relative mx-auto p-3'
            }
          >
            <h3
              className={'text-3xl text-primary font-[700] lg:font-bold mb-3'}
            >
              Bài viết gần đây
            </h3>
            <div>
              <NewsSmallList news={newest} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
