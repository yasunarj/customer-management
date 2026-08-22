"use client";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  createdAt: string;
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
    throw new Error(data?.error ?? "従業員情報の取得に失敗しました");
  }

  return data;
};

const TrainingEmployeeDetailPage = () => {
  const [checkingAssignmentId, setCheckingAssignmentId] = useState<
    string | null
  >(null);
  const [checkErrorMessage, setCheckErrorMessage] = useState<string>("");

  const params = useParams<{
    employeeId: string;
  }>();

  const employeeId = params.employeeId;

  const employeeApiUrl = employeeId
    ? `/api/training/employees/${encodeURIComponent(employeeId)}`
    : null;

  const {
    data: employeeData,
    error: employeeError,
    isLoading: isEmployeeLoading,
  } = useSWR<EmployeeResponse>(employeeApiUrl, fetcher);

  const assignmentsApiUrl = employeeId
    ? `/api/training/employees/${encodeURIComponent(employeeId)}/assignments`
    : null;

  const {
    data: assignmentsData,
    error: assignmentsError,
    isLoading: isAssignmentsLoading,
    mutate: mutateAssignments,
  } = useSWR<AssignmentsResponse>(assignmentsApiUrl, fetcher);

  const handleAddCheck = async (assignmentId: string) => {
    setCheckingAssignmentId(assignmentId);
    setCheckErrorMessage("");

    try {
      const response = await fetch(
        `/api/training/assignments/${encodeURIComponent(assignmentId)}/checks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: null,
          }),
        },
      );

      const data = await response.json().catch(() => null);
      if (response.status === 409) {
        setCheckErrorMessage(data?.error ?? "この仕事項目はすでに習得済みです");
        return;
      }
      if (response.status === 401) {
        setCheckErrorMessage("ログイン紹鴎を確認できませんでした");
        return;
      }
      if (!response.ok) {
        setCheckErrorMessage(data?.error ?? "チェックの登録に失敗しました");
        return;
      }
      await mutateAssignments();
    } catch (e) {
      console.error("チェック登録エラー:", e);
      setCheckErrorMessage("通信エラーが発生しました");
    } finally {
      setCheckingAssignmentId(null);
    }
  };

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
              assignmentsError.message ??
              "データの取得に失敗しました"}
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

  const employee = employeeData?.employee;
  const assignments = assignmentsData?.assignments;

  if (!employee || !assignments) {
    return null;
  }

  const incompleteAssignments = assignments?.filter(
    (assignment) => assignment.completedAt === null,
  );

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white overflow-y-scroll">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex gap-4 items-start justify-between">
          <div>
            <p className="text-sm text-gray-400">従業員詳細</p>

            <h1 className="mt-1 text-2xl font-bold">{employee.name}</h1>
          </div>

          <Link
            href="/training/employees"
            className="text-sm text-blue-400 hover:underline"
          >
            一覧へ戻る
          </Link>
        </div>

        <section className="mt-4 rounded-xl border border-gray-700 bg-gray-900 p-4">
          <div className="flex items-center gap-8">
            <div>
              <p className="text-sm text-gray-500">入社日</p>

              <p className="mt-1">
                {employee.joinedAt
                  ? new Date(employee.joinedAt).toLocaleDateString("ja-JP")
                  : "未登録"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">登録日</p>

              <p className="mt-1">
                {new Date(employee.createdAt).toLocaleDateString("ja-JP")}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">最終更新日</p>

              <p className="mt-1">
                {new Date(employee.updatedAt).toLocaleDateString("ja-JP")}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-gray-700 bg-gray-900 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">教育項目</h2>

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

            <Link
              href={`/training/employees/${employee.id}/completed`}
              className="rounded border border-gray-600 px-4 py-2 text-center text-sm text-gray-300 hover:bg-gray-800"
            >
              完了した項目へ
            </Link>
          </div>
          {checkErrorMessage && (
            <p className="mt-4 rounded bg-red-950 px-3 py-2 text-sm text-red-200">
              {checkErrorMessage}
            </p>
          )}

          <div className="mt-6 space-y-8">
            {assignments.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-700 p-6">
                <p className="text-sm text-gray-500">
                  まだ仕事が割り当てられていません。
                </p>
              </div>
            ) : incompleteAssignments.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-700 p-6">
                <p className="text-sm text-gray-500">
                  未習得の仕事項目はありません。
                </p>
              </div>
            ) : (
              categoryOrder.map((category) => {
                const categoryAssignments = incompleteAssignments.filter(
                  (assignment) => assignment.workItem.category === category,
                );

                if (categoryAssignments.length === 0) {
                  return null;
                }

                return (
                  <section key={category}>
                    <h3 className="mb-3 text-lg font-semibold">
                      {categoryLabels[category]}
                    </h3>

                    <div className="space-y-3">
                      {categoryAssignments.map((assignment) => {
                        const checkCount = assignment.checks.length;

                        const isCompleted = assignment.completedAt !== null;

                        const isChecking =
                          checkingAssignmentId === assignment.id;

                        const firstCheck = assignment.checks.find(
                          (check) => check.checkNumber === 1,
                        );

                        const secondCheck = assignment.checks.find(
                          (check) => check.checkNumber === 2,
                        );

                        return (
                          <div
                            key={assignment.id}
                            className="rounded-lg border border-gray-700 bg-gray-800 p-4"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="font-medium">
                                  {assignment.workItem.title}
                                </p>

                                <p className="mt-1 text-sm text-gray-400">
                                  チェック：{checkCount} / 2
                                </p>
                              </div>

                              <Sheet>
                                <SheetTrigger asChild>
                                  <button
                                    type="button"
                                    className="text-xs text-blue-400 hover:underline"
                                  >
                                    詳細を見る
                                  </button>
                                </SheetTrigger>

                                <SheetContent
                                  side="right"
                                  className="w-[90%] overflow-y-auto bg-gray-900 text-white sm:max-w-lg"
                                >
                                  <SheetHeader>
                                    <SheetTitle className="text-left text-xl text-white">
                                      {assignment.workItem.title}
                                    </SheetTitle>
                                  </SheetHeader>

                                  <div className="mt-6 space-y-6">
                                    <div>
                                      <p className="text-sm text-gray-500">
                                        カテゴリー
                                      </p>

                                      <p className="mt-1">
                                        {
                                          categoryLabels[
                                            assignment.workItem.category
                                          ]
                                        }
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-sm text-gray-500">
                                        詳細内容
                                      </p>

                                      <p className="mt-2 whitespace-pre-wrap leading-7 text-gray-200">
                                        {assignment.workItem.description ||
                                          "詳細内容は登録されていません。"}
                                      </p>
                                    </div>
                                  </div>
                                </SheetContent>
                              </Sheet>
                            </div>

                            <div className="mt-4 flex flex-col gap-2">
                              <label className="flex items-center gap-2 text-sm">
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
                                {firstCheck && (
                                  <span className="text-xs text-gray-500">
                                    {new Date(
                                      firstCheck.checkedAt,
                                    ).toLocaleDateString("ja-JP")}
                                  </span>
                                )}
                              </label>

                              <label className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={Boolean(secondCheck)}
                                  readOnly
                                  className="h-4 w-4"
                                />
                                <span className="w-14">2回目</span>
                                <span className="text-gray-300">
                                  {secondCheck?.trainerName ?? ""}
                                </span>
                                {secondCheck && (
                                  <span className="text-xs text-gray-500">
                                    {new Date(
                                      secondCheck.checkedAt,
                                    ).toLocaleDateString("ja-JP")}
                                  </span>
                                )}
                              </label>
                            </div>

                            {!isCompleted && (
                              <button
                                type="button"
                                onClick={() => handleAddCheck(assignment.id)}
                                disabled={isChecking}
                                className="mt-4 rounded bg-blue-700 px-4 py-2 text-sm font-medium hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-600"
                              >
                                {isChecking
                                  ? "登録中..."
                                  : checkCount === 0
                                    ? "チェックを登録"
                                    : "次のチェックを登録"}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default TrainingEmployeeDetailPage;
