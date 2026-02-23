"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const OwnerLoginPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [locked, setLocked] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isDisabled = isLoading || locked;

  useEffect(() => {
    const checkStatus = async () => {
      const res = await fetch("/api/owner-gate/status");
      const data = await res.json();

      if (data.locked) {
        setLocked(true);
      }
    };
    checkStatus();
  }, []);

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

      const data = await res.json();

      if (res.status === 401) {
        alert(`パスワードが違います。(あと${data.remaining}回)`);
        return;
      }

      if (res.status === 429) {
        setLocked(true);
        const min = Math.ceil(data.retry_after_sec / 60);
        alert(`ロック中です。(あと${min}分後に再入力してください)`);
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
              disabled={isDisabled}
              className={`rounded px-4 py-2 text-white ${isDisabled ? "bg-gray-500 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-600"}`}
            >
              { locked ? "ロック中" : isLoading ? "確認中" : "ログイン"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default OwnerLoginPage;
