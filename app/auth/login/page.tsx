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

const passwordSchema = z.object({
  password: z.string().min(10, "パスワードは10文字以上で入力してください"),
});

const LoginPage = () => {
  const supabase = createClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  const loginUser = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "unosato@gmail.com",
        password: process.env.NEXT_PUBLIC_USER_PASSWORD!,
      });
      if (error) {
        alert("ログインに失敗しました");
        return false;
      }
      await supabase.auth.setSession(data.session);
      alert("ログインしました");
      router.push("/user/dashboard");
      return true;
    } catch (e) {
      console.error("ログイン処理エラー:", e);
      alert("予期せぬエラーが発生しました");
      return false;
    }
  };

  const onSubmit = async (values: z.infer<typeof passwordSchema>) => {
    setIsLoading(true);
    try {
      if (values.password === process.env.NEXT_PUBLIC_USER_PASSWORD) {
        const success = await loginUser();
        if (!success) return;
      } else if (values.password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
        router.push("/auth/adminLogin");
      } else {
        alert("パスワードが間違っています");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // const onSubmit = async (values: z.infer<typeof passwordSchema>) => {
  //   if (values.password === process.env.NEXT_PUBLIC_USER_PASSWORD) {
  //     try {
  //       setIsLoading(true);
  //       const { data, error } = await supabase.auth.signInWithPassword({
  //         email: "unosato@gmail.com",
  //         password: process.env.NEXT_PUBLIC_USER_PASSWORD,
  //       });

  //       if (error) {
  //         alert("ログインに失敗しました");
  //         return;
  //       } else {
  //         await supabase.auth.setSession(data.session);
  //         alert("ログインしました");
  //         router.push("/user/dashboard");
  //       }
  //     } catch (e) {
  //       console.error(e);
  //       alert("予期せぬエラーが発生しました");
  //     }
  //   } else if (values.password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
  //     router.push("/auth/adminLogin");
  //   } else {
  //     alert("パスワードが間違っています");
  //   }
  // };

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
            className="flex flex-col justify-center items-center bg-white px-6 py-16 w-full max-w-md h-auto gap-8 rounded-md shadow-2xl"
          >
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
          </form>
        </div>
      </Form>
    </div>
  );
};

export default LoginPage;
