import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import Banners from '@/components/molecules/header/banners';
import { useIsMobile } from '@/hooks/useDevice';
import MenuWrapper from '@/components/molecules/header/menu/menuWrapper';
import { ResponseMenuDto } from '@/dtos/responseMenu.dto';
import { SettingOptionDto } from '@/dtos/SettingOption.dto';

type Props = {
  banners: StaticContentsDto[];
  menu?: ResponseMenuDto;
  setting?: SettingOptionDto;
};
export default function HomeBanner({ banners, menu, setting }: Props) {
  const isMobile = useIsMobile();
  const isFullWidth = setting?.isBannerFull || false;

  return (
    <>
      {isFullWidth ? (
        <div id={'main-home-page'} className={'h-[450px] w-full max-lg:h-auto'}>
          {/* Desktop: Menu overlay + Full banner */}
          <div className={'container relative m-auto hidden lg:block'}>
            <div className={'absolute top-3 z-[3] m-auto'}>
              <div className={'container m-auto relative'}>
                {menu && <MenuWrapper menu={menu} className={'w-[220px] '} />}
              </div>
            </div>
          </div>

          <Banners
            className={'h-full lg:h-[450px]'}
            banners={banners || []}
            classNameImage={'object-cover h-full object-center'}
            isFull={true}
          />
        </div>
      ) : (
        <div
          id={'main-home-page'}
          className={
            'lg:mt-[10px] lg:flex w-full gap-2 relative container mx-auto'
          }
        >
          {/* Desktop Layout */}
          <div className="hidden lg:flex w-full gap-2 relative">
            {menu && (
              <MenuWrapper menu={menu} className={'w-[220px] flex-shrink-0'} />
            )}
            <div className={'min-h-[140px] flex-grow overflow-hidden'}>
              <Banners
                className={'w-full h-full rounded-3xl'}
                banners={banners || []}
                classNameImage={'object-contain lg:object-cover w-full h-full'}
              />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden w-full">
            <Banners
              className={'w-full'}
              banners={banners || []}
              classNameImage={'object-cover w-full h-full'}
            />
          </div>
        </div>
      )}
    </>
  );
}
