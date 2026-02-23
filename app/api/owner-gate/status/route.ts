import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const getClientIp = (req: Request) => {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

const GET = async (req: Request) => {
  const ip = getClientIp(req);
  const key = `owner-gate:${ip}`;

  const row = await prisma.ownerGateLimit.findUnique({ where: { key } });

  const now = new Date();

  if (row?.lockedUntil && row.lockedUntil > now) {
    const remainSec = Math.ceil((row.lockedUntil.getTime() - now.getTime()) / 1000);

    return NextResponse.json({ locked: true, retry_after_sec: remainSec })
  }

  return NextResponse.json({ locked: false });
}

export { GET };