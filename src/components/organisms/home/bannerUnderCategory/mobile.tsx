import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { generateSlugToHref } from '@/utils';
import ImageWithRatio from '@/components/atoms/images/imageWithRatio';
import 'swiper/css';
import 'swiper/css/pagination';

export default function BannerUnderCategoryMobile({
  contents,
  className,
}: {
  contents: StaticContentsDto[];
  className?: string;
}) {
  // Trên mobile, chỉ hiển thị 1 ảnh mỗi slide
  return (
    <div className={'mt-3'}>
      <Swiper
        className={className || 'rounded-[10px] overflow-hidden'}
        spaceBetween={50}
        slidesPerView={1}
        pagination={true}
        modules={[Pagination, Autoplay]}
        autoplay={{
          delay: 6000,
        }}
        loop={true}
      >
        {contents.map((content, index) => {
          const image = content?.images?.[0];
          if (!image || !image.image) return null;

          return (
            <SwiperSlide key={index}>
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
