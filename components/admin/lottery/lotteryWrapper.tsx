"use client";
import React, { useState } from "react";
import LotteryAdminList from "./lotteryList";
import {
  FaUsers,
  FaChartBar,
  FaList,
} from "react-icons/fa";

const LotteryAdminWrapper = () => {
  const [activeTab, setActiveTab] = useState("list");

  const tabs = [
    {
      id: "list",
      label: "لیست ثبت‌نام‌ها",
      icon: <FaList className="text-lg" />,
      component: LotteryAdminList,
      description: "مشاهده و مدیریت تمام ثبت‌نام‌های لاتاری",
    },
    // You can add more tabs here in the future like statistics, reports, etc.
  ];

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component || LotteryAdminList;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-6 border-b border-gray-200 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] rounded-2xl flex items-center justify-center shadow-lg">
              <FaUsers className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0A1D37]">
                مدیریت ثبت‌نام‌های لاتاری
              </h1>
              <p className="text-gray-600 mt-1">
                مدیریت کامل درخواست‌های ثبت‌نام در قرعه‌کشی گرین کارت آمریکا
              </p>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-[#FF7A00]/15 to-[#4DBFF0]/15 border-2 border-[#FF7A00]/30 text-[#0A1D37] shadow-lg transform scale-[1.02]"
                    : "hover:bg-gray-50 text-gray-700 hover:text-[#0A1D37] hover:shadow-md hover:scale-[1.01] border-2 border-transparent"
                }`}
              >
                <div
                  className={`flex-shrink-0 p-2 rounded-lg ${
                    activeTab === tab.id
                      ? "text-[#FF7A00] bg-white/70 shadow-md"
                      : "text-gray-500 group-hover:text-[#FF7A00] group-hover:bg-[#FF7A00]/10"
                  } transition-all duration-300`}
                >
                  {tab.icon}
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{tab.label}</p>
                  <p className="text-xs opacity-70">{tab.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="pb-8">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};

export default LotteryAdminWrapper;