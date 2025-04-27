import { BaseDto } from '@/dtos/Base.dto';
import { ProductDto } from '@/dtos/Product.dto';

export class QuestionAnswerDto extends BaseDto {
  question?: string;
  answer?: string;
  product_id?: number;
  product?: ProductDto;
}
