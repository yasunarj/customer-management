import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const getClientIp = (req: Request) => { 
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

const POST = async (req: Request) => {
  try {
    const body = await req.json().catch(() => null);
    const password = body?.password;

    if (typeof password !== "string") {
      return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
    }

    const expected = process.env.OWNER_TASK_PASSWORD;
    if (!expected) {
      return NextResponse.json({ ok: false, error: "server_not_configured" }, { status: 500 });
    }

    const ip = getClientIp(req);
    const key = `owner-gate:${ip}`;
    const now = new Date();

    // 現在の状態を取得する
    const row = await prisma.ownerGateLimit.findUnique({ where: { key } });

    // ロック中ならブロック
    if (row?.lockedUntil && row.lockedUntil.getTime() > now.getTime()) {
      const remainSec = Math.ceil((row.lockedUntil.getTime() - now.getTime()) / 1000);
      return NextResponse.json({ ok: false, error: "locked", retry_after_sec: remainSec }, { status: 429 })
    }

    // パスワードが合っていた場合
    if (password === expected) {
      await prisma.ownerGateLimit.upsert({
        where: { key },
        create: { key, failCount: 0, lockedUntil: null },
        update: { failCount: 0, lockedUntil: null },
      })
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // 不正解だった場合
    const currentFail = row?.failCount ?? 0;
    const nextFail = currentFail + 1;

    if (nextFail >= 3) {
      const lockedUntil = new Date(now.getTime() + 10 * 60 * 1000);
      // ロック発動 (failCountは0に戻す。3のままでも良い)
      await prisma.ownerGateLimit.upsert({
        where: { key },
        create: { key, failCount: 0, lockedUntil }, // 
        update: { failCount: 0, lockedUntil },
      });

      return NextResponse.json({ ok: false, error: "locked", retry_after_sec: 10 * 60 }, { status: 429 });
    }

    await prisma.ownerGateLimit.upsert({
      where: { key },
      create: { key, failCount: nextFail, lockedUntil: null },
      update: { failCount: nextFail, lockedUntil: null },
    })

    return NextResponse.json(
      { ok: false, error: "wrong_password", remaining: 3 - nextFail },
      { status: 401 }
    )
  } catch {
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}

export { POST };