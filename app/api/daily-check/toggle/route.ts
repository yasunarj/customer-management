import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jstDateKey } from "@/lib/dateKey";

const POST = async (req: Request) => {
  const body = await req.json().catch(() => null);
  const taskId = body.taskId;
  const checked = body.checked;

  if (!taskId || typeof checked === "boolean") {
    return NextResponse.json({ ok: false, error: "taskId/checked is required" }, { status: 400 });
  }

  const date = jstDateKey();

  if (checked) {
    await prisma.dailyTaskCheck.upsert({
      where: { date_taskId: { date, taskId } },
      update: { checkedAt: new Date() },
      create: { date, taskId },
    })
  } else {
    await prisma.dailyTaskCheck.deleteMany({
      where: { date, taskId },
    })
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

export { POST };