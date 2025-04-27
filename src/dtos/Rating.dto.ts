import { ProductDto } from '@/dtos/Product.dto';

export default class RatingDto {
  name?: string;
  is_approve?: boolean;
  phone?: string;
  point?: number;
  parent_id?: number;
  content?: string;
  parent?: RatingDto;
  children?: RatingDto[];
  product_id?: number;
  product?: ProductDto;
  created_at?: Date;
  updated_at?: Date;
}
