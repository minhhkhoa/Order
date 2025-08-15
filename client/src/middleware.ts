//- file nay chay o server

import { NextResponse, NextRequest } from "next/server";

const privatePaths = ["/manage"];
const unAuthPaths = ["/login"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  //- chua dang nhap
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  //- dang nhap roi thi ko cho vao login nua
  if (unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  //- th login roi nhung access_token het han (khi het han thi no se tu dong xoa) ma lai doi truy cap vao privatePath
  if (
    privatePaths.some((path) => pathname.startsWith(path)) &&
    !accessToken &&
    refreshToken
  ) {
    //- cho no ve page logout de thuc hien logic tra kem refreshToken ve page logout luon
    const url = new URL("/refresh-token", request.url);
    url.searchParams.set("refreshToken", refreshToken);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  //- tất cả route nào mà có /manage thì đều chịu sự quản lý của middleware
  matcher: ["/manage/:path*", "/login"],
};
