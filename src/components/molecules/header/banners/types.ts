import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import { BannerAnimationType } from '@/dtos/StaticContentProperty.dto';
import type { SwiperClass } from 'swiper/react';

/**
 * Props for the main Banners component
 */
export interface BannersProps {
  banners: StaticContentsDto[];
  className?: string;
  classNameImage?: string;
  isFull?: boolean;
  isSquareBannerMobile?: boolean;
}

/**
 * Props for Desktop/Mobile Banner components
 */
export interface BannerSwiperProps extends BannersProps {
  activeIndex: number;
  playToken: number;
  isMounted: boolean;
  onSlideChange: () => void;
  swiperRef: React.MutableRefObject<SwiperClass | null>;
}

/**
 * Props for AnimationWrapper component
 */
export interface AnimationWrapperProps {
  children: React.ReactNode;
  animationType: BannerAnimationType;
  slideIndex: number;
  isActive: boolean;
  playToken: number;
  isMounted: boolean;
}

/**
 * Props for TileGrid component
 */
export interface TileGridProps {
  children: React.ReactNode;
  animationType: BannerAnimationType;
  slideIndex: number;
}

/**
 * Tile data structure
 */
export interface TileData {
  row: number;
  col: number;
  style: React.CSSProperties;
}

/**
 * Banner swiper hook return type
 */
export interface UseBannerSwiperReturn {
  swiperRef: React.MutableRefObject<SwiperClass | null>;
  mobileSwiperRef: React.MutableRefObject<SwiperClass | null>;
  isLastSlide: boolean;
  isFirstSlide: boolean;
  activeIndex: number;
  playToken: number;
  isMounted: boolean;
  handleSlideChange: () => void;
  handleMobileSlideChange: () => void;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  setIsFirstSlide: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLastSlide: React.Dispatch<React.SetStateAction<boolean>>;
}

