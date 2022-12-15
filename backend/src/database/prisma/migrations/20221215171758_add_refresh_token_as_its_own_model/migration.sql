/*
  Warnings:

  - You are about to drop the column `refreshTokens` on the `joyrUser` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "joyrUser_refreshTokens_key";

-- AlterTable
ALTER TABLE "joyrUser" DROP COLUMN "refreshTokens";

-- CreateTable
CREATE TABLE "refreshToken" (
    "token" TEXT NOT NULL,
    "joyrUserId" TEXT NOT NULL,

    CONSTRAINT "refreshToken_pkey" PRIMARY KEY ("token")
);

-- CreateIndex
CREATE UNIQUE INDEX "refreshToken_token_key" ON "refreshToken"("token");

-- AddForeignKey
ALTER TABLE "refreshToken" ADD CONSTRAINT "refreshToken_joyrUserId_fkey" FOREIGN KEY ("joyrUserId") REFERENCES "joyrUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
