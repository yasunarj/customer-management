"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const DeleteButton = ({ id, type }: { id: number; type: string }) => {
  const router = useRouter();
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const handleDelete = async () => {
    if (confirm("データを削除してもよろしいですか？")) {
      setIsDeleted(true);
      try {
        const response = await fetch(`/api/reservation/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("データを削除しました");
          router.push(`/admin/${type}/list`);
        } else {
          alert("データが削除できませんでした");
        }
      } catch (e) {
        console.error("エラーが発生しました", e);
      } finally {
        setIsDeleted(false);
      }
    }
  };

  return (
    <Button
      variant="destructive"
      className="text-lg"
      onClick={handleDelete}
      disabled={isDeleted}
    >
      {isDeleted ? "削除中" : "削除"}
    </Button>
  );
};

export default DeleteButton;
