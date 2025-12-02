import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import type { SwiperClass } from 'swiper/react';
import { twMerge } from 'tailwind-merge';

import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { generateSlugToHref } from '@/utils';

import { BannerSwiperProps } from './types';
import { getAnimationType, AUTOPLAY_DELAY } from './constants';
import { AnimationWrapper } from './components/AnimationWrapper';

interface DesktopBannerProps
  extends Omit<BannerSwiperProps, 'isSquareBannerMobile'> {
  isLastSlide: boolean;
  isFirstSlide: boolean;
  setIsFirstSlide: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLastSlide: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Desktop Banner Swiper component
 */
export const DesktopBanner = ({
  banners,
  className,
  classNameImage,
  isFull = false,
  activeIndex,
  playToken,
  isMounted,
  onSlideChange,
  swiperRef,
  isLastSlide,
  isFirstSlide,
  setIsFirstSlide,
  setIsLastSlide,
  setActiveIndex,
}: DesktopBannerProps) => {
  const swiperConfig = {
    effect: isFull ? ('fade' as const) : undefined,
    speed: 0, // Disable default slide transition
    spaceBetween: 50,
    slidesPerView: 1,
    pagination: true,
    navigation: true,
    modules: [Pagination, Autoplay, Navigation],
    autoplay: {
      delay: AUTOPLAY_DELAY,
      disableOnInteraction: false,
    },
    loop: false,
    onSwiper: (swiper: SwiperClass) => {
      swiperRef.current = swiper;
      setIsFirstSlide(swiper.isBeginning);
      setIsLastSlide(swiper.isEnd);
      setActiveIndex(swiper.activeIndex);
    },
    onSlideChange,
  };

  return (
    <div
      className={twMerge(
        'relative banner-container h-full hidden lg:!block',
        isLastSlide && 'hide-next-button',
        isFirstSlide && 'hide-prev-button',
      )}
      onMouseEnter={() => swiperRef.current?.autoplay.stop()}
      onMouseLeave={() => swiperRef.current?.autoplay.start()}
    >
      <Swiper className={className} {...swiperConfig}>
        {banners.map((banner, index) => {
          const imageDetail = banner?.images?.[0];
          if (!imageDetail) return null;

          const animationType = getAnimationType(
            banner?.properties?.animation,
            index,
          );
          const isActive = index === activeIndex;

          const slideContent = (
            <Link href={generateSlugToHref(banner?.properties?.slug)}>
              <ImageWithFallback
                image={imageDetail.image}
                alt={imageDetail.image?.alt || 'minhtuauthentic'}
                className={twMerge(
                  'object-contain w-full h-full',
                  classNameImage,
                )}
                loading="eager"
                priority={index === 0}
                unoptimized={true}
                sizes="100vw"
                quality={100}
              />
            </Link>
          );

          return (
            <SwiperSlide
              key={`desktop-${index}`}
              className="w-full"
              style={{ width: '100% !important' }}
            >
              <AnimationWrapper
                animationType={animationType}
                slideIndex={index}
                isActive={isActive}
                playToken={playToken}
                isMounted={isMounted}
              >
                {slideContent}
              </AnimationWrapper>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default DesktopBanner;

