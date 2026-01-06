import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'fr', 'ln', 'sw'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  // Get locale from cookie
  const locale = request.cookies.get('NEXT_LOCALE')?.value || defaultLocale;
  
  // Validate locale
  const validLocale = locales.includes(locale) ? locale : defaultLocale;
  
  // Create response
  const response = NextResponse.next();
  
  // Set locale header for next-intl
  response.headers.set('x-locale', validLocale);
  
  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - api routes
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
