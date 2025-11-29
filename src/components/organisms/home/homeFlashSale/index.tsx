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
          {/* Title Section */}
          {promotion?.name && (
            <div className={'flex justify-between mb-3'}>
              {promotion?.slugs && promotion?.slugs?.slug ? (
                <a
                  href={`${process.env.NEXT_PUBLIC_APP_URL}/${promotion.slugs.slug}`}
                  className={
                    'text-[18px] lg:text-[24px] uppercase font-[700] lg:font-bold w-max shrink-0 text-primary'
                  }
                >
                  {promotion.name}
                </a>
              ) : (
                <h3
                  className={
                    'text-[18px] lg:text-[24px] uppercase font-[700] lg:font-bold w-max shrink-0 text-primary'
                  }
                >
                  {promotion.name}
                </h3>
              )}
            </div>
          )}

          <div
            className={
              'flex justify-end mb-3 items-center w-full relative lg:h-[120px] lg:px-3 lg:mb-3'
            }
          >
            {/* Desktop Image */}
            {promotion?.images?.[0]?.image?.url && (
              <div className="hidden lg:!block w-full h-full">
                {!promotion?.name &&
                promotion?.slugs &&
                promotion?.slugs?.slug ? (
                  <a
                    href={`${process.env.NEXT_PUBLIC_APP_URL}/${promotion.slugs.slug}`}
                    className="block w-full h-full"
                  >
                    <Image
                      src={promotion?.images?.[0]?.image?.url || ''}
                      className={'object-cover w-full !h-auto'}
                      alt={'Khuyến mãi flash sale'}
                      unoptimized
                      fill
                    />
                  </a>
                ) : (
                  <Image
                    src={promotion?.images?.[0]?.image?.url || ''}
                    className={'object-cover w-full !h-auto'}
                    alt={'Khuyến mãi flash sale'}
                    unoptimized
                    fill
                  />
                )}
              </div>
            )}

            {/* Mobile Image */}
            {promotion?.images_mobile?.[0]?.image?.url && (
              <>
                {!promotion?.name &&
                promotion?.slugs &&
                promotion?.slugs?.slug ? (
                  <a
                    href={`${process.env.NEXT_PUBLIC_APP_URL}/${promotion.slugs.slug}`}
                    className="lg:!hidden"
                  >
                    <Image
                      src={promotion?.images_mobile?.[0]?.image?.url || ''}
                      className={'object-cover w-full !h-auto lg:!hidden'}
                      alt={'Khuyến mãi flash sale'}
                      unoptimized
                      width={562}
                      height={180}
                    />
                  </a>
                ) : (
                  <Image
                    src={promotion?.images_mobile?.[0]?.image?.url || ''}
                    className={'object-cover w-full !h-auto lg:!hidden'}
                    alt={'Khuyến mãi flash sale'}
                    unoptimized
                    width={562}
                    height={180}
                  />
                )}
              </>
            )}

            {/* Fallback: Show desktop image on mobile if mobile image is not available */}
            {!promotion?.images_mobile?.[0]?.image?.url &&
              promotion?.images?.[0]?.image?.url && (
                <>
                  {!promotion?.name &&
                  promotion?.slugs &&
                  promotion?.slugs?.slug ? (
                    <a
                      href={`${process.env.NEXT_PUBLIC_APP_URL}/${promotion.slugs.slug}`}
                      className="lg:!hidden"
                    >
                      <Image
                        src={promotion?.images?.[0]?.image?.url || ''}
                        className={'object-cover w-full !h-auto lg:!hidden'}
                        alt={'Khuyến mãi flash sale'}
                        unoptimized
                        width={1219}
                        height={120}
                      />
                    </a>
                  ) : (
                    <Image
                      src={promotion?.images?.[0]?.image?.url || ''}
                      className={'object-cover w-full !h-auto lg:!hidden'}
                      alt={'Khuyến mãi flash sale'}
                      unoptimized
                      width={1219}
                      height={120}
                    />
                  )}
                </>
              )}

            <div className="hidden lg:!block absolute top-0 right-[20px]">
              <CountdownContainer className={'pt-6'} endDate={endDate} />
            </div>
          </div>
          <div className="lg:!hidden">
            <CountdownContainer
              className={'flex mb-3 items-center justify-center'}
              endDate={endDate}
            />
          </div>

          <SectionSwiperItem
            classNameContainer="pt-2"
            slidesPerView={5}
            slidePerViewMobile={2}
            spaceBetween={10}
            isUseHeightWrapper={false}
            auto={{
              delay: 6000,
              disableOnInteraction: false,
            }}
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
