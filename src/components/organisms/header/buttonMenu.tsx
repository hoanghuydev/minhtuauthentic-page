import IconBars from '@/components/icons/bars';
import { useContext, useEffect, useState } from 'react';
import Menu from '@/components/molecules/header/menu';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';
import { ResponseMenuDto } from '@/dtos/responseMenu.dto';
import { useRouter } from 'next/router';
import appContext from '@/contexts/appContext';

const ButtonMenu = ({ menu }: { menu: ResponseMenuDto | undefined }) => {
  const appCtx = useContext(appContext);
  const [isReady, setIsReady] = useState<boolean>(false);
  const {pathname} = useRouter();
  useEffect(() => {
    setIsReady(true);
  }, []);
  const handleClickMenu = () => {
    const offset = window.scrollY;
    if (pathname === '/' && offset < 50) {
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    } else {
      appCtx?.setIsOpenMenu && appCtx.setIsOpenMenu(!appCtx.isOpenMenu);
    }
  };
  return (
    <>
      <button
        type={'button'}
        className={
          'flex p-2 rounded-[10px] items-center gap-2 text-white grow bg-[hsla(0,0%,100%,.2)]'
        }
        onClick={handleClickMenu}
      >
        <IconBars className={'w-[24px] h-[24px]'} />
        <span className={'w-max'}>Danh mục</span>
      </button>
    </>
  );
};
export default ButtonMenu;
