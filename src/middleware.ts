import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { locales, type Locale } from "@/i18n/config";

const countryLocales: Record<string, Locale> = {
  ID: "id", MY: "ms", SG: "en", GB: "en", US: "en", AU: "en", CN: "zh", TW: "zh",
  JP: "ja", KR: "ko", TH: "th", IN: "ta", SA: "ar"
};

function getPreferredLocale(req: NextRequest) {
  const countryLocale = countryLocales[req.headers.get("x-vercel-ip-country")?.toUpperCase() || ""];
  if (countryLocale) return countryLocale;

  const language = req.headers.get("accept-language")?.split(",")[0]?.split("-")[0];
  return locales.includes(language as Locale) ? language as Locale : routing.defaultLocale;
}

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

  const hasLocale = locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
  if (!hasLocale && pathname === "/" && !req.cookies.get("NEXT_LOCALE")) {
    return NextResponse.redirect(new URL(`/${getPreferredLocale(req)}`, req.url));
  }

  // Handle i18n routing for everything else
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
