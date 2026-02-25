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
    

  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 })
  }
};

export { POST };