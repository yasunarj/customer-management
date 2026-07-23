import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import supabaseAdmin from "@/lib/supabaseAdmin";

const inviteUserSchema = z.object({
  email: z
    .string()
    .trim()
    .email("有効なメールアドレスを入力してください"),
});

export async function POST(request: Request) {
  try {
    // 1. このAPIを呼んだ人がログインしているか確認
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 },
      );
    }

    // 2. 管理者か確認
    const role =
      user.app_metadata?.role ??
      user.user_metadata?.role ??
      "user";

    if (role !== "admin") {
      return NextResponse.json(
        { error: "管理者権限が必要です" },
        { status: 403 },
      );
    }

    // 3. 入力値を検証
    const body = await request.json();
    const result = inviteUserSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "入力内容が正しくありません",
          issues: result.error.issues,
        },
        { status: 400 },
      );
    }

    const { email } = result.data;

    // 4. 招待メールを送信
    const { data: inviteData, error: inviteError } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/set-password`,
      });

    if (inviteError || !inviteData.user) {
      console.error("招待エラー:", inviteError);

      return NextResponse.json(
        {
          error:
            inviteError?.message ?? "招待メールの送信に失敗しました",
        },
        { status: 400 },
      );
    }

    // 5. 招待したユーザーをuser権限に設定
    const { error: roleError } =
      await supabaseAdmin.auth.admin.updateUserById(
        inviteData.user.id,
        {
          app_metadata: {
            role: "user",
          },
        },
      );

    if (roleError) {
      console.error("権限設定エラー:", roleError);

      return NextResponse.json(
        {
          error:
            "招待は送信されましたが、ユーザー権限の設定に失敗しました",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "招待メールを送信しました",
    });
  } catch (error) {
    console.error("ユーザー招待APIエラー:", error);

    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 },
    );
  }
}