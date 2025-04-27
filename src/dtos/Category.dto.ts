import { BaseDto } from '@/dtos/Base.dto';
import { StaticComponentDto } from '@/dtos/StaticComponent.dto';
import { IProductCategoryDto } from '@/dtos/IProductCategory.dto';
import { ImageDetailDto } from '@/dtos/ImageDetail.dto';
import { SlugDto } from '@/dtos/Slug.dto';
import { SeoDto } from '@/dtos/Seo.dto';

export class CategoryDto extends BaseDto {
  name?: string;
  is_feature?: boolean;
  static_components?: StaticComponentDto[];
  products?: IProductCategoryDto[];
  images?: ImageDetailDto[];
  parent_id?: number;
  parent?: CategoryDto;
  children?: CategoryDto[];
  slugs?: SlugDto;
  seo?: SeoDto;
}
