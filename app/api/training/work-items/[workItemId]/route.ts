import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { TrainingCategory } from "@prisma/client";
import { z } from "zod";
import prisma from "@/lib/prisma";

const updateWorkItemSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "仕事項目名を入力してください")
      .max(100, "仕事項目名は100文字以内で入力してください")
      .optional(),

    category: z.nativeEnum(TrainingCategory).optional(),

    description: z
      .string()
      .trim()
      .max(2000, "説明は2000文字以内で入力してください")
      .optional(),

    sortOrder: z
      .number()
      .int("並び順は整数で入力してください")
      .min(0, "並び順は0以上で入力してください")
      .optional(),

    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "更新する内容がありません",
    },
  );

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

const PATCH = async (request: Request, context: RouteContext) => {
  try {
    // 1. ログイン状態を確認
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 },
      );
    }

    // 2. 管理者権限を確認
    const role = user.app_metadata?.role ?? user.user_metadata?.role ?? "user";

    if (role !== "admin") {
      return NextResponse.json(
        { error: "仕事項目を更新できるのは管理者だけです" },
        { status: 403 },
      );
    }

    // 3. 店舗IDを取得
    const storeId = process.env.TRAINING_STORE_ID;

    if (!storeId) {
      console.error(
        "TRAINING_STORE_IDが設定されていません"
      );

      return NextResponse.json(
        { error: "店舗情報が設定されていません" },
        { status: 500 },
      );
    }

    // 4. URLから仕事項目IDを取得
    const { workItemId } = await context.params;

    // 5. JSONを取得
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "JSON形式が正しくありません" }, { status: 400 })
    }

    // 6. 入力内容を検証
    const result = updateWorkItemSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "入力内容が正しくありません", issues: result.error.issues }, { status: 400 })
    }

    // 7. 対象データが現在の店舗に存在するか確認
    const existingWorkItem = await prisma.trainingWorkItem.findFirst({
      where: {
        id: workItemId,
        storeId,
      },
      select: {
        id: true,
        title: true,
      }
    });

    if (!existingWorkItem) {
      return NextResponse.json(
        { error: "仕事項目が見つかりません" },
        { status: 404 },
      )
    }

    const {
      title,
      category,
      description,
      sortOrder,
      isActive,
    } = result.data;

    // 8. titleを変更する場合は重複を確認
    if (
      title !== undefined && title !== existingWorkItem.title
    ) {
      const duplicateWorkItem = await prisma.trainingWorkItem.findFirst({
        where: {
          storeId,
          title,
          id: {
            not: workItemId,  // この部分の意味がわからない
          }
        },
        select: {
          id: true,
        }
      });

      if (duplicateWorkItem) {
        return NextResponse.json(
          {
            error: "同じ名前の仕事項目がすでに登録されています",
          },
          { status: 409 },
        );
      }
    }

    // 9. 更新
    const workItem = await prisma.trainingWorkItem.update({
      where: { id: workItemId },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(description !== undefined ? { description: description.length > 0 ? description : null } : {}),
        ...(sortOrder !== undefined ? { sortOrder } : {}),
        ...(isActive !== undefined ? { isActive } : {})
      },
      select: {
        id: true,
        title: true,
        category: true,
        description: true,
        sortOrder: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      ok: true,
      workItem
    });
  } catch (e) {
    console.error("仕事項目の更新エラー:", e);

    return NextResponse.json(
      { error: "仕事項目の更新に失敗しました" },
      { status: 500 },
    )
  }
}

export { GET, PATCH };