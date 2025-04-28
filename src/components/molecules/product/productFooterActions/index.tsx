import CartPlus from '@/components/icons/cart-plus';
import OrderContext from '@/contexts/orderContext';
import AppContext from '@/contexts/appContext';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import { PhoneOutlined } from '@ant-design/icons';

export default function ProductFooterActions() {
  const router = useRouter();
  const orderCtx = useContext(OrderContext);
  const appCtx = useContext(AppContext);

  // Use the variant directly from context
  const variant = appCtx?.currentVariant;

  const handleAddToCart = () => {
    if (!variant) return;

    // Check if variant is already in cart
    const existingItemIndex = (orderCtx?.cart?.items || []).findIndex(
      (item) => item.variant_id === variant.id,
    );

    if (existingItemIndex == -1) {
      orderCtx?.addCart && orderCtx.addCart(variant);
    }
  };

  return (
    <div className={'flex items-center justify-between gap-2 w-full'}>
      <button
        className={'flex flex-col items-center justify-center px-2 flex-1'}
        type={'button'}
        onClick={() => {
          router.push('tel:0961693869');
        }}
      >
        <span className={'text-white'}>
          <PhoneOutlined className={'text-xl'} />
        </span>
        <span className={'text-white text-xs'}>Gọi ngay</span>
      </button>

      <button
        className={'flex flex-col items-center justify-center px-2 flex-1'}
        type={'button'}
        onClick={handleAddToCart}
      >
        <span className={'text-white'}>
          <CartPlus className={'w-5 h-5'} />
        </span>
        <span className={'text-white text-xs'}>Thêm giỏ hàng</span>
      </button>

      <button
        className={'flex flex-col items-center justify-center px-2 flex-1'}
        type={'button'}
        onClick={() => {
          handleAddToCart();
          router.push('/gio-hang/tom-tat');
        }}
      >
        <span className={'text-white font-bold text-sm'}>Mua ngay</span>
        <span className={'text-white text-xs'}>Giao hàng tận nơi</span>
      </button>
    </div>
  );
}
