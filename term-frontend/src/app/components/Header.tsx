import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm p-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">
          ⚙️ Equipment Loan System
        </h1>
        {/* Placeholder สำหรับ Profile/Logout */}
        <div className="text-gray-600">Admin User</div>
      </div>
    </header>
  );
};
