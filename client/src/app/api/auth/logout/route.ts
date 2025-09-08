import authApiRequest from "@/apiRequests/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("accessToken")?.value;
  const refreshToken = cookiesStore.get("refreshToken")?.value;

  //- muon luon thanh cong
  cookiesStore.delete("accessToken");
  cookiesStore.delete("refreshToken");

  //- Việc .delete() không làm biến đó mất giá trị của biến được gán, nó chỉ xóa khỏi cookiesStore thôi.

  //- th1: không có cookie
  if (!accessToken || !refreshToken)
    return Response.json(
      {
        message:
          "Đã có lỗi xảy ra, không nhận được accessToken và refreshToken",
      },
      { status: 200 }
    );

    //- th2: có cookie
  try {
    //- gọi lên BE
    const result = await authApiRequest.severNextLogout({
      accessToken,
      refreshToken,
    });

    //- tra ve clientNext dung nhu nhung gi BE tra ve
    return Response.json(result.payload);
  } catch (error) {
    return Response.json(
      { message: "Lỗi khi gọi api đến server backend" },
      { status: 200 }
    );
  }
}
