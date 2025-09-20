"use client";

import { useExpiryList } from "../lib/useExpiry";
import { ExpiryItem } from "../lib/types";
import Link from "next/link";

const ProductListClient = ({ initial }: { initial: ExpiryItem[] }) => {
  const { items, loading, error, isValidating } = useExpiryList(initial);

  if (loading) {
    return <p className="text-center">読み込み中...</p>;
  }

  if (error) {
    return (
      <p className="text-center py-4 text-red-700">
        データの取得に失敗しました
      </p>
    );
  }

  return (
    <div className="h-[90%] overflow-y-scroll">
      <table className="table-auto w-[97%] mx-auto border-collapse border border-gray-300 mt-4 text-gray-700">
        <thead>
          <tr>
            <th className="w-[20%] border border-gray-300 px-2 py-2 text-sm">
              期限
            </th>
            <th className="w-[40%] border border-gray-300 px-2 py-2 text-sm">
              商品名
            </th>
            <th className="w-[20%] border border-gray-300 px-2 py-2 text-sm">
              個数
            </th>
            <th className="w-[15%] border border-gray-300 px-2 py-2 text-sm"></th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                データが存在しません
              </td>
            </tr>
          ) : (
            items.map((list) => {
              const expired = new Date() > new Date(list.expiryDate);
              return (
                <tr key={list.id} className="text-center">
                  <td
                    className={`border border-gray-300 px-2 py-2 text-sm ${
                      expired ? "text-red-700" : ""
                    }`}
                  >
                    {new Date(list.expiryDate).toLocaleDateString("ja-JP")}
                  </td>
                  <td className="border border-gray-300 truncate whitespace-nowrap max-w-[150px] px-2 py-2 text-sm">
                    {list.productName}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-sm">
                    {list.quantity}
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

      {isValidating && (
        <p className="text-center text-xs text-gray-500 mt-2">更新中...</p>
      )}
    </div>
  );
};

export default ProductListClient;
