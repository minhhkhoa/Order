import { getUserLocale } from "@/services/locale";
import { getRequestConfig } from "next-intl/server";

//- file nay tu khoi dong khi server run
export default getRequestConfig(async () => {
  //- switch language
  const locale = await getUserLocale();

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
