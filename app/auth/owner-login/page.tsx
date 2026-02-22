"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const OwnerLoginPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/owner-gate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        alert("パスワードが違います");
        return;
      }
      toast({
        title: "今日も頑張りましょう",
        description: "パスワードを確認しました",
      });
      router.push("/daily-check");
    } catch (e) {
      console.log(e);
      alert("通信エラーが発生しました。時間をおいてもう一度入力してください");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 min-h-0 bg-black text-white flex justify-center items-center">
      <div className="w-[90%] h-[90%] flex justify-center bg-gray-800">
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl w-[80%] h-[20%] px-4 py-6 mt-[30%]"
        >
          <h1 className="text-2xl font-bold">オーナータスク</h1>
          <p>パスワードを入力してください</p>

          <div className="flex gap-4 justify-center items-center mt-4">
            <input
              type="password"
              placeholder="password"
              onChange={(e) => setPassword(String(e.target.value))}
              className="rounded flex-1 bg-gray-700 px-3 py-2"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-600"
            >
              入る
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default OwnerLoginPage;
