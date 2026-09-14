"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DailyCheckClient from "./components/ui";

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
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">本日のチェック</h1>
          {streakError ? (
            <p className="text-sm text-red-400">
              連続記録を取得できませんでした
            </p>
          ) : streak === null ? (
            <p className="text-sm text-gray-400">連続記録を読み込み中...</p>
          ) : streak > 0 ? (
            <p className="text-lg font-semibold">🔥 {streak} 日連続達成中</p>
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
