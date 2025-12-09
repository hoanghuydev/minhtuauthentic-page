'use client';

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import type { EffectType } from './types';
import { getRandomEffect, isLeftEffect, isReverseBoxEffect } from './utils';
import { NivoSlide } from './NivoSlide';

export interface UseNivoSliderProps {
  children: React.ReactNode;
  effect?: EffectType;
  slices?: number;
  boxCols?: number;
  boxRows?: number;
  animSpeed?: number;
  pauseTime?: number;
  startSlide?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  onSlideChange?: (index: number) => void;
}

export interface UseNivoSliderReturn {
  // Refs
  containerRef: React.RefObject<HTMLDivElement | null>;
  slideRef: React.RefObject<HTMLDivElement | null>;

  // State
  slides: React.ReactElement[];
  totalSlides: number;
  activeIndex: number;
  previousIndex: number;
  isAnimating: boolean;
  currentEffect: EffectType;
  dimensions: { width: number; height: number };

  // Precomputed data
  sliceData: Array<{
    originalIndex: number;
    renderIndex: number;
    delay: number;
    isLastToFinish: boolean;
  }>;
  boxData: Array<{
    row: number;
    col: number;
    delay: number;
    isLastToFinish: boolean;
  }>;

  // Navigation
  slideTo: (index: number) => void;
  slideNext: () => void;
  slidePrev: () => void;

  // Handlers
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  handleAnimationComplete: () => void;
}

/**
 * Core hook for NivoSlider logic
 * Manages state, navigation, autoplay, and dimension tracking
 */
export function useNivoSlider({
  children,
  effect = 'random',
  slices = 15,
  boxCols = 8,
  boxRows = 4,
  pauseTime = 3000,
  startSlide = 0,
  pauseOnHover = true,
  loop = true,
  autoplay = true,
  onSlideChange,
}: UseNivoSliderProps): UseNivoSliderReturn {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const lastTimeRef = useRef<number>(Date.now());
  const rafRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);
  const isVisibleRef = useRef(true);

  // State
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentEffect, setCurrentEffect] = useState<EffectType>(
    effect === 'random' ? getRandomEffect() : effect,
  );

  // Extract slides from children
  const slides = useMemo(() => {
    const childArray = React.Children.toArray(children);
    return childArray.filter((child) => {
      if (!React.isValidElement(child)) return false;
      const type = child.type as React.ComponentType;
      return (
        type === NivoSlide ||
        (type as { displayName?: string })?.displayName === 'NivoSlide' ||
        (typeof type === 'function' && type.name === 'NivoSlide')
      );
    }) as React.ReactElement[];
  }, [children]);

  const totalSlides = slides.length;

  // Clamp startSlide to valid range
  const clampedStartSlide = useMemo(() => {
    if (totalSlides === 0) return 0;
    return Math.max(0, Math.min(startSlide, totalSlides - 1));
  }, [startSlide, totalSlides]);

  const [activeIndex, setActiveIndex] = useState(clampedStartSlide);
  const [previousIndex, setPreviousIndex] = useState(clampedStartSlide);

  // Warn if startSlide is out of range
  useEffect(() => {
    if (totalSlides > 0 && (startSlide < 0 || startSlide >= totalSlides)) {
      console.warn(
        `NivoSlider: startSlide (${startSlide}) is out of range [0, ${
          totalSlides - 1
        }]. Using ${clampedStartSlide} instead.`,
      );
    }
  }, [startSlide, totalSlides, clampedStartSlide]);

  // Update dimensions from the slide container
  const updateDimensions = useCallback(() => {
    const element = slideRef.current || containerRef.current;
    if (element) {
      const rect = element.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setDimensions({
          width: Math.floor(rect.width),
          height: Math.floor(rect.height),
        });
      }
    }
  }, []);

  // ResizeObserver for more accurate dimension tracking
  useEffect(() => {
    const element = slideRef.current || containerRef.current;
    if (!element) return;

    updateDimensions();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          setDimensions({
            width: Math.floor(entry.contentRect.width),
            height: Math.floor(entry.contentRect.height),
          });
        }
      }
    });

    resizeObserver.observe(element);

    const handleResize = () => updateDimensions();
    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [updateDimensions]);

  // Update dimensions when active slide changes
  useEffect(() => {
    const timer = setTimeout(updateDimensions, 50);
    return () => clearTimeout(timer);
  }, [activeIndex, updateDimensions]);

  // Slide navigation functions
  const slideTo = useCallback(
    (index: number) => {
      if (isAnimating || index === activeIndex) return;
      if (index < 0 || index >= totalSlides) return;

      updateDimensions();

      setIsAnimating(true);
      setPreviousIndex(activeIndex);
      setActiveIndex(index);
      setCurrentEffect(effect === 'random' ? getRandomEffect() : effect);
      onSlideChange?.(index);
    },
    [
      isAnimating,
      activeIndex,
      totalSlides,
      effect,
      onSlideChange,
      updateDimensions,
    ],
  );

  const slideNext = useCallback(() => {
    if (isAnimating || totalSlides <= 1) return;
    const nextIndex = activeIndex + 1;
    if (nextIndex >= totalSlides) {
      if (loop) slideTo(0);
    } else {
      slideTo(nextIndex);
    }
  }, [isAnimating, activeIndex, totalSlides, loop, slideTo]);

  const slidePrev = useCallback(() => {
    if (isAnimating || totalSlides <= 1) return;
    const prevIdx = activeIndex - 1;
    if (prevIdx < 0) {
      if (loop) slideTo(totalSlides - 1);
    } else {
      slideTo(prevIdx);
    }
  }, [isAnimating, activeIndex, totalSlides, loop, slideTo]);

  // Handle hover pause
  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) {
      isPausedRef.current = true;
    }
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) {
      isPausedRef.current = false;
      lastTimeRef.current = Date.now();
    }
  }, [pauseOnHover]);

  // Handle visibility change (tab switch)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisibleRef.current = false;
      } else {
        isVisibleRef.current = true;
        lastTimeRef.current = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Autoplay using requestAnimationFrame
  useEffect(() => {
    if (!autoplay || totalSlides <= 1) return;

    const tick = () => {
      const now = Date.now();
      const elapsed = now - lastTimeRef.current;

      if (
        isVisibleRef.current &&
        !isPausedRef.current &&
        !isAnimating &&
        elapsed >= pauseTime
      ) {
        lastTimeRef.current = now;
        slideNext();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    lastTimeRef.current = Date.now();
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [autoplay, totalSlides, pauseTime, isAnimating, slideNext]);

  // Handle animation complete
  const handleAnimationComplete = useCallback(() => {
    setIsAnimating(false);
    lastTimeRef.current = Date.now();
  }, []);

  // Precompute slice data with delays
  const sliceData = useMemo(() => {
    const sliceIndices = Array.from({ length: slices }, (_, i) => i);
    const isLeft = isLeftEffect(currentEffect);
    const renderOrder = isLeft ? [...sliceIndices].reverse() : sliceIndices;
    const lastRenderIndex = slices - 1;
    const delayPerSlice = 0.05;

    return renderOrder.map((originalIndex, renderIndex) => ({
      originalIndex,
      renderIndex,
      delay: renderIndex * delayPerSlice,
      isLastToFinish: renderIndex === lastRenderIndex,
    }));
  }, [slices, currentEffect]);

  // Precompute box data with delays
  const boxData = useMemo(() => {
    const boxes: {
      row: number;
      col: number;
      delay: number;
      isLastToFinish: boolean;
    }[] = [];

    if (currentEffect === 'boxRandom') {
      // Create all boxes
      const allBoxes: { row: number; col: number }[] = [];
      for (let row = 0; row < boxRows; row++) {
        for (let col = 0; col < boxCols; col++) {
          allBoxes.push({ row, col });
        }
      }

      // Shuffle delay indices
      const delays = allBoxes.map((_, i) => i * 0.015);
      for (let i = delays.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [delays[i], delays[j]] = [delays[j], delays[i]];
      }

      // Find max delay
      const maxDelay = Math.max(...delays);

      allBoxes.forEach((box, i) => {
        boxes.push({
          ...box,
          delay: delays[i],
          isLastToFinish: delays[i] === maxDelay,
        });
      });
    } else {
      let delayIndex = 0;
      const isReverse = isReverseBoxEffect(currentEffect);
      const delayPerBox = 0.02;
      const allDelays: number[] = [];

      // First pass: calculate all delays
      for (let diag = 0; diag < boxCols + boxRows - 1; diag++) {
        for (let row = 0; row < boxRows; row++) {
          const col = isReverse ? boxCols - 1 - (diag - row) : diag - row;
          if (col >= 0 && col < boxCols) {
            allDelays.push(delayIndex * delayPerBox);
            delayIndex++;
          }
        }
      }

      const maxDelay = Math.max(...allDelays);

      // Second pass: create boxes with isLastToFinish
      delayIndex = 0;
      for (let diag = 0; diag < boxCols + boxRows - 1; diag++) {
        for (let row = 0; row < boxRows; row++) {
          const col = isReverse ? boxCols - 1 - (diag - row) : diag - row;
          if (col >= 0 && col < boxCols) {
            const delay = delayIndex * delayPerBox;
            boxes.push({
              row,
              col,
              delay,
              isLastToFinish: delay === maxDelay,
            });
            delayIndex++;
          }
        }
      }
    }

    return boxes;
  }, [boxCols, boxRows, currentEffect]);

  return {
    // Refs
    containerRef,
    slideRef,

    // State
    slides,
    totalSlides,
    activeIndex,
    previousIndex,
    isAnimating,
    currentEffect,
    dimensions,

    // Precomputed data
    sliceData,
    boxData,

    // Navigation
    slideTo,
    slideNext,
    slidePrev,

    // Handlers
    handleMouseEnter,
    handleMouseLeave,
    handleAnimationComplete,
  };
}

export default useNivoSlider;
