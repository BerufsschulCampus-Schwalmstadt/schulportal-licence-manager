/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "accountType" AS ENUM ('ADMIN', 'BASIC');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "joyrUser" (
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "accountType" "accountType" NOT NULL DEFAULT 'BASIC',
    "smsAccountId" TEXT,

    CONSTRAINT "joyrUser_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "smsAccount" (
    "smsUsername" TEXT NOT NULL,
    "smsPasswords" TEXT[],

    CONSTRAINT "smsAccount_pkey" PRIMARY KEY ("smsUsername")
);

-- CreateTable
CREATE TABLE "licenceAccount" (
    "licenceAccountId" TEXT NOT NULL,
    "licenceDataId" TEXT,

    CONSTRAINT "licenceAccount_pkey" PRIMARY KEY ("licenceAccountId")
);

-- CreateTable
CREATE TABLE "licenceData" (
    "lastSyncedDateTime" TIMESTAMP(3) NOT NULL,
    "applicationNumber" TEXT NOT NULL,
    "subservice" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "processingOffice" TEXT NOT NULL,
    "assignedPeron" TEXT NOT NULL,
    "submittedDate" TEXT NOT NULL,
    "updatedDate" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "actions" TEXT NOT NULL,
    "licenceAccountId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_licenceAccountTosmsAccount" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "joyrUser_email_key" ON "joyrUser"("email");

-- CreateIndex
CREATE INDEX "joyrUser_email_idx" ON "joyrUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "smsAccount_smsUsername_key" ON "smsAccount"("smsUsername");

-- CreateIndex
CREATE UNIQUE INDEX "licenceAccount_licenceDataId_key" ON "licenceAccount"("licenceDataId");

-- CreateIndex
CREATE UNIQUE INDEX "licenceData_licenceAccountId_key" ON "licenceData"("licenceAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "_licenceAccountTosmsAccount_AB_unique" ON "_licenceAccountTosmsAccount"("A", "B");

-- CreateIndex
CREATE INDEX "_licenceAccountTosmsAccount_B_index" ON "_licenceAccountTosmsAccount"("B");

-- AddForeignKey
ALTER TABLE "joyrUser" ADD CONSTRAINT "joyrUser_smsAccountId_fkey" FOREIGN KEY ("smsAccountId") REFERENCES "smsAccount"("smsUsername") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licenceData" ADD CONSTRAINT "licenceData_licenceAccountId_fkey" FOREIGN KEY ("licenceAccountId") REFERENCES "licenceAccount"("licenceAccountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_licenceAccountTosmsAccount" ADD CONSTRAINT "_licenceAccountTosmsAccount_A_fkey" FOREIGN KEY ("A") REFERENCES "licenceAccount"("licenceAccountId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_licenceAccountTosmsAccount" ADD CONSTRAINT "_licenceAccountTosmsAccount_B_fkey" FOREIGN KEY ("B") REFERENCES "smsAccount"("smsUsername") ON DELETE CASCADE ON UPDATE CASCADE;
