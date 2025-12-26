import NewsList from '@/components/organisms/news/list';
import { NewsDto } from '@/dtos/News.dto';
import { CategoryNewsDto } from '@/dtos/CategoryNews.dto';
import dynamic from 'next/dynamic';
import NewsSmallList from '@/components/organisms/news/smallList';
import NewsRelation from '@/components/organisms/news/relation';
import NewsRelationMobile from '@/components/organisms/news/relationMobile';
import LayoutNews from '@/components/organisms/news/layout';
import NewsDetail from '@/components/organisms/news/detail';
import NewsCategoryMobile from '../organisms/news/categoryMobile';
import { useIsMobile } from '@/hooks/useDevice';
import { useRouter } from 'next/router';
import HighlightedNews from '@/components/organisms/news/highlight';

const NewsCategory = dynamic(
  () => import('@/components/organisms/news/category'),
  {
    ssr: false,
  },
);

type Props = {
  news: NewsDto | NewsDto[];
  highlightedNews?: {
    featured: NewsDto[];
    news: NewsDto[];
  };
  total?: number;
  categoryNews: CategoryNewsDto[];
  newest?: NewsDto[];
  relationNews?: NewsDto[];
  isDetail?: boolean;
  title?: string;
};

export default function NewsTemplate({
  news,
  highlightedNews,
  categoryNews,
  newest,
  relationNews,
  title,
  isDetail,
  total,
}: Props) {
  const isMobile = useIsMobile();
  const router = useRouter();
  return (
    <>
      {!isDetail && (
        <>
          <NewsCategory categoryNews={categoryNews} />
          {router.pathname === '/tin-tuc' && highlightedNews && (
            <LayoutNews className="mb-4">
              {isMobile && <NewsCategoryMobile categoryNews={categoryNews} />}
              <HighlightedNews content={highlightedNews} />
            </LayoutNews>
          )}
        </>
      )}
      <div className={'grid grid-cols-1 lg:grid-cols-6 gap-1 lg:gap-3 relative'}>
        <>
          {!isDetail ? (
            <LayoutNews
              className={'col-span-4 h-fit relative lg:sticky lg:top-[100px]'}
            >
              {isMobile && router.pathname !== '/tin-tuc' && <NewsCategoryMobile categoryNews={categoryNews} />}
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
                {isMobile ? (
                  <NewsRelationMobile news={relationNews || []} />
                ) : (
                  <NewsRelation news={relationNews || []} />
                )}
              </LayoutNews>
            </div>
          )}
        </>
        <div className={'col-span-2 flex flex-col gap-3'}>
          {newest && (
            <div
              className={
                'w-full rounded-[10px] overflow-hidden relative mx-auto p-3'
              }
            >
              <h2
                className={'text-3xl text-primary font-[700] lg:font-bold mb-3'}
              >
                Bài viết gần đây
              </h2>
              <div>
                <NewsSmallList news={newest} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
