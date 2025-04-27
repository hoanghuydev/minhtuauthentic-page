import { BaseDto } from '@/dtos/Base.dto';
import { VariantDto } from '@/dtos/Variant.dto';
import { OrdersDto } from '@/dtos/Orders.dto';
import { CouponDetailDto } from '@/dtos/CouponDetail.dto';
import { ImageDto } from '@/dtos/Image.dto';
import CouponsDto from '@/dtos/Coupons.dto';

export class OrderItemsDto extends BaseDto {
  type?: string;
  variant_price?: number;
  variant_regular_price?: number;
  variant_name?: string;
  price_minus?: number;
  price?: number;
  variant_id?: number;
  order_id?: number;
  note?: string;
  qty?: number;
  variant_total_price?: number;
  variant?: VariantDto;
  order?: OrdersDto;
  coupons?: CouponsDto[];
  coupon_details?: CouponDetailDto[];
  image?: ImageDto;
  slug?: string;
  variant_configurations?: Record<string, string>[];
  constructor(init?: Partial<OrderItemsDto>) {
    super();
    Object.assign(this, init);
  }
}
