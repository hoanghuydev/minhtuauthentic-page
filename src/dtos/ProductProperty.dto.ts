import { BaseDto } from '@/dtos/Base.dto';
import { ProductDto } from '@/dtos/Product.dto';

export class ProductPropertyDto extends BaseDto {
  product_id?: number;
  sex?: number;
  year?: string;
  mixer?: string;
  fragrance_level?: string;
  style?: string;
  recommend?: string;
  origin?: string;
  fragrant?: string;
  description?: string;
  content?: string;
  product?: ProductDto;
}
