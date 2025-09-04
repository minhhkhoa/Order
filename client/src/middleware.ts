//- file nay chay o server

import { NextResponse, NextRequest } from "next/server";
import { decodeToken } from "./lib/jwt";
import { Role } from "./constants/type";

const managePaths = ["/manage"];
const guestPaths = ["/guest"];
const onlyOwnerPaths = ["/manage/accounts"];
const privatePaths = [...managePaths, ...guestPaths];
const unAuthPaths = ["/login"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  //- 1. chua dang nhap
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL(`/login`, request.url);
    url.searchParams.set("clearTokens", "true");
    return NextResponse.redirect(url);
  }

  //- 2. Da dang nhap
  if (refreshToken) {
    //- 2.1: Neu co tinh vao login -> redirect ve /
    if (unAuthPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    //- 2.2: Neu login roi nhung access_token het han (khi het han thi no se tu dong xoa) ma lai doi truy cap vao privatePath
    if (
      privatePaths.some((path) => pathname.startsWith(path)) &&
      !accessToken
    ) {
      //- cho no ve page logout de thuc hien logic tra kem refreshToken ve page logout luon
      const url = new URL("/refresh-token", request.url);
      url.searchParams.set("refreshToken", refreshToken);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    //- 2.3: Vao khong dung role thi redirect -> /
    const role = decodeToken(refreshToken).role;
    //- guest nhung vao route owner
    const isGuestGoToManagePath =
      role === Role.Guest &&
      managePaths.some((path) => pathname.startsWith(path));

    //- ko phai guest nhung co vao route cua guest
    const isNotGuestGoToGuestPath =
      role !== Role.Guest &&
      guestPaths.some((path) => pathname.startsWith(path));

    // Không phải Owner nhưng cố tình truy cập vào các route dành cho owner
    const isNotOwnerGoToOwnerPath =
      role !== Role.Owner &&
      onlyOwnerPaths.some((path) => pathname.startsWith(path));
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
  //- tất cả route nào mà có /manage thì đều chịu sự quản lý của middleware
  matcher: ["/manage/:path*", "/guest/:path*", "/login"],
};
