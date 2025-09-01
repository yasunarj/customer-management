"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "../ui/dialog";
import { Loader2 } from "lucide-react";
import { useLogoutOnClose } from "@/hooks/useLogoutOnCloes";
const Header = () => {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useLogoutOnClose();

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (!user) {
        setIsAuthenticated(false);
        setUserRole(null);
        if (
          pathname !== "/" &&
          !pathname.startsWith("/auth") &&
          !pathname.startsWith("/lp") &&
          !pathname.startsWith("/safe") &&
          !pathname.startsWith("/expiry")
        ) {
          router.push("/auth/login");
        }
        return;
      }

      const role = user?.user_metadata?.role || "user";
      setUserRole(role);
      setIsAuthenticated(true);

      // ロールに応じたリダイレクト処理
      if (role === "admin" && pathname.startsWith("/user")) {
        router.push("/admin/dashboard");
      } else if (role === "user" && pathname.startsWith("/admin")) {
        router.push("/user/dashboard");
      }
    };

    fetchUserRole();

    // 認証状態が変化したときの処理
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session) {
          setIsAuthenticated(false);
          setUserRole(null);
          if (
            pathname !== "/" &&
            !pathname.startsWith("/auth") &&
            !pathname.startsWith("/lp") &&
            !pathname.startsWith("/safe") &&
            !pathname.startsWith("/expiry")
          ) {
            router.push("/auth/login");
          }
        } else {
          const role = session.user?.user_metadata?.role || "user";
          setUserRole(role);
          setIsAuthenticated(true);

          // ロールに応じたリダイレクト
          if (role === "admin" && pathname.startsWith("/user")) {
            router.push("/admin/dashboard");
          } else if (role === "user" && pathname.startsWith("/admin")) {
            router.push("/user/dashboard");
          }
        }
      }
    );

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, [router, pathname, supabase]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("ログアウトエラー:", error.message);
        alert(`ログアウトに失敗しました: ${error.message}`);
        return;
      }
      router.push("/");
    } catch (e) {
      console.error("予期せぬエラー", e);
      alert("エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="main-header bg-gradient-to-r from-green-800 via-green-500 to-green-700 h-[5dvh]">
        <div className="flex justify-between items-center h-full px-4 sm:px-8 text-white">
          <h2 className="text-sm sm:text-lg font-semibold">
            <Link href="/">セブンイレブンさくら卯の里４丁目店</Link>
          </h2>
          <div className="flex items-center space-x-8 font-semibold">
            {isAuthenticated ? (
              isLoading ? (
                <p>ログアウト中</p>
              ) : (
                <div className="flex gap-2 sm:gap-4 items-center">
                  <p className="text-sm sm:text-md">
                    ({userRole === "admin" ? "管理者" : "ユーザー"})
                  </p>
                  <button
                    onClick={handleLogout}
                    className="text-sm sm:text-lg hover:underline hover:underline-offset-4"
                  >
                    ログアウト
                  </button>
                </div>
              )
            ) : (
              <Link
                href={"/auth/login"}
                className="text-sm sm:text-lg hover:underline hover:underline-offset-4"
              >
                ログイン
              </Link>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isLoading}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">ログアウト中...</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center py-4">
            <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
