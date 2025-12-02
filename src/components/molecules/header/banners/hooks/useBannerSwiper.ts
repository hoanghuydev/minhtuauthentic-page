import { useRef, useState, useCallback, useEffect } from 'react';
import type { SwiperClass } from 'swiper/react';
import { UseBannerSwiperReturn } from '../types';

/**
 * Custom hook for managing banner swiper state
 * Handles slide changes, animation restart, and SSR hydration safety
 */
export const useBannerSwiper = (): UseBannerSwiperReturn => {
  const swiperRef = useRef<SwiperClass | null>(null);
  const mobileSwiperRef = useRef<SwiperClass | null>(null);

  const [isLastSlide, setIsLastSlide] = useState(false);
  const [isFirstSlide, setIsFirstSlide] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playToken, setPlayToken] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side mounting to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle desktop slide change
  const handleSlideChange = useCallback(() => {
    if (!swiperRef.current) return;

    const swiper = swiperRef.current;
    setIsLastSlide(swiper.isEnd);
    setIsFirstSlide(swiper.isBeginning);
    setActiveIndex(swiper.activeIndex);
    setPlayToken((prev) => prev + 1);
  }, []);

  // Handle mobile slide change
  const handleMobileSlideChange = useCallback(() => {
    if (!mobileSwiperRef.current) return;
    setActiveIndex(mobileSwiperRef.current.activeIndex);
    setPlayToken((prev) => prev + 1);
  }, []);

  return {
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
  };
};

export default useBannerSwiper;

