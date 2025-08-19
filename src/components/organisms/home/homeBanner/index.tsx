import { StaticContentsDto } from '@/dtos/StaticContents.dto';
import Banners from '@/components/molecules/header/banners';
import { useIsMobile } from '@/hooks/useDevice';
import MenuWrapper from '@/components/molecules/header/menu/menuWrapper';
import { ResponseMenuDto } from '@/dtos/responseMenu.dto';
import { SettingOptionDto } from '@/dtos/SettingOption.dto';
import { twMerge } from 'tailwind-merge';

type Props = {
  banners: StaticContentsDto[];
  menu?: ResponseMenuDto;
  setting?: SettingOptionDto;
};
export default function HomeBanner({ banners, menu, setting }: Props) {
  const isFullWidth = setting?.isBannerFull || false;
  const isSquareBannerMobile = setting?.isSquareBannerMobile || false;

  return (
    <>
      {isFullWidth ? (
        <div
          id={'main-home-page'}
          className={twMerge(
            'relative w-full max-lg:h-auto mt-[60px] lg:mt-0',
            isFullWidth ? 'h-[560px]' : 'h-[450px]',
          )}
        >
          {/* Desktop: Menu overlay + Full banner */}
          <div className={'container m-auto hidden lg:!block'}>
            <div className={'absolute top-3 z-[3] m-auto'}>
              <div className={'container m-auto relative'}>
                {menu && <MenuWrapper menu={menu} className={'w-[220px] '} />}
              </div>
            </div>
          </div>

          <Banners
            className={twMerge(
              'h-full',
              isFullWidth ? 'h-[560px]' : 'h-[450px]',
            )}
            banners={banners || []}
            classNameImage={'object-cover h-full object-center'}
            isFull={true}
            isSquareBannerMobile={isSquareBannerMobile}
          />
        </div>
      ) : (
        <div
          id={'main-home-page'}
          className={
            'mt-[60px] lg:mt-[10px] lg:flex w-full gap-2 relative container mx-auto'
          }
        >
          {/* Desktop Layout */}
          <div className="hidden lg:!flex w-full gap-2 relative">
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
              isSquareBannerMobile={isSquareBannerMobile}
            />
          </div>
        </div>
      )}
    </>
  );
}
