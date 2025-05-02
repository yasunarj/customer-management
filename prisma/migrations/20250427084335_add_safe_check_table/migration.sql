-- CreateTable
CREATE TABLE "SafeCheck" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "bara" INTEGER NOT NULL,
    "yen10000" INTEGER NOT NULL,
    "yen5000" INTEGER NOT NULL,
    "yen1000" INTEGER NOT NULL,
    "yen500" INTEGER NOT NULL,
    "yen100" INTEGER NOT NULL,
    "yen50" INTEGER NOT NULL,
    "yen10" INTEGER NOT NULL,
    "yen5" INTEGER NOT NULL,
    "yen1" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SafeCheck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SafeCheck_date_key" ON "SafeCheck"("date");
