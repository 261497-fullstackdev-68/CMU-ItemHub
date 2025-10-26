// src/components/ui/ModalWrapper.tsx
"use client";

import React from "react";

interface ModalWrapperProps {
  onClose: () => void;
  children: React.ReactNode;
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({
  onClose,
  children,
}) => {
  return (
    // Overlay: พื้นหลังทึบ, ปิด Modal เมื่อคลิกนอก Content
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onMouseDown={onClose} //ปิด Modal เมื่อคลิกที่ Overlay
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 relative animate-scaleUp"
        onMouseDown={(e) => e.stopPropagation()} // หยุด Event Propagation ไม่ให้ไปถึง Overlay
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-semibold"
        >
          &times; {/* สัญลักษณ์กากบาท */}
        </button>
        {children} {/* แสดง Content ที่ส่งมา (เช่น OrganizationForm) */}
      </div>
    </div>
  );
};
