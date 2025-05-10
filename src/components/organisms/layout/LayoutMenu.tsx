import { useContext, useEffect, useRef, useState } from 'react';
import appContext from '@/contexts/appContext';
import { twMerge } from 'tailwind-merge';
import Menu from '@/components/molecules/header/menu';
import { ResponseMenuDto } from '@/dtos/responseMenu.dto';

type Props = {
  menu: ResponseMenuDto;
};

export default function LayoutMenu({ menu }: Props) {
  const appCtx = useContext(appContext);
  const ref = useRef<HTMLDivElement | null>(null);
  const refMenuContain = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  useEffect(() => {
    const bodyContainer = document.getElementById('main-body');
    if (bodyContainer) {
      const { top, left, width } = bodyContainer.getBoundingClientRect();
      setPosition({ top, left, width });
    }

    const handleScroll = () => {
      if (ref.current) {
        if (window.scrollY > 25) {
          ref.current.style.top = 80 + 'px';
        } else {
          ref.current.style.top = '';
        }
      }
    };

    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        appCtx?.setIsOpenMenu && appCtx.setIsOpenMenu(false);
      }
    }

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [appCtx]);

  return (
    <>
      {menu && (
        <div
          className={twMerge(
            'absolute top-0 left-0 w-full h-full transition-all duration-500',
            // 'bg-[rgba(0,0,0,.53)]',
            appCtx?.isOpenMenu
              ? 'opacity-100 visible z-50 flex'
              : 'opacity-0 invisible z-0 hidden',
          )}
        >
          {/* Backdrop */}
          <div
            className={twMerge(
              'fixed inset-0 bg-black transition-opacity duration-500',
              appCtx?.isOpenMenu ? 'opacity-50' : 'opacity-0',
            )}
            onClick={() => appCtx?.setIsOpenMenu && appCtx.setIsOpenMenu(false)}
          />

          {/* Menu Container */}
          <div
            ref={ref}
            className={'fixed h-[380px] m-auto w-fit'}
            style={{ left: position?.left }}
          >
            <div
              ref={refMenuContain}
              className={'absolute'}
              style={{
                top: 12,
                left: 0,
                zIndex: 1,
              }}
            >
              <Menu
                menu={menu}
                className={twMerge(
                  'transition-all duration-500',
                  appCtx?.isOpenMenu
                    ? 'opacity-100 visible z-50 flex'
                    : 'opacity-0 invisible z-0 hidden',
                )}
                isOpenMenu={appCtx?.isOpenMenu || false}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
