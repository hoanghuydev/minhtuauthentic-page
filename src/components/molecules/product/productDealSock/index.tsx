import { PromotionsDto } from '@/dtos/Promotions.dto';
import CouponsDto from '@/dtos/Coupons.dto';
import ProductCard from '@/components/organisms/product/card';
import SectionSwiper from '@/components/organisms/sectionSwiper';
import { ReactNode, useEffect, useState } from 'react';
import useSWR from 'swr';
import { PROMOTION_TYPE } from '@/config/enum';
import { SettingsDto } from '@/dtos/Settings.dto';
import { VariantDto } from '@/dtos/Variant.dto';

type Props = {
  setting?: SettingsDto;
};
const fetcher = () =>
  fetch('/api/promotions/' + PROMOTION_TYPE.DEAL_SOCK, {
    method: 'GET',
  }).then((res) => res.json());
export default function ProductDealSock({ setting }: Props) {
  const { data, error } = useSWR(
    '/api/promotions/' + PROMOTION_TYPE.DEAL_SOCK,
    fetcher,
  );

  const [promotion, setPromotion] = useState<PromotionsDto>();
  useEffect(() => {
    setPromotion(data?.data);
  }, [data]);
  return (
    <>
      {promotion && (
        <div
          style={{ backgroundColor: setting?.value?.backgroundColor }}
          className={
            'w-full shadow-custom bg-white my-1 lg:my-3 p-1 lg:p-3 max-lg:overflow-hidden'
          }
        >
          <p className={'text-2xl font-[700] lg:font-bold text-primary mb-3'}>
            MUA KÈM GIÁ SỐC
          </p>
          <SectionSwiper
            slidesPerView={5}
            slidePerViewMobile={2}
            spaceBetween={10}
            auto={true}
            loop={true}
            renderItem={(item: unknown) => {
              const iCoupon = item as CouponsDto;
              const variant = iCoupon?.coupon_details?.[0].variant;
              if (!variant || !variant.regular_price) {
                return (<></>) as ReactNode;
              }

              return (variant.product && (
                <ProductCard
                  product={variant.product}
                  variant={
                    {
                      ...variant,
                      ...{ coupon: iCoupon },
                    } as VariantDto
                  }
                  promotions={promotion && [promotion]}
                  coupon={iCoupon}
                  addText={'Chọn sản phẩm'}
                  isShowConfiguration
                />
              )) as ReactNode;
            }}
            data={
              promotion?.coupons?.filter(
                (item: CouponsDto) => item?.coupon_details?.[0],
              ) || []
            }
          />
        </div>
      )}
    </>
  );
}
