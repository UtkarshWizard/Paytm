/*
  Warnings:

  - You are about to drop the column `tokem` on the `OnRampTransaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `OnRampTransaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `OnRampTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "OnRampTransaction_tokem_key";

-- AlterTable
ALTER TABLE "OnRampTransaction" DROP COLUMN "tokem",
ADD COLUMN     "token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OnRampTransaction_token_key" ON "OnRampTransaction"("token");
