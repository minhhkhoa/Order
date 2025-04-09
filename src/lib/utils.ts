import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//- loại bỏ ký tự "/" ở đầu chuỗi nếu nó tồn tại
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

