import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['id', 'en'];
const publicPages = ['/login'];

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'id',
});

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value;

  const isPublic = publicPages.some(p => pathname.includes(p));

  if (!token && !isPublic) {
    const loginUrl = new URL('/id/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isPublic) {
    const homeUrl = new URL('/id/pos', request.url);
    return NextResponse.redirect(homeUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
