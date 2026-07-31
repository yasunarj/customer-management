import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ workItemId: string }>;
}

const GET = async (_request: Request, context: RouteContext) => {
  try {
    // 1. ログインの確認
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "ログインが必要です" }, { status: 401 })
    }

    // 2. 店舗IDを取得
    const storeId = process.env.TRAINING_STORE_ID;

    if (!storeId) {
      console.error("TRAINING_STORE_IDが設定されていません");
      return NextResponse.json({ error: "店舗情報が設定されていません" }, { status: 500 })
    };

    // 3. URLから仕事項目IDを取得
    const { workItemId } = await context.params;

    // 4. 対象の仕事項目を1件取得
    const workItem = await prisma.trainingWorkItem.findFirst({
      where: {
        id: workItemId,
        storeId,
      },
      select: {
        id: true,
        title: true,
        category: true,
        description: true,
        sortOrder: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!workItem) {
      return NextResponse.json({ error: "仕事項目が見つかりません" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, workItem });
  } catch (e) {
    console.error("仕事項目の取得エラー:", e);

    return NextResponse.json({ error: "仕事項目の取得に失敗しました" }, { status: 500 });
  }
};

export { GET };