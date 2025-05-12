import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { OrderItemsDto } from '@/dtos/OrderItems.dto';
import { VariantDto } from '@/dtos/Variant.dto';
import { toast } from 'react-toastify';
import { getPriceWithCoupon, variantName } from '@/utils';
import { usePathname } from 'next/navigation';
import CartDto from '@/dtos/Cart.dto';
import CouponsDto from '@/dtos/Coupons.dto';

// Toast configuration
const TOAST_CONFIG = {
  autoClose: 1000,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  toastId: 'cart-toast',
};

const OrderContext = createContext<TypeAppState | undefined>(undefined);
export type TypeAppState = {
  cart: CartDto | null;
  addCart: (variantDto: VariantDto) => void;
  updateCart: (index: number, qty?: number) => void;
  clearCart: () => void;
  applyCoupon: (couponCode: string, variant_id?: number) => Promise<boolean>;
  removeCoupon: (couponCode: string, variant_id?: number) => Promise<boolean>;
  isOpenHeaderCart?: boolean;
  setIsOpenHeaderCart?: Dispatch<SetStateAction<boolean>>;
};
export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const ref = useRef(pathname);
  const [cart, setCart] = useState<CartDto | null>(null);
  const [ready, setReady] = useState(false);
  const [isOpenHeaderCart, setIsOpenHeaderCart] = useState(false);
  useEffect(() => {
    const cart = localStorage.getItem('cart');
    const timeExpire = localStorage.getItem('cart_expired');
    const time = new Date().getTime();
    if (!timeExpire || time > parseInt(timeExpire)) {
      localStorage.removeItem('cart');
      localStorage.removeItem('cart_expired');
      setCart(null);
    } else {
      if (cart) {
        setCart(JSON.parse(cart));
        localStorage.setItem(
          'cart_expired',
          (time + 1000 * 60 * 60 * 24).toString(),
        );
      }
    }

    setReady(true);
  }, []);
  useEffect(() => {
    ready && localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (ref.current !== pathname) {
      setIsOpenHeaderCart(false);
    }
    ref.current = pathname;
  }, [pathname]);

  const callAddUpdateCart = async (variant_id: number, qty: number) => {
    return await fetch(`/api/orders/addToCart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        variant_id: variant_id,
        current_cart: cart,
        qty,
      }),
    })
      .then((res) => res.json())
      .catch(() => {
        return null;
      });
  };

  const addCart = async (variant: VariantDto) => {
    const timeExpire = localStorage.getItem('cart_expired');
    const time = new Date().getTime();
    if (!timeExpire) {
      localStorage.setItem(
        'cart_expired',
        (time + 1000 * 60 * 60 * 24).toString(),
      );
    }
    const currentVariantOnCart = cart?.items
      ? (cart?.items || []).find((item) => item.variant_id === variant.id)
      : null;
    if (!variant?.id) {
      toast('Variant không tồn tại', { ...TOAST_CONFIG, type: 'error' });
      return;
    }
    const newCartResponse = await callAddUpdateCart(
      variant.id,
      currentVariantOnCart?.qty ? currentVariantOnCart?.qty + 1 : 1,
    );
    if (!newCartResponse?.data) {
      toast(newCartResponse?.message || 'Không thể thêm vào giỏ hàng', {
        ...TOAST_CONFIG,
        type: 'error',
      });
      return;
    }
    setCart(newCartResponse?.data || []);
    toast('Đã thêm vào giỏ hàng', { ...TOAST_CONFIG, type: 'success' });
  };

  const updateCart = async (index: number, qty: number = 1) => {
    if (!cart?.items?.length) {
      return;
    }
    const orderItem = cart?.items?.[index];
    if (!orderItem?.variant_id) {
      toast('Variant không tồn tại', { ...TOAST_CONFIG, type: 'error' });
      return;
    }
    const newCartResponse = await callAddUpdateCart(orderItem.variant_id, qty);
    setCart(newCartResponse?.data || []);
    toast('Đã cập nhật giỏ hàng', { ...TOAST_CONFIG, type: 'success' });
  };

  const applyCoupon = async (
    couponCode: string,
    variant_id?: number,
  ): Promise<boolean> => {
    if (couponCode) {
      return fetch('/api/coupons/apply', {
        method: 'POST',
        body: JSON.stringify({
          code: couponCode,
          current_cart: cart || [],
          variant_id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data: { data: CartDto; message: string }) => {
          if (data?.data) {
            setCart(data?.data);
            return true;
          } else {
            if (data?.message) {
              toast.error(data?.message, TOAST_CONFIG);
            }
          }

          return false;
        })
        .catch((error) => {
          return false;
        });
    }
    return false;
  };

  const removeCoupon = async (couponCode: string, variant_id?: number) => {
    if (couponCode) {
      return fetch('/api/coupons/remove', {
        method: 'POST',
        body: JSON.stringify({
          code: couponCode,
          current_cart: cart || [],
          variant_id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data: { data: CartDto; message: string }) => {
          if (data?.data) {
            setCart(data?.data);
            return true;
          } else {
            if (data?.message) {
              toast.error(data?.message, TOAST_CONFIG);
            }
          }

          return false;
        })
        .catch((error) => {
          return false;
        });
    }
    return false;
  };
  const clearCart = () => {
    setCart(null);
  };

  return (
    <OrderContext.Provider
      value={{
        cart,
        addCart,
        updateCart,
        isOpenHeaderCart,
        setIsOpenHeaderCart,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
export default OrderContext;
