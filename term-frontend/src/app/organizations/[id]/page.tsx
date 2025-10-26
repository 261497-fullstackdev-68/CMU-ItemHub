"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import api from "../../lib/api";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

interface Item {
  id: number;
  name: string;
  imageUrl: string;
  description?: string;
}

interface Organization {
  id: number;
  name: string;
}

export default function OrganizationItemsPage() {
  const router = useRouter();
  const { id } = useParams();
  console.log("id from useParams():", id);
  const orgId = id ? Number(id) : null;

  const [organization, setOrganization] = useState<Organization | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ ดึงข้อมูลหน่วยงาน
  const fetchOrganization = async () => {
    try {
      const res = await api.get(`/organizations/${orgId}`);
      console.log("Organization data:", res.data);
      setOrganization(res.data.organization || res.data);
    } catch (err) {
      console.error("Error fetching organization:", err);
    }
  };

  // ✅ ดึงรายการอุปกรณ์
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/equipment/findByOrganizationId/${orgId}`);
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orgId) {
      fetchOrganization();
      fetchItems();
    }
  }, [orgId]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div
          className="mb-4 text-gray-600 cursor-pointer hover:underline"
          onClick={() => router.back()}
        >
          &lt; กลับไปหน้าหลัก
        </div>

        <h1 className="text-2xl font-bold mb-6">{organization?.name}</h1>

        {loading ? (
          <div>กำลังโหลดข้อมูล...</div>
        ) : items.length === 0 ? (
          <div>ไม่พบอุปกรณ์ในหน่วยงานนี้</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded shadow hover:shadow-md transition"
                onClick={() => router.push(`/components/detail/${item.id}`)}
              >
                <div className="relative w-full h-40 mb-3 rounded overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="font-medium text-gray-800">{item.name}</div>
                {item.description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
