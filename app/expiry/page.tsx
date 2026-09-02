import Link from "next/link";

const ExpiryPage = () => {
  return (
    <main className="h-screen-vh bg-black px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-4xl">
        <div>
          <p className="text-sm text-gray-400">鮮度管理</p>

          <div className="mt-1 flex items-center gap-2">
            <h1 className="text-2xl font-bold">鮮度商品管理</h1>
            <span className="text-sm text-gray-400">(長期)</span>
          </div>

          <p className="mt-2 text-sm text-gray-400">
            長期鮮度商品の登録や確認を行います。
          </p>
        </div>

        <section className="mt-8 rounded-xl border border-gray-700 bg-gray-900 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/expiry/input" className="rounded-lg border border-gray-700 bg-gray-800 px-5 py-6 transition hover:border-blue-500 hover:bg-gray-700">
              <h2 className="text-lg font-semibold">商品の登録</h2>
              <p className="mt-2 text-sm text-gray-400">
                鮮度管理する商品を新しく登録します。
              </p>
            </Link>

            <Link
              href="/expiry/productList"
              className="rounded-lg border border-gray-700 bg-gray-800 px-5 py-6 transition hover:border-blue-500 hover:bg-gray-700"
            >
              <h2 className="text-lg font-semibold">登録商品の一覧</h2>
              <p className="mt-2 text-sm text-gray-400">
                登録済みの商品や鮮度情報を確認します
              </p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ExpiryPage;
