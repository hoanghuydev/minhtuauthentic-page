import CouponsDto from '@/dtos/Coupons.dto';
import { OrderItemsDto } from '@/dtos/OrderItems.dto';

export default class CartDto {
  coupons?: CouponsDto[];
  items?: OrderItemsDto[];
  total_price?: number;
  price_minus?: number;
  shipping_fee?: number;
}
