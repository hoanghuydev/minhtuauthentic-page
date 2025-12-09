import { ReactNode } from 'react';

export type EffectType =
  | 'random'
  | 'fade'
  | 'fold'
  | 'sliceDown'
  | 'sliceDownRight'
  | 'sliceDownLeft'
  | 'sliceUp'
  | 'sliceUpRight'
  | 'sliceUpLeft'
  | 'sliceUpDown'
  | 'sliceUpDownLeft'
  | 'sliceUpDownRight'
  | 'slideInRight'
  | 'slideInLeft'
  | 'boxRandom'
  | 'boxRain'
  | 'boxRainReverse'
  | 'boxRainGrow'
  | 'boxRainGrowReverse';

export interface SliderContextProps {
  activeIndex: number;
  totalSlides: number;
  slideTo: (index: number) => void;
  slideNext: () => void;
  slidePrev: () => void;
  isAnimating: boolean;
}

export interface NivoSliderProps {
  children: ReactNode;
  effect?: EffectType;
  slices?: number;
  boxCols?: number;
  boxRows?: number;
  animSpeed?: number;
  pauseTime?: number;
  startSlide?: number;
  directionNav?: boolean;
  controlNav?: boolean;
  pauseOnHover?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  prevIcon?: ReactNode;
  nextIcon?: ReactNode;
  onSlideChange?: (index: number) => void;
  renderPagination?: (props: {
    activeIndex: number;
    totalSlides: number;
    slideTo: (index: number) => void;
  }) => ReactNode;
}

export interface SlideProps {
  children: ReactNode;
  className?: string;
}

export interface SliceProps {
  index: number;
  total: number;
  width: number;
  height: number;
  sliceWidth: number;
  imageSrc: string;
  animSpeed: number;
  effect: EffectType;
  onComplete?: () => void;
  /** True if this slice finishes last (based on delay calculation) */
  isLastToFinish?: boolean;
  /** Precomputed delay in seconds */
  delay: number;
}

export interface BoxProps {
  row: number;
  col: number;
  totalRows: number;
  totalCols: number;
  width: number;
  height: number;
  boxWidth: number;
  boxHeight: number;
  imageSrc: string;
  animSpeed: number;
  effect: EffectType;
  /** Precomputed delay in seconds */
  delay: number;
  onComplete?: () => void;
  /** True if this box finishes last (based on delay calculation) */
  isLastToFinish?: boolean;
}
