import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user ?? null;


  if (request.nextUrl.pathname === "/") {
    console.log("Skipping auth check for home page.");
    return supabaseResponse;
  }

  // 🔹 `/auth/login` はそのまま通過
  if (request.nextUrl.pathname.startsWith("/auth/login")) {
    console.log("Skipping auth check for login page.");
    return supabaseResponse;
  }

  // 🔹 `/user` や `/admin` にアクセスする場合はログインチェック
  if (!user && (request.nextUrl.pathname.startsWith("/user") || request.nextUrl.pathname.startsWith("/admin"))) {
    console.log("Redirecting to /auth/login");
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
