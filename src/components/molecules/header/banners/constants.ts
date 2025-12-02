import { BannerAnimationType } from '@/dtos/StaticContentProperty.dto';

/**
 * All available animation types for banner slides
 * Comment out any animations you don't want in the rotation
 */
const ANIMATION_TYPES: BannerAnimationType[] = [
  'fade',
  'zoomIn',
  // 'zoomOut',
  // Tile/Grid animations
  // 'tiles',
  'tilesFlip',
  'tilesZoom',
  'dissolve',
  // 'blindsH',
  'blindsV',
  'checkerboard',
  // 'iris',
  'wipeLeft',
  // 'wipeRight',
  'curtainH',
  'flash',
  'blur',
  // 'curtainV',
  'slideLeft',
  'slideRight',
  'rotateIn',
  'bounceIn',
  'flipX',
  'flipY',
  'scaleUp',
  'swing',
];

/**
 * Tile-based animations that need grid rendering
 */
export const TILE_ANIMATIONS: BannerAnimationType[] = [
  'tiles',
  'tilesFlip',
  'tilesZoom',
  'tilesRotate',
  'blindsH',
  'blindsV',
  'checkerboard',
];

/**
 * Grid configuration for tile animations
 */
export const TILE_CONFIG = {
  cols: 6,
  rows: 4,
} as const;

/**
 * Swiper autoplay delay in milliseconds
 */
export const AUTOPLAY_DELAY = 4000;

/**
 * Check if animation needs tile grid
 */
export const isTileAnimation = (anim: BannerAnimationType): boolean =>
  TILE_ANIMATIONS.includes(anim);

/**
 * Get animation type for a slide - deterministic based on index
 */
export const getAnimationType = (
  customAnimation: BannerAnimationType | undefined,
  index: number,
): BannerAnimationType => {
  if (customAnimation && ANIMATION_TYPES.includes(customAnimation)) {
    return customAnimation;
  }
  return ANIMATION_TYPES[index % ANIMATION_TYPES.length];
};

/**
 * Generate delay patterns for different tile animations
 */
export const getTileDelay = (
  row: number,
  col: number,
  totalRows: number,
  totalCols: number,
  animType: BannerAnimationType,
): number => {
  switch (animType) {
    case 'tiles':
    case 'tilesFlip':
    case 'tilesZoom':
    case 'tilesRotate':
      return row + col; // Diagonal wave
    case 'blindsH':
      return row; // Top to bottom
    case 'blindsV':
      return col; // Left to right
    case 'checkerboard':
      return (row + col) % 2 === 0 ? 0 : totalCols; // Alternating
    default:
      return row * totalCols + col;
  }
};
