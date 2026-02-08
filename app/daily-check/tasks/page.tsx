import Link from "next/link";
import TaskList from "./components/TaskList";
import TaskCreateForm from "./components/TaskCreateForm";

const DailyTaskManegePage = () => {
  return (
    <main className="flex-1 bg-black text-white flex justify-center items-center overflow-hidden">
      <div className="relative max-w-2xl h-[95%] w-[90%] px-4 py-6 bg-gray-900 overflow-y-auto">
        <div>
          <h1 className="text-2xl font-bold">タスク管理</h1>
          <div className="absolute top-8 right-4">
            <Link href="/daily-check" className="text-blue-500 hover:underline">
              {`<< 戻る`}
            </Link>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-200">
          新しいタスクの作成・編集・削除
        </p>

        <div className="mt-6">
          <TaskCreateForm />
        </div>

        <div className="mt-6">
          <TaskList />
        </div>
      </div>
    </main>
  );
};

export default DailyTaskManegePage;
