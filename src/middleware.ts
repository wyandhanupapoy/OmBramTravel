import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect Admin Routes
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    
    const adminSession = req.cookies.get("admin_session");
    if (!adminSession) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  // Protect Driver Routes
  if (pathname.startsWith("/driver")) {
    if (pathname === "/driver/login") return NextResponse.next();
    
    const driverSession = req.cookies.get("driver_session");
    if (!driverSession) {
      return NextResponse.redirect(new URL("/driver/login", req.url));
    }
    return NextResponse.next();
  }

  // Skip other specific paths
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Handle i18n routing for everything else
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
