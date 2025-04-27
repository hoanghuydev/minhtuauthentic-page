import { BaseDto } from '@/dtos/Base.dto';
import { IProductCategoryDto } from '@/dtos/IProductCategory.dto';
import { IProductConcentrationGradientDto } from './IProductConcentrationGradient.dto';
import { IProductFragranceRetentionDto } from '@/dtos/IProductFragranceRetention.dto';
import { IProductBrandDto } from '@/dtos/IProductBrand.dto';
import { ImageDetailDto } from '@/dtos/ImageDetail.dto';
import { ProductPropertyDto } from '@/dtos/ProductProperty.dto';
import { SlugDto } from '@/dtos/Slug.dto';
import { VariantDto } from '@/dtos/Variant.dto';
import { SeoDto } from '@/dtos/Seo.dto';
import { ConcentrationGradientDto } from '@/dtos/ConcentrationGradient.dto';
import { FragranceRetentionDto } from '@/dtos/FragranceRetention.dto';
import { QuestionAnswerDto } from '@/dtos/QuestionAnswer.dto';
import KeywordDetailDto from '@/dtos/KeywordDetail.dto';
import RatingDto from '@/dtos/Rating.dto';

export class ProductDto extends BaseDto {
  name?: string;
  product_property_id?: number;
  is_feature?: boolean;
  is_in_stock?: boolean;
  feature_image?: number;
  feature_image_detail?: ImageDetailDto;
  categories?: IProductCategoryDto[];
  concentration_gradients?: IProductConcentrationGradientDto[];
  concentration_gradient?: ConcentrationGradientDto;
  fragrance_retentions?: IProductFragranceRetentionDto[];
  fragrance_retention?: FragranceRetentionDto;
  brands?: IProductBrandDto[];
  variants?: VariantDto[];
  product_property?: ProductPropertyDto;
  images?: ImageDetailDto[];
  slugs?: SlugDto;
  seo?: SeoDto;
  question_answers?: QuestionAnswerDto[];
  keywords?: KeywordDetailDto[];
  ratings?: RatingDto[];
  title?: string;
}
