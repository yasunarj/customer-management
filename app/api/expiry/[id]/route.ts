import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const GET = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const productId = parseInt(id, 10);
    if (!isNaN(productId)) {
      return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
    }
    const item = await prisma.productExpiry.findUnique({
      where: { id: productId },
    });
    if (!item) {
      return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
    }
    return NextResponse.json({
      ...item,
      expiryDate: item.expiryDate.toISOString(),
    });
  } catch (e) {
    console.error("detail GET error", e);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
};

const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params;
    const deleteId = parseInt(id, 10);
    if (isNaN(deleteId)) {
      return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
    }
    if (req.method !== "DELETE") {
      return NextResponse.json(
        { error: "メソッドが許可されていません" },
        { status: 400 }
      );
    }

    await prisma.productExpiry.delete({
      where: {
        id: deleteId,
      },
    });

    return NextResponse.json({ message: "削除成功" }, { status: 200 });
  } catch (e) {
    console.error("削除失敗", e);
    return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
  }
};

const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    if (req.method !== "PUT") {
      return NextResponse.json(
        { error: "メソッドが許可されていません" },
        { status: 400 }
      );
    }

    const { id } = await params;
    const updateId = parseInt(id, 10);
    if (isNaN(updateId)) {
      return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
    }

    const data = await req.json();
    const res = await prisma.productExpiry.update({
      where: {
        id: updateId,
      },
      data: { ...data, expiryDate: new Date(data.expiryDate) },
    });
    return NextResponse.json(res, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
  }
};

export { GET, DELETE, PUT };
