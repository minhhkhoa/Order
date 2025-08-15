"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { checkAndRefreshToken } from "@/lib/utils";

// Những page sau sẽ không check refesh token
const UNAUTHENTICATED_PATH = ["/login", "/logout", "/refresh-token"];
export default function RefreshToken() {
  const pathname = usePathname();

  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    let interval: any = null;
    // Phải gọi lần đầu tiên, vì interval sẽ chạy sau thời gian TIMEOUT

    //- phai goi lan dau tien vi interval se chay sau thoi gian timeout
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval);
      },
    });

    const TIME_OUT = 1000; //- no se phai < time het han cua AccessToken  de no co the chay lien tuc kiem tra sap het accesstoken thi se call api de lay acccess/refresh moi
    interval = setInterval(checkAndRefreshToken, TIME_OUT);
    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}
