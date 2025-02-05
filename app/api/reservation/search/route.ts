import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const POST = async (req: Request) => {
  try {
    const { name, type } = await req.json();
    if (!name || !type) {
      return NextResponse.json(
        { error: "タイプと名前を入力してください" },
        { status: 400 }
      );
    }

    const response = await prisma.reservation.findMany({
      where: {
        type,
        customer: {
          name: {
            contains: name,
            mode: "insensitive",
          },
        },
      },
      include: {
        customer: true,
      },
    });
    return NextResponse.json({ status: 200, data: response });
  } catch (e) {
    console.error("検索エラー", e);
    return NextResponse.json({ error: "検索に失敗しました" }, { status: 500 });
  }
};

export { POST };
