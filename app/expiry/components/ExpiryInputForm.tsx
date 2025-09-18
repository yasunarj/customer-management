"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { expirySchema } from "../lib/expirySchema";

const ExpiryInputForm = () => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

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
    index: number
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
    key: keyof typeof form
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

  const reestForm = () => {
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
    setIsSending(true);
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
      setIsSending(false);
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
        reestForm();
      } else {
        setErrorMessage("登録に失敗しました");
      }
    } catch (e) {
      console.error(e);
      setErrorMessage("サーバーエラーが発生しました");
    } finally {
      setIsSending(false);
    }
  };
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
      className="max-w-[520px] mx-auto p-4 h-full"
    >
      <div className="flex flex-col justify-between mt-2 gap-2 h-full">
        <div className="flex items-center gap-3 ">
          <Label htmlFor="manager" className="w-[40%] text-[16px] font-bold">
            担当者
          </Label>
          <Input
            id="manager"
            type="text"
            value={form.manager}
            onChange={(e) => handleChange(e, "manager")}
            className="text-right"
            ref={(el) => {
              inputRefs.current[0] = el;
            }}
            onKeyDown={(e) => handleKeyDown(e, 0)}
            onCompositionStart={() => (isComposingRef.current = true)}
            onCompositionEnd={() => (isComposingRef.current = false)}
          />
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor="gondolaNo" className="w-[40%] text-[16px] font-bold">
            ゴンドラ
          </Label>
          <Input
            id="gondolaNo"
            type="number"
            value={form.gondolaNo}
            onChange={(e) => handleChange(e, "gondolaNo")}
            className="text-right"
            ref={(el) => {
              inputRefs.current[1] = el;
            }}
            onKeyDown={(e) => handleKeyDown(e, 1)}
          />
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor="category" className="w-[40%] text-[18px] font-bold">
            分類
          </Label>
          <Input
            id="category"
            type="text"
            value={form.category}
            onChange={(e) => handleChange(e, "category")}
            className="text-right"
            ref={(el) => {
              inputRefs.current[2] = el;
            }}
            onKeyDown={(e) => handleKeyDown(e, 2)}
            onCompositionStart={() => (isComposingRef.current = true)}
            onCompositionEnd={() => (isComposingRef.current = false)}
          />
        </div>
        <div className="flex items-center gap-3">
          <Label
            htmlFor="productName"
            className="w-[40%] text-[18px] font-bold"
          >
            商品名
          </Label>
          <Input
            id="productName"
            type="text"
            value={form.productName}
            onChange={(e) => handleChange(e, "productName")}
            className="text-right text-sm"
            ref={(el) => {
              inputRefs.current[3] = el;
            }}
            onKeyDown={(e) => handleKeyDown(e, 3)}
            onCompositionStart={() => (isComposingRef.current = true)}
            onCompositionEnd={() => (isComposingRef.current = false)}
          />
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor="quantity" className="w-[40%] text-[18px] font-bold">
            個数
          </Label>
          <Input
            id="quantity"
            type="number"
            value={form.quantity}
            onChange={(e) => handleChange(e, "quantity")}
            className="text-right"
            ref={(el) => {
              inputRefs.current[4] = el;
            }}
            onKeyDown={(e) => handleKeyDown(e, 4)}
          />
        </div>
        <div className="flex items-center gap-3 w-full">
          <Label
            htmlFor="expiryDate"
            className="w-[27.3%] text-[18px] font-bold"
          >
            消費期限
          </Label>
          <div className="relative flex-1 min-w-0">
            <Input
              id="expiryDate"
              type="date"
              value={form.expiryDate}
              onChange={(e) => handleChange(e, "expiryDate")}
              className="text-right"
              ref={(el) => {
                inputRefs.current[5] = el;
              }}
              onKeyDown={(e) => handleKeyDown(e, 5)}
            />
          </div>
        </div>

        <div className="flex gap-4 justify-center mt-6">
          <Button
            type="reset"
            className="w-[40%]"
            onClick={() => {
              if (confirm("リセットしますか？")) {
                setForm({
                  gondolaNo: "",
                  category: "",
                  productName: "",
                  expiryDate: "",
                  quantity: "",
                  manager: "",
                });
              }
            }}
          >
            リセット
          </Button>
          <Button type="submit" className="w-[40%]">
            {isSending ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              "登録する"
            )}
          </Button>
        </div>
        <p className="text-center text-red-600 text-sm mt-2">{errorMessage}</p>
      </div>
    </form>
  );
};

export default ExpiryInputForm;
