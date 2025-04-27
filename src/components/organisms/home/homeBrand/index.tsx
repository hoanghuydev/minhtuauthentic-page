import { BrandDto } from '@/dtos/Brand.dto';
import Image from 'next/image';
import noImage from '@/static/images/no-image.png';
import Link from 'next/link';
import SectionSwiper from '@/components/organisms/sectionSwiper';
import { SettingOptionDto } from '@/dtos/SettingOption.dto';
type Props = {
  contents: BrandDto[];
  setting?: SettingOptionDto;
};
export default function HomeBrand({ contents, setting }: Props) {
  return (
    <div
      className={'p-3 mt-3 rounded-[10px]'}
      style={{ backgroundColor: setting?.backgroundColor || '#fff' }}
    >
      <h2
        className={
          'text-[24px] font-semibold text-primary mb-3 text-center uppercase'
        }
      >
        Thương hiệu nổi bật
      </h2>
      <SectionSwiper
        slidesPerView={6}
        classNameContainer={'border border-[#e4e4e4] rounded-[10px] p-3'}
        classNameItems={'relative w-full overflow-hidden'}
        spaceBetween={10}
        loop={true}
        isGrid={true}
        isUseHeightWrapper={true}
        renderItem={(content: unknown) => {
          const _content = content as BrandDto;
          const image = _content?.images?.[0]?.image;
          const url = image?.url || noImage;
          return (
            <div className={'flex items-center justify-center'}>
              <Link href={'/' + _content?.slugs?.slug || ''}>
                <Image
                  src={url}
                  alt={_content.name || ''}
                  width={image?.width || 100}
                  height={image?.height || 80}
                  className={
                    'w-[208px] object-contain hover:scale-105 transition-transform duration-300 rounded-[10px]'
                  }
                />
              </Link>
            </div>
          );
        }}
        data={contents}
      />
    </div>
  );
}
