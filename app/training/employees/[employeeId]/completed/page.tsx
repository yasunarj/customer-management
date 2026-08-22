"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";

type TrainingCategory =
  | "REGISTER"
  | "CLEANING"
  | "PRODUCT_MANAGEMENT"
  | "OTHER";

type TrainingEmployee = {
  id: string;
  name: string;
  joinedAt: string | null;
  isActive: boolean;
  createAt: string;
  updatedAt: string;
};

type EmployeeResponse = {
  ok: boolean;
  employee: TrainingEmployee;
  error?: string;
};

type TrainingCheck = {
  id: string;
  checkNumber: number;
  trainerId: string;
  trainerName: string | null;
  comment: string | null;
  checkedAt: string;
};

type Assignment = {
  id: string;
  employeeId: string;
  workItemId: string;
  completedAt: string | null;

  workItem: {
    id: string;
    title: string;
    category: TrainingCategory;
    description: string | null;
    sortOrder: number;
    isActive: boolean;
  };

  checks: TrainingCheck[];
};

type AssignmentsResponse = {
  ok: boolean;
  assignments: Assignment[];
  error?: string;
};

const categoryLabels: Record<TrainingCategory, string> = {
  REGISTER: "レジ",
  CLEANING: "清掃",
  PRODUCT_MANAGEMENT: "商品管理",
  OTHER: "その他",
};

const categoryOrder: TrainingCategory[] = [
  "REGISTER",
  "CLEANING",
  "PRODUCT_MANAGEMENT",
  "OTHER",
];

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error ?? "データの取得に失敗しました");
  }

  return data;
};

const TrainingEmployeeCompletedPage = () => {
  const params = useParams<{ employeeId: string }>();

  const employeeId = params.employeeId;

  const employeeApiUrl = employeeId
    ? `/api/training/employees/${encodeURIComponent(employeeId)}`
    : null;

  const assignmentsApiUrl = employeeId
    ? `/api/training/employees/${encodeURIComponent(employeeId)}/assignments`
    : null;

  const {
    data: employeeData,
    error: employeeError,
    isLoading: isEmployeeLoading,
  } = useSWR<EmployeeResponse>(employeeApiUrl, fetcher);

  const {
    data: assignmentsData,
    error: assignmentsError,
    isLoading: isAssignmentsLoading,
  } = useSWR<AssignmentsResponse>(assignmentsApiUrl, fetcher);

  if (isEmployeeLoading || isAssignmentsLoading) {
    return (
      <main className="min-h-screen bg-black px-4 py-8 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm text-gray-400">読み込み中...</p>
        </div>
      </main>
    );
  }

  if (employeeError || assignmentsError) {
    return (
      <main className="min-h-screen bg-black px-4 py-8 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="rounded bg-red-950 px-4 py-3 text-sm text-red-200">
            {employeeError?.message ??
              assignmentsError?.message ??
              "データの取得に失敗しました"}
          </p>
        </div>
      </main>
    );
  }

  const employee = employeeData?.employee;
  const assignments = assignmentsData?.assignments;

  if (!employee || !assignments) {
    return null;
  }

  const completedAssignments = assignments.filter(
    (assignments) => assignments.completedAt !== null,
  );

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white overflow-y-scroll">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-gray-400">{employee.name}</p>
            <h1 className="mt-1 text-2xl font-bold">完了した教育項目</h1>
          </div>
          <Link
            href={`/training/employees/${employeeId}`}
            className="text-sm text-blue-400 hover:underline"
          >
            従業員詳細へ戻る
          </Link>
        </div>

        <div className="mt-8 space-y-8">
          {completedAssignments.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-700 p-6">
              <p className="text-sm text-gray-500">
                完了した仕事項目はありません
              </p>
            </div>
          ) : (
            categoryOrder.map((category) => {
              const categoryAssignments = completedAssignments.filter(
                (assignment) => assignment.workItem.category === category,
              );

              if (categoryAssignments.length === 0) {
                return null;
              }

              return (
                <section key={category}>
                  <h2 className="mb-3 text-lg font-semibold">
                    {categoryLabels[category]}
                  </h2>

                  <div className="space-y-3">
                    {categoryAssignments.map((assignment) => {
                      const firstCheck = assignment.checks.find(
                        (check) => check.checkNumber === 1,
                      );
                      const secondCheck = assignment.checks.find(
                        (check) => check.checkNumber === 2,
                      );

                      return (
                        <div
                          key={assignment.id}
                          className="rounded-lg border border-gray-700 bg-gray-900 p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <p className="font-medium">
                              {assignment.workItem.title}
                            </p>

                            <span className="rounded bg-green-950 px-2 py-1">
                              習得済み
                            </span>
                          </div>

                          <div className="mt-4 flex flex-col gap-2">
                            <div className="flex items-center gap-3 text-sm">
                              <input
                                type="checkbox"
                                checked={Boolean(firstCheck)}
                                readOnly
                                className="h-4 w-4"
                              />

                              <span className="w-14">1回目</span>

                              <span className="text-gray-300">
                                {firstCheck?.trainerName ?? ""}
                              </span>

                              {firstCheck &&  (
                                <span className="text-xs text-gray-500">{new Date(firstCheck.checkedAt).toLocaleDateString("ja-JP")}</span>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                              <input type="checkbox" checked={Boolean(secondCheck)} readOnly className="w-4 h-4" />
                              <span className="w-14">2回目</span>
                              <span className="text-gray-300">{firstCheck?.trainerName ?? ""}</span>

                              {secondCheck && (
                                <span className="text-xs text-gray-500">
                                  {new Date(secondCheck.checkedAt).toLocaleDateString("ja-JP")}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
};

export default TrainingEmployeeCompletedPage;
