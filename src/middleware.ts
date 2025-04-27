import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCookie } from '@/utils';

export function middleware(request: NextRequest) {
  const user = getCookie('user', request.headers.get('cookie') || '');
  if (request.nextUrl.pathname === '/gio-hang/thanh-toan') {
    if (!user) {
      return NextResponse.redirect(
        process.env.APP_URL +
          '/tai-khoan/dang-nhap?redirectUrl=/gio-hang/thanh-toan',
      );
    }
    return NextResponse.next();
  }
}
