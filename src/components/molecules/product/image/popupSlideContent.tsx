import { useRef } from 'react';
import { ImageDto } from '@/dtos/Image.dto';
import { ProductDto } from '@/dtos/Product.dto';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';

interface PopupSlideContentProps {
  image: ImageDto;
  product: ProductDto;
  setIsOpen?: (item: { display: boolean; image: ImageDto | null }) => void;
}

export default function PopupSlideContent({
  image,
  product,
  setIsOpen,
}: PopupSlideContentProps) {
  const imageRef = useRef<HTMLDivElement>(null);

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (imageRef.current && !imageRef.current.contains(e.target as Node)) {
      setIsOpen && setIsOpen({ display: false, image: null });
    }
  };

  return (
    <div
      className="w-full h-full flex justify-center items-center select-none"
      onClick={handleBackgroundClick}
    >
      <div ref={imageRef} className="relative h-full select-none">
        <ImageWithFallback
          className={'object-contain h-full w-auto m-auto select-none'}
          image={image}
          alt={product.title || product.name}
          unoptimized={true}
          quality={100}
        />
      </div>
    </div>
  );
}
