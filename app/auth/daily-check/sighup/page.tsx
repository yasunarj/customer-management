"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DailyCheckSignupPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const isDisabled = isLoading || !email || !password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert(`登録に失敗しました: ${error.message}`);
        return;
      }

      toast({
        title: "登録が完了しました",
        description: data.session
          ? "そのままログイン状態になりました"
          : "確認メールを送信しました。メールを確認してください",
      });

      if (data.session) {
        router.push("/daily-check");
        return;
      }
      router.push("/auth/daily-check/login");
    } catch (e: unknown) {
      console.error(e);
      alert("通信エラーが発生しました。時間をおいてもう一度お試しください");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex h-screen-vh items-center justify-center bg-black text-white">
      <div className="flex h-[90%] w-[90%] justify-center bg-gray-800">
        <form
          onSubmit={handleSubmit}
          className="mt-[30%] w-[80%] max-w-2xl px-4 py-6"
        >
          <h1 className="text-2xl font-bold">デイリータスク 新規登録</h1>
          <p className="mt-1 text-sm text-gray-300">
            メールアドレスとパスワードを入力してください
          </p>

          <div className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                メールアドレス
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                autoComplete="email"
                className="rounded bg-gray-700 px-3 py-2 text-white"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                パスワード
              </label>

              <div className="flex w-full gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  autoComplete="new-password"
                  className="flex-1 rounded bg-gray-700 px-3 py-2 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="bg-gray-600 rounded px-3 py-2 text-sm"
                >
                  {showPassword ? "非表示" : "表示　"}
                </button>
              </div>
            </div>

            <div className="w-full">
              <button
                type="submit"
                disabled={isDisabled}
                className={`w-full rounded px-4 py-2 text-sm text-white ${isDisabled ? "cursor-not-allowed bg-gray-500" : "bg-blue-700 hover:bg-blue-600"}`}
              >
                {isLoading ? "登録中" : "新規登録"}
              </button>
            </div>

            <div className="text-sm text-gray-300">
              すでにアカウントをお持ちの方は{" "}
              <Link
                href="/auth/daily-check/login"
                className="text-blue-400 underline hover:text-blue-300"
              >
                ログイン
              </Link>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default DailyCheckSignupPage;
