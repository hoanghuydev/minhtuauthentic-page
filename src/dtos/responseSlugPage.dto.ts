import { ResponseProductDetailPageDto } from './responseProductDetailPage.dto';
import KeywordsDto from '@/dtos/Keywords.dto';

export class ResponseSlugPageDto<T> {
  slug?: string;
  model?: string;
  model_id?: number;
  type?: string;
  data?: T;
  keyword?: KeywordsDto
  constructor(init?: Partial<ResponseSlugPageDto<T>>) {
    Object.assign(this, init);
  }
}
