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
          'mt-3 border border-primary p-3 lg:px-10 lg:py-8 rounded-[10px] bg-white'
        }
        classNameLeft={'lg:left-[-11px]'}
        classNameRight={'lg:right-[-11px]'}
        classNameItems={'flex items-center justify-center'}
        slidesPerView={5}
        slidePerViewMobile={2}
        spaceBetween={30}
        data={contents || []}
        renderItem={(item) => {
          const _item = item as StaticContentsDto;
          const image = _item?.images?.[0]?.image?.url || support;
          return (
            <div className="h-[60px] flex items-center gap-1 lg:gap-3">
              <Image
                src={image || ''}
                className={'object-cover object-center w-[30px] h-auto'}
                alt={
                  'Minh Tu Authentic, Nước hoa chính hãng Tphcm, Quận Tân Phú, Mỹ phẩm'
                }
              />
              <div
                className={'container-html line-clamp-2'}
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
