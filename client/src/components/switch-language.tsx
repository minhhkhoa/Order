"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { locales, Locale } from "@/config";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

export default function SwitchLanguage() {
  const t = useTranslations("SwitchLanguage");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Select
      value={locale}
      onValueChange={(value) => {
        router.replace(pathname, {
          locale: value as Locale,
        });
        router.refresh();
      }}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder={t("title")} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {locales.map((loc) => (
            <SelectItem value={loc} key={loc}>
              {t(loc)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
