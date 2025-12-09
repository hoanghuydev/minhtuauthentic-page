'use client';

import React, { memo } from 'react';
import { Slice } from '../Slice';
import type { EffectType } from '../types';

export interface SliceData {
  originalIndex: number;
  renderIndex: number;
  delay: number;
  isLastToFinish: boolean;
}

export interface SliceOverlayProps {
  imageSrc: string;
  dimensions: { width: number; height: number };
  slices: number;
  sliceData: SliceData[];
  effect: EffectType;
  animSpeed: number;
  activeIndex: number;
  onComplete: () => void;
}

/**
 * Slice animation overlay for slice-based transitions
 * Renders multiple Slice components with precomputed delays
 */
export const SliceOverlay = memo<SliceOverlayProps>(
  ({
    imageSrc,
    dimensions,
    slices,
    sliceData,
    effect,
    animSpeed,
    activeIndex,
    onComplete,
  }) => {
    const { width, height } = dimensions;
    const sliceWidth = Math.ceil(width / slices);

    return (
      <div className="absolute inset-0 z-10 overflow-hidden">
        {sliceData.map((slice) => (
          <Slice
            key={`slice-${slice.originalIndex}-${activeIndex}`}
            index={slice.originalIndex}
            total={slices}
            width={width}
            height={height}
            sliceWidth={sliceWidth}
            imageSrc={imageSrc}
            animSpeed={animSpeed}
            effect={effect}
            delay={slice.delay}
            isLastToFinish={slice.isLastToFinish}
            onComplete={onComplete}
          />
        ))}
      </div>
    );
  },
);

SliceOverlay.displayName = 'SliceOverlay';

export default SliceOverlay;

