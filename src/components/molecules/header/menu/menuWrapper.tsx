import Menu from '@/components/molecules/header/menu';
import appContext from '@/contexts/appContext';
import { useContext } from 'react';
import { ResponseMenuDto } from '@/dtos/responseMenu.dto';
import { twMerge } from 'tailwind-merge';

const MenuWrapper = ({
  menu,
  className,
}: {
  menu: ResponseMenuDto;
  className?: string;
}) => {
  const appCtx = useContext(appContext);
  return (
    <Menu
      className={twMerge('h-full', className)}
      menu={menu}
      isOpenMenu={appCtx?.isOpenMenu || false}
    />
  );
};
export default MenuWrapper;
