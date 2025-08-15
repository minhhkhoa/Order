"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { checkAndRefreshToken } from "@/lib/utils";

// Những page sau sẽ không check refesh token
const UNAUTHENTICATED_PATH = ["/login", "/logout", "/refresh-token"];
export default function RefreshToken() {
  const pathname = usePathname();
  const route = useRouter();

  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    let interval: any = null;

    //- phai goi lan dau tien vi interval se chay sau thoi gian timeout
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval);
        route.push("/login");
      },
    });

    const TIME_OUT = 1000; //- no se phai < time het han cua AccessToken  de no co the chay lien tuc kiem tra sap het accesstoken thi se call api de lay acccess/refresh moi
    interval = setInterval(
      () =>
        checkAndRefreshToken({
          onError: () => {
            clearInterval(interval);
            route.push("/login");
          },
        }),
      TIME_OUT
    );
    return () => clearInterval(interval);
  }, [pathname, route]);

  return null;
}
