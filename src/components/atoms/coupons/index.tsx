import CouponsDto from '@/dtos/Coupons.dto';
import { formatMoney } from '@/utils';
import { PROMOTION_PRICE_TYPE } from '@/config/enum';
import { Button } from 'antd/es';

type Props = {
  coupon: CouponsDto;
  onClick?: () => void;
  isClick?: boolean;
  isForCopy?: boolean;
};

export default function ItemCoupon({
  coupon,
  onClick,
  isClick,
  isForCopy,
}: Props) {
  return (
    <div className="relative flex overflow-hidden my-2 bg-[#eeeeeea1] rounded-lg ">
      {/* Left side - COUPON text vertical */}
      <div className="relative flex items-center justify-center w-[40px] text-[#dd3333]">
        <div className="rotate-[-90deg] tracking-wider font-bold">COUPON</div>
        {/* Vertical dashed line */}
        <div className="absolute right-0 top-[15%] bottom-[15%] border-r border-dashed border-gray-300"></div>
      </div>

      {/* White circles for separation */}
      <div className="absolute left-[40px] top-1/2 transform -translate-y-1/2 -translate-x-1/2 h-[calc(100%+21px)] flex justify-between flex-col">
        <div className="w-6 h-6 bg-white rounded-full mb-2"></div>
        <div className="w-6 h-6 bg-white rounded-full"></div>
      </div>

      {/* Right side - coupon details */}
      <div className="flex-1 p-4 pl-8">
        <div>
          <h3 className="font-bold text-lg text-gray-800 mb-1">
            {'MÃ GIẢM ' +
              (coupon?.price_minus_type === PROMOTION_PRICE_TYPE.PRICE
                ? formatMoney(coupon.price_minus_value || 0)
                : `${coupon.price_minus_value}%`)}
          </h3>
          <p className="text-gray-600 mb-2">
            {coupon?.promotion?.description && (
              <span
                dangerouslySetInnerHTML={{
                  __html: coupon?.promotion?.description,
                }}
              />
            )}
          </p>
          <div className="my-2 w-[100%] border-b border-dashed border-gray-300"></div>
        </div>

        <div className="mt-3 flex justify-between">
          {coupon?.promotion?.end_date && (
            <div className="flex flex-col gap-2">
              <div className="text-sm text-gray-500 font-bold">
                {coupon.code}
              </div>
              <div className="text-sm text-gray-500">
                HSD: {new Date(coupon.promotion.end_date).toLocaleDateString()}
              </div>
            </div>
          )}
          <Button
            type="primary"
            size="middle"
            onClick={() => {
              if (onClick) {
                onClick();
              }
              isForCopy && navigator.clipboard.writeText(coupon.code || '');
            }}
            className={`px-3 ${isClick ? 'bg-green-600' : ''}`}
          >
            {isClick && 'Đã '}
            {!isForCopy ? 'Áp dụng' : 'Sao chép'}
          </Button>
        </div>
      </div>
    </div>
  );
}
