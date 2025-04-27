import { ProductDto } from '@/dtos/Product.dto';
import { ProductConfigurationsDto } from '@/dtos/productConfigurations.dto';
import { SettingsDto } from '@/dtos/Settings.dto';
import { PromotionsDto } from '@/dtos/Promotions.dto';
import { VariantDto } from '@/dtos/Variant.dto';

export class ResponseProductDetailPageDto {
  product?: ProductDto;
  relatedProducts?: ProductDto[];
  productConfigurations?: ProductConfigurationsDto[];
  promotionsProducts?: PromotionsDto;
  settings?: SettingsDto[];
  variantActive?: VariantDto;
}
