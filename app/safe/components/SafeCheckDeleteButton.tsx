"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const SafeCheckDeleteButton = ({ id }: { id: number }) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const router = useRouter();
  const handleDelete = async () => {
    if(!confirm("本当に削除してよろしいですか？")) {
      return;
    }
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/safe/${id}`, {
        method: "DELETE",
      });

      if(!res.ok) {
        throw new Error("削除失敗");
      }

      router.push("/safe/history");
    } catch (e) {
      console.error("データの削除に失敗しました", e);
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <Button className="text-lg w-[40%]" onClick={handleDelete}>
      {isDeleting ? (
        <Loader2 className="animate-spin h-10 w-10 strokeWidth={3}" />
      ) : (
        "削除"
      )}
    </Button>
  );
};

export default SafeCheckDeleteButton;
