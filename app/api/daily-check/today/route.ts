import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jstDateKey, jstWeekdayKey } from "@/app/daily-check/lib/dateKey";
import { createClient } from "@/utils/supabase/server";


const GET = async () => {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const date = jstDateKey();
    const wk = jstWeekdayKey();

    const tasks = await prisma.dailyTask.findMany({
      where: { isActive: true, [wk]: true, ownerId: user.id },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: { id: true, title: true },
    })

    const checks = await prisma.dailyTaskCheck.findMany({
      where: { date, ownerId: user.id },
      select: { taskId: true },
    });

    const checkedSet = new Set(checks.map((c) => c.taskId));

    return NextResponse.json({
      ok: true,
      date,
      weekday: wk,
      tasks: tasks.map((t) => ({ ...t, checked: checkedSet.has(t.id) }))
    })
  } catch (e: unknown) {
    console.error("daily-check today GET error", e);
    return NextResponse.json({ ok: false, error: "internal error" }, { status: 500 });
  }
}

export { GET }; 