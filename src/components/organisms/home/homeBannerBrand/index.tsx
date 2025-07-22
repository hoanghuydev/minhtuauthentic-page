import React from 'react';
import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { generateSlugToHref } from '@/utils';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';
import { twMerge } from 'tailwind-merge';

type Props = {
  images?: StaticContentsDto[];
  className?: string;
};

const HomeBannerBrand = ({ images, className }: Props) => {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div
      className={twMerge(
        'rounded-[10px] h-full bg-white flex-1 overflow-hidden',
        className,
      )}
    >
      <Swiper
        className="rounded-[10px] h-full"
        spaceBetween={10}
        slidesPerView={1}
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        loop={true}
        breakpoints={{
          768: {
            slidesPerView: 1,
          },
        }}
      >
        {images.map((banner, index) => {
          const image = banner?.images?.[0]?.image;
          if (!image) return null;

          const content = (
            <div className="relative w-full overflow-hidden h-full rounded-[10px]">
              <ImageWithFallback
                image={image}
                alt={banner.title || 'Banner thương hiệu'}
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                unoptimized={true}
              />
            </div>
          );

          return (
            <SwiperSlide key={`banner-brand-${index}`}>
              {banner.properties?.slug ? (
                <Link href={generateSlugToHref(banner.properties.slug)}>
                  {content}
                </Link>
              ) : (
                content
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default HomeBannerBrand;
