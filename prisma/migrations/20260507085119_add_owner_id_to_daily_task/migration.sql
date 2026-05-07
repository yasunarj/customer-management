/*
  Warnings:

  - Made the column `ownerId` on table `DailyTask` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ownerId` on table `DailyTaskCheck` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DailyTask" ALTER COLUMN "ownerId" SET NOT NULL;

-- AlterTable
ALTER TABLE "DailyTaskCheck" ALTER COLUMN "ownerId" SET NOT NULL;
