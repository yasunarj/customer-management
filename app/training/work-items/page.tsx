"use client";

import Link from "next/link";
import useSWR from "swr";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type TrainingCategory =
  | "REGISTER"
  | "CLEANING"
  | "PRODUCT_MANAGEMENT"
  | "OTHER";

type TrainingWorkItem = {
  id: string;
  storeId: string;
  title: string;
  category: TrainingCategory;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type CategoryCounts = Record<TrainingCategory, number>;

type WorkItemsResponse = {
  ok: boolean;
  workItems: TrainingWorkItem[];
  categoryCounts: CategoryCounts;
  error?: string;
};

const categories: Array<{
  value: TrainingCategory;
  label: string;
  href: string;
  description: string;
}> = [
  {
    value: "REGISTER",
    label: "レジ",
    href: "/training/work-items/register",
    description: "レジ操作や各種受付業務を管理します",
  },
  {
    value: "CLEANING",
    label: "清掃",
    href: "/training/work-items/cleaning",
    description: "店内や設備の清掃項目を管理します",
  },
  {
    value: "PRODUCT_MANAGEMENT",
    label: "商品管理",
    href: "/training/work-items/product-manager",
    description: "品出しや鮮度管理などの項目を管理します",
  },
  {
    value: "OTHER",
    label: "その他",
    href: "/training/work-items/other",
    description: "上記以外の仕事項目を管理します",
  },
];

const fetcher = async (url: string): Promise<WorkItemsResponse> => {
  const response = await fetch(url, {
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);
  console.log(data);

  if (!response.ok) {
    throw new Error(data?.error ?? "仕事項目の取得に失敗しました");
  }

  return data;
};

const TrainingWorkItemsPage = () => {
  const supabase = useMemo(() => createClient(), []);

  const [userRole, setUserRole] = useState<"admin" | "user" | null>(null);

  const [isCheckingRole, setIsCheckingRole] = useState<boolean>(true);

  const { data, error, isLoading } = useSWR<WorkItemsResponse>(
    "/api/training/work-items",
    fetcher,
  );

  useEffect(() => {
    const getCurrentUserRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUserRole(null);
        setIsCheckingRole(false);
        return;
      }

      const role =
        user.app_metadata?.role ?? user.user_metadata?.role ?? "user";

      setUserRole(role === "admin" ? "admin" : "user");
      setIsCheckingRole(false);
    };

    getCurrentUserRole();
  }, [supabase]);

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">仕事項目の管理</h1>

            <p className="mt-2 text-sm text-gray-400">
              教育で使用する仕事項目をカテゴリー別に確認します。
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/training"
              className="text-sm text-blue-400 hover:underline"
            >
              教育管理へ戻る
            </Link>

            {!isCheckingRole && userRole === "admin" && (
              <Link
                href="/training/work-items/new"
                className="rounded bg-blue-700 px-4 py-2 text-sm font-medium hover:bg-blue-600"
              >
                新しい仕事項目を登録
              </Link>
            )}
          </div>
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
            <p className="text-gray-300">仕事項目はまだ登録されていません。</p>

            {!isCheckingRole && userRole === "admin" && (
              <Link
                href="/training/work-items/new"
                className="mt-4 inline-block text-blue-400 hover:underline"
              >
                最初の仕事項目を登録する
              </Link>
            )}
          </div>
        )}

        {!isLoading && !error && data && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {categories.map((category) => (
              <Link
                key={category.value}
                href={category.href}
                className="rounded-xl border border-gray-700 bg-gray-900 p-5 transition hover:border-gray-500 hover:bg-gray-800"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">{category.label}</h2>

                    <p className="mt-2 text-sm text-gray-400">
                      {category.description}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-300">
                    {data.categoryCounts[category.value]}項目
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default TrainingWorkItemsPage;
