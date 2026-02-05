import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const createDailyTaskSchema = z.object({
  title: z.string().trim().min(1, "title is required").max(200, "title can be up to 200 characters"),
  sortOrder: z.coerce.number().int().min(0).optional().default(0),
  onMon: z.boolean().optional().default(true),
  onTue: z.boolean().optional().default(true),
  onWed: z.boolean().optional().default(true),
  onThu: z.boolean().optional().default(true),
  onFri: z.boolean().optional().default(true),
  onSat: z.boolean().optional().default(true),
  onSun: z.boolean().optional().default(true)
})

const GET = async () => {
  const tasks = await prisma.dailyTask.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
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
  try {

    const body = await req.json().catch(() => null);
    const parsed = createDailyTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid body", issues: parsed.error.issues }, { status: 400 });
    }

    const data = parsed.data;

    const task = await prisma.dailyTask.create({
      data: {
        title: data.title,
        sortOrder: data.sortOrder,
        isActive: true,
        onMon: data.onMon,
        onTue: data.onTue,
        onWed: data.onWed,
        onThu: data.onThu,
        onFri: data.onFri,
        onSat: data.onSat,
        onSun: data.onSun,
      }
    });

    return NextResponse.json({ ok: true, task }, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return NextResponse.json({ ok: false, error: "duplicate title" }, { status: 409 })
      }
    }
    console.error("daily-task POST error", e);
    return NextResponse.json({ ok: false, error: "internal error" }, { status: 500 });
  }
}

export { GET, POST };