"use client";

import React from "react";
// 💡 สำคัญ: Import Link จาก next/link เพื่อใช้สำหรับการนำทางใน Next.js
import Link from "next/link";
// 💡 (สมมติว่าคุณใช้ usePathname เพื่อเน้นหน้าปัจจุบัน)
import { usePathname } from "next/navigation";

interface NavItemProps {
  icon: string;
  label: string;
  href: string; // เปลี่ยนจาก isActive? เป็น href
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, href }) => {
  const pathname = usePathname();
  const isActive = pathname === href; // ตรวจสอบว่า URL ปัจจุบันตรงกับ href หรือไม่

  return (
    // 1. เปลี่ยน <a> เป็น <Link>
    // 2. ลบ onClick event handler ที่ไม่จำเป็นออก
    <Link
      href={href}
      className={`flex items-center p-3 rounded-lg transition duration-150 ${
        isActive
          ? "bg-indigo-600 text-white shadow-md"
          : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
      }`}
    >
      <span className="text-xl mr-3">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export const Sidebar: React.FC = () => {
  return (
    <nav className="p-4 space-y-2">
      {/* กำหนดเส้นทาง (href) ให้ชัดเจน */}
      <NavItem icon="🏠" label="หน้าหลัก" href="/admin" />
      <NavItem icon="📦" label="คลังอุปกรณ์" href="/admin/inventory" />
      <NavItem icon="📝" label="คำขออุปกรณ์" href="/admin/requests" />
      <NavItem icon="👤" label="อุปกรณ์ที่ยืม" href="/admin/borrowed" />
      <NavItem icon="📊" label="ประวัติการให้ยืม" href="/admin/history" />
    </nav>
  );
};
