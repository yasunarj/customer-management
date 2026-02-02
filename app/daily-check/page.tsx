import Link from "next/link";
import DailyCheckClient from "./components/ui";
export const dynamic = "force-dynamic";

const DailyCheckPage = () => {
  return (
    <main className="h-screen-vh bg-black text-white flex justify-center items-center">
      <div className="max-w-2xl w-[90%] h-[90%] px-4 py-6 bg-gray-900">
        <h1 className="text-4xl font-bold">本日のチェック</h1>
        <p className="mt-2 text-lg text-gray-200">
          チェックは自動保存されます。未完了があると23時にメール通知されます。
        </p>

        <div className="mt-6"> 
          <DailyCheckClient />
        </div>

        <div className="mt-8 text-md flex flex-col gap-4">
          <Link
            href="/daily-check/history"
            className="text-blue-500 hover:underline"
          >
            過去のチェック一覧を見る →
          </Link>
          <Link
            href="/daily-check/tasks"
            className="text-blue-500 hover:underline"
          >
            タスク管理 →
          </Link>
        </div>
      </div>
    </main>
  );
};

export default DailyCheckPage;
