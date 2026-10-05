-- CreateTable
CREATE TABLE "ContactRateLimit" (
    "key" TEXT NOT NULL,
    "sendCount" INTEGER NOT NULL DEFAULT 0,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactRateLimit_pkey" PRIMARY KEY ("key")
);
