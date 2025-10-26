"use client";

import React, { useState, useEffect } from "react";
// สมมตินำเข้า Header และ Sidebar จาก component เดิม
import { useParams, useRouter } from "next/navigation";
import api from "@/app/lib/api";
import Image from "next/image";
import Navbar from "@components/Navbar";
import BorrowModal from "../../../components/modal/borrowModal";

const EquipmentDetailPage: React.FC = () => {
  const [equipment, setEquipment] = useState<{}>();
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // สำหรับปฏิทิน
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const router = useRouter();
  const params = useParams();
  const equipmentId = params.id ? parseInt(params.id as string) : null;
  const [openBorrow, setOpenBorrow] = useState<boolean>(false);
  // const [loanData, setLoanData] = useState<{}>();
  // 💡 สมมติการ Fetch ข้อมูล
  useEffect(() => {
    if (equipmentId) {
      fetchEquipment(equipmentId);
    }
  }, [equipmentId]);

  const fetchEquipment = async (id: number) => {
    setLoading(true);
    try {
      const response = await api.get(`/equipment/${id}`);
      if (!response.data) throw new Error("Failed to fetch equipment.");

      const data = await response.data;
      setEquipment(data);
      setAvailableQuantity(data.quantityAvailable);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(year, month, day);
    setSelectedDate(newDate);
  };

  const handleSubmit = async (data: {
    borrowedAt: string;
    returnedAt: string;
    amount: number;
  }) => {
    console.log("Borrow form:", data);
    const loanData = {
      equipmentId: equipment?.id,
      amount: data.amount,
      status: "pending",
      borrowedAt: new Date(data.borrowedAt),
      returnedAt: new Date(data.returnedAt),
      note: "",
    };

    const res = await api.post("/equipmentLoans", loanData);
    if (!res.data.ok) {
      alert("cannot create loans");
      return;
    }
    alert("loan success. please waiting for approval");
    setAvailableQuantity(availableQuantity - data.amount);
    setOpenBorrow(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        Loading Details...
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        Equipment not found.
      </div>
    );
  }

  const monthNames = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  console.log(equipment);
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

      <div className="flex flex-1 pt-0">
        {/* --- Main Content --- */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div
            className="mb-4 text-gray-600 cursor-pointer hover:underline ml-20"
            onClick={() => router.push("/home")}
          >
            &lt; กลับไปหน้าหลัก
          </div>

          {/* --- Detail Card Container --- */}
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden p-6 max-w-[1300px] mx-auto">
            <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8">
              {/* --- 2/3 (ซ้าย): รายละเอียดอุปกรณ์ --- */}
              <div className="w-full md:w-2/3 space-y-6">
                {/* 💡 กรอบสี่เหลี่ยมสำหรับรูปภาพ (ตามคำขอ) */}
                <div className="flex space-x-6">
                  <div className="w-1/3 p-4 border rounded-lg bg-gray-200 flex items-center justify-center">
                    {/* ตัวแทนรูปภาพ */}
                    <Image
                      src={equipment.imageUrl}
                      alt={equipment.name}
                      width={200}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* รายละเอียดข้อความ */}
                  <div className="w-2/3">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
                      {equipment.name}
                    </h1>

                    <div className="space-y-2 text-lg text-gray-700">
                      <p className="text-base">
                        <span className="font-semibold text-gray-500">
                          หมวดหมู่:
                        </span>{" "}
                        {equipment.category.categoryName}
                      </p>
                      <p className="text-base">
                        <span className="font-semibold text-gray-500">
                          หน่วยงาน/คณะ/วิทยาลัย:
                        </span>{" "}
                        {equipment.organization.name}
                      </p>
                      <p className="mt-3">
                        <span className="font-semibold text-gray-800 block mb-1">
                          รายละเอียด:
                        </span>
                        {equipment.description}
                      </p>
                      <p className="text-xl pt-3 font-bold text-red-600">
                        จำนวนทั้งหมด {availableQuantity} เครื่อง
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t flex justify-end">
                  <button
                    className="text-white px-6 py-2 rounded-lg text-lg hover:brightness-110 transition w-40"
                    style={{ backgroundColor: "#A72150" }}
                    onClick={() => {
                      setOpenBorrow(true);
                    }}
                  >
                    ยืม
                  </button>
                </div>
              </div>

              {/* --- 1/3 (ขวา): ปฏิทิน --- */}
              <div className="w-full md:w-1/3 flex flex-col items-center p-4 bg-gray-50 rounded-lg border">
                <div className="w-full mb-6">
                  <div className="flex justify-between items-center text-lg font-semibold mb-2">
                    <button
                      className="text-gray-600 hover:text-gray-900"
                      onClick={() => setMonth(month === 0 ? 11 : month - 1)}
                    >
                      &larr;
                    </button>
                    <span>
                      {monthNames[month]} {year + 543}
                    </span>
                    <button
                      className="text-gray-600 hover:text-gray-900"
                      onClick={() => setMonth(month === 11 ? 0 : month + 1)}
                    >
                      &rarr;
                    </button>
                  </div>

                  <div className="grid grid-cols-7 text-sm text-center border-t border-b py-2">
                    {["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."].map((d) => (
                      <span key={d} className="font-medium text-gray-500">
                        {d}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 text-sm text-center mt-2">
                    {Array.from({ length: firstDay }).map((_, i) => (
                      <span key={`empty-${i}`} className="py-1" />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const key = `${year}-${String(month + 1).padStart(
                        2,
                        "0"
                      )}-${String(day).padStart(2, "0")}`;
                      const isSelected = selectedDate;
                      return (
                        <button
                          key={day}
                          onClick={() => handleDateClick(day)}
                          className={`py-2 rounded-full w-10 h-10 flex items-center justify-center mx-auto transition ${
                            isSelected
                              ? "bg-[#A72150] text-white font-bold"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* สถานะคงเหลือ */}
                <div className="w-full p-4 border rounded-lg bg-red-50 flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    {/* <CalendarIcon className="w-6 h-6 text-red-600" /> */}
                    {/* <span className="text-xl font-bold text-red-800">15</span> */}
                  </div>
                  <span className="text-xl font-bold text-red-800">
                    {/* เหลือจำนวน {equipment.availableQuantity} เครื่อง */}
                  </span>
                </div>
              </div>

              {/* borrow modal */}
              {openBorrow && (
                <BorrowModal
                  itemName={equipment.name}
                  onClose={() => setOpenBorrow(false)}
                  onSubmit={handleSubmit}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EquipmentDetailPage;
