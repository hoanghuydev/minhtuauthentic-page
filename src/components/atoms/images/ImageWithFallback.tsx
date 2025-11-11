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
  onLoadingComplete?: () => void;
  itemProp?: string;
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
  onLoadingComplete,
  itemProp,
}: Props) => {
  const [imgActiveSrc, setImageActiveSrc] = useState<string | StaticImageData>(
     image?.url || image?.thumbnail_url || noImage
  );
  const ref = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    setImageActiveSrc(
       image?.url || image?.thumbnail_url || noImage
    );
  }, [image]);
  const renderImage = () => {
    const imageElement = isFill ? (
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
        onLoad={() => onLoadingComplete && onLoadingComplete()}
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
        onLoad={() => onLoadingComplete && onLoadingComplete()}
      />
    );

    return itemProp ? (
      <div itemProp={itemProp}>
        {imageElement}
      </div>
    ) : (
      imageElement
    );
  };

  const renderNativeImage = () => {
    const imgElement = (
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
        onLoad={() => onLoadingComplete && onLoadingComplete()}
        itemProp={itemProp}
      />
    );

    return imgElement;
  };

  return <>{isUseNativeImage ? renderNativeImage() : renderImage()}</>;
};
export default ImageWithFallback;
