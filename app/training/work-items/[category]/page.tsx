"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";

type TrainingCategory =
  | "REGISTER"
  | "CLEANING"
  | "PRODUCT_MANAGEMENT"
  | "OTHER";

type CategorySlug = "register" | "cleaning" | "product-management" | "other";

type TrainingWorkItem = {
  id: string;
  storeId: string;
  title: string;
  category: TrainingCategory;
  description: string;
  sortOrder: number;
  isActive: boolean;
  createAt: string;
  updatedAt: string;
};

type WorkItemsResponse = {
  ok: boolean;
  workItems: TrainingWorkItem[];
  error?: string;
};

const categoryMap: Record<CategorySlug, TrainingCategory> = {
  register: "REGISTER",
  cleaning: "CLEANING",
  "product-management": "PRODUCT_MANAGEMENT", // ダブルクォーとは - を引き算にしないため
  other: "OTHER",
};

const categoryLabels: Record<TrainingCategory, string> = {
  REGISTER: "レジ",
  CLEANING: "清掃",
  PRODUCT_MANAGEMENT: "商品管理",
  OTHER: "その他",
};

const isCategorySlug = (value: string): value is CategorySlug => {
  return value in categoryMap;
};

const fetcher = async (url: string): Promise<WorkItemsResponse> => {
  const response = await fetch(url, { cache: "no-store" });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const errorData =
      data &&
      typeof data === "object" &&
      "error" in data &&
      typeof data.error === "string"
        ? data.error
        : "仕事項目の取得に失敗しました";

    throw new Error(errorData);
  }

  return data as WorkItemsResponse;
};

const TrainingCategoryPage = () => {
  const params = useParams<{ category: string }>();
  const categorySlug = params.category;

  const isValidCategory = isCategorySlug(categorySlug);

  const category = isValidCategory ? categoryMap[categorySlug] : null;

  const apiUrl = category
    ? `/api/training/work-items?category=${encodeURIComponent(category)}`
    : null;

  const { data, error, isLoading } = useSWR<WorkItemsResponse>(apiUrl, fetcher);

  if (!isValidCategory || !category) {
    return (
      <main className="h-screen-vh bg-black px-4 py-8 text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold">カテゴリーが見つかりません</h1>

          <p className="mt-2 text-sm text-gray-400">
            指定されたカテゴリーは存在しません。
          </p>

          <Link
            href="/training/work-items"
            className="mt-6 inline-block text-blue-400 hover:underline"
          >
            仕事項目の管理へ戻る
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {categoryLabels[category]}の仕事項目
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              {categoryLabels[category]}カテゴリーに登録されている
              仕事項目を確認します。
            </p>
          </div>

          <Link
            href="/training/work-items"
            className="text-sm text-blue-400 hover:underline"
          >
            カテゴリー一覧へ戻る
          </Link>
        </div>

        {isLoading && (
          <p className="mt-8 text-sm text-gray-400">読み込み中...</p>
        )}

        {error && (
          <p className="mt-8 rounded bg-red-950 px-4 py-3 text-sm text-red-200">
            {error.message}
          </p>
        )}

        {!isLoading && !error && (data?.workItems.length ?? 0) === 0 && (
          <div className="mt-8 rounded-xl border border-gray-700 bg-gray-900 p-6">
            <p className="text-gray-300">
              このカテゴリーには仕事項目が登録されていません。
            </p>
          </div>
        )}

        {!isLoading && !error && (data?.workItems.length ?? 0) > 0 && (
          <div className="mt-8 space-y-3">
            {data?.workItems.map((workItem) => (
              <Link
                key={workItem.id}
                href={`/training/work-items/${categorySlug}/${workItem.id}`}
                className={`block rounded-xl border p-4 transition ${
                  workItem.isActive
                    ? "border-gray-700 bg-gray-900 hover:border-gray-500 hover:bg-gray-800"
                    : "border-gray-800 bg-gray-950 opacity-60 hover:opacity-80"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h2
                    className={`font-semibold ${
                      workItem.isActive ? "" : "text-gray-500 line-through"
                    }`}
                  >
                    {workItem.title}
                  </h2>

                  <div className="flex shrink-0 items-center gap-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${
                        workItem.isActive
                          ? "bg-green-950 text-green-300"
                          : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      {workItem.isActive ? "有効" : "無効"}
                    </span>

                    <span className="text-sm text-gray-400">詳細を見る →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default TrainingCategoryPage;