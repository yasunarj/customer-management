"use client";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

type UseLogoutOnCloseOptions = {
  enabled?: boolean;
}

export const useLogoutOnClose = ({ enabled = true }: UseLogoutOnCloseOptions = {}) => {
  useEffect(() => {
    const supabase = createClient();
    const handleLogoutOnClose = async () => {
      if (!enabled) return;

      try {
        await supabase.auth.signOut();
        console.log("ブラウザが閉じられたためログアウト");
      } catch (e) {
        console.error("自動ログアウト失敗", e);
      }
    }

    document.addEventListener("visibilitychange", handleLogoutOnClose);

    return () => {
      document.removeEventListener("visibilitychange", handleLogoutOnClose)
    }
  }, [enabled]);
};
