// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  console.log('--- INICIO DEL MIDDLEWARE ---');
  
  const url = req.nextUrl.clone(); // Usamos clone para seguridad
  const host = req.headers.get('host');
  const rootDomain = 'gestularia.com';

  console.log(`Host detectado: ${host}`);

  if (host && host !== rootDomain && !host.startsWith('www.')) {
    const subdomain = host.replace(`.${rootDomain}`, '');
    console.log(`Subdominio detectado: "${subdomain}"`);
    
    // Reescribimos la URL
    url.pathname = `/_sites/${subdomain}${url.pathname}`;
    console.log(`Reescribiendo URL a: ${url.pathname}`);
    
    return NextResponse.rewrite(url);
  } else {
    console.log('No se detectó un subdominio válido. Dejando pasar la solicitud.');
  }

  return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};