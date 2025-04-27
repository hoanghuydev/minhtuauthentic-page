import { BaseDto } from '@/dtos/Base.dto';
import { OrdersDto } from '@/dtos/Orders.dto';
import { OrderItemsDto } from '@/dtos/OrderItems.dto';
import CouponsDto from '@/dtos/Coupons.dto';
import { VariantDto } from '@/dtos/Variant.dto';

export class CouponDetailDto extends BaseDto {
  coupon_id?: number;
  model?: string;
  model_id?: number;
  type?: string;
  orders?: OrdersDto[];
  variant?: VariantDto;
  coupon?: CouponsDto;
}
