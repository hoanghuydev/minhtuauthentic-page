import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import { ProductFilterOptionDto } from './ProductFilterSettingOption/ProductFilterOption.dto';

export class ResponseStaticContentDetailDto {
  staticContent?: StaticContentsDto;
  title?: string;
  total?: number;
  settings?: ProductFilterOptionDto;
}
