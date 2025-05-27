import { useContext, useEffect, useState } from 'react';
import OrderContext from '@/contexts/orderContext';
import { formatMoney } from '@/utils';
import CheckItemCart from '@/components/organisms/checkout/itemCart';
import CouponsDto from '@/dtos/Coupons.dto';
import ItemCoupon from '@/components/atoms/coupons';
import { Button, Input, Tag } from 'antd/es';
import { PAYMENT, PAYMENT_TYPE_ID } from '@/config/enum';
import PaymentButton from '@/components/molecules/paymentButton';
import ArrowLeftOutlined from '@ant-design/icons/lib/icons/ArrowLeftOutlined';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const FooterCheckout = dynamic(
  () => import('@/components/organisms/checkout/footerCheckout'),
  {
    ssr: false,
  },
);

type Props = {
  paymentType?: string;
  setValue?: any;
};
export default function ListCart({ paymentType, setValue }: Props) {
  const order = useContext(OrderContext);
  const [couponInput, setCouponInput] = useState<string>('');
  const [coupons, setCoupons] = useState<CouponsDto[]>([]);
  useEffect(() => {
    fetchCoupon().catch();
  }, []);

  const fetchCoupon = async () => {
    return fetch(`/api/coupons`)
      .then((response) => response.json())
      .then((data: { data: CouponsDto[] }) => {
        setCoupons(data?.data || []);
      })
      .catch((error) => {});
  };
  const applyCoupon = (code: string) => {
    order?.applyCoupon && order.applyCoupon(code);
  };
  const onChange = (value: null | number, index: number) => {
    order?.updateCart && order.updateCart(index, value || 0);
  };

  const RenderButton = ({ type }: { type: number }) => {
    if (type === 2) {
      return (
        <button
          type={'submit'}
          className={
            'flex-1 flex flex-col gap-1 text-center bg-[#f1eb1f] text-[#235d97] p-3 text-center rounded-[10px]'
          }
          onClick={() => {
            setValue('payment_type_id', PAYMENT_TYPE_ID.TRA_GOP_BAO_KIM);
          }}
        >
          <span
            className={'font-extrabold uppercase text-2xl text-center mx-auto'}
          >
            Mua ngay - Trả sau
          </span>
          <span className={'flex items-center justify-center m-auto'}>
            <img
              src="https://pc.baokim.vn/platform/img/home-paylater-ngang-small.svg"
              alt="Minh tu authentic"
              className={'ml-[5px] h-[20px]'}
            />
            <img
              src="https://pc.baokim.vn/platform/img/icon-muadee.svg"
              alt="Minh tu authentic"
              className={'ml-[5px] h-[20px]'}
            />
          </span>
        </button>
      );
    } else if (type === 3) {
      return (
        <button
          type={'submit'}
          className={
            'flex-1 flex flex-col gap-1 text-center bg-[#288ad6] text-white p-3 text-center rounded-[10px]'
          }
          onClick={() => {
            setValue(
              'payment_type_id',
              PAYMENT_TYPE_ID.TRA_GOP_BAO_KIM_CREDIT_CARD,
            );
          }}
        >
          <span
            className={'font-extrabold uppercase text-2xl text-center mx-auto'}
          >
            Trả góp qua thẻ
          </span>
          <span className={'flex items-center justify-center m-auto'}>
            Visa, MasterCard, JCB
          </span>
        </button>
      );
    }
    return (
      <button
        type={'submit'}
        className={' bg-primary text-white'}
        onClick={() => {
          setValue('payment_type_id', undefined);
        }}
      >
        <span
          className={'font-extrabold uppercase text-2xl text-center mx-auto'}
        >
          Thanh toán
        </span>
        <span className={'mx-auto'}>(Qua ATM, QR Code, Thẻ ngân hàng ...)</span>
      </button>
    );
  };

  return (
    <>
      <div className={'border-l border-gray-200 px-3 flex-1'}>
        <h3 className={'text-3xl font-[700] lg:font-bold'}>
          Thông tin giỏ hàng
        </h3>
        <div className={'flex flex-col gap-3 border-b border-gray-200 p-6'}>
          {order?.cart?.items?.map((item, key) => (
            <CheckItemCart
              key={key}
              item={item}
              onChange={(value) => onChange(value, key)}
            />
          ))}
        </div>
        <div className={'flex py-6 gap-3 border-b border-gray-200'}>
          <Input
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            placeholder={'Nhập mã giảm giá'}
          />
          <Button
            htmlType={'button'}
            type={'primary'}
            onClick={() => {
              applyCoupon(couponInput);
              setCouponInput('');
            }}
          >
            Áp dụng
          </Button>
        </div>
        {order?.cart?.coupons && order?.cart?.coupons?.length > 0 && (
          <div className={'flex gap-3 border-b border-gray-200 py-6'}>
            {order?.cart?.coupons?.map((coupon, key) => (
              <Tag
                key={key}
                closable
                className="h-[35px] flex items-center justify-center"
                onClick={() => {
                  order?.removeCoupon &&
                    coupon.code &&
                    order.removeCoupon(coupon.code);
                }}
              >
                {coupon?.code?.toUpperCase()}
              </Tag>
            ))}
          </div>
        )}

        <div
          className={'mt-3 border-b border-gray-200 py-3 flex flex-col gap-3'}
        >
          <div className={'font-semibold flex justify-between items-center'}>
            <span>Tạm tính:</span>
            <span className={'text-red-600'}>
              {formatMoney(
                order?.cart?.items?.reduce(
                  (total, item) => total + (item.price || 0),
                  0,
                ) || 0,
              )}
            </span>
          </div>
          {order?.cart?.coupons?.[0] && (
            <div className={'font-semibold flex justify-between items-center'}>
              <span>Mã giảm giá:</span>
              <span className={'text-red-600'}>
                {order?.cart?.coupons?.[0]?.code}
              </span>
            </div>
          )}
          {(order?.cart?.price_minus || 0) > 0 && (
            <div className={'font-semibold flex justify-between items-center'}>
              <span>Số tiền giảm:</span>
              <span className={'text-red-600'}>
                {order?.cart?.price_minus &&
                  formatMoney(order?.cart?.price_minus || 0)}
              </span>
            </div>
          )}
          <div className={'font-semibold flex justify-between items-center'}>
            <span>Phí vận chuyển:</span>
            <span className={'text-red-600'}>0</span>
          </div>
          <div
            className={
              'text-xl font-semibold flex justify-between items-center'
            }
          >
            <span>Tổng tiền:</span>
            <span className={'text-red-600'}>
              {formatMoney(order?.cart?.total_price || 0)}
            </span>
          </div>
        </div>
        {coupons && coupons.length > 0 && (
          <div className={'w-full  my-3 grid grid-cols-1 lg:grid-cols-2 gap-3'}>
            {coupons?.map((coupon, index) => {
              const isApplied = order?.cart?.coupons?.some(
                (appliedCoupon) => appliedCoupon.code === coupon.code,
              );
              return (
                <div className={'bg-transparent'} key={index}>
                  <ItemCoupon
                    coupon={coupon}
                    onClick={() => {
                      coupon?.code && applyCoupon(coupon.code || '');
                    }}
                    isClick={isApplied}
                  />
                </div>
              );
            })}
          </div>
        )}
        <div className={'flex flex-col gap-3'}>
          <PaymentButton
            onClick={() => {
              setValue('payment_type_id', undefined);
            }}
            type={paymentType}
            htmlType={'submit'}
          />
        </div>
        <div className={'flex justify-between items-center mt-6'}>
          <div className={'flex text-primary gap-1'}>
            <ArrowLeftOutlined />
            <Link className={'font-semibold'} href={'/gio-hang/tom-tat'}>
              Quay lại giỏ hàng
            </Link>
            <span> | </span>
            <Link className={'font-semibold'} href={'/'}>
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
      <FooterCheckout setValue={setValue} paymentType={paymentType} />
    </>
  );
}
