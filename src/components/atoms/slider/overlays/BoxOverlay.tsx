'use client';

import React, { memo } from 'react';
import { Box } from '../Box';
import type { EffectType } from '../types';

export interface BoxData {
  row: number;
  col: number;
  delay: number;
  isLastToFinish: boolean;
}

export interface BoxOverlayProps {
  imageSrc: string;
  dimensions: { width: number; height: number };
  boxCols: number;
  boxRows: number;
  boxData: BoxData[];
  effect: EffectType;
  animSpeed: number;
  activeIndex: number;
  onComplete: () => void;
}

/**
 * Box animation overlay for box-based transitions
 * Renders multiple Box components with precomputed delays
 */
export const BoxOverlay = memo<BoxOverlayProps>(
  ({
    imageSrc,
    dimensions,
    boxCols,
    boxRows,
    boxData,
    effect,
    animSpeed,
    activeIndex,
    onComplete,
  }) => {
    const { width, height } = dimensions;
    const boxWidth = Math.ceil(width / boxCols);
    const boxHeight = Math.ceil(height / boxRows);

    return (
      <div className="absolute inset-0 z-10 overflow-hidden">
        {boxData.map((box) => (
          <Box
            key={`box-${box.row}-${box.col}-${activeIndex}`}
            row={box.row}
            col={box.col}
            totalRows={boxRows}
            totalCols={boxCols}
            width={width}
            height={height}
            boxWidth={boxWidth}
            boxHeight={boxHeight}
            imageSrc={imageSrc}
            animSpeed={animSpeed}
            effect={effect}
            delay={box.delay}
            isLastToFinish={box.isLastToFinish}
            onComplete={onComplete}
          />
        ))}
      </div>
    );
  },
);

BoxOverlay.displayName = 'BoxOverlay';

export default BoxOverlay;

