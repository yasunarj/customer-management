import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function proxy(request: NextRequest) {
  const response = await updateSession(request);
  // return await updateSession(request);

  const pathname = request.nextUrl.pathname;
  response.headers.set("x-pathname", pathname);
  
  return response;
}

export const config = {
  matcher: ["/user/:path*", "/admin/:path*"], // 認証が必要なルートを指定
};
// "/lp:path*" lpサイトはログイン不要のため、matcherから除外