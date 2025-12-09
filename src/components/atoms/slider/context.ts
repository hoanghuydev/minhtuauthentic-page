'use client';

import { createContext, useContext } from 'react';
import type { SliderContextProps } from './types';

export const SliderContext = createContext<SliderContextProps | null>(null);

export const useSlider = () => {
  const context = useContext(SliderContext);
  if (!context) {
    throw new Error('useSlider must be used within NivoSlider');
  }
  return context;
};
