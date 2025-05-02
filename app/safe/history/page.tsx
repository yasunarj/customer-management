import Link from "next/link";
import { getSafeCheckHistory } from "../lib/getSafeCheckHistory";

const SafeCheckHistoryPage = async () => {
  const safeCheckAllData = await getSafeCheckHistory();

  return (
    <div className="h-screen-vh overflow-hidden bg-blue-200 flex justify-center items-center">
      <div className="bg-white w-[90%] h-[95%] max-w-[900px] rounded-xl">
        <h1 className="text-3xl text-gray-800 font-bold text-center mt-2">
          金庫精算の履歴一覧
        </h1>

        <table className="table-auto w-[95%] mx-auto border-collapse border border-gray-300 mt-4 text-gray-700 overflow-y-scroll">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">日付</th>
              <th className="border border-gray-300 px-4 py-2">合計金額</th>
              <th className="border border-gray-300 px-4 py-2"></th>
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
                  <tr key={safeData.id} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(safeData.date).toLocaleDateString("ja-JP")}
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-2 ${
                        safeData.total !== 300000
                          ? "text-red-600"
                          : "text-blue-600"
                      }`}
                    >
                      {safeData.total}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <Link href={`/safe/history/${safeData.id}/detail`} className="underline underline-offset-4 hover:text-black">
                        詳細
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SafeCheckHistoryPage;
