import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import SectionSwiper from '@/components/organisms/sectionSwiper';
import BlockUnderSlideItem from '@/components/molecules/blockUnderSlide/item';
import { SettingOptionDto } from '@/dtos/SettingOption.dto';

type Props = {
  contents: StaticContentsDto[];
  setting?: SettingOptionDto;
};
export default function HomeFeatureCategory({ contents, setting }: Props) {
  return (
    <div
      className={'mt-3 mx-auto p-1 lg:p-3 rounded-[10px]'}
      style={{ backgroundColor: setting?.backgroundColor || '#fff' }}
    >
      <div className={'flex justify-between mb-3'}>
        <h3
          className={
            'text-[18px] lg:text-[24px] uppercase font-[700] lg:font-bold w-max shrink-0'
          }
        >
          Danh mục nổi bật
        </h3>
      </div>
      <SectionSwiper
        slidesPerView={10}
        spaceBetween={10}
        slidePerViewMobile={4}
        renderItem={(item: unknown) => {
          const content = item as StaticContentsDto;
          return <BlockUnderSlideItem content={content} />;
        }}
        data={contents || []}
      />
    </div>
  );
}
