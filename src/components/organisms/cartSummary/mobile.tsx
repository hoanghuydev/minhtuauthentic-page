import { useContext } from 'react';
import OrderContext from '@/contexts/orderContext';
import { isMobile } from 'react-device-detect';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { formatMoney, generateSlugToHref } from '@/utils';
import Link from 'next/link';
import PriceWithLineThrough from '@/components/atoms/price/priceWithLineThrough';
import PriceMinus from '@/components/atoms/price/PriceMinus';
import { Button, InputNumber } from 'antd/es';
import { DeleteOutlined } from '@ant-design/icons';
import PriceInput from '@/components/atoms/price/priceInput';

export default function CartSummaryMobile() {
  const orderCtx = useContext(OrderContext);
  return (
    <>
      {isMobile && (
        <div className={'flex flex-col'}>
          {orderCtx?.cart?.items?.map((item, index) => {
            return (
              <div
                key={index}
                className={'p-3 border rounded-[10px] flex relative gap-1'}
              >
                <ImageWithFallback
                  className={'w-[100px] h-[100px] mx-auto bk-product-image'}
                  image={item?.image}
                  alt={item.variant_name}
                />
                <div className={'flex flex-col'}>
                  <Link
                    href={generateSlugToHref(item.slug)}
                    className={'text-primary font-semibold bk-product-name'}
                  >
                    {item.variant_name}
                  </Link>
                  {item?.variant_configurations?.map((config, index2) => {
                    return (
                      <p key={index2} className={'text-sm bk-product-property'}>
                        ({config.name}: {config.value})
                      </p>
                    );
                  })}
                  <div className={'text-right'}>
                    <PriceWithLineThrough
                      regularPrice={item.variant_regular_price}
                      price={item.variant_price}
                      isHaveBKPrice={true}
                    />
                    <PriceMinus item={item} className={'justify-end'} />
                  </div>
                  <div
                    className={'flex gap-3 justify-between items-center mt-3'}
                  >
                    <PriceInput qty={item.qty || 1} item={item} />
                    <input
                      type={'hidden'}
                      className={'hidden bk-product-qty'}
                      value={item.qty || 1}
                    />
                    <span className={'text-primary font-[700] lg:font-bold'}>
                      {formatMoney(item.price || 0, 0, '.', '.')}
                    </span>
                  </div>

                  <div className={'absolute top-0 right-0'}>
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      type={'link'}
                      onClick={() =>
                        orderCtx?.updateCart && orderCtx.updateCart(index, 0)
                      }
                    ></Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
