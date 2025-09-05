import dishApiRequest from "@/apiRequests/dish";
import { formatCurrency, generateSlugUrl } from "@/lib/utils";
import { DishListResType } from "@/schemaValidations/dish.schema";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};
export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  //- async component -> getTranslations
  const brand = await getTranslations("Brand");
  const homePage = await getTranslations("HomePage");

  let dishList: DishListResType["data"] = [];
  try {
    const result = await dishApiRequest.list();
    const {
      payload: { data },
    } = result;
    dishList = data;
  } catch (error) {
    return <div>Something went wrong</div>;
  }
  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <span className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></span>
        <Image
          src="/banner.png"
          width={400}
          height={200}
          quality={100}
          alt="Banner"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="z-20 relative py-10 md:py-20 px-4 sm:px-10 md:px-20">
          <h1 className="text-center text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold">
            {brand("title")}
          </h1>
          <p className="text-center text-sm sm:text-base mt-4">
            {homePage("slogan")}
          </p>
        </div>
      </div>
      <section className="space-y-10 py-16">
        <h2 className="text-center text-2xl font-bold">{homePage("h2")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {dishList.map((dish) => (
            <Link
              href={`/dishes/${generateSlugUrl({
                name: dish.name,
                id: dish.id,
              })}`}
              className="flex gap-4 w"
              key={dish.id}
            >
              <div className="flex-shrink-0">
                <Image
                  src={dish.image}
                  width={150}
                  height={150}
                  quality={80}
                  loading="lazy"
                  alt={dish.name}
                  className="object-contain w-[200px] h-[150px] rounded-md"
                />
              </div>
              <div className="space-y-1 flex flex-col justify-evenly">
                <h3 className="text-xl font-semibold">{dish.name}</h3>
                <p className="line-clamp-2">{dish.description}</p>
                <p className="font-semibold text-yellow-400">
                  {formatCurrency(dish.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

/**
  Trong Next.js + next-intl, có 2 cách:
    1. Async Component → dùng getTranslations (không dùng hook).
    2. anywhere Component non-async → dùng useTranslations.
 */
