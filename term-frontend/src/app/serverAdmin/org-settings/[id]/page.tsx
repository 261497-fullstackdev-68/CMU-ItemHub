"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { UserRoleForm } from "@components/ServerAdmin/AddRolePopUp";
import { Button } from "@components/Admin/Button";
import { SearchSelect } from "@components/ServerAdmin/AssignRole_DropDown";
import type { UserRoles } from "@/app/type/userRoles";
import type { Users } from "@/app/type/users";

interface OrganizationDetail {
  id: number;
  name: string;
}

type DetailTab = "details" | "assign-role";

// --- Main Page Component ---
export default function OrganizationSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = params.id ? parseInt(params.id as string) : null;

  // --- State (ย้ายมาจาก OrganizationDetailModal) ---

  const [data, setData] = useState<OrganizationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [userRoles, setUserRoles] = useState<UserRoles[]>([]);
  const [users, setUsers] = useState<Users[]>([]);
  const [formData, setFormData] = useState<{
    userId: number;
    organizationId: number;
    role: "ORG_STAFF";
  }>({
    userId: 0,
    organizationId: orgId || 0,
    role: "ORG_STAFF", // กำหนดค่าเริ่มต้น
  });

  // 💡 ฟังก์ชันสำหรับปุ่มย้อนกลับ
  const handleBack = () => {
    router.back();
  };

  // 💡 handleSuccess ถูกปรับปรุงให้กลับหน้าหลักเมื่อดำเนินการเสร็จสิ้น
  const handleSuccess = () => {
    alert("Action successful!");
    fetchOrganizationDetails();
  };

  const handleAddAdmin = async () => {
    if (formData.userId === 0) {
      alert("Please select a User using the search fields.");
      return;
    }

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/userRoles`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to add admin");

      handleSuccess();
      fetchUserRoles(); // Re-fetch roles to update the list
    } catch (error) {
      console.error("Error adding admin:", error);
      alert("Failed to add admin.");
    }
  };

  const handleDeleteRoles = async (userRoleId: number) => {
    setSaving(true);
    try {
      // Endpoint ใช้ userRoleId (ID ของรายการ Role นั้นๆ)
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/userRoles/${userRoleId}`;

      const response = await fetch(url, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to remove role. Status: ${response.status}. Detail: ${errorText}`
        );
      }

      // เมื่อลบสำเร็จ ให้ดึงข้อมูล Roles ใหม่เพื่ออัปเดต UI
      fetchUserRoles();
    } catch (error) {
      console.error("Error removing role:", error);
      alert("Failed to remove staff role. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  const handleIdSelect = (name: "userId" | "organizationId", id: number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: id,
    }));
  };

  // --- Logic การดึงข้อมูล (ย้ายมาจาก OrganizationDetailModal) ---
  const fetchOrganizationDetails = async () => {
    if (!orgId) return; // ป้องกันการ Fetch ถ้า ID ไม่พร้อม

    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/organizations/${orgId}`;
      const response = await fetch(url, { credentials: "include" });

      if (!response.ok) throw new Error("Failed to fetch organization details");

      const detail: OrganizationDetail = await response.json();
      setData(detail);
      setNewName(detail.name);
    } catch (error) {
      console.error("Error fetching details:", error);
      alert("Failed to load organization details. Returning to overview.");
      // handleBack(); // กลับไปหน้าหลักเมื่อโหลดไม่สำเร็จ
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRoles = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/userRoles`,
      {
        credentials: "include",
      }
    );
    const data = await response.json();
    setUserRoles(data);
  };

  const fetchUsers = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/getAllUsers`,
      {
        credentials: "include",
      }
    );
    const data = await response.json();
    setUsers(data);
  };

  useEffect(() => {
    if (orgId) {
      fetchUsers();
      fetchOrganizationDetails();
      fetchUserRoles();
    }
  }, [orgId]); // Fetch เมื่อ orgId เปลี่ยน

  // --- Logic สำหรับการเปลี่ยนชื่อ Organization (ย้ายมาจาก OrganizationDetailModal) ---
  const handleSaveName = async () => {
    if (!data || newName.trim() === data.name.trim()) {
      setIsEditingName(false);
      return;
    }
    if (newName.trim() === "") {
      alert("Name cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/organizations/${orgId}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to update name");

      alert("Organization name updated successfully!");
      setData((prev) => (prev ? { ...prev, name: newName } : null));
      fetchOrganizationDetails();
      setIsEditingName(false);
    } catch (error) {
      console.error("Error updating name:", error);
      alert("Failed to save name.");
      setNewName(data?.name || "");
    } finally {
      setSaving(false);
    }
  };

  if (!orgId) {
    return <div className="p-8">Invalid Organization ID.</div>;
  }

  if (loading) {
    return (
      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-extrabold mb-6">
          Settings for Organization ID: {orgId}
        </h1>
        <div className="bg-white rounded-xl shadow-2xl p-6 text-center">
          Loading organization details...
        </div>
      </div>
    );
  }

  if (!data) return null;

  // 💡 แก้ไข: กรอง Roles ให้เหลือเฉพาะของ Organization นี้เท่านั้น
  const organizationRoles = userRoles.filter(
    (item) => item.organizationId === orgId
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* --- ส่วนปุ่มย้อนกลับ --- */}
      <button
        onClick={handleBack}
        className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6 font-semibold"
      >
        <svg
          className="w-5 h-5 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          ></path>
        </svg>
        Back to Admin Overview
      </button>

      <h1 className="text-3xl font-extrabold mb-6">
        {data.name}
        <span className="text-md text-gray-500 ml-2">(ID: {data.id})</span>
      </h1>
      <div className="space-y-4">
        {/* --- ส่วนแสดงชื่อและปุ่มแก้ไข --- */}
        <div className="flex border-b pb-2">
          <h4 className="text-lg font-medium text-gray-700">Name: </h4>
          {isEditingName ? (
            <div className="flex space-x-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                disabled={saving}
                className="p-1 border rounded"
              />
              <Button
                onClick={handleSaveName}
                disabled={saving}
                className=" bg-green-500"
              >
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button
                onClick={() => setIsEditingName(false)}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2 items-center">
              <span className="text-xl font-bold text-indigo-700">
                {data.name}
              </span>
              <button
                onClick={() => setIsEditingName(true)}
                className="text-indigo-500 hover:text-indigo-700 text-sm"
              >
                (Edit)
              </button>
            </div>
          )}
        </div>

        {/* --- รายการ Admin/Staff --- */}
        <div>
          <h4 className="text-lg font-medium text-gray-700 mb-2">
            Assigned Staff/Admins (ORG ID: {orgId}):
          </h4>
          {organizationRoles.length === 0 ? (
            <p className="text-gray-500">No staff or admins assigned yet.</p>
          ) : (
            <ul className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {/* 💡 ใช้ organizationRoles ที่ถูกกรองแล้ว */}
              {organizationRoles.map((item) => {
                const user = users.find((u) => u.id === item.userId);

                if (!user) return null;

                return (
                  <li
                    key={item.userId}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded border"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {user.firstname} {user.lastname}
                      </span>
                      <span className="font-semibold text-gray-600 text-sm">
                        {user.email}
                      </span>
                    </div>

                    <Button
                      variant="danger"
                      disabled={saving}
                      // 💡 แก้ไข: ส่ง item.userId ซึ่งคือ userRoleId ไปให้ฟังก์ชันลบ
                      onClick={() => handleDeleteRoles(item.id)}
                      className="text-xs"
                    >
                      Remove
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <div className="mt-6 p-4 bg-white rounded-xl shadow-md">
        <h4 className="text-lg font-medium text-gray-700 mb-3">
          Assign New Staff
        </h4>
        <SearchSelect
          label="Search User to Assign"
          value={formData.userId}
          onSelect={(id) => handleIdSelect("userId", id)}
          searchType="user"
          required={true}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
          onClick={handleAddAdmin}
        >
          Add Staff Role
        </button>
      </div>
    </div>
  );
}
