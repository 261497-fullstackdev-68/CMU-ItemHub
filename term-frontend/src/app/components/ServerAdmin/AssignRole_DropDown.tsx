"use client";

import React, { useState, useEffect } from "react";

interface SearchItem {
  id: number;
  name: string;
}

export interface SearchSelectProps {
  label: string;
  value: number;
  onSelect: (id: number) => void;
  searchType: "user" | "org";
  required?: boolean;
}

// ฟังก์ชันสำหรับดึงข้อมูลทั้งหมดจาก Backend
const fetchAllData = async (type: "user" | "org"): Promise<SearchItem[]> => {
  const endpoint = type === "user" ? "/users/getAllUsers" : "/organizations";
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      console.error(`Failed to fetch all ${type}s: ${response.statusText}`);
      return [];
    }

    const data: any[] = await response.json();

    // 💡 Map ข้อมูลให้เป็นรูปแบบ { id: number, name: string }
    return data.map((item) => ({
      id: item.id,
      // สมมติว่า users มี field 'email' หรือ 'username' และ orgs มี field 'name'
      name:
        type === "user"
          ? item.username || item.email || `User ${item.id}`
          : item.name || `Org ${item.id}`,
    }));
  } catch (error) {
    console.error(`Error fetching all ${type}s:`, error);
    return [];
  }
};

// --------------------------------------------------------------------------------
// 💡 Component SearchSelect
// --------------------------------------------------------------------------------

export const SearchSelect: React.FC<SearchSelectProps> = ({
  label,
  value,
  onSelect,
  searchType,
  required,
}) => {
  const [query, setQuery] = useState("");
  const [allData, setAllData] = useState<SearchItem[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [displayValue, setDisplayValue] = useState("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // 💡 NEW STATE: ใช้เพื่อตรวจสอบว่า input ได้รับ Focus หรือไม่
  const [isFocused, setIsFocused] = useState(false);

  // 1. useEffect: โหลดข้อมูลทั้งหมด (เหมือนเดิม)
  useEffect(() => {
    if (!isDataLoaded) {
      setLoading(true);
      fetchAllData(searchType)
        .then((data) => {
          setAllData(data);
          setIsDataLoaded(true);
        })
        .catch((error) => {
          console.error(error);
          alert(`Failed to load all ${searchType} data.`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [searchType, isDataLoaded]);

  // 2. useEffect: ทำการ Filter ข้อมูลเมื่อ query เปลี่ยนแปลง หรือเมื่อ Focus ครั้งแรก
  useEffect(() => {
    const lowerCaseQuery = query.toLowerCase().trim();

    //ถ้าไม่มี query แต่ได้รับ Focus ให้แสดง 10 รายการแรก
    if (!lowerCaseQuery && isFocused) {
      setFilteredResults(allData.slice(0, 10));
      return;
    }

    // ถ้าไม่มี query และไม่ได้ Focus ให้ซ่อน Dropdown
    if (!lowerCaseQuery && !isFocused) {
      setFilteredResults([]);
      return;
    }

    //Local Filtering Logic (เมื่อมี query)
    const results = allData
      .filter(
        (item) =>
          item.name.toLowerCase().includes(lowerCaseQuery) ||
          item.id.toString().includes(lowerCaseQuery)
      )
      .slice(0, 10);

    setFilteredResults(results);
  }, [query, allData, isFocused]); // 💡 เพิ่ม isFocused ใน Dependency Array

  //Logic สำหรับการเลือก Itemช
  const handleSelect = (item: SearchItem) => {
    onSelect(item.id);
    setQuery("");
    setFilteredResults([]);
    setDisplayValue(`${item.name} (ID: ${item.id})`);
    setIsFocused(false); // 💡 ปิด Dropdown เมื่อเลือกเสร็จ
  };

  //การจัดการการแสดงผลเมื่อโหลดครั้งแรกช
  useEffect(() => {
    // ... (Logic เหมือนเดิม) ...
  }, [value, displayValue, isDataLoaded, allData]);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        placeholder={
          isDataLoaded
            ? `Search ${label} (Total: ${allData.length})`
            : `Loading ${label} data...`
        }
        value={query || displayValue}
        onChange={(e) => {
          setQuery(e.target.value);
          setDisplayValue("");
          onSelect(0); // Clear ID ใน Form Data
        }}
        // 💡 NEW: ตั้งค่า Focus และ Blur Handler
        onFocus={() => setIsFocused(true)}
        // 💡 onBlur ต้องมี Delay เล็กน้อยเพื่อให้ handleSelect (onMouseDown) ทำงานได้
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        disabled={loading}
        required={required && value === 0}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
      />

      {/* 💡 JSX สำหรับ Dropdown Results - แสดงเมื่อ isFocused และมีผลลัพธ์ */}
      {(isFocused && filteredResults.length > 0) || loading ? ( // 💡 เงื่อนไขการแสดงผล
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
          {loading ? (
            <li className="p-2 text-sm text-gray-500">Loading all data...</li>
          ) : (
            filteredResults.map((item) => (
              <li
                key={item.id}
                // 💡 ใช้ onMouseDown เพื่อไม่ให้เกิด onBlur ก่อนที่จะคลิกได้
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(item);
                }}
                className="p-2 cursor-pointer hover:bg-indigo-100 flex justify-between items-center text-sm"
              >
                <span className="font-medium truncate">{item.name}</span>
                <span className="text-xs text-gray-500 ml-2">
                  ID: {item.id}
                </span>
              </li>
            ))
          )}
          {/* 💡 แสดงสถานะเมื่อไม่พบข้อมูล (ถ้ามีการพิมพ์ query) */}
          {query.trim() !== "" && filteredResults.length === 0 && !loading && (
            <li className="p-2 text-sm text-gray-500">
              No results found for "{query}".
            </li>
          )}
        </ul>
      ) : null}

      {value !== 0 && (
        <p className="text-xs text-green-600 mt-1">Selected ID: **{value}**</p>
      )}
    </div>
  );
};
