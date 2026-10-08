import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type ContactRateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSec: number };

export const checkContactRateLimit = async (ip: string): Promise<ContactRateLimitResult> => {
  const windowMs = 10 * 60 * 1000;
  const maxCount = 5;
  const key = `contact:${ip}`;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const result = await prisma.$transaction(
        async (tx) => {
          const now = new Date();
          const row = await tx.contactRateLimit.findUnique({
            where: { key },
          });
          // 初回
          if (!row) {
            await tx.contactRateLimit.create({
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
          if (now >= windowEnd) {
            await tx.contactRateLimit.update({
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
          await tx.contactRateLimit.update({
            where: { key },
            data: {
              sendCount: { increment: 1 },
            },
          });

          return { allowed: true };
        },
        { isolationLevel: "Serializable" }
      );

      return result as ContactRateLimitResult;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError && 
        error.code === "P2034"
      ) {
        continue;
      }
      throw error;
    }
  }
  throw new Error("レート制限処理の再試行回数を超えました")
};
