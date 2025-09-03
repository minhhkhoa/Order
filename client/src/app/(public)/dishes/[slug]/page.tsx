import dishApiRequest from "@/apiRequests/dish";
import { getIdFromSlugUrl, wrapServerApi } from "@/lib/utils";
import { cache } from "react";
import DishDetail from "./dish-detail";

const getDetail = cache((id: number) =>
  wrapServerApi(() => dishApiRequest.getDish(id))
);


export default async function DishPage({
  params: { slug },
}: {
  params: {
    slug: string;
  };
}) {
  const id = getIdFromSlugUrl(slug);
  const data = await getDetail(id);

  const dish = data?.payload?.data;
  return <DishDetail dish={dish} />;
}
