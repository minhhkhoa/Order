import { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get("tag");
  revalidateTag(tag!); //- xoá cache theo tag
  return Response.json({ revalidated: true, now: Date.now() });
}

/*
Quy trình hoạt động ISR với tag ở đây
  + User vào trang → Next.js fetch "dishes" → cache theo tag "dishes".
  + Khi edit/add dish thành công.
  + Gọi await revalidateApiRequest("dishes").
  + API /api/revalidate chạy → revalidateTag("dishes") nó sẽ xoá cache theo tag "dishes".
  + Cache "dishes" bị clear.
  + Lần user vào lại trang → Next.js fetch API thật để có dữ liệu mới nhất, đồng thời lại cache lại theo + tag "dishes".

Hiểu đơn giản:
  + { next: { tags: [...] } } = gắn cache theo tag.
  + revalidateTag("...") = xóa cache để lần sau fetch lại dữ liệu mới.
*/
