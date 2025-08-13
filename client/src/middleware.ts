//- file nay chay o server

import { NextResponse, NextRequest } from "next/server";

const privatePaths = ["/manage"];
const unAuthPaths = ["/login"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuth = Boolean(request.cookies.get("accessToken")?.value);
  //- chua dang nhap
  if (privatePaths.some((path) => pathname.startsWith(path)) && !isAuth) {
    return NextResponse.redirect(new URL("/login", request.url));
  } 

  //- dang nhap roi thi ko cho vao login nua
  if (unAuthPaths.some((path) => pathname.startsWith(path)) && isAuth) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  //- tất cả route nào mà có /manage thì đều chịu sự quản lý của middleware
  matcher: ["/manage/:path*", "/login"],
};
