import Link from "next/link";

const TrainingPage = () => {
  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold">教育管理</h1>

        <p className="mt-2 text-sm text-gray-400">
          従業員の教育進捗と仕事項目を管理します。
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/training/employees"
            className="rounded-xl border border-gray-700 bg-gray-900 p-5 hover:bg-gray-800"
          >
            <h2 className="font-semibold">従業員の教育進捗</h2>
            <p className="mt-2 text-sm text-gray-400">
              従業員の登録と習得状況を確認します。
            </p>
          </Link>

          <Link
            href="/training/work-items"
            className="rounded-xl border border-gray-700 bg-gray-900 p-5 hover:bg-gray-800"
          >
            <h2 className="font-semibold">仕事項目の管理</h2>
            <p className="mt-2 text-sm text-gray-400">
              レジ・清掃・商品管理などの項目を登録します。
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default TrainingPage;
