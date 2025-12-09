import React from 'react';
import type { EffectType } from './types';

export const guid = () => Math.random().toString(36).substring(2, 9);

const RANDOM_EFFECTS: EffectType[] = [
  'fade',
  'sliceDownRight',
  'sliceDownLeft',
  'sliceUpRight',
  'sliceUpLeft',
  'sliceUpDown',
  'fold',
  'slideInRight',
  'slideInLeft',
  'boxRandom',
  'boxRain',
  'boxRainReverse',
  'boxRainGrow',
  'boxRainGrowReverse',
];

export const getRandomEffect = (): EffectType => {
  return RANDOM_EFFECTS[Math.floor(Math.random() * RANDOM_EFFECTS.length)];
};

// Slice effects
export const SLICE_EFFECTS: EffectType[] = [
  'fold',
  'sliceDown',
  'sliceDownRight',
  'sliceDownLeft',
  'sliceUp',
  'sliceUpRight',
  'sliceUpLeft',
  'sliceUpDown',
  'sliceUpDownLeft',
  'sliceUpDownRight',
];

export const isSliceEffect = (effect: EffectType) =>
  SLICE_EFFECTS.includes(effect);

export const isLeftEffect = (effect: EffectType) =>
  effect === 'sliceDownLeft' ||
  effect === 'sliceUpLeft' ||
  effect === 'sliceUpDownLeft';

export const isReverseBoxEffect = (effect: EffectType) =>
  effect === 'boxRainReverse' || effect === 'boxRainGrowReverse';

export const isGrowBoxEffect = (effect: EffectType) =>
  effect === 'boxRainGrow' || effect === 'boxRainGrowReverse';

// Props interface for image extraction
interface ImageProps {
  src?: string | { src?: string };
  image?: {
    url?: string;
    thumbnail_url?: string;
  };
  children?: React.ReactNode;
}

// Extract image URL from React element tree
export const getImageSrc = (slide: React.ReactElement): string => {
  const findImage = (element: React.ReactElement): string | null => {
    if (!element || !element.props) return null;

    // Cast props to ImageProps for type safety
    const props = element.props as ImageProps;

    // Check if element is an img
    if (element.type === 'img' && props.src) {
      return typeof props.src === 'string' ? props.src : props.src?.src || '';
    }

    // Check for Next.js Image or custom image component (ImageWithFallback)
    if (props.image?.url) {
      return props.image.url;
    }

    if (props.image?.thumbnail_url) {
      return props.image.thumbnail_url;
    }

    if (props.src) {
      return typeof props.src === 'string' ? props.src : props.src?.src || '';
    }

    // Recursively search children
    const children = props.children;
    if (children) {
      if (Array.isArray(children)) {
        for (const child of children) {
          if (React.isValidElement(child)) {
            const found = findImage(child);
            if (found) return found;
          }
        }
      } else if (React.isValidElement(children)) {
        return findImage(children);
      }
    }

    return null;
  };

  return findImage(slide) || '';
};
