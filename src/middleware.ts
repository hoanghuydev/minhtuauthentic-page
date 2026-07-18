import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCookie } from '@/utils';

// Real static files served from public/ - never rewrite these to the AI-document routes.
const RESERVED_TXT_PATHS = ['/robots.txt', '/llms.txt'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.endsWith('.md') && pathname.length > '.md'.length) {
    const strippedPath = pathname.slice(0, -'.md'.length);
    return NextResponse.rewrite(
      new URL(`/api/markdown${strippedPath}${request.nextUrl.search}`, request.url),
    );
  }

  if (
    pathname.endsWith('.txt') &&
    pathname.length > '.txt'.length &&
    !RESERVED_TXT_PATHS.includes(pathname)
  ) {
    const strippedPath = pathname.slice(0, -'.txt'.length);
    return NextResponse.rewrite(
      new URL(`/api/text${strippedPath}${request.nextUrl.search}`, request.url),
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
