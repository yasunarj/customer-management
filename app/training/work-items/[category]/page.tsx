import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    employeeId: string;
  }>;
};

export const GET = async (
  _request: Request,
  context: RouteContext,
) => {
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

    // 2. 店舗IDを取得
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

    // 3. employeeIdを取得
    const { employeeId } = await context.params;

    // 4. 従業員が現在の店舗に存在するか確認
    const employee =
      await prisma.trainingEmployee.findFirst({
        where: {
          id: employeeId,
          storeId,
        },
        select: {
          id: true,
        },
      });

    if (!employee) {
      return NextResponse.json(
        { error: "従業員が見つかりません" },
        { status: 404 },
      );
    }

    // 5. 割り当て済みの仕事を取得
    const assignments =
      await prisma.trainingAssignment.findMany({
        where: {
          employeeId,
          workItem: {
            storeId,
          },
        },
        select: {
          id: true,
          employeeId: true,
          workItemId: true,
          workItem: {
            select: {
              id: true,
              title: true,
              category: true,
              description: true,
              sortOrder: true,
              isActive: true,
            },
          },
        },
        orderBy: [
          {
            workItem: {
              category: "asc",
            },
          },
          {
            workItem: {
              sortOrder: "asc",
            },
          },
        ],
      });

    return NextResponse.json({
      ok: true,
      assignments,
    });
  } catch (error) {
    console.error(
      "教育項目一覧の取得エラー:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "教育項目一覧の取得に失敗しました",
      },
      { status: 500 },
    );
  }
};