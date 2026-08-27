import SheetMenu from "@/components/sheet/SheetMenu";
import InputForm from "../components/InputForm";
import { safeMenuList } from "../lib/safeMenuList";

const SafekeepingCalculationInputPage = () => {
  return (
    <main className="h-screen-vh bg-black px-4 py-4 text-white overflow-y-scroll">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-gray-400">金庫管理</p>

            <h1 className="mt-1 text-2xl font-bold">金額入力フォーム</h1>

            <p className="mt-2 text-sm text-gray-400">
              入力後、送信ボタンを押してください。
            </p>
          </div>

          <div className="text-white">
            <SheetMenu menuList={safeMenuList} />
          </div>
        </div>

        <section className="mt-1 rounded-xl border border-gray-700 bg-gray-900 p-3 sm:p-6">
          <InputForm />
        </section>
      </div>
    </main>
  );
};

export default SafekeepingCalculationInputPage;
