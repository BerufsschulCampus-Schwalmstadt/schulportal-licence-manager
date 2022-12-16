/*
  Warnings:

  - A unique constraint covering the columns `[refreshTokens]` on the table `joyrUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "joyrUser_refreshTokens_key" ON "joyrUser"("refreshTokens");
