import { BaseDto } from '@/dtos/Base.dto';
import { ProductDto } from '@/dtos/Product.dto';
import { CategoryDto } from '@/dtos/Category.dto';

export class IBrandCategoryDto extends BaseDto {
  brand_id?: number;
  category_id?: number;
  product?: ProductDto;
  category?: CategoryDto;
}
