import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";

const createDailyTodoSchema = z.object({
  title: z.string().trim().min(1, "title is required").
    max(200, "title can be up to 200 characters")
});

const GET = async () => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        {
          ok: false,
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const todos = await prisma.dailyTodo.findMany({
      where: {
        ownerId: user.id,
        completedAt: null,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      ok: true,
      todos,
    });
  } catch (e: unknown) {
    console.error("daily-todo GET error", e);

    return NextResponse.json(
      {
        ok: false,
        error: "internal error",
      },
      { status: 500 },
    );
  }
};

const POST = async (req: Request) => {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const parsed = createDailyTodoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid body", issues: parsed.error.issues }, {
        status: 400
      })
    }

    const data = parsed.data;

    const todo = await prisma.dailyTodo.create({
      data: {
        ownerId: user.id,
        title: data.title
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
      }
    });

    return NextResponse.json({ ok: true, todo }, { status: 201 })
  } catch (e: unknown) {
    console.error("daily-todo POST error", e);
    return NextResponse.json({ ok: false, error: "internal error" }, { status: 500 });
  }
}

export { GET, POST };