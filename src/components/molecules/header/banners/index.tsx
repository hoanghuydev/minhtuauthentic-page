import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

import { BannersProps } from './types';
import { useBannerSwiper } from './hooks/useBannerSwiper';
import { DesktopBanner } from './DesktopBanner';
import { MobileBanner } from './MobileBanner';

/**
 * Banners component with PowerPoint-like animations
 *
 * Features:
 * - Multiple animation types (fade, zoom, slide, flip, tile-based, etc.)
 * - Separate desktop and mobile rendering
 * - SSR-safe with hydration handling
 * - Configurable via banner.properties.animation
 *
 * @example
 * <Banners banners={bannerData} isFull={true} />
 */
export const Banners = ({
  banners,
  className,
  classNameImage,
  isFull = false,
  isSquareBannerMobile = false,
}: BannersProps) => {
  const {
    swiperRef,
    mobileSwiperRef,
    isLastSlide,
    isFirstSlide,
    activeIndex,
    playToken,
    isMounted,
    handleSlideChange,
    handleMobileSlideChange,
    setActiveIndex,
    setIsFirstSlide,
    setIsLastSlide,
  } = useBannerSwiper();

  return (
    <>
      <DesktopBanner
        banners={banners}
        className={className}
        classNameImage={classNameImage}
        isFull={isFull}
        activeIndex={activeIndex}
        playToken={playToken}
        isMounted={isMounted}
        onSlideChange={handleSlideChange}
        swiperRef={swiperRef}
        isLastSlide={isLastSlide}
        isFirstSlide={isFirstSlide}
        setIsFirstSlide={setIsFirstSlide}
        setIsLastSlide={setIsLastSlide}
        setActiveIndex={setActiveIndex}
      />
      <MobileBanner
        banners={banners}
        isSquareBannerMobile={isSquareBannerMobile}
        activeIndex={activeIndex}
        playToken={playToken}
        isMounted={isMounted}
        onSlideChange={handleMobileSlideChange}
        swiperRef={mobileSwiperRef}
      />
    </>
  );
};

export default Banners;

// Re-export types and constants for external use
export * from './types';
export * from './constants';

