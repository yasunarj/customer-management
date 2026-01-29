-- CreateTable
CREATE TABLE "DailyTask" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyTaskCheck" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "checkedBy" TEXT,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyTaskCheck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyTaskCheck_date_idx" ON "DailyTaskCheck"("date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyTaskCheck_date_taskId_key" ON "DailyTaskCheck"("date", "taskId");

-- AddForeignKey
ALTER TABLE "DailyTaskCheck" ADD CONSTRAINT "DailyTaskCheck_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "DailyTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
