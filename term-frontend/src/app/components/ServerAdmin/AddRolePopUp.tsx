"use client";

import React, { useState } from "react";
import { Button } from "../Admin/Button";
import { SearchSelect } from "./AssignRole_DropDown";
import { init } from "next/dist/compiled/webpack/webpack";

interface CreateUserRoleDto {
  userId: number;
  organizationId: number;
  role: "USER" | "ORG_STAFF" | "SYSTEM_ADMIN";
}

interface UserRoleFormProps {
  onSuccess: () => void;
  onClose: () => void;
  initialOrganizationId?: number;
}

export const UserRoleForm: React.FC<UserRoleFormProps> = ({
  onSuccess,
  onClose,
  initialOrganizationId,
}) => {
  const [formData, setFormData] = useState<CreateUserRoleDto>({
    userId: 0,
    organizationId: initialOrganizationId || 0,
    role: "USER", // กำหนดค่าเริ่มต้น
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.userId === 0 || formData.organizationId === 0) {
      alert(
        "Please select both User and Organization using the search fields."
      );
      setLoading(false);
      return;
    }

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/userRoles`;

    try {
      console.log("Submitting form data:", JSON.stringify(formData)); // Debug log
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      if (response.ok) {
        onSuccess();
        onClose();
        return;
      }

      const errorData = await response.json();
      let errorMessage = "Failed to assign user role. Please try again.";

      if (response.status === 400 || response.status === 404) {
        if (errorData && errorData.message) {
          if (Array.isArray(errorData.message)) {
            errorMessage = errorData.message.join(", ");
          } else {
            errorMessage = errorData.message;
          }
        } else {
          errorMessage = `The submission failed (Status: ${response.status}). Check if User ID or Organization ID exists.`;
        }
      } else {
        errorMessage = `Operation failed (Status: ${response.status}).`;
      }

      throw new Error(errorMessage);
    } catch (error) {
      console.error("Error creating user role:", error);
      alert(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleIdSelect = (name: "userId" | "organizationId", id: number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: id,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-white rounded-xl shadow-2xl border border-indigo-300 animate-fadeIn"
    >
      <h3 className="text-2xl font-bold text-indigo-700">Assign User Role</h3>

      <div>
        <label
          htmlFor="userId"
          className="block text-sm font-medium text-gray-700"
        ></label>
        <SearchSelect
          label="User"
          value={formData.userId}
          onSelect={(id) => handleIdSelect("userId", id)}
          searchType="user"
          required={true}
        />
      </div>

      {/* 💡 Organization ID: ใช้ SearchSelect */}
      <div>
        <label
          htmlFor="organizationId" // label นี้อาจไม่จำเป็นแล้วเมื่อใช้ SearchSelect
          className="block text-sm font-medium text-gray-700"
        ></label>
        <SearchSelect
          label="Organization"
          value={formData.organizationId}
          onSelect={(id) => handleIdSelect("organizationId", id)}
          searchType="org"
          required={true}
        />
      </div>

      {/* Role Selection */}
      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700"
        >
          Role
        </label>
        <select
          name="role"
          id="role"
          value={formData.role}
          // 💡 ใช้ handleChange ที่จัดการ Select
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="USER">Member</option>
          <option value="ORG_STAFF">Staff</option>
          <option value="SYSTEM_ADMIN">System Admin</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        {/* <Button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition shadow-md"
        >
          Cancel
        </Button> */}
        <Button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md"
        >
          {loading ? "Assigning..." : "Assign Role"}
        </Button>
      </div>
    </form>
  );
};
