import prisma from "./prisma";
import supabaseAdmin from "./supabaseAdmin";

type LoginResult =
  | { ok: true; session: any }
  | { ok: false; status: 401; remaining: number }
  | { ok: false; status: 429; retry_after_sec: number };

export const rateLimitLogin = async (params: { email: string, password: string, ip: string; prefix: string; }): Promise<LoginResult> => {
  const { email, password, ip, prefix } = params;

  const key = `${prefix}:${email}:${ip}`;
  const now = new Date();

  const row = await prisma.ownerGateLimit.findUnique({ where: { key } });

  if (row?.lockedUntil && row.lockedUntil > now) {
    const remainSec = Math.ceil((row.lockedUntil.getTime() - now.getTime()) / 1000 );
    return { ok: false, status: 429, retry_after_sec: remainSec };
  }

  
}