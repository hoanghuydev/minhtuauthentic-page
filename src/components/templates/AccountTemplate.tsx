import Link from 'next/link';
import { ReactNode } from 'react';
import useUser from '@/hooks/useUser';
import { useRouter } from 'next/router';
import IconDocument from '@/components/icons/document';
import MapIconFooter from '@/components/icons/menuFooter/Map';
import IconLogout from '@/components/icons/logout';
import { UserDto } from '@/dtos/User.dto';
import profileImage from '@/static/images/profile.png';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import IconSetting from '../icons/setting';

export default function AccountTemplate({
  children,
  profile,
}: {
  children: ReactNode;
  profile?: UserDto;
}) {
  const { logout } = useUser();
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  const getNavItemClasses = (path: string) => {
    return twMerge(
      'text-base lg:text-base flex items-center transition-colors duration-500 font-semibold hover:bg-red-50 hover:text-red-500 border-b border-gray-200 relative',
      isActive(path) &&
        'bg-red-50 text-red-500 after:absolute after:bottom-0 after:left-0 after:w-1 after:h-full after:bg-red-500 after:rounded-r-full',
    );
  };

  return (
    <>
      <h1
        className={twMerge(
          'text-3xl text-red font-[700] lg:font-bold my-6 sr-only',
        )}
      >
        Tài khoản
      </h1>
      <div className={twMerge('w-full grid grid-cols-1 lg:grid-cols-6 gap-3')}>
        <div className={twMerge('bg-white py-3 rounded-lg shadow-sm')}>
          {/* Profile Section */}
          {profile && (
            <div className={twMerge('p-4 border-b border-gray-200 mb-3')}>
              <div className={twMerge('flex items-center gap-3')}>
                <Image
                  src={profileImage}
                  alt="Profile"
                  className={twMerge(
                    'w-12 h-12 border-primary border-[2px] rounded-full object-cover',
                  )}
                />
                <div>
                  <div className={twMerge('font-bold text-sm')}>
                    {profile.name}
                  </div>
                  <div
                    className={twMerge('text-gray-500')}
                    style={{ fontSize: '12px' }}
                  >
                    {profile.phone}
                  </div>
                </div>
              </div>
            </div>
          )}

          <ul>
            <li className={getNavItemClasses('/tai-khoan/thong-tin-tai-khoan')}>
              <Link
                className={twMerge('p-3 flex items-center gap-3 w-full')}
                href={'/tai-khoan/thong-tin-tai-khoan'}
              >
                <IconSetting className={twMerge('w-5 h-5 text-[#212529]')} />
                <span className={twMerge('text-base')}>
                  Thông tin tài khoản
                </span>
              </Link>
            </li>
            <li className={getNavItemClasses('/tai-khoan/lich-su')}>
              <Link
                className={twMerge('p-3 flex items-center gap-3 w-full')}
                href={'/tai-khoan/lich-su'}
              >
                <IconDocument className={twMerge('w-5 h-5')} />
                <span className={twMerge('text-base')}>Lịch sử mua hàng</span>
              </Link>
            </li>
            <li className={getNavItemClasses('/tai-khoan/dia-chi')}>
              <Link
                className={twMerge('p-3 flex items-center gap-3 w-full')}
                href={'/tai-khoan/dia-chi'}
              >
                <MapIconFooter className={twMerge('w-5 h-5')} />
                <span className={twMerge('text-base')}>Sổ địa chỉ</span>
              </Link>
            </li>
            <li
              className={twMerge(
                'text-base lg:text-base flex items-center transition-colors duration-500 font-semibold hover:bg-red-50 hover:text-red-500 border-b border-gray-200',
              )}
            >
              <button
                type={'button'}
                className={twMerge(
                  'p-3 flex items-center gap-3 w-full text-left',
                )}
                onClick={() => {
                  logout();
                  router.push('/');
                }}
              >
                <IconLogout className={twMerge('w-5 h-5')} />
                <span className={twMerge('text-base')}>Đăng xuất</span>
              </button>
            </li>
          </ul>
        </div>
        <div
          className={twMerge(
            'lg:col-span-5 p-3 bg-white rounded-[10px] shadow-sm w-full',
          )}
        >
          {children}
        </div>
      </div>
    </>
  );
}
