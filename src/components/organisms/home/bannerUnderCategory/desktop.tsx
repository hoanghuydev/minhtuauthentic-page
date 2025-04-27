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
  // Divide contents into chunks of 2 for displaying 2 images per slide
  const groupedContents = [];
  for (let i = 0; i < contents.length; i += 2) {
    groupedContents.push(contents.slice(i, i + 2));
  }

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
        {groupedContents.map((group, groupIndex) => (
          <SwiperSlide key={`group-${groupIndex}`}>
            <div className={'grid grid-cols-1 md:grid-cols-2 gap-3'}>
              {group.map((content, index) => {
                const image = content?.images?.[0];
                if (!image || !image.image) return null;

                return (
                  <div
                    key={`${groupIndex}-${index}`}
                    className="rounded-[10px] overflow-hidden"
                  >
                    <ImageWithRatio
                      image={image.image}
                      href={generateSlugToHref(content?.properties?.slug)}
                    />
                  </div>
                );
              })}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
