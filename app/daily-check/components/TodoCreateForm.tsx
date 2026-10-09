"use client";

import { FormEvent, useState } from "react";

type Todo = { id: string; title: string; createdAt: string };

type TodoCreateFormProps = {
  onCreated: (todo: Todo) => void;
}

const TodoCreateForm = ({ onCreated }: TodoCreateFormProps) => {
  const [todoTitle, setTodoTitle] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const title = todoTitle.trim();
    if (!title) {
      setError("Todoを入力してください");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/daily-todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) {
        setError("Todoの登録に失敗しました");
        return;
      }

      const data = await res.json();

      onCreated(data.todo);
      setTodoTitle("");
    } catch (e) {
      console.error("Todo登録エラー:", e);
      setError("Todoの登録に失敗しました");
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
          placeholder="新しいTodoを追加する"
          value={todoTitle}
          onChange={(e) => {
            setError(null);
            setTodoTitle(e.target.value)}
          }
          className="flex-1 rounded bg-gray-800 px-3 py-2"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-blue-600 px-4 py-2"
        >
          {saving ? "登録中..." : "追加"}
        </button>
      </div>
      {error && <div className="mt-2 text-sm text-red-400">{error}</div>}
    </form>
  );
};

export default TodoCreateForm;
