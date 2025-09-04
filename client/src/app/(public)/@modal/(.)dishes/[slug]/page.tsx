import dishApiRequest from "@/apiRequests/dish";
import { getIdFromSlugUrl, wrapServerApi } from "@/lib/utils";
import Modal from "./modal";
import DishDetail from "@/app/(public)/dishes/[slug]/dish-detail";

export type typePropsParams = {
  params: Promise<{ slug: string }>;
};

export default async function DishPage({ params }: typePropsParams) {
  const { slug } = await params;

  const id = getIdFromSlugUrl(slug);
  const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)));

  const dish = data?.payload?.data;
  return (
    <Modal>
      <DishDetail dish={dish} />
    </Modal>
  );
}
