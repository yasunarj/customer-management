"use client";

import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import Link from "next/link";

const schema = z.object({
  password: z.string().min(10, "パスワードは10文字以上で入力してください"),
});

type FormValues = z.infer<typeof schema>;

const FIXED_USER_EMAIL = "yasunarj+user@gmail.com";

const LoginPage = () => {
  const supabase = createClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async ({ password }: FormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: FIXED_USER_EMAIL,
        password,
      });
      if (error) {
        alert("ログインに失敗しました");
        return;
      }
      alert("ログインしました");
      router.push("/user/dashboard");
    } catch (e) {
      console.error("ログイン処理エラー", e);
      alert("予期せぬエラーが発生しました");
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
            className="relative flex flex-col justify-center items-center bg-white px-6 py-16 w-full max-w-md h-auto gap-8 rounded-md shadow-2xl"
          >
            {/* password フィールド */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-semibold">
                    ログインパスワード
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="p-2 text-lg"
                      type="password"
                      placeholder="パスワードを入力"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <Button
              className="w-[42%] font-semibold"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "ログイン中" : "ログイン"}
            </Button>

            <div>
              パスワードをお忘れの方は{" "}
              <Link
                href="/auth/forgot-password"
                className="text-blue-600 underline"
              >
                こちら
              </Link>
            </div>

            <div className="absolute bottom-4 right-4">
              <Link href="/auth/adminLogin" className="text-blue-600 underline">
                管理者用
              </Link>
            </div>
          </form>
        </div>
      </Form>
    </div>
  );
};

export default LoginPage;
