import { ImageDto } from '@/dtos/Image.dto';
import Image, { StaticImageData } from 'next/image';
import { useEffect, useRef, useState } from 'react';
import noImage from '@/static/images/no-image.png';
import { ProductDto } from '@/dtos/Product.dto';
import { twMerge } from 'tailwind-merge';
import { useIsMobile } from '@/hooks/useDevice';

type Props = {
  image: ImageDto | null | undefined;
  isFill?: boolean;
  onMouseEnter?: (event: unknown) => void;
  onClick?: (image: ImageDto) => void;
  alt?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  unoptimized?: boolean;
  quality?: number;
  product?: ProductDto;
  isUseNativeImage?: boolean;
  onMouseLeave?: (event: unknown) => void;
  sizes?: string;
  onLoad?: () => void;
  duration?: number;
  isLazy?: boolean;
};

const ImageWithFallback = ({
  image,
  isFill,
  onMouseEnter,
  onMouseLeave,
  onClick,
  alt,
  className,
  loading = 'lazy',
  priority,
  unoptimized,
  quality,
  product,
  isUseNativeImage,
  sizes = '(max-width: 768px) 100vw, 33vw',
  onLoad,
  duration = 200,
  isLazy = true,
}: Props) => {
  const isMobile = useIsMobile();
  const [imgActiveSrc, setImageActiveSrc] = useState<string | StaticImageData>(
    isMobile
      ? image?.thumbnail_url || image?.url || noImage
      : image?.url || noImage,
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLImageElement | null>(null);
  const style = {
    transitionDuration: `${duration}ms`,
  };

  // Pre-load the image to check if it's already in cache
  useEffect(() => {
    const src = isMobile
      ? image?.thumbnail_url || image?.url || noImage
      : image?.url || noImage;

    setImageActiveSrc(src);
    setIsLoaded(false);

    // Check if image is already cached
    if (typeof src === 'string') {
      const img = new window.Image();
      img.src = src;

      if (img.complete) {
        setIsLoaded(true);
        onLoad && onLoad();
      }
    }
  }, [image, isMobile, onLoad]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad && onLoad();
  };

  const renderImage = () => {
    return (
      <div className="relative">
        {/* Gray placeholder */}
        {isLazy && !isLoaded && (
          <div
            className={twMerge(
              'absolute inset-0 bg-gray-200 transition-opacity',
              isLoaded ? 'opacity-0' : 'opacity-100',
            )}
            style={style}
          />
        )}

        {isFill ? (
          <Image
            ref={ref}
            onClick={() => {
              onClick && image && onClick(image);
            }}
            onMouseEnter={(e) => onMouseEnter && onMouseEnter(e)}
            onMouseLeave={(e) => onMouseLeave && onMouseLeave(e)}
            src={imgActiveSrc}
            alt={alt || image?.alt || product?.title || product?.name || ''}
            fill={true}
            className={twMerge(
              className,
              'select-none transition-opacity',
              isLazy && !isLoaded ? 'opacity-0' : 'opacity-100',
            )}
            style={{
              transitionDuration: `${duration}ms`,
            }}
            unoptimized={unoptimized == null ? true : unoptimized}
            onError={() => {
              setImageActiveSrc(noImage);
            }}
            onLoad={handleImageLoad}
            sizes={sizes}
            priority={priority}
            loading={loading}
            quality={quality || 70}
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPs7u2tBwAFdgImpqLKKAAAAABJRU5ErkJggg=="
          />
        ) : (
          <Image
            ref={ref}
            onClick={() => {
              onClick && image && onClick(image);
            }}
            onMouseEnter={(e) => {
              onMouseEnter && onMouseEnter(e);
            }}
            onMouseLeave={(e) => onMouseLeave && onMouseLeave(e)}
            src={imgActiveSrc}
            alt={alt || image?.alt || product?.title || product?.name || ''}
            width={image?.width || 0}
            height={image?.height || 0}
            unoptimized={unoptimized == null ? true : unoptimized}
            priority={priority}
            className={twMerge(
              className,
              'select-none transition-opacity',
              isLazy && !isLoaded ? 'opacity-0' : 'opacity-100',
            )}
            style={style}
            quality={quality || 70}
            onError={() => {
              setImageActiveSrc(noImage);
            }}
            onLoad={handleImageLoad}
            sizes={sizes}
            loading={loading}
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPs7u2tBwAFdgImpqLKKAAAAABJRU5ErkJggg=="
          />
        )}
      </div>
    );
  };

  const renderNativeImage = () => {
    return (
      <div className="relative">
        {/* Gray placeholder */}
        {isLazy && !isLoaded && (
          <div
            className={twMerge(
              'absolute inset-0 bg-gray-200 transition-opacity',
              isLoaded ? 'opacity-0' : 'opacity-100',
            )}
            style={style}
          />
        )}

        <img
          src={imgActiveSrc.toString()}
          onClick={() => {
            onClick && image && onClick(image);
          }}
          onMouseEnter={(e) => {
            onMouseEnter && onMouseEnter(e);
          }}
          onMouseLeave={(e) => onMouseLeave && onMouseLeave(e)}
          alt={alt || image?.alt || product?.title || product?.name || ''}
          width={image?.width || 0}
          height={image?.height || 0}
          className={twMerge(
            'select-none transition-opacity',
            isLazy && !isLoaded ? 'opacity-0' : 'opacity-100',
          )}
          style={style}
          onLoad={handleImageLoad}
        />
      </div>
    );
  };

  return <>{isUseNativeImage ? renderNativeImage() : renderImage()}</>;
};

export default ImageWithFallback;
