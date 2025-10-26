"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import React, { useEffect } from "react";
import { OrganizationForm } from "@components/ServerAdmin/CreateOrganizationPopUp";
import type { Organizations } from "@/app/type/organizations";
import { ModalWrapper } from "@components/ServerAdmin/AddOrg";
import { OrganizationDetailModal } from "@components/ServerAdmin/OrganizationDetail";
import Navbar from "../components/Navbar";

type ActiveTab = "overview" | "add-org" | "add-role";

export default function AdminPage() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organizations[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [isCreateOrgModalOpen, setIsCreateOrgModalOpen] = useState(false);

  const fetchOrganizations = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/organizations`,
      {
        credentials: "include",
      }
    );
    const data = await response.json();
    setOrganizations(data);
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleOpenCreateOrgModal = () => {
    setIsCreateOrgModalOpen(true);
  };

  const handleCloseCreateOrgModal = () => {
    setIsCreateOrgModalOpen(false);
  };

  const handleSuccess = () => {
    alert("Action successful!");
    fetchOrganizations();
    router.push("/serverAdmin");
  };

  const handleOpenOrgSettings = (id: number) => {
    router.push(`/serverAdmin/org-settings/${id}`);
  };

  const handleOpenOrgDetails = (id: number) => {
    setSelectedOrgId(id); // <--- ตั้งค่า ID ที่ถูกเลือก
  };

  const handleCloseModal = () => {
    setSelectedOrgId(null);
  };

  //อัปเดต State ชั่วคราวเมื่อผู้ใช้พิมพ์
  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const newName = e.target.value;
    setOrganizations((prev) =>
      prev.map((org) => (org.id === id ? { ...org, name: newName } : org))
    );
  };

  //บันทึกข้อมูลไปยัง Backend และปิดโหมดแก้ไข
  const handleSave = async (id: number) => {
    if (savingId === id) return;

    const itemToSave = organizations.find((org) => org.id === id);
    if (!itemToSave || itemToSave.name.trim() === "") {
      alert("Organization name cannot be empty.");
      fetchOrganizations();
      setEditingId(null);
      return;
    }
    setSavingId(id);

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/organizations/${id}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: itemToSave.name }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to update organization");
      }
      alert(`Organization "${itemToSave.name}" updated successfully!`);
    } catch (error) {
      console.error(`Error updating organization ${id}:`, error);
      alert("Failed to save changes.");
      fetchOrganizations(); // Re-fetch เพื่อ Rollback ค่าเดิม
    } finally {
      setSavingId(null);
      setEditingId(null);
    }
  };

  const handleAddOrg = () => {
    router.push("/admin/add-organization");
  };

  //โฟกัสที่ input เมื่อกด edit
  useEffect(() => {
    if (editingId !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1 pt-0">
        <main className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
            Server Admin Panel
          </h1>

          {/* --- Manage Organizations Section --- */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Manage Organizations
              </h2>
              <button
                onClick={handleOpenCreateOrgModal}
                className="flex items-center bg-indigo-600 text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-indigo-700 transition shadow-md"
              >
                <span className="text-xl mr-1">+</span> Add New Organization
              </button>
            </div>

            {/* Organization Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
              {organizations.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenOrgSettings(item.id)}
                  className="bg-gray-50 border border-gray-200 p-4 rounded-xl hover:bg-gray-100 hover:shadow-lg transition duration-150 cursor-pointer"
                >
                  <div className="text-base font-semibold text-indigo-700 truncate">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Organization ID:{" "}
                    <span className="font-mono">{item.id}</span>
                  </div>
                  {/* 💡 เพิ่มสถิติย่อ เช่น จำนวน Staffs/Equipments (ถ้ามีข้อมูล) */}
                  {/* <div className="text-xs text-gray-500 mt-2">Staffs: 15 | Items: 120</div> */}
                </div>
              ))}
            </div>

            {organizations.length === 0 && (
              <div className="text-center p-10 text-gray-500">
                No organizations found.
              </div>
            )}
          </div>

          {/* --- Modal Section --- */}
          {isCreateOrgModalOpen && (
            <ModalWrapper onClose={handleCloseCreateOrgModal}>
              <OrganizationForm
                onSuccess={handleSuccess}
                onClose={handleCloseCreateOrgModal}
              />
            </ModalWrapper>
          )}
        </main>
      </div>
    </div>
  );
}
