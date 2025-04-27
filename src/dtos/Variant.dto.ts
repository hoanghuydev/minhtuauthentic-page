import { BaseDto } from '@/dtos/Base.dto';
import { ProductDto } from '@/dtos/Product.dto';
import { ImageDetailDto } from '@/dtos/ImageDetail.dto';
import { IVariantProductConfigurationValuesDto } from '@/dtos/iVariantProductConfigurationValues.dto';
import { ImageDto } from '@/dtos/Image.dto';
import CouponsDto from '@/dtos/Coupons.dto';
import { SlugDto } from '@/dtos/Slug.dto';

export class VariantDto extends BaseDto {
  product_id?: number;
  regular_price?: number;
  price?: number;
  is_default?: boolean;
  is_in_stock?: boolean;
  product?: ProductDto;
  image?: ImageDto;
  images?: ImageDetailDto[];
  variant_product_configuration_values?: IVariantProductConfigurationValuesDto[];
  coupons?: CouponsDto[];
  link?: string;

  constructor(init?: Partial<VariantDto>) {
    super();
    Object.assign(this, init);
  }
}
