import { NewsDto } from '@/dtos/News.dto';
import { CategoryNewsDto } from '@/dtos/CategoryNews.dto';

export class ResponseNewsPageDto {
  news?: NewsDto[];
  highlightedNews?: {
    featured: NewsDto[];
    news: NewsDto[];
  };
  otherCategoryNews?: CategoryNewsDto[];
  newest?: NewsDto[];
  total?: number;
  categoryNews?: CategoryNewsDto;
}
