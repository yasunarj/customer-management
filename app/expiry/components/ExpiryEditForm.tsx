"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { expirySchema } from "../lib/expirySchema";
import { useRouter } from "next/navigation";
import { ExpiryItem } from "../lib/types";
import { useSWRConfig } from "swr";

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

const LIST_KEY = "/api/expiry?limit=50";

const ExpiryEditForm = ({
  productData,
  isValidating,
}: {
  productData: ExpiryItem;
  isValidating: boolean;
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

  const { mutate, cache } = useSWRConfig();
  const isComposingRef = useRef(false);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
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
    key: keyof typeof editFormState,
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

    const updated = { ...productData, ...parsed.data };

    try {
      // 1, 楽観的UI: 一覧キャッシュを書き換え
      const current = cache.get(LIST_KEY)?.data as
        | { items: ExpiryItem[]; nextCursor: number | null }
        | undefined;

      if (current) {
        const optimistic = {
          ...current,
          items: current.items.map((it) =>
            it.id === productData.id ? { ...it, ...parsed.data } : it,
          ),
        };
        mutate(LIST_KEY, optimistic, false);
      }

      // 2, 詳細キャッシュも更新
      mutate(`/api/expiry/${productData.id}`, updated, false);

      // 3, APIの呼び出し
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
      // 4, DBと再同期
      await mutate(LIST_KEY);
      await mutate(`/api/expiry/${productData.id}`);
    } catch (e) {
      console.error(e);
      setErrorMessage("更新に失敗しました");
    } finally {
      setIsSending(false);
    }
  };

  const fieldClassName =
    "border-gray-600 bg-gray-900 text-right text-white placeholder:text-gray-600";

  const fieldWrapperClassName =
    "rounded-lg border border-gray-700 bg-gray-800 p-3";

  if (!editFormState) {
    return <div>データが存在しません</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto w-full h-full">
      <div className="space-y-4">
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
              value={editFormState.productName}
              onChange={(e) => handleChange(e, "productName")}
              className={`${fieldClassName} text-sm`}
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
              htmlFor="expiryDate"
              className="w-[35%] text-sm font-medium text-gray-200 sm:text-base"
            >
              消費期限
            </Label>
            <Input
              id="expiryDate"
              type="date"
              value={editFormState.expiryDate}
              onChange={(e) => handleChange(e, "expiryDate")}
              className={`${fieldClassName}`}
              ref={(el) => {
                inputRefs.current[1] = el;
              }}
              onKeyDown={(e) => handleKeyDown(e, 0)}
            />
          </div>
        </div>

        <div className={fieldWrapperClassName}>
          <div className="flex items-center gap-4">
            <Label
              htmlFor="quantity"
              className="w-[35%] text-sm font-medium text-gray-200 sm:text-base"
            >
              個数
            </Label>
            <Input
              id="quantity"
              type="number"
              value={editFormState.quantity}
              onChange={(e) => handleChange(e, "quantity")}
              className={`${fieldClassName}`}
              ref={(el) => {
                inputRefs.current[2] = el;
              }}
              onKeyDown={(e) => handleKeyDown(e, 2)}
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
              value={editFormState.category}
              onChange={(e) => handleChange(e, "category")}
              className={`${fieldClassName}`}
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
              className="w-[35%] text-sm font-medium text-gray-200 sm:text-base"
            >
              ゴンドラ
            </Label>
            <Input
              id="gondolaNo"
              type="number"
              value={editFormState.gondolaNo}
              onChange={(e) => handleChange(e, "gondolaNo")}
              className={`${fieldClassName}`}
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
              htmlFor="manager"
              className="w-[35%] text-sm font-medium text-gray-200 sm:text-base"
            >
              担当者
            </Label>
            <Input
              id="manager"
              type="text"
              value={editFormState.manager}
              onChange={(e) => handleChange(e, "manager")}
              className={`${fieldClassName}`}
              ref={(el) => {
                inputRefs.current[5] = el;
              }}
              onKeyDown={(e) => handleKeyDown(e, 5)}
              onCompositionStart={() => (isComposingRef.current = true)}
              onCompositionEnd={() => (isComposingRef.current = false)}
            />
          </div>
        </div>

        {errorMessage && (
          <p className="rounded bg-red-950 px-3 py-2 text-center text-sm text-red-200">
            {errorMessage}
          </p>
        )}

        {isValidating && (
          <p className="text-center text-xs text-gray-500">更新中...</p>
        )}

        <div className="flex justify-center gap-8 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={isSending}
            onClick={() => router.back()}
            className="w-32 border-gray-600 bg-transparent text-gray-200 hover:bg-gray-800 hover:text-white"
          >
            キャンセル
          </Button>

          <Button
            type="submit"
            disabled={isSending}
            className="w-32 bg-blue-700 hover:bg-blue-600"
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                更新中...
              </>
            ) : (
              "更新"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ExpiryEditForm;
