"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const SetPasswordPage = () => {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const establishInviteSession = async () => {
      try {
        setErrorMessage("");

        const hashParams = new URLSearchParams(
          window.location.hash.slice(1),
        );

        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const type = hashParams.get("type");

        if (
          type !== "invite" ||
          !accessToken ||
          !refreshToken
        ) {
          setErrorMessage(
            "招待情報を確認できませんでした。招待メールのリンクをもう一度開いてください",
          );
          return;
        }

        const { error: sessionError } =
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

        if (sessionError) {
          console.error(
            "招待セッション設定エラー:",
            sessionError,
          );

          setErrorMessage(
            "招待リンクが無効または期限切れです。管理者へ再招待を依頼してください",
          );
          return;
        }

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setErrorMessage(
            "招待ユーザーを確認できませんでした。招待メールのリンクをもう一度開いてください",
          );
          return;
        }

        const role =
          user.app_metadata?.role ??
          user.user_metadata?.role;

        if (role !== "user") {
          await supabase.auth.signOut();

          setErrorMessage(
            "この招待アカウントにはユーザー権限が設定されていません",
          );
          return;
        }

        // URLからアクセストークンなどを消す
        window.history.replaceState(
          null,
          "",
          window.location.pathname,
        );
      } catch (error) {
        console.error(
          "招待セッション確認エラー:",
          error,
        );

        setErrorMessage(
          "招待情報の確認中にエラーが発生しました",
        );
      } finally {
        setIsInitializing(false);
      }
    };

    establishInviteSession();
  }, [supabase]);

  const isDisabled =
    isInitializing ||
    isLoading ||
    !password ||
    !passwordConfirmation ||
    password.length < 10;

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== passwordConfirmation) {
      setErrorMessage(
        "確認用パスワードが一致していません",
      );
      return;
    }

    if (password.length < 10) {
      setErrorMessage(
        "パスワードは10文字以上で入力してください",
      );
      return;
    }

    setIsLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setErrorMessage(
          "ログイン情報を確認できませんでした。招待メールのリンクをもう一度開いてください",
        );
        return;
      }

      const { error: updateError } =
        await supabase.auth.updateUser({
          password,
        });

      if (updateError) {
        setErrorMessage(
          `パスワードの設定に失敗しました: ${updateError.message}`,
        );
        return;
      }

      // 初回設定後はいったんログアウトさせる
      await supabase.auth.signOut();

      router.replace(
        "/auth/login?message=password-set",
      );
      router.refresh();
    } catch (error) {
      console.error(error);

      setErrorMessage(
        "通信エラーが発生しました。時間をおいてもう一度お試しください",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-gray-800 p-6"
      >
        <h1 className="text-2xl font-bold">
          パスワード設定
        </h1>

        <p className="mt-2 text-sm text-gray-300">
          ログインに使用するパスワードを設定してください
        </p>

        {isInitializing ? (
          <p className="mt-6 text-sm text-gray-300">
            招待情報を確認しています...
          </p>
        ) : (
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm font-medium"
              >
                パスワード
              </label>

              <div className="flex gap-2">
                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="new-password"
                  placeholder="10文字以上"
                  className="min-w-0 flex-1 rounded bg-gray-700 px-3 py-2"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev,
                    )
                  }
                  className="rounded bg-gray-600 px-3 py-2 text-sm"
                >
                  {showPassword
                    ? "非表示"
                    : "表示"}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="passwordConfirmation"
                className="text-sm font-medium"
              >
                パスワード確認
              </label>

              <input
                id="passwordConfirmation"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={passwordConfirmation}
                onChange={(e) =>
                  setPasswordConfirmation(
                    e.target.value,
                  )
                }
                autoComplete="new-password"
                placeholder="もう一度入力してください"
                className="rounded bg-gray-700 px-3 py-2"
              />
            </div>

            {errorMessage && (
              <p className="rounded bg-red-950 px-3 py-2 text-sm text-red-200">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isDisabled}
              className={`rounded px-4 py-2 text-sm font-medium ${
                isDisabled
                  ? "cursor-not-allowed bg-gray-500"
                  : "bg-blue-700 hover:bg-blue-600"
              }`}
            >
              {isLoading
                ? "設定中..."
                : "パスワードを設定"}
            </button>
          </div>
        )}
      </form>
    </main>
  );
};

export default SetPasswordPage;