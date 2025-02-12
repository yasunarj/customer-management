"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Dialog, DialogContent, DialogTitle, DialogHeader} from "../ui/dialog";
import { Loader2 } from "lucide-react";
const Header = () => {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(!!data.user);
    };
    fetchSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session);

        if (!session  && pathname !== "/" && pathname !== "/auth/adminLogin") {
          router.push("/auth/login");
        }
      }
    );

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, [router, supabase.auth, pathname]);

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
      <div className="bg-gradient-to-r from-green-800 via-green-500 to-green-700 h-[5vh]">
        <div className="flex justify-between items-center h-full px-4 sm:px-8 text-white">
          <h2 className="text-sm sm:text-lg font-semibold">
            <Link href="/">セブンイレブンさくら卯の里４丁目店</Link>
          </h2>
          <div className="flex items-center space-x-8 font-semibold">
            {isAuthenticated ? (
              isLoading ? (
                <p>ログアウト中</p>
              ) : (
                <button
                  onClick={handleLogout}
                  className="text-sm sm:text-lg hover:underline hover:underline-offset-4"
                >
                  ログアウト
                </button>
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

