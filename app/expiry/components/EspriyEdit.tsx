"use client";
import { useExpiryEdit } from "../lib/useExpiryEdit";
import { ExpiryItem } from "../lib/types";
import ExpiryEditForm from "./ExpiryEditForm";

const ExpiryEdit = ({ initial }: { initial: ExpiryItem }) => {
  const { item, loading, error, isValidating } = useExpiryEdit(
    initial.id,
    initial,
  );

  if (loading)
    return (
      <p className="py-10 text-center text-sm text-gray-400">読み込み中...</p>
    );
  if (error || !item) {
    return (
      <p className="rounded bg-red-950 px-4 py-3 text-center text-sm text-red-200">
        データの取得に失敗しました
      </p>
    );
  }

  return <ExpiryEditForm productData={item!} isValidating={isValidating} />;
};

export default ExpiryEdit;
