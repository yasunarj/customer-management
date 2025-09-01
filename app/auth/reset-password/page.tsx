"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPkceClient } from "@/utils/supabase/client-pkce";
import { useRouter } from "next/navigation";
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

const schema = z
  .object({
    password: z.string().min(10, "パスワードは10文字以上にしてください"),
    confirm: z.string(),
  })
  .refine((val) => val.password === val.confirm, {
    message: "確認用のパスワードが一致しません",
    path: ["confirm"],
  });
type FormValues = z.infer<typeof schema>;

const ResetPasswordPage = () => {
  const supabase = createPkceClient();
  const router = useRouter();
  const [ready, setReady] = useState<boolean>(false);
  const [msg, setMsg] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm: "" },
    mode: "onChange",
  });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace("/auth/forgot-password"); // セッションがない=確認通ってない
        return;
      }
      setReady(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async ({ password }: FormValues) => {
    setMsg(null);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMsg("パスワードを更新しました。ログインページへ移動します");
      setTimeout(async () => {
        await supabase.auth.signOut();
        router.replace("/auth/login");
      }, 1200);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setMsg(e.message);
      } else if (typeof e === "string") {
        setMsg(e);
      } else {
        setMsg("更新に失敗しました。時間を置いて再度お試しください");
      }
    }
  };

  if (!ready) {
    return (
      <div
        className="flex-grow bg-center bg-cover flex items-center justify-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/photo-1735303937312-381ad640f71e.avif')",
        }}
      >
        <div className="w-full max-w-md bg-white rounded-md shadow-2xl p-6 text-center">
          <p className="text-lg">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-grow bg-center bg-cover flex items-center justify-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/photo-1735303937312-381ad640f71e.avif')",
      }}
    >
      <div className="w-full max-w-md bg-white rounded-md shadow-2xl p-6 text-center">
        <h1 className="text-xl font-semibold mb-4 text-center">
          新しいパスワード
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>新しいパスワード（10文字以上）</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      placeholder="新しいパスワード"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>確認用パスワード</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      placeholder="もう一度入力"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "更新中..." : "更新する"}
            </Button>
          </form>
        </Form>

        {msg && <p className="text-sm mt-4 text-center">{msg}</p>}

        <div className="mt-4 text-center">
          <Link href="/auth/login" className="text-blue-600 underline">
            ログインに戻る
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
