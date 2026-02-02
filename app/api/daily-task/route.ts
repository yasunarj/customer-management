import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const GET = async () => {
  const tasks = await prisma.dailyTask.findMany({
    orderBy: { sortOrder: "asc", createdAt: "asc" },
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

  return NextResponse.json({ ok: true, tasks });
};

export { GET };