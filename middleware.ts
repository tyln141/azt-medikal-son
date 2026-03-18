import { NextRequest, NextResponse } from "next/server";

const locales = ["tr", "en", "de", "fr"];
const defaultLocale = "tr";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if pathname starts with any locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Ignore /admin, /api, and static files
  if (
    pathname.startsWith("/secure-admin-login") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") // to skip images etc.
  ) {
    return;
  }

  // Redirect if no locale found
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
