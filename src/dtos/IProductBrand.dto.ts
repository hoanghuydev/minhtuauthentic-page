import { BaseDto } from '@/dtos/Base.dto';
import { ProductDto } from '@/dtos/Product.dto';
import { BrandDto } from '@/dtos/Brand.dto';

export class IProductBrandDto extends BaseDto {
  product_id?: number;
  brand_id?: number;
  product?: ProductDto;
  brand?: BrandDto;
}
