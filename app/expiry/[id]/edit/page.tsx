import SheetMenu from "@/components/sheet/SheetMenu";
import ExpiryEdit from "../../components/EspriyEdit";
import { getProductDetailData } from "../../lib/getProductDetailData";
import { expiryMenuList } from "../../lib/expiryMenuList";

const ExpiryDataEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const productId = parseInt(id, 10);
  const productData = await getProductDetailData(productId);
  if (!productData) {
    return (
      <div className="h-screen-vh flex justify-center items-center bg-yellow-200">
        <div className="bg-white max-w-[900px] w-[95%] h-[98%] rounded-xl p-2 shadow-2xl flex flex-col items-center justify-center">
          <p className="text-lg font-bold text-gray-600">
            データが存在しません
          </p>
        </div>
      </div>
    );
  }

  const initial = {
    ...productData, expiryDate: productData.expiryDate.toISOString()
  }


  return (
    <div className="h-screen-vh flex justify-center items-center bg-yellow-200 overflow-y-hidden">
      <div className="bg-white max-w-[900px] w-[95%] h-[98%] rounded-xl p-2 shadow-2xl flex flex-col">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="relative text-2xl mt-2 font-bold text-gray-800">
            修正フォーム
            <div className="absolute top-1 right-4">
              <SheetMenu menuList={expiryMenuList} />
            </div>
          </h1>
          <p>入力後、送信ボタンを押してください</p>
        </div>
        <div className="flex-1 border-2 border-gray-400 overflow-y-scroll">
          <ExpiryEdit initial={initial} />
        </div>
      </div>
    </div>
  );
};

export default ExpiryDataEditPage;
