import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jstDateKey, jstWeekdayKey } from "@/app/daily-check/lib/dateKey";


const GET = async () => {
  const date = jstDateKey();
  const wk = jstWeekdayKey();

  const tasks = await prisma.dailyTask.findMany({
    where: { isActive: true, [wk]: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: { id: true, title: true },
  })

  const checks = await prisma.dailyTaskCheck.findMany({
    where: { date },
    select: { taskId: true },
  });

  const checkedSet = new Set(checks.map((c) => c.taskId));

  return NextResponse.json({
    ok: true,
    date,
    weekday: wk,
    tasks: tasks.map((t) => ({ ...t, checked: checkedSet.has(t.id) }))
  })
}

export { GET }; 