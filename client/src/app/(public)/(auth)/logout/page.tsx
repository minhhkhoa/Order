"use client";

import { useAppStore } from "@/components/app-provider";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useRef } from "react";

function Logout() {
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const accessTokenFromUrl = searchParams.get("accessToken");
  const { mutateAsync } = useLogoutMutation();
  const setRole = useAppStore((state) => state.setRole);
  const route = useRouter();
  const ref = useRef<any>(null); //- được dùng như một biến cờ (flag) để ghi nhớ trạng thái gọi API
  useEffect(() => {
    if (
      ref.current ||
      (refreshTokenFromUrl &&
        refreshTokenFromUrl != getRefreshTokenFromLocalStorage()) ||
      (accessTokenFromUrl &&
        accessTokenFromUrl != getAccessTokenFromLocalStorage())
    )
      return; //- Nếu đã có giá trị => tức là API đã được gọi => return

    ref.current = mutateAsync; //- Đánh dấu là đã gọi
    mutateAsync().then((res) => {
      setTimeout(() => {
        ref.current = null; //- Reset lại flag sau 1s (nếu muốn cho phép gọi lại sau này)
      }, 1000);

      setRole();
      route.push("/login");
    });
  }, [mutateAsync, route, refreshTokenFromUrl, accessTokenFromUrl, setRole]);
  return <div> Logout...</div>;
}

export default function LogoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Logout />
    </Suspense>
  );
}

/*
Luồng xử lý:
  1.Lần đầu chạy useEffect
    +) ref.current đang là null → chưa gọi API trước đó → tiếp tục.
    +) Gán ref.current = mutateAsync để đánh dấu "API đang được gọi".
    +) Gọi mutateAsync() → thực hiện logout.
    +) Sau khi xong, setTimeout đặt lại ref.current = null (cho phép gọi lại sau nếu cần).
  2.Nếu useEffect chạy lại ngay lập tức (do React Strict Mode hoặc re-render)
    +) ref.current đã có giá trị → if (ref.current) return; → thoát ngay → API không bị gọi lần 2.

Kết luận
  +) Đây là một kỹ thuật khá gọn để:
  +) Ngăn API bị gọi lặp trong useEffect (đặc biệt ở dev mode).
  +) Tránh lỗi logout 2 lần.
  +) Không cần phải tắt Strict Mode.


Việc check: refreshTokenFromUrl != getRefreshTokenFromLocalStorage(): có mục đích ngăn việc mình truy cập /logout thì bị logout
==> chỉ logout khi gửi đúng refreshToken.
*/
