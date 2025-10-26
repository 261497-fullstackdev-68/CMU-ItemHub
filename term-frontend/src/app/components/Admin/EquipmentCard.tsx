"use client";

import React from "react";
import type { Equipment } from "@/app/type/equipment";
import { useRouter } from "next/navigation";
import Image from "next/image";

// 💡 กำหนด Props ให้ EquipmentCard ยืดหยุ่น
interface EquipmentCardProps {
  item: Equipment;
  onEdit: (item: Equipment) => void;
  onDelete: (itemId: number, itemName: string) => Promise<void>;
  // 💡 กำหนด Role เพื่อควบคุมการแสดงปุ่ม (เช่น 'USER', 'ADMIN', 'SERVER_ADMIN')
  userRole: "USER" | "ORG_STAFF" | "SYSTEM_ADMIN";
  categories: { id: number; categoryName: string }[];
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({
  item,
  onEdit,
  onDelete,
  userRole,
  categories,
}) => {
  const router = useRouter();

  // 💡 Logic การแสดงปุ่มแก้ไข
  const canEdit = userRole === "ORG_STAFF" || userRole === "SYSTEM_ADMIN";

  // 💡 เปลี่ยน item.isAvailable เป็น availableQuantity ตาม Schema ที่แนะนำก่อนหน้า
  // แต่ในโค้ดนี้ยังคงใช้ isAvailable ตามโค้ดเดิมของคุณ
  const statusColor = item.isAvailable ? "text-green-600" : "text-red-600";
  const statusText = item.isAvailable ? "Available" : "Not Available";

  const handleCardClick = () => {
    // 💡 นำผู้ใช้ไปยังหน้า Detail โดยใช้ ID
    router.push(`/components/detail/${item.id}`);
  };

  return (
    <div
      key={item.id}
      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer flex flex-col justify-between h-full"
    >
      {/* --- ส่วนคลิกได้ (Detail) --- */}
      <div className="flex-grow" onClick={handleCardClick}>
        <h3 className="text-xl font-bold text-gray-900 truncate mb-1">
          {item.name}
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          {item.description || "No description provided."}
        </p>
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={200}
          height={200}
          className="w-full object-cover rounded mb-2"
        />
        {/* <img
          src={item.imageUrl || "/placeholder-image.png"} // ใช้ภาพ placeholder หากไม่มี URL
          alt={item.name}
          className="w-full h-40 object-cover rounded mb-2"
        /> */}
        <div className="mt-3 text-sm space-y-1">
          {/* <p className="text-gray-700">
            ID: <span className="font-medium">{item.id}</span>
          </p> */}
          <p className="text-gray-700">
            หมวดหมู่:{" "}
            <span className="font-medium">
              {categories.length > 0
                ? categories.find((c) => c.id === item.categoryId)
                    ?.categoryName || "ไม่ระบุ"
                : "กำลังโหลด..."}
            </span>
          </p>
          <p className="text-gray-700">
            จำนวนทั้งหมด:{" "}
            <span className="font-medium">{item.totalQuantity}</span>
          </p>
          <p className="text-gray-700">
            สถานะ:
            <span className={`font-semibold ml-1 ${statusColor}`}>
              {statusText}
            </span>
          </p>
        </div>
      </div>

      {/* --- ส่วน Action (สำหรับ Admin) --- */}
      <div>
        {canEdit && (
          // 💡 ใช้ Flexbox เพื่อจัดเรียงปุ่มในแถวเดียว
          // 'flex' | 'justify-between' เพื่อดันปุ่มไปคนละฝั่ง | 'space-x-3' เพื่อเว้นระยะห่างระหว่างปุ่ม
          <div className="mt-4 border-t pt-3 flex justify-between space-x-3">
            {/* 1. ปุ่มแก้ไขข้อมูล (ซ้าย) */}
            <button
              // ใช้ w-1/2 เพื่อให้กินพื้นที่ครึ่งหนึ่ง (ถ้าต้องการให้ปุ่มใหญ่)
              // แต่ในที่นี้ใช้แค่ padding ก็พอ และให้ flex จัดการ
              className="flex-1 bg-blue-500 text-white px-3 py-2 text-sm rounded hover:bg-blue-600 transition disabled:opacity-50"
              onClick={(e) => {
                e.stopPropagation(); // 💡 ป้องกันการเรียก handleCardClick
                onEdit(item);
              }}
            >
              แก้ไขข้อมูล
            </button>

            {/* 2. ปุ่ม Delete (ขวา) */}
            <button
              // ใช้ flex-1 เช่นกันเพื่อให้ขนาดพอๆ กับปุ่มแก้ไข
              onClick={(e) => {
                e.stopPropagation(); // ป้องกันการเรียก handleCardClick
                onDelete(item.id, item.name);
              }}
              className="flex-1 text-sm px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentCard;
