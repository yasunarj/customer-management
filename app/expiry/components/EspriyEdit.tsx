"use client";
import { useExpiryEdit } from "../lib/useExpiryEdit";
import { ExpiryItem } from "../lib/types";
import ExpiryEditForm from "./ExpiryEditForm";

const ExpiryEdit = ({ initial }: { initial: ExpiryItem }) => {
  const { item, loading, error, isValidating } = useExpiryEdit(
    initial.id,
    initial
  );

  if (loading) return <p className="text-center">読み込み中...</p>;
  if (error || !item) {
    return (
      <p className="text-center tex-red-700">データの取得に失敗しました</p>
    );
  }

  return <ExpiryEditForm productData={item!} isValidating={isValidating} />;
};

export default ExpiryEdit;
