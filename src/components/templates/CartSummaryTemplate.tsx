import { twMerge } from 'tailwind-merge';
import { useContext, useEffect } from 'react';
import OrderContext from '@/contexts/orderContext';
import { formatMoney } from '@/utils';
import Link from 'next/link';
import BreadcrumbComponent from '@/components/molecules/breakcrumb';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Button } from 'antd/es';
import ArrowLeftOutlined from '@ant-design/icons/lib/icons/ArrowLeftOutlined';

const CartSummaryDesktop = dynamic(
  () => import('@/components/organisms/cartSummary/desktop'),
  {
    ssr: false,
  },
);
const CartSummaryMobile = dynamic(
  () => import('@/components/organisms/cartSummary/mobile'),
  {
    ssr: false,
  },
);
const EmptyCart = dynamic(
  () => import('@/components/organisms/cart/EmptyCart'),
  {
    ssr: false,
  },
);
const CustomScript = dynamic(() => import('@/components/atoms/customScript'), {
  ssr: false,
});
export default function CartSummaryTemplate() {
  const orderCtx = useContext(OrderContext);
  const router = useRouter();

  const isCartEmpty =
    !orderCtx?.cart?.items || orderCtx.cart.items.length === 0;

  return (
    <>
      <BreadcrumbComponent label={'Giỏ hàng'} link={'/gio-hang/tom-tat'} />
      <div
        className={twMerge(
          'w-full rounded-[10px] shadow-custom bg-white overflow-hidden relative mx-auto p-3',
        )}
      >
        <div className="flex gap-3 items-center mb-3">
          <Button
            icon={<ArrowLeftOutlined style={{ fontSize: '16px' }} />}
            type="text"
            className="text-primary font-bold flex items-center"
            onClick={() => router.back()}
          ></Button>
          <h1 className={'text-4xl font-[700] lg:font-bold'}>Giỏ hàng</h1>
        </div>

        {isCartEmpty ? (
          <EmptyCart />
        ) : (
          <>
            <CartSummaryDesktop />
            <CartSummaryMobile />
            <div className={'w-full lg:w-[40%] lg:ml-auto max-w-full mt-6'}>
              <h4
                className={'text-2xl text-primary font-[700] lg:font-bold mb-3'}
              >
                Tổng giỏ hàng
              </h4>
              <table className={'w-full border border-gray-200'}>
                <tbody>
                  <tr>
                    <td className={'p-3 border-b text-red-600 border-gray-200'}>
                      Tạm tính
                    </td>
                    <td
                      className={
                        'text-right text-red-600 font-semibold p-3 border-b border-gray-200'
                      }
                    >
                      {formatMoney(
                        orderCtx?.cart?.total_price || 0,
                        0,
                        '.',
                        '.',
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className={'p-3'}>
                      <p className="text-red-600">Tổng tiền</p>
                      <p className={'text-sm italic'}>(Miễn phí vận chuyển)</p>
                    </td>
                    <td className={'text-right text-red-600 font-semibold p-3'}>
                      {formatMoney(
                        orderCtx?.cart?.total_price || 0,
                        0,
                        '.',
                        '.',
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              <Link
                href={'/gio-hang/thanh-toan'}
                className={
                  'block w-full p-3 text-xl font-semibold bg-primary text-white text-center rounded-[10px] shadow-custom cursor-pointer mt-3'
                }
              >
                Tiến hành thanh toán
              </Link>
              <div className="bk-btn cart-summary mt-3"></div>
            </div>
          </>
        )}
      </div>
      <CustomScript />
    </>
  );
}
