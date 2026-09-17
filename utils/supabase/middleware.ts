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

  const pathname = request.nextUrl.pathname;

  // 公開パスは常にスルー
  if (isPublicPath(pathname)) return supabaseResponse;

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user ?? null;

  // ─────────────────────────────────────────────
  // reserve.example.com（または既存ドメイン）側のルール
  // ─────────────────────────────────────────────
  // 認証が必要なページをガード

  if (!user) {
    if (
      pathname.startsWith("/user") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/training") ||
      pathname.startsWith("/daily-check")
    ) {
      const loginUrl = new URL("/auth/login", request.url);

      const nextPath =
        request.nextUrl.pathname + request.nextUrl.search;

      loginUrl.searchParams.set("next", nextPath);

      return NextResponse.redirect(loginUrl);
    }

    return supabaseResponse;
  }

  const userRole = user.app_metadata?.role ?? "user";

  if (pathname.startsWith("/admin") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }

  if (pathname.startsWith("/user") && userRole !== "user") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return supabaseResponse;
}


