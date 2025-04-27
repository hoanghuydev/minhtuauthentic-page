import { twMerge } from 'tailwind-merge';
import { useContext, useEffect } from 'react';
import OrderContext from '@/contexts/orderContext';
import { formatMoney } from '@/utils';
import Link from 'next/link';
import BreadcrumbComponent from '@/components/molecules/breakcrumb';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
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
const CustomScript = dynamic(() => import('@/components/atoms/customScript'), {
  ssr: false,
});
export default function CartSummaryTemplate() {
  const orderCtx = useContext(OrderContext);
  const router = useRouter();

  return (
    <>
      <BreadcrumbComponent label={'Giỏ hàng'} link={'/gio-hang/tom-tat'} />
      <div
        className={twMerge(
          'w-full rounded-[10px] shadow-custom bg-white overflow-hidden relative mx-auto p-3',
        )}
      >
        <h1 className={'text-3xl font-[700] lg:font-bold mb-3'}>Giỏ hàng</h1>
        <CartSummaryDesktop />
        <CartSummaryMobile />
        <div className={'w-full lg:w-[40%] lg:ml-auto max-w-full mt-6'}>
          <h4 className={'text-2xl text-primary font-[700] lg:font-bold mb-3'}>
            Tổng giỏ hàng
          </h4>
          <table className={'w-full border border-gray-200'}>
            <tbody>
              <tr>
                <td className={'p-3 border-b border-gray-200'}>Tạm tính</td>
                <td
                  className={
                    'text-right text-primary font-semibold p-3 border-b border-gray-200'
                  }
                >
                  {formatMoney(orderCtx?.cart?.total_price || 0, 0, '.', '.')}
                </td>
              </tr>
              <tr>
                <td className={'p-3'}>
                  <p>Tổng tiền</p>
                  <p className={'text-sm italic'}>(Miễn phí vận chuyển)</p>
                </td>
                <td className={'text-right text-primary font-semibold p-3'}>
                  {formatMoney(orderCtx?.cart?.total_price || 0, 0, '.', '.')}
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
      </div>
      <CustomScript />
    </>
  );
}
