import { ProductDto } from '@/dtos/Product.dto';
import { ImageDto } from '@/dtos/Image.dto';
import { VariantDto } from '@/dtos/Variant.dto';
import ImageMagnifier from '@/components/atoms/images/imageMaginifier';
import SectionSwiper from '@/components/organisms/sectionSwiper';
import { twMerge } from 'tailwind-merge';
import { useProductImageDetail } from '@/hooks/useProductImageDetail';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { useMemo } from 'react';
import { isMobile } from 'react-device-detect';
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

  const handleClickImage = (image: ImageDto) => {
    if (image) {
      setImageActive(image);
    }
  };

  const renderSlideImage = useMemo(() => {
    return (
      <SectionSwiper
        classNameContainer={'mt-3'}
        slidePerViewMobile={4}
        key={JSON.stringify(images)}
        classNameItems={
          'p-1 lg:hover:shadow-md transition-shadow duration-300 lg:hover:border-primary border border-transparent'
        }
        renderItem={(item) => {
          const imageItem = item as ImageDto;
          return (
            <ImageWithFallback
              image={imageItem}
              className={
                'w-full h-full object-contain hover:scale-105 transition-transform duration-300 cursor-pointer border-[3px] border-[#e4e4e4]'
              }
              sizes="120px"
              onClick={() => handleClickImage(imageItem)}
              product={product}
              onMouseEnter={() => {
                !isMobile && setImageActive(imageItem);
              }}
              unoptimized={false}
            />
          ) as any;
        }}
        slidesPerView={6}
        spaceBetween={10}
        data={images}
      />
    );
  }, [imageActive, images]);

  return (
    <div className={twMerge(containerClassName)}>
      <ImageWithFallback
        image={imageActive}
        className={
          'object-contain cursor-pointer bk-product-image lg:max-w-[568px] w-full m-auto'
        }
        onClick={(image: ImageDto | null) => {
          setIsOpen && setIsOpen({ display: true, image });
        }}
        product={product}
        unoptimized={!isMobile}
        quality={100}
      />
      {renderSlideImage}
    </div>
  );
};
export default ProductDetailImage;
