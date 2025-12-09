'use client';

import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

import type { NivoSliderProps } from './types';
import { SliderContext } from './context';
import { getImageSrc, isSliceEffect } from './utils';
import { NivoSlide } from './NivoSlide';
import { NavButton } from './NavButton';
import { PaginationDot } from './PaginationDot';
import { useNivoSlider } from './useNivoSlider';
import {
  FadeOverlay,
  SlideInOverlay,
  SliceOverlay,
  BoxOverlay,
} from './overlays';

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
    pauseTime,
    startSlide,
    pauseOnHover,
    loop,
    autoplay,
    onSlideChange,
  });

  // Render animation overlay based on current effect
  const renderAnimationOverlay = useCallback(() => {
    if (!isAnimating || totalSlides <= 1) return null;

    const currentSlide = slides[activeIndex];
    const imageSrc = getImageSrc(currentSlide);

    // Fallback for non-image slides
    if (!imageSrc) {
      return (
        <motion.div
          className="absolute inset-0 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: animSpeed / 1000, ease: 'easeOut' as const }}
          onAnimationComplete={handleAnimationComplete}
        >
          {currentSlide}
        </motion.div>
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
