import { NextResponse } from "next/server";
import supabaseAdmin from "@/lib/supabaseAdmin";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

const getClientIp = (req: Request) => {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

const normalizeEmail = (email: string) => {
  return email.trim().toLowerCase();
}

const POST = async (req: Request) => {
  try {
    const body = await req.json().catch(() => null);
    const emailRaw = body?.email;
    const password = body?.password;

    if (typeof emailRaw !== "string" || typeof password !== "string") {
      return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 })
    }

    const email = normalizeEmail(emailRaw);
    const ip = getClientIp(req);
    const key = `reservation-user:${email}:${ip}`;
    const now = new Date();

    // ロック確認
    const row = await prisma.ownerGateLimit.findUnique({ where: { key } });
    if (row?.lockedUntil && row.lockedUntil > now) {
      const remainSec = Math.ceil((row.lockedUntil.getTime() - now.getTime()) / 1000);
      return NextResponse.json({ ok: false, error: "locked", retry_after_sec: remainSec }, { status: 429 });
    }

    // 認証(サーバー側)
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data.session) {
      // 失敗カウント
      const nextFail = (row?.failCount ?? 0) + 1;

      if (nextFail >= 3) {
        const lockedUntil = new Date(now.getTime() + 10 * 60 * 1000);
        await prisma.ownerGateLimit.upsert({
          where: { key },
          create: { key, failCount: 0, lockedUntil },
          update: { failCount: 0, lockedUntil },
        })
        return NextResponse.json({ ok: false, error: "locked", retry_after_sec: 600 }, { status: 429 })
      }

      await prisma.ownerGateLimit.upsert({
        where: { key },
        create: { key, failCount: nextFail, lockedUntil: null },
        update: { failCount: nextFail, lockedUntil: null },
      });

      return NextResponse.json({ ok: false, error: "login_failed", remaining: 3 - nextFail }, { status: 401 });
    }

    // 成功 -> カウントリセット
    await prisma.ownerGateLimit.upsert({
      where: { key },
      create: { key, failCount: 0, lockedUntil: null },
      update: { failCount: 0, lockedUntil: null },
    });

    return NextResponse.json({ ok: true, session: data.session }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 })
  }
};

export { POST };