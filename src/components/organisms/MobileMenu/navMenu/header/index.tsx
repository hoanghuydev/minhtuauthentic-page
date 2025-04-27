import NavbarMenuListButton from '@/components/organisms/MobileMenu/navMenu/header/listHeaderButton';
import dynamic from 'next/dynamic';
import { useContext, useEffect, useRef } from 'react';
import { SettingsDto } from '@/dtos/Settings.dto';
import SearchContext from '@/contexts/searchContext';
const InputSearch = dynamic(
  () => import('@/components/molecules/header/InputSearch/input'),
  {
    ssr: false,
  },
);

type Props = {
  className?: string;
  isMobile?: boolean;
  settings?: SettingsDto[];
};
export default function NavMenuHeader({
  className,
  isMobile,
  settings,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const refTimeOut = useRef<NodeJS.Timeout | null>(null);
  const ctx = useContext(SearchContext);
  useEffect(() => {
    let lastScrollY = 0;
    let isScrollDown = false;
    function onScroll() {
      if (
        typeof window !== 'undefined' &&
        ref.current &&
        ref?.current?.classList
      ) {
        const currentScrollY = window.scrollY;
        if (refTimeOut.current) {
          clearTimeout(refTimeOut.current as NodeJS.Timeout);
        }

        if (currentScrollY > lastScrollY) {
          isScrollDown = true;
        } else if (currentScrollY < lastScrollY) {
          isScrollDown = false;
        }

        if (!isScrollDown || currentScrollY < 100) {
          ref.current.classList.remove('invisible');
          ref.current.classList.remove('opacity-0');
          ref.current.classList.add('visible');
          ref.current.classList.add('opacity-100');
          // ref.current.style.transform = 'translateY(0)';
        } else {
          ref.current.classList.add('invisible');
          ref.current.classList.add('opacity-0');
          ref.current.classList.remove('visible');
          ref.current.classList.remove('opacity-100');
          // ref.current.style.height = 'translateY(-100%)';
        }

        lastScrollY = currentScrollY;
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    return () => {
      refTimeOut.current && clearTimeout(refTimeOut.current as NodeJS.Timeout);
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', onScroll);
      }
    };
  }, []);
  return (
    <div className={'relative'}>
      <NavbarMenuListButton className={className} settings={settings} />
      {isMobile && (
        <div
          className={
            'lg:hidden p-3 absolute top-[65px] bg-primary left-0 w-screen transition-all duration-300'
          }
          ref={ref}
        >
          {/*<InputSearchWrapper*/}
          {/*  key={'input-search-mobile'}*/}
          {/*  classNameInput={'top-[120px]'}*/}
          {/*  isForMobile={true}*/}
          {/*  settings={settings}*/}
          {/*/>*/}
          <InputSearch
            onClick={() => {
              ctx?.setIsOpenSearch && ctx.setIsOpenSearch(true);
            }}
          />
        </div>
      )}
    </div>
  );
}
