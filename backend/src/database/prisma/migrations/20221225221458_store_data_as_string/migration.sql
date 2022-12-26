/*
  Warnings:

  - You are about to drop the column `actions` on the `licenceData` table. All the data in the column will be lost.
  - You are about to drop the column `applicationNumber` on the `licenceData` table. All the data in the column will be lost.
  - You are about to drop the column `assignedPeron` on the `licenceData` table. All the data in the column will be lost.
  - You are about to drop the column `processingOffice` on the `licenceData` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `licenceData` table. All the data in the column will be lost.
  - You are about to drop the column `submittedDate` on the `licenceData` table. All the data in the column will be lost.
  - You are about to drop the column `subservice` on the `licenceData` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `licenceData` table. All the data in the column will be lost.
  - You are about to drop the column `updatedDate` on the `licenceData` table. All the data in the column will be lost.
  - Added the required column `data` to the `licenceData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "licenceData" DROP COLUMN "actions",
DROP COLUMN "applicationNumber",
DROP COLUMN "assignedPeron",
DROP COLUMN "processingOffice",
DROP COLUMN "status",
DROP COLUMN "submittedDate",
DROP COLUMN "subservice",
DROP COLUMN "type",
DROP COLUMN "updatedDate",
ADD COLUMN     "data" TEXT NOT NULL;
