import CouponsDto from '@/dtos/Coupons.dto';
import { formatMoney } from '@/utils';
import { PROMOTION_PRICE_TYPE } from '@/config/enum';
import { Button } from 'antd/es';
import { useState } from 'react';

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
    <div className="relative flex overflow-hidden my-2 border border-gray-200 rounded-lg shadow-sm">
      {/* Left side - coupon value */}
      <div className="flex flex-col justify-center items-center p-4 min-w-[100px] bg-primary text-white font-bold relative">
        <div className="absolute -right-2 top-0 bottom-0 flex items-center">
          <div className="flex flex-col">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-2 w-4 bg-white rounded-full my-0.5"
              ></div>
            ))}
          </div>
        </div>

        <p className="text-xl font-bold mb-1">
          {coupon?.price_minus_type === PROMOTION_PRICE_TYPE.PRICE ? (
            formatMoney(coupon.price_minus_value || 0)
          ) : (
            <span className="text-2xl">{coupon.price_minus_value}%</span>
          )}
        </p>
        <p className="text-xs uppercase">Giảm giá</p>
      </div>

      {/* Right side - coupon details */}
      <div className="flex-1 p-3 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-gray-800 mb-1">
            {coupon?.promotion?.name || 'Mã giảm giá'}
          </h3>
          {coupon?.promotion?.description && (
            <div
              className="text-sm text-gray-600 mb-3"
              dangerouslySetInnerHTML={{
                __html: coupon?.promotion?.description,
              }}
            />
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between border-t border-dashed border-gray-200 pt-2">
          <div className="flex flex-col items-center">
            <div className="font-medium text-primary mr-2">{coupon.code}</div>
            {!isForCopy && (
              <div className="text-xs flex whitespace-nowrap text-gray-500">
                HSD:{' '}
                {new Date(
                  coupon?.promotion?.end_date || '',
                ).toLocaleDateString()}
              </div>
            )}
          </div>

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
