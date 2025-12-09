'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import type { EffectType } from '../types';

export interface SlideInOverlayProps {
  imageSrc: string;
  effect: EffectType;
  animSpeed: number;
  onComplete: () => void;
}

/**
 * SlideIn animation overlay (slideInLeft/slideInRight)
 * Uses clip-path for reveal animation
 */
export const SlideInOverlay = memo<SlideInOverlayProps>(
  ({ imageSrc, effect, animSpeed, onComplete }) => {
    const isLeft = effect === 'slideInLeft';

    return (
      <motion.div
        className="absolute inset-0 z-10 overflow-hidden"
        style={{ willChange: 'clip-path' }}
        initial={{
          clipPath: isLeft ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)',
        }}
        animate={{ clipPath: 'inset(0 0 0 0)' }}
        transition={{
          duration: (animSpeed / 1000) * 1.5,
          ease: 'easeOut' as const,
        }}
        onAnimationComplete={onComplete}
      >
        <ImageWithFallback
          image={{ url: imageSrc }}
          alt=""
          isUseNativeImage
          style={{
            position: 'absolute',
            height: '100%',
            width: 'auto',
            minWidth: '100%',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </motion.div>
    );
  },
);

SlideInOverlay.displayName = 'SlideInOverlay';

export default SlideInOverlay;

