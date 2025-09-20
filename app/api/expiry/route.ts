import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { expirySchema } from "@/app/expiry/lib/expirySchema";

const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") ?? "50");

  try {
    const items = await prisma.productExpiry.findMany({
      orderBy: { expiryDate: "asc" },
      take: limit,
      select: {
        id: true,
        gondolaNo: true,
        category: true,
        productName: true,
        expiryDate: true,
        quantity: true,
        manager: true,
      },
    });

    const normalized = items.map((r) => ({
      ...r,
      expiryDate: new Date(r.expiryDate).toString(),
    }));

    return NextResponse.json({ items: normalized, nextCursor: null });
  } catch (e) {
    console.error("GET /api/expiry error", e);
    return NextResponse.json({ error: "failed to fetch" }, { status: 500 });
  }
};

const POST = async (req: Request) => {
  try {
    const contentType = req.headers.get("Content-Type")?.toLowerCase();
    if (contentType !== "application/json") {
      return NextResponse.json(
        { error: "JSON形式で送信してください" },
        { status: 400 }
      );
    }

    const raw = await req.json();
    const parsed = expirySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "入力内容を確認してください",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }
    const created = await prisma.productExpiry.create({
      data: {
        gondolaNo: parsed.data.gondolaNo,
        category: parsed.data.category,
        productName: parsed.data.productName,
        expiryDate: new Date(parsed.data.expiryDate + "T00:00:00Z"),
        quantity: parsed.data.quantity,
        manager: parsed.data.manager || "",
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error("POST /api/expiry/ error", e);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
};

export { GET, POST };
