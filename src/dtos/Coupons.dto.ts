import { PromotionsDto } from '@/dtos/Promotions.dto';
import { BaseDto } from '@/dtos/Base.dto';
import { CouponDetailDto } from '@/dtos/CouponDetail.dto';

export default class CouponsDto extends BaseDto {
  code?: string;
  promotion_id?: number;
  promotion?: PromotionsDto;
  price_minus_type?: string;
  price_minus_value?: number;
  max_redemption?: number;
  total_redemption?: number;
  coupon_details?: CouponDetailDto[];
}
