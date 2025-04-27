import { BaseDto } from '@/dtos/Base.dto';
import { ProductDto } from '@/dtos/Product.dto';
import { IBrandCategoryDto } from '@/dtos/IBrandCategory.dto';
import { SlugDto } from '@/dtos/Slug.dto';
import { ImageDetailDto } from '@/dtos/ImageDetail.dto';
import { SeoDto } from '@/dtos/Seo.dto';
import { StaticComponentDto } from '@/dtos/StaticComponent.dto';

export class BrandDto extends BaseDto {
  name?: string;
  products?: ProductDto[];
  categories?: IBrandCategoryDto[];
  slugs?: SlugDto;
  images?: ImageDetailDto[];
  seo?: SeoDto;
  static_components?: StaticComponentDto[];

  constructor(init?: Partial<BrandDto>) {
    super();
    Object.assign(this, init);
  }
}
