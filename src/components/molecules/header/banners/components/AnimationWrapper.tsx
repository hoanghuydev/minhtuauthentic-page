import { AnimationWrapperProps } from '../types';
import { isTileAnimation } from '../constants';
import { TileGrid } from './TileGrid';

/**
 * AnimationWrapper component
 * Wraps slide content with animation data attributes
 * Handles both regular animations and tile-based animations
 */
export const AnimationWrapper = ({
  children,
  animationType,
  slideIndex,
  isActive,
  playToken,
  isMounted,
}: AnimationWrapperProps) => {
  // Use playToken in key only for active slide to force re-render and restart animation
  const key = isActive
    ? `anim-${slideIndex}-${playToken}`
    : `anim-${slideIndex}`;

  // Use fade on SSR for hydration safety
  const actualAnimType = isMounted ? animationType : 'fade';
  const needsTileGrid = isMounted && isTileAnimation(animationType);

  return (
    <div
      key={key}
      className="banner-anim-wrapper relative"
      data-anim={actualAnimType}
    >
      {/* Base content (hidden when tile animation is active) */}
      <div className="banner-tile-base">{children}</div>

      {/* Tile grid overlay for tile animations */}
      {needsTileGrid && (
        <TileGrid
          animationType={animationType}
          slideIndex={slideIndex}
        >
          {children}
        </TileGrid>
      )}
    </div>
  );
};

export default AnimationWrapper;

