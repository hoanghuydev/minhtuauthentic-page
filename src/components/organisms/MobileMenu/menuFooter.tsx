import { Fragment, ReactNode, useContext } from 'react';
import HomeIconFooter from '@/components/icons/menuFooter/Home';
import CategoryIcon from '@/components/icons/menuFooter/Category';
import UserIconFooter from '@/components/icons/menuFooter/User';
import useUser from '@/hooks/useUser';
import PhoneIconFooter from '@/components/icons/menuFooter/Phone';
import { useRouter } from 'next/router';
import MapIconFooter from '@/components/icons/menuFooter/Map';
import AppContext from '@/contexts/appContext';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';
import ProductFooterActions from '@/components/molecules/product/productFooterActions';

type Props = {
  isFixed?: boolean;
  className?: string;
};
export default function MenuFooter({ isFixed, className }: Props) {
  const user = useUser();
  const appCtx = useContext(AppContext);
  const router = useRouter();

  const elementFooter: {
    icon: ReactNode;
    label: string;
    onClick: () => void | ReactNode;
  }[] = [
    {
      icon: (<HomeIconFooter className={'text-center w-6'} />) as ReactNode,
      label: 'Trang chủ',
      onClick: () => {
        appCtx?.setIsOpenNavMenu && appCtx.setIsOpenNavMenu(false);
        router.push('/');
      },
    },
    {
      icon: (<CategoryIcon className={'text-center w-6'} />) as ReactNode,
      label: 'Danh mục',
      onClick: () => {
        appCtx?.setIsOpenNavMenu &&
          appCtx.setIsOpenNavMenu(!appCtx?.isOpenNavMenu);
      },
    },
    {
      icon: (<PhoneIconFooter className={'text-center w-6'} />) as ReactNode,
      label: 'Điện thoại',
      onClick: () => {
        router.push('tel:0961693869');
      },
    },
    {
      icon: (<MapIconFooter className={'text-center w-6'} />) as ReactNode,
      label: 'Cửa hàng',
      onClick: () => {
        window.location.href =
          'https://www.google.com/maps/place/N%C6%B0%E1%BB%9Bc+Hoa+Ch%C3%ADnh+H%C3%A3ng+-+Minh+T%C3%BA+Authentic/@10.7726,106.62672,15z/data=!4m6!3m5!1s0x31752df3970ab413:0x908ad6fe074c5688!8m2!3d10.7726003!4d106.6267201!16s%2Fg%2F11j_8xbgmd?entry=ttu&g_ep=EgoyMDI0MDkxOC4xIKXMDSoASAFQAw%3D%3D&gidzl=Tk-kEEzyL0juzweuwcHS17FmgZZzO05OQl3tQFzd30XjzVev_cG6MsRpgs-bCb1OOVIkEJQWfSy4vtXM2W';
      },
    },
    {
      icon: (<UserIconFooter className={'text-center w-6'} />) as ReactNode,
      label: user?.user
        ? user?.user?.name || user?.user?.email || ''
        : 'Đăng nhập',
      onClick: () => {
        if (user?.user) {
          router.push('/tai-khoan/lich-su');
        } else {
          router.push('/tai-khoan/dang-nhap');
        }
      },
    },
  ];

  const ItemMenu = (item: {
    icon: ReactNode;
    label: string;
    onClick: () => void | ReactNode;
  }) => {
    return (
      <div
        className={'flex flex-col gap-1 justify-center flex-1'}
        onClick={item.onClick}
      >
        <div className={'mx-auto'}>{item.icon}</div>
        <span
          className={
            'text-sm text-center max-w-20 line-clamp-1 text-ellipsis overflow-hidden'
          }
        >
          {item.label}
        </span>
      </div>
    ) as ReactNode;
  };

  const renderFooter = () => {
    // Conditionally render product footer or default footer
    if (appCtx?.showProductFooter) {
      return (
        <div
          className={twMerge(
            'lg:hidden bg-primary text-white w-full shadow-custom rounded-tr-2xl rounded-tl-2xl ',
            isFixed && 'fixed bottom-0 left-0 z-[1001]',
            className,
          )}
        >
          <div className={'p-3 flex items-center justify-center'}>
            <ProductFooterActions />
          </div>
        </div>
      );
    }

    return (
      <div
        className={twMerge(
          'lg:hidden bg-primary text-white w-full shadow-custom rounded-tr-2xl rounded-tl-2xl ',
          isFixed && 'fixed bottom-0 left-0 z-[1001]',
          className,
        )}
      >
        <div className={'p-3 flex items-center justify-center'}>
          {elementFooter.map((item, index) => {
            return (
              <Fragment key={'menufooter' + index}>{ItemMenu(item)}</Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {isFixed
        ? createPortal(renderFooter() as ReactNode, document.body)
        : renderFooter()}
    </>
  );
}
