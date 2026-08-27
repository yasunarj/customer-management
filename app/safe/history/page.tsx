import { getSafeCheckHistory } from "../lib/getSafeCheckHistory";
import { safeMenuList } from "../lib/safeMenuList";
import SheetMenu from "@/components/sheet/SheetMenu";
import DetailLoadingButton from "../components/ DetailLoadingButton";

const SafeCheckHistoryPage = async () => {
  const safeCheckAllData = await getSafeCheckHistory();

  return (
    <div className="h-screen-vh overflow-hidden bg-black px-2 py-2 text-white">
      <div className="mx-auto w-[95%] h-[98%] max-w-4xl">
        <div className="mt-1 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">金庫精算の履歴一覧</h1>
          </div>
          <div className="text-white">
            <SheetMenu menuList={safeMenuList} />
          </div>
        </div>

        <section className="mt-4 h-[95%] overflow-y-scroll rounded-xl border border-gray-700 bg-gray-900">
          <table className="table-auto w-full mx-auto border-collapse text-gray-700 text-sm">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="border-b border-gray-700 px-4 py-2 font-medium">日付</th>
                <th className="border-b border-gray-700 px-4 py-2 font-medium">合計金額</th>
                <th className="border-b border-gray-700 px-4 py-2 font-medium">詳細</th>
              </tr>
            </thead>
            <tbody>
              {safeCheckAllData.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    データが存在しません
                  </td>
                </tr>
              ) : (
                safeCheckAllData.map((safeData) => {
                  return (
                    <tr key={safeData.id} className="text-center border-b border-gray-800 last:border-b-0 hover:bg-gray-800/60">
                      <td className="px-4 py-3 text-gray-300">
                        {new Date(safeData.date).toLocaleDateString("ja-JP")}
                      </td>
                      <td
                        className={`px-4 py-2 font-medium ${
                          safeData.total !== 300000
                            ? "text-red-500"
                            : "text-blue-500"
                        }`}
                      >
                        {safeData.total.toLocaleString("ja-JP")}円
                      </td>
                      <td className="border-gray-300 px-4 py-3">
                        <DetailLoadingButton id={safeData.id} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default SafeCheckHistoryPage;

