import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connectTenantDB } from "./lib/db";
export const runtime = "nodejs";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Skip static assets and internal Next.js routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname.includes(".") || // Most static files have a dot
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const db = await connectTenantDB();

  const branding = await db
    .collection("tenant_registry")
    .findOne({ type: "branding" });

  const locales = branding?.languages.available.map((d: any) => d.code);
  const defaultLocale = branding?.languages.default;

  // 2. Skip API routes (Admin is now localized)
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 3. Check if the current pathname already has a supported locale prefix
  const pathnameHasLocale = locales.some(
    (locale: any) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // 4. If no locale is present, redirect to the default locale (en)
  const redirectUrl = new URL(`/${defaultLocale}${pathname}`, req.url);

  // Clean up double slashes just in case
  redirectUrl.pathname = redirectUrl.pathname.replace(/\/+/g, "/");

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  // Matcher ignoring `/_next` and `/api`
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
