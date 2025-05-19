import { ProductDto } from '@/dtos/Product.dto';
import { ImageDto } from '@/dtos/Image.dto';
import { VariantDto } from '@/dtos/Variant.dto';
import ImageMagnifier from '@/components/atoms/images/imageMaginifier';
import SectionSwiper from '@/components/organisms/sectionSwiper';
import { twMerge } from 'tailwind-merge';
import { useProductImageDetail } from '@/hooks/useProductImageDetail';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { useMemo, useState } from 'react';
import { useIsMobile } from '@/hooks/useDevice';

type Props = {
  product: ProductDto;
  containerClassName?: string;
  setIsOpen?: (item: { display: boolean; image: ImageDto | null }) => void;
};

const ProductDetailImage = ({
  product,
  containerClassName,
  setIsOpen,
}: Props) => {
  const { images, imageActive, setImageActive } = useProductImageDetail({});
  const isMobile = useIsMobile();
  const [isMainImageLoaded, setIsMainImageLoaded] = useState(false);
  const [isThumbnailsLoaded, setIsThumbnailsLoaded] = useState(false);

  const handleClickImage = (image: ImageDto) => {
    if (image) {
      setImageActive(image);
    }
  };

  const renderSlideImage = useMemo(() => {
    return (
      <div className="relative">
        {/* Placeholder for thumbnails */}
        <div
          className={twMerge(
            'absolute inset-0 bg-gray-100 transition-opacity duration-150',
            isThumbnailsLoaded ? 'opacity-0' : 'opacity-100',
          )}
        />

        <SectionSwiper
          classNameContainer={'mt-3'}
          slidePerViewMobile={4}
          key={JSON.stringify(images)}
          classNameItems={
            'p-1 lg:hover:shadow-md transition-shadow duration-300 select-none lg:hover:border-primary border border-transparent'
          }
          renderItem={(item) => {
            const imageItem = item as ImageDto;
            return (
              <ImageWithFallback
                image={imageItem}
                className={
                  'w-full h-full object-contain hover:scale-105 select-none cursor-pointer border-[3px] border-[#e4e4e4]'
                }
                sizes="120px"
                onClick={() => handleClickImage(imageItem)}
                product={product}
                onMouseEnter={() => {
                  !isMobile && setImageActive(imageItem);
                }}
                unoptimized={false}
                onLoad={() => setIsThumbnailsLoaded(true)}
              />
            ) as any;
          }}
          slidesPerView={6}
          spaceBetween={10}
          data={images}
        />
      </div>
    );
  }, [imageActive, images]);

  return (
    <div className={twMerge(containerClassName)}>
      <div className="relative">
        {/* Placeholder for main image */}
        <div
          className={twMerge(
            'absolute inset-0 bg-gray-100 transition-opacity duration-150',
            isMainImageLoaded ? 'opacity-0' : 'opacity-100',
          )}
        />

        <ImageWithFallback
          image={imageActive}
          className={
            'object-contain cursor-pointer bk-product-image select-none lg:max-w-[568px] w-full m-auto transition-opacity duration-150'
          }
          onClick={(image: ImageDto | null) => {
            setIsOpen && setIsOpen({ display: true, image });
          }}
          product={product}
          unoptimized={!isMobile}
          quality={100}
          onLoad={() => setIsMainImageLoaded(true)}
        />
      </div>
      {renderSlideImage}
    </div>
  );
};

export default ProductDetailImage;
