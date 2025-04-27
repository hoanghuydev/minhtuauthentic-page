import { BaseDto } from '@/dtos/Base.dto';
import { ProductDto } from '@/dtos/Product.dto';
import { BrandDto } from '@/dtos/Brand.dto';
import { NewsDto } from '@/dtos/News.dto';

export class SeoDto  extends BaseDto {
  model?: string;
  model_id?: number;
  title?: string;
  keyword?: string;
  description?: string;
  product?: ProductDto;
  brand?: BrandDto;
  news?: NewsDto;
}
