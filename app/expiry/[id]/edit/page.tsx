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
      <div className="h-screen-vh bg-black px-4 py-4 text-white">
      <div className="mx-auto h-full w-full max-w-4xl">
        <div className="rounded-xl h-full border border-gray-700 bg-gray-900 p-6">
          <div className="h-[98%] w-[98%] flex justify-center items-center">
            <p className="text-lg font-semibold text-gray-400">データが存在しません...</p>
          </div>
        </div>
      </div>
    </div>
    );
  }

  const initial = {
    ...productData,
    expiryDate: productData.expiryDate.toISOString(),
  };

  return (
    <main className="h-screen-vh bg-black px-4 py-4 text-white overflow-hidden">
      <div className="mx-auto h-full w-full max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="mt-1 text-2xl font-bold">修正フォーム</h1>
          </div>

          <div className="text-white">
            <SheetMenu menuList={expiryMenuList} />
          </div>
        </div>

        <section className="mt-2 h-[94%] rounded-xl border border-gray-700 bg-gray-900 p-4 sm:p-6">
          <ExpiryEdit initial={initial} />
        </section>
      </div>
    </main>
  );
};

export default ExpiryDataEditPage;
