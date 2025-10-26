"use client";
import axios from "axios";
import Image from "next/image";
import { redirect } from "next/navigation";
import Navbar from "@components/Navbar";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ServerAdminPage from "@/app/serverAdmin/page";
import InventoryPage from "@/app/admin/inventory/page";
import api from "../lib/api";

interface Organization {
  id: number;
  name: string;
  description?: string;
  imageName: string;
  imageUrl?: string;
  createAt?: string;
  updateAt?: string;
}

export default function HomePage() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchOrg() {
    try {
      const res = await api.get("/organizations");
      console.log(res.data);
      // แปลงข้อมูลให้ตรงกับ Organization interface
      const orgData = res.data;
      setOrganizations(orgData);
      // console.log(orgData.imageUrl)
      // console.log(orgData)
      setLoading(false);
    } catch (err) {
      console.error("Error fetching organizations:", err);
      setLoading(false);
    }
  }
  useEffect(() => {
    // เรียก API ดึงข้อมูลองค์กร
    fetchOrg();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-6">
        <h1 className="text-2xl font-bold mb-8">หน่วยงาน / คณะ / วิทยาลัย</h1>

        {loading ? (
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-start">
            {organizations.map((org, index) => (
              <div
                key={`org-${index}`}
                className="cursor-pointer flex flex-col items-center transition hover:scale-105"
                onClick={() => router.push(`/organizations/${org.id}`)}
              >
                {org.imageUrl && (
                  <div className="w-[160px] h-[160px] rounded-[10px] border border-gray-300 overflow-hidden mb-3">
                    <Image
                      src={org.imageUrl}
                      alt={org.name}
                      width={160}
                      height={160}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <h2 className="text-lg font-semibold text-center">
                  {org.name}
                </h2>
                {org.description && (
                  <p className="text-sm text-gray-600 text-center mt-1">
                    {org.description}
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
