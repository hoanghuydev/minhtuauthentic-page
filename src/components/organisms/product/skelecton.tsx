import React from 'react';
import { twMerge } from 'tailwind-merge';

const SkeletonProductCard = ({ className }: { className?: string }) => {
  return (
    <div className={twMerge('bg-white p-2 rounded shadow-sm', className)}>
      <div className="aspect-square bg-white animate-pulse mb-2"></div>
      <div className="h-4 bg-white animate-pulse mb-2 w-3/4"></div>
      <div className="h-4 bg-white animate-pulse w-1/2"></div>
      <div className="mt-2 h-8 bg-white animate-pulse rounded"></div>
    </div>
  );
};

export default SkeletonProductCard;
