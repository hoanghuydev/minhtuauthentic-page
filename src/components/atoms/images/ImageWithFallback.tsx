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
};
const ImageWithFallback = ({
  image,
  isFill,
  onMouseEnter,
  onMouseLeave,
  onClick,
  alt,
  className,
  loading,
  priority,
  unoptimized,
  quality,
  product,
  isUseNativeImage,
  sizes = '(max-width: 768px) 100vw, 33vw',
}: Props) => {
  const isMobile = useIsMobile();
  const [imgActiveSrc, setImageActiveSrc] = useState<string | StaticImageData>(
    isMobile
      ? image?.thumbnail_url || image?.url || noImage
      : image?.url || noImage,
  );
  const ref = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    setImageActiveSrc(
      isMobile
        ? image?.thumbnail_url || image?.url || noImage
        : image?.url || noImage,
    );
  }, [image]);
  const renderImage = () => {
    return (
      <>
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
            className={twMerge(className, 'select-none')}
            unoptimized={unoptimized == null ? true : unoptimized}
            onError={() => {
              setImageActiveSrc(noImage);
            }}
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
            className={twMerge(className, 'select-none')}
            quality={quality || 70}
            onError={() => {
              setImageActiveSrc(noImage);
            }}
            sizes={sizes}
            loading={loading}
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPs7u2tBwAFdgImpqLKKAAAAABJRU5ErkJggg=="
          />
        )}
      </>
    );
  };

  const renderNativeImage = () => {
    return (
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
        className={'select-none'}
      />
    );
  };

  return <>{isUseNativeImage ? renderNativeImage() : renderImage()}</>;
};
export default ImageWithFallback;
