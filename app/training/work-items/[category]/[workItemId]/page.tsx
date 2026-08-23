"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";

type TrainingCategory =
  | "REGISTER"
  | "CLEANING"
  | "PRODUCT_MANAGEMENT"
  | "OTHER";

type CategorySlug = "register" | "cleaning" | "product-management" | "other";

type TrainingWorkItem = {
  id: string;
  title: string;
  category: TrainingCategory;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type WorkItemResponse = {
  ok: boolean;
  workItem: TrainingWorkItem;
  error?: string;
};

const categoryMap: Record<CategorySlug, TrainingCategory> = {
  register: "REGISTER",
  cleaning: "CLEANING",
  "product-management": "PRODUCT_MANAGEMENT",
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

const fetcher = async (url: string): Promise<WorkItemResponse> => {
  const response = await fetch(url, {
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error ?? "仕事項目の取得に失敗しました");
  }

  return data;
};

const TrainingWorkItemDetailPage = () => {
  const supabase = useMemo(() => createClient(), []);

  const [userRole, setUserRole] = useState<"admin" | "user" | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string>("");

  useEffect(() => {
    const getCurrentUserRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUserRole(null);
        return;
      }

      const role =
        user.app_metadata?.role ?? user.user_metadata?.role ?? "user";

      setUserRole(role === "admin" ? "admin" : "user");
    };

    getCurrentUserRole();
  }, [supabase]);

  const params = useParams<{
    category: string;
    workItemId: string;
  }>();

  const categorySlug = params.category;
  const workItemId = params.workItemId;

  const isValidCategory = isCategorySlug(categorySlug);

  const category = isValidCategory ? categoryMap[categorySlug] : null;

  const apiUrl =
    workItemId && isValidCategory
      ? `/api/training/work-items/${encodeURIComponent(workItemId)}`
      : null;

  const { data, error, isLoading, mutate } = useSWR<WorkItemResponse>(
    apiUrl,
    fetcher,
  );

  const handleToggleActive = async () => {
    if (!workItemId || !data?.workItem) {
      return;
    }

    const nextIsActive = !data.workItem.isActive;

    const confirmed = window.confirm(
      nextIsActive
        ? "この仕事項目を有効に戻しますか？"
        : "この仕事項目を無効にしますか?",
    );

    if (!confirmed) {
      return;
    }

    setIsUpdating(true);
    setUpdateError("");

    try {
      const res = await fetch(
        `/api/training/work-items/${encodeURIComponent(workItemId)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: nextIsActive,
          }),
        },
      );

      const resData = await res.json().catch(() => null);

      if (res.status === 401) {
        setUpdateError("ログイン情報を確認できませんでした");
        return;
      }

      if (res.status === 403) {
        setUpdateError(
          resData?.error ?? "仕事項目を変更できるのは管理者だけです",
        );
        return;
      }

      if (!res.ok || !resData?.ok) {
        setUpdateError(resData?.error ?? "仕事項目の変更に失敗しました");
        return;
      }

      await mutate();
    } catch (e) {
      console.error("仕事項目の状態変更エラー:", e);

      setUpdateError(
        "通信エラーが発生しました。時間をおいて再度お試しください",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isValidCategory || !category) {
    return (
      <main className="min-h-screen bg-black px-4 py-8 text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold">カテゴリーが見つかりません</h1>

          <Link
            href="/training/work-items"
            className="mt-6 inline-block text-blue-400 hover:underline"
          >
            カテゴリー一覧へ戻る
          </Link>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black px-4 py-8 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm text-gray-400">読み込み中...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black px-4 py-8 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="rounded bg-red-950 px-4 py-3 text-sm text-red-200">
            {error.message}
          </p>

          <Link
            href={`/training/work-items/${categorySlug}`}
            className="mt-6 inline-block text-blue-400 hover:underline"
          >
            {categoryLabels[category]}一覧へ戻る
          </Link>
        </div>
      </main>
    );
  }

  const workItem = data?.workItem;

  if (!workItem) {
    return null;
  }

  return (
    <main className="h-screen-vh bg-black px-4 py-8 text-white overflow-y-scroll">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-gray-400">
              {categoryLabels[workItem.category]}
            </p>

            <h1 className="mt-1 text-2xl font-bold">{workItem.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            {userRole === "admin" && (
              <>
                <Link
                  href={`/training/work-items/${categorySlug}/${workItem.id}/edit`}
                  className="rounded bg-blue-700 px-4 py-2 text-sm font-medium hover:bg-blue-600"
                >
                  編集する
                </Link>

                <button
                  type="button"
                  onClick={handleToggleActive}
                  disabled={isUpdating}
                  className={`rounded px-4 py-2 text-sm font-medium ${workItem.isActive ? "bg-red-800 hover:bg-red-700" : "bg-green-800 hover:green-700"} disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {isUpdating
                    ? "変更中..."
                    : workItem.isActive
                      ? "無効にする"
                      : "有効に戻す"}
                </button>
              </>
            )}
            <Link
              href={`/training/work-items/${categorySlug}`}
              className="text-sm text-blue-400 hover:underline"
            >
              一覧へ戻る
            </Link>
          </div>
        </div>

        <section className="mt-8 rounded-xl border border-gray-700 bg-gray-900 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`rounded px-2 py-1 text-xs ${
                workItem.isActive
                  ? "bg-green-950 text-green-300"
                  : "bg-gray-800 text-gray-400"
              }`}
            >
              {workItem.isActive ? "有効" : "無効"}
            </span>

            <span className="text-xs text-gray-500">
              並び順：{workItem.sortOrder}
            </span>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold">作業内容</h2>

            {updateError && (
              <p className="mt-6 rounded bg-red-950 px-4 py-3 text-sm text-red-200">
                {updateError}
              </p>
            )}

            {workItem.description ? (
              <p className="mt-4 whitespace-pre-wrap leading-7 text-gray-300">
                {workItem.description}
              </p>
            ) : (
              <p className="mt-4 text-sm text-gray-500">
                詳細な説明はまだ登録されていません。
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default TrainingWorkItemDetailPage;
