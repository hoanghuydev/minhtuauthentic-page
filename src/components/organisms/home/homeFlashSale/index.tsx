import { PromotionsDto } from '@/dtos/Promotions.dto';
import { SettingOptionDto } from '@/dtos/SettingOption.dto';
import ProductCard from '@/components/organisms/product/card';
import CouponsDto from '@/dtos/Coupons.dto';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { ReactNode, useState, useEffect } from 'react';
import useSwiperSpeed from '@/hooks/useSwiperSpeed';
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

// `block w-full` KHÔNG phải cho đẹp — bỏ đi là banner co lại còn ~2/3 và dạt sang
// mép phải trên điện thoại. Thẻ <a> này là flex item của khối `flex justify-end`
// bên dưới và không có bề rộng, nên nó shrink-to-fit theo KÍCH THƯỚC NỘI TẠI của
// <img> bên trong (class `w-full` của Tailwind thắng thuộc tính width="562", mà
// phần trăm thì tham chiếu ngược lại chính thẻ <a> đang auto ⇒ vòng tròn ⇒ trình
// duyệt quay về dùng kích thước nội tại).
// Từ khi ảnh có `srcset` dạng `w` + `sizes` (commit 260554c), kích thước nội tại
// bị density-correct: naturalWidth = pixelThật x sizes / descriptor. Ảnh nguồn chỉ
// rộng 1124px và Next KHÔNG phóng to, nên các biến thể w=1200/1920/2048/3840 đều
// trả về đúng 1124px trong khi descriptor vẫn khai 1920w. Máy DPR 3 màn >= ~401px
// chọn descriptor 1920w ⇒ naturalWidth = 1124 x 430 / 1920 = 252px trên container
// 398px = 63%. Máy DPR 2 chọn descriptor đúng sự thật nên không lộ lỗi — đây là lý
// do nó "lúc bị lúc không" tuỳ máy.
// Cho <a> một bề rộng xác định là đủ: phần trăm của <img> hết vòng tròn, không còn
// đường nào rơi về kích thước nội tại nữa.
const MOBILE_LINK_CLASS = 'lg:!hidden block w-full';

export default function HomeFlashSale({ promotion, setting }: Props) {
  const endDate: Date = new Date(promotion?.end_date || '');
  const [isClient, setIsClient] = useState(false);
  const swiperSpeed = useSwiperSpeed();

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
                      sizes="100vw"
                      fill
                    />
                  </a>
                ) : (
                  <Image
                    src={promotion?.images?.[0]?.image?.url || ''}
                    className={'object-cover w-full !h-auto'}
                    alt={'Khuyến mãi flash sale'}
                    sizes="100vw"
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
                    className={MOBILE_LINK_CLASS}
                  >
                    <Image
                      src={promotion?.images_mobile?.[0]?.image?.url || ''}
                      className={'object-cover w-full !h-auto lg:!hidden'}
                      alt={'Khuyến mãi flash sale'}
                      sizes="100vw"
                      width={562}
                      height={180}
                    />
                  </a>
                ) : (
                  <Image
                    src={promotion?.images_mobile?.[0]?.image?.url || ''}
                    className={'object-cover w-full !h-auto lg:!hidden'}
                    alt={'Khuyến mãi flash sale'}
                    sizes="100vw"
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
                      className={MOBILE_LINK_CLASS}
                    >
                      <Image
                        src={promotion?.images?.[0]?.image?.url || ''}
                        className={'object-cover w-full !h-auto lg:!hidden'}
                        alt={'Khuyến mãi flash sale'}
                        sizes="100vw"
                        width={1219}
                        height={120}
                      />
                    </a>
                  ) : (
                    <Image
                      src={promotion?.images?.[0]?.image?.url || ''}
                      className={'object-cover w-full !h-auto lg:!hidden'}
                      alt={'Khuyến mãi flash sale'}
                      sizes="100vw"
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
            speed={swiperSpeed}
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
