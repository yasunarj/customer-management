import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { jstDateKey } from "@/app/daily-check/lib/dateKey";
import { createClient } from "@/utils/supabase/server";

const bodySchema = z.object({
  taskId: z.string().trim().min(1, "taskId is required"),
})

const POST = async (req: Request) => {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json().catch(() => null);
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "invalid body", issues: parsed.error.issues }, { status: 400 })
    }

    const { taskId } = parsed.data;
    const date = jstDateKey();

    const task = await prisma.dailyTask.findFirst({
      where: {
        id: taskId,
        ownerId: user.id,
      },
      select: {
        id: true,
      }
    });

    if (!task) {
      return NextResponse.json(
        { ok: false, error: "task not found" },
        { status: 404 }
      )
    }

    const existing = await prisma.dailyTaskCheck.findFirst({
      where: {
        ownerId: user.id,
        taskId,
        date,
      },
      select: {
        id: true,
      }
    });

    if (existing) {
      await prisma.dailyTaskCheck.delete({
        where: {
          id: existing.id
        }
      });

      return NextResponse.json({
        ok: true,
        checked: false,
        taskId,
        date,
      });
    }

    await prisma.dailyTaskCheck.create({
      data: {
        ownerId: user.id,
        taskId,
        date,
      }
    });

    return NextResponse.json({
      ok: true,
      checked: true,
      taskId,
      date,
    });
  } catch (e: unknown) {
    console.error("daily-check toggle POST error", e);

    return NextResponse.json(
      { ok: false, error: "internal error" },
      { status: 500 },
    )
  }
}

export { POST };