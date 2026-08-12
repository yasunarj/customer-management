import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    employeeId: string;
    assignmentId: string;
  }>;
};

export const DELETE = async (
  _request: Request,
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

    // 2. admin権限確認
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

    // 3. 店舗ID取得
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

    // 4. URLからID取得
    const {
      employeeId,
      assignmentId,
    } = await context.params;

    // 5. Assignmentが存在するか確認
    const assignment =
      await prisma.trainingAssignment.findFirst({
        where: {
          id: assignmentId,
          employeeId,
          employee: {
            storeId,
          },
          workItem: {
            storeId,
          },
        },
        select: {
          id: true,
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

    // 6. TrainingCheckが付いているか確認
    const checkCount =
      await prisma.trainingCheck.count({
        where: {
          assignmentId,
        },
      });

    if (checkCount > 0) {
      return NextResponse.json(
        {
          error:
            "チェック履歴がある仕事は割り当て解除できません",
        },
        { status: 409 },
      );
    }

    // 7. Assignmentを削除
    await prisma.trainingAssignment.delete({
      where: {
        id: assignmentId,
      },
    });

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error(
      "仕事の割り当て解除エラー:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "仕事の割り当て解除に失敗しました",
      },
      { status: 500 },
    );
  }
};