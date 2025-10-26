/*
  Warnings:

  - You are about to drop the column `adminId` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `organizationName` on the `User` table. All the data in the column will be lost.
  - Added the required column `code` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `faculty` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('SYSTEM_ADMIN', 'ORG_STAFF', 'USER');

-- DropForeignKey
ALTER TABLE "public"."Organization" DROP CONSTRAINT "Organization_adminId_fkey";

-- AlterTable
ALTER TABLE "public"."Category" ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Organization" DROP COLUMN "adminId";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "organizationName",
ADD COLUMN     "faculty" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."UserRole" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "organizationId" INTEGER,
    "role" "public"."Role" NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserRole" ADD CONSTRAINT "UserRole_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
