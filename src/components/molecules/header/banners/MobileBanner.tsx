import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import { Pagination, Autoplay } from 'swiper/modules';
import type { SwiperClass } from 'swiper/react';
import { twMerge } from 'tailwind-merge';

import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { generateSlugToHref } from '@/utils';

import { BannerSwiperProps } from './types';
import { getAnimationType, AUTOPLAY_DELAY } from './constants';
import { AnimationWrapper } from './components/AnimationWrapper';

type MobileBannerProps = Omit<
  BannerSwiperProps,
  'isFull' | 'className' | 'classNameImage'
>;

/**
 * Mobile Banner Swiper component
 */
export const MobileBanner = ({
  banners,
  isSquareBannerMobile = false,
  activeIndex,
  playToken,
  isMounted,
  onSlideChange,
  swiperRef,
}: MobileBannerProps) => {
  // Filter banners for mobile display
  const mobileBanners = banners.filter(
    (banner) =>
      banner.is_mobile_visible &&
      banner.images_mobile &&
      banner.images_mobile.length > 0,
  );

  const shouldUsePcBanners = mobileBanners.length === 0;
  const displayBanners = shouldUsePcBanners ? banners : mobileBanners;

  const swiperConfig = {
    speed: 0, // Disable default slide transition
    spaceBetween: 0,
    slidesPerView: 1,
    pagination: { clickable: true },
    modules: [Pagination, Autoplay],
    autoplay: {
      delay: AUTOPLAY_DELAY,
      disableOnInteraction: false,
    },
    loop: false,
    onSwiper: (swiper: SwiperClass) => {
      swiperRef.current = swiper;
    },
    onSlideChange,
  };

  return (
    <div className="w-full lg:!hidden">
      <Swiper className="w-full" {...swiperConfig}>
        {displayBanners.map((banner, index) => {
          const imageDetail = shouldUsePcBanners
            ? banner?.images?.[0]
            : banner.images_mobile?.[0];

          if (!imageDetail) return null;

          const animationType = getAnimationType(
            banner?.properties?.animation,
            index,
          );
          const isActive = index === activeIndex;

          const slideContent = (
            <Link
              href={generateSlugToHref(
                banner?.properties?.slug_mobile || banner?.properties?.slug,
              )}
            >
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
                  priority={index === 0}
                  unoptimized={false}
                  sizes="100vw"
                  quality={80}
                />
              </div>
            </Link>
          );

          return (
            <SwiperSlide
              key={`mobile-${index}`}
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

export default MobileBanner;

