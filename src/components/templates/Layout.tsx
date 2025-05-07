import { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { ResponseMenuDto } from '@/dtos/responseMenu.dto';

import { SettingsDto } from '@/dtos/Settings.dto';
import DefaultSeo from '@/components/molecules/seo';
import { SEOProps } from '@/config/type';
import dynamic from 'next/dynamic';
import { useIsDesktop, useIsMobile } from '@/hooks/useDevice';
type Props = {
  className?: string;
  children: ReactNode;
  menu?: ResponseMenuDto;
  settings: SettingsDto[];
  seo?: SEOProps;
};

const PopupProduct = dynamic(
  () => import('@/components/organisms/popupProduct'),
  {
    ssr: false,
  },
);

const MenuFooter = dynamic(
  () => import('@/components/organisms/MobileMenu/menuFooter'),
  {
    ssr: false,
  },
);

const NavMenu = dynamic(
  () => import('@/components/organisms/MobileMenu/navMenu'),
  {
    ssr: false,
  },
);

const Socials = dynamic(() => import('@/components/organisms/Socials'), {
  ssr: false,
});

const LayoutMenu = dynamic(
  () => import('@/components/organisms/layout/LayoutMenu'),
  {
    ssr: false,
  },
);

const SearchContainer = dynamic(
  () => import('@/components/molecules/search/seachContainer'),
  {
    ssr: false,
  },
);

export default function Layout({
  children,
  className,
  menu,
  settings,
  seo,
}: Props) {
  const isDesktop = useIsDesktop();
  const isMobile = useIsMobile();
  return (
    <>
      <DefaultSeo settings={settings} seo={seo} />
      <div
        id={'main-body'}
        className={twMerge(
          'relative container mx-auto p-[15px_0.25rem_0.25rem_0.25rem]   lg:p-[70px_0.25rem_0.25rem_0.25rem] lg:p-3',
          className,
        )}
      >
        {children}
        {isDesktop && menu && <LayoutMenu menu={menu} />}
      </div>
      {isMobile && menu && <NavMenu menu={menu} settings={settings} />}
      <Socials />
      <MenuFooter isFixed={true} />
      <PopupProduct />
      {isMobile && (
        <SearchContainer
          key={'search-container-wrapper'}
          isMobile={true}
          settings={settings}
        />
      )}
      {/*<PageLoading />*/}
    </>
  );
}
