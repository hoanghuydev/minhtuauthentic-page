'use client';

import React, { memo } from 'react';
import { motion, type Transition } from 'framer-motion';
import type { SliceProps, EffectType } from './types';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';

interface SliceVariants {
  initial: Record<string, number | string>;
  animate: Record<string, number | string>;
  transition: Transition;
}

const EASE = 'easeOut' as const;

const getSliceVariants = (
  effect: EffectType,
  height: number,
  actualWidth: number,
  animSpeed: number,
  delay: number,
  index: number,
): SliceVariants => {
  const duration = animSpeed / 1000;

  switch (effect) {
    case 'sliceDown':
    case 'sliceDownRight':
    case 'sliceDownLeft':
      return {
        initial: { opacity: 0, y: -height },
        animate: { opacity: 1, y: 0 },
        transition: { duration, delay, ease: EASE },
      };

    case 'sliceUp':
    case 'sliceUpRight':
    case 'sliceUpLeft':
      return {
        initial: { opacity: 0, y: height },
        animate: { opacity: 1, y: 0 },
        transition: { duration, delay, ease: EASE },
      };

    case 'sliceUpDown':
    case 'sliceUpDownLeft':
    case 'sliceUpDownRight':
      return {
        initial: { opacity: 0, y: index % 2 === 0 ? -height : height },
        animate: { opacity: 1, y: 0 },
        transition: { duration, delay, ease: EASE },
      };

    case 'fold':
      return {
        initial: { opacity: 0, scaleX: 0 },
        animate: { opacity: 1, scaleX: 1 },
        transition: { duration, delay, ease: EASE },
      };

    case 'slideInRight':
      return {
        initial: { clipPath: 'inset(0 100% 0 0)' },
        animate: { clipPath: 'inset(0 0% 0 0)' },
        transition: { duration: duration * 1.5, delay: 0, ease: EASE },
      };

    case 'slideInLeft':
      return {
        initial: { clipPath: 'inset(0 0 0 100%)' },
        animate: { clipPath: 'inset(0 0 0 0%)' },
        transition: { duration: duration * 1.5, delay: 0, ease: EASE },
      };

    default: // fade
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration, delay: 0, ease: EASE },
      };
  }
};

const SliceComponent: React.FC<SliceProps> = ({
  index,
  total,
  width,
  height,
  sliceWidth,
  imageSrc,
  animSpeed,
  effect,
  onComplete,
  isLastToFinish,
  delay, // Precomputed delay from parent
}) => {
  const actualWidth =
    index === total - 1 ? width - sliceWidth * index : sliceWidth;

  const variants = getSliceVariants(
    effect,
    height,
    actualWidth,
    animSpeed,
    delay,
    index,
  );

  return (
    <motion.div
      className="absolute overflow-hidden top-0 bottom-0"
      style={{
        left: sliceWidth * index,
        width: actualWidth,
        height: height,
        transformOrigin: 'left center',
        willChange: 'transform, opacity', // GPU acceleration
      }}
      initial={variants.initial}
      animate={variants.animate}
      transition={variants.transition}
      onAnimationComplete={isLastToFinish ? onComplete : undefined}
    >
      <ImageWithFallback
        image={{ url: imageSrc }}
        alt=""
        isUseNativeImage
        style={{
          position: 'absolute',
          height: '100%',
          width: 'auto',
          minWidth: width,
          maxWidth: 'none',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) translateX(${
            -sliceWidth * index + width / 2 - actualWidth / 2
          }px)`,
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
    </motion.div>
  );
};

// Memoize to prevent unnecessary re-renders
export const Slice = memo(SliceComponent);

export default Slice;
