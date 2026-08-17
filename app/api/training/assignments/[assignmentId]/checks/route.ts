import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";

const createTrainingCheckSchema = z.object({
  comment: z
    .string()
    .trim()
    .max(500, "コメントは500文字以内で入力してください")
    .nullable()
    .optional(),
});

type RouteContext = {
  params: Promise<{
    assignmentId: string;
  }>;
};

export const POST = async (
  request: Request,
  context: RouteContext,
) => {
  try {
    // 1. ログイン確認
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

    // 2. 店舗ID確認
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

    // 3. assignmentId取得
    const { assignmentId } =
      await context.params;

    // 4. JSON取得
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "JSONの形式が正しくありません" },
        { status: 400 },
      );
    }

    // 5. 入力値検証
    const result =
      createTrainingCheckSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "入力内容が正しくありません",
          issues: result.error.issues,
        },
        { status: 400 },
      );
    }

    const { comment } = result.data;

    // 6. Assignment確認
    const assignment =
      await prisma.trainingAssignment.findFirst({
        where: {
          id: assignmentId,
          employee: {
            storeId,
          },
          workItem: {
            storeId,
          },
        },
        select: {
          id: true,
          completedAt: true,
          checks: {
            select: {
              id: true,
              checkNumber: true,
            },
            orderBy: {
              checkNumber: "asc",
            },
          },
        },
      });

    if (!assignment) {
      return NextResponse.json(
        {
          error:
            "割り当て情報が見つかりません",
        },
        { status: 404 },
      );
    }

    // 7. すでに2回チェック済みか確認
    if (assignment.checks.length >= 2) {
      return NextResponse.json(
        {
          error:
            "この仕事項目はすでに習得済みです",
        },
        { status: 409 },
      );
    }

    // 8. 次のcheckNumberを決める
    const nextCheckNumber =
      assignment.checks.length + 1;

    // 9. チェックしたユーザー情報
    const trainerId = user.id;

    const trainerName =
      user.user_metadata?.userName ?? null;

    // 10. TrainingCheck作成
    const trainingCheck =
      await prisma.trainingCheck.create({
        data: {
          assignmentId,
          checkNumber: nextCheckNumber,
          trainerId,
          trainerName,
          comment:
            comment?.trim() || null,
        },
        select: {
          id: true,
          assignmentId: true,
          checkNumber: true,
          trainerId: true,
          trainerName: true,
          comment: true,
          checkedAt: true,
        },
      });

    // 11. 2回目なら習得完了
    if (nextCheckNumber === 2) {
      await prisma.trainingAssignment.update({
        where: {
          id: assignmentId,
        },
        data: {
          completedAt: new Date(),
        },
      });
    }

    return NextResponse.json(
      {
        ok: true,
        check: trainingCheck,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "TrainingCheck登録エラー:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "チェックの登録に失敗しました",
      },
      { status: 500 },
    );
  }
};