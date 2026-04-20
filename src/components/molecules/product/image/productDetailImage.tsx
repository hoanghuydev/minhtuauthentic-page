import { ProductDto } from '@/dtos/Product.dto';
import { ImageDto } from '@/dtos/Image.dto';
import { VideoDetailDto } from '@/dtos/VideoDetail.dto';
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
import YouTubeEmbed from '@/components/atoms/video/YouTubeEmbed';
import MediaItem from '@/dtos/Media.dto';

type Props = {
  product: ProductDto;
  containerClassName?: string;
  setIsOpen?: (item: { display: boolean; media: MediaItem | null }) => void;
};

const ProductDetailImage = ({
  product,
  containerClassName,
  setIsOpen,
}: Props) => {
  const { images, videos, mediaItems, mediaActive, setMediaActive } =
    useProductImageDetail();
  const [isMainImageLoaded, setIsMainImageLoaded] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const mainSwiper = useRef<SwiperClass | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleClickImage = () => {
    setIsInitialLoad(false);
  };

  useEffect(() => {
    const videosCount = videos.length;
    setCurrentIndex(videosCount);
  }, [mediaItems, videos]);

  useEffect(() => {
    if (mainSwiper.current && mediaActive && mediaItems.length > 0) {
      const idx = mediaItems.findIndex(
        (item) => item.id === mediaActive.id && item.type === mediaActive.type,
      );
      if (idx >= 0) {
        if (mainSwiper.current) {
          mainSwiper.current.slideTo(idx, 0);
        }
      }
    }
  }, [mediaActive, mediaItems]);

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
          slidePerViewMobile={5}
          key={JSON.stringify(mediaItems)}
          renderItem={(item) => {
            return (
              <ItemImageCarousel
                media={item as MediaItem}
                product={product}
                clickAction={handleClickImage}
              />
            );
          }}
          slidesPerView={6}
          spaceBetween={10}
          data={mediaItems}
        />
      </div>
    );
  }, [mediaItems, product]);

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
          renderItem={(item, index) => {
            const mediaItem = item as MediaItem;

            if (mediaItem.type === 'image') {
              const imageItem = mediaItem.data as ImageDto;
              imageItem.width = 1000;
              imageItem.height = 1000;
              const isFirst = index === 0;
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
                      'object-contain bk-product-image select-none lg:max-w-[568px] w-full m-auto',
                    )}
                    product={product}
                    sizes="(max-width: 1024px) 100vw, 568px"
                    quality={100}
                    unoptimized={false}
                    priority={isFirst}
                    loading={isFirst ? "eager" : "lazy"}
                    alt={`${product.title || product.name} - Hình ảnh chính`}
                    onLoadingComplete={isFirst ? handleMainImageLoad : undefined}
                  />
                  {/* Overlay với ảnh raw để copy link gốc khi click chuột phải - chỉ load sau khi ảnh chính đã load */}
                  {isMainImageLoaded && (
                    <ImageWithFallback
                      image={imageItem}
                      className="absolute top-0 left-0 opacity-0 w-full h-full object-contain cursor-pointer select-none"
                      product={product}
                      sizes="100vw"
                      unoptimized={true}
                      loading="lazy"
                      alt={`Overlay image - no index`}
                      onClick={() => {
                        setIsOpen &&
                          setIsOpen({ display: true, media: mediaItem });
                      }}
                    />
                  )}
                </div>
              );
            } else if (mediaItem.type === 'video') {
              const videoItem = mediaItem.data as VideoDetailDto;
              return (
                <div className="product-detail-main-video-wrapper m-auto max-h-full w-full flex overflow-hidden">
                  <YouTubeEmbed
                    video={videoItem}
                    width="100%"
                    height="auto"
                    className="product-detail-main-video-wrapper m-auto max-h-full lg:max-w-[568px] aspect-square"
                    title={videoItem.video?.name || 'Product video'}
                  />
                </div>
              );
            }
            return null;
          }}
          key={JSON.stringify(mediaItems)}
          data={mediaItems}
          slidesPerView={1}
          spaceBetween={5}
          onSwiper={(swiperInstance: SwiperClass) => {
            mainSwiper.current = swiperInstance;
            // Slide to active media position when swiper is initialized
            if (mediaActive && mediaItems.length > 0) {
              const idx = mediaItems.findIndex(
                (item) =>
                  item.id === mediaActive.id && item.type === mediaActive.type,
              );
              if (idx >= 0) {
                setTimeout(() => {
                  swiperInstance.slideTo(idx, 0);
                }, 50);
              }
            }
          }}
          classNameLeft={'lg:left-[0px]'}
          classNameRight={'lg:right-[0px]'}
          onSlideChange={(idx) => {
            setCurrentIndex(idx);
            const currentMedia = mediaItems[idx];
            if (currentMedia) {
              setMediaActive(currentMedia);
            }
          }}
        />
        <ImageCount
          currentIndex={currentIndex}
          total={mediaItems.length}
          onPrev={() => mainSwiper.current?.slidePrev()}
          onNext={() => mainSwiper.current?.slideNext()}
        />
      </div>
      {renderSlideImage}
    </div>
  );
};

export default ProductDetailImage;
