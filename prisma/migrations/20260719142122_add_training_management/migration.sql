-- CreateEnum
CREATE TYPE "TrainingCategory" AS ENUM ('REGISTER', 'CLEANING', 'PRODUCT_MANAGEMENT', 'OTHER');

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingEmployee" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingEmployee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingWorkItem" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "TrainingCategory" NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingWorkItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingAssignment" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "workItemId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingCheck" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "checkNumber" INTEGER NOT NULL,
    "trainerId" TEXT NOT NULL,
    "trainerName" TEXT,
    "comment" TEXT,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainingCheck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TrainingEmployee_storeId_idx" ON "TrainingEmployee"("storeId");

-- CreateIndex
CREATE INDEX "TrainingEmployee_storeId_isActive_idx" ON "TrainingEmployee"("storeId", "isActive");

-- CreateIndex
CREATE INDEX "TrainingWorkItem_storeId_idx" ON "TrainingWorkItem"("storeId");

-- CreateIndex
CREATE INDEX "TrainingWorkItem_storeId_category_idx" ON "TrainingWorkItem"("storeId", "category");

-- CreateIndex
CREATE INDEX "TrainingWorkItem_storeId_isActive_idx" ON "TrainingWorkItem"("storeId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingWorkItem_storeId_title_key" ON "TrainingWorkItem"("storeId", "title");

-- CreateIndex
CREATE INDEX "TrainingAssignment_employeeId_idx" ON "TrainingAssignment"("employeeId");

-- CreateIndex
CREATE INDEX "TrainingAssignment_workItemId_idx" ON "TrainingAssignment"("workItemId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingAssignment_employeeId_workItemId_key" ON "TrainingAssignment"("employeeId", "workItemId");

-- CreateIndex
CREATE INDEX "TrainingCheck_assignmentId_idx" ON "TrainingCheck"("assignmentId");

-- CreateIndex
CREATE INDEX "TrainingCheck_trainerId_idx" ON "TrainingCheck"("trainerId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingCheck_assignmentId_checkNumber_key" ON "TrainingCheck"("assignmentId", "checkNumber");

-- AddForeignKey
ALTER TABLE "TrainingEmployee" ADD CONSTRAINT "TrainingEmployee_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingWorkItem" ADD CONSTRAINT "TrainingWorkItem_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingAssignment" ADD CONSTRAINT "TrainingAssignment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "TrainingEmployee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingAssignment" ADD CONSTRAINT "TrainingAssignment_workItemId_fkey" FOREIGN KEY ("workItemId") REFERENCES "TrainingWorkItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingCheck" ADD CONSTRAINT "TrainingCheck_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "TrainingAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
