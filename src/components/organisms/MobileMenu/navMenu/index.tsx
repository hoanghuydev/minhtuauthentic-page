import React, {
  Fragment,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import appContext from '@/contexts/appContext';
import { twMerge } from 'tailwind-merge';
import { ResponseMenuDto } from '@/dtos/responseMenu.dto';
import useMenu from '@/hooks/useMenu';
import { MenuDisplay, POPUP_TYPE } from '@/config/type';
import { StaticComponentDto } from '@/dtos/StaticComponent.dto';
import Image from 'next/image';
import NavMenuHeader from '@/components/organisms/MobileMenu/navMenu/header';
import NavMenuContent from '@/components/organisms/MobileMenu/navMenu/content';
import Loading from '@/components/atoms/loading';
import { useRouter } from 'next/router';
import { SettingsDto } from '@/dtos/Settings.dto';
type Props = {
  menu: ResponseMenuDto;
  className?: string;
  settings?: SettingsDto[];
};
export default function NavMenu({ menu, className, settings }: Props) {
  const router = useRouter();
  const appCtx = useContext(appContext);
  const { menuDisplay } = useMenu(menu);
  const ref = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [itemDebounceMenu, setItemDebounceMenu] = useState<MenuDisplay | null>(
    null,
  );
  const [itemMenu, setItemMenu] = useState<MenuDisplay | null>(null);

  useEffect(() => {
    if (menuDisplay.length > 0 && !itemMenu) {
      const _item = menuDisplay.filter(
        (item) => item.type === POPUP_TYPE.CATEGORY,
      )[0];
      setItemDebounceMenu(_item);
    }
  }, [menuDisplay, itemMenu]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
      setItemMenu(itemDebounceMenu);
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [itemDebounceMenu]);

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  useEffect(() => {
    if (!appCtx?.isOpenNavMenu) {
      setLoading(false);
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }, [appCtx?.isOpenNavMenu]);

  return (
    <div
      ref={ref}
      className={twMerge(
        'fixed inset-0 z-[1000] w-screen bg-primary text-white h-screen transition-all duration-300',
        appCtx?.isOpenNavMenu
          ? 'opacity-100 visible translate-x-0'
          : 'opacity-0 invisible -translate-x-full',
        className,
      )}
    >
      <NavMenuHeader settings={settings} />
      <div className={'flex w-full h-full bg-[rgb(254_242_242/1)] '}>
        <div
          className={
            'h-[calc(100svh-152px)] overflow-y-auto overflow-x-hidden w-[100px] text-primary'
          }
        >
          {menuDisplay.map((item, index) => {
            let xhtml: ReactNode = null;
            const _item = item.data as StaticComponentDto;
            const image = _item?.category?.images?.[0]?.image;
            let onClick = () => {};
            switch (item.type) {
              case POPUP_TYPE.CATEGORY:
                onClick = () => {
                  if (_item?.id !== (itemDebounceMenu?.data as any)?.id) {
                    setLoading(true);
                    setItemDebounceMenu(item);
                  }
                };
                xhtml = (
                  <>
                    {image?.url && (
                      <Image
                        src={image.url}
                        alt={image.alt || ''}
                        width={30}
                        height={30}
                      />
                    )}
                    <span>{_item?.category?.name || ''}</span>
                  </>
                );
                break;
              case POPUP_TYPE.BRAND:
                onClick = () => {
                  router.push('/thuong-hieu');
                };
                xhtml = <>Thương hiệu</>;
                break;
              case POPUP_TYPE.PRODUCT:
                onClick = () => {
                  router.push('/san-pham');
                };
                xhtml = <>Sản phẩm</>;
                break;
              case POPUP_TYPE.NEWS:
                onClick = () => {
                  router.push('/tin-tuc');
                };
                xhtml = <>Tin tức</>;
                break;
            }

            return (
              <div
                key={index}
                className={twMerge(
                  'relative flex flex-col gap-1 p-2 first:border-t border-b border-b-white items-center justify-center text-center last:border-b-0 text-[14px] w-[100px] h-[100px] shrink-0',
                  (itemDebounceMenu?.data as any)?.id &&
                    (itemDebounceMenu?.data as any)?.id === _item?.id &&
                    'border-l-4 border-l-red-500 bg-white menu-select',
                )}
                onClick={onClick}
              >
                {xhtml}
              </div>
            );
          })}
        </div>
        <div
          className={twMerge(
            'pb-[calc(100%-63px-61px)] overflow-auto bg-white text-black w-[calc(100%-100px)]',
          )}
        >
          {loading ? (
            <div className={'flex items-center justify-center w-full h-full'}>
              <Loading />
            </div>
          ) : (
            <>
              {itemMenu && menu?.filterSetting && (
                <NavMenuContent
                  menu={itemMenu}
                  brands={menu?.brands || []}
                  setting={menu?.filterSetting}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
