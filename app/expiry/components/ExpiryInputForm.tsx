"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { expirySchema } from "../lib/expirySchema";
import { ToastAction } from "@radix-ui/react-toast";

const ExpiryInputForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const isBusy = isSubmitting || isNavigating;

  const [form, setForm] = useState({
    gondolaNo: "",
    category: "",
    productName: "",
    expiryDate: "",
    quantity: "",
    manager: "",
  });

  const isComposingRef = useRef(false);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key !== "Enter") return;

    const native = e.nativeEvent;

    if (
      isComposingRef.current ||
      native.isComposing ||
      native.key === "Process"
    ) {
      return;
    }

    e.preventDefault();
    const next = inputRefs.current[index + 1];
    if (next) next.focus();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof typeof form,
  ) => {
    if (
      (key === "gondolaNo" || key === "quantity") &&
      e.target.value.length > 1 &&
      e.target.value.startsWith("0")
    ) {
      e.target.value = e.target.value.replace(/^0+/, "");
    }
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const resetForm = () => {
    setForm({
      gondolaNo: "",
      category: "",
      productName: "",
      expiryDate: "",
      quantity: "",
      manager: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const parsed = expirySchema.safeParse({
      gondolaNo: Number(form.gondolaNo || 0),
      category: form.category,
      productName: form.productName,
      expiryDate: form.expiryDate,
      quantity: Number(form.quantity || 1),
      manager: form.manager || undefined,
    });

    if (!parsed.success) {
      const msg =
        parsed.error.issues?.[0]?.message ?? "入力内容を確認してください";
      setErrorMessage(msg);
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/expiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });
      if (res.ok) {
        resetForm();

        toast({
          title: "登録しました",
          description: "鮮度商品を登録しました",
          action: (
            <ToastAction
              altText="一覧へ"
              onClick={() => router.push("/expiry/productList")}
            >
              一覧へ
            </ToastAction>
          ),
        });
      } else {
        toast({
          variant: "destructive",
          title: "登録失敗",
          description: "再度お試しください",
        });
      }
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "サーバーエラー",
        description: "時間をおいて再度お試しください",
      });
      setErrorMessage("サーバーエラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClassName =
    "border-gray-600 bg-gray-900 text-right text-white placeholder:text-gray-600";

  const fieldWrapperClassName =
    "rounded-lg border border-gray-700 bg-gray-800 p-3";

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDownCapture={(e) => {
        const target = e.target as HTMLElement;
        const isSubmitButton = target.getAttribute("type") === "submit";
        const native = e.nativeEvent;

        if (
          e.key === "Enter" &&
          !isSubmitButton &&
          (native?.isComposing || native?.keyCode === 229)
        ) {
          e.stopPropagation();
        }
      }}
      className="mx-auto w-full max-w-xl"
    >
      <div className="space-y-4">
        <div className={fieldWrapperClassName}>
          <div className="flex items-center gap-4">
            <Label
              htmlFor="manager"
              className="w-[35%] font-medium text-gray-200 sm:text-base"
            >
              担当者
            </Label>
            <Input
              id="manager"
              type="text"
              value={form.manager}
              onChange={(e) => handleChange(e, "manager")}
              className={fieldClassName}
              ref={(el) => {
                inputRefs.current[0] = el;
              }}
              onKeyDown={(e) => handleKeyDown(e, 0)}
              onCompositionStart={() => (isComposingRef.current = true)}
              onCompositionEnd={() => (isComposingRef.current = false)}
            />
          </div>
        </div>

        <div className={fieldWrapperClassName}>
          <div className="flex items-center gap-4">
            <Label
              htmlFor="gondolaNo"
              className="w-[35%] text-sm font-medium text-gray-200 sm:text-base"
            >
              ゴンドラ
            </Label>
            <Input
              id="gondolaNo"
              type="number"
              value={form.gondolaNo}
              onChange={(e) => handleChange(e, "gondolaNo")}
              className={fieldClassName}
              ref={(el) => {
                inputRefs.current[1] = el;
              }}
              onKeyDown={(e) => handleKeyDown(e, 1)}
            />
          </div>
        </div>

        <div className={fieldWrapperClassName}>
          <div className="flex items-center gap-4">
            <Label
              htmlFor="category"
              className="w-[35%] text-sm font-medium text-gray-200 sm:text-base"
            >
              分類
            </Label>
            <Input
              id="category"
              type="text"
              value={form.category}
              onChange={(e) => handleChange(e, "category")}
              className={fieldClassName}
              ref={(el) => {
                inputRefs.current[2] = el;
              }}
              onKeyDown={(e) => handleKeyDown(e, 2)}
              onCompositionStart={() => (isComposingRef.current = true)}
              onCompositionEnd={() => (isComposingRef.current = false)}
            />
          </div>
        </div>

        <div className={fieldWrapperClassName}>
          <div className="flex items-center gap-4">
            <Label
              htmlFor="productName"
              className="w-[35%] text-sm font-medium text-gray-200 sm:text-base"
            >
              商品名
            </Label>
            <Input
              id="productName"
              type="text"
              value={form.productName}
              onChange={(e) => handleChange(e, "productName")}
              className={`${fieldClassName} text-sm`}
              ref={(el) => {
                inputRefs.current[3] = el;
              }}
              onKeyDown={(e) => handleKeyDown(e, 3)}
              onCompositionStart={() => (isComposingRef.current = true)}
              onCompositionEnd={() => (isComposingRef.current = false)}
            />
          </div>
        </div>

        <div className={fieldWrapperClassName}>
          <div className="flex items-center gap-4">
            <Label
              htmlFor="quantity"
              className="w-[35%] font-medium text-gray-200 sm:text-base"
            >
              個数
            </Label>
            <Input
              id="quantity"
              type="number"
              value={form.quantity}
              onChange={(e) => handleChange(e, "quantity")}
              className={fieldClassName}
              ref={(el) => {
                inputRefs.current[4] = el;
              }}
              onKeyDown={(e) => handleKeyDown(e, 4)}
            />
          </div>
        </div>

        <div className={fieldWrapperClassName}>
          <div className="flex items-center gap-4">
            <Label
              htmlFor="expiryDate"
              className="w-[35%] text-sm font-medium text-gray-200 sm:text-base"
            >
              消費期限
            </Label>
            <Input
              id="expiryDate"
              type="date"
              value={form.expiryDate}
              onChange={(e) => handleChange(e, "expiryDate")}
              className={fieldClassName}
              ref={(el) => {
                inputRefs.current[5] = el;
              }}
              onKeyDown={(e) => handleKeyDown(e, 5)}
            />
          </div>
        </div>

        {errorMessage && (
          <p className="rounded bg-red-950 px-3 py-2 text-center text-sm text-red-200">
            {errorMessage}
          </p>
        )}

        <div className="flex flex-wrap justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={isBusy}
            className="w-32 border-gray-600 bg-transparent text-gray-200 hover:bg-gray-800 hover:text-white"
            onClick={() => {
              if (window.confirm("リセットしますか？")) {
                resetForm();
              }
            }}
          >
            リセット
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isBusy}
            className="w-32 border-gray-600 bg-transparent text-gray-200 hover:bg-gray-800 hover:text-white"
            onClick={async () => {
              setIsNavigating(true);
              router.push("/expiry/productList");
            }}
          >
            {isNavigating ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                移動中...
              </>
            ) : (
              "一覧へ"
            )}
          </Button>
          <Button type="submit" disabled={isBusy} className="w-32 bg-blue-600">
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                登録中...
              </>
            ) : (
              "登録する"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ExpiryInputForm;
