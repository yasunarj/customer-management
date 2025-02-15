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

  if (!user) {
    if (
      request.nextUrl.pathname.startsWith("/user") ||
      request.nextUrl.pathname.startsWith("/admin")
    ) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return supabaseResponse;
  }

  const userRole = user.user_metadata?.role || "user";

  if (request.nextUrl.pathname.startsWith("/admin") && userRole !== "admin") {
    console.log("Unauthorized access to /admin, Redirecting to /user/dashboard");
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }

  if(request.nextUrl.pathname.startsWith("/user") && userRole !== "user") {
    console.log("Unauthorized access to /user. Redirecting to /admin/dashboard");
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return supabaseResponse;
}
