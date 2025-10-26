"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@components/Sidebar";
import Navbar from "@components/Navbar";
import api from "@/app/lib/api";
import type { Users } from "@/app/type/users";
import type { Organizations } from "@/app/type/organizations";
import type { Equipment } from "../type/equipment";
import { fetchLoansByOrgAndStatus } from "../utils/fetchByOrgIdWithStatus";

// 💡 DUMMY DATA (ใช้ในการจำลองการแสดงผล)
const DUMMY_UPCOMING_LOANS = [
  {
    id: 101,
    borrower: "สมชาย แสงจันทร์",
    equipment: "วิทยุสื่อสาร รุ่น A",
    date: "พ. 18 ต.ค.",
  },
  {
    id: 102,
    borrower: "มาริสา ใจดี",
    equipment: "กล้องถ่ายภาพ X-300",
    date: "พฤ. 19 ต.ค.",
  },
];
const DUMMY_DUE_RETURNS = [
  {
    id: 201,
    borrower: "เจนจิรา มีสุข",
    equipment: "โดรน รุ่น Phantom",
    date: "วันนี้",
  },
  {
    id: 202,
    borrower: "ชาญชัย ยิ้มสู้",
    equipment: "สายไฟต่อพ่วง",
    date: "พรุ่งนี้",
  },
];

const AdminPage: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organizations[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [pendingLoans, setPendingLoans] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<Users>();
  const [userRoles, setUserRoles] = useState<
    { organizationId?: number; role: "SYSTEM_ADMIN" | "ORG_STAFF" | "USER" }[]
  >([]);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);

  // ✅ กรองเฉพาะองค์กรที่ user มี role = ORG_STAFF
  const staffOrganizations = organizations.filter((org) =>
    userRoles.some((r) => r.role === "ORG_STAFF" && r.organizationId === org.id)
  );

  // ✅ โหลดข้อมูลเริ่มต้น
  useEffect(() => {
    async function fetchData() {
      try {
        const userRes = await api.get("users/info");
        if (userRes.data.ok) {
          console.log(userRes.data);
          setCurrentUser(userRes.data.user);
          setUserRoles(userRes.data.roles);

          const orgRes = await api.get("organizations");
          setOrganizations(orgRes.data);

          const staffOrgs = userRes.data.roles.filter(
            (r: any) => r.role === "ORG_STAFF" && r.organizationId
          );

          if (staffOrgs.length > 0) {
            const orgId = staffOrgs[0].organizationId;
            setSelectedOrgId(orgId);
            fetchEquipment(orgId);
          }
        }
      } catch (err) {
        console.error("❌ เกิดข้อผิดพลาดในการดึงข้อมูล:", err);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchPending(selectedOrgId: number | null) {
      if (!selectedOrgId) return;
      const loans = await fetchLoansByOrgAndStatus(selectedOrgId, "pending");
      setPendingLoans(loans);
    }

    fetchPending(selectedOrgId);
  }, [selectedOrgId]);

  const fetchEquipment = async (orgId: number) => {
    try {
      const res = await api.get(`equipment/findByOrganizationId/${orgId}`);
      setEquipment(res.data);
    } catch (err) {
      console.error("❌ โหลดรายการอุปกรณ์ล้มเหลว:", err);
    }
  };

  // ✅ เมื่อเปลี่ยน Organization
  const handleOrgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const orgId = Number(e.target.value);
    setSelectedOrgId(orgId);
    fetchEquipment(orgId);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-xl border-r border-gray-200">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Dashboard {selectedOrgId ? `(หน่วยงาน ${selectedOrgId})` : ""}
          </h1>
          {/* ✅ Organization Dropdown */}
          {staffOrganizations.length > 0 && (
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mr-2">
                เลือกหน่วยงาน:
              </label>
              <select
                value={selectedOrgId || ""}
                onChange={handleOrgChange}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {!selectedOrgId && (
                  <option value="" disabled>
                    -- เลือกหน่วยงาน --
                  </option>
                )}
                {staffOrganizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* --- 1. สถิติภาพรวม --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-sm font-medium text-gray-500">
                Total Items (Units)
              </p>
              <p className="text-3xl font-bold text-indigo-600">
                {equipment.length || 0}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-sm font-medium text-gray-500">Items On Loan</p>
              <p className="text-3xl font-bold text-yellow-600">85</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-sm font-medium text-gray-500">Available Now</p>
              <p className="text-3xl font-bold text-green-600">
                {85 - equipment.length}
              </p>
            </div>
          </div>

          {/* --- 2. Action Items (2-Column Layout) --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ซ้าย: รายการคำขอและคืนเร็วๆนี้ */}
            <div className="lg:col-span-2 space-y-8">
              {/* คำขอที่รอดำเนินการ */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  คำขอที่รอดำเนินการ
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  มีคำขอใหม่ <strong>{pendingLoans.length}</strong> รายการ
                  ที่ต้องอนุมัติ
                </p>
                <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition">
                  ตรวจสอบคำขอทั้งหมด
                </button>
              </div>

              {/* รายการที่ถึงกำหนดคืนเร็วๆนี้ */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  รายการที่ถึงกำหนดคืนเร็วๆ นี้
                </h2>
                <ul className="divide-y divide-gray-100">
                  {DUMMY_DUE_RETURNS.map((item) => (
                    <li
                      key={item.id}
                      className="py-3 flex justify-between items-center text-sm"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.equipment} ({item.borrower})
                        </p>
                        <p className="text-xs text-gray-500">ID: {item.id}</p>
                      </div>
                      <span
                        className={`font-bold ${
                          item.date === "วันนี้"
                            ? "text-red-600"
                            : "text-orange-500"
                        }`}
                      >
                        {item.date}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t text-right">
                  <a
                    href="/admin/returns"
                    className="text-indigo-600 text-sm hover:underline"
                  >
                    ดูรายการคืนทั้งหมด →
                  </a>
                </div>
              </div>
            </div>

            {/* ขวา: รายการยืมและ Quick Links */}
            <div className="lg:col-span-1 space-y-8">
              {/* รายการยืมในสัปดาห์นี้ */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  รายการยืมที่กำลังจะมาถึง
                </h2>
                <ul className="space-y-3">
                  {DUMMY_UPCOMING_LOANS.map((item) => (
                    <li
                      key={item.id}
                      className="p-3 bg-gray-50 rounded-lg border border-blue-100"
                    >
                      <p className="text-sm font-semibold text-gray-900">
                        {item.equipment}
                      </p>
                      <p className="text-xs text-gray-600">
                        โดย: {item.borrower}
                      </p>
                      <p className="text-xs font-bold text-blue-600 mt-1">
                        เริ่มยืม: {item.date}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Links */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Quick Links
                </h2>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href={`/admin/inventory?orgId=${selectedOrgId}`}
                      className="text-indigo-600 hover:underline"
                    >
                      จัดการ Inventory
                    </a>
                  </li>
                  <li>
                    <a
                      href={`/admin/users?orgId=${selectedOrgId}`}
                      className="text-indigo-600 hover:underline"
                    >
                      จัดการผู้ใช้งาน
                    </a>
                  </li>
                  <li>
                    <a
                      href={`/admin/reports?orgId=${selectedOrgId}`}
                      className="text-indigo-600 hover:underline"
                    >
                      ดูรายงานสรุป
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
