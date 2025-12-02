import { TagLinkDto } from '@/dtos/tagLink.dto';
import { BLOCK_UNDER_CATEGORY_POSITION } from '@/config/enum';
import { VariantDto } from './Variant.dto';

// Animation types for banner slides (PowerPoint-like effects)
export type BannerAnimationType =
  // Basic animations
  | 'fade'
  | 'zoomIn'
  | 'zoomOut'
  | 'slideLeft'
  | 'slideRight'
  | 'slideUp'
  | 'slideDown'
  | 'rotateIn'
  | 'bounceIn'
  | 'flipX'
  | 'flipY'
  | 'scaleUp'
  | 'blur'
  | 'swing'
  // Static transitions (no movement)
  | 'dissolve'
  | 'iris'
  | 'wipeLeft'
  | 'wipeRight'
  | 'wipeUp'
  | 'wipeDown'
  | 'flash'
  | 'curtainH'
  | 'curtainV'
  // Tile/Grid animations
  | 'tiles'
  | 'tilesFlip'
  | 'tilesZoom'
  | 'tilesRotate'
  | 'blindsH'
  | 'blindsV'
  | 'checkerboard';

export class StaticComponentPropertyDto {
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  slug?: string;
  url?: string;
  tagLinks?: TagLinkDto[];
  position?: string;
  direction?: BLOCK_UNDER_CATEGORY_POSITION;
  position_index?: number;
  slug_mobile?: string;
  variants?: VariantDto[];
  duration?: number; // in seconds
  animation?: BannerAnimationType; // Animation type for banner slide
}
