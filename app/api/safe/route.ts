import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const POST = async (req: Request) => {
  try {
    // メソッドのチェック
    if (req.method !== "POST") {
      return NextResponse.json(
        { error: "メソッドが許可されていません" },
        { status: 405 }
      );
    }

    // テキストタイプのチェック
    const contentType = req.headers.get("Content-Type")?.toLowerCase();
    if (contentType !== "application/json") {
      return NextResponse.json(
        { error: "JSON形式で送信してください" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const newSafeCheck = await prisma.safeCheck.create({
      data: body,
    });

    return NextResponse.json(newSafeCheck, { status: 201 });
  } catch (e) {
    console.error("server error", e);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
};

export { POST };
