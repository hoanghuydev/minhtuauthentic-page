import NewsItem from '@/components/organisms/news/item';
import { NewsDto } from '@/dtos/News.dto';

type Props = {
  news: NewsDto[];
};
export default function NewsRelation({ news }: Props) {
  return (
    <>
      {(news || [])?.length > 0 && (
        <div className={'mt-3'}>
          <h3 className={'font-[700] lg:font-bold text-2xl mb-1 lg:mb-3'}>
            Bài viết liên quan
          </h3>
          <div className={'grid  grid-cols-1 lg:grid-cols-4 gap-3'}>
            {news?.map((item, key) => {
              return <NewsItem news={item} key={key} />;
            })}
          </div>
        </div>
      )}
    </>
  );
}
