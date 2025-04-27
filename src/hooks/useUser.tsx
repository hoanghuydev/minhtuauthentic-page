import { UserDto } from '@/dtos/User.dto';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AppContext from '@/contexts/appContext';
import user from '@/components/icons/user';

export default function useUser() {
  const appContext = useContext(AppContext);
  const router = useRouter();
  const pathnameNeedLogin = [
    '/gio-hang/thanh-toan',
    '/gio-hang/thanh-cong',
    '/tai-khoan/lich-su/[id]',
    '/tai-khoan/thong-tin-tai-khoan',
    '/gio-hang/thanh-cong',
    '/gio-hang/thanh-toan',
  ];
  const pathnameDontNeedLogin = [
    '/tai-khoan/dang-nhap',
    '/tai-khoan/dang-ky',
    '/tai-khoan/quen-mat-khau',
  ];

  useEffect(() => {
    const user = getCookie('user');
    if (user) {
      const obj = JSON.parse(user);
      appContext?.setUser && appContext.setUser(obj);
    }
  }, []);

  useEffect(() => {
    const user = getCookie('user');
    if (user && pathnameDontNeedLogin.includes(router.pathname)) {
      const redirectUrl = router?.query?.redirectUrl;
      router.push('/' + (redirectUrl as string || ''));
    } else if (pathnameNeedLogin.includes(router.pathname) && !user) {
      router.push('/tai-khoan/dang-nhap?redirectUrl=' + router.asPath);
    }
  }, [router.pathname]);

  const setCookieUser = (user: UserDto) => {
    appContext?.setUser && appContext.setUser(user);
    setCookie('user', JSON.stringify(user), {
      maxAge: 86400,
      path: '/',
    });
  };

  const logout = () => {
    appContext?.setUser && appContext.setUser(undefined);
    deleteCookie('user');
  };

  return { user: appContext?.user, setCookieUser, logout };
}
