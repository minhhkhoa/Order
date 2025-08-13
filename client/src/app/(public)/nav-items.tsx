"use client";

import { getAccessTokenFromLocalStorage } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

const menuItems = [
  {
    title: "Món ăn",
    href: "/menu",
    //- authRequired = undefined nghĩa là login hay chưa cũng hiển thị
  },
  {
    title: "Đơn hàng",
    href: "/orders",
    authRequired: true,
  },
  {
    title: "Đăng nhập",
    href: "/login",
    authRequired: false, //- false nghĩa là chưa login và cho hiển thị
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    authRequired: true, //- true nghĩa là đang login và cho hiển thị
  },
];

export default function NavItems({ className }: { className?: string }) {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(Boolean(getAccessTokenFromLocalStorage()));
  }, []);

  return menuItems.map((item) => {
    if (
      (item.authRequired === false && isAuth) ||
      (item.authRequired === true && !isAuth)
    )
      return null;
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    );
  });
}

// Lưu ý: Không đọc localStorage trực tiếp khi render component.
// Nếu đọc ngay trong render, server (SSR) sẽ không có localStorage nên trả về HTML khác client,
// gây ra lỗi "Hydration failed because the server rendered text didn't match the client".
// Giải pháp: Khởi tạo state với giá trị mặc định (ví dụ false) và đọc localStorage bên trong useEffect,
// vì useEffect chỉ chạy ở client sau khi HTML đã được gắn vào DOM → tránh mismatch.

/*
Trường hợp code thứ hai không lỗi

  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    setIsAuth(Boolean(getAccessTokenFromLocalStorage()));
  }, []);

Diễn biến:
  Bước 1 (Server):
    1. useState(false) → isAuth = false.
    2. Server render HTML giống như người chưa đăng nhập.

  Bước 2 (Hydration ở client):
    1. Client render lại lần đầu cũng với isAuth=false → HTML giống hệt server → không lỗi.
    2. Sau khi HTML đã gắn xong vào DOM, useEffect mới chạy → đọc localStorage → setIsAuth(true) nếu có token.
    2. Lúc này React chỉ update DOM chứ không so sánh với HTML server nữa.

 ==> Vì giá trị ban đầu của isAuth ở cả server và client đều giống nhau, nên không có hydration error.
*/
