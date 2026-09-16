"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DailyCheckClient from "./components/ui";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const DailyCheckPage = () => {
  const [streak, setStreak] = useState<number | null>(null);
  const [streakError, setStreakError] = useState("");

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const res = await fetch("/api/daily-check/streak");

        if (!res.ok) {
          setStreakError("連続記録の取得に失敗しました");
          return;
        }

        const data = await res.json();
        setStreak(data.streak);
      } catch (e) {
        console.error("streak fetch error:", e);
        setStreakError("連続記録の取得に失敗しました");
      }
    };

    fetchStreak();
  }, []);

  return (
    <main className="flex-1 min-h-0 bg-black text-white flex justify-center items-center">
      <div className="max-w-2xl w-[95%] h-[95%] px-4 py-6 bg-gray-900 overflow-y-scroll">
        <div className="flex flex-col">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold">本日のチェック</h1>
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="メニューを開く"
                  className="rounded px-3 py-1 text-sm text-gray-300 hover:bg-gray-800"
                >
                  <Menu className="h-7 w-7" />
                </button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[90%] bg-gray-900 text-white sm:max-w-md"
              >
                <SheetClose asChild>
                  <div className="min-h-full cursor-pointer">
                    <SheetHeader>
                      <SheetTitle className="text-left text-xl text-white">
                        メニュー
                      </SheetTitle>
                    </SheetHeader>

                    <div className="mt-6 flex flex-col gap-3">
                      <Link
                        href="/daily-check/history"
                        className="rounded border border-gray-600 px-4 py-3 text-center text-sm text-gray-300 hover:bg-gray-800"
                      >
                        過去のチェック一覧
                      </Link>

                      <Link
                        href="/daily-check/tasks"
                        className="rounded border border-gray-600 px-4 py-3 text-center text-sm text-gray-300 hover:bg-gray-800"
                      >
                        タスク管理
                      </Link>
                    </div>
                  </div>
                </SheetClose>
              </SheetContent>
            </Sheet>
          </div>
          {streakError ? (
            <p className="text-sm text-red-400">
              連続記録を取得できませんでした
            </p>
          ) : streak === null ? (
            <p className="text-sm text-gray-400">連続記録を読み込み中...</p>
          ) : streak > 0 ? (
            <p className="text-lg">🔥 連続達成 {streak} 日</p>
          ) : (
            <p>今日から連続記録を始めましょう！</p>
          )}
        </div>
        <p className="mt-2 text-xs text-gray-400">
          チェックは自動保存され、23時に未完了通知と連続記録の判定を行います。
        </p>
        <div className="mt-6">
          <DailyCheckClient />
        </div>
      </div>
    </main>
  );
};

export default DailyCheckPage;
