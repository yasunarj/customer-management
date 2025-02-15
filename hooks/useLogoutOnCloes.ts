"use client";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export const useLogoutOnClose = () => {
  useEffect(() => {
    const supabase = createClient();
    const handleLogoutOnClose = async () => {
      try {
        await supabase.auth.signOut();
        console.log("ブラウザが閉じられたためろログアウト");
      } catch(e) {
        console.error("自動ログアウト失敗", e);
      }
    }

    window.addEventListener("beforeunload", handleLogoutOnClose);

    return () => {
      window.removeEventListener("beforeunload", handleLogoutOnClose)
    }
  }, []);
};
