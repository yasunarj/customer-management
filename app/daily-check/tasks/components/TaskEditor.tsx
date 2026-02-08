import { FormEvent, useMemo, useState } from "react";
import type { Task } from "./TaskList";
import { mutate } from "swr";
import { dayLabels } from "./TaskCreateForm";

type WeekState = {
  onMon: boolean;
  onTue: boolean;
  onWed: boolean;
  onThu: boolean;
  onFri: boolean;
  onSat: boolean;
  onSun: boolean;
};

const TaskEditor = ({ task, onDone }: { task: Task; onDone: () => void }) => {
  const [title, setTitle] = useState<string>(task.title);
  const [sortOrder, setSortOrder] = useState<number>(task.sortOrder);
  const [isActive, setIsActive] = useState<boolean>(task.isActive);
  const [week, setWeek] = useState<WeekState>({
    onMon: task.onMon,
    onTue: task.onTue,
    onWed: task.onWed,
    onThu: task.onThu,
    onFri: task.onFri,
    onSat: task.onSat,
    onSun: task.onSun,
  });

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  const toggleDay = (k: keyof WeekState) =>
    setWeek((p) => ({ ...p, [k]: !p[k] }));

  const setAll = (v: boolean) => {
    setWeek({
      onMon: v,
      onTue: v,
      onWed: v,
      onThu: v,
      onFri: v,
      onSat: v,
      onSun: v,
    });
  };

  const anySelected = useMemo(() => {
    return Object.values(week).some(Boolean);
  }, [week]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title) {
      setErr("タイトルを入力してください");
      return;
    }

    if (!anySelected) {
      setErr("曜日を１つ以上入力してください");
    }

    setSubmitting(true);
    setErr(null);

    try {
      const data = {
        title: title.trim(),
        sortOrder,
        isActive,
        ...week,
      };

      const res = await fetch(`/api/daily-task/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json.ok) {
        if (res.status === 409) setErr("同じ名前のタスクがあります");
        else if (res.status === 400 && json.issues?.[0].message)
          setErr(json.issues[0].message);
        else setErr("更新に失敗しました");
        return;
      }

      await mutate("/api/daily-task");
      onDone();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 rounded-lg bg-black/30 p-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm text-gray-400">タスク名</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded bg-gray-800 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">並び順</label>
          <input
            type="number"
            min={0}
            onFocus={(e) => e.currentTarget.select()}
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="mt-1 w-full rounded  bg-gray-800 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          id={`active-${task.id}`}
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        <label htmlFor={`active-${task.id}`} className="text-gray-200">
          有効
        </label>
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
                  : "bg-gray-800 text-gray-700 hover:text-gray-600"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {!anySelected && (
        <div className="mt-2 text-red-500 text-sm">
          曜日を１つ以上選択してください
        </div>
      )}

      {err && <div className="mt-2 text-sm text-red-500">{err}</div>}

      <div className="mt-2 flex justify-end gap-2">
        <button
          type="submit"
          onClick={handleSubmit}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-bold disabled:opacity-50"
        >
          {submitting ? "保存中..." : "保存"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded bg-gray-800 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
};

export default TaskEditor;
