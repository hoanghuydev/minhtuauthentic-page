import Image, { StaticImageData } from 'next/image';
import imageQuality from '@/static/images/quality-assurance.png';
import securityInfo from '@/static/images/security-information.png';
import productQuality from '@/static/images/product-quality.png';
import support from '@/static/images/support.png';
import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import { ImageDto } from '@/dtos/Image.dto';
import SectionSwiper from '@/components/organisms/sectionSwiper';

type Props = {
  contents?: StaticContentsDto[];
};

export default function HomeSupport({ contents }: Props) {
  return (
    <>
      <SectionSwiper
        classNameContainer={
          'mb-[0.25rem] lg:mb-3 py-5 lg:py-7 border-t border-b'
        }
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
          const image = _item?.images?.[0]?.image?.url || support;
          return (
            <div className="max-h-[120px] sm:max-h-[60px] flex flex-col sm:flex-row items-center gap-2 lg:gap-3">
              <Image
                src={image || ''}
                className={'object-cover object-center w-[40px] sm:w-[50px] h-auto'}
                alt={
                  'Minh Tu Authentic, Nước hoa chính hãng Tphcm, Quận Tân Phú, Mỹ phẩm'
                }
              />
              <div
                className={'container-html support-html line-clamp-3 max-sm:text-center'}
                dangerouslySetInnerHTML={{
                  __html: _item?.description || '',
                }}
              />
            </div>
          );
        }}
      />
    </>
  );
}
