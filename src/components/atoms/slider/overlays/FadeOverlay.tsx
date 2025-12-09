'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';

export interface FadeOverlayProps {
  imageSrc: string;
  animSpeed: number;
  onComplete: () => void;
}

/**
 * Fade animation overlay for slide transitions
 */
export const FadeOverlay = memo<FadeOverlayProps>(
  ({ imageSrc, animSpeed, onComplete }) => (
    <motion.div
      className="absolute inset-0 z-10 overflow-hidden"
      style={{ willChange: 'opacity' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: animSpeed / 1000, ease: 'easeOut' as const }}
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
  ),
);

FadeOverlay.displayName = 'FadeOverlay';

export default FadeOverlay;

