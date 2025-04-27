import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import BlockUnderSlideItem from '@/components/molecules/blockUnderSlide/item';
import { MobileView } from 'react-device-detect';
import SectionSwiper from '@/components/organisms/sectionSwiper';

export default function SlideMobileView({
  contents,
  onLoad,
}: {
  contents: StaticContentsDto[];
  onLoad: () => void;
}) {
  return (
    <MobileView>
      <SectionSwiper
        classNameContainer={'mt-3 max-lg:p-3'}
        isGrid={true}
        slidesPerView={10}
        slidePerViewMobile={4}
        spaceBetween={10}
        heightItem={145}
        isUseHeightWrapper={true}
        isNotDisplayNavigation={true}
        onLoad={() => {
          onLoad && onLoad();
        }}
        renderItem={(item: unknown) => {
          const content = item as StaticContentsDto;
          return (
            <BlockUnderSlideItem content={content} isUseImageFill={true} />
          );
        }}
        data={contents}
      />
    </MobileView>
  );
}
