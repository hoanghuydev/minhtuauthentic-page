import { useRef } from 'react';
import { ImageDto } from '@/dtos/Image.dto';
import { ProductDto } from '@/dtos/Product.dto';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';

interface PopupSlideContentProps {
  image: ImageDto;
  product: ProductDto;
  setIsOpen?: (item: { display: boolean; image: ImageDto | null }) => void;
  imageIndex?: number;
  totalImages?: number;
}

export default function PopupSlideContent({
  image,
  product,
  setIsOpen,
  imageIndex,
  totalImages,
}: PopupSlideContentProps) {
  const imageRef = useRef<HTMLDivElement>(null);

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (imageRef.current && !imageRef.current.contains(e.target as Node)) {
      setIsOpen && setIsOpen({ display: false, image: null });
    }
  };

  return (
    <div
      className="w-full h-full flex justify-center relative items-center select-none"
      onClick={handleBackgroundClick}
    >
      <div
        ref={imageRef}
        className="relative h-full select-none isolate pointer-events-auto"
      >
        <ImageWithFallback
          className={'object-contain h-full w-auto m-auto select-none'}
          image={image}
          alt={product.title || product.name}
          unoptimized={true}
          quality={100}
        />
        {imageIndex && totalImages && (
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white text-lg font-semibold tracking-[0.2em] px-3 py-1 rounded-[15px] z-[2]">
            {imageIndex}/{totalImages}
          </div>
        )}
      </div>
    </div>
  );
}
