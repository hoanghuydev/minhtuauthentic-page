import { ImageDetailDto } from '@/dtos/ImageDetail.dto';
import { SlugDto } from '@/dtos/Slug.dto';
import { BaseDto } from '@/dtos/Base.dto';
import { SeoDto } from '@/dtos/Seo.dto';
import { INewsCategoriesDto } from '@/dtos/INewsCategories.dto';
import { CategoryNewsDto } from './CategoryNews.dto';

export class NewsDto extends BaseDto {
  name?: string;
  title?: string;
  description?: string;
  content?: string;
  /**
   * Tiêu đề đã được BE móc sẵn từ <h1> của `content`
   * (be: getMenu.usecase.ts). Payload menu không còn chở toàn văn `content`
   * nữa — nó chiếm 117 KB trong 391 KB chỉ để lấy ra một dòng tiêu đề.
   */
  titleText?: string;
  is_feature?: boolean;
  images?: ImageDetailDto[];
  slugs?: SlugDto;
  seo?: SeoDto;
  categories?: INewsCategoriesDto[];
  categories_news?: CategoryNewsDto
}
