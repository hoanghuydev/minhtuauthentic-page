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
  const { images, videos, mediaItems, mediaActive, setMediaActive } = useProductImageDetail();
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
      const idx = mediaItems.findIndex((item) => item.id === mediaActive.id && item.type === mediaActive.type);
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
    <div className={twMerge(containerClassName)} itemScope itemType="http://schema.org/ImageGallery">
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
            const mediaItem = item as MediaItem;
            
            if (mediaItem.type === 'image') {
              const imageItem = mediaItem.data as ImageDto;
              return (
                <div
                  className="product-detail-main-image-wrapper"
                  style={{
                    backgroundColor: 'white',
                    position: 'relative',
                  }}
                  itemScope
                  itemType="http://schema.org/ImageObject"
                >
                  <ImageWithFallback
                    image={imageItem}
                    className={twMerge(
                      'object-contain cursor-pointer bk-product-image select-none lg:max-w-[568px] w-full m-auto',
                    )}
                    onClick={() => {
                      setIsOpen && setIsOpen({ display: true, media: mediaItem });
                    }}
                    product={product}
                    unoptimized={true}
                    priority={true}
                    loading="eager"
                    alt={`${product.title || product.name} - Hình ảnh chính`}
                    onLoadingComplete={handleMainImageLoad}
                    itemProp="contentUrl"
                  />
                  {/* Hidden structured data for SEO */}
                  <meta itemProp="url" content={imageItem?.url || ''} />
                  <meta itemProp="width" content={imageItem?.width?.toString() || '800'} />
                  <meta itemProp="height" content={imageItem?.height?.toString() || '600'} />
                  <meta itemProp="name" content={`${product.title || product.name} - Hình ảnh sản phẩm`} />
                </div>
              );
            } else if (mediaItem.type === 'video') {
              const videoItem = mediaItem.data as VideoDetailDto;
              return (
                <div 
                  className="product-detail-main-video-wrapper m-auto max-h-full w-full flex overflow-hidden"
                  itemScope
                  itemType="http://schema.org/VideoObject"
                >
                  <YouTubeEmbed 
                    video={videoItem}
                    width="100%"
                    height="auto"
                    className="product-detail-main-video-wrapper m-auto max-h-full lg:max-w-[568px] aspect-square"
                    title={videoItem.video?.name || 'Product video'}
                  />
                  {/* Hidden structured data for SEO */}
                  <meta itemProp="name" content={videoItem.video?.name || `${product.title || product.name} - Video sản phẩm`} />
                  <meta itemProp="description" content={`Video giới thiệu sản phẩm ${product.title || product.name}`} />
                  <meta itemProp="uploadDate" content={videoItem.video?.created_at ? new Date(videoItem.video.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]} />
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
              const idx = mediaItems.findIndex((item) => item.id === mediaActive.id && item.type === mediaActive.type);
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
