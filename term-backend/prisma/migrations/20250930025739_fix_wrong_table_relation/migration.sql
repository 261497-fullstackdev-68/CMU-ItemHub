-- DropForeignKey
ALTER TABLE "public"."EquipmentLoan" DROP CONSTRAINT "EquipmentLoan_lenderId_fkey";

-- AddForeignKey
ALTER TABLE "public"."EquipmentLoan" ADD CONSTRAINT "EquipmentLoan_lenderId_fkey" FOREIGN KEY ("lenderId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
