import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const assignmentWorkItemIdsSchema = z.object({
  workItemIds: z.array(z.string().min(1, "仕事項目IDが正しくありません")).min(1, "仕事項目を１つ以上選択してください")
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
          completedAt: true,

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
          
          checks: {
            select: {
              id: true,
              checkNumber: true,
              trainerId: true,
              trainerName: true,
              comment: true,
              checkedAt: true,
            },
            orderBy: {
              checkNumber: "asc",
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
      assignmentWorkItemIdsSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "入力内容が正しくありません",
          issues: result.error.issues,
        },
        { status: 400 },
      );
    }

    const { workItemIds } = result.data;
    const uniqueWorkItemIds = [
      ...new Set(workItemIds),
    ];


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
    const workItems =
      await prisma.trainingWorkItem.findMany({
        where: {
          id: {
            in: uniqueWorkItemIds,
          },
          storeId,
          isActive: true,
        },
        select: {
          id: true,
        },
      });

    if (
      workItems.length !== uniqueWorkItemIds.length
    ) {
      return NextResponse.json(
        {
          error:
            "存在しない、または無効な仕事項目が含まれています",
        },
        { status: 400 },
      );
    }

    // すでに割り当て済みの仕事を取得
    const existingAssignments =
      await prisma.trainingAssignment.findMany({
        where: {
          employeeId,
          workItemId: {
            in: uniqueWorkItemIds,
          },
        },
        select: {
          workItemId: true,
        },
      });

    const existingWorkItemIds = new Set(
      existingAssignments.map(
        (assignment) => assignment.workItemId,
      ),
    );

    // 未割り当てのものだけ残す
    const newWorkItemIds =
      uniqueWorkItemIds.filter(
        (workItemId) =>
          !existingWorkItemIds.has(workItemId),
      );

    if (newWorkItemIds.length === 0) {
      return NextResponse.json(
        {
          error:
            "選択した仕事項目はすべて割り当て済みです",
        },
        { status: 409 },
      );
    }

    // 一括登録
    const createResult =
      await prisma.trainingAssignment.createMany({
        data: newWorkItemIds.map(
          (workItemId) => ({
            employeeId,
            workItemId,
          }),
        ),
      });

    return NextResponse.json(
      {
        ok: true,
        createdCount: createResult.count,
        skippedCount:
          uniqueWorkItemIds.length -
          newWorkItemIds.length,
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

export const DELETE = async (
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
            "仕事の割り当てを解除できるのは管理者だけです",
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
      assignmentWorkItemIdsSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "入力内容が正しくありません",
          issues: result.error.issues,
        },
        { status: 400 },
      );
    }

    const { workItemIds } = result.data;

    const uniqueWorkItemIds = [
      ...new Set(workItemIds),
    ];

    // 7. 従業員が現在の店舗に存在するか確認
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
        {
          error: "従業員が見つかりません",
        },
        { status: 404 },
      );
    }

    // 8. 削除対象のAssignmentを取得
    const assignments =
      await prisma.trainingAssignment.findMany({
        where: {
          employeeId,
          workItemId: {
            in: uniqueWorkItemIds,
          },
          workItem: {
            storeId,
          },
        },
        select: {
          id: true,
          workItemId: true,
        },
      });

    // 選択されたworkItemIdすべてに
    // Assignmentが存在するか確認
    if (
      assignments.length !==
      uniqueWorkItemIds.length
    ) {
      return NextResponse.json(
        {
          error:
            "割り当てされていない仕事項目が含まれています",
        },
        { status: 400 },
      );
    }

    const assignmentIds = assignments.map(
      (assignment) => assignment.id,
    );

    // 9. 対象AssignmentにTrainingCheckがあるか確認
    const checkCount =
      await prisma.trainingCheck.count({
        where: {
          assignmentId: {
            in: assignmentIds,
          },
        },
      });

    if (checkCount > 0) {
      return NextResponse.json(
        {
          error:
            "チェック履歴がある仕事項目が含まれているため、割り当て解除できません",
        },
        { status: 409 },
      );
    }

    // 10. Assignmentを一括削除
    const deleteResult =
      await prisma.trainingAssignment.deleteMany({
        where: {
          id: {
            in: assignmentIds,
          },
        },
      });

    return NextResponse.json({
      ok: true,
      deletedCount: deleteResult.count,
    });
  } catch (error) {
    console.error(
      "教育項目の一括解除エラー:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "教育項目の割り当て解除に失敗しました",
      },
      { status: 500 },
    );
  }
}; 