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

  useEffect(() => {
    const src = isMobile
      ? image?.thumbnail_url || image?.url || noImage
      : image?.url || noImage;

    setImageActiveSrc(src);
    setIsLoaded(false);

    // Kiểm tra nếu ảnh đã được tải từ cache
    const img = new window.Image();
    img.src = typeof src === 'string' ? src : src.src;
    if (img.complete) {
      setIsLoaded(true);
    }
  }, [image, isMobile]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad && onLoad();
  };

  const handleImageError = () => {
    setImageActiveSrc(noImage);
    setIsLoaded(true);
  };

  const renderImage = () => {
    return (
      <div className="relative h-full w-full">
        {isLazy && !isLoaded && (
          <div
            className={twMerge(
              'absolute inset-0 bg-gray-200 transition-opacity duration-100',
              isLoaded ? 'opacity-0' : 'opacity-100',
            )}
          />
        )}

        {isFill ? (
          <Image
            ref={ref}
            onClick={() => image && onClick?.(image)}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            src={imgActiveSrc}
            alt={alt || image?.alt || product?.title || product?.name || ''}
            fill={true}
            className={twMerge(
              className,
              'select-none transition-opacity duration-100',
            )}
            unoptimized={unoptimized ?? true}
            onError={handleImageError}
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
            onClick={() => image && onClick?.(image)}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            src={imgActiveSrc}
            alt={alt || image?.alt || product?.title || product?.name || ''}
            width={image?.width || 0}
            height={image?.height || 0}
            unoptimized={unoptimized ?? true}
            priority={priority}
            className={twMerge(
              className,
              'select-none transition-opacity duration-100',
            )}
            quality={quality || 70}
            onError={handleImageError}
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
        {isLazy && !isLoaded && (
          <div
            className={twMerge(
              'absolute inset-0 bg-gray-200 transition-opacity duration-100',
              isLoaded ? 'opacity-50' : 'opacity-100',
            )}
          />
        )}

        <img
          src={imgActiveSrc.toString()}
          onClick={() => image && onClick?.(image)}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          alt={alt || image?.alt || product?.title || product?.name || ''}
          width={image?.width || 0}
          height={image?.height || 0}
          className={twMerge('select-none transition-opacity duration-100')}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
    );
  };

  return <>{isUseNativeImage ? renderNativeImage() : renderImage()}</>;
};

export default ImageWithFallback;
