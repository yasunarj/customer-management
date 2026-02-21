import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

function isPublicPath(pathname: string) {
  return (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname.startsWith("/sitemap")
  );
}


export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const host = request.headers.get("host") ?? "";
  const pathname = request.nextUrl.pathname;

  // 公開パスは常にスルー
  if (isPublicPath(pathname)) return supabaseResponse;

  // *サブドメイン判定
  const isOwnerHost = host.startsWith("owner.");
  // const isReserveHost = host.startsWith("reserve.");


  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user ?? null;

  // ─────────────────────────────────────────────
  // owner.example.com 側のルール
  // ─────────────────────────────────────────────

  if (isOwnerHost) {
    const needsAuth = pathname.startsWith("/owner-task");

    if (needsAuth && !user) {
      const url = new URL("/auth/admin/login", request.url);
      const nextPath = request.nextUrl.pathname + request.nextUrl.search;
      url.searchParams.set("next", nextPath);
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  }

  // ─────────────────────────────────────────────
  // reserve.example.com（または既存ドメイン）側のルール
  // ─────────────────────────────────────────────
  // いまの挙動を維持：/user /admin のみガード

  if (!user) {
    if (
      pathname.startsWith("/user") ||
      pathname.startsWith("/admin")
    ) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return supabaseResponse;
  }

  const userRole = user.user_metadata?.role || "user";

  if (pathname.startsWith("/admin") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }

  if (pathname.startsWith("/user") && userRole !== "user") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return supabaseResponse;
}


