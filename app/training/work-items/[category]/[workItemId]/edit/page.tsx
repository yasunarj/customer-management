"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";

type TrainingCategory =
  | "REGISTER"
  | "CLEANING"
  | "PRODUCT_MANAGEMENT"
  | "OTHER";

type CategorySlug =
  | "register"
  | "cleaning"
  | "product-management"
  | "other";

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

const categoryOptions: Array<{
  value: TrainingCategory;
  label: string;
}> = [
  {
    value: "REGISTER",
    label: "レジ",
  },
  {
    value: "CLEANING",
    label: "清掃",
  },
  {
    value: "PRODUCT_MANAGEMENT",
    label: "商品管理",
  },
  {
    value: "OTHER",
    label: "その他",
  },
];

const categorySlugMap: Record<
  TrainingCategory,
  CategorySlug
> = {
  REGISTER: "register",
  CLEANING: "cleaning",
  PRODUCT_MANAGEMENT: "product-management",
  OTHER: "other",
};

const fetcher = async (
  url: string,
): Promise<WorkItemResponse> => {
  const response = await fetch(url, {
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error ?? "仕事項目の取得に失敗しました",
    );
  }

  return data;
};

const TrainingWorkItemEditPage = () => {
  const router = useRouter();

  const params = useParams<{
    category: string;
    workItemId: string;
  }>();

  const workItemId = params.workItemId;

  const supabase = useMemo(() => createClient(), []);

  const [userRole, setUserRole] = useState<
    "admin" | "user" | null
  >(null);

  const [isCheckingRole, setIsCheckingRole] =
    useState(true);

  const [title, setTitle] = useState("");
  const [category, setCategory] =
    useState<TrainingCategory>("REGISTER");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);

  const [isInitialized, setIsInitialized] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const apiUrl = workItemId
    ? `/api/training/work-items/${encodeURIComponent(
        workItemId,
      )}`
    : null;

  const {
    data,
    error,
    isLoading,
  } = useSWR<WorkItemResponse>(apiUrl, fetcher);

  useEffect(() => {
    const checkRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUserRole(null);
        setIsCheckingRole(false);
        return;
      }

      const role =
        user.app_metadata?.role ??
        user.user_metadata?.role ??
        "user";

      setUserRole(
        role === "admin" ? "admin" : "user",
      );

      setIsCheckingRole(false);
    };

    checkRole();
  }, [supabase]);

  useEffect(() => {
    if (!data?.workItem || isInitialized) {
      return;
    }

    setTitle(data.workItem.title);
    setCategory(data.workItem.category);
    setDescription(
      data.workItem.description ?? "",
    );
    setSortOrder(data.workItem.sortOrder);

    setIsInitialized(true);
  }, [data, isInitialized]);

  const isDisabled =
    isSubmitting ||
    !title.trim() ||
    !Number.isInteger(sortOrder) ||
    sortOrder < 0;

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setErrorMessage("");

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(
        "仕事項目名を入力してください",
      );
      return;
    }

    if (
      !Number.isInteger(sortOrder) ||
      sortOrder < 0
    ) {
      setErrorMessage(
        "並び順は0以上の整数で入力してください",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/training/work-items/${encodeURIComponent(
          workItemId,
        )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: trimmedTitle,
            category,
            description,
            sortOrder,
          }),
        },
      );

      const responseData = await response
        .json()
        .catch(() => null);

      if (response.status === 401) {
        router.replace(
          `/auth/login?next=${encodeURIComponent(
            window.location.pathname,
          )}`,
        );
        return;
      }

      if (response.status === 403) {
        setErrorMessage(
          responseData?.error ??
            "仕事項目を編集できるのは管理者だけです",
        );
        return;
      }

      if (response.status === 409) {
        setErrorMessage(
          responseData?.error ??
            "同じ名前の仕事項目が登録されています",
        );
        return;
      }

      if (response.status === 400) {
        const issueMessage =
          responseData?.issues?.[0]?.message;

        setErrorMessage(
          issueMessage ??
            responseData?.error ??
            "入力内容を確認してください",
        );
        return;
      }

      if (
        !response.ok ||
        !responseData?.ok
      ) {
        setErrorMessage(
          responseData?.error ??
            "仕事項目の更新に失敗しました",
        );
        return;
      }

      const updatedWorkItem =
        responseData.workItem as TrainingWorkItem;

      const updatedCategorySlug =
        categorySlugMap[
          updatedWorkItem.category
        ];

      router.push(
        `/training/work-items/${updatedCategorySlug}/${updatedWorkItem.id}`,
      );

      router.refresh();
    } catch (error) {
      console.error(
        "仕事項目の更新エラー:",
        error,
      );

      setErrorMessage(
        "通信エラーが発生しました。時間をおいて再度お試しください",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (
    isLoading ||
    isCheckingRole ||
    !isInitialized
  ) {
    return (
      <main className="min-h-screen bg-black px-4 py-8 text-white">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm text-gray-400">
            読み込み中...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black px-4 py-8 text-white">
        <div className="mx-auto max-w-2xl">
          <p className="rounded bg-red-950 px-4 py-3 text-sm text-red-200">
            {error.message}
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

  if (userRole !== "admin") {
    return (
      <main className="min-h-screen bg-black px-4 py-8 text-white">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl font-bold">
            編集権限がありません
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            仕事項目を編集できるのは管理者だけです。
          </p>

          <Link
            href={`/training/work-items/${params.category}/${workItemId}`}
            className="mt-6 inline-block text-blue-400 hover:underline"
          >
            詳細ページへ戻る
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen-vh bg-black px-4 py-8 text-white overflow-y-scroll">
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              仕事項目の編集
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              仕事項目の内容を変更します。
            </p>
          </div>

          <Link
            href={`/training/work-items/${params.category}/${workItemId}`}
            className="text-sm text-blue-400 hover:underline"
          >
            詳細へ戻る
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
                  event.target
                    .value as TrainingCategory,
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
              作業内容
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              maxLength={2000}
              rows={12}
              placeholder="作業手順や注意点を入力してください"
              className="resize-y rounded bg-gray-800 px-3 py-2 leading-7 text-sm"
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
              href={`/training/work-items/${params.category}/${workItemId}`}
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
              {isSubmitting
                ? "更新中..."
                : "変更を保存"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default TrainingWorkItemEditPage;