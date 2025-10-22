"use client";
import React, { useState } from "react";
import LotteryAdminList from "./lotteryList";
import HozoriAdminList from "../hozori/hozoriList";
import {
 
  FaList,
  FaCalendarCheck,
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
    {
      id: "hozori",
      label: "رزروهای حضوری",
      icon: <FaCalendarCheck className="text-lg" />,
      component: HozoriAdminList,
      description: "مشاهده و مدیریت تمام رزروهای حضوری",
    },
    // You can add more tabs here in the future like statistics, reports, etc.
  ];

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || LotteryAdminList;

  return (
    <div
      className="min-h-screen "
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-6 border-b border-gray-200 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div>
              <h1 className="md:text-3xl text-xl font-bold text-[#0A1D37]">
                مدیریت خدمات ارزی پلاس
              </h1>
              <p className="text-gray-600 text-xs md:text-sm mt-1">
                مدیریت کامل ثبت‌نام‌های لاتاری و رزروهای حضوری
              </p>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="grid grid-cols-3 justify-center items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center px-2 py-1 md:px-6 md:py-3 rounded-xl transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-[#0A1D37]/15 to-[#4DBFF0]/15 border-2 border-[#0A1D37]/30 text-[#0A1D37] shadow-lg transform scale-[1.02]"
                    : "hover:bg-gray-50 text-gray-700 hover:text-[#0A1D37] hover:shadow-md hover:scale-[1.01] border-2 border-transparent"
                }`}
              >
                <div className="text-center">
                  <p className="font-bold text-sm">{tab.label}</p>
                  <p className="  text-xs hidden md:block">{tab.description}</p>
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
