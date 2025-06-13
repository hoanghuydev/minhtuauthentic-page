import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import dynamic from 'next/dynamic';
import { useIsDesktop, useIsMobile } from '@/hooks/useDevice';
const BannerUnderCategoryDesktop = dynamic(
  () => import('@/components/organisms/home/bannerUnderCategory/desktop'),
  {
    ssr: false,
  },
);
const BannerUnderCategoryMobile = dynamic(
  () => import('@/components/organisms/home/bannerUnderCategory/mobile'),
  {
    ssr: false,
  },
);
export default function BannerUnderCategory({
  contents,
}: {
  contents: StaticContentsDto[];
}) {
  const isDesktop = useIsDesktop();
  const isMobile = useIsMobile();
  return (
    <>
      {isDesktop && <BannerUnderCategoryDesktop contents={contents} />}
      {isMobile && (
        <BannerUnderCategoryMobile key={Math.random()} contents={contents} />
      )}
    </>
  );
}
