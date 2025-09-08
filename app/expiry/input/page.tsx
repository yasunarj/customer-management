import SheetMenu from "@/components/sheet/SheetMenu";
import { expiryMenuList } from "../lib/expiryMenuList";
import ExpiryInputForm from "../components/ExpiryInputForm";

const ProductRegistrationPage = () => {
  return (
    <div className="h-screen-vh flex justify-center items-center bg-yellow-200 overflow-y-hidden">
      <div className="bg-white max-w-[900px] w-[90%] h-[98%] rounded-xl p-2 shadow-2xl flex flex-col">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="relative text-2xl mt-2 font-bold text-gray-800">
            商品登録フォーム
            <div className="absolute top-1 right-4">
              <SheetMenu menuList={expiryMenuList}/>
            </div>
          </h1>
          <p>入力後、送信ボタンを押してください</p>
        </div>
        <div className="flex-1 border-2 border-gray-400 overflow-y-scroll">
          <ExpiryInputForm />
        </div>
      </div>
    </div>
  );
};

export default ProductRegistrationPage;
