import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const domain = "gestularia.com";

  if (host.endsWith(domain)) {
    const subdomain = host.replace(`.${domain}`, "");
    if (subdomain && subdomain !== "www") {
      // guardamos el subdominio en un header
      req.headers.set("x-subdomain", subdomain);
    }
  }

  return NextResponse.next({
    request: {
      headers: req.headers,
    },
  });
}
