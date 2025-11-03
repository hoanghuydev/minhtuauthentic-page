import CartInput from '@/components/atoms/cartInput';
import CartPlus from '@/components/icons/cart-plus';
import OrderContext from '@/contexts/orderContext';
import { useContext, useEffect, useState } from 'react';
import { VariantDto } from '@/dtos/Variant.dto';
import { useRouter } from 'next/router';
import { PAYMENT_TYPE_ID } from '@/config/enum';
import PaymentButton from '@/components/molecules/paymentButton';
import { toast } from 'react-toastify';
import AppContext from '@/contexts/appContext';
import AuthRequireModal from '@/components/organisms/modal/AuthRequireModal';
type Props = {
  variant?: VariantDto;
  isQuickView?: boolean;
  setQuickViewModal?: (isOpen: boolean) => void;
};
export default function ProductCartCheckout({ variant, isQuickView, setQuickViewModal }: Props) {
  const router = useRouter();
  const orderCtx = useContext(OrderContext);
  const appCtx = useContext(AppContext);
  const [qty, setQty] = useState(1);
  const [indexCart, setIndexCart] = useState<number | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const isOutOfStock = !variant?.is_in_stock;

  useEffect(() => {
    if (!variant?.id) return;

    const index = (orderCtx?.cart?.items || [])?.findIndex(
      (item) => item.variant_id === variant?.id,
    );

    if (index !== -1) {
      setIndexCart(index);
      // Nếu sản phẩm đã có trong giỏ hàng, hiển thị số lượng hiện tại
      const currentQty = orderCtx?.cart?.items?.[index]?.qty || 1;
      setQty(currentQty);
    } else {
      setIndexCart(null);
    }
  }, [orderCtx?.cart, variant?.id]);

  const handleAddToCart = () => {
    if (!variant || isOutOfStock) return;

    if (indexCart !== null && indexCart > -1) {
      orderCtx?.updateCart && orderCtx.updateCart(indexCart, qty);
    } else {
      orderCtx?.addCart && orderCtx.addCart(variant, qty);
    }
    setQuickViewModal && setQuickViewModal(false);
  };

  const handleBuyNow = () => {
    if (!variant || isOutOfStock) return;
    
    // Check if user is logged in
    if (!appCtx?.user) {
      setShowAuthModal(true);
      return;
    }

    // If user is logged in, proceed with normal flow
    handleAddToCart();
    router.push('/gio-hang/tom-tat');
  };

  const handleOutOfStockClick = () => {
    // Optional: Show toast or handle out of stock click
    console.log('Product is out of stock');
  };

  return (
    <>
      <div className={`flex justify-between gap-3 mb-3 ${isQuickView ? 'flex-col' : ''}`}>
        <CartInput
          className={'w-[100px] min-h-[40px]'}
          value={qty}
          onChange={(value) => {
            setQty(value);
          }}
        />
        <div className="flex-1 flex justify-between gap-3">
          {isOutOfStock ? (
            <button
              className={
                'flex flex-col bg-gray-400 items-center justify-center p-[4px_10px] rounded-[10px] grow text-[12px] opacity-60'
              }
              type={'button'}
              onClick={handleOutOfStockClick}
            >
              <span
                className={'text-white text-xl font-[700] lg:font-bold uppercase'}
              >
                Tạm hết hàng
              </span>
              <span className={'text-white'}>
                Giao Tận Nơi hoặc Nhận Tại Cửa Hàng
              </span>
            </button>
          ) : (
            <>
              <button
                className={
                  'flex flex-col bg-[#c52927] items-center justify-center p-[4px_10px] rounded-[10px] grow text-[12px]'
                }
                type={'button'}
                onClick={handleBuyNow}
              >
                <span
                  className={'text-white text-xl font-[700] lg:font-bold uppercase'}
                >
                  Mua ngay
                </span>
                <span className={'text-white'}>
                  Giao Tận Nơi hoặc Nhận Tại Cửa Hàng
                </span>
              </button>
              <button
                className={
                  'flex flex-col border border-primary items-center justify-center  p-[4px_10px] rounded-[10px] w-[100px] text-[12px]'
                }
                type={'button'}
                onClick={() => {
                  handleAddToCart();
                }}
              >
                <span>
                  <CartPlus className={'w-6 h-6 text-primary'} />
                </span>
                <span className={'text-primary '}>Thêm vào giỏ</span>
              </button>
            </>
          )}
        </div>
      </div>
      <div id="script-general-container"></div>
      <div className="bk-btn"></div>
      {/*<div className={'grid grid-cols-1 lg:grid-cols-2 gap-3'}>*/}
      {/*<PaymentButton*/}
      {/*  onClick={() => {*/}
      {/*    handleAddToCart();*/}
      {/*    router.push('/gio-hang/thanh-toan');*/}
      {/*  }}*/}
      {/*  htmlType={'button'}*/}
      {/*  type={3}*/}
      {/*/>*/}
      {/*<PaymentButton*/}
      {/*  onClick={() => {*/}
      {/*    handleAddToCart();*/}
      {/*    router.push('/gio-hang/thanh-toan');*/}
      {/*  }}*/}
      {/*  htmlType={'button'}*/}
      {/*  type={2}*/}
      {/*/>*/}
      {/*</div>*/}
      
      <AuthRequireModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        redirectUrl={router.asPath}
      />
    </>
  );
}
