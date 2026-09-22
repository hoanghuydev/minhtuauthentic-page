import { ProductDto } from '@/dtos/Product.dto';
import { ImageDto } from '@/dtos/Image.dto';
import { VideoDetailDto } from '@/dtos/VideoDetail.dto';
import SectionSwiper from '@/components/organisms/sectionSwiper';
import { twMerge } from 'tailwind-merge';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { useEffect, useMemo, useRef, useState } from 'react';
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
  const { videos, mediaItems, mediaActive, setMediaActive } =
    useProductImageDetail();
  const mainSwiper = useRef<SwiperClass | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  // SectionSwiperItem renders nothing until it has mounted on the client, so the
  // active media is rendered statically until then. That static <img> is what
  // puts the product's main photo into the server HTML for Googlebot-Image.
  const [isSwiperMounted, setIsSwiperMounted] = useState(false);

  useEffect(() => {
    setIsSwiperMounted(true);
  }, []);

  useEffect(() => {
    setCurrentIndex(videos.length);
  }, [mediaItems, videos]);

  useEffect(() => {
    if (mainSwiper.current && mediaActive && mediaItems.length > 0) {
      const idx = mediaItems.findIndex(
        (item) => item.id === mediaActive.id && item.type === mediaActive.type,
      );
      if (idx >= 0) {
        mainSwiper.current.slideTo(idx, 0);
      }
    }
  }, [mediaActive, mediaItems]);

  const renderMedia = (mediaItem: MediaItem) => {
    if (mediaItem.type === 'image') {
      const imageItem = mediaItem.data as ImageDto;
      imageItem.width = 1000;
      imageItem.height = 1000;
      return (
        <div
          className="product-detail-main-image-wrapper"
          style={{ backgroundColor: 'white' }}
        >
          <ImageWithFallback
            image={imageItem}
            className={twMerge(
              'object-contain bk-product-image select-none lg:max-w-[568px] w-full m-auto cursor-pointer',
            )}
            product={product}
            sizes="100vw"
            quality={100}
            unoptimized={true}
            priority={true}
            loading="eager"
            alt={`${product.title || product.name} - Hình ảnh chính`}
            onClick={() => {
              setIsOpen && setIsOpen({ display: true, media: mediaItem });
            }}
          />
        </div>
      );
    }

    if (mediaItem.type === 'video') {
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
  };

  const renderSlideImage = useMemo(() => {
    return (
      <div className="relative">
        <SectionSwiper
          classNameContainer={'mt-3'}
          slidePerViewMobile={5}
          key={JSON.stringify(mediaItems)}
          renderItem={(item) => (
            <ItemImageCarousel media={item as MediaItem} product={product} />
          )}
          slidesPerView={6}
          spaceBetween={10}
          data={mediaItems}
        />
      </div>
    );
  }, [mediaItems, product]);

  const staticMedia = mediaActive?.data ? mediaActive : mediaItems[0];

  return (
    <div className={twMerge(containerClassName)}>
      <div className="relative">
        {isSwiperMounted ? (
          <SectionSwiperItem
            renderItem={(item) => renderMedia(item as MediaItem)}
            key={JSON.stringify(mediaItems)}
            data={mediaItems}
            slidesPerView={1}
            spaceBetween={5}
            onSwiper={(swiperInstance: SwiperClass) => {
              mainSwiper.current = swiperInstance;
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
        ) : (
          staticMedia && renderMedia(staticMedia)
        )}
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
