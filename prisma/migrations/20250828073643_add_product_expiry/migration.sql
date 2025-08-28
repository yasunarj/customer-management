-- CreateTable
CREATE TABLE "product_expiry" (
    "id" SERIAL NOT NULL,
    "gondolaNo" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "expiryDate" DATE NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "manager" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_expiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_expiry_expiryDate_idx" ON "product_expiry"("expiryDate");
