import Menu from '@/components/molecules/header/menu';
import { ResponseMenuDto } from '@/dtos/responseMenu.dto';
import { twMerge } from 'tailwind-merge';

const MenuWrapper = ({
  menu,
  className,
}: {
  menu: ResponseMenuDto;
  className?: string;
}) => {
  return <Menu className={twMerge('h-full', className)} menu={menu} />;
};
export default MenuWrapper;
