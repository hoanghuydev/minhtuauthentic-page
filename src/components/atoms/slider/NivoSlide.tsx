'use client';

import { twMerge } from 'tailwind-merge';
import type { SlideProps } from './types';

export const NivoSlide: React.FC<SlideProps> = ({ children, className }) => {
  return <div className={twMerge('w-full h-full', className)}>{children}</div>;
};

// Add displayName for component identification in NivoSlider
NivoSlide.displayName = 'NivoSlide';

export default NivoSlide;
