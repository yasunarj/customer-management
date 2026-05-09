"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import DailyCheckClient from "./components/ui";

const DailyCheckPage = () => {
  const router = useRouter();
  const supabase = createClient();
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/auth/daily-check/login");
        return;
      }

      setIsCheckingAuth(false);
    };
    checkAuth();
  }, [router, supabase]);

  if (isCheckingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-sm text-gray-400">認証を確認しています...</div>
      </main>
    );
  }

  return (
    <main className="flex-1 min-h-0 bg-black text-white flex justify-center items-center">
      <div className="max-w-2xl w-[95%] h-[95%] px-4 py-6 bg-gray-900 overflow-y-scroll">
        <h1 className="text-2xl font-bold">本日のチェック</h1>
        <p className="mt-2 text-sm text-gray-200">
          チェックは自動保存されます。未完了があると23時にメール通知されます。
        </p>

        <div className="mt-6">
          <DailyCheckClient />
        </div>

        <div className="mt-8 text-md flex flex-col gap-4">
          <Link
            href="/daily-check/history"
            className="text-blue-500 hover:underline"
          >
            過去のチェック一覧を見る →
          </Link>
          <Link
            href="/daily-check/tasks"
            className="text-blue-500 hover:underline"
          >
            タスク管理 →
          </Link>
        </div>
      </div>
    </main>
  );
};

export default DailyCheckPage;
