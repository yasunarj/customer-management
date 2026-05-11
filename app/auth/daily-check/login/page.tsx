"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

const OwnerLoginPage = () => {
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
      const res = await fetch("/api/auth/user-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (res.status === 401) {
        alert(`ログインに失敗しました。(あと${data?.remaining ?? "?"}回)`);
        return;
      }

      if (res.status === 429) {
        const min = Math.ceil((data?.retry_after_sec ?? 600) / 60);
        alert(`ロック中です。(あと${min}分後に再入力してください)`);
        return;
      }

      if (!res.ok || !data?.session) {
        alert("ログインに失敗しました。");
        return;
      }

      await supabase.auth.setSession(data.session);

      await new Promise((resolve) => setTimeout(resolve, 50));

      toast({
        title: "今日も頑張りましょう",
        description: "ログインしました。",
      });

      router.push("/daily-check");
    } catch (e) {
      console.log(e);
      alert("通信エラーが発生しました。 時間をおいてもう一度入力してください");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 h-screen-vh bg-black text-white flex justify-center items-center">
      <div className="w-[90%] h-[90%] flex justify-center bg-gray-800">
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl w-[80%] h-[20%] px-4 py-6 mt-[30%]"
        >
          <h1 className="text-2xl font-bold">デイリータスク</h1>
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

              <div className="flex gap-2 w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  autoComplete="current-password"
                  className="flex-1 rounded bg-gray-700 px-3 py-2 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="rounded bg-gray-600 px-3 py-2 text-sm"
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
                {isLoading ? "ログイン中" : "ログイン"}
              </button>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-300">
            初めて利用する方は{" "}
            <Link
              href="/auth/daily-check/sighup"
              className="text-blue-400 underline hover:text-blue-300"
            >
              新規登録
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default OwnerLoginPage;
