"use client";
import { FormEvent, useState } from "react";
import { mutate } from "swr";

const TaskCreateForm = () => {
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [err, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (taskTitle.trim() === "" || !taskTitle.trim()) return;

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/daily-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: taskTitle }),
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

      {err && <div className="mt-2 text-sm text-red-400">{err}</div>}
    </form>
  );
};

export default TaskCreateForm;
