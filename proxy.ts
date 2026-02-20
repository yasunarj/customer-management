import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function proxy(request: NextRequest) { 
  //requestはHTTPリクエスト全体
  const response = await updateSession(request);  
  const pathname = request.nextUrl.pathname;
  
  response.headers.set("x-pathname", pathname);
  
  return response;
}

export const config = {
  matcher: ["/:path*"], // 認証が必要なルートを指定
};
// "/lp:path*" lpサイトはログイン不要のため、matcherから除外

//　学習用　//
// https://owner.example.com/owner-task/list?sort=desc このURLを分解すると
// protocol -> https
// host -> owner.example.com
// pathname -> /owner-task/list
// searchParams -> ?sort=desc