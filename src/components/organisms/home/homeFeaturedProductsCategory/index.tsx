import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import SectionSwiper from '@/components/organisms/sectionSwiper';
import BlockUnderSlideItem from '@/components/molecules/blockUnderSlide/item';
import { SettingOptionDto } from '@/dtos/SettingOption.dto';
import { PlusIcon } from '@/components/icons/plus';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { ImageDto } from '@/dtos/Image.dto';
import { useMemo, useState } from 'react';

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
  const [haseMore, setHasMore] = useState((content?.properties?.variants || []).length > 4);
  const seeMore = () => {
    const newOffset = offset + 4;
    setOffset(newOffset);
    if ((content?.properties?.variants || []).length - newOffset <= 4) {
      setHasMore(false);
    }
  }
  return content && (
    <div className='mt-3 rounded-xl' style={{ backgroundColor: content?.properties?.backgroundColor || '#E5E7EB' }}>
      <div className="px-4 w-full py-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold  uppercase tracking-wide" style={{ color: content?.properties?.textColor || '#000000' }}>
            {content?.title || 'Danh mục nổi bật'}
          </h2>
          {haseMore && (
            <button onClick={seeMore} className="flex items-center bg-gray-100 p-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              <PlusIcon className="w-4 h-4 mr-1" />
              Xem thêm
            </button>
          )}
        </div>
      
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {(content?.properties?.variants || []).slice(offset, offset + 4).map((variant, index) => (
            <div 
              key={variant.id}
              className="group cursor-pointer overflow-hidden"
            >
              <div className={`rounded-lg md:rounded-xl bg-gray-50 transition-all duration-300`}>
                <div className="flex items-center space-x-4">
                  {/* Cột 1: Hình ảnh sản phẩm */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-lg md:rounded-xl flex items-center justify-center overflow-hidden">
                      <ImageWithRatio 
                        image={variant.images?.[0]?.image as ImageDto} 
                        imageClassName="w-12 h-12 md:w-20 md:h-20 object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  
                  {/* Cột 2: Thông tin sản phẩm */}
                  <div className="flex-grow min-w-0">
                    <h3 className="text-sm md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors truncate">
                      {variant.product?.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {variant.variant_product_configuration_values?.[0].product_configuration_value?.value || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
