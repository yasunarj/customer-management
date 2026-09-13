import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

const GET = async () => {
  try {
    const supabase = await createClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const latestResult = await prisma.dailyCheckResult.findFirst({
      where: {
        ownerId: user.id,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json({
      ok: true,
      streak: latestResult?.streak ?? 0
    });

  } catch (e: unknown) {
    console.error("daily-check streak GET error", e);
    return NextResponse.json({ ok: false, error: "internal error" }, { status: 500 });
  }
};

export { GET };

