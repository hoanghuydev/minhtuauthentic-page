import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import { ImageDetailDto } from '@/dtos/ImageDetail.dto';
import { Swiper, SwiperSlide } from 'swiper/react';
import { generateSlugToHref } from '@/utils';
import { Autoplay, Pagination } from 'swiper/modules';
import dynamic from 'next/dynamic';
import 'swiper/css';
import 'swiper/css/pagination';

const ImageWithRatio = dynamic(
  () => import('@/components/atoms/images/imageWithRatio'),
  {
    ssr: false,
  },
);

export default function BannerUnderCategoryDesktop({
  contents,
  className,
}: {
  contents: StaticContentsDto[];
  className?: string;
}) {
  return (
    <div className={'mt-3'}>
      <Swiper
        className={className || 'rounded-[10px] overflow-hidden'}
        spaceBetween={20}
        slidesPerView={2}
        slidesPerGroup={1}
        pagination={true}
        modules={[Pagination, Autoplay]}
        autoplay={{
          delay: 6000,
        }}
        loop={true}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
        }}
      >
        {contents.map((content, index) => {
          const image = content?.images?.[0];
          if (!image || !image.image) return null;

          return (
            <SwiperSlide key={`content-${index}`}>
              <div className="rounded-[10px] overflow-hidden">
                <ImageWithRatio
                  image={image.image}
                  href={generateSlugToHref(content?.properties?.slug)}
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
