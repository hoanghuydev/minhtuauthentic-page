import { ProductDto } from '@/dtos/Product.dto';
import { ProductFilterOptionDto } from '@/dtos/ProductFilterSettingOption/ProductFilterOption.dto';
import { CategoryDto } from '@/dtos/Category.dto';
import { BrandDto } from '@/dtos/Brand.dto';
import KeywordsDto from '@/dtos/Keywords.dto';

export class ResponseCategoryFilterPageDto {
  products?: ProductDto[];
  total?: number;
  settings?: ProductFilterOptionDto;
  category?: CategoryDto;
  brand?: BrandDto;
  keyword?: KeywordsDto;
  title?: string;
}
