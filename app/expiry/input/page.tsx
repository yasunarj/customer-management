import SheetMenu from "@/components/sheet/SheetMenu";
import { expiryMenuList } from "../lib/expiryMenuList";
import ExpiryInputForm from "../components/ExpiryInputForm";

const ProductRegistrationPage = () => {
  return (
    <div
      className="h-screen-vh bg-black px-4 py-4
  text-white"
    >
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="mt-1 text-2xl font-bold">商品登録フォーム</h1>
            <p className="mt-2 text-sm text-gray-400">
              入力後、登録ボタンを押してください
            </p>
          </div>

          <div className="text-white">
            <SheetMenu menuList={expiryMenuList} />
          </div>
        </div>

        <section className="mt-4 rounded-xl border border-gray-700 bg-gray-900 p-4 sm:p-6">
          <ExpiryInputForm />
        </section>
      </div>
    </div>
  );
};

export default ProductRegistrationPage;
