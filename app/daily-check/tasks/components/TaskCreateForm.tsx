"use client";
import { FormEvent, useMemo, useState } from "react";
import { mutate } from "swr";

type WeekState = {
  onMon: boolean;
  onTue: boolean;
  onWed: boolean;
  onThu: boolean;
  onFri: boolean;
  onSat: boolean;
  onSun: boolean;
};

const defaultWeek: WeekState = {
  onMon: false,
  onTue: false,
  onWed: false,
  onThu: false,
  onFri: false,
  onSat: false,
  onSun: false,
};

const dayLabels: Array<[keyof WeekState, string]> = [
  ["onMon", "月"],
  ["onTue", "火"],
  ["onWed", "水"],
  ["onThu", "木"],
  ["onFri", "金"],
  ["onSat", "土"],
  ["onSun", "日"],
];

const TaskCreateForm = () => {
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [err, setError] = useState<string | null>(null);
  const [week, setWeek] = useState<WeekState>(defaultWeek);

  const anySelected = useMemo(() => {
    return Object.values(week).some(Boolean);
  }, [week]);


  const toggleDay = (k: keyof WeekState) => {
    setWeek((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  const setAll = (v: boolean) =>
    setWeek({
      onMon: v,
      onTue: v,
      onWed: v,
      onThu: v,
      onFri: v,
      onSat: v,
      onSun: v,
    });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const title = taskTitle.trim();
    if (!title) {
      setError("タスクを入力してください");
      return;
    }

    if (!anySelected) {
      setError("曜日を１つ以上選択してください");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/daily-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: taskTitle, ...week }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data.ok) {
        if (res.status === 409) {
          setError("すでに同じタスクが存在しています");
        } else if (data.issues?.[0].message) {
          setError(data.issues[0].message);
        } else {
          setError("タスクの登録に失敗しました");
        }
        return;
      }

      await mutate("/api/daily-task");
      setTaskTitle("");
      setWeek(defaultWeek);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-gray-700 p-3"
    >
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="新しいタスクを追加する"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          className="flex-1 rounded bg-gray-800 px-3 py-2"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-blue-600 px-4 py-2 font-bold disabled:opacity-50"
        >
          {saving ? "登録中..." : "追加"}
        </button>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between">
          <div className="text-white">曜日</div>
          <div className="flex gap-2 text-sm">
            <button
              type="button"
              onClick={() => setAll(true)}
              className="rounded bg-gray-800 px-2 py-1 text-gray-200 hover:bg-gray-700"
            >
              全部
            </button>
            <button
              type="button"
              onClick={() => setAll(false)}
              className="rounded bg-gray-800 px-2 py-1 text-gray-200 hover:bg-gray-700"
            >
              なし
            </button>
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {dayLabels.map(([key, label]) => {
          const on = week[key];
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggleDay(key)}
              className={`rounded px-3 py-1 text-sm ${
                on
                  ? "bg-white text-black"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-700 hover:text-gray-600"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {!anySelected && (
        <div className="mt-2 text-red-500 test-sm">
          曜日を１つ以上選択してください
        </div>
      )}

      {err && <div className="mt-2 text-sm text-red-400">{err}</div>}
    </form>
  );
};

export default TaskCreateForm;
