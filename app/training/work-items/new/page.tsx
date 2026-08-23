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
    <main className="h-screen-vh bg-black px-4 py-8 text-white overflow-y-scroll">
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              仕事項目の新規登録
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              教育に使用する仕事項目を登録します。
            </p>
          </div>

          <Link
            href="/training/work-items"
            className="text-sm text-blue-400 hover:underline"
          >
            戻る
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-xl border border-gray-700 bg-gray-900 p-6"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="title"
              className="text-sm font-medium"
            >
              仕事項目名
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              maxLength={100}
              placeholder="例：宅急便"
              className="rounded bg-gray-800 px-3 py-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="category"
              className="text-sm font-medium"
            >
              カテゴリー
            </label>

            <select
              id="category"
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value as TrainingCategory,
                )
              }
              className="rounded bg-gray-800 px-3 py-2"
            >
              {categoryOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="description"
              className="text-sm font-medium"
            >
              説明
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              maxLength={2000}
              rows={6}
              placeholder="仕事の概要や注意点を入力してください"
              className="resize-y rounded bg-gray-800 px-3 py-2"
            />

            <p className="text-right text-xs text-gray-500">
              {description.length} / 2000
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="sortOrder"
              className="text-sm font-medium"
            >
              並び順
            </label>

            <input
              id="sortOrder"
              type="number"
              min={0}
              step={1}
              value={sortOrder}
              onFocus={(event) =>
                event.currentTarget.select()
              }
              onChange={(event) =>
                setSortOrder(
                  Number(event.target.value),
                )
              }
              className="rounded bg-gray-800 px-3 py-2"
            />

            <p className="text-xs text-gray-500">
              数字が小さい項目ほど先に表示します。
            </p>
          </div>

          {errorMessage && (
            <p className="rounded bg-red-950 px-3 py-2 text-sm text-red-200">
              {errorMessage}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <Link
              href="/training/work-items"
              className="rounded bg-gray-700 px-4 py-2 text-sm hover:bg-gray-600"
            >
              キャンセル
            </Link>

            <button
              type="submit"
              disabled={isDisabled}
              className={`rounded px-4 py-2 text-sm font-medium ${
                isDisabled
                  ? "cursor-not-allowed bg-gray-600 text-gray-400"
                  : "bg-blue-700 hover:bg-blue-600"
              }`}
            >
              {isLoading ? "登録中..." : "登録する"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default NewTrainingWorkItemPage;


