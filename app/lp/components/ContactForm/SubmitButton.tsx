"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="sm:text-lg w-[100px] md:w-[160px]"
    >
      {pending ? (
        <Loader2 className="animate-spin h-10 w-10" strokeWidth={3} />
      ) : (
        "送信"
      )}
    </Button>
  );
};

export default SubmitButton;
