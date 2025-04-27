import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';
import {
  EffectFade,
  Pagination,
  Autoplay,
  EffectCreative,
} from 'swiper/modules';
import 'swiper/css/effect-fade';
import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import { generateSlugToHref } from '@/utils';
import { JSX } from 'react';
import { ImageDetailDto } from '@/dtos/ImageDetail.dto';
export const Banners = ({
  banners,
  className,
  classNameImage,
  isMobile,
  isFull,
}: {
  banners: StaticContentsDto[];
  className?: string;
  classNameImage?: string;
  isMobile?: boolean;
  isFull?: boolean;
}) => {
  const renderImage = (imageDetail: ImageDetailDto) => {
    return (
      <Image
        src={
          isMobile
            ? imageDetail?.image?.thumbnail_url || imageDetail?.image?.url || ''
            : imageDetail?.image?.url || ''
        }
        alt={imageDetail?.image?.alt || 'minhtuauthentic'}
        width={imageDetail?.image?.width || 0}
        height={imageDetail?.image?.height || 0}
        className={classNameImage || 'object-contain w-full'}
        loading={'eager'}
        unoptimized={!isMobile}
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPs7u2tBwAFdgImpqLKKAAAAABJRU5ErkJggg=="
      />
    );
  };
  return (
    <Swiper
      className={className}
      effect={'fade'}
      spaceBetween={50}
      slidesPerView={1}
      pagination={true}
      modules={[Pagination, EffectCreative, Autoplay]}
      autoplay={{
        delay: 6000,
      }}
      loop={true}
    >
      {banners.map((banner, index) => {
        const imageDetail = banner?.images?.[0];
        if (!imageDetail) {
          return null;
        }
        return (
          <SwiperSlide key={index + '-' + isMobile}>
            {isFull ? (
              renderImage(imageDetail)
            ) : (
              <Link href={generateSlugToHref(banner?.properties?.slug)}>
                {renderImage(imageDetail)}
              </Link>
            )}
          </SwiperSlide>
        ) as JSX.Element;
      })}
    </Swiper>
  );
};
export default Banners;
