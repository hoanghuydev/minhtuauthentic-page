'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import type { BoxProps } from './types';
import { isGrowBoxEffect } from './utils';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';

const EASE = 'easeOut' as const;

const BoxComponent: React.FC<BoxProps> = ({
  row,
  col,
  totalRows,
  totalCols,
  width,
  height,
  boxWidth,
  boxHeight,
  imageSrc,
  animSpeed,
  effect,
  delay, // Precomputed delay from parent (in seconds)
  onComplete,
  isLastToFinish,
}) => {
  const actualWidth = col === totalCols - 1 ? width - boxWidth * col : boxWidth;
  const actualHeight =
    row === totalRows - 1 ? height - boxHeight * row : boxHeight;

  const isGrow = isGrowBoxEffect(effect);

  // Calculate offset from center for image positioning
  const boxCenterX = boxWidth * col + actualWidth / 2;
  const boxCenterY = boxHeight * row + actualHeight / 2;
  const containerCenterX = width / 2;
  const containerCenterY = height / 2;
  const offsetX = containerCenterX - boxCenterX;
  const offsetY = containerCenterY - boxCenterY;

  return (
    <motion.div
      className="absolute overflow-hidden"
      style={{
        left: boxWidth * col,
        top: boxHeight * row,
        width: actualWidth,
        height: actualHeight,
        willChange: 'transform, opacity', // GPU acceleration
      }}
      initial={{
        opacity: 0,
        scale: isGrow ? 0 : 1,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: animSpeed / 1000 / 1.3,
        delay, // Use precomputed delay directly
        ease: EASE,
      }}
      onAnimationComplete={isLastToFinish ? onComplete : undefined}
    >
      <ImageWithFallback
        image={{ url: imageSrc }}
        alt=""
        isUseNativeImage
        style={{
          position: 'absolute',
          height: height,
          width: 'auto',
          minWidth: width,
          maxWidth: 'none',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px)`,
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
    </motion.div>
  );
};

// Memoize to prevent unnecessary re-renders
export const Box = memo(BoxComponent);

export default Box;
