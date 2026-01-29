import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jstDateKey } from "@/lib/dateKey";

const GET = async () => {
  const date = jstDateKey();

  const tasks = await prisma.dailyTask.findMany({
    where: { isActive: true },
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
    tasks: tasks.map((t) => ({ ...t, checked: checkedSet.has(t.id) }))
  })
}

export { GET }; 