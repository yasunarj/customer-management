"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { expirySchema } from "../lib/expirySchema";
import { useRouter } from "next/navigation";

type ExpiryEditFormProps = {
  id: number;
  productName: string;
  gondolaNo: number;
  category: string;
  expiryDate: Date;
  quantity: number;
  manager: string;
  createdAt: Date;
  updateAt: Date;
};

interface EditFormState {
  productName: string;
  gondolaNo: number;
  category: string;
  expiryDate: string;
  quantity: number;
  manager: string;
}

const toInputDate = (d: Date | string): string => {
  if (!d) return "";
  if (typeof d === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    const parsed = new Date(d);
    if (isNaN(parsed.getTime())) return "";
    const z = new Date(parsed.getTime() - parsed.getTimezoneOffset() * 60000);
    return z.toISOString().slice(0, 10);
  }
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
};

const ExpiryEditForm = ({
  productData,
}: {
  productData: ExpiryEditFormProps;
}) => {
  const router = useRouter();
  const inputRefs = useRef<(HTMLElement | null)[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [editFormState, setEditFormState] = useState<EditFormState>({
    productName: productData.productName,
    gondolaNo: productData.gondolaNo,
    category: productData.category,
    expiryDate: toInputDate(productData.expiryDate),
    quantity: productData.quantity,
    manager: productData.manager ?? "",
  });

  const isComposingRef = useRef(false);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key !== "Enter") return;
    const native = e.nativeEvent as KeyboardEvent;
    if (
      isComposingRef.current ||
      native.isComposing ||
      native?.key === "Process"
    ) {
      return;
    }

    e.preventDefault();
    const next = inputRefs.current[index + 1];
    if (next) next.focus();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof typeof editFormState
  ) => {
    if (
      (key === "gondolaNo" || key === "quantity") &&
      e.target.value.length > 1 &&
      e.target.value.startsWith("0")
    ) {
      e.target.value = e.target.value.replace(/^0+/, "");
    }
    setEditFormState((prev) => prev && { ...prev, [key]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setErrorMessage("");

    const parsed = expirySchema.safeParse({
      gondolaNo: Number(editFormState.gondolaNo || 0),
      category: editFormState.category,
      productName: editFormState.productName,
      expiryDate: editFormState.expiryDate,
      quantity: Number(editFormState.quantity || 0),
      manager: editFormState.manager,
    });

    if (!parsed.success) {
      const eMessage =
        parsed.error.issues?.[0]?.message ?? "入力内容を確認してください";
      setErrorMessage(eMessage);
      setIsSending(false);
      return;
    }

    try {
      const res = await fetch(`/api/expiry/${productData.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        throw new Error("更新に失敗しました");
      }
      router.push("/expiry/productList");
    } catch (e) {
      console.error(e);
      setErrorMessage("更新に失敗しました");
    } finally {
      setIsSending(false);
    }
  };

  if (!editFormState) {
    return <div>データが存在しません</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-[520px] mx-auto p-4 h-full">
      <div className="flex flex-col justify-between mt-2 gap-2 h-full">
        <div className="flex flex-col items-center">
          <Label
            htmlFor="productName"
            className="w-[40%] text-[18px] font-bold items-start self-start"
          >
            商品名
          </Label>
          <Input
            id="productName"
            type="text"
            value={editFormState.productName}
            onChange={(e) => handleChange(e, "productName")}
            className="text-right text-sm self-end"
            ref={(el) => {
              inputRefs.current[0] = el;
            }}
            onKeyDown={(e) => handleKeyDown(e, 0)}
            onCompositionStart={() => (isComposingRef.current = true)}
            onCompositionEnd={() => (isComposingRef.current = false)}
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
              value={editFormState.expiryDate}
              onChange={(e) => handleChange(e, "expiryDate")}
              className="text-right"
              ref={(el) => {
                inputRefs.current[1] = el;
              }}
              onKeyDown={(e) => handleKeyDown(e, 1)}
              onCompositionStart={() => (isComposingRef.current = true)}
              onCompositionEnd={() => (isComposingRef.current = false)}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor="quantity" className="w-[40%] text-[18px] font-bold">
            個数
          </Label>
          <Input
            id="quantity"
            type="number"
            value={editFormState.quantity}
            onChange={(e) => handleChange(e, "quantity")}
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
          <Label htmlFor="category" className="w-[40%] text-[18px] font-bold">
            分類
          </Label>
          <Input
            id="category"
            type="text"
            value={editFormState.category}
            onChange={(e) => handleChange(e, "category")}
            className="text-right"
            ref={(el) => {
              inputRefs.current[3] = el;
            }}
            onKeyDown={(e) => handleKeyDown(e, 3)}
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
            value={editFormState.gondolaNo}
            onChange={(e) => handleChange(e, "gondolaNo")}
            className="text-right"
            ref={(el) => {
              inputRefs.current[4] = el;
            }}
            onKeyDown={(e) => handleKeyDown(e, 4)}
            onCompositionStart={() => (isComposingRef.current = true)}
            onCompositionEnd={() => (isComposingRef.current = false)}
          />
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor="manager" className="w-[40%] text-[16px] font-bold">
            担当者
          </Label>
          <Input
            id="manager"
            type="text"
            value={editFormState.manager}
            onChange={(e) => handleChange(e, "manager")}
            className="text-right"
            ref={(el) => {
              inputRefs.current[5] = el;
            }}
            onKeyDown={(e) => handleKeyDown(e, 5)}
            onCompositionStart={() => (isComposingRef.current = true)}
            onCompositionEnd={() => (isComposingRef.current = false)}
          />
        </div>
        <div className="flex justify-center">
          <Button type="submit" className="text-md w-[40%]">
            {isSending ? (
              <Loader2 className="animate-spin h-10 w-10" />
            ) : (
              "更新"
            )}
          </Button>
        </div>
        <p className="text-center text-red-600 text-sm mt-2">{errorMessage}</p>
      </div>
    </form>
  );
};

export default ExpiryEditForm;

// 複数人で同時にListを触るときにはしたの制御を検討する
// useEffect(() => {
//   if (!productData) return;

//   setEditFormState({
//     productName: productData.productName,
//     gondolaNo: productData.gondolaNo,
//     category: productData.category,
//     expiryDate: toInputDate(productData.expiryDate),
//     quantity: productData.quantity,
//     manager: productData.manager ?? "",
//   });
// }, [productData]);
