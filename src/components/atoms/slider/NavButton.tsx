'use client';

import React, { memo } from 'react';
import { twMerge } from 'tailwind-merge';
import LeftOutlined from '@ant-design/icons/lib/icons/LeftOutlined';
import RightOutlined from '@ant-design/icons/lib/icons/RightOutlined';

export interface NavButtonProps {
  direction: 'prev' | 'next';
  onClick: () => void;
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Navigation button for slider prev/next controls
 * Uses Ant Design icons as defaults
 */
export const NavButton = memo<NavButtonProps>(
  ({ direction, onClick, icon, className }) => {
    const defaultIcon =
      direction === 'prev' ? (
        <LeftOutlined style={{ fontSize: 18 }} />
      ) : (
        <RightOutlined style={{ fontSize: 18 }} />
      );

    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }}
        className={twMerge(
          'absolute top-1/2 -translate-y-1/2 z-20',
          'bg-black/30 hover:bg-black/50 text-white',
          'w-10 h-10 rounded-full',
          'flex items-center justify-center',
          'transition-all opacity-70 hover:opacity-100 cursor-pointer',
          direction === 'prev' ? 'left-4' : 'right-4',
          className,
        )}
        aria-label={direction === 'prev' ? 'Previous slide' : 'Next slide'}
      >
        {icon || defaultIcon}
      </button>
    );
  },
);

NavButton.displayName = 'NavButton';

export default NavButton;

