"use client";

import { useState } from "react";
import { X, Calendar, Minus, Plus } from "lucide-react";

interface BorrowModalProps {
  itemName: string;
  onClose: () => void;
  onSubmit: (data: {
    borrowedAt: string;
    returnedAt: string;
    amount: number;
  }) => void;
}

export default function BorrowModal({
  itemName,
  onClose,
  onSubmit,
}: BorrowModalProps) {
  const [borrowedAt, setBorrowedAt] = useState('');
  const [returnedAt, setReturnedAt] = useState('');
  const [amount, setamount] = useState(0);

  const handleSubmit = () => {
    onSubmit({ borrowedAt, returnedAt, amount });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[420px] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="font-semibold text-gray-900 mb-1">ชื่ออุปกรณ์ :</h2>

        {/* Item name (readonly) */}
        <div className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md mb-4">
          {itemName}
        </div>

        {/* Borrow Date */}
        <label className="block mb-1 text-gray-700">วันที่ยืม :</label>
        <div className="flex items-center border border-gray-400 rounded-md mb-3">
          <input
            type="date"
            value={borrowedAt}
            onChange={(e) => setBorrowedAt(e.target.value)}
            className="w-full p-2 rounded-l-md outline-none"
          />
          {/* <div className="p-2 border-l border-gray-400 bg-white rounded-r-md">
            <Calendar size={18} />
          </div> */}
        </div>

        {/* Return Date */}
        <label className="block mb-1 text-gray-700">วันที่คืน :</label>
        <div className="flex items-center border border-gray-400 rounded-md mb-3">
          <input
            type="date"
            value={returnedAt}
            onChange={(e) => setReturnedAt(e.target.value)}
            className="w-full p-2 rounded-l-md outline-none"
          />
          {/* <div className="p-2 border-l border-gray-400 bg-white rounded-r-md">
            <Calendar size={18} />
          </div> */}
        </div>

        {/* Quantity Selector */}
        <label className="block mb-1 text-gray-700">จำนวน :</label>
        <div className="flex items-center justify-center border border-gray-400 rounded-md w-[160px] mb-6">
          <button
            onClick={() => setamount((q) => Math.max(0, q - 1))}
            className="px-3 py-1 text-lg text-gray-700 hover:bg-gray-100"
          >
            <Minus size={18} />
          </button>
          <span className="w-10 text-center">{amount}</span>
          <button
            onClick={() => setamount((q) => q + 1)}
            className="px-3 py-1 text-lg text-gray-700 hover:bg-gray-100"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-[#A32857] text-white px-6 py-2 rounded-md hover:bg-[#8c1f4b] transition"
          >
            ยืม
          </button>
        </div>
      </div>
    </div>
  );
}
