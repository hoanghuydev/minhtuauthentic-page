import { NewsDto } from '@/dtos/News.dto';
import SectionSwiper from '@/components/organisms/sectionSwiper';
import NewsItem from '@/components/organisms/news/item';

type Props = {
  news: NewsDto[];
};

export default function NewsRelationMobile({ news }: Props) {
  if (!news || news.length === 0) {
    return null;
  }

  return (
    <div className="mt-3">
      <h3 className="font-[700] text-2xl mb-3">Bài viết liên quan</h3>
      <SectionSwiper
        data={news}
        slidePerViewMobile={2}
        spaceBetweenMobile={10}
        renderItem={(content: unknown) => (
          <NewsItem news={content as NewsDto} />
        )}
      />
    </div>
  );
}
