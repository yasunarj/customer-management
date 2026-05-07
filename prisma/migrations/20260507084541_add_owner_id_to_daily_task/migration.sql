/*
  Warnings:

  - A unique constraint covering the columns `[ownerId,title]` on the table `DailyTask` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ownerId,date,taskId]` on the table `DailyTaskCheck` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "DailyTask_title_key";

-- DropIndex
DROP INDEX "DailyTaskCheck_date_idx";

-- DropIndex
DROP INDEX "DailyTaskCheck_date_taskId_key";

-- AlterTable
ALTER TABLE "DailyTask" ADD COLUMN     "ownerId" TEXT;

-- AlterTable
ALTER TABLE "DailyTaskCheck" ADD COLUMN     "ownerId" TEXT;

-- CreateIndex
CREATE INDEX "DailyTask_ownerId_idx" ON "DailyTask"("ownerId");

-- CreateIndex
CREATE INDEX "DailyTask_ownerId_isActive_idx" ON "DailyTask"("ownerId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "DailyTask_ownerId_title_key" ON "DailyTask"("ownerId", "title");

-- CreateIndex
CREATE INDEX "DailyTaskCheck_ownerId_date_idx" ON "DailyTaskCheck"("ownerId", "date");

-- CreateIndex
CREATE INDEX "DailyTaskCheck_taskId_idx" ON "DailyTaskCheck"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyTaskCheck_ownerId_date_taskId_key" ON "DailyTaskCheck"("ownerId", "date", "taskId");
