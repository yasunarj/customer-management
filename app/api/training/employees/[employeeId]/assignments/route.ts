import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const createAssignmentSchema = z.object({
  workItemId: z.string().min(1, "仕事項目を選択してください")
});

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

export const POST = async (
  request: Request,
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

    // 2. 管理者権限を確認
    const role =
      user.app_metadata?.role ??
      user.user_metadata?.role ??
      "user";

    if (role !== "admin") {
      return NextResponse.json(
        {
          error:
            "仕事を割り当てられるのは管理者だけです",
        },
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

    // 4. employeeIdを取得
    const { employeeId } = await context.params;

    // 5. JSONを取得
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "JSONの形式が正しくありません" },
        { status: 400 },
      );
    }

    // 6. 入力内容を検証
    const result =
      createAssignmentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "入力内容が正しくありません",
          issues: result.error.issues,
        },
        { status: 400 },
      );
    }

    const { workItemId } = result.data;

    // 7. 従業員を確認
    const employee =
      await prisma.trainingEmployee.findFirst({
        where: {
          id: employeeId,
          storeId,
          isActive: true,
        },
        select: {
          id: true,
        },
      });

    if (!employee) {
      return NextResponse.json(
        {
          error:
            "在籍中の従業員が見つかりません",
        },
        { status: 404 },
      );
    }

    // 8. 仕事項目を確認
    const workItem =
      await prisma.trainingWorkItem.findFirst({
        where: {
          id: workItemId,
          storeId,
          isActive: true,
        },
        select: {
          id: true,
        },
      });

    if (!workItem) {
      return NextResponse.json(
        {
          error:
            "有効な仕事項目が見つかりません",
        },
        { status: 404 },
      );
    }

    // 9. すでに割り当て済みか確認
    const existingAssignment =
      await prisma.trainingAssignment.findFirst({
        where: {
          employeeId,
          workItemId,
        },
        select: {
          id: true,
        },
      });

    if (existingAssignment) {
      return NextResponse.json(
        {
          error:
            "この仕事項目はすでに割り当てられています",
        },
        { status: 409 },
      );
    }

    // 10. Assignmentを作成
    const assignment =
      await prisma.trainingAssignment.create({
        data: {
          employeeId,
          workItemId,
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
              sortOrder: true,
              isActive: true,
            },
          },
        },
      });

    return NextResponse.json(
      {
        ok: true,
        assignment,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "教育項目の割り当てエラー:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "教育項目の割り当てに失敗しました",
      },
      { status: 500 },
    );
  }
};