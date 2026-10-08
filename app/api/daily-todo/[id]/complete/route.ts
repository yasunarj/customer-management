import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

const POST = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.dailyTodo.findFirst({
      where: { id, ownerId: user.id },
      select: { id: true, completedAt: true }
    });

    if (!existing) {
      return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
    }

    if (existing.completedAt) {
      return NextResponse.json({ ok: true, alreadyCompleted: true })
    }

    const result = await prisma.dailyTodo.updateMany({
      where: { id, ownerId: user.id, completedAt: null },
      data: {
        completedAt: new Date()
      },
    });

    if (result.count === 0) {
      return NextResponse.json({
        ok: true,
        alreadyCompleted: true,
      });
    }

    return NextResponse.json({ ok: true, alreadyCompleted: false });
  } catch (e: unknown) {
    console.error("daily-todo POST complete error", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export { POST };