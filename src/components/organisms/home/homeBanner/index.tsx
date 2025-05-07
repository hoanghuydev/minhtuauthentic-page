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
  return (
    <>
      {setting?.isBannerFull ? (
        <div id={'main-home-page'} className={'h-[400px] w-full'}>
          <div className={'container relative m-auto'}>
            <div className={'absolute top-3 z-[3] m-auto'}>
              <div className={'container m-auto relative'}>
                {menu && (
                  <MenuWrapper menu={menu} className={'w-[220px] h-[380px] '} />
                )}
              </div>
            </div>
          </div>

          <Banners
            className={'h-full'}
            banners={banners || []}
            classNameImage={'object-cover h-full object-center'}
            isMobile={isMobile}
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
          {menu && (
            <MenuWrapper menu={menu} className={'w-[220px] h-[380px]'} />
          )}
          <div
            className={
              'max-lg:mt-20 min-h-[140px] lg:h-[380px] w-full basis-[calc(100%-230px)] lg:w-[calc(100%-230px)] max-w-full'
            }
          >
            <Banners
              className={'flex-1 rounded-3xl lg:h-[380px]'}
              banners={banners || []}
              classNameImage={'object-contain lg:object-cover w-full  '}
              isMobile={isMobile}
            />
          </div>
        </div>
      )}
    </>
  );
}
