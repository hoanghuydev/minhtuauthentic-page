import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import { ProductFilterOptionDto } from './ProductFilterSettingOption/ProductFilterOption.dto';
import { VariantDto } from './Variant.dto';

export class ResponseStaticContentDetailDto {
  products?: VariantDto[];
  title?: string;
  total?: number;
  settings?: ProductFilterOptionDto;
  type?: string;
}
