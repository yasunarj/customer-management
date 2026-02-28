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
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(10, "パスワードは10文字以上で入力してください"),
});

type FormValues = z.infer<typeof schema>;

const LoginPage = () => {
  const supabase = createClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async ({ email, password }: FormValues) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/user-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (res.status === 401) {
        alert(`ログインに失敗しました (あと${data?.remaining}回)`);
        return;
      }

      if (res.status === 429) {
        const min = Math.ceil((data?.retry_after_sec ?? 600) / 60);
        alert(`ロック中です(${min}分) `);
        return;
      }

      if (!res.ok || !data.session) {
        alert("ログインに失敗しました");
        return;
      }

      await supabase.auth.setSession(data.session);

      await new Promise((r) => setTimeout(r, 50));

      router.push("/user/dashboard");
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
            {/* email フィールド */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-semibold">
                    メールアドレス
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="p-2 text-lg"
                      type="email"
                      placeholder="メールアドレスを入力"
                      autoComplete="current-email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            {/* password フィールド */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between">
                    <FormLabel className="text-xl font-semibold">
                      パスワード
                    </FormLabel>
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="border px-2 text-sm rounded"
                    >
                      {showPassword ? "非表示" : "表示　"}
                    </button>
                  </div>
                  <FormControl>
                    <Input
                      className="p-2 text-lg"
                      type={showPassword ? "text" : "password"}
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
              <Link
                href="/auth/admin/login"
                className="text-blue-600 underline"
              >
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
