import { BrandDto } from '@/dtos/Brand.dto';
import Image from 'next/image';
import noImage from '@/static/images/no-image.png';
import Link from 'next/link';
import SectionSwiper from '@/components/organisms/sectionSwiper';
import { SettingOptionDto } from '@/dtos/SettingOption.dto';
import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import HomeBannerBrand from '../homeBannerBrand';
import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  contents: BrandDto[];
  setting?: SettingOptionDto;
  homeBannerBrand?: StaticContentsDto[];
};
export default function HomeBrand({
  contents,
  setting,
  homeBannerBrand,
}: Props) {
  const slidesPerView = useMemo(() => {
    if (homeBannerBrand && homeBannerBrand.length > 0) {
      return 4;
    }
    return 6;
  }, [homeBannerBrand]);

  return (
    <div
      className={'p-3 rounded-[10px]'}
      style={{ backgroundColor: setting?.backgroundColor || '#fff' }}
    >
      <Link href={'/thuong-hieu'}>
        <h2
          className={
            'text-[24px] font-bold text-primary mb-3 text-center uppercase'
          }
        >
          Thương hiệu nổi bật
        </h2>
      </Link>
      <div
        className={twMerge(
          'grid grid-cols-1 gap-2',
          homeBannerBrand && homeBannerBrand.length > 0
            ? 'lg:grid-cols-2'
            : 'lg:grid-cols-1',
        )}
      >
        {homeBannerBrand && homeBannerBrand.length > 0 && (
          <HomeBannerBrand
            className="hidden lg:!block lg:h-[250px]"
            images={homeBannerBrand}
          />
        )}
        <SectionSwiper
          slidesPerView={slidesPerView || 4}
          classNameContainer={twMerge(
            'border flex-1 border-[#e4e4e4] rounded-[10px] p-3',
            homeBannerBrand && homeBannerBrand.length > 0 && 'lg:h-[250px]',
          )}
          classNameItems={'relative w-full overflow-hidden'}
          spaceBetween={10}
          loop={true}
          auto={true}
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
    </div>
  );
}
