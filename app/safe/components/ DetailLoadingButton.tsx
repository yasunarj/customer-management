"use client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DetailLoadingButton = ({ id }: { id: number }) => {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  return (
    <button
      disabled={isLoading}
      onClick={() => {
        setLoadingId(id);
        setIsLoading(true);
        router.push(`/safe/history/${id}/detail`);
      }}
      className="underline underline-offset-4 hover:text-black"
    >
      { loadingId === id ? <Loader2 className="h-5 w-5 animate-spain" /> : "詳細"}
    </button>
  );
};

export default DetailLoadingButton;
