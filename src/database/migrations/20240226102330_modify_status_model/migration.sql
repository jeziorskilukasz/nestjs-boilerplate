/*
  Warnings:

  - Changed the type of `name` on the `Status` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "StatusName" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Status" DROP COLUMN "name",
ADD COLUMN     "name" "StatusName" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Status_name_key" ON "Status"("name");
