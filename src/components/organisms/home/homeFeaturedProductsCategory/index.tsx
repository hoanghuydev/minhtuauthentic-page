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
    if(!swiper) return;
    let newOffset = offset + swiper.slidesPerViewDynamic();
    setOffset(newOffset);
    if (swiper.isEnd) {
      setOffset(0)
      newOffset = 0
    }
    swiper.slideTo(newOffset)
  }
  return content && (
    <div className='mt-3 rounded-xl' style={{ backgroundColor: content?.properties?.backgroundColor || '#E5E7EB' }}>
      <div className="px-4 w-full py-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold  uppercase tracking-wide" style={{ color: content?.properties?.textColor || '#000000' }}>
            {content?.title || 'Danh mục nổi bật'}
          </h2>
          <button onClick={seeMore} className="flex items-center bg-gray-100 p-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            <PlusIcon className="w-4 h-4 mr-1" />
            Xem thêm
          </button>
        </div>
        <SectionSwiper
          
          onSwiper={(swiper) => setSwiper(swiper)}
          isGrid={isMobile} 
          slidePerViewMobile={1}
          isUseHeightWrapper={isMobile}
          spaceBetweenMobile={10}
          spaceBetween={10}
          slidesPerView={3}
          loop={true}
          data={content?.properties?.variants || []}
          renderItem={(item) => (
            <Link
              href={`/${(item as VariantDto).product?.slugs?.slug}`}
              key={(item as VariantDto).id}
              className="group cursor-pointer overflow-hidden"
            >
              <div className={`rounded-lg md:rounded-xl bg-gray-50 transition-all duration-300`}>
                <div className="flex items-center space-x-4">
                  {/* Cột 1: Hình ảnh sản phẩm */} 
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-lg md:rounded-xl flex items-center justify-center overflow-hidden">
                      <ImageWithRatio 
                        image={(item as VariantDto).images?.[0]?.image as ImageDto} 
                        imageClassName="w-12 h-12 md:w-20 md:h-20 object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  
                  {/* Cột 2: Thông tin sản phẩm */}
                  <div className="flex-grow min-w-0">
                    <h3 className="text-sm md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors truncate">
                      {(item as VariantDto).product?.name}
                    </h3>
                    {
                      (item as VariantDto)?.variant_product_configuration_values?.map(
                        (item, index) => {
                          return (
                            <p key={index} className={'text-sm text-gray-600'}>
                              {
                                item.product_configuration_value?.product_configuration
                                  ?.name
                              }
                              : {item.product_configuration_value?.value}
                            </p>
                          );
                        },
                      )
                    }
                    <div className={'flex gap-3 items-center'}>
                      <span className={'text-red-600 font-semibold'}>
                        {((item as VariantDto).regular_price || '').toLocaleString()}
                      </span>
                      <span className={'line-through text-[10px]'}>
                        {((item as VariantDto).price || '').toLocaleString()}
                      </span>
                    </div>
                    
                  </div>
                </div>
              </div>
            </Link>
          )}
        />
      </div>
    </div>
  );
}
