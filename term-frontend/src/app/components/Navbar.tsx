"use client";

import Image from "next/image";
import {
  Bell,
  ShoppingCart,
  User,
  LogOut,
  Heart,
  BookOpen,
  HelpCircle,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import api from "@/app/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchUserInfo } from "../utils/fetchUserInfo";
import { Users } from "../type/users";

export default function Navbar() {
  interface RoleData {
    organizationId: number | null;
    role: string;
  }

  const [showMenu, setShowMenu] = useState(false);
  const [roles, setRoles] = useState<RoleData[]>();
  const [user, setUser] = useState<Users>();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();



  const handleMouseEnter = () => {
    // Cancel any pending timeout
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    // Delay hiding the menu by 200ms
    timeoutRef.current = setTimeout(() => {
      setShowMenu(false);
    }, 200);
  };

  async function signOut() {
    await api.post(`/auth/logout`);
    router.push(process.env.CMU_ENTRAID_LOGOUT_URL);
  }

  useEffect(() => {
    const loadUser = async () => {
      const data = await fetchUserInfo();
      setUser(data.user);
      setRoles(data.roles);
    };

    loadUser();
  }, []);
  if (!user && !roles) return <p>Loading...</p>;

  const hasOrgStaff = roles!.some((r) => r.role === "ORG_STAFF");
  const hasSystemAdmin = roles!.some((r) => r.role === "SYSTEM_ADMIN");


  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-3 py-2">
        {/* Left side — Logo */}
        <div className="flex items-center gap-2">
          <button
            className="cursor-pointer"
            onClick={() => {
              router.push("/home");
            }}
          >
            <Image
              src="/ItemHub.svg"
              alt="CMU ItemHub Logo"
              width={150}
              height={100}
            />
          </button>
        </div>

        {/* Right side — Icons */}
        <div className="flex items-center gap-6 text-black">
          {/* <button className="hover:text-pink-600 transition">
            <Bell size={22} />
          </button>
          <button className="hover:text-pink-600 transition">
            <ShoppingCart size={22} />
          </button> */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="flex items-center gap-1 hover:text-pink-600 transition">
              <User size={22} />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mt-[2px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="p-4 text-center border-b border-gray-200">
                  <div className="flex flex-col items-center">
                    <User size={40} className="mb-1" />
                                        <p className="font-semibold">{`${user?.firstname} ${user?.lastname}`}</p>

                    <p className="text-sm text-gray-500">
                      {`${user?.email}`}
                    </p>
                  </div>
                </div>

                <ul className="text-gray-700">
                  {hasOrgStaff && (
                    <li
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        router.push("/admin");
                      }}
                    >
                      <Heart size={20} />
                      องค์กรของฉัน
                    </li>
                  )}

                  {hasSystemAdmin && (
                    <li
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        router.push("/serverAdmin");
                      }}
                    >
                      <HelpCircle size={20} />
                      จัดการองค์กรทั้งหมด
                    </li>
                  )}
                  {/* <li
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      router.push("/history");
                    }}
                  >
                    <BookOpen size={20} />
                    ประวัติการยืม
                  </li> */}
                  <li
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer text-red-600 border-t border-gray-200"
                    onClick={signOut}
                  >
                    <LogOut className="gap-3" size={20} />
                    ออกจากระบบ
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
