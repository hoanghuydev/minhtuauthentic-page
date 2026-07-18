import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCookie } from '@/utils';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.endsWith('.md') && pathname.length > '.md'.length) {
    const strippedPath = pathname.slice(0, -'.md'.length);
    return NextResponse.rewrite(
      new URL(`/api/markdown${strippedPath}${request.nextUrl.search}`, request.url),
    );
  }

  const user = getCookie('user', request.headers.get('cookie') || '');
  if (pathname === '/gio-hang/thanh-toan') {
    if (!user) {
      return NextResponse.redirect(
        process.env.APP_URL +
          '/tai-khoan/dang-nhap?redirectUrl=/gio-hang/thanh-toan',
      );
    }
    return NextResponse.next();
  }
}
