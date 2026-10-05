import prisma from "@/lib/prisma";

type ContactRateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSec: number };

export const checkContactRateLimit = async (ip: string): Promise<ContactRateLimitResult> => {
  const now = new Date();
  const windowMs = 10 * 60 * 1000;
  const maxCount = 5;

  const key = `contact:${ip}`;

  const row = await prisma.contactRateLimit.findUnique({
    where: { key },
  });

  // 初回
  if (!row) {
    await prisma.contactRateLimit.create({
      data: {
        key,
        sendCount: 1,
        windowStart: now,
      },
    });

    return { allowed: true };
  }

  const windowEnd = new Date(row.windowStart.getTime() + windowMs);

  // 10分を超えていたら新しい時間枠にリセット
  if (now > windowEnd) {
    await prisma.contactRateLimit.update({
      where: { key },
      data: {
        sendCount: 1,
        windowStart: now,
      },
    });

    return { allowed: true };
  }

  // 10分以内にすでに送っている
  if (row.sendCount >= maxCount) {
    const retryAfterSec = Math.ceil((windowEnd.getTime() - now.getTime()) / 1000);

    return { allowed: false, retryAfterSec };
  }

  // 10分以内で5回未満
  await prisma.contactRateLimit.update({
    where: { key },
    data: {
      sendCount: { increment: 1 },
    },
  });

  return { allowed: true };
}