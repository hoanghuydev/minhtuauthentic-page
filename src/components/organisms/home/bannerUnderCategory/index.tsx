import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import dynamic from 'next/dynamic';
import { isDesktop, isMobile} from 'react-device-detect';
const BannerUnderCategoryDesktop = dynamic(()=>import('@/components/organisms/home/bannerUnderCategory/desktop'), {
  ssr: false,
});
const BannerUnderCategoryMobile = dynamic(()=>import('@/components/organisms/home/bannerUnderCategory/mobile'), {
  ssr: false,
});
export default function BannerUnderCategory({
  contents,
}: {
  contents: StaticContentsDto[];
}) {
  return <>
    {isDesktop && <BannerUnderCategoryDesktop contents={contents} />}
    {isMobile && <BannerUnderCategoryMobile key={Math.random()} contents={contents} />}
  </>;
}
