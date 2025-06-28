import { ProductDto } from '@/dtos/Product.dto';
import { ImageDto } from '@/dtos/Image.dto';
import { VariantDto } from '@/dtos/Variant.dto';
import ImageMagnifier from '@/components/atoms/images/imageMaginifier';
import SectionSwiper from '@/components/organisms/sectionSwiper';
import { twMerge } from 'tailwind-merge';
import { useProductImageDetail } from '@/hooks/useProductImageDetail';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/useDevice';
import SectionSwiperItem from '@/components/organisms/sectionSwiper/item';
import { SwiperClass } from 'swiper/react';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';

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
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const mainSwiper = useRef<SwiperClass|null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClickImage = (image: ImageDto) => {
    if (image) {
      setImageActive(image);
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    if (mainSwiper.current && imageActive) {
      const idx = images.findIndex(img => img.id === imageActive.id);
      if (idx >= 0) mainSwiper.current.slideTo(idx);
    }
  }, [imageActive, images]);

  const renderSlideImage = useMemo(() => {
    return (
      <div className="relative">
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
                  if (!isMobile) {
                    handleClickImage(imageItem)
                  }
                }}
                unoptimized={false}
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

  // Custom onLoad handler for the main product image
  const handleMainImageLoad = () => {
    setIsMainImageLoaded(true);
  };

  return (
    <div className={twMerge(containerClassName)}>
      <div className={`relative ${
        isInitialLoad
          ? `transition-opacity duration-300 ${isMainImageLoaded ? 'opacity-100' : 'opacity-0'}`
          : ''
      }`}>
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
                  unoptimized={!isMobile}
                  quality={100}
                  onLoadingComplete={handleMainImageLoad}
                />
              </div>
            )
          }}
          data={images}
          slidesPerView={1}
          spaceBetween={5}
          onSwiper={(swiperInstance: SwiperClass) => {
            mainSwiper.current = swiperInstance
          }}
          classNameLeft={'lg:left-[0px]'}
          classNameRight={'lg:right-[0px]'}
          onSlideChange={(idx) => {
            setCurrentIndex(idx)
            setImageActive(images[idx])
          }}
        />
        <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black bg-opacity-50 text-white text-lg font-semibold tracking-[0.2em] px-3 py-1 rounded-[15px] z-[2] select-none">
          <DoubleLeftOutlined onClick={() => mainSwiper.current?.slidePrev()} />
          <div className="tracking-[0.2em] select-none">{currentIndex + 1}/{images.length}</div>
          <DoubleRightOutlined onClick={() => mainSwiper.current?.slideNext()} />
        </div>
      </div>
      {renderSlideImage}
    </div>
  );
};

export default ProductDetailImage;
