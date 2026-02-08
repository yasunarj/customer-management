"use client";

import { useState, useEffect, useMemo } from "react";

type Task = { id: string; title: string; checked: boolean };

const DailyCheckClient = () => {
  const [date, setDate] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const doneCount = useMemo(() => {
    return tasks.filter((t) => t.checked).length;
  }, [tasks]);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/daily-check/today", { cache: "no-store" });
    const data = await res.json();
    setDate(data.date);
    setTasks(data.tasks ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (taskId: string, next: boolean) => {
    setSavingId(taskId);

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, checked: next } : t)),
    );

    const res = await fetch("/api/daily-check/toggle", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ taskId, checked: next }),
    });

    if (!res.ok) {
      await load();
      alert("保存に失敗しました。再読み込みしました。");
    }

    setSavingId(null);
  };

  if (loading) {
    return <div className="test-sm text-gray-500">読み込み中,,,</div>;
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
              disabled={savingId === t.id}
              onChange={(e) => toggle(t.id, e.target.checked)}
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
