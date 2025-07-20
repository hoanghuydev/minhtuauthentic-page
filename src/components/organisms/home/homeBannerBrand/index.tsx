import React from 'react';
import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { generateSlugToHref } from '@/utils';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';

type Props = {
  contents?: StaticContentsDto[];
};

const HomeBannerBrand = ({ contents }: Props) => {
  if (!contents || contents.length === 0) {
    return null;
  }

  return (
    <div className="rounded-[10px] h-full bg-white">
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
        {contents.map((banner, index) => {
          const image = banner?.images?.[0]?.image;
          if (!image) return null;

          const content = (
            <div className="relative w-full overflow-hidden h-full rounded-[10px]">
              <ImageWithFallback
                image={image}
                alt={banner.title || 'Banner thương hiệu'}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
