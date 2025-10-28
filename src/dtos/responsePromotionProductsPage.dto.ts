import { VariantDto } from '@/dtos/Variant.dto';
import { PromotionsDto } from '@/dtos/Promotions.dto';
import { ProductFilterOptionDto } from '@/dtos/ProductFilterSettingOption/ProductFilterOption.dto';

export class ResponsePromotionProductsPageDto {
  products?: VariantDto[];
  total?: number;
  settings?: ProductFilterOptionDto;
  promotion?: PromotionsDto;
  title?: string;
}
