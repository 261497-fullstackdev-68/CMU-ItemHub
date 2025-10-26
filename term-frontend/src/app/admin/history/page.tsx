"use client";
import { useState, useEffect, useCallback } from "react";
import { Header } from "@components/Header";
import { Sidebar } from "@components/Sidebar";
import type { EquipmentLoan } from "@/app/type/requests";
import Navbar from "@/app/components/Navbar";

// 💡 สมมติว่า Admin Inventory Page ใช้ Role 'ORG_STAFF' ในการกำหนดสิทธิ์
const CURRENT_USER_ROLE: "USER" | "ORG_STAFF" | "SYSTEM_ADMIN" = "ORG_STAFF";

// 💡 Helper: จัดรูปแบบวันที่
const formatDate = (dateString: string | Date | undefined) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString.toString(); // Fallback
  }
};

// 💡 Helper: กำหนดสีตามสถานะ
const getStatusBadge = (status: EquipmentLoan["status"]) => {
  let colorClass = "bg-gray-100 text-gray-800";

  switch (status.toLowerCase()) {
    case "approved":
      colorClass = "bg-green-100 text-green-800";
      break;
    case "rejected":
      colorClass = "bg-red-100 text-red-800";
      break;
    case "returned":
      colorClass = "bg-indigo-100 text-indigo-800";
      break;
    case "pending":
    default:
      colorClass = "bg-yellow-100 text-yellow-800";
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}
    >
      {status.toUpperCase()}
    </span>
  );
};

const RequestPage: React.FC = () => {
  // เปลี่ยนชื่อจาก request เป็น requests เพื่อความชัดเจน
  const [requests, setRequests] = useState<EquipmentLoan[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false); // สถานะสำหรับปุ่ม Action

  // 💡 ใช้ useCallback เพื่อป้องกันการสร้างฟังก์ชันใหม่ซ้ำๆ
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/equipmentLoans`
      );
      if (!response.ok) throw new Error("Failed to fetch equipmentLoans.");

      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching equipmentLoans:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 💡 ฟังก์ชันจัดการ Approve/Reject (ใช้ Loan ID และ New Status)
  const handleUpdateStatus = async (
    loanId: number,
    newStatus: "approved" | "rejected" | "returned"
  ) => {
    if (
      !window.confirm(
        `ยืนยันการเปลี่ยนสถานะของคำขอ ID ${loanId} เป็น ${newStatus.toUpperCase()}?`
      )
    ) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/equipmentLoans/${loanId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update status.`);
      }

      alert(
        `คำขอ ID ${loanId} ได้รับการอัปเดตเป็น ${newStatus.toUpperCase()} สำเร็จ`
      );
      fetchRequests(); // รีเฟรชข้อมูลหลังอัปเดต
    } catch (error) {
      console.error("Error updating loan status:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const returnedRequestsCount = requests.filter(
    (r) => r.status.toLowerCase() === "returned"
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
            <h1 className="text-3xl font-bold text-gray-900">
              ประวัติการให้ยืม
            </h1>
          </div>

          {/* Summary Card */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 w-fit">
            <p className="text-sm font-medium text-gray-500">
              รายการที่เคยอนุมัติ
            </p>
            <p className="text-3xl font-bold text-yellow-600">
              {returnedRequestsCount}
            </p>
          </div>

          {/* Loading/Empty State */}
          {loading && (
            <div className="text-center p-10 text-gray-500">
              กำลังโหลดคำขอ...
            </div>
          )}
          {!loading && requests.length === 0 && (
            <div className="text-center p-10 text-gray-500 bg-white rounded-lg shadow-md">
              ไม่มีคำขออุปกรณ์ในขณะนี้
            </div>
          )}

          {/* 💡 GRID LAYOUT สำหรับแสดงคำขอ */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {requests
              .filter((loan) => loan.status === "returned")
              .map((loan) => (
                <div
                  key={loan.id}
                  className="bg-white p-5 border border-gray-200 rounded-xl shadow-lg flex flex-col justify-between"
                >
                  {/* Header and Status */}
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-bold text-gray-800 truncate">
                      อุปกรณ์ ID: {loan.equipmentId}
                    </h2>
                    {getStatusBadge(loan.status)}
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm text-gray-600 border-b pb-4">
                    <p>
                      <span className="font-semibold text-gray-900">
                        ผู้ยืม:
                      </span>{" "}
                      ID {loan.borrowerId}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">
                        จำนวน:
                      </span>{" "}
                      {loan.amount} หน่วย
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">
                        วันที่ยืม:
                      </span>{" "}
                      {formatDate(loan.borrowedAt)}
                      <span>{" - "}</span>
                      <span className="font-semibold text-gray-900">
                        วันที่คืน:
                      </span>{" "}
                      {loan.returnedAt ? (
                        formatDate(loan.returnedAt)
                      ) : (
                        <span className="text-red-500">ยังไม่ระบุ</span>
                      )}
                    </p>
                    {loan.note && (
                      <p className="pt-2 text-xs italic text-gray-500">
                        *หมายเหตุ: {loan.note}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex space-x-3">
                    {loan.status.toLowerCase() === "pending" ? (
                      <>
                        <button
                          onClick={() =>
                            handleUpdateStatus(loan.id, "approved")
                          }
                          disabled={saving}
                          className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                        >
                          ✅Approve
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(loan.id, "rejected")
                          }
                          disabled={saving}
                          className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                        >
                          ❌Reject
                        </button>
                      </>
                    ) : loan.status.toLowerCase() === "approved" ? (
                      <button
                        onClick={() => handleUpdateStatus(loan.id, "returned")}
                        disabled={saving}
                        className="w-full px-4 py-2 text-sm font-semibold text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition disabled:opacity-50"
                      >
                        Mark as Returned
                      </button>
                    ) : (
                      <span className="text-sm text-gray-500">
                        ดำเนินการเสร็จสิ้น
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RequestPage;
