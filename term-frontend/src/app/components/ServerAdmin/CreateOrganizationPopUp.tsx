"use client";

import React, { useState } from "react";
import { Button } from "../Admin/Button";

interface CreateOrganizationDto {
  name: string;
  adminId?: number; // เผื่ออนาคตเพิ่มได้
}

interface OrganizationFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const OrganizationForm: React.FC<OrganizationFormProps> = ({
  onSuccess,
  onClose,
}) => {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const maxFileSize = 5 * 1024 * 1024; // 5MB

      if (!file.type.startsWith("image/")) {
        setFileError("Invalid file type. Please select an image.");
        setImageFile(null);
        e.target.value = "";
        return;
      }

      if (file.size > maxFileSize) {
        setFileError("File size exceeds 5MB limit.");
        setImageFile(null);
        e.target.value = "";
        return;
      }

      setFileError(null);
      setImageFile(file);
    } else {
      setImageFile(null);
      setFileError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/organizations`;

      // ✅ ใช้ FormData สำหรับส่ง multipart/form-data
      const formData = new FormData();
      formData.append("name", name);
      if (imageFile) {
        formData.append("file", imageFile);
      }

      // ถ้ามี adminId เช่น user ปัจจุบัน
      // formData.append("adminId", currentUser.id.toString());

      const response = await fetch(url, {
        method: "POST",
        body: formData, // ❗ ห้ามใส่ Content-Type เอง
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to create organization: ${response.status}`);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating organization:", error);
      alert("Failed to add organization.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded">
      <h3 className="text-xl font-semibold ">Add New Organization</h3>

      {/* 🏢 Organization Name */}
      <div>
        <label
          htmlFor="orgName"
          className="block text-sm font-medium text-gray-700"
        >
          Organization Name
        </label>
        <input
          type="text"
          id="orgName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      {/* 🖼 Upload Image */}
      <div className="p-4 border border-dashed border-gray-300 rounded-md bg-gray-50">
        <label
          htmlFor="file-upload"
          className="block text-sm font-bold text-gray-700 mb-2"
        >
          อัปโหลดรูปภาพองค์กร (สูงสุด 5MB)
        </label>
        <input
          type="file"
          id="file-upload"
          name="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100
              "
        />
        {imageFile && (
          <p className="mt-2 text-sm text-green-600">
            Selected: {imageFile.name}
          </p>
        )}
        {fileError && (
          <p className="mt-2 text-sm text-red-600 font-medium">
            ⚠️ {fileError}
          </p>
        )}
      </div>

      {/* 🔘 Buttons */}
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Organization"}
        </Button>
      </div>
    </form>
  );
};
