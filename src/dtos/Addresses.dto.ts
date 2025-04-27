import { BaseDto } from '@/dtos/Base.dto';
import { OrderStatus } from '@/config/enum';
import { UserDto } from '@/dtos/User.dto';
import { PaymentsDto } from '@/dtos/Payments.dto';
import { OrderItemsDto } from '@/dtos/OrderItems.dto';
import { CouponDetailDto } from '@/dtos/CouponDetail.dto';

export class AddressesDto extends BaseDto {
  title?: string;
  name?: string;
  user_id?: number;
  shipping_address?: string;
  city?: {
    code?: string;
    full_name?: string;
  };
  district?: {
    code?: string;
    full_name?: string;
  };
  ward?: {
    code?: string;
    full_name?: string;
  };
  shipping_price?: number;
  email?: string;
  phone?: string;
  user?: UserDto;
  is_default?: boolean;
}
