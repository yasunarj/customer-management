"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const items = [
  { href: "/lp", label: "店舗紹介ページ", requiresAuth: false },
  {
    href: "/auth/login",
    label: "予約商材一覧",
    authType: "dashboard",
    requiresAuth: true,
  },
  { href: "/safe", label: "金庫管理ページ", requiresAuth: false },
  { href: "/expiry", label: "鮮度管理ページ", requiresAuth: false },
  {
    href: "/daily-check",
    label: "デイリータスク",
    authType: "direct",
    requiresAuth: true,
  },
  { href: "/training", label: "教育管理", requiresAuth: true },
];

const HomeNavButtons = () => {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loadingHref, setLoadingHref] = useState<string | null>(null);

  const handleAuthNavigation = async (item: (typeof items)[number]) => {
    setLoadingHref(item.href);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const nextPath = item.authType === "direct" ? item.href : undefined;

      router.push(
        nextPath
          ? `/auth/login?next=${encodeURIComponent(nextPath)}`
          : "/auth/login",
      );

      return;
    }

    if (item.authType === "direct") {
      router.push(item.href);
      return;
    }

    const role = user.app_metadata?.role ?? user.user_metadata?.role ?? "user";

    if (role === "admin") {
      router.push("/admin/dashboard");
      return;
    }

    router.push("/user/dashboard");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-8 lg:gap-12 self-center mb-4 w-[200px] sm:w-[480px] lg:w-[860px]">
      {items.map((item) => {
        const isLoading = loadingHref === item.href;
        const requiresAuth = Boolean(item.authType);

        if (requiresAuth) {
          return (
            <Button
              key={item.href}
              disabled={isLoading}
              onClick={() => handleAuthNavigation(item)}
              className={`${cn(
                buttonVariants({ size: "lg", variant: "link" }),
              )} w-full px-8 py-6 font-bold text-white text-lg rounded-md bg-gradient-to-r from-black via-gray-800 to-gray-600`}
            >
              <span className="inline-flex items-center gap-2">
                {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                {item.label}
                {item.requiresAuth && (
                  <Lock className="h-4 w-4 opacity-70" aria-label="ログインが必要" />
                )}
              </span>
            </Button>
          );
        }

        return (
          <Button
            key={item.href}
            asChild
            disabled={isLoading}
            onClick={() => setLoadingHref(item.href)}
            className={`${cn(
              buttonVariants({ size: "lg", variant: "link" }),
            )}  w-full px-8 py-6 font-bold text-white text-lg rounded-md bg-gradient-to-r from-black via-gray-800 to-gray-600`}
          >
            <Link href={item.href} aria-busy={isLoading}>
              <span className="inline-flex items-center gap-2">
                {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                {item.label}
                {item.requiresAuth && (
                  <Lock className="h-4 w-4 opacity-70" aria-label="ログインが必要" />
                )}
              </span>
            </Link>
          </Button>
        );
      })}
    </div>
  );
};

export default HomeNavButtons;
