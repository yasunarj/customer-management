import prisma from "./prisma";
import supabaseAdmin from "./supabaseAdmin";
import type { Session } from "@supabase/supabase-js";

type LoginResult =
  | { ok: true; status: 200; session: Session }
  | { ok: false; status: 401; remaining: number }
  | { ok: false; status: 429; retry_after_sec: number };

export const rateLimitLogin = async (params: { email: string, password: string, ip: string; prefix: string; }): Promise<LoginResult> => {
  const { email, password, ip, prefix } = params;

  const key = `${prefix}:${email}:${ip}`;
  const now = new Date();

  const row = await prisma.ownerGateLimit.findUnique({ where: { key } });

  if (row?.lockedUntil && row.lockedUntil > now) {
    const remainSec = Math.ceil((row.lockedUntil.getTime() - now.getTime()) / 1000);
    return { ok: false, status: 429, retry_after_sec: remainSec };
  }

  // Supabase認証
  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    const nextFailed = (row?.failCount ?? 0) + 1;

    if (nextFailed >= 3) {
      const lockedUntil = new Date(now.getTime() + 10 * 60 * 1000);

      await prisma.ownerGateLimit.upsert({
        where: { key },
        create: { key, failCount: 0, lockedUntil },
        update: { failCount: 0, lockedUntil },
      });

      return { ok: false, status: 429, retry_after_sec: 600 };
    }

    await prisma.ownerGateLimit.upsert({
      where: { key },
      create: { key, failCount: nextFailed, lockedUntil: null },
      update: { failCount: nextFailed, lockedUntil: null },
    });

    return { ok: false, status: 401, remaining: 3 - nextFailed }
  }

  await prisma.ownerGateLimit.upsert({
    where: { key },
    create: { key, failCount: 0, lockedUntil: null },
    update: { failCount: 0, lockedUntil: null },
  });

  return { ok: true, session: data.session, status: 200 }
}