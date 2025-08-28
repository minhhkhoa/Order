"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldErrors, useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "@/queries/useAuth";
import { toast } from "sonner";
import { generateSocketInstace, handleErrorApi } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAppStore } from "@/components/app-provider";
import { envConfig } from "@/config";
import Link from "next/link";

const getOauthGoogleUrl = () => {
  const {
    NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI,
  } = envConfig;
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI,
    client_id: NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };
  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
};

const googleOAuthUrl = getOauthGoogleUrl();

export default function LoginForm() {
  const route = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLoginMutation();
  const setSocket = useAppStore((state) => state.setSocket);
  const setRole = useAppStore((state) => state.setRole);

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const clearTokens = searchParams.get("clearTokens");

  const onSubmit = async (data: LoginBodyType) => {
    if (loginMutation.isPending) return;
    try {
      const result = await loginMutation.mutateAsync(data);
      const { name } = result.payload.data.account;
      toast("Đăng nhập thành công 🎉", {
        description: `Xin chào, ${name}!`,
        action: {
          label: "Xem hồ sơ",
          onClick: () => console.log("Đi tới profile"),
        },
      });
      setRole(result.payload.data.account.role);
      route.push("/manage/dashboard");
      setSocket(generateSocketInstace(result.payload.data.accessToken));
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  const handleErrorForm = (errors: FieldErrors<LoginBodyType>) => {
    console.warn("errors submit form: ", errors);
  };

  useEffect(() => {
    if (clearTokens) {
      setRole(undefined);
    }
  }, [clearTokens, setRole]);

  return (
    <div className="relative">
      {loginMutation.isPending && (
        <div className="absolute top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-black/50">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </div>
      )}
      <Card className="mx-auto w-[470px]">
        <CardHeader>
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>
            Nhập email và mật khẩu của bạn để đăng nhập vào hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-3 max-w-[500px] flex-shrink-0 w-full"
              noValidate
              onSubmit={form.handleSubmit(onSubmit, handleErrorForm)}
            >
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="m@example.com"
                          required
                          {...field}
                        />
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-2">
                        <div className="flex items-center">
                          <Label htmlFor="password">Password</Label>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          required
                          {...field}
                        />
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Đăng nhập
                </Button>

                <Link href={googleOAuthUrl}>
                  <Button variant="outline" className="w-full" type="button">
                    Đăng nhập bằng Google
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
