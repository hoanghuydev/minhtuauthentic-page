import HeaderItem from '@/components/molecules/header/item';
import { IconPhone } from '@/components/icons/phone';
import IconTruck from '@/components/icons/truck';
import IconUser from '@/components/icons/user';
import ButtonMenu from '@/components/organisms/header/buttonMenu';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ResponseMenuDto } from '@/dtos/responseMenu.dto';
import { Button, Dropdown } from 'antd/es';
import useUser from '@/hooks/useUser';
import { useRouter } from 'next/router';
import CartPreview from '@/components/molecules/header/cartPreview';
import { CloseCircleOutlined, BarsOutlined } from '@ant-design/icons';
import OrderContext from '@/contexts/orderContext';
import { useContext } from 'react';
import IconWifi from '@/components/icons/wifi';
import { SettingsDto } from '@/dtos/Settings.dto';
import { SETTING_KEY } from '@/config/enum';
import dynamic from 'next/dynamic';

import NavMenuHeader from '@/components/organisms/MobileMenu/navMenu/header';
import LogoComponent from '@/components/atoms/logo';
import { LogoProps } from '@/config/type';
import { useIsDesktop } from '@/hooks/useDevice';
const InputSearchDesktop = dynamic(
  () => import('@/components/molecules/header/InputSearch/desktop'),
  {
    ssr: false,
  },
);
const HeaderCart = dynamic(() => import('@/components/icons/header-cart'), {
  ssr: false,
});
type Props = {
  menu?: ResponseMenuDto | undefined;
  settings?: SettingsDto[];
};
export const Header = ({ menu, settings }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useUser();
  const orderCtx = useContext(OrderContext);
  const isDesktop = useIsDesktop();
  const pageHeader = (settings || []).find(
    (item) => item?.key && item?.key === SETTING_KEY.GENERAL.PAGE_HEADER.KEY,
  );

  return (
    <>
      <div
        className={
          ' hidden lg:!grid  bg-primaryGrey relative z-[3] grid-cols-3 items-center p-3 h-[50px]'
        }
      >
        {pageHeader?.value && (
          <>
            <div
              dangerouslySetInnerHTML={{
                __html: pageHeader?.value?.page_title_left || '',
              }}
            />
            <div
              className={'text-center'}
              dangerouslySetInnerHTML={{
                __html: pageHeader?.value?.page_title_center || '',
              }}
            />
            <div
              className={'text-right'}
              dangerouslySetInnerHTML={{
                __html: pageHeader?.value?.page_title_right || '',
              }}
            />
          </>
        )}
      </div>
      <header
        id={'header'}
        className={'bg-primary lg:py-[10px] sticky top-0 left-0 z-[100]'}
      >
        <NavMenuHeader
          className={'lg:hidden'}
          isMobile={true}
          settings={settings}
        />
        <div
          className={
            'max-lg:hidden container mx-auto flex justify-between items-center gap-[10px]'
          }
        >
          <Link className={'shrink-0'} href={'/'}>
            <LogoComponent
              position={LogoProps.HEADER}
              settings={settings || []}
              className={'object-contain w-[230px] h-[60px] '}
            />
          </Link>

          <ButtonMenu menu={menu} />
          {isDesktop && <InputSearchDesktop key={'input-search-desktop'} />}
          <HeaderItem
            className={'w-max'}
            icon={<IconPhone className={'w-[24px] h-[24px]'} />}
            href={'tel:0961693869'}
          >
            <p className={'block'}>Gọi mua hàng</p>
            <p>0961693869</p>
          </HeaderItem>
          <HeaderItem
            className={'w-max text-left'}
            icon={<IconWifi className={'w-[30px] h-[30px]'} />}
            isButton
            onClick={() => {
              window.open(
                'https://www.google.com/maps/place/N%C6%B0%E1%BB%9Bc+Hoa+Ch%C3%ADnh+H%C3%A3ng+-+Minh+T%C3%BA+Authentic/@10.7726,106.62672,15z/data=!4m6!3m5!1s0x31752df3970ab413:0x908ad6fe074c5688!8m2!3d10.7726003!4d106.6267201!16s%2Fg%2F11j_8xbgmd?hl=vi&entry=ttu&g_ep=EgoyMDI0MDkxOC4xIKXMDSoASAFQAw%3D%3D',
              );
            }}
          >
            <p>Cửa hàng</p>
            <p>gần bạn</p>
          </HeaderItem>
          <HeaderItem
            className={'w-max'}
            icon={<IconTruck className={'w-[40px] h-[40px]'} />}
            href={'/kiem-tra-don-hang'}
          >
            <p className={'w-max'}>Tra cứu</p>
            <p className={'w-max'}>đơn hàng</p>
          </HeaderItem>
          <div className={'relative'}>
            <HeaderItem
              className={'w-max text-left'}
              icon={<HeaderCart className={'w-[40px] h-[40px]'} />}
              isButton
              onClick={() =>
                orderCtx?.setIsOpenHeaderCart &&
                orderCtx?.setIsOpenHeaderCart(!orderCtx?.isOpenHeaderCart)
              }
            >
              <p>Giỏ</p>
              <p>hàng</p>
            </HeaderItem>
            <div
              className={twMerge(
                'absolute max-h-[600px] overflow-auto top-14 right-0 bg-white p-3 z-[2] rounded-[10px] shadow-custom transition-opacity duration-500',
                orderCtx?.isOpenHeaderCart
                  ? 'visible opacity-100 '
                  : 'invisible opacity-0',
              )}
            >
              <div className={'flex justify-between items-center mb-3 w-full'}>
                <span className={'text-black font-semibold'}>Giỏ hàng</span>
                <button
                  className={'ant-btn ant-btn-link ant-btn-icon-only'}
                  onClick={() => {
                    orderCtx?.setIsOpenHeaderCart &&
                      orderCtx?.setIsOpenHeaderCart(false);
                  }}
                >
                  <CloseCircleOutlined />
                </button>
              </div>
              <CartPreview />
            </div>
          </div>

          <Dropdown
            menu={{
              items: user
                ? [
                    {
                      key: '1',
                      label: <Link href={'/tai-khoan/lich-su'}>Tài khoản</Link>,
                    },
                    {
                      key: '2',
                      label: (
                        <button type={'button'} onClick={() => logout()}>
                          Đăng xuất
                        </button>
                      ),
                    },
                  ]
                : [
                    {
                      key: '1',
                      label: (
                        <Link
                          href={
                            '/tai-khoan/dang-nhap?' +
                            new URLSearchParams({
                              redirectUrl: router.asPath,
                            }).toString()
                          }
                        >
                          Đăng nhập
                        </Link>
                      ),
                    },
                    {
                      key: '2',
                      label: (
                        <Link
                          href={
                            '/tai-khoan/dang-ky?' +
                            new URLSearchParams({
                              redirectUrl: router.asPath,
                            }).toString()
                          }
                        >
                          Đăng ký
                        </Link>
                      ),
                    },
                  ],
            }}
            placement="bottomLeft"
          >
            <Button
              icon={<IconUser className={'w-[30px] h-[30px]'} />}
              type={'link'}
              className={
                '!text-white items-center flex hover:!text-white w-max'
              }
            >
              {user ? (
                <span className={'capitalize'}>{user.name || user.email}</span>
              ) : (
                <>Tài khoản</>
              )}
            </Button>
          </Dropdown>
        </div>
      </header>
      <div
        className={twMerge(
          `relative max-lg:hidden`,
          pathname === '/'
            ? "before:block before:content-[''] before:bg-primary before:rounded-[0_0_50%_50%] before:h-[125px] before:absolute before:left-[50%] before:-translate-x-[50%] before:w-full"
            : '',
        )}
      ></div>
    </>
  );
};
export default Header;
