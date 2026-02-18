"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const SafeCheckEditButton = ({ id }: { id: number }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  return (
    <Button
      disabled={isLoading}
      className="text-lg w-[40%]"
      onClick={() => {
        setIsLoading(true);
        router.push(`/safe/history/${id}/edit`);
      }}
    >
      {isLoading ? (
        <Loader2 className="animate-spin h-10 w-10 strokeWidth={3}" />
      ) : (
        "編集"
      )}
    </Button>
  );
};

export default SafeCheckEditButton;
