import IconBars from '@/components/icons/bars';
import Link from 'next/link';
import LogoComponent from '@/components/atoms/logo';
import { LogoProps } from '@/config/type';
import { useContext } from 'react';
import appContext from '@/contexts/appContext';
import { SettingsDto } from '@/dtos/Settings.dto';
import { twMerge } from 'tailwind-merge';
import dynamic from 'next/dynamic';
const HeaderCart = dynamic(() => import('@/components/icons/header-cart'), {
  ssr: false,
});

type Props = {
  settings?: SettingsDto[];
  className?: string;
};

export default function NavbarMenuListButton({ settings, className }: Props) {
  const appCtx = useContext(appContext);
  return (
    <div className={twMerge('flex p-3 gap-2 items-center', className)}>
      <button
        type={'button'}
        className={'w-[40px] lg:hidden'}
        onClick={() => {
          appCtx?.setIsOpenNavMenu &&
            appCtx.setIsOpenNavMenu(!appCtx?.isOpenNavMenu);
        }}
      >
        <IconBars className={'w-[40px] h-[40px] text-white'} />
      </button>
      <a className={'grow lg:shrink-0'} href={'/'}>
        {settings && (
          <LogoComponent
            position={LogoProps.HEADER}
            settings={settings}
            className={'object-contain h-[45px] w-auto m-auto'}
          />
        )}
      </a>
      <HeaderCart
        className={'w-[40px] h-[40px] shrink-0'}
        classNumber={'text-white'}
      />
    </div>
  );
}
