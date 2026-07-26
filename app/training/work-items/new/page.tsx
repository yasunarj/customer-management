"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type TrainingCategory =
  | "REGISTER"
  | "CLEANING"
  | "PRODUCT_MANAGEMENT"
  | "OTHER";

const categoryOptions: Array<{
  value: TrainingCategory;
  label: string;
}> = [
  { value: "REGISTER", label: "レジ" },
  { value: "CLEANING", label: "清掃" },
  { value: "PRODUCT_MANAGEMENT", label: "商品管理" },
  { value: "OTHER", label: "その他" },
];

const NewTrainingWorkItemPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<TrainingCategory>("REGISTER");
  const [description, setDescription] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const isDisabled = isLoading || !title.trim() || sortOrder < 0;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage("仕事の項目名を入力してください");
      return;
    }

    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      setErrorMessage("並び順は0以上の整数で入力してください");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/training/work-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trimmedTitle,
          category,
          description,
          sortOrder,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.status === 401) {
        router.replace("/auth/login?next=%2Ftraining%2Fwork-items%2Fnew");
        return;
      }

      if (res.status === 403) {
        setErrorMessage(
          data?.error ?? "仕事項目を追加できるのは管理者だけです",
        );
        return;
      }

      if (res.status === 409) {
        setErrorMessage(data?.error ?? "同じ名前の仕事項目が登録されています");
        return;
      }

      if (res.status === 400) {
        const issueMessage = data?.issues?.[0]?.message;

        setErrorMessage(
          issueMessage ?? data?.error ?? "入力内容を確認してくだい",
        );
        return;
      }

      if (!res.ok || !data?.ok) {
        setErrorMessage(data?.error ?? "仕事項目の登録に失敗しました");
        return;
      }

      router.push("/training/work-items");
      router.refresh();
    } catch (e) {
      console.error("仕事項目のエラー:", e);

      setErrorMessage(
        "通信エラーが発生しました。時間をおいてもう一度お試しください",
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div> <h1 className="text-2xl font-bold">仕事項目の新規登録</h1>
          <p className="mt-2 text-sm text-gray-400">教育に使用する仕事項目を登録します。</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NewTrainingWorkItemPage;

// isDisabledのところで!title.trim()とする必要はありますか？
// 空白が空いていても文字があればtitleはtrueになるのではないでしょうか？

// Number.isInteger()の意味を教えてください。
