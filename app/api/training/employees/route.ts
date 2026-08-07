import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const createEmployeeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "従業員名を入力してください")
    .max(100, "従業員名は100文字以内で入力してください"),

  joinedAt: z
    .string()
    .date("入社日の形式が正しくありません")
    .nullable()
    .optional(),
});

export const GET = async () => {
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
      console.error(
        "TRAINING_STORE_IDが設定されていません",
      );

      return NextResponse.json(
        { error: "店舗情報が設定されていません" },
        { status: 500 },
      );
    }

    // 3. 店舗に所属する従業員を取得
    const employees =
      await prisma.trainingEmployee.findMany({
        where: {
          storeId,
        },
        select: {
          id: true,
          name: true,
          joinedAt: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: [
          {
            isActive: "desc", // 在籍している従業員を先に表示する
          },
          {
            joinedAt: "desc", // 入社日が新しい従業員を先に表示
          },
          {
            createdAt: "desc", // 入社日がない場合などは登録日が新しい順に表示
          },
        ],
      });

    return NextResponse.json({
      ok: true,
      employees,
    });
  } catch (error) {
    console.error(
      "従業員一覧の取得エラー:",
      error,
    );

    return NextResponse.json(
      { error: "従業員一覧の取得に失敗しました" },
      { status: 500 },
    );
  }
};

export const POST = async (request: Request) => {
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

    // 2. 管理者権限を確認
    const role =
      user.app_metadata?.role ??
      user.user_metadata?.role ??
      "user";

    if (role !== "admin") {
      return NextResponse.json(
        { error: "従業員を登録できるのは管理者だけです" },
        { status: 403 },
      );
    }

    // 3. 店舗IDを取得
    const storeId = process.env.TRAINING_STORE_ID;

    if (!storeId) {
      console.error(
        "TRAINING_STORE_IDが設定されていません",
      );

      return NextResponse.json(
        { error: "店舗情報が設定されていません" },
        { status: 500 },
      );
    }

    // 4. JSONを取得
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "JSONの形式が正しくありません" },
        { status: 400 },
      );
    }

    // 5. 入力内容を検証
    const result = createEmployeeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "入力内容が正しくありません",
          issues: result.error.issues,
        },
        { status: 400 },
      );
    }

    const { name, joinedAt } = result.data;

    // 6. 同じ店舗に同名の従業員がいるか確認
    const existingEmployee =
      await prisma.trainingEmployee.findFirst({
        where: {
          storeId,
          name,
          isActive: true,
        },
        select: {
          id: true,
        },
      });

    if (existingEmployee) {
      return NextResponse.json(
        {
          error:
            "同じ名前の在籍中従業員がすでに登録されています",
        },
        { status: 409 },
      );
    }

    // 7. 従業員を登録
    const employee =
      await prisma.trainingEmployee.create({
        data: {
          storeId,
          name,
          joinedAt: joinedAt
            ? new Date(`${joinedAt}T00:00:00+09:00`)
            : null,
        },
        select: {
          id: true,
          name: true,
          joinedAt: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    return NextResponse.json(
      {
        ok: true,
        employee,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "従業員登録エラー:",
      error,
    );

    return NextResponse.json(
      { error: "従業員の登録に失敗しました" },
      { status: 500 },
    );
  }
};