import { useContext, useEffect, useRef } from 'react';
import OrderContext from '@/contexts/orderContext';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { OrderItemsDto } from '@/dtos/OrderItems.dto';
import { InputNumber } from 'antd/es';
import { Button } from 'antd/es';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { formatMoney, generateSlugToHref } from '@/utils';
import Link from 'next/link';
import PriceOnCart from '@/components/atoms/price/priceOnCart';
import PriceInput from '@/components/atoms/price/priceInput';
import { useRouter } from 'next/router';

export default function CartPreview() {
  const order = useContext(OrderContext);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const onChange = (value: null | number, index: number) => {
    order?.updateCart && order.updateCart(index, value || 0);
  };

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        order?.setIsOpenHeaderCart && order.setIsOpenHeaderCart(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  return (
    <div className={'flex flex-col gap-3'} ref={ref}>
      {order?.cart?.items && order?.cart?.items?.length === 0 ? (
        <div className={'flex flex-col items-center text-center gap-3'}>
          <div className={'text-center text-lg font-semibold'}>
            Giỏ hàng trống
          </div>
          <Link href="/">
            <Button
              type="primary"
              icon={<ShoppingOutlined />}
              className="font-semibold"
            >
              Tiếp tục mua sắm
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {order?.cart?.items?.map((item: OrderItemsDto, key: number) => {
            return (
              <div
                className={'flex gap-2 w-[350px] border-b border-gray-200 pb-3'}
                key={key + '_' + item.variant_id}
              >
                <div className={'w-[80px] h-[80px] shrink-0 '}>
                  <ImageWithFallback
                    className={'w-[80px] h-[80px]'}
                    image={item?.image}
                  />
                </div>
                <div className={'flex flex-col gap-2 w-full'}>
                  <p className={'flex justify-between gap-2'}>
                    <Link
                      href={generateSlugToHref(item?.slug)}
                      className={
                        'text-primary text-[12px] text-left font-[700] lg:font-bold'
                      }
                    >
                      {item?.variant_name}
                    </Link>
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      type={'link'}
                      onClick={() =>
                        order?.updateCart && order.updateCart(key, 0)
                      }
                    ></Button>
                  </p>
                  {(item.variant_configurations || [])?.map((config, index) => {
                    return (
                      <p key={index} className={'text-[12px] text-left'}>
                        ({config.name}: {config.value})
                      </p>
                    );
                  })}
                  <div className={'flex justify-between items-center'}>
                    <PriceInput qty={item.qty || 1} item={item} />
                    <PriceOnCart item={item} isDisplayTotal={true} />
                  </div>
                </div>
              </div>
            );
          })}
          {order?.cart?.items?.length && order?.cart?.items?.length > 0 && (
            <>
              <p className={'flex justify-between items-center'}>
                <span className={'text-xl uppercase font-semibold'}>
                  Tổng cộng:{' '}
                </span>
                <span className={'font-semibold text-primary'}>
                  {formatMoney(order?.cart?.total_price || 0)}
                </span>
              </p>
              <Link
                className={
                  'block w-full p-2 text-lg font-semibold bg-primary text-white text-center rounded-[10px] shadow-custom cursor-pointer'
                }
                href={'/gio-hang/tom-tat'}
              >
                Xem giỏ hàng
              </Link>
              <Link
                className={
                  'block w-full p-2 text-lg font-semibold bg-primary text-white text-center rounded-[10px] shadow-custom cursor-pointer'
                }
                href={'/gio-hang/thanh-toan'}
              >
                Thanh toán
              </Link>
            </>
          )}
        </>
      )}
    </div>
  );
}
