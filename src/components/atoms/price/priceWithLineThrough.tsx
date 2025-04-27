import { twMerge } from 'tailwind-merge';
import { calculatePriceMinus, formatMoney, getPriceWithCoupon } from '@/utils';
import CouponsDto from '@/dtos/Coupons.dto';

export default function PriceWithLineThrough({
  regularPrice,
  price,
  classNameRegularPrice,
  classNamePrice,
  coupons,
  isHaveBKPrice,
}: {
  regularPrice?: number;
  price?: number;
  classNameRegularPrice?: string;
  classNamePrice?: string;
  coupons?: CouponsDto[];
  isHaveBKPrice?: boolean;
}) {
  return (
    <>
      {isHaveBKPrice && (
        <span className={'bk-product-price hidden'}>{regularPrice}</span>
      )}
      <span
        className={twMerge(
          'text-[16px] lg:text-[18px] font-[700] lg:font-bold text-price mr-1 lg:mr-2',
          classNameRegularPrice,
        )}
      >
        {regularPrice && formatMoney(regularPrice, 0, '.', '.')}
      </span>
      <span
        className={twMerge('text-textSecondary line-through max-lg:text-[12px]', classNamePrice)}
      >
        {price && formatMoney(price, 0, '.', '.')}
      </span>
    </>
  );
}
