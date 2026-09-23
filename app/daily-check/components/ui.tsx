"use client";

import { useState, useEffect, useMemo } from "react";

type Task = { id: string; title: string; checked: boolean };

const DailyCheckClient = () => {
  const [date, setDate] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const doneCount = useMemo(() => {
    return tasks.filter((t) => t.checked).length;
  }, [tasks]);

  const load = async (): Promise<boolean> => {
    setLoading(true);
    setLoadError("");

    try {
      const res = await fetch("/api/daily-check/today", { cache: "no-store" });

      if (!res.ok) {
        throw new Error("タスクの取得に失敗しました");
      }

      const data = await res.json();

      setDate(data.date);
      setTasks(data.tasks ?? []);

      return true;
    } catch (e) {
      console.error("タスク取得エラー：", e);
      setLoadError("タスクの取得に失敗しました");

      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (taskId: string) => {
    const current = tasks.find((t) => t.id === taskId);
    if (!current) return;

    const next = !current.checked;

    setSavingId(taskId);

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, checked: next } : t)),
    );

    try {
      const res = await fetch("/api/daily-check/toggle", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ taskId }),
      });

      if (!res.ok) {
        throw new Error("タスクのチェックに失敗しました。");
      }

      const data = await res.json();

      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, checked: data.checked } : t,
        ),
      );
    } catch (e) {
      console.error("チェック保存エラー:", e);

      // 楽観的更新で変更したチェックを元に戻す
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, checked: current.checked } : t,
        ),
      );

      // DBに保存されている状態を再取得する
      const reloaded = await load();

      if (reloaded) {
        alert("保存結果を再取得しました。時間をおいて再読み込みしてください。");
      } else {
        alert("保存結果を確認できませんでした。通信状態を確認して、再読み込みしてください")
      }
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">読み込み中...</div>;
  }

  if (loadError) {
    return (
      <div role="alert" className="text-sm text-red-500">
        {loadError}
      </div>
    );
  }

  return (
    <section>
      <div className="mb-4 flex justify-between items-center">
        <div className="text-lg font-semibold">{date}</div>
        <div className="text-md text-gray-200">
          達成 {doneCount} / {tasks.length}
        </div>
      </div>

      <ul className="space-y-3">
        {tasks.map((t) => (
          <li
            key={t.id}
            className="flex items-center gap-3 rounded-xl border border-gray-200 p-3"
          >
            <input
              type="checkbox"
              checked={t.checked}
              disabled={savingId !== null}
              onChange={() => toggle(t.id)}
              className="h-5 w-5 accent-blue-600"
            />

            <div className="flex-1">
              <div className="font-medium">{t.title}</div>
              {savingId === t.id && (
                <div className="text-xs text-gray-400">保存中...</div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default DailyCheckClient;
