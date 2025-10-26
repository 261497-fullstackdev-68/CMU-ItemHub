"use client";
import Link from "next/link";
import axios from "axios";
import api from "../lib/api";
import Image from "next/image";

export default function LoginPage() {
  const CmuentraidURL = process.env.CMU_ENTRAID_URL as string;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200">
      <div className="rounded-2xl bg-white p-10 shadow-lg flex flex-col items-center text-center max-w-sm w-full">
        {/* โลโก้ */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/ItemHub.svg"
            alt="CMU ItemHub Logo"
            width={564}
            height={259}
            className="mb-2"
          />
        </div>

        {/* คำโปรย */}
        <p className="text-gray-700 mb-6">ยืมง่าย ใช้คล่อง ที่เดียวจบ!</p>
        <Link href={`${CmuentraidURL}`}>
          <Image
            src="/loginButton.svg"
            alt="CMU Logo"
            width={570}
            height={93}
            className="rounded-full flex items-center justify-center gap-2 bg-gradient-to-r hover:opacity-90 text-white font-medium px-6 py-3 rounded-full w-full transition-all"
          />
        </Link>
      </div>
    </div>
  );
}
