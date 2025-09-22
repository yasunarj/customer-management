"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import type { ExpiryItem } from "../lib/types";
import { useSWRConfig } from "swr";

const LIST_KEY = "/api/expiry?limit=50";

const ProductDeleteButton = ({ id }: { id: number }) => {
  const router = useRouter();
  const { mutate, cache } = useSWRConfig();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDelete = async () => {
    if (!confirm("この商品を削除しますがよろしいですか？")) return;
    setIsDeleting(true);

    const current = cache.get(LIST_KEY)?.data as
      | { items: ExpiryItem[]; nextCursor: number | null }
      | undefined;

    const optimistic = current
      ? { ...current, items: current.items.filter((it) => it.id !== id) }
      : undefined;

    try {

      if (optimistic) {
        mutate(LIST_KEY, optimistic, false);
      }

      const res = await fetch(`/api/expiry/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("更新失敗");
      }

      mutate(`/api/expiry/${id}`, undefined, false);

      await mutate(LIST_KEY)

      router.push("/expiry/productList");
    } catch (e) {
      console.error("データの更新に失敗しました", e);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button className="text-lg w-[40%]" onClick={handleDelete}>
      {isDeleting ? (
        <Loader2 className="animate-spin h-10 w-10 strokeWidth={3}" />
      ) : (
        "完了(削除)"
      )}
    </Button>
  );
};

export default ProductDeleteButton;

