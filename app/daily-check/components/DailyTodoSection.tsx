"use client";

import { useState, useEffect } from "react";
import TodoCreateForm from "./TodoCreateForm";

type Todo = { id: string; title: string; createdAt: string };

const DailyTodoSection = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadTodos = async () => {
      setLoading(true);
      setError("");
  
      try {
        const res = await fetch("/api/daily-todo", { cache: "no-store" });
  
        if (!res.ok) {
          throw new Error("Todoの取得に失敗しました");
        }
  
        const data = await res.json();

        if (!active) return;
  
        setTodos(data.todos ?? []);
      } catch (e) {
        if (!active) return;

        console.error("Todo取得エラー:", e);
        setError("Todoの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };
    loadTodos();

    return () => { active = false };
  }, []);

  const completeTodo = async (todoId: string) => {
    setSavingId(todoId);

    try {
      const res = await fetch(`/api/daily-todo/${todoId}/complete`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Todoの完了処理に失敗しました");
      }

      setCompletingId(todoId);

      setTimeout(() => {
        setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
        setCompletingId(null);
      }, 300);
    } catch (e) {
      console.error("Todo完了エラー:", e);
      setCompletingId(null);
      alert("Todoの完了処理に失敗しました");
    } finally {
      setSavingId(null);
    }
  };

  const handleTodoCreated = (todo: Todo) => {
    setTodos((prev) => [...prev, todo]);
    setCreatedId(todo.id);
    setShowCreateForm(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setCreatedId(null);
      })
    })
  };

  if (loading) {
    return <div className="text-sm text-gray-500">読み込み中...</div>;
  }

  if (error) {
    return (
      <div role="alert" className="text-sm text-red-500">
        {error}
      </div>
    );
  }

  return (
    <section>
      <div className="mb-4 flex justify-between items-center">
        <div className="text-lg font-semibold">Todo</div>
      </div>

      <ul className="space-y-3">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`flex items-center gap-3 rounded-xl border border-gray-200 p-3 transition-all duration-300 ease-out 
              ${
                completingId === todo.id
                  ? "translate-x-6 scale-95 opacity-0"
                  : createdId === todo.id 
                  ? "translate-y-2 scale-95 opacity-0"  
                  : "translate-x-0 scale-100 opacity-100"
              }  
            `}
          >
            <input
              type="checkbox"
              disabled={savingId !== null || completingId !== null}
              checked={savingId === todo.id || completingId === todo.id}
              onChange={() => completeTodo(todo.id)}
              className="h-5 w-5 accent-blue-600"
            />

            <div className="flex-1">
              <div className="font-medium">{todo.title}</div>
            </div>
          </li>
        ))}
      </ul>

      {showCreateForm ? (
        <div className="mt-4">
          <TodoCreateForm onCreated={handleTodoCreated} />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="mt-4 text-sm text-gray-300 hover:text-white"
        >
          + Todoを追加
        </button>
      )}
    </section>
  );
};

export default DailyTodoSection;
