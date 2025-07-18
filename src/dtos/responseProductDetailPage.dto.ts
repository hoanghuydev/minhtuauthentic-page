import { ProductDto } from '@/dtos/Product.dto';
import { ProductConfigurationsDto } from '@/dtos/productConfigurations.dto';
import { SettingsDto } from '@/dtos/Settings.dto';
import { PromotionsDto } from '@/dtos/Promotions.dto';
import { VariantDto } from '@/dtos/Variant.dto';
import { StaticContentsDto } from '@/dtos/StaticContents.dto';

export class ResponseProductDetailPageDto {
  product?: ProductDto;
  relatedProducts?: ProductDto[];
  productConfigurations?: ProductConfigurationsDto[];
  promotionsProducts?: PromotionsDto;
  settings?: SettingsDto[];
  settingsHome?: SettingsDto[];
  variantActive?: VariantDto;
  homeSupport?: StaticContentsDto[];
}
