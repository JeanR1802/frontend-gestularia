// middleware.ts (en la raíz de tu proyecto)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get('host');
  const rootDomain = 'gestularia.com';

  if (host && host !== rootDomain && host !== `www.${rootDomain}`) {
    const subdomain = host.replace(`.${rootDomain}`, '');
    url.pathname = `/_sites/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};