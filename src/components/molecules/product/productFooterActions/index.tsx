import CartPlus from '@/components/icons/cart-plus';
import OrderContext from '@/contexts/orderContext';
import AppContext from '@/contexts/appContext';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PhoneOutlined } from '@ant-design/icons';
import { isNull } from 'util';

export default function ProductFooterActions() {
  const router = useRouter();
  const orderCtx = useContext(OrderContext);
  const appContext = useContext(AppContext);
  const [indexCart, setIndexCart] = useState<number | null>(null);

  // Use the variant from AppContext.currentVariant for global access
  const variant = appContext?.currentVariant;
  const isOutOfStock = !variant?.is_in_stock;
  useEffect(() => {
    if (!variant?.id) return;

    const index = (orderCtx?.cart?.items || [])?.findIndex(
      (item) => item.variant_id === variant?.id,
    );

    if (index !== -1) {
      setIndexCart(index);
    } else {
      setIndexCart(null);
    }
  }, [orderCtx?.cart, variant?.id]);

  const handleAddToCart = () => {
    if (!variant || isOutOfStock) return;

    if (indexCart !== null && indexCart > -1) {
      // If item is already in cart, update quantity (default to 1)
      orderCtx?.updateCart && orderCtx.updateCart(indexCart, 1);
    } else {
      // If item is not in cart, add it
      orderCtx?.addCart && orderCtx.addCart(variant, 1);
    }
  };

  const handleOutOfStockClick = () => {
    // Optional: Show toast or handle out of stock click
    console.log('Product is out of stock');
  };

  return (
    <div className={'flex items-center justify-between gap-2 w-full'}>
      <button
        className={
          'flex flex-col items-center border-primary border-[1px] flex-1 rounded-lg justify-center py-[4px] px-1 flex-1'
        }
        type={'button'}
        onClick={() => {
          router.push('tel:0961693869');
        }}
      >
        <span className={'text-primary'}>
          <PhoneOutlined className={'text-xl'} />
        </span>
        <span className={'text-primary text-xs'}>Gọi ngay</span>
      </button>

      {isOutOfStock ? (
        <button
          className={
            'flex flex-col items-center flex-2 bg-gray-400 rounded-lg justify-center py-2 px-1 flex-1 opacity-60'
          }
          type={'button'}
          onClick={handleOutOfStockClick}
        >
          <span className={'text-white font-bold text-sm'}>Tạm hết hàng</span>
          <span className={'text-white text-xs'}>Giao hàng tận nơi</span>
        </button>
      ) : (
        <>
          <button
            className={
              'flex flex-col items-center flex-2 bg-[#417aff] rounded-lg justify-center py-2 px-1 flex-1'
            }
            type={'button'}
            onClick={handleAddToCart}
          >
            <span className={'text-white'}>
              <CartPlus className={'w-5 h-5'} />
            </span>
            <span className={'text-white text-xs'}>Thêm giỏ hàng</span>
          </button>

          <button
            className={
              'flex flex-col items-center flex-2 bg-[#c52927] rounded-lg justify-center py-2 px-1 flex-1'
            }
            type={'button'}
            onClick={() => {
              handleAddToCart();
              router.push('/gio-hang/tom-tat');
            }}
          >
            <span className={'text-white font-bold text-sm'}>Mua ngay</span>
            <span className={'text-white text-xs'}>Giao hàng tận nơi</span>
          </button>
        </>
      )}
    </div>
  );
}
