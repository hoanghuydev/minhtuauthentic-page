import { formatMoney } from '@/utils';
import { OrderItemsDto } from '@/dtos/OrderItems.dto';
import PriceMinus from '@/components/atoms/price/PriceMinus';
type Props = {
  item: OrderItemsDto;
  isDisplayTotal?: boolean;
};
export const PriceOnCart = ({ item, isDisplayTotal }: Props) => {
  return (
    <div className={'flex flex-col gap-1'}>
      {(item?.coupons?.length || 0) > 0 && (
        <span className={'text-red-600 font-semibold text-sm text-right'}>
          {formatMoney(
            (item?.variant_regular_price || 0) * (item?.qty || 0),
            0,
            '.',
            '.',
          )}
        </span>
      )}

      <PriceMinus item={item} />

      {isDisplayTotal && (
        <span className={'text-red-600 font-semibold text-right'}>
          {formatMoney(item?.price || 0, 0, '.', '.')}
        </span>
      )}
    </div>
  );
};
export default PriceOnCart;
