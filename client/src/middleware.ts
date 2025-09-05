import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { decodeToken } from "./lib/jwt";
import { Role } from "./constants/type";

const intlMiddleware = createIntlMiddleware(routing);

const managePaths = ["/manage"];
const guestPaths = ["/guest"];
const onlyOwnerPaths = ["/manage/accounts"];
const privatePaths = [...managePaths, ...guestPaths];
const unAuthPaths = ["/login"];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1) i18n trước
  const intlRes = intlMiddleware(request);
  if (intlRes && (intlRes.redirected || intlRes.headers.get("Location"))) {
    return intlRes;
  }

  // 2) Chuẩn hóa path
  const LOCALES = routing.locales.join("|");
  const normalizedPath =
    pathname.replace(new RegExp(`^/(?:${LOCALES})(?=/|$)`), "") || "/";

  // 3) Auth/role
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (privatePaths.some((p) => normalizedPath.startsWith(p)) && !refreshToken) {
    const url = new URL(`/login`, request.url);
    url.searchParams.set("clearTokens", "true");
    return NextResponse.redirect(url);
  }

  if (refreshToken) {
    if (unAuthPaths.some((p) => normalizedPath.startsWith(p))) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (
      privatePaths.some((p) => normalizedPath.startsWith(p)) &&
      !accessToken
    ) {
      const url = new URL("/refresh-token", request.url);
      url.searchParams.set("refreshToken", refreshToken);
      url.searchParams.set("redirect", pathname); // giữ nguyên pathname có locale để quay lại đúng ngôn ngữ
      return NextResponse.redirect(url);
    }

    const role = decodeToken(refreshToken).role;

    const isGuestGoToManagePath =
      role === Role.Guest &&
      managePaths.some((p) => normalizedPath.startsWith(p));

    const isNotGuestGoToGuestPath =
      role !== Role.Guest &&
      guestPaths.some((p) => normalizedPath.startsWith(p));

    const isNotOwnerGoToOwnerPath =
      role !== Role.Owner &&
      onlyOwnerPaths.some((p) => normalizedPath.startsWith(p));

    if (
      isGuestGoToManagePath ||
      isNotGuestGoToGuestPath ||
      isNotOwnerGoToOwnerPath
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
