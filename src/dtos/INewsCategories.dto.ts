import { BaseDto } from '@/dtos/Base.dto';
import { NewsDto } from '@/dtos/News.dto';
import { CategoryNewsDto } from '@/dtos/CategoryNews.dto';

export class INewsCategoriesDto extends BaseDto {
  news_id?: number;
  category_id?: number;
  news?: NewsDto;
  category?: CategoryNewsDto;
}
