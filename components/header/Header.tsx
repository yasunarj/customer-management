"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
const Header = () => {
  const supabase = createClient();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    fetchSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session);

        if (!session) {
          router.push("/auth/login");
        }
      }
    );

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("ログアウトエラー:", error.message);
      setIsLoading(false);
    } else {
      alert("ログアウトしました");
      setIsLoading(false);
    } 
  };
  return (
    <div className="bg-gradient-to-r from-green-800 via-green-500 to-green-700 h-[5vh]">
      <div className="flex justify-between items-center h-full px-4 sm:px-8 text-white">
        <h2 className="text-sm sm:text-lg font-semibold">
          <Link href="/">セブンイレブンさくら卯の里４丁目店</Link>
        </h2>
        <div className="flex items-center space-x-8 font-semibold">
          {isAuthenticated ? (
            isLoading ? (<p>ログアウト中</p>) : (
            <button
              onClick={handleLogout}
              className="text-sm sm:text-lg hover:underline hover:underline-offset-4"
            >
              ログアウト
            </button> )
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
  );
};

export default Header;
