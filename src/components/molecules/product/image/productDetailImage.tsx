import { ProductDto } from '@/dtos/Product.dto';
import { ImageDto } from '@/dtos/Image.dto';
import { VariantDto } from '@/dtos/Variant.dto';
import ImageMagnifier from '@/components/atoms/images/imageMaginifier';
import SectionSwiper from '@/components/organisms/sectionSwiper';
import { twMerge } from 'tailwind-merge';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/useDevice';
import SectionSwiperItem from '@/components/organisms/sectionSwiper/item';
import { SwiperClass } from 'swiper/react';
import ImageCount from '@/components/atoms/imageCount';
import ItemImageCarousel from '@/components/organisms/product/itemImageCarousel';
import { useProductImageDetail } from '@/contexts/productDetailCarousel';

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
  const { images, imageActive, setImageActive } = useProductImageDetail();
  const [isMainImageLoaded, setIsMainImageLoaded] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const mainSwiper = useRef<SwiperClass | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClickImage = () => {
    setIsInitialLoad(false);
  };

  useEffect(() => {
    if (mainSwiper.current && imageActive) {
      const idx = images.findIndex((img) => img.id === imageActive.id);
      if (idx >= 0) mainSwiper.current.slideTo(idx);
    }
  }, [imageActive, images]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  const renderSlideImage = useMemo(() => {
    return (
      <div
        className="relative"
        aria-hidden="true"
        data-nosnippet="true"
        role="presentation"
      >
        <SectionSwiper
          classNameContainer={'mt-3'}
          slidePerViewMobile={4}
          key={JSON.stringify(images)}
          renderItem={(item) => {
            const imageItem = item as ImageDto;
            return (
              <ItemImageCarousel
                image={imageItem}
                product={product}
                clickAction={handleClickImage}
              />
            );
          }}
          slidesPerView={6}
          spaceBetween={10}
          data={images}
        />
      </div>
    );
  }, [imageActive, images]);

  // Custom onLoad handler for the main product image
  const handleMainImageLoad = () => {
    setIsMainImageLoaded(true);
  };

  return (
    <div className={twMerge(containerClassName)}>
      <div
        className={`relative ${
          isInitialLoad
            ? `transition-opacity duration-300 ${
                isMainImageLoaded ? 'opacity-100' : 'opacity-0'
              }`
            : ''
        }`}
      >
        <SectionSwiperItem
          renderItem={(item) => {
            const imageItem = item as ImageDto;
            return (
              <div
                className="product-detail-main-image-wrapper"
                style={{
                  backgroundColor: 'white',
                  position: 'relative',
                }}
              >
                <ImageWithFallback
                  image={imageItem}
                  className={twMerge(
                    'object-contain cursor-pointer bk-product-image select-none lg:max-w-[568px] w-full m-auto',
                  )}
                  onClick={(image: ImageDto | null) => {
                    setIsOpen && setIsOpen({ display: true, image });
                  }}
                  product={product}
                  unoptimized={true}
                  priority={true}
                  loading="eager"
                  alt={`${product.title || product.name} - Hình ảnh chính`}
                  onLoadingComplete={handleMainImageLoad}
                />
              </div>
            );
          }}
          key={JSON.stringify(images)}
          data={images}
          slidesPerView={1}
          spaceBetween={5}
          onSwiper={(swiperInstance: SwiperClass) => {
            mainSwiper.current = swiperInstance;
          }}
          classNameLeft={'lg:left-[0px]'}
          classNameRight={'lg:right-[0px]'}
          onSlideChange={(idx) => {
            setCurrentIndex(idx);
            setImageActive(images[idx]);
          }}
        />
        <ImageCount
          currentIndex={currentIndex}
          total={images.length}
          onPrev={() => mainSwiper.current?.slidePrev()}
          onNext={() => mainSwiper.current?.slideNext()}
        />
      </div>
      {renderSlideImage}
    </div>
  );
};

export default ProductDetailImage;
