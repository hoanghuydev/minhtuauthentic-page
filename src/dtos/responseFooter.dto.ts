import { STATIC_CONTENT_TYPE } from '@/config/enum';
import { StaticContentsDto } from '@/dtos/StaticContents.dto';

export class ResponseFooterDto {
  footer?: StaticContentsDto[];
  'footer-logo-payment'?: StaticContentsDto[];
  'footer-logo-social'?: StaticContentsDto[];

}
