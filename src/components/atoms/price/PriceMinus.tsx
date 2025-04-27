import { formatMoney, promotionName } from '@/utils';
import { Button, Tooltip } from 'antd/es';
import CouponsDto from '@/dtos/Coupons.dto';
import { OrderItemsDto } from '@/dtos/OrderItems.dto';
import CloseCircleOutlined from '@ant-design/icons/lib/icons/CloseCircleOutlined';
import { useContext } from 'react';
import OrderContext from '@/contexts/orderContext';
import { twMerge } from 'tailwind-merge';

type Props = {
  item: OrderItemsDto;
  isDisplayTotal?: boolean;
  className?: string;
};

export default function PriceMinus({ item, className }: Props) {
  const orderCtx = useContext(OrderContext);
  return (
    <>
      {(item?.coupons || []).map((coupon: CouponsDto, index: number) => {
        return (
          <Tooltip
            key={index}
            placement="topRight"
            title={
              coupon?.promotion?.name || coupon?.promotion?.is_system
                ? promotionName(coupon.promotion)
                : 'Mã giảm giá: ' + coupon.code
            }
          >
            <div
              className={twMerge(
                'flex items-center gap-1 justify-end',
                className,
              )}
            >
              <span
                className={'text-red-600 text-sm text-right cursor-pointer'}
              >
                -{formatMoney(item.price_minus || 0)}
              </span>
              {!coupon.promotion?.is_system && coupon.code && (
                <Button
                  size="small"
                  onClick={() => {
                    orderCtx?.removeCoupon &&
                      orderCtx.removeCoupon(
                        coupon.code || '',
                        item.variant_id || 0,
                      );
                  }}
                  icon={<CloseCircleOutlined />}
                />
              )}
            </div>
          </Tooltip>
        );
      })}
    </>
  );
}
