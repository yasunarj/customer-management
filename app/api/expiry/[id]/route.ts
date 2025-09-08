import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const deleteId = parseInt(params.id, 10);
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

export { DELETE };
