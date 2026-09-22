import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import useSwiperSpeed from '@/hooks/useSwiperSpeed';
import SectionSwiper from '@/components/organisms/sectionSwiper';
import { PlusIcon } from '@/components/icons/plus';
import { useState } from 'react';
import { VariantDto } from '@/dtos/Variant.dto';
import { useIsMobile } from '@/hooks/useDevice';
import { SwiperClass } from 'swiper/react';
import Link from 'next/link';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import VariantCard from '../../product/varitantCard';

type Props = {
  content: StaticContentsDto;
};
export default function HomeFeaturedProductsCategory({ content }: Props) {
  const [offset, setOffset] = useState(0);
  const isMobile = useIsMobile();
  const swiperSpeed = useSwiperSpeed();
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const seeMore = () => {
    if (!swiper) return;
    let newOffset = offset + swiper.slidesPerViewDynamic();
    setOffset(newOffset);
    if (swiper.isEnd) {
      setOffset(0);
      newOffset = 0;
    }
    swiper.slideTo(newOffset);
  };
  const titleImage = content?.images?.[0]?.image;
  const title = content?.title || 'Danh mục nổi bật';
  const heading = titleImage ? (
    <ImageWithFallback
      image={titleImage}
      alt={title}
      className={
        'h-[36px] lg:h-[45px] w-auto max-w-[200px] lg:max-w-[300px] object-contain object-left'
      }
    />
  ) : (
    <h2
      className="text-2xl font-bold uppercase tracking-wide"
      style={{ color: content?.properties?.textColor || '#000000' }}
    >
      {title}
    </h2>
  );
  return (
    content && (
      <div
        className="mt-3 rounded-xl"
        style={{
          backgroundColor: content?.properties?.backgroundColor || '#E5E7EB',
        }}
      >
        <div className="px-4 w-full py-4">
          <div className="flex items-center justify-between mb-8">
            {content?.slugs?.slug ? (
              <Link
                className={'min-w-0 hover:opacity-80 transition-opacity'}
                href={`${process.env.NEXT_PUBLIC_APP_URL}/${content.slugs.slug}`}
              >
                {heading}
              </Link>
            ) : (
              heading
            )}
            <button
              onClick={seeMore}
              className="shrink-0 ml-3 flex items-center bg-gray-100 p-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Xem thêm
            </button>
          </div>
          <SectionSwiper
            onSwiper={(swiper) => setSwiper(swiper)}
            slidePerViewMobile={2}
            speed={swiperSpeed}
            spaceBetweenMobile={10}
            isNotDisplayNavigation={isMobile}
            spaceBetween={10}
            slidesPerView={3}
            loop={true}
            data={content?.properties?.variants || []}
            renderItem={(item) => (
              <VariantCard variant={item as VariantDto} />
            )}
          />
        </div>
      </div>
    )
  );
}
