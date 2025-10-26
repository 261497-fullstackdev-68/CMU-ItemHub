"use client";

import React, { useState, useEffect } from "react";
import { UserRoleForm } from "../ServerAdmin/AddRolePopUp"; // ใช้ Form เดิมของคุณ
import { Button } from "../Admin/Button";

// สมมติ Type ข้อมูลที่ดึงมา
interface OrganizationDetail {
  id: number;
  name: string;
  // เพิ่ม field ที่จำเป็น เช่น userRoles, equipment ฯลฯ
  userRoles: {
    id: number;
    user: { id: number; email: string };
    role: "USER" | "ORG_STAFF" | "SYSTEM_ADMIN";
  }[];
}

interface OrganizationDetailModalProps {
  orgId: number;
  onSuccess: () => void;
  onClose: () => void;
}

// 💡 สร้าง Tab ภายใน Modal
type DetailTab = "details" | "assign-role";

export const OrganizationDetailModal: React.FC<
  OrganizationDetailModalProps
> = ({ orgId, onSuccess, onClose }) => {
  const [data, setData] = useState<OrganizationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>("details");

  const fetchOrganizationDetails = async () => {
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
      alert("Failed to load organization details.");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizationDetails();
  }, [orgId]);

  // --- Logic สำหรับการเปลี่ยนชื่อ Organization ---

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
        method: "PUT", // 💡 ใช้ PUT/PATCH เพื่ออัปเดตชื่อ
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to update name");

      alert("Organization name updated successfully!");
      // อัปเดต State ภายในและแจ้งหน้า AdminPage ให้ Refresh
      setData((prev) => (prev ? { ...prev, name: newName } : null));
      onSuccess();
      setIsEditingName(false);
    } catch (error) {
      console.error("Error updating name:", error);
      alert("Failed to save name.");
      setNewName(data?.name || ""); // Rollback
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center min-w-80">
        Loading organization details...
      </div>
    );
  }

  if (!data) return null;

  // --- Logic สำหรับการแสดงผล User Roles (Admin/Staff) ---
  const organizationAdmins = (data.userRoles || []).filter(
    (ur) => ur.role === "ORG_STAFF" || ur.role === "SYSTEM_ADMIN"
  );

  // --- Render Content ---

  const renderDetailContent = () => {
    switch (activeTab) {
      case "details":
        return (
          <div className="space-y-4">
            {/* --- ส่วนแสดงชื่อและปุ่มแก้ไข --- */}
            <div className="flex justify-between items-center border-b pb-2">
              <h4 className="text-lg font-medium text-gray-700">Name:</h4>
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
                    className="bg-green-500"
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
                Assigned Staff/Admins:
              </h4>
              {organizationAdmins.length === 0 ? (
                <p className="text-gray-500">
                  No staff or admins assigned yet.
                </p>
              ) : (
                <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {organizationAdmins.map((ur) => (
                    <li
                      key={ur.id}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded border"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">{ur.user.email}</span>
                        <span
                          className={`text-xs font-medium ${
                            ur.role === "SYSTEM_ADMIN"
                              ? "text-red-500"
                              : "text-blue-500"
                          }`}
                        >
                          Role: {ur.role.replace("_", " ")}
                        </span>
                      </div>
                      {/* 💡 ปุ่มลบ Admin (ต้องใช้ DELETE /user-roles/:id) */}
                      <Button
                        // onClick={() => handleDeleteUserRole(ur.id)}
                        variant="danger"
                        disabled={saving}
                        className="text-xs"
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );

      case "assign-role":
        // 💡 นำ UserRoleForm มาใช้ โดยใส่ค่าเริ่มต้น Organization ID ให้แล้ว
        return (
          <div className="pt-4">
            <UserRoleForm
              //ส่ง Organization ID ปัจจุบันไปให้ฟอร์ม
              initialOrganizationId={orgId}
              onSuccess={() => {
                fetchOrganizationDetails(); // ดึงข้อมูล Admin ใหม่
                onSuccess(); // แจ้ง AdminPage ให้รีเฟรช
                setActiveTab("details"); // กลับไปหน้ารายละเอียด
              }}
              onClose={() => setActiveTab("details")} // กลับไปหน้า details เมื่อ Cancel
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl min-w-[500px] max-w-lg shadow-2xl">
      <h3 className="text-2xl font-bold text-indigo-700 border-b pb-3 mb-4">
        Organization Details (ID: {orgId})
      </h3>

      {/* --- Tab Navigation ภายใน Modal --- */}
      <nav className="flex space-x-4 mb-4 border-b">
        <button
          onClick={() => setActiveTab("details")}
          className={`pb-2 border-b-2 ${
            activeTab === "details"
              ? "border-indigo-600 text-indigo-600 font-semibold"
              : "border-transparent text-gray-500"
          }`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab("assign-role")}
          className={`pb-2 border-b-2 ${
            activeTab === "assign-role"
              ? "border-indigo-600 text-indigo-600 font-semibold"
              : "border-transparent text-gray-500"
          }`}
        >
          Assign/Update Role
        </button>
      </nav>

      {/* --- Tab Content --- */}
      {renderDetailContent()}

      {/* --- ปุ่มปิด Modal หลัก --- */}
      <div className="flex justify-end pt-4 border-t mt-4">
        <Button onClick={onClose} variant="secondary">
          Close
        </Button>
      </div>
    </div>
  );
};
