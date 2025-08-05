import CartPlus from '@/components/icons/cart-plus';
import OrderContext from '@/contexts/orderContext';
import ProductDetailContext from '@/contexts/productDetailContext';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import { PhoneOutlined } from '@ant-design/icons';

export default function ProductFooterActions() {
  const router = useRouter();
  const orderCtx = useContext(OrderContext);
  const productDetailCtx = useContext(ProductDetailContext);

  // Use the variant from ProductDetailContext instead of AppContext
  const variant = productDetailCtx?.variantActive;
  const isOutOfStock = !variant?.is_in_stock;

  const handleAddToCart = () => {
    if (!variant || isOutOfStock) return;

    // Check if variant is already in cart
    const existingItemIndex = (orderCtx?.cart?.items || []).findIndex(
      (item) => item.variant_id === variant.id,
    );

    if (existingItemIndex == -1) {
      orderCtx?.addCart && orderCtx.addCart(variant);
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
