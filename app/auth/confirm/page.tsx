"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// import { createClient } from "@/utils/supabase/client";
import { createPkceClient } from "@/utils/supabase/client-pkce";
import Link from "next/link";

const AuthConfirmPage = () => {
  const router = useRouter();
  const search = useSearchParams();
  const supabase = createPkceClient();

  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [message, setMessage] = useState<string>("確認中です…");

  useEffect(() => {
    const run = async () => {
      try {
        // 1) 新方式: https://site/auth/confirm?code=xxxx
        const code = search.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          router.replace("/auth/reset-password");
          return;
        }

        // 2) 旧方式（ハッシュに access_token が入る）
        if (typeof window !== "undefined" && window.location.hash) {
          const hash = new URLSearchParams(window.location.hash.slice(1));
          const type = hash.get("type");
          const access_token = hash.get("access_token");
          const refresh_token = hash.get("refresh_token");
          if (type === "recovery" && access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            if (error) throw error;
            router.replace("/auth/reset-password");
            return;
          }
        }

        // 3) フォールバック: すでにセッションがあるか？
        const { data, error } = await supabase.auth.getUser();
        if (!error && data.user) {
          router.replace("/auth/reset-password");
          return;
        }

        // どれにも該当しなければ失敗扱い
        setStatus("error");
        setMessage("無効または期限切れのリンクです。もう一度お試しください。");
      } catch (e: unknown) {
        if (e instanceof Error) {
          setMessage(e.message);
        } else if (typeof e === "string") {
          setMessage(e);
        } else {
          setMessage(
            "セッションの確立に失敗しました。時間を置いて再度お試しください"
          );
        }
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      className="flex-grow bg-center bg-cover flex items-center justify-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/photo-1735303937312-381ad640f71e.avif')",
      }}
    >
      <div className="w-full max-w-md bg-white rounded-md shadow-2xl p-6 text-center">
        <h1 className="text-xl font-semibold mb-2">パスワード再設定</h1>
        <p className={status === "error" ? "text-red-600" : "text-gray-700"}>
          {message}
        </p>
        {status === "error" && (
          <Link
            href="/auth/forgot-password"
            className="inline-block mt-4 text-blue-600 underline"
          >
            再設定メールをもう一度送る
          </Link>
        )}
      </div>
    </div>
  );
};

export default AuthConfirmPage;
