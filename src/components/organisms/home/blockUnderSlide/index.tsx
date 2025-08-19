import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import BlockUnderSlideItem from '@/components/molecules/blockUnderSlide/item';
import SectionSwiper from '@/components/organisms/sectionSwiper';
import { ReactNode } from 'react';
type Props = {
  contents: StaticContentsDto[];
};
export default function BlockUnderSlide({ contents }: Props) {
  return (
    <div className={'min-h-[285px] lg:h-auto mt-3'}>
      {/* Desktop Grid - 10 columns */}
      <div className={'grid grid-cols-10 gap-1 max-lg:hidden'}>
        {contents.map((content, index) => {
          return (
            <div key={index} className={'flex flex-col gap-1'}>
              <BlockUnderSlideItem
                content={content}
                classImage={'w-[100px] h-[100px] object-contain'}
                priority={index < 10} // Priority for first 10 items (visible above fold)
              />
            </div>
          );
        })}
      </div>

      {/* Mobile Swiper */}
      <SectionSwiper
        classNameContainer={'mt-3 lg:hidden'}
        isGrid={true}
        slidePerViewMobile={4}
        isUseHeightWrapper={true}
        isNotDisplayNavigation={true}
        heightItem={150}
        renderItem={(item: unknown) => {
          const content = item as StaticContentsDto;
          // Find index by comparing content ids for priority
          const itemIndex = contents.findIndex((c) => c.id === content.id);
          return (
            <BlockUnderSlideItem
              content={content}
              classImage={'w-[100px] h-[100px]'}
              priority={itemIndex < 4} // Priority for first 4 items visible on mobile
            />
          ) as ReactNode;
        }}
        data={contents}
      />
    </div>
  );
}
