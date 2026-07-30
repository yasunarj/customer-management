import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { TrainingCategory } from "@prisma/client";
import prisma from "@/lib/prisma";
import { z } from "zod";

const createWorkItemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "仕事項目名を入力してください")
    .max(100, "仕事項目名は100文字以内で入力してください"),

  category: z.enum([
    "REGISTER",
    "CLEANING",
    "PRODUCT_MANAGEMENT",
    "OTHER",
  ]),

  description: z
    .string()
    .trim()
    .max(2000, "説明は2000文字以内で入力してください")
    .optional(),

  sortOrder: z
    .number()
    .int("並び順は整数で入力してください")
    .min(0, "並び順は0以上で入力してください")
    .default(0),
});

const trainingCategories = Object.values(TrainingCategory);
// Object.valuesはオブジェクトの値だけを配列として取り出すメソッド
// [
//   "REGISTER",
//   "CLEANING",
//   "PRODUCT_MANAGEMENT",
//   "OTHER"
// ]
// となる
const isTrainingCategory = (value: string): value is TrainingCategory => {
  return trainingCategories.includes(value as TrainingCategory)
}
// value is TrainingCategory はこの関数がtrueを返した場合に、valueはTrainingCategoryとして扱って良いということになる


const GET = async (request: Request) => {
  try {
    // 1. ログイン状態を確認
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

    // 2. 使用する店舗IDを取得
    const storeId = process.env.TRAINING_STORE_ID;

    if (!storeId) {
      console.error("TRAINING_STORE_IDが設定されていません");

      return NextResponse.json(
        { error: "店舗情報が設定されていません" },
        { status: 500 },
      );
    }

    const url = new URL(request.url);
    const categoryParam = url.searchParams.get("category");

    let category: TrainingCategory | undefined;

    if (categoryParam) {
      if (!isTrainingCategory(categoryParam)) {
        return NextResponse.json(
          {error: "カテゴリーが正しくありません"},
          {status: 400}
        )
      }

      category = categoryParam;
    }
// 
    // 3. 店舗に紐づく仕事項目を取得
    const workItems = await prisma.trainingWorkItem.findMany({
      where: {
        storeId,
        ...(category ? { category } : {}),
      },
      orderBy: [
        { category: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" },
      ],
    });

    const categoryCounts = {
      REGISTER: 0,
      CLEANING: 0,
      PRODUCT_MANAGEMENT: 0,
      OTHER: 0,
    };

    for (const workItem of workItems) {
      categoryCounts[workItem.category] += 1
    }

    return NextResponse.json({
      ok: true,
      workItems,
      categoryCounts,
    });
  } catch (error) {
    console.error("仕事項目一覧の取得エラー:", error);

    return NextResponse.json(
      { error: "仕事項目の取得に失敗しました" },
      { status: 500 },
    );
  }
}

const POST = async (req: Request) => {
  try {
    // 1. ログイン確認
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 },
      )
    }

    // 2. 管理者権限を確認
    const role = user.app_metadata?.role ?? user.user_metadata?.role ?? "user";

    if (role !== "admin") {
      return NextResponse.json(
        { error: "仕事項目を入力できるのは管理者だけです" },
        { status: 403 },
      )
    }

    // 3. 店舗IDを取得
    const storeId = process.env.TRAINING_STORE_ID;

    if (!storeId) {
      console.error("TRAINING_STORE_IDが設定されていません");

      return NextResponse.json(
        { error: "店舗情報が設定されていません" },
        { status: 500 },
      );
    }

    // 4. リクエスト内容を検証
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "JSON形式が正しくありません" },
        { status: 400 },
      )
    }

    const result = createWorkItemSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "入力内容が正しくありません",
          issues: result.error.issues,
        },
        { status: 400 },
      );
    }

    const { title, category, description, sortOrder } = result.data;

    // 5. 同じ店舗に同名項目がないか確認
    const existingWorkItem =
      await prisma.trainingWorkItem.findFirst({
        where: {
          storeId,
          title,
        },
        select: {
          id: true,
        }
      });

    if (existingWorkItem) {
      return NextResponse.json(
        { error: "同じ名前の仕事項目がすでに登録されています" },
        { status: 409 },
      );
    }

    // 6. 仕事の項目を登録
    const workItem =
      await prisma.trainingWorkItem.create({
        data: {
          storeId,
          title,
          category,
          description: description && description.length > 0 ? description : null,
          sortOrder,
        }
      });

    return NextResponse.json(
      {
        ok: true,
        workItem,
      },
      { status: 201 },
    )
  } catch (e) {
    console.error("仕事項目のエラー:", e);
    return NextResponse.json(
      { error: "仕事項目の登録に失敗しました" },
      { status: 500 },
    )
  }
}

export { GET, POST }