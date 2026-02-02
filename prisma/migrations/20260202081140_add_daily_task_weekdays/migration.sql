/*
  Warnings:

  - You are about to drop the column `onThr` on the `DailyTask` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DailyTask" DROP COLUMN "onThr",
ADD COLUMN     "onThu" BOOLEAN NOT NULL DEFAULT true;
