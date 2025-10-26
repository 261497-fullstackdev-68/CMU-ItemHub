/*
  Warnings:

  - You are about to drop the column `lenderId` on the `EquipmentLoan` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."EquipmentLoan" DROP CONSTRAINT "EquipmentLoan_lenderId_fkey";

-- AlterTable
ALTER TABLE "public"."EquipmentLoan" DROP COLUMN "lenderId";
