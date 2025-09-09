import LoginForm from "@/app/[locale]/(public)/(auth)/login/login-form";
import { Suspense } from "react";
import { PropsParamsI18n } from "../../page";
import { setRequestLocale } from "next-intl/server";

export default async function Login({ params }: PropsParamsI18n) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="translate-y-1/2 md:translate-y-1/4 flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
