import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const GET = async () => {
  const tasks = await prisma.dailyTask.findMany({
    orderBy: [{ sortOrder: "asc"}, { createdAt: "asc" }],
    select: {
      id: true,
      title: true,
      sortOrder: true,
      isActive: true,
      onMon: true,
      onTue: true,
      onWed: true,
      onThu: true,
      onFri: true,
      onSat: true,
      onSun: true,
    }
  });
  console.log("tasks", tasks);

  return NextResponse.json({ ok: true, tasks });
};

const POST = async (req: Request) => {
  const body = await req.json().catch(() => null);

  if (!body?.title)
}

export { GET, POST };