import Image, { StaticImageData } from 'next/image';
import imageQuality from '@/static/images/quality-assurance.png';
import securityInfo from '@/static/images/security-information.png';
import productQuality from '@/static/images/product-quality.png';
import support from '@/static/images/support.png';
import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import { ImageDto } from '@/dtos/Image.dto';
import SectionSwiper from '@/components/organisms/sectionSwiper';
import ImageWithFallback from '@/components/atoms/images/ImageWithFallback';
import { SettingOptionDto } from '@/dtos/SettingOption.dto';
import { twMerge } from 'tailwind-merge';

type Props = {
  contents?: StaticContentsDto[];
  setting?: SettingOptionDto;
  fullWidth?: boolean;
};

export default function HomeSupport({ contents, setting, fullWidth }: Props) {
  return (
    <div
      className={twMerge('relative my-3', fullWidth && 'full-bleed')}
      style={{ backgroundColor: setting?.backgroundColor || '#fff' }}
    >
      <SectionSwiper
        classNameContainer={'mb-[0.25rem] lg:mb-3 py-4 border-t border-b'}
        classNameLeft={'d-none'}
        classNameRight={'d-none'}
        classNameItems={'flex items-center justify-center'}
        slidesPerView={4}
        slidePerViewMobile={2}
        spaceBetween={10}
        loop={true}
        auto={true}
        data={contents || []}
        renderItem={(item) => {
          const _item = item as StaticContentsDto;
          const image = _item?.images?.[0]?.image;
          return (
            <div className="max-h-[120px] sm:max-h-[60px] flex flex-col sm:flex-row items-center gap-2 lg:gap-3">
              <ImageWithFallback
                image={image}
                className={
                  'object-cover object-center w-[40px] sm:w-[50px] h-auto'
                }
                alt={
                  'Minh Tu Authentic, Nước hoa chính hãng Tphcm, Quận Tân Phú, Mỹ phẩm'
                }
              />
              <div
                className={
                  'container-html support-html line-clamp-3 max-sm:text-center'
                }
                dangerouslySetInnerHTML={{
                  __html: _item?.description || '',
                }}
              />
            </div>
          );
        }}
      />
    </div>
  );
}
