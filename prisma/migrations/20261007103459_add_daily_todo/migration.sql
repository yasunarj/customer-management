-- CreateTable
CREATE TABLE "DailyTodo" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyTodo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyTodo_ownerId_completedAt_idx" ON "DailyTodo"("ownerId", "completedAt");
