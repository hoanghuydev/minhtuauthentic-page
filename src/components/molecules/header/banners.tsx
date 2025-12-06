import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import { generateSlugToHref } from '@/utils';
import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import type { SwiperClass } from 'swiper/react';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { twMerge } from 'tailwind-merge';
import { BannerAnimationType } from '@/dtos/StaticContentProperty.dto';

// All available animation types
const ANIMATION_TYPES: BannerAnimationType[] = [
  // Basic animations
  // 'fade',
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
  // Static transitions (no movement)
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

// Tile-based animations that need grid rendering
const TILE_ANIMATIONS: BannerAnimationType[] = [
  'tiles',
  'tilesFlip',
  'tilesZoom',
  'tilesRotate',
  'blindsH',
  'blindsV',
  'checkerboard',
];

// Check if animation needs tile grid
const isTileAnimation = (anim: BannerAnimationType): boolean =>
  TILE_ANIMATIONS.includes(anim);

// Grid configuration for tile animations
const TILE_CONFIG = {
  cols: 6, // 6 columns
  rows: 4, // 4 rows = 24 tiles total
};

// Generate delay patterns for different tile animations
const getTileDelay = (
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
      // Diagonal wave pattern
      return row + col;
    case 'blindsH':
      // Top to bottom
      return row;
    case 'blindsV':
      // Left to right
      return col;
    case 'checkerboard':
      // Checkerboard pattern (alternating)
      return (row + col) % 2 === 0 ? 0 : totalCols;
    default:
      return row * totalCols + col;
  }
};

// Get animation type for a slide - deterministic based on index to avoid hydration issues
const getAnimationType = (
  customAnimation: BannerAnimationType | undefined,
  index: number,
): BannerAnimationType => {
  // Use custom animation if provided
  if (customAnimation && ANIMATION_TYPES.includes(customAnimation)) {
    return customAnimation;
  }
  // Otherwise cycle through animations based on index (deterministic)
  return ANIMATION_TYPES[index % ANIMATION_TYPES.length];
};

export const Banners = ({
  banners,
  className,
  classNameImage,
  isFull = false,
  isSquareBannerMobile = false,
}: {
  banners: StaticContentsDto[];
  className?: string;
  classNameImage?: string;
  isFull?: boolean;
  isSquareBannerMobile?: boolean;
}) => {
  const swiperRef = useRef<SwiperClass | null>(null);
  const mobileSwiperRef = useRef<SwiperClass | null>(null);
  const [isLastSlide, setIsLastSlide] = useState(false);
  const [isFirstSlide, setIsFirstSlide] = useState(true);

  // State to track active slide and force animation restart
  const [activeIndex, setActiveIndex] = useState(0);
  const [playToken, setPlayToken] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side mounting to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Hàm xử lý kiểm tra slide đầu/cuối và cập nhật animation state
  const handleSlideChange = useCallback(() => {
    if (!swiperRef.current) return;

    const swiper = swiperRef.current;
    const isLast = swiper.isEnd;
    const isFirst = swiper.isBeginning;

    setIsLastSlide(isLast);
    setIsFirstSlide(isFirst);

    // Update active index and increment playToken to restart animation
    setActiveIndex(swiper.activeIndex);
    setPlayToken((prev) => prev + 1);
  }, []);

  // Handle mobile slide change
  const handleMobileSlideChange = useCallback(() => {
    if (!mobileSwiperRef.current) return;
    setActiveIndex(mobileSwiperRef.current.activeIndex);
    setPlayToken((prev) => prev + 1);
  }, []);

  // Cấu hình swiper cho desktop
  const desktopSwiperConfig = {
    effect: isFull ? ('fade' as const) : undefined,
    spaceBetween: 50,
    slidesPerView: 1,
    pagination: true,
    navigation: true,
    modules: [Pagination, Autoplay, Navigation],
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    loop: false,
    onSwiper: (swiper: SwiperClass) => {
      swiperRef.current = swiper;
      setIsFirstSlide(swiper.isBeginning);
      setIsLastSlide(swiper.isEnd);
      setActiveIndex(swiper.activeIndex);
    },
    onSlideChange: handleSlideChange,
  };

  // Cấu hình swiper cho mobile
  const mobileSwiperConfig = {
    spaceBetween: 0,
    slidesPerView: 1,
    pagination: {
      clickable: true,
    },
    modules: [Pagination, Autoplay],
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    loop: false,
    onSwiper: (swiper: SwiperClass) => {
      mobileSwiperRef.current = swiper;
    },
    onSlideChange: handleMobileSlideChange,
  };

  // Generate tile grid for tile-based animations
  const tiles = useMemo(() => {
    const { cols, rows } = TILE_CONFIG;
    const tileArray: Array<{
      row: number;
      col: number;
      style: React.CSSProperties;
    }> = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        tileArray.push({
          row,
          col,
          style: {
            // Position each tile to show the correct portion of the image
            '--tile-x': `${(col / cols) * 100}%`,
            '--tile-y': `${(row / rows) * 100}%`,
          } as React.CSSProperties,
        });
      }
    }
    return tileArray;
  }, []);

  // Render tile grid overlay for tile animations
  const renderTileGrid = (
    children: React.ReactNode,
    animationType: BannerAnimationType,
    slideIndex: number,
  ) => {
    const { cols, rows } = TILE_CONFIG;

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
              style={
                {
                  ...style,
                  '--tile-delay': delay,
                } as React.CSSProperties
              }
            >
              {/* Each tile shows a portion of the content using CSS clip */}
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

  // Render animation wrapper for slide content
  const renderAnimationWrapper = (
    children: React.ReactNode,
    animationType: BannerAnimationType,
    slideIndex: number,
    isActive: boolean,
  ) => {
    // Use playToken in key only for active slide to force re-render and restart animation
    const key = isActive
      ? `anim-${slideIndex}-${playToken}`
      : `anim-${slideIndex}`;

    // Determine actual animation type (use fade on SSR for hydration safety)
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
        {needsTileGrid && renderTileGrid(children, animationType, slideIndex)}
      </div>
    );
  };

  // Render desktop banners
  const renderDesktopBanners = () => (
    <div
      className={twMerge(
        'relative banner-container h-full hidden lg:!block',
        isLastSlide && 'hide-next-button',
        isFirstSlide && 'hide-prev-button',
      )}
      onMouseEnter={() => swiperRef.current?.autoplay.stop()}
      onMouseLeave={() => swiperRef.current?.autoplay.start()}
    >
      <Swiper className={className} {...desktopSwiperConfig}>
        {banners.map((banner, index) => {
          const imageDetail = banner?.images?.[0];
          if (!imageDetail) return null;

          // Get animation type from banner properties or use default based on index
          const animationType = getAnimationType(
            banner?.properties?.animation,
            index,
          );
          const isActive = index === activeIndex;

          const imageElement = (
            <ImageWithFallback
              image={imageDetail.image}
              alt={imageDetail.image?.alt || 'minhtuauthentic'}
              className={twMerge(
                'object-contain w-full h-full',
                classNameImage,
              )}
              loading="eager"
              priority={index === 0} // High priority for first banner
              unoptimized={true}
              sizes="100vw"
              quality={100}
            />
          );

          const slideContent = (
            <Link href={generateSlugToHref(banner?.properties?.slug)}>
              {imageElement}
            </Link>
          );

          return (
            <SwiperSlide
              key={`desktop-${index}`}
              className="w-full"
              style={{ width: '100% !important' }}
            >
              {renderAnimationWrapper(
                slideContent,
                animationType,
                index,
                isActive,
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );

  // Render mobile banners
  const renderMobileBanners = () => {
    // Filter banners that have mobile display enabled and mobile images
    let mobileBanners = banners.filter(
      (banner) =>
        banner.is_mobile_visible &&
        banner.images_mobile &&
        banner.images_mobile.length > 0,
    );

    // Chỉ khi không có banner mobile nào thì mới sử dụng banner PC
    const shouldUsePcBanners = mobileBanners.length === 0;
    const displayBanners = shouldUsePcBanners ? banners : mobileBanners;

    return (
      <div className="w-full lg:!hidden">
        <Swiper className="w-full" {...mobileSwiperConfig}>
          {displayBanners.map((banner, index) => {
            // Nếu sử dụng PC banner thì lấy từ images, nếu không thì lấy từ images_mobile
            const imageDetail = shouldUsePcBanners
              ? banner?.images?.[0]
              : banner.images_mobile?.[0];

            if (!imageDetail) return null;

            // Get animation type from banner properties or use default based on index
            const animationType = getAnimationType(
              banner?.properties?.animation,
              index,
            );
            const isActive = index === activeIndex;

            const imageElement = (
              <div
                className={twMerge(
                  'w-full',
                  isSquareBannerMobile && 'aspect-square',
                )}
              >
                <ImageWithFallback
                  image={imageDetail.image}
                  alt={imageDetail.image?.alt || 'minhtuauthentic'}
                  className="object-cover w-full h-full"
                  loading="eager"
                  priority={index === 0} // High priority for first mobile banner
                  unoptimized={false}
                  sizes="100vw"
                  quality={80}
                />
              </div>
            );

            const slideContent = (
              <Link
                href={generateSlugToHref(
                  banner?.properties?.slug_mobile || banner?.properties?.slug,
                )}
              >
                {imageElement}
              </Link>
            );

            return (
              <SwiperSlide
                key={`mobile-${index}`}
                className="w-full"
                style={{ width: '100% !important' }}
              >
                {renderAnimationWrapper(
                  slideContent,
                  animationType,
                  index,
                  isActive,
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    );
  };

  return (
    <>
      {renderDesktopBanners()}
      {renderMobileBanners()}
    </>
  );
};

export default Banners;
