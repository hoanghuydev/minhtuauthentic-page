import { PromotionsDto } from '@/dtos/Promotions.dto';
import { SettingOptionDto } from '@/dtos/SettingOption.dto';
import ProductCard from '@/components/organisms/product/card';
import CouponsDto from '@/dtos/Coupons.dto';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { ReactNode, useState, useEffect } from 'react';
import SectionSwiperItem from '@/components/organisms/sectionSwiper/item';

const CountdownContainer = dynamic(
  () => import('@/components/organisms/home/homeFlashSale/countdownContainer'),
  {
    ssr: false,
  },
);

type Props = {
  promotion?: PromotionsDto;
  setting?: SettingOptionDto;
};

export default function HomeFlashSale({ promotion, setting }: Props) {
  const endDate: Date = new Date(promotion?.end_date || '');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {endDate?.getTime() > new Date().getTime() && (
        <div
          className={'mt-3 mx-auto p-1 lg:p-3 rounded-[10px]'}
          style={{ backgroundColor: setting?.backgroundColor || '#fff' }}
        >
          <div
            className={
              'flex justify-end mb-3 items-center w-full relative lg:h-[120px] lg:px-3 lg:mb-3'
            }
          >
            {/* Desktop Image */}
            {promotion?.images?.[0]?.image?.url && (
              <div className="hidden-on-mobile show-on-pc w-full h-full">
                <Image
                  src={promotion?.images?.[0]?.image?.url || ''}
                  className={'object-cover w-full !h-auto'}
                  alt={'Khuyến mãi flash sale'}
                  unoptimized
                  fill
                />
              </div>
            )}

            {/* Mobile Image */}
            {promotion?.images_mobile?.[0]?.image?.url && (
              <Image
                src={promotion?.images_mobile?.[0]?.image?.url || ''}
                className={'object-cover w-full !h-auto hidden-on-pc'}
                alt={'Khuyến mãi flash sale'}
                unoptimized
                width={562}
                height={180}
              />
            )}

            {/* Fallback: Show desktop image on mobile if mobile image is not available */}
            {!promotion?.images_mobile?.[0]?.image?.url &&
              promotion?.images?.[0]?.image?.url && (
                <Image
                  src={promotion?.images?.[0]?.image?.url || ''}
                  className={'object-cover w-full !h-auto hidden-on-pc'}
                  alt={'Khuyến mãi flash sale'}
                  unoptimized
                  width={1219}
                  height={120}
                />
              )}

            <div className="hidden-on-mobile show-on-pc absolute top-0 right-[20px]">
              <CountdownContainer
                className={'relative pt-12 flex'}
                endDate={endDate}
              />
            </div>
          </div>
          <div className="show-on-mobile hidden-on-pc">
            <CountdownContainer
              className={'flex gap-3 mb-3 items-center justify-center'}
              endDate={endDate}
            />
          </div>

          <SectionSwiperItem
            classNameContainer="pt-2"
            slidesPerView={5}
            slidePerViewMobile={2}
            spaceBetween={10}
            isUseHeightWrapper={false}
            renderItem={(item: unknown) => {
              const coupon = item as CouponsDto;
              const variant = coupon?.coupon_details?.[0].variant;
              return (variant?.product && (
                <ProductCard
                  product={variant.product}
                  variant={
                    {
                      ...variant,
                      ...{ coupon },
                    } as any
                  }
                  promotions={promotion && [promotion]}
                  coupon={coupon}
                  isShowConfiguration
                />
              )) as ReactNode;
            }}
            data={
              (promotion?.coupons || [])?.filter(
                (item: CouponsDto) => item?.coupon_details?.[0]?.variant,
              ) || []
            }
          />
        </div>
      )}
    </>
  );
}
