"use client";

import { useRef } from "react";
import React, { useState, useEffect, useCallback } from "react";
// 💡 นำเข้า Types ที่จำเป็น
import type { Equipment } from "@/app/type/equipment";
import type { CreateEquipmentDto } from "@/app/type/equipment";
import { Button } from "./Button";
import api from "@/app/lib/api";

// 💡 สร้าง Type สำหรับ Organization Item
interface OrganizationItem {
  id: number;
  name: string;
}

interface ItemFormProps {
  itemToEdit: Equipment | null;
  onClose: () => void;
  onSuccess: () => void;
  // 💡 แก้ไข: เปลี่ยนจาก Object เดียว เป็น Array ของ Organizations ที่เลือกได้
  selectOrg: number;
  organization: OrganizationItem[];
}

// ⚠️ ลบ initialFormData ที่อยู่ข้างนอก component ออก เพราะต้องเข้าถึง props ก่อน

const ItemForm: React.FC<ItemFormProps> = ({
  itemToEdit,
  onClose,
  onSuccess,
  selectOrg,
  organization,
}) => {
  const isEditing = !!itemToEdit;
  const title = isEditing ? "Edit Equipment" : "Add New Equipment";

  // 💡 สร้างค่าเริ่มต้นภายใน Component
  const initialFormData: CreateEquipmentDto = {
    organizationId: selectOrg,
    categoryId: null,
    name: "",
    imageUrl: "",
    imageName: "",
    description: null,
    totalQuantity: 1,
    isAvailable: true,
  };

  const [formData, setFormData] = useState<CreateEquipmentDto>(initialFormData);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);

  // --- Image Handling States ---
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // --- useEffect สำหรับตั้งค่า Form Data เมื่อเข้าสู่โหมด Add/Edit ---
  useEffect(() => {
    if (itemToEdit) {
      // โหมด Edit
      setFormData({
        organizationId: itemToEdit.organizationId,
        categoryId: itemToEdit.categoryId,
        name: itemToEdit.name,
        description: itemToEdit.description,
        totalQuantity: itemToEdit.totalQuantity,
        isAvailable: itemToEdit.isAvailable,
        imageUrl: itemToEdit.imageUrl || "",
        imageName: itemToEdit.imageName || "",
      });
      setImageFile(null);
    } else {
      // โหมด Add: ใช้ค่าเริ่มต้นและกำหนด Organization ID จากรายการแรก
      setFormData({
        ...initialFormData,
        organizationId: selectOrg, // ใช้ Organization ID เริ่มต้น
      });
      setImageFile(null);
    }
    setFileError(null);
  }, [itemToEdit, selectOrg]); // Dependency includes availableOrganizations

  useEffect(() => {
    const fetchCategories = async () => {
      setIsCategoriesLoading(true);
      try {
        // สมมติว่า api คือ instance ที่คุณใช้ fetch ข้อมูล
        const res = await api.get<Category[]>("categories");
        // สมมติว่า res.data เป็น array ของ categories
        const data: Category[] = res.data;

        setCategories(data);

        // 💡 ถ้าเป็นโหมด Add และยังไม่มี categoryId ใน formData ให้ตั้งค่าเริ่มต้นเป็นรายการแรก
        if (!itemToEdit && data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            categoryId: data[0].id, // ตั้งค่าเริ่มต้นเป็น ID แรก
          }));
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        // alert("ไม่สามารถดึงข้อมูลหมวดหมู่ได้");
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, [itemToEdit]);
  // --- Handle Change สำหรับ Input ธรรมดา ---
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    > // 💡 เพิ่ม HTMLSelectElement
  ) => {
    const target = e.target as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;
    const { name, value, type } = target;
    // Note: For select/textarea, target.checked will be undefined/false, so no issue here.
    const checked = (target as HTMLInputElement).checked;

    let processedValue: string | number | boolean | null;

    if (
      type === "number" ||
      name === "categoryId" ||
      name === "organizationId"
    ) {
      // 💡 แปลงค่าเป็นตัวเลขสำหรับ ID และ Quantity
      processedValue = value ? parseInt(value) : 0;
      if (name === "totalQuantity" && (processedValue as number) < 0)
        processedValue = 0; // ป้องกันติดลบ
    } else if (type === "checkbox") {
      processedValue = checked;
    } else {
      processedValue = value === "" && name === "description" ? null : value;
    }

    setFormData((prev: CreateEquipmentDto) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  // --- Handle Change สำหรับ Input File (เหมือนเดิม) ---
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

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/equipment${
      isEditing ? `/${itemToEdit!.id}` : ""
    }`;
    const method = isEditing ? "PUT" : "POST";

    // สร้าง FormData สำหรับส่งทั้งข้อมูลและไฟล์
    const data = new FormData();

    // 💡 ตรวจสอบ Organization ID ก่อนส่ง
    if (formData.organizationId === 0) {
      alert("Please select a valid Organization.");
      setLoading(false);
      return;
    }

    // ✅ เพิ่มไฟล์
    if (imageFile) {
      data.append("file", imageFile);
    }

    // ✅ เพิ่มฟิลด์อื่นๆ (ทุกค่าต้องเป็น string)
    data.append("organizationId", String(formData.organizationId));
    data.append("categoryId", String(formData.categoryId));
    data.append("name", formData.name);
    data.append("description", formData.description ?? "");
    data.append("totalQuantity", String(formData.totalQuantity));
    data.append("isAvailable", String(formData.isAvailable));

    try {
      const response = await fetch(url, {
        method,
        body: data,
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error(`API call failed: ${errorDetail}`);
      }

      onSuccess();
    } catch (error) {
      console.error(
        `Error ${isEditing ? "updating" : "creating"} equipment:`,
        error
      );
      alert(`Failed to ${isEditing ? "update" : "add"} item.`);
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 transition-opacity duration-300 p-4"
      onMouseDown={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg transform scale-100 max-h-[95vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">
          {organization.find((c) => c.id === selectOrg)?.name ??
            "ไม่พบหน่วยงาน"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 💡 Dropdown สำหรับเลือก Organization */}
          <div>
            <label htmlFor="organizationId" className="">
              เพิ่มอุปกรณ์ใหม่
            </label>
          </div>

          <hr className="my-4" />

          {/* Item Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              ชื่อ
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full text-gray-700 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Total Quantity */}
            <div>
              <label
                htmlFor="totalQuantity"
                className="block text-sm font-medium text-gray-700"
              >
                จำนวน
              </label>
              <input
                type="number"
                name="totalQuantity"
                id="totalQuantity"
                value={formData.totalQuantity}
                onChange={handleChange}
                required
                min="0"
                className="mt-1 block w-full text-gray-700 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Category ID */}
            <div>
              <label
                htmlFor="categoryId"
                className="block text-sm font-medium text-gray-700"
              >
                หมวดหมู่
              </label>
              <select // 💡 เปลี่ยนจาก input เป็น select
                name="categoryId"
                id="categoryId"
                value={formData.categoryId || ""} // ต้องให้เป็น string หรือ number
                onChange={handleChange} // ใช้ handleChange เดิมได้เลย
                required
                disabled={isCategoriesLoading}
                className="mt-1 block w-full text-gray-700 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
              >
                {isCategoriesLoading && (
                  <option value="" disabled>
                    กำลังโหลด...
                  </option>
                )}
                {/* 💡 เพิ่ม Default Option หากยังไม่ได้เลือก */}
                {!isCategoriesLoading && categories.length === 0 && (
                  <option value="" disabled>
                    ไม่พบหมวดหมู่
                  </option>
                )}
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.categoryName} ({category.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <hr className="my-4" />

          {/* 💡 Input อัปโหลดรูปภาพ (เหมือนเดิม) */}
          <div className="p-4 border border-dashed border-gray-300 rounded-md bg-gray-50">
            <label
              htmlFor="file-upload"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              อัปโหลดรูปภาพอุปกรณ์ (สูงสุด 5MB)
            </label>
            <input
              type="file"
              id="file-upload"
              name="file-upload"
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

            {/* แสดงรูปเดิมในโหมด Edit ถ้าไม่มีการเลือกไฟล์ใหม่ */}
            {isEditing && !imageFile && formData.imageUrl && (
              <p className="mt-2 text-xs text-gray-500">
                รูปภาพปัจจุบัน:{" "}
                <a
                  href={formData.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 truncate"
                >
                  {formData.imageName || formData.imageUrl}
                </a>
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              รายละเอียด (ไม่บังคับ)
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full text-gray-700 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Is Available Checkbox */}
          <div className="flex items-center pt-2">
            <input
              type="checkbox"
              name="isAvailable"
              id="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label
              htmlFor="isAvailable"
              className="ml-2 block text-sm font-medium text-gray-700"
            >
              ว่างให้ยืมได้
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              ยกเลิก
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "กำลังบันทึก..."
                : isEditing
                ? "อัพเดทอุปกรณ์"
                : "เพิ่มอุปกรณ์"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;
