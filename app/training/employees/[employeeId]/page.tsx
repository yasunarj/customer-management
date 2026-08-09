"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";

type TrainingEmployee = {
  id: string;
  name: string;
  joinedAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type EmployeeResponse = {
  ok: boolean;
  employee: TrainingEmployee;
  error?: string;
};

const fetcher = async (
  url: string,
): Promise<EmployeeResponse> => {
  const response = await fetch(url, {
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error ??
        "従業員情報の取得に失敗しました",
    );
  }

  return data;
};

const TrainingEmployeeDetailPage = () => {
  const params = useParams<{
    employeeId: string;
  }>();

  const employeeId = params.employeeId;

  const apiUrl = employeeId
    ? `/api/training/employees/${encodeURIComponent(
        employeeId,
      )}`
    : null;

  const {
    data,
    error,
    isLoading,
  } = useSWR<EmployeeResponse>(
    apiUrl,
    fetcher,
  );

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

          <Link
            href="/training/employees"
            className="mt-6 inline-block text-blue-400 hover:underline"
          >
            従業員一覧へ戻る
          </Link>
        </div>
      </main>
    );
  }

  const employee = data?.employee;

  if (!employee) {
    return null;
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-gray-400">
              従業員詳細
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              {employee.name}
            </h1>
          </div>

          <Link
            href="/training/employees"
            className="text-sm text-blue-400 hover:underline"
          >
            一覧へ戻る
          </Link>
        </div>

        <section className="mt-8 rounded-xl border border-gray-700 bg-gray-900 p-6">
          <div className="flex flex-wrap items-center gap-3">
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

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-sm text-gray-500">
                入社日
              </p>

              <p className="mt-1">
                {employee.joinedAt
                  ? new Date(
                      employee.joinedAt,
                    ).toLocaleDateString(
                      "ja-JP",
                    )
                  : "未登録"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                登録日
              </p>

              <p className="mt-1">
                {new Date(
                  employee.createdAt,
                ).toLocaleDateString(
                  "ja-JP",
                )}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                最終更新日
              </p>

              <p className="mt-1">
                {new Date(
                  employee.updatedAt,
                ).toLocaleDateString(
                  "ja-JP",
                )}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-gray-700 bg-gray-900 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                教育項目
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                この従業員が覚える仕事を管理します。
              </p>
            </div>

            <Link
              href={`/training/employees/${employee.id}/assign`}
              className="rounded bg-blue-700 px-4 py-2 text-center text-sm font-medium hover:bg-blue-600"
            >
              仕事を割り当てる
            </Link>
          </div>

          <div className="mt-6 rounded-lg border border-dashed border-gray-700 p-6">
            <p className="text-sm text-gray-500">
              まだ教育項目は表示していません。
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default TrainingEmployeeDetailPage;