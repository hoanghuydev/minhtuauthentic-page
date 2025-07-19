import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import { ImageDetailDto } from '@/dtos/ImageDetail.dto';
import { generateSlugToHref } from '@/utils';
import { useRef, useState } from 'react';
import type { SwiperClass } from 'swiper/react';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { twMerge } from 'tailwind-merge';

export const Banners = ({
  banners,
  className,
  classNameImage,
  isFull = false,
  isSquareBannerMobile = false,
}: {
  banners: StaticContentsDto[];
  className?: string;
  classNameImage?: string;
  isFull?: boolean;
  isSquareBannerMobile?: boolean;
}) => {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [isLastSlide, setIsLastSlide] = useState(false);
  const [isFirstSlide, setIsFirstSlide] = useState(true);

  // Hàm xử lý kiểm tra slide đầu/cuối
  const handleSlideChange = () => {
    if (!swiperRef.current) return;

    const swiper = swiperRef.current;
    const isLast = swiper.isEnd;
    const isFirst = swiper.isBeginning;

    setIsLastSlide(isLast);
    setIsFirstSlide(isFirst);
  };

  // Cấu hình swiper cho desktop
  const desktopSwiperConfig = {
    effect: isFull ? ('fade' as const) : undefined,
    spaceBetween: 50,
    slidesPerView: 1,
    pagination: true,
    navigation: true,
    modules: [Pagination, Autoplay, Navigation],
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    loop: false,
    onSwiper: (swiper: SwiperClass) => {
      swiperRef.current = swiper;
      setIsFirstSlide(swiper.isBeginning);
      setIsLastSlide(swiper.isEnd);
    },
    onSlideChange: handleSlideChange,
  };

  // Cấu hình swiper cho mobile
  const mobileSwiperConfig = {
    spaceBetween: 0,
    slidesPerView: 1,
    pagination: {
      clickable: true,
    },
    modules: [Pagination, Autoplay],
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    loop: false,
  };

  // Render desktop banners
  const renderDesktopBanners = () => (
    <div
      className={twMerge(
        'relative banner-container h-full hidden lg:!block',
        isLastSlide && 'hide-next-button',
        isFirstSlide && 'hide-prev-button',
      )}
      onMouseEnter={() => swiperRef.current?.autoplay.stop()}
      onMouseLeave={() => swiperRef.current?.autoplay.start()}
    >
      <Swiper className={className} {...desktopSwiperConfig}>
        {banners.map((banner, index) => {
          const imageDetail = banner?.images?.[0];
          if (!imageDetail) return null;

          const imageElement = (
            <ImageWithFallback
              image={imageDetail.image}
              alt={imageDetail.image?.alt || 'minhtuauthentic'}
              className={twMerge(
                'object-contain w-full h-full',
                classNameImage,
              )}
              loading="eager"
              unoptimized={false}
              sizes="100vw"
              quality={100}
            />
          );

          return (
            <SwiperSlide
              key={`desktop-${index}`}
              className="w-full"
              style={{ width: '100% !important' }}
            >
              {isFull ? (
                imageElement
              ) : (
                <Link href={generateSlugToHref(banner?.properties?.slug)}>
                  {imageElement}
                </Link>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );

  // Render mobile banners
  const renderMobileBanners = () => (
    <div className="w-full lg:!hidden">
      <Swiper className="w-full" {...mobileSwiperConfig}>
        {banners.map((banner, index) => {
          // Ưu tiên sử dụng ảnh mobile, fallback về ảnh desktop nếu không có
          const imageDetail = banner?.images_mobile?.[0] || banner?.images?.[0];
          if (!imageDetail) return null;

          const imageElement = (
            <div
              className={twMerge(
                'w-full',
                isSquareBannerMobile && 'aspect-square',
              )}
            >
              <ImageWithFallback
                image={imageDetail.image}
                alt={imageDetail.image?.alt || 'minhtuauthentic'}
                className="object-cover w-full h-full"
                loading="eager"
                unoptimized={true}
                sizes="100vw"
                quality={80}
              />
            </div>
          );

          return (
            <SwiperSlide
              key={`mobile-${index}`}
              className="w-full"
              style={{ width: '100% !important' }}
            >
              {isFull ? (
                imageElement
              ) : (
                <Link href={generateSlugToHref(banner?.properties?.slug)}>
                  {imageElement}
                </Link>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );

  return (
    <>
      {renderDesktopBanners()}
      {renderMobileBanners()}
    </>
  );
};

export default Banners;
