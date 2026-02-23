-- CreateTable
CREATE TABLE "owner_gate_limits" (
    "key" TEXT NOT NULL,
    "failCount" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "owner_gate_limits_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "owner_gate_limits_lockedUntil_idx" ON "owner_gate_limits"("lockedUntil");
