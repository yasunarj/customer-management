"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

const InviteUserPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/invite-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setErrorMessage(data?.error ?? "招待メールの送信に失敗しました");
        return;
      }

      setMessage("招待メールを送信しました");
      setEmail("");
    } catch (error) {
      console.error("招待メール送信エラー:", error);
      setErrorMessage("通信エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-gray-800 p-6"
      >
        <h1 className="text-2xl font-bold">ユーザーを招待</h1>

        <p className="mt-2 text-sm text-gray-300">
          従業員のメールアドレスへ招待メールを送信します。
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            メールアドレス
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="employee@example.com"
            autoComplete="email"
            required
            className="rounded bg-gray-700 px-3 py-2"
          />
        </div>

        {message && (
          <p className="mt-4 rounded bg-green-950 px-3 py-2 text-sm text-green-200">
            {message}
          </p>
        )}

        {errorMessage && (
          <p className="mt-4 rounded bg-red-950 px-3 py-2 text-sm text-red-200">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading || !email.trim()}
          className="mt-6 w-full rounded bg-blue-700 px-4 py-2 font-medium hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-500"
        >
          {isLoading ? "送信中..." : "招待メールを送信"}
        </button>
        <div className="flex justify-center mt-4">
          <Link href="/admin/dashboard" className="text-center text-blue-600 hover:text-blue-500">
            戻る
          </Link>
        </div>
      </form>
    </main>
  );
};

export default InviteUserPage;
