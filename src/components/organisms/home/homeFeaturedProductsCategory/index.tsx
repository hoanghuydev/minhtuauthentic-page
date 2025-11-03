import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import SectionSwiper from '@/components/organisms/sectionSwiper';
import { PlusIcon } from '@/components/icons/plus';
import dynamic from 'next/dynamic';
import { ImageDto } from '@/dtos/Image.dto';
import { useState } from 'react';
import { VariantDto } from '@/dtos/Variant.dto';
import { useIsMobile } from '@/hooks/useDevice';
import { SwiperClass } from 'swiper/react';
import Link from 'next/link';
import ProductCardImage from '@/components/molecules/product/image/productCardImage';
import { ProductDto } from '@/dtos/Product.dto';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import VariantCard from '../../product/varitantCard';

const ImageWithRatio = dynamic(
  () => import('@/components/atoms/images/imageWithRatio'),
  {
    ssr: false,
  },
);

type Props = {
  content: StaticContentsDto;
};
export default function HomeFeaturedProductsCategory({ content }: Props) {
  const [offset, setOffset] = useState(0);
  const isMobile = useIsMobile();
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
                href={`${process.env.NEXT_PUBLIC_APP_URL}/${content.slugs.slug}`}
              >
                <h2
                  className="text-2xl font-bold uppercase tracking-wide hover:opacity-80 transition-opacity"
                  style={{ color: content?.properties?.textColor || '#000000' }}
                >
                  {content?.title || 'Danh mục nổi bật'}
                </h2>
              </Link>
            ) : (
              <h2
                className="text-2xl font-bold uppercase tracking-wide"
                style={{ color: content?.properties?.textColor || '#000000' }}
              >
                {content?.title || 'Danh mục nổi bật'}
              </h2>
            )}
            <button
              onClick={seeMore}
              className="flex items-center bg-gray-100 p-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              Xem thêm
            </button>
          </div>
          <SectionSwiper
            onSwiper={(swiper) => setSwiper(swiper)}
            slidePerViewMobile={2}
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
