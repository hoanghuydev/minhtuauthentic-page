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
        requestIdleCallback?: (
          cb: () => void,
          o?: { timeout: number },
        ) => number;
        cancelIdleCallback?: (id: number) => void;
      }
    ).requestIdleCallback;
    if (ric) {
      const id = ric(prefetch, { timeout: 2000 });
      return () => {
        cancelled = true;
        (
          window as unknown as { cancelIdleCallback?: (i: number) => void }
        ).cancelIdleCallback?.(id);
      };
    }
    const timer = setTimeout(prefetch, 1500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [totalSlides]);

  // Hai lớp nền trong lúc chuyển cảnh, thay vì một.
  //
  // Trước đây chỉ có `slides[isAnimating ? previousIndex : activeIndex]`, tức
  // MỘT slide duy nhất nằm trong DOM tại mỗi thời điểm. Khi hoạt ảnh kết thúc,
  // React gỡ lớp overlay VÀ đổi slide nền trong CÙNG một commit — mà slide mới
  // là một <img> vừa được mount, chưa chắc đã tải + decode xong. Hộp banner
  // không có background nên cái lộ ra là nền trắng của trang.
  // Đo trên production: crossfade mobile dài 400ms, còn ảnh slide kế tiếp mất
  // 1292ms (43,8 KB, biến thể /_next/image nguội) ⇒ trống ~890ms.
  //
  // Cách sửa: slide ĐÍCH được mount ngay từ đầu hoạt ảnh và nằm ở luồng thường,
  // slide CŨ phủ lên trên bằng `absolute inset-0` (phần tử positioned luôn vẽ
  // trên nội dung static cùng cấp, không cần z-index). Hết hoạt ảnh chỉ việc gỡ
  // lớp cũ ⇒ thứ lộ ra là một ảnh đã được vẽ suốt `animSpeed` vừa rồi.
  // KHÔNG tốn thêm byte: đúng cái ảnh mà overlay vốn đã tải.
  const slideLayers = useMemo(() => {
    const layers = [{ index: activeIndex, isOutgoing: false }];
    if (isAnimating && previousIndex !== activeIndex) {
      layers.push({ index: previousIndex, isOutgoing: true });
    }
    return layers;
  }, [activeIndex, previousIndex, isAnimating]);

  // Nạp trước ảnh của slide kế tiếp.
  // Không có nó, ảnh chỉ bắt đầu tải khi hoạt ảnh BẮT ĐẦU, tức nó có đúng
  // `animSpeed` (400ms ở mobile) để về kịp — xem số đo ở khối trên.
  // Tổng số byte không đổi: slide đó kiểu gì cũng được tải sau `pauseTime` nữa.
  useEffect(() => {
    if (totalSlides <= 1) return;
    const nextIndex =
      activeIndex + 1 < totalSlides ? activeIndex + 1 : loop ? 0 : -1;
    if (nextIndex < 0 || nextIndex === activeIndex) return;

    let cancelled = false;
    const prefetch = () => {
      if (cancelled) return;
      // Cây banner bị `display:none` theo breakpoint không có hộp. Bỏ qua nó,
      // nếu không là tái lập đúng phần byte mà 0b29ece đã cắt (mobile tải ảnh
      // của cây desktop và ngược lại).
      const el = containerRef.current;
      if (!el || el.getBoundingClientRect().width === 0) return;
      const src = toOptimizedSrc(getImageSrc(slides[nextIndex]));
      if (!src) return;
      const img = new Image();
      // Ảnh LCP đã được preload với fetchPriority=high ở pages/index.tsx. Lần
      // nạp trước đầu tiên xảy ra khi trang còn đang tải, nên phải khai báo ưu
      // tiên thấp để nó không giành băng thông với chính ảnh LCP.
      img.setAttribute('fetchpriority', 'low');
      img.decoding = 'async';
      img.src = src;
    };

    const ric = (
      window as unknown as {
        requestIdleCallback?: (
          cb: () => void,
          o?: { timeout: number },
        ) => number;
        cancelIdleCallback?: (id: number) => void;
      }
    ).requestIdleCallback;
    if (ric) {
      const id = ric(prefetch, { timeout: 2000 });
      return () => {
        cancelled = true;
        (
          window as unknown as { cancelIdleCallback?: (i: number) => void }
        ).cancelIdleCallback?.(id);
      };
    }
    const timer = setTimeout(prefetch, 1500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [activeIndex, totalSlides, loop, slides, containerRef]);

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
            {slideLayers.map(({ index, isOutgoing }) => (
              <div
                // KEY LÀ CHỈ SỐ SLIDE, KHÔNG phải vị trí trong mảng. Đây là toàn
                // bộ lý do khối này tồn tại: React khớp con theo key nên node của
                // một slide ĐƯỢC GIỮ NGUYÊN khi nó đổi vai (đang hiện -> đang đi
                // ra) và khi hoạt ảnh kết thúc. Không có nó, <img> bị unmount rồi
                // mount lại ở đúng khoảnh khắc chuyển cảnh và hộp banner trống
                // một nhịp ⇒ lộ nền trắng ("nháy trắng").
                key={index}
                className={isOutgoing ? 'absolute inset-0' : 'w-full h-full'}
              >
                {slides[index]}
              </div>
            ))}
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
