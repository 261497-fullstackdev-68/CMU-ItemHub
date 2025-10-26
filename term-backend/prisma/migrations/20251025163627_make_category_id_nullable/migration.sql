-- DropForeignKey
ALTER TABLE "public"."Equipment" DROP CONSTRAINT "Equipment_categoryId_fkey";

-- AlterTable
ALTER TABLE "public"."Equipment" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Equipment" ADD CONSTRAINT "Equipment_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
