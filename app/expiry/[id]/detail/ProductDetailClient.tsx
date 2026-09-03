"use client";

import { useExpiryDetail } from "../../lib/useExpiryDetail";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductDeleteButton from "../../components/ProductDeleteButton";
import { ExpiryItem } from "../../lib/types";

const ProductDetailClient = ({
  id,
  initial,
}: {
  id: number;
  initial?: ExpiryItem;
}) => {
  const { item, loading, error, isValidating } = useExpiryDetail(id, initial);

  if (loading)
    return (
      <p className="py-10 text-center text-sm text-gray-400">読み込み中...</p>
    );
  if (error || !item)
    return (
      <p className="rounded bg-red-950 px-4 py-3 text-center text-sm text-red-200">
        取得に失敗しました
      </p>
    );

  const expired = new Date() > new Date(item.expiryDate);

  const detailItems = [
    {
      label: "商品名",
      value: item.productName,
    },
    {
      label: "消費期限",
      value: new Date(item.expiryDate).toLocaleDateString("ja-JP"),
      isExpired: expired,
    },
    {
      label: "個数",
      value: item.quantity,
    },
    {
      label: "分類No",
      value: item.category,
    },
    {
      label: "ゴンドラNo",
      value: item.gondolaNo,
    },
    {
      label: "登録者",
      value: item.manager || "未登録",
    },
  ];

  return (
    <div className="h-full w-full mx-auto max-w-4xl">
      <div className="p-4 flex flex-col justify-between h-[85%]">
        {detailItems.map((detail) =>
          detail.label === "商品名" ? (
            <div
              key={detail.label}
              className="rounded-lg border border-gray-700 px-4 pt-4  bg-gray-800"
            >
              <p className=" text-gray-400 font-medium">{detail.label}</p>
              <p
                className={`my-2 text-right font-medium ${detail.isExpired ? "text-red-400" : "text-gray-200"}`}
              >
                {detail.value}
              </p>
            </div>
          ) : (
            <div
              key={detail.label}
              className="rounded-lg flex items-center justify-between gap-4  border border-gray-700 px-4 py-6 bg-gray-800"
            >
              <span className=" text-gray-400 font-medium">{detail.label}</span>
              <span
                className={`text-right font-medium ${detail.isExpired ? "text-red-400" : "text-gray-200"}`}
              >
                {detail.value}
              </span>
            </div>
          ),
        )}
      </div>

      <div className="mt-4 flex justify-center gap-8">
        <Link href={`/expiry/${id}/edit`}>
          <Button
            type="button"
            className="w-32 bg-blue-600 hover:bg-blue-600 text-lg"
          >
            編集
          </Button>
        </Link>
        <ProductDeleteButton id={id} />
      </div>
      {isValidating && (
        <p className="mt-3 text-center text-xs text-gray-500">更新中...</p>
      )}
    </div>
  );
};

export default ProductDetailClient;
