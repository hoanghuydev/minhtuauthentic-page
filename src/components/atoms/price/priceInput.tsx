import { InputNumber } from 'antd';
import { useContext, useEffect, useState } from 'react';
import OrderContext from '@/contexts/orderContext';
import { OrderItemsDto } from '@/dtos/OrderItems.dto';
import { twMerge } from 'tailwind-merge';
import { useIsMobile } from '@/hooks/useDevice';
type Props = {
  qty: number;
  item: OrderItemsDto;
  className?: string;
};

export default function PriceInput({ qty, item, className }: Props) {
  const isMobile = useIsMobile();
  const orderCtx = useContext(OrderContext);
  const index =
    (orderCtx?.cart?.items || []).findIndex(
      (cartItem: OrderItemsDto) => cartItem.variant_id === item.variant_id,
    ) || 0;
  const [_qty, setQty] = useState(qty);

  useEffect(() => {
    const item = orderCtx?.cart?.items ? orderCtx?.cart?.items[index] : null;
    if (item) {
      setQty(item.qty || 1);
    }
  }, [orderCtx?.cart?.items]);

  return (
    <div className={`price-input-container flex items-center ${className}`}>
      {isMobile && (
        <button
          className="border-[1px] border-[#d9d9d9] border-r-0 rounded-l grid place-items-center w-[31.6px] h-[31.6px]"
          onClick={() => {
            if (_qty > 1) {
              setQty(_qty - 1);
              orderCtx?.updateCart && orderCtx.updateCart(index, _qty - 1);
            }
          }}
        >
          -
        </button>
      )}
      <InputNumber
        min={1}
        value={_qty}
        onChange={(value) => {
          if (value && value > 0) {
            setQty(value);
            orderCtx?.updateCart &&
              orderCtx.updateCart(index, Number(value) || 1);
          }
        }}
        className={twMerge(isMobile && 'rounded-none', 'flex-1', className)}
        controls={!isMobile}
      />
      {isMobile && (
        <button
          className="border-[1px] border-[#d9d9d9] border-l-0 rounded-r grid place-items-center w-[31.6px] h-[31.6px]"
          onClick={() => {
            setQty(_qty + 1);
            orderCtx?.updateCart && orderCtx.updateCart(index, _qty + 1);
          }}
        >
          +
        </button>
      )}
    </div>
  );
}
