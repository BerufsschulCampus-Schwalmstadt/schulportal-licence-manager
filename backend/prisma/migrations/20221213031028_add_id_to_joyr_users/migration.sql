/*
  Warnings:

  - The primary key for the `joyrUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `joyrUser` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "smsAccount_smsUsername_key";

-- AlterTable
ALTER TABLE "joyrUser" DROP CONSTRAINT "joyrUser_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "joyrUser_pkey" PRIMARY KEY ("id");
