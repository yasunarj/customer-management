import { getExpiryProductList } from "../lib/getExpiryProductList";
import Link from "next/link";
import { expiryMenuList } from "../lib/expiryMenuList";
import SheetMenu from "@/components/sheet/SheetMenu";

const ProductListPage = async () => {
  const expiryProductList = await getExpiryProductList();

  return (
    <div className="h-screen-vh overflow-hidden bg-yellow-200 flex justify-center items-center">
      <div className="bg-white w-[98%] h-[98%] max-w-[900px] rounded-xl shadow-2xl">
        <h1 className="relative text-2xl text-gray-800 font-bold text-center mt-4">
          鮮度商品一覧
          <div className="absolute top-1 right-4">
            <SheetMenu menuList={expiryMenuList} />
          </div>
        </h1>
        <div className="h-[90%] overflow-y-scroll">
          <table className="table-auto w-[97%] mx-auto border-collapse border border-gray-300 mt-4 text-gray-700">
            <thead>
              <tr>
                <th className="w-[20%] border border-gray-300 px-2 py-2 text-sm">期限</th>
                <th className="w-[40%] border border-gray-300 px-2 py-2 text-sm">商品名</th>
                <th className="w-[20%] border border-gray-300 px-2 py-2 text-sm">ゴンドラ</th>
                <th className="w-[15%] border border-gray-300 px-2 py-2 text-sm"></th>
              </tr>
            </thead>
            <tbody>
              {expiryProductList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    データが存在しません
                  </td>
                </tr>
              ) : (
                expiryProductList.map((list) => {
                  return (
                    <tr key={list.id} className="text-center">
                      <td
                        className={`border border-gray-300 px-2 py-2 text-sm ${
                          new Date() > new Date(list.expiryDate)
                            ? "text-red-700"
                            : ""
                        }`}
                      >
                        {new Date(list.expiryDate).toLocaleDateString("ja-JP")}
                      </td>
                      <td className="border border-gray-300 truncate whitespace-nowrap max-w-[150px] px-2 py-2 text-sm">
                        {list.productName}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-sm">
                        {list.gondolaNo}
                      </td>
                      <td className="border border-gray-300 px-1 py-2 text-blue-700 text-sm">
                        <Link href={`/expiry/${list.id}/detail`}>詳細</Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
