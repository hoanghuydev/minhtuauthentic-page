import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { EffectFade, Pagination, Autoplay, Navigation } from 'swiper/modules';
import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import { ImageDetailDto } from '@/dtos/ImageDetail.dto';
import { generateSlugToHref } from '@/utils';
import { useRef, useState } from 'react';
import type { SwiperClass } from 'swiper/react';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { twMerge } from 'tailwind-merge';

export const Banners = ({
  banners,
  className,
  classNameImage,
  isMobile = false,
  isFull = false,
}: {
  banners: StaticContentsDto[];
  className?: string;
  classNameImage?: string;
  isMobile?: boolean;
  isFull?: boolean;
}) => {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [isLastSlide, setIsLastSlide] = useState(false);
  const [isFirstSlide, setIsFirstSlide] = useState(true);

  // Hàm xử lý kiểm tra slide đầu/cuối
  const handleSlideChange = () => {
    if (!swiperRef.current) return;

    const swiper = swiperRef.current;
    const isLast = swiper.isEnd;
    const isFirst = swiper.isBeginning;

    setIsLastSlide(isLast);
    setIsFirstSlide(isFirst);
  };

  // Cấu hình swiper
  const swiperConfig = {
    effect: 'fade' as const,
    spaceBetween: 50,
    slidesPerView: 1,
    pagination: true,
    navigation: true,
    modules: [EffectFade, Pagination, Autoplay, Navigation],
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    loop: false,
    onSwiper: (swiper: SwiperClass) => {
      swiperRef.current = swiper;
      setIsFirstSlide(swiper.isBeginning);
      setIsLastSlide(swiper.isEnd);
    },
    onSlideChange: handleSlideChange,
  };

  return (
    <div
      className={twMerge(
        'relative banner-container h-full',
        isLastSlide && 'hide-next-button',
        isFirstSlide && 'hide-prev-button',
      )}
      onMouseEnter={() => swiperRef.current?.autoplay.stop()}
      onMouseLeave={() => swiperRef.current?.autoplay.start()}
    >
      <Swiper className={className} {...swiperConfig}>
        {banners.map((banner, index) => {
          const imageDetail = banner?.images?.[0];
          if (!imageDetail) return null;

          const imageElement = (
            <ImageWithFallback
              image={imageDetail.image}
              alt={imageDetail.image?.alt || 'minhtuauthentic'}
              className={twMerge(
                'object-contain w-full h-full',
                classNameImage,
              )}
              loading="eager"
              unoptimized={false}
              sizes="100vw"
              quality={80}
            />
          );

          return (
            <SwiperSlide
              key={`${index}-${isMobile}`}
              className="w-full"
              style={{ width: '100% !important' }}
            >
              {isFull ? (
                imageElement
              ) : (
                <Link href={generateSlugToHref(banner?.properties?.slug)}>
                  {imageElement}
                </Link>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Banners;
