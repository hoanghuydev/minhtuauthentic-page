import { ProductDto } from '@/dtos/Product.dto';
import KeywordsDto from '@/dtos/Keywords.dto';

export default class KeywordDetailDto {
  id?: number;
  keyword_id?: number;
  model?: string;
  model_id?: number;
  keyword?: KeywordsDto;
  product?: ProductDto;
  slugs?: any;
}
