import { ImageDetailDto } from '@/dtos/ImageDetail.dto';
import { SlugDto } from '@/dtos/Slug.dto';
import { BaseDto } from '@/dtos/Base.dto';
import { SeoDto } from '@/dtos/Seo.dto';
import { INewsCategoriesDto } from '@/dtos/INewsCategories.dto';

export class NewsDto extends BaseDto {
  name?: string;
  title?: string;
  description?: string;
  content?: string;
  is_feature?: boolean;
  images?: ImageDetailDto[];
  slugs?: SlugDto;
  seo?: SeoDto;
  categories?: INewsCategoriesDto[];
}
