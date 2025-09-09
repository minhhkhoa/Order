"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";

export default function NotiLogin() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const didMount = useRef(false);
  useEffect(() => {
    const loginSuccess = searchParams.get("loginSuccess");
    const name = searchParams.get("name");

    if (!didMount.current && loginSuccess === "1" && name) {
      toast("Đăng nhập thành công 🎉", {
        description: `Xin chào, ${name}!`,
        action: {
          label: "Xem hồ sơ",
          onClick: () => router.push("/manage/setting"),
        },
      });

      didMount.current = true;

      //- Xóa query khỏi URL để không toast lại khi refresh
      router.replace("/");
    }
  }, [searchParams, router]);
  return null;
}
