"use client";

import { useExpiryList } from "../lib/useExpiry";
import { ExpiryItem } from "../lib/types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const ProductListClient = ({ initial }: { initial: ExpiryItem[] }) => {
  const { items, loading, error, isValidating } = useExpiryList(initial);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setLoadingId(null);
  }, [pathname]);

  if (loading) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-gray-400">読み込み中...</p>;
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="rounded bg-red-950 px-4 py-3 text-center text-sm text-red-200">
          データの取得に失敗しました
        </p>
      </div>
    );
  }

  return (
    <div className="h-[98%] overflow-y-scroll">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-800 text-gray-300">
          <tr>
            <th className="w-[20%] border-b border-gray-700 px-2 py-2 text-sm">
              期限
            </th>
            <th className="w-[40%] border-b border-gray-700 px-2 py-2 text-sm">
              商品名
            </th>
            <th className="w-[20%] border-b border-gray-700 px-2 py-2 text-sm">
              個数
            </th>
            <th className="w-[15%] border-b border-gray-700 px-2 py-2 text-sm"></th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center px-4 py-10 text-gray-500">
                データが存在しません
              </td>
            </tr>
          ) : (
            items.map((list) => {
              const expired = new Date() > new Date(list.expiryDate);
              const rowLoading = loadingId === list.id;

              return (
                <tr key={list.id} className="border-gray-800 last:border-b-0 hover:bg-gray-800/60">
                  <td
                    className={`border-b border-gray-800 px-2 py-2 text-sm ${
                      expired ? "text-red-500" : "text-gray-300"
                    }`}
                  >
                    {new Date(list.expiryDate).toLocaleDateString("ja-JP")}
                  </td>
                  <td className="border-b border-gray-800 truncate whitespace-nowrap max-w-[160px] px-2 py-2 text-sm text-gray-200">
                    {list.productName}
                  </td>
                  <td className="border-b border-gray-800 px-2 py-2 text-sm text-center text-gray-300">
                    {list.quantity}
                  </td>
                  <td className="border-b border-gray-800 py-2">
                    {/* <Link href={`/expiry/${list.id}/detail`}>詳細</Link> */}
                    <button
                      disabled={loadingId !== null}
                      onClick={() => {
                        setLoadingId(list.id);
                        router.push(`/expiry/${list.id}/detail`);
                      }}
                      className="inline-flex items-center justify-center text-sm text-blue-500 hover:underline disabled:cursor-not-allowed disabled:text-gray-600"
                    >
                      {rowLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        "詳細"
                      )}
                    </button>
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
