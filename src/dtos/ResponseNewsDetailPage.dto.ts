import { NewsDto } from '@/dtos/News.dto';
import { CategoryNewsDto } from '@/dtos/CategoryNews.dto';

export class ResponseNewsDetailPageDto {
  news?: NewsDto;
  relationNews?: NewsDto[];
  newest?: NewsDto[];
  categoryNews?: CategoryNewsDto[];
}
