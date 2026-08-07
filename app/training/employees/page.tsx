"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";

type TrainingEmployee = {
  id: string;
  name: string;
  joinedAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type EmployeesResponse = {
  ok: boolean;
  employees: TrainingEmployee[];
  error?: string;
};

const fetcher = async (
  url: string,
): Promise<EmployeesResponse> => {
  const response = await fetch(url, {
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error ??
        "従業員一覧の取得に失敗しました",
    );
  }

  return data;
};

const TrainingEmployeesPage = () => {
  const supabase = useMemo(
    () => createClient(),
    [],
  );

  const [userRole, setUserRole] = useState<
    "admin" | "user" | null
  >(null);

  const {
    data,
    error,
    isLoading,
  } = useSWR<EmployeesResponse>(
    "/api/training/employees",
    fetcher,
  );

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
        user.app_metadata?.role ??
        user.user_metadata?.role ??
        "user";

      setUserRole(
        role === "admin" ? "admin" : "user",
      );
    };

    getCurrentUserRole();
  }, [supabase]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-black px-4 py-8 text-white">
        <div className="mx-auto max-w-4xl">
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
        <div className="mx-auto max-w-4xl">
          <p className="rounded bg-red-950 px-4 py-3 text-sm text-red-200">
            {error.message}
          </p>
        </div>
      </main>
    );
  }

  const employees = data?.employees ?? [];

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              従業員教育管理
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              従業員ごとの教育状況を管理します。
            </p>
          </div>

          {userRole === "admin" && (
            <Link
              href="/training/employees/new"
              className="rounded bg-blue-700 px-4 py-2 text-sm font-medium hover:bg-blue-600"
            >
              従業員を登録
            </Link>
          )}
        </div>

        {employees.length === 0 ? (
          <div className="mt-8 rounded-xl border border-gray-700 bg-gray-900 p-6">
            <p className="text-sm text-gray-400">
              登録されている従業員はいません。
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {employees.map((employee) => (
              <Link
                key={employee.id}
                href={`/training/employees/${employee.id}`}
                className="block rounded-xl border border-gray-700 bg-gray-900 p-5 transition hover:border-gray-500 hover:bg-gray-800"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-semibold">
                      {employee.name}
                    </h2>

                    <p className="mt-2 text-sm text-gray-400">
                      入社日：
                      {employee.joinedAt
                        ? new Date(
                            employee.joinedAt,
                          ).toLocaleDateString(
                            "ja-JP",
                          )
                        : "未登録"}
                    </p>
                  </div>

                  <span
                    className={`rounded px-2 py-1 text-xs ${
                      employee.isActive
                        ? "bg-green-950 text-green-300"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {employee.isActive
                      ? "在籍中"
                      : "無効"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/training"
            className="text-sm text-blue-400 hover:underline"
          >
            教育管理へ戻る
          </Link>
        </div>
      </div>
    </main>
  );
};

export default TrainingEmployeesPage;