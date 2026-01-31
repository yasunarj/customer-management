/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `DailyTask` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DailyTask_title_key" ON "DailyTask"("title");
