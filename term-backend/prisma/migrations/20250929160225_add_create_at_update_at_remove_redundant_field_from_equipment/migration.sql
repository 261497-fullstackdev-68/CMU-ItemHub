/*
  Warnings:

  - You are about to drop the column `amount` on the `Equipment` table. All the data in the column will be lost.
  - You are about to drop the column `quantityAvailable` on the `Equipment` table. All the data in the column will be lost.
  - You are about to drop the column `quantityTotal` on the `Equipment` table. All the data in the column will be lost.
  - Added the required column `updateAt` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalQuantity` to the `Equipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `Equipment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `EquipmentLoan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "public"."LoanStatus" ADD VALUE 'rejected';

-- AlterTable
ALTER TABLE "public"."Category" ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Equipment" DROP COLUMN "amount",
DROP COLUMN "quantityAvailable",
DROP COLUMN "quantityTotal",
ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "totalQuantity" INTEGER NOT NULL,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."EquipmentLoan" ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Organization" ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;
