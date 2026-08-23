"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient } from "@/utils/supabase/client";

type CreateEmployeeResponse = {
  ok?: boolean;
  employee?: {
    id: string;
    name: string;
    joinedAt: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  error?: string;
  issues?: Array<{
    message: string;
  }>;
};

const TrainingEmployeeNewPage = () => {
  const router = useRouter();

  const supabase = useMemo(
    () => createClient(),
    [],
  );

  const [userRole, setUserRole] = useState<
    "admin" | "user" | null
  >(null);

  const [isCheckingRole, setIsCheckingRole] =
    useState(true);

  const [name, setName] = useState("");
  const [joinedAt, setJoinedAt] = useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

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

  const isDisabled =
    isSubmitting || !name.trim();

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setErrorMessage("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setErrorMessage(
        "従業員名を入力してください",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "/api/training/employees",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: trimmedName,
            joinedAt: joinedAt || null,
          }),
        },
      );

      const responseData =
        (await response
          .json()
          .catch(() => null)) as
          | CreateEmployeeResponse
          | null;

      if (response.status === 401) {
        const currentPath =
          window.location.pathname;

        router.replace(
          `/auth/login?next=${encodeURIComponent(
            currentPath,
          )}`,
        );
        return;
      }

      if (response.status === 403) {
        setErrorMessage(
          responseData?.error ??
            "従業員を登録できるのは管理者だけです",
        );
        return;
      }

      if (response.status === 409) {
        setErrorMessage(
          responseData?.error ??
            "同じ名前の従業員が登録されています",
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
            "従業員の登録に失敗しました",
        );
        return;
      }

      router.push("/training/employees");
      router.refresh();
    } catch (error) {
      console.error(
        "従業員登録エラー:",
        error,
      );

      setErrorMessage(
        "通信エラーが発生しました。時間をおいて再度お試しください",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingRole) {
    return (
      <main className="h-screen-vh bg-black px-4 py-8 text-white">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm text-gray-400">
            読み込み中...
          </p>
        </div>
      </main>
    );
  }

  if (userRole !== "admin") {
    return (
      <main className="h-screen-vh bg-black px-4 py-8 text-white">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl font-bold">
            登録権限がありません
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            従業員を登録できるのは管理者だけです。
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

  return (
    <main className="h-screen-vh bg-black px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              従業員の新規登録
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              教育管理の対象となる従業員を登録します。
            </p>
          </div>

          <Link
            href="/training/employees"
            className="text-sm text-blue-400 hover:underline"
          >
            一覧へ戻る
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-xl border border-gray-700 bg-gray-900 p-6"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-sm font-medium"
            >
              従業員名
              <span className="ml-1 text-red-400">
                必須
              </span>
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              maxLength={100}
              placeholder="例：田中 太郎"
              autoComplete="off"
              className="rounded border border-gray-700 bg-gray-800 px-3 py-2 outline-none focus:border-blue-500"
            />

            <p className="text-right text-xs text-gray-500">
              {name.length} / 100
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="joinedAt"
              className="text-sm font-medium"
            >
              入社日
              <span className="ml-2 text-xs font-normal text-gray-500">
                任意
              </span>
            </label>

            <input
              id="joinedAt"
              type="date"
              value={joinedAt}
              onChange={(event) =>
                setJoinedAt(event.target.value)
              }
              className="rounded border border-gray-700 bg-gray-800 px-3 py-2 outline-none focus:border-blue-500"
            />

            <p className="text-xs text-gray-500">
              不明な場合は未入力のまま登録できます。
            </p>
          </div>

          {errorMessage && (
            <p className="rounded bg-red-950 px-3 py-2 text-sm text-red-200">
              {errorMessage}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <Link
              href="/training/employees"
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
                ? "登録中..."
                : "従業員を登録"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default TrainingEmployeeNewPage;