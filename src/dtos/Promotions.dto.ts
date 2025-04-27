import { BaseDto } from '@/dtos/Base.dto';
import { ImageDetailDto } from '@/dtos/ImageDetail.dto';
import CouponsDto from '@/dtos/Coupons.dto';

export class PromotionsDto extends BaseDto {
  name?: string;
  type?: string;
  condition_syntax?: string;
  condition_value?: string;
  start_date?: Date;
  end_date?: Date;
  estimate_price_minus_type?: string;
  estimate_price_minus_value?: number;
  is_system?: boolean;
  coupons?: CouponsDto[];
  images?: ImageDetailDto[];
  description?: string;
}
