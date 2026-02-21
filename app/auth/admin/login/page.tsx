"use client";

import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import Link from "next/link";

const adminLoginSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(10, "パスワードは10文字以上で入力してください"),
});

const AdminLoginPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const supabase = createClient();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof adminLoginSchema>) => {
    try {
      setIsLoading(true);
      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

      if (process.env.NODE_ENV === "development") {
        console.log("/auth/adminLogin/page.tsx", loginData); //デバック用
      }
      if (loginError) {
        console.error("ログインエラー", loginError.message);
        alert(`ログインに失敗しました: ${loginError.message}`);
        return;
      }
      alert("管理者としてログインしました");
      const next = new URLSearchParams(window.location.search).get("next");
      const safeNext = next && next.startsWith("/") ? next : null;
      router.push(safeNext ?? "/admin/dashboard");
    } catch (e) {
      console.error("予期せぬエラー", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex-grow bg-center bg-cover"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/photo-1735303937312-381ad640f71e.avif')",
      }}
    >
      <Form {...form}>
        <div className="h-full flex justify-center items-center p-4">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative flex flex-col items-center bg-white px-6 py-8 w-full max-w-md h-auto gap-8 rounded-md shadow-2xl"
          >
            <h2 className="text-xl font-semibold">管理者用ログインフォーム</h2>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      メールアドレス
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="p-2 text-lg"
                        type="email"
                        placeholder="メールアドレスを入力"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      パスワード
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="p-2 text-lg"
                        type="password"
                        placeholder="パスワードを入力してください"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button className="w-[42%]" disabled={isLoading}>
              {isLoading ? "ログイン中" : "ログイン"}
            </Button>
            <div className="mb-8">
              パスワードをお忘れの場合は{" "}
              <Link
                href="/auth/forgot-password"
                className="text-blue-600 underline"
              >
                こちら
              </Link>
            </div>
            <div className="absolute bottom-4 right-4">
              <Link href="/auth/login" className="text-blue-600 underline">
                ユーザー用
              </Link>
            </div>
          </form>
        </div>
      </Form>
    </div>
  );
};

export default AdminLoginPage;
