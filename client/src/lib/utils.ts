import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "sonner";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//- loại bỏ ký tự "/" ở đầu chuỗi nếu nó tồn tại
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast.error(error?.payload?.message ?? "Lỗi không xác định", {
      duration: duration ?? 5000,
    });
  }
};

const isBrowser = typeof window !== "undefined";

export const getAccessTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("accessToken") : null;

export const getRefreshTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem("refreshToken") : null;

export const setAccessTokenToLocalStorage = (value: string) =>
  isBrowser && localStorage.setItem("accessToken", value);

export const setRefreshTokenToLocalStorage = (value: string) =>
  isBrowser && localStorage.setItem("refreshToken", value);

export const checkAndRefreshToken = async (param?: {
  onError?: () => void;
  onSuccess?: () => void;
  force?: boolean;
}) => {
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

      if (param?.onSuccess) {
        param.onSuccess();
      }
    } catch (error) {
      if (param?.onError) {
        param.onError();
      }
    }
  }
};

export const removeTokensFromLocalStorage = () => {
  if (isBrowser) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};
