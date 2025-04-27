import Link from 'next/link';
import { ReactNode } from 'react';
import useUser from '@/hooks/useUser';
import { useRouter } from 'next/router';

export default function AccountTemplate({ children }: { children: ReactNode }) {
  const { logout } = useUser();
  const router = useRouter();
  return (
    <>
      <h1 className={'text-3xl text-primary font-[700] lg:font-bold my-6'}>
        Tài khoản
      </h1>
      <div className={'w-full grid grid-cols-1 lg:grid-cols-6 gap-3'}>
        <ul className={'border border-gray-200'}>
          <li
            className={
              'transition-colors duration-500 font-semibold hover:bg-primary hover:text-white border-b border-gray-200'
            }
          >
            <div className={'p-3'}>
              <Link
                className={'text-lg'}
                href={'/tai-khoan/thong-tin-tai-khoan'}
              >
                Thông tin tài khoản
              </Link>
            </div>
          </li>
          <li
            className={
              'transition-colors duration-500 font-semibold hover:bg-primary hover:text-white border-b border-gray-200'
            }
          >
            <div className={'p-3'}>
              <Link className={'text-lg'} href={'/tai-khoan/lich-su'}>
                Lịch sử mua hàng
              </Link>
            </div>
          </li>
          <li
            className={
              'transition-colors duration-500 font-semibold hover:bg-primary hover:text-white border-b border-gray-200'
            }
          >
            <div className={'p-3'}>
              <Link className={'text-lg'} href={'/tai-khoan/dia-chi'}>
                Sổ địa chỉ
              </Link>
            </div>
          </li>
          <li
            className={
              'transition-colors duration-500 font-semibold hover:bg-primary hover:text-white border-b border-gray-200'
            }
          >
            <div className={'p-3'}>
              <button
                type={'button'}
                onClick={() => {
                  logout();
                  router.push('/');
                }}
              >
                Đăng xuất
              </button>
            </div>
          </li>
        </ul>
        <div className={'lg:col-span-5 p-3 bg-white rounded-[10px] w-full'}>
          {children}
        </div>
      </div>
    </>
  );
}
