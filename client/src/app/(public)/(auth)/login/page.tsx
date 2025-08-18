import LoginForm from "@/app/(public)/(auth)/login/login-form";
import { Suspense } from "react";

export default function Login() {
  return (
    <div className="translate-y-1/2 md:translate-y-1/4 flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
