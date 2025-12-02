import { useMemo } from 'react';
import { TileGridProps, TileData } from '../types';
import { TILE_CONFIG, getTileDelay } from '../constants';

/**
 * TileGrid component for tile-based animations
 * Splits content into a grid of tiles that animate with staggered delays
 */
export const TileGrid = ({
  children,
  animationType,
  slideIndex,
}: TileGridProps) => {
  const { cols, rows } = TILE_CONFIG;

  // Generate tile data - memoized for performance
  const tiles = useMemo<TileData[]>(() => {
    const tileArray: TileData[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        tileArray.push({
          row,
          col,
          style: {
            '--tile-x': `${(col / cols) * 100}%`,
            '--tile-y': `${(row / rows) * 100}%`,
          } as React.CSSProperties,
        });
      }
    }
    return tileArray;
  }, [cols, rows]);

  return (
    <div
      className="banner-tile-grid"
      data-anim={animationType}
      data-cols={cols}
      data-rows={rows}
    >
      {tiles.map(({ row, col, style }, index) => {
        const delay = getTileDelay(row, col, rows, cols, animationType);

        return (
          <div
            key={`tile-${slideIndex}-${index}`}
            className="banner-tile"
            style={{ ...style, '--tile-delay': delay } as React.CSSProperties}
          >
            <div
              className="banner-tile-content"
              style={{
                transform: `translate(calc(-1 * var(--tile-x)), calc(-1 * var(--tile-y)))`,
                width: `${cols * 100}%`,
                height: `${rows * 100}%`,
              }}
            >
              {children}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TileGrid;

