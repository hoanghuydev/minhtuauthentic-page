import { OrdersDto } from '@/dtos/Orders.dto';
import { BaseDto } from '@/dtos/Base.dto';
import { ImageDetailDto } from '@/dtos/ImageDetail.dto';

export class PaymentsDto extends BaseDto {
  name?: string;
  label?: string;
  type?: number;
  description?: string;
  orders?: OrdersDto[];
  images?: ImageDetailDto[];
}
