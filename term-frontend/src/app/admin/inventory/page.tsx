"use client";

import { useState, useEffect } from "react";
import { Header } from "@components/Header";
import { Sidebar } from "@components/Sidebar";
import type { Equipment } from "@/app/type/equipment";
import PopUp from "@components/Admin/AddEquipmentPopUp";
import EquipmentCard from "@components/Admin/EquipmentCard";
import api from "@/app/lib/api";
import type { Users } from "@/app/type/users";
import type { Organizations } from "@/app/type/organizations";
import Navbar from "@/app/components/Navbar";

const CURRENT_USER_ROLE: "USER" | "ORG_STAFF" | "SYSTEM_ADMIN" = "ORG_STAFF";

const InventoryPage: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [showModal, setShowModal] = useState<"add" | "edit" | null>(null);
  const [itemToEdit, setItemToEdit] = useState<Equipment | null>(null);
  const [currentUser, setCurrentUser] = useState<Users>();
  const [userRoles, setUserRoles] = useState<
    { organizationId?: number; role: "SYSTEM_ADMIN" | "ORG_STAFF" | "USER" }[]
  >([]);
  const [organizations, setOrganizations] = useState<Organizations[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [categories, setCategories] = useState<
    { id: number; categoryName: string }[]
  >([]);
  const [itemToDelete, setItemToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  // 💡 Function เดิม: ดึงข้อมูลอุปกรณ์
  const fetchEquipment = async (orgId?: number) => {
    setLoading(true);
    try {
      const url = orgId
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/equipment/findByOrganizationId/${orgId}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/equipment`;

      // 💡 ใช้ api.get แทน fetch ตรงๆ เพื่อให้จัดการ Headers/Auth ได้ง่ายขึ้น (ถ้า api.get รองรับ)
      // แต่ในตัวอย่างเดิมใช้ fetch, ผมขอปรับเป็น fetch ตามเดิมก่อน
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch equipment.");
      const data = await response.json();
      setEquipment(data);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("categories");
      const data: Category[] = res.data;
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // 💡 Function ใหม่: จัดการการลบอุปกรณ์
  const handleDeleteItem = async (itemId: number, itemName: string) => {
    if (
      !window.confirm(
        `คุณแน่ใจหรือไม่ว่าต้องการลบอุปกรณ์: "${itemName}"? การกระทำนี้ไม่สามารถย้อนกลับได้.`
      )
    ) {
      return;
    }

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/equipment/${itemId}`;

      // ใช้ fetch สำหรับ DELETE
      const response = await fetch(url, {
        method: "DELETE",
        // อาจจะต้องเพิ่ม Authorization Header ถ้า API ของคุณต้องการ
        // headers: { "Authorization": `Bearer ${yourAuthToken}` }
      });

      if (!response.ok) {
        throw new Error(`มีข้อผิดพลาดในการลบอุปกรณ์: ${response.statusText}`);
      }

      // เมื่อลบสำเร็จ, เรียก fetchEquipment ซ้ำเพื่ออัปเดตรายการ
      alert(`อุปกรณ์ "${itemName}" ถูกลบเรียบร้อยแล้ว.`);
      if (selectedOrgId) {
        fetchEquipment(selectedOrgId);
      } else {
        fetchEquipment();
      }
    } catch (error) {
      console.error("Error deleting equipment:", error);
      alert(
        `มีข้อผิดพลาดในการลบอุปกรณ์ "${itemName}". กรุณาตรวจสอบที่ console.`
      );
    }
  };

  const handleAddNewItem = () => {
    setItemToEdit(null);
    setShowModal("add");
  };

  const handleEditItem = (item: Equipment) => {
    setItemToEdit(item);
    setShowModal("edit");
  };

  const handleFormSuccess = () => {
    setShowModal(null);
    if (selectedOrgId) fetchEquipment(selectedOrgId);
  };

  // ดึงข้อมูล user + role
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get("users/info");
        if (res.data.ok) {
          setCurrentUser(res.data.user);
          setUserRoles(res.data.roles);

          // ถ้ามี organizationId ที่เป็น ORG_STAFF ให้เลือกอันแรกเป็น default
          const staffOrgs = res.data.roles.filter(
            (item) => item.role === "ORG_STAFF" && item.organizationId
          );
          if (staffOrgs.length > 0) {
            setSelectedOrgId(staffOrgs[0].organizationId);
            fetchEquipment(staffOrgs[0].organizationId);
          }
        }
      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", err);
      }
    }
    fetchData();
  }, []);

  // ดึงข้อมูล organizations ทั้งหมด (ไว้แม็พชื่อ)
  useEffect(() => {
    async function fetchOrganizations() {
      try {
        const res = await api.get("organizations");
        setOrganizations(res.data);
      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลองค์กร:", err);
      }
    }
    fetchOrganizations();
    fetchCategories();
  }, []);

  // เมื่อเปลี่ยน organization dropdown
  const handleOrgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const orgId = Number(e.target.value);
    setSelectedOrgId(orgId);
    fetchEquipment(orgId);
  };

  // Filter organizations ที่ user มี role = ORG_STAFF
  const staffOrganizations = organizations.filter((org) =>
    userRoles.some((r) => r.role === "ORG_STAFF" && r.organizationId === org.id)
  );

  const totalQuantity = equipment.reduce(
    (sum, item) => sum + item.totalQuantity,
    0
  );
  const uniqueItemTypes = equipment.length;
  const availableItemsCount = equipment.filter(
    (item) => item.isAvailable
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-0">
        <aside className="w-64 bg-white shadow-xl flex-shrink-0 border-r border-gray-200">
          <Sidebar />
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">จัดการอุปกรณ์</h1>
            {(CURRENT_USER_ROLE === "ORG_STAFF" ||
              CURRENT_USER_ROLE === "SYSTEM_ADMIN") && (
              <button
                onClick={handleAddNewItem}
                className="bg-green-600 text-white px-4 py-2 rounded shadow-lg hover:bg-green-700 transition"
              >
                + เพิ่มอุปกรณ์ใหม่
              </button>
            )}
          </div>

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
                {/* 💡 เพิ่มการจัดการกรณีที่ไม่มี Organization ID ถูกเลือก */}
                {!selectedOrgId && (
                  <option value="" disabled>
                    เลือกหน่วยงาน
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

          {/* --- Summary Cards --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-sm font-medium text-gray-500">จำนวนทั้งหมด</p>
              <p className="text-3xl font-bold text-indigo-600">
                {totalQuantity}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-sm font-medium text-gray-500">
                ประเภทอุปกรณ์ที่ไม่ซ้ำกัน
              </p>
              <p className="text-3xl font-bold text-gray-800">
                {uniqueItemTypes}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-sm font-medium text-gray-500">
                อุปกรณ์ที่พร้อมให้ยืม
              </p>
              <p className="text-3xl font-bold text-green-600">
                {availableItemsCount}
              </p>
            </div>
          </div>

          {/* --- Add/Edit Modal --- */}
          {(showModal === "add" || showModal === "edit") && selectedOrgId && (
            <PopUp
              onClose={() => setShowModal(null)}
              onSuccess={handleFormSuccess}
              itemToEdit={itemToEdit}
              selectOrg={selectedOrgId}
              organization={organizations}
            />
          )}

          {/* --- Equipment List --- */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
            ประเภทของอุปกรณ์
          </h2>

          {loading ? (
            <div className="text-center p-10 text-gray-500">
              กำลังโหลดรายการอุปกรณ์...
            </div>
          ) : equipment.length === 0 ? (
            <div className="text-center p-10 text-gray-500 bg-white rounded-lg shadow-md">
              ไม่พบรายการอุปกรณ์ในหน่วยงานนี้
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {equipment.map((item) => (
                <EquipmentCard
                  key={item.id}
                  item={item}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem} // 💡 ส่งฟังก์ชันลบลงไป
                  userRole={CURRENT_USER_ROLE}
                  categories={categories}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default InventoryPage;
