"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";

type TrainingCategory =
  | "REGISTER"
  | "CLEANING"
  | "PRODUCT_MANAGEMENT"
  | "OTHER";

type TrainingWorkItem = {
  id: string;
  title: string;
  category: TrainingCategory;
  sortOrder: number;
  isActive: boolean;
};

type WorkItemsResponse = {
  ok: boolean;
  workItems: TrainingWorkItem[];
  error?: string;
};

type Employee = {
  id: string;
  name: string;
};

type EmployeeResponse = {
  ok: boolean;
  employee: Employee;
  error?: string;
};

type AssignmentResponse = {
  ok?: boolean;
  error?: string;
  issues?: Array<{
    message: string;
  }>;
};

type Assignment = {
  id: string;
  employeeId: string;
  workItemId: string;
  workItem: {
    id: string;
    title: string;
    category: TrainingCategory;
    sortOrder: number;
    isActive: boolean;
  };
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

const TrainingEmployeeAssignPage = () => {
  const router = useRouter();

  const params = useParams<{
    employeeId: string;
  }>();

  const employeeId = params.employeeId;

  const supabase = useMemo(() => createClient(), []);

  const [userRole, setUserRole] = useState<"admin" | "user" | null>(null);

  const [isCheckingRole, setIsCheckingRole] = useState(true);

  const [selectedWorkItemIds, setSelectedWorkItemIds] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const {
    data: employeeData,
    error: employeeError,
    isLoading: isEmployeeLoading,
  } = useSWR<EmployeeResponse>(
    employeeId
      ? `/api/training/employees/${encodeURIComponent(employeeId)}`
      : null,
    fetcher,
  );

  const {
    data: workItemsData,
    error: workItemsError,
    isLoading: isWorkItemsLoading,
  } = useSWR<WorkItemsResponse>("/api/training/work-items", fetcher);

  const {
    data: assignmentsData,
    error: assignmentsError,
    isLoading: isAssignmentsLoading,
  } = useSWR<AssignmentsResponse>(
    employeeId
      ? `/api/training/employees/${encodeURIComponent(employeeId)}/assignments`
      : null,
    fetcher,
  );

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
        user.app_metadata?.role ?? user.user_metadata?.role ?? "user";

      setUserRole(role === "admin" ? "admin" : "user");

      setIsCheckingRole(false);
    };

    checkRole();
  }, [supabase]);

  const assignedWorkItemIds = new Set(
    assignmentsData?.assignments.map((assignment) => assignment.workItemId) ??
      [],
  );

  const handleToggleWorkItem = (workItemId: string) => {
    setSelectedWorkItemIds((currentIds) => {
      if (currentIds.includes(workItemId)) {
        return currentIds.filter((id) => id !== workItemId);
      }

      return [...currentIds, workItemId];
    });
  };

  const handleSubmit = async () => {
    if (selectedWorkItemIds.length === 0) {
      setErrorMessage("仕事項目を選択してください");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `/api/training/employees/${encodeURIComponent(employeeId)}/assignments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workItemIds: selectedWorkItemIds,
          }),
        },
      );

      const responseData = (await response
        .json()
        .catch(() => null)) as AssignmentResponse | null;

      if (response.status === 401) {
        router.replace(
          `/auth/login?next=${encodeURIComponent(window.location.pathname)}`,
        );
        return;
      }

      if (response.status === 403) {
        setErrorMessage(
          responseData?.error ?? "仕事を割り当てられるのは管理者だけです",
        );
        return;
      }

      if (response.status === 409) {
        setErrorMessage(
          responseData?.error ?? "この仕事項目はすでに割り当てられています",
        );
        return;
      }

      if (response.status === 400) {
        setErrorMessage(
          responseData?.issues?.[0]?.message ??
            responseData?.error ??
            "入力内容を確認してください",
        );
        return;
      }

      if (!response.ok || !responseData?.ok) {
        setErrorMessage(responseData?.error ?? "仕事の割り当てに失敗しました");
        return;
      }

      router.push(`/training/employees/${employeeId}`);

      router.refresh();
    } catch (error) {
      console.error("仕事の割り当てエラー:", error);

      setErrorMessage("通信エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingRole || isEmployeeLoading || isWorkItemsLoading || isAssignmentsLoading) {
    return (
      <main className="min-h-screen bg-black px-4 py-8 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="text-gray-400">読み込み中...</p>
        </div>
      </main>
    );
  }

  if (employeeError || workItemsError || assignmentsError) {
    return (
      <main className="min-h-screen bg-black px-4 py-8 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="rounded bg-red-950 p-4 text-red-200">
            {employeeError?.message ?? workItemsError?.message ?? assignmentsError?.message}
          </p>
        </div>
      </main>
    );
  }

  if (userRole !== "admin") {
    return (
      <main className="min-h-screen bg-black px-4 py-8 text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold">割り当て権限がありません</h1>

          <Link
            href={`/training/employees/${employeeId}`}
            className="mt-6 inline-block text-blue-400 hover:underline"
          >
            従業員詳細へ戻る
          </Link>
        </div>
      </main>
    );
  }

  const employee = employeeData?.employee;

  const workItems =
    workItemsData?.workItems.filter((workItem) => workItem.isActive) ?? [];

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-gray-400">{employee?.name}</p>

            <h1 className="mt-1 text-2xl font-bold">仕事を割り当てる</h1>
          </div>

          <Link
            href={`/training/employees/${employeeId}`}
            className="text-sm text-blue-400 hover:underline"
          >
            詳細へ戻る
          </Link>
        </div>

        <section className="mt-8 rounded-xl border border-gray-700 bg-gray-900 p-6">
          <label htmlFor="workItem" className="text-sm font-medium">
            覚える仕事
          </label>

          <div className="mt-6 space-y-8">
            {categoryOrder.map((category) => {
              const categoryWorkItems = workItems.filter(
                (workItem) => workItem.category === category,
              );

              if (categoryWorkItems.length === 0) {
                return null;
              }

              return (
                <section key={category}>
                  <h2 className="mb-3 text-lg font-semibold">
                    {categoryLabels[category]}
                  </h2>

                  <div className="space-y-2">
                    {categoryWorkItems.map((workItem) => {
                      const isAlreadyAssigned = assignedWorkItemIds.has(
                        workItem.id,
                      );
                      const isChecked =
                        isAlreadyAssigned ||
                        selectedWorkItemIds.includes(workItem.id);

                      return (
                        <label
                          key={workItem.id}
                          className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${
                            isAlreadyAssigned
                              ? "border-green-900 bg-green-950/30"
                              : "cursor-pointer border-gray-700 bg-gray-800 hover:border-gray-500"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={isAlreadyAssigned}
                            onChange={() => handleToggleWorkItem(workItem.id)}
                            className="h-4 w-4"
                          />

                          <div>
                            <span>{workItem.title}</span>
                            {isAlreadyAssigned && (
                              <p className="mt-1 text-xs text-green-400">
                                割り当て済み
                              </p>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          {errorMessage && (
            <p className="mt-4 rounded bg-red-950 px-3 py-2 text-sm text-red-200">
              {errorMessage}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <Link
              href={`/training/employees/${employeeId}`}
              className="rounded bg-gray-700 px-4 py-2 text-sm hover:bg-gray-600"
            >
              キャンセル
            </Link>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || selectedWorkItemIds.length === 0}
              className={`rounded px-4 py-2 text-sm font-medium ${
                isSubmitting || selectedWorkItemIds.length === 0
                  ? "cursor-not-allowed bg-gray-600 text-gray-400"
                  : "bg-blue-700 hover:bg-blue-600"
              }`}
            >
              {isSubmitting
                ? "割り当て中..."
                : `${selectedWorkItemIds.length}件を割り当てる`}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default TrainingEmployeeAssignPage;
