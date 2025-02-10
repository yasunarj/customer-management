import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

const POST = async (req: Request) => {
  try {
    const { name, year, type } = await req.json();
    if (!type) {
      return NextResponse.json(
        { error: "タイプと名前を入力してください" },
        { status: 400 }
      );
    }
    if (!name && !year) {
      return NextResponse.json(
        { error: "西暦または名前を入力してください" },
        { status: 400 }
      );
    }

    const whereCondition: Prisma.ReservationWhereInput = {
      type,
      ...(name && {
        customer: { name: { contains: name, mode: "insensitive" } },
      }),
      ...(year && {
        deliveryDate: {
          gte: new Date(`${Number(year)}-01-01`),
          lt: new Date(`${Number(year) + 1}-01-01`)
        },
      }),
    };

    const response = await prisma.reservation.findMany({
      where: whereCondition,
      include: {
        customer: true,
      },
      orderBy: { deliveryDate: "desc" }
    });
    return NextResponse.json({ status: 200, data: response });
  } catch (e) {
    console.error("検索エラー", e);
    return NextResponse.json({ error: "検索に失敗しました" }, { status: 500 });
  }
};

export { POST };
