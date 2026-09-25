'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { twMerge } from 'tailwind-merge';

import type { NivoSliderProps } from './types';
import { SliderContext } from './context';
import { getImageSrc, isSliceEffect, toOptimizedSrc } from './utils';
import { NivoSlide } from './NivoSlide';
import { NavButton } from './NavButton';
import { PaginationDot } from './PaginationDot';
import { useNivoSlider } from './useNivoSlider';
// framer-motion là 147 KB raw / 46,6 KB nén và là chunk lớn thứ hai của trang
// chủ, nhưng nó KHÔNG vẽ gì trong 3 giây đầu: `renderAnimationOverlay()` trả
// null khi `!isAnimating`, và lần chuyển slide đầu xảy ra ở pauseTime=3000ms.
// Nạp cả cụm overlay bằng `dynamic()` để nó ra khỏi chunk khởi tạo.
// KHÔNG dùng `LazyMotion` + `m`: với `features={domAnimation}` import tĩnh thì
// framer-motion vẫn nằm trong chunk khởi tạo, chỉ nhỏ đi — không đạt mục tiêu.
// An toàn nhờ lưới ở useNivoSlider.ts: nếu chunk về muộn, timer vẫn gỡ
// `isAnimating` nên slider không treo, chỉ mất hiệu ứng của lần chuyển đó.
// Khai tường minh từng cái (không dùng helper generic) để giữ nguyên kiểu prop.
// Cả 5 cùng trỏ vào './overlays' nên bundler gom vào MỘT chunk lazy duy nhất.
const FadeOverlay = dynamic(
  () => import('./overlays').then((m) => m.FadeOverlay),
  { ssr: false },
);
const SlideInOverlay = dynamic(
  () => import('./overlays').then((m) => m.SlideInOverlay),
  { ssr: false },
);
const SliceOverlay = dynamic(
  () => import('./overlays').then((m) => m.SliceOverlay),
  { ssr: false },
);
const BoxOverlay = dynamic(
  () => import('./overlays').then((m) => m.BoxOverlay),
  { ssr: false },
);
const ChildrenFade = dynamic(
  () => import('./overlays').then((m) => m.ChildrenFade),
  { ssr: false },
);

/**
 * NivoSlider - A slider component with Nivo-style animations
 * Supports fade, slice, box, and slideIn effects
 */
const NivoSlider: React.FC<NivoSliderProps> & { Slide: typeof NivoSlide } = ({
  children,
  effect = 'random',
  slices = 15,
  boxCols = 8,
  boxRows = 4,
  animSpeed = 500,
  pauseTime = 3000,
  startSlide = 0,
  directionNav = true,
  controlNav = true,
  pauseOnHover = true,
  loop = true,
  autoplay = true,
  className,
  prevIcon,
  nextIcon,
  onSlideChange,
  renderPagination,
}) => {
  // Use custom hook for core logic
  const {
    containerRef,
    slideRef,
    slides,
    totalSlides,
    activeIndex,
    previousIndex,
    isAnimating,
    currentEffect,
    dimensions,
    sliceData,
    boxData,
    slideTo,
    slideNext,
    slidePrev,
    handleMouseEnter,
    handleMouseLeave,
    handleAnimationComplete,
  } = useNivoSlider({
    children,
    effect,
    slices,
    boxCols,
    boxRows,
    animSpeed,
    pauseTime,
    startSlide,
    pauseOnHover,
    loop,
    autoplay,
    onSlideChange,
  });

  // Chunk overlay chỉ được YÊU CẦU vào đúng lúc chuyển slide đầu (pauseTime,
  // 3000ms). Trên mạng chậm — đúng profile Lighthouse mobile — banner sẽ đứng ở
  // slide CŨ suốt cửa sổ lưới an toàn rồi cắt cảnh thô. Nạp trước lúc main thread
  // rảnh: không đụng vào chunk khởi tạo mà vẫn kịp trước lần chuyển đầu.
  useEffect(() => {
    if (totalSlides <= 1) return;
    let cancelled = false;
    const prefetch = () => {
      if (!cancelled) void import('./overlays');
    };
    const ric = (
      window as unknown as {
        requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
        cancelIdleCallback?: (id: number) => void;
      }
    ).requestIdleCallback;
    if (ric) {
      const id = ric(prefetch, { timeout: 2000 });
      return () => {
        cancelled = true;
        (window as unknown as { cancelIdleCallback?: (i: number) => void })
          .cancelIdleCallback?.(id);
      };
    }
    const timer = setTimeout(prefetch, 1500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [totalSlides]);

  // Render animation overlay based on current effect
  const renderAnimationOverlay = useCallback(() => {
    if (!isAnimating || totalSlides <= 1) return null;

    const currentSlide = slides[activeIndex];
    const imageSrc = toOptimizedSrc(getImageSrc(currentSlide));

    // Fallback for non-image slides
    if (!imageSrc) {
      return (
        <ChildrenFade
          animSpeed={animSpeed}
          onComplete={handleAnimationComplete}
        >
          {currentSlide}
        </ChildrenFade>
      );
    }

    // Fade effect
    if (currentEffect === 'fade') {
      return (
        <FadeOverlay
          imageSrc={imageSrc}
          animSpeed={animSpeed}
          onComplete={handleAnimationComplete}
        />
      );
    }

    // SlideIn effects
    if (currentEffect === 'slideInRight' || currentEffect === 'slideInLeft') {
      return (
        <SlideInOverlay
          imageSrc={imageSrc}
          effect={currentEffect}
          animSpeed={animSpeed}
          onComplete={handleAnimationComplete}
        />
      );
    }

    // Slice effects - fallback to fade if dimensions not ready
    if (isSliceEffect(currentEffect)) {
      if (dimensions.width === 0 || dimensions.height === 0) {
        return (
          <FadeOverlay
            imageSrc={imageSrc}
            animSpeed={animSpeed}
            onComplete={handleAnimationComplete}
          />
        );
      }
      return (
        <SliceOverlay
          imageSrc={imageSrc}
          dimensions={dimensions}
          slices={slices}
          sliceData={sliceData}
          effect={currentEffect}
          animSpeed={animSpeed}
          activeIndex={activeIndex}
          onComplete={handleAnimationComplete}
        />
      );
    }

    // Box effects - fallback to fade if dimensions not ready
    if (dimensions.width === 0 || dimensions.height === 0) {
      return (
        <FadeOverlay
          imageSrc={imageSrc}
          animSpeed={animSpeed}
          onComplete={handleAnimationComplete}
        />
      );
    }
    return (
      <BoxOverlay
        imageSrc={imageSrc}
        dimensions={dimensions}
        boxCols={boxCols}
        boxRows={boxRows}
        boxData={boxData}
        effect={currentEffect}
        animSpeed={animSpeed}
        activeIndex={activeIndex}
        onComplete={handleAnimationComplete}
      />
    );
  }, [
    isAnimating,
    totalSlides,
    slides,
    activeIndex,
    currentEffect,
    animSpeed,
    dimensions,
    slices,
    sliceData,
    boxCols,
    boxRows,
    boxData,
    handleAnimationComplete,
  ]);

  // Default pagination
  const defaultPagination = useMemo(
    () => (
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <PaginationDot
            key={index}
            index={index}
            isActive={index === activeIndex}
            onClick={() => slideTo(index)}
          />
        ))}
      </div>
    ),
    [slides, activeIndex, slideTo],
  );

  // Context value for child components
  const contextValue = useMemo(
    () => ({
      activeIndex,
      totalSlides,
      slideTo,
      slideNext,
      slidePrev,
      isAnimating,
    }),
    [activeIndex, totalSlides, slideTo, slideNext, slidePrev, isAnimating],
  );

  // Early return if no slides
  if (totalSlides === 0) {
    console.warn('NivoSlider: No valid NivoSlide children found.');
    return null;
  }

  return (
    <SliderContext.Provider value={contextValue}>
      <div className={twMerge('relative w-full', className)}>
        <div
          ref={containerRef}
          className="relative w-full h-full overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Background/Current slide */}
          <div ref={slideRef} className="relative w-full h-full">
            {slides[isAnimating ? previousIndex : activeIndex]}
          </div>

          {/* Animation overlay */}
          {renderAnimationOverlay()}

          {/* Direction nav */}
          {directionNav && totalSlides > 1 && (
            <>
              <NavButton direction="prev" onClick={slidePrev} icon={prevIcon} />
              <NavButton direction="next" onClick={slideNext} icon={nextIcon} />
            </>
          )}

          {/* Control nav (pagination) */}
          {controlNav &&
            totalSlides > 1 &&
            (renderPagination
              ? renderPagination({ activeIndex, totalSlides, slideTo })
              : defaultPagination)}
        </div>
      </div>
    </SliderContext.Provider>
  );
};

NivoSlider.Slide = NivoSlide;

export { NivoSlider };
export default NivoSlider;
