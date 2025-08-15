"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";
import {
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";

// Những page sau sẽ không check refesh token
const UNAUTHENTICATED_PATH = ["/login", "/logout", "/refresh-token"];
export default function RefreshToken() {
  const pathname = usePathname();

  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    let interval: any = null;
    // Phải gọi lần đầu tiên, vì interval sẽ chạy sau thời gian TIMEOUT
    const checkAndRefreshToken = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      if (!accessToken || !refreshToken) return;

      const decodeAccessToken = jwt.decode(accessToken) as {
        exp: number;
        iat: number;
      };
      const decodeRefreshToken = jwt.decode(refreshToken) as {
        exp: number;
        iat: number;
      };

      const now = Math.round(new Date().getTime() / 1000);

      //- Refresh_token het han thi ko xu ly nua
      if (decodeRefreshToken.exp <= now) return;

      if (
        decodeAccessToken.exp - now <
        (decodeAccessToken.exp - decodeAccessToken.iat) / 3
      ) {
        //- goi api refresh_token
        try {
          const res = await authApiRequest.clientNextRefreshToken();
          setAccessTokenToLocalStorage(res.payload.data.accessToken);
          setRefreshTokenToLocalStorage(res.payload.data.refreshToken);
        } catch (error) {
          clearInterval(interval);
        }
      }
    };

    //- phai goi lan dau tien vi interval se chay sau thoi gian timeout
    checkAndRefreshToken();

    const TIME_OUT = 1000; //- no se phai < time het han cua AccessToken  de no co the chay lien tuc kiem tra sap het accesstoken thi se call api de lay acccess/refresh moi
    interval = setInterval(checkAndRefreshToken, TIME_OUT);
    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}
