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
      <div className={'grid grid-cols-10 gap-1  max-lg:hidden'}>
        {contents.map((content, index) => {
          return (
            <div key={index} className={'flex flex-col gap-1'}>
              <BlockUnderSlideItem
                content={content}
                classImage={'w-[100px] h-[100px] object-contain'}
              />
            </div>
          );
        })}
      </div>
      <SectionSwiper
        classNameContainer={'mt-3 lg:hidden'}
        isGrid={true}
        slidePerViewMobile={4}
        isUseHeightWrapper={true}
        isNotDisplayNavigation={true}
        heightItem={165}
        renderItem={(item: unknown) => {
          const content = item as StaticContentsDto;
          return (
            <BlockUnderSlideItem
              content={content}
              classImage={'w-[100px] h-[100px]'}
            />
          ) as ReactNode;
        }}
        data={contents}
      />
    </div>
  );
}
