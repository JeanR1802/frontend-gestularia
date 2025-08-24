// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const domain = "gestularia.com";

  if (host.endsWith(domain)) {
    const subdomain = host.replace(`.${domain}`, "");
    if (subdomain && subdomain !== "www") {
      const url = req.nextUrl.clone();
      url.pathname = `/tiendas/${subdomain}${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}
