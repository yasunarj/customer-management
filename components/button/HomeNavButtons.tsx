"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const items = [
  { href: "/lp", label: "店舗紹介ページ" },
  { href: "/auth/login", label: "予約商材一覧" },
  { href: "/safe", label: "金庫管理ページ" },
  { href: "/expiry", label: "鮮度管理ページ" },
  { href: "/auth/owner-login", label: "オーナータスク" },
];

const HomeNavButtons = () => {
  const [loadingHref, setLoadingHref] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-8 lg:gap-12 self-center mb-4 w-[200px] sm:w-[480px] lg:w-[860px]">
      {items.map((item) => {
        const isLoading = loadingHref === item.href;
        return (
          <Button
            key={item.href}
            asChild
            disabled={isLoading}
            onClick={() => setLoadingHref(item.href)}
            className={`${cn(
              buttonVariants({ size: "lg", variant: "link" }),
            )}  w-full px-8 py-6 font-bold text-white text-lg rounded-md bg-gradient-to-r from-black via-gray-800 to-gray-600`}
          ><Link href={item.href} aria-busy={isLoading}>
            <span className="inline-flex items-center gap-2">
              {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
              {item.label}
            </span>
            </Link></Button>
        );
      })}
    </div>
  );
};

export default HomeNavButtons;
