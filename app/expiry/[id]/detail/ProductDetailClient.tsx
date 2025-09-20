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

  if (loading) return <p className="text-center">読み込み中...</p>;
  if (error || !item)
    return <p className="text-center text-red-700">取得に失敗しました</p>;

  const expired = new Date() > new Date(item.expiryDate);

  return (
    <div className="border-2 border-gray-400 w-[90%] max-w-[520px] mx-auto my-4 flex-1 overflow-y-scroll flex flex-col">
      <div className="flex flex-col justify-between w-full max-w-[400px] mx-auto py-4 px-4 flex-1 gap-2">
        <div className="border-b-2">
          <h3 className="text-lg text-gray-800 font-bold">商品名</h3>
          <p className="text-end text-sm">{item.productName}</p>
        </div>
        <div className="border-b-2 flex justify-between items-center">
          <h3 className="text-lg text-gray-800 font-bold">消費期限</h3>
          <p
            className={`text-end ${
              expired
                ? "text-red-700"
                : ""
            }`}
          >
            {new Date(item.expiryDate).toLocaleDateString("ja-JP")}
          </p>
        </div>
        <div className="border-b-2 flex justify-between items-center">
          <h3 className="text-lg text-gray-800 font-bold">個数</h3>
          <p className="text-end">{item.quantity}</p>
        </div>
        <div className="border-b-2 flex justify-between items-center">
          <h3 className="text-lg text-gray-800 font-bold">分類No</h3>
          <p className="text-end">{item.category}</p>
        </div>
        <div className="border-b-2 flex justify-between items-center">
          <h3 className="text-lg text-gray-800 font-bold">ゴンドラNo</h3>
          <p className="text-end">{item.gondolaNo}</p>
        </div>
        <div className="border-b-2 flex justify-between items-center">
          <h3 className="text-lg text-gray-800 font-bold">登録者</h3>
          <p className="text-end">{item.manager}</p>
        </div>
      </div>

      <div className="w-full flex justify-center gap-8 my-2 max-w-[400px] mx-auto">
        <Link
          href={`/expiry/${id}/edit`}
          className="w-[40%] bg-red-700 rounded-xl"
        >
          <Button className="text-lg w-[100%]">編集</Button>
        </Link>
        <ProductDeleteButton id={id} />
      </div>

      {isValidating && <p className="text-xs text-center text-gray-500">更新中...</p>}
    </div>
  );
};

export default ProductDetailClient;