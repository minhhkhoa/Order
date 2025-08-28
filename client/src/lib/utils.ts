import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "sonner";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";
import { DishStatus, OrderStatus, Role, TableStatus } from "@/constants/type";
import { envConfig } from "@/config";
import { TokenPayload } from "@/types/jwt.types";
import guestApiRequest from "@/apiRequests/guest";
import { format } from "date-fns";
import { BookX, CookingPot, HandCoins, Loader, Truck } from "lucide-react";
import { io } from "socket.io-client";

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

export const removeTokensFromLocalStorage = () => {
  if (isBrowser) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};

export const checkAndRefreshToken = async (param?: {
  onError?: () => void;
  onSuccess?: () => void;
  force?: boolean;
}) => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  if (!accessToken || !refreshToken) return;

  const decodeAccessToken = decodeToken(accessToken);
  const decodeRefreshToken = decodeToken(refreshToken);

  const now = new Date().getTime() / 1000 - 1;

  //- Refresh_token het han thi ko xu ly nua cho logout
  if (decodeRefreshToken.exp <= now) {
    removeTokensFromLocalStorage();
    return param?.onError && param.onError();
  }

  if (
    param?.force ||
    decodeAccessToken.exp - now <
      (decodeAccessToken.exp - decodeAccessToken.iat) / 3
  ) {
    //- goi api refresh_token
    try {
      const role = decodeRefreshToken.role;
      const res =
        role === Role.Guest
          ? await guestApiRequest.refreshToken()
          : await authApiRequest.clientNextRefreshToken();
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

export const getVietnameseDishStatus = (
  status: (typeof DishStatus)[keyof typeof DishStatus]
) => {
  switch (status) {
    case DishStatus.Available:
      return "Có sẵn";
    case DishStatus.Unavailable:
      return "Không có sẵn";
    default:
      return "Ẩn";
  }
};

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

export const getVietnameseTableStatus = (
  status: (typeof TableStatus)[keyof typeof TableStatus]
) => {
  switch (status) {
    case TableStatus.Available:
      return "Có sẵn";
    case TableStatus.Reserved:
      return "Đã đặt";
    default:
      return "Ẩn";
  }
};

export const getTableLink = ({
  token,
  tableNumber,
}: {
  token: string;
  tableNumber: number;
}) => {
  return (
    envConfig.NEXT_PUBLIC_URL + "/tables/" + tableNumber + "?token=" + token
  );
};

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload;
};

export const getVietnameseOrderStatus = (
  status: (typeof OrderStatus)[keyof typeof OrderStatus]
) => {
  switch (status) {
    case OrderStatus.Delivered:
      return "Đã phục vụ";
    case OrderStatus.Paid:
      return "Đã thanh toán";
    case OrderStatus.Pending:
      return "Chờ xử lý";
    case OrderStatus.Processing:
      return "Đang nấu";
    default:
      return "Từ chối";
  }
};

export function removeAccents(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

export const simpleMatchText = (fullText: string, matchText: string) => {
  return removeAccents(fullText.toLowerCase()).includes(
    removeAccents(matchText.trim().toLowerCase())
  );
};

export const formatDateTimeToLocaleString = (date: string | Date) => {
  return format(
    date instanceof Date ? date : new Date(date),
    "HH:mm:ss dd/MM/yyyy"
  );
};

export const formatDateTimeToTimeString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), "HH:mm:ss");
};

export const generateSocketInstace = (accessToken: string) => {
  return io(envConfig.NEXT_PUBLIC_API_ENDPOINT, {
    auth: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const OrderStatusIcon = {
  [OrderStatus.Pending]: Loader,
  [OrderStatus.Processing]: CookingPot,
  [OrderStatus.Rejected]: BookX,
  [OrderStatus.Delivered]: Truck,
  [OrderStatus.Paid]: HandCoins,
};