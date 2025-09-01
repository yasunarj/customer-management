"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { createClient } from "@/utils/supabase/client";
import { createImplicitClient } from "@/utils/supabase/client-implicit";
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
import Link from "next/link";

const schema = z.object({
  email: z.string().email("正しいメールアドレスを入力してください"),
});
type FormValues = z.infer<typeof schema>;

const ForgotPasswordPage = () => {
  const supabase = createImplicitClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onSubmit = async ({ email }: FormValues) => {
    setIsLoading(true);
    setMsg(null);
    try {
      const redirectTo = `${window.location.origin}/auth/confirm`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (error) throw error;
      setMsg(
        "パスワード再設定用のメールを送信しました。メールをご確認ください。"
      );
    } catch (e: unknown) {
      if (e instanceof Error) {
        setMsg(e.message);
      } else if (typeof e === "string") {
        setMsg(e);
      } else {
        setMsg("通信に失敗しました。時間を置いて再度お試しください");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className="flex-grow bg-center bg-cover flex items-center justify-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/photo-1735303937312-381ad640f71e.avif')",
      }}
    >
      <div className="w-full max-w-md bg-white rounded-md shadow-2xl p-6">
        <h1 className="text-xl font-semibold mb-2 text-center">
          パスワードをお忘れですか？
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          登録メールアドレスをご入力後に再設定リンクを送付します
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                      placeholder="you@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "送信中" : "再設定メールを送る"}
            </Button>
            <div className="mt-4 text-center">
              <Link href="/auth/login" className="text-blue-600 underline">
                ログインに戻る
              </Link>
            </div>
          </form>
        </Form>
        {msg && <p className="text-sm mt-4">{msg}</p>}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
