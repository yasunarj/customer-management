import Link from "next/link";

const SafekeepingCalculationPage = () => {
  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-4xl">
        <div>
          <p className="text-sm text-gray-400">金庫管理</p>

          <h1 className="mt-1 text-2xl font-bold">
            金庫管理メニュー
          </h1>
        </div>

        <section className="mt-8 rounded-xl border border-gray-700 bg-gray-900 p-6">
          <p className="text-sm text-gray-400">
            金庫内の金額入力や履歴確認を行います。
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Link
              href="/safe/input"
              className="rounded-lg border border-gray-700 bg-gray-800 px-5 py-6 transition hover:border-blue-500 hover:bg-gray-700"
            >
              <h2 className="text-lg font-semibold">
                金庫内金額の入力
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                現在の金庫内金額を登録します。
              </p>
            </Link>

            <Link
              href="/safe/history"
              className="rounded-lg border border-gray-700 bg-gray-800 px-5 py-6 transition hover:border-blue-500 hover:bg-gray-700"
            >
              <h2 className="text-lg font-semibold">
                金庫内金額の表示
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                過去に登録した金額を確認します。
              </p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SafekeepingCalculationPage;