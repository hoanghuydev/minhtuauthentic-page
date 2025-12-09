'use client';

import React, { memo } from 'react';
import { twMerge } from 'tailwind-merge';

export interface PaginationDotProps {
  index: number;
  isActive: boolean;
  onClick: () => void;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

/**
 * Single pagination dot for slider control navigation
 */
export const PaginationDot = memo<PaginationDotProps>(
  ({
    index,
    isActive,
    onClick,
    className,
    activeClassName = 'bg-white scale-110',
    inactiveClassName = 'bg-white/70 hover:bg-white/90',
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={twMerge(
        'w-2 h-2 rounded-full transition-all duration-300',
        isActive ? activeClassName : inactiveClassName,
        className,
      )}
      aria-label={`Go to slide ${index + 1}`}
    />
  ),
);

PaginationDot.displayName = 'PaginationDot';

export default PaginationDot;

