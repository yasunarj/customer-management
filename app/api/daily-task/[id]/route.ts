import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";

const updateDailyTaskSchema = z.object({
  title: z.string().trim().min(1, "1文字以上で入力してください").max(200, "200文字以内で入力してください").optional(),
  sortOrder: z.coerce.number().int().min(0, "0以上で入力してください").optional(),
  isActive: z.boolean().optional(),
  onMon: z.boolean().optional(),
  onTue: z.boolean().optional(),
  onWed: z.boolean().optional(),
  onThu: z.boolean().optional(),
  onFri: z.boolean().optional(),
  onSat: z.boolean().optional(),
  onSun: z.boolean().optional(),
}).refine((v) => Object.keys(v).length > 0, { message: "No fields to update" });

const PATCH = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
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
    const body = await req.json().catch(() => null);
    const parsed = updateDailyTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid body", issues: parsed.error.issues }, { status: 400 });
    }

    const existing = await prisma.dailyTask.findFirst({ 
      where: { id, ownerId: user.id },
      select: { id: true, }
    });

    if (!existing) {
      return NextResponse.json({ ok: false, error: "not found"}, { status: 404});
    }

    const data = parsed.data;

    const task = await prisma.dailyTask.update({
      where: { id },
      data,
      select: {
        id: true,
        ownerId: true,
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
    })

    return NextResponse.json({ ok: true, task }, { status: 200 });
  } catch (e: unknown) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
      } else if (e.code === "P2002") {
        return NextResponse.json({ ok: false, error: "duplicate title" }, { status: 409 });
      }
    }
    console.error("daily-task PATCH error", e);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
};

export { PATCH };