"use client";
import React, { useState } from "react";
import CustomerLotteryList from "./lotteryList";
import CustomerHozoriList from "../hozori/hozoriList";
import { FaTicketAlt, FaPlus, FaList, FaCalendarCheck } from "react-icons/fa";
import Link from "next/link";

const CustomerLotteryWrapper = () => {
  const [activeTab, setActiveTab] = useState("list");

  const tabs = [
    {
      id: "list",
      label: "ثبت‌نام‌های من",
      icon: <FaList className="text-lg" />,
      component: CustomerLotteryList,
      description: "مشاهده تمام ثبت‌نام‌های لاتاری شما",
    },
    {
      id: "hozori",
      label: "رزروهای حضوری",
      icon: <FaCalendarCheck className="text-lg" />,
      component: CustomerHozoriList,
      description: "مشاهده تمام رزروهای حضوری شما",
    },
    // You can add more tabs here in the future like history, statistics, etc.
  ];

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || CustomerLotteryList;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section - Enhanced spacing and responsive design */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-6 sm:mb-8">
          {/* Top Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6 sm:mb-8">
            {/* Title Section */}
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <FaTicketAlt className="text-white text-2xl sm:text-3xl" />
              </div>
              <div className="space-y-1.5">
                <h1 className="text-xl  lg:text-3xl font-bold text-[#0A1D37] leading-tight">
                  خدمات من
                </h1>
                <p className="text-xs sm:text-base text-gray-600 leading-relaxed">
                  مدیریت ثبت‌نام‌های لاتاری و رزروهای حضوری
                </p>
              </div>
            </div>

            {/* New Registration Button */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/lottery/form"
                className="
                  flex items-center justify-center gap-3
                  px-6 sm:px-8 py-3.5 sm:py-4
                  bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] 
                  text-white font-bold
                  rounded-xl sm:rounded-2xl
                  hover:shadow-2xl hover:scale-105 
                  active:scale-95
                  transition-all duration-300
                  shadow-lg
                  w-full lg:w-auto
                  text-sm sm:text-base
                  group
                "
              >
                <FaPlus className="text-base  sm:text-lg group-hover:rotate-90 transition-transform duration-300" />
                <span>ثبت‌نام آنلاین</span>
              </Link>

              <Link
                href="/lottery/form/present"
                className="
                  flex items-center justify-center gap-3
                  px-6 sm:px-8 py-3.5 sm:py-4
                  bg-gradient-to-l from-[#0A1D37] to-[#4DBFF0] 
                  text-white font-bold
                  rounded-xl sm:rounded-2xl
                  hover:shadow-2xl hover:scale-105 
                  active:scale-95
                  transition-all duration-300
                  shadow-lg
                  w-full lg:w-auto
                  text-sm sm:text-base
                  group
                "
              >
                <FaCalendarCheck className="text-base sm:text-lg group-hover:scale-110 transition-transform duration-300" />
                <span>رزرو حضوری</span>
              </Link>
            </div>
          </div>

          {/* Tabs Navigation - Improved design */}
          <div className="relative">
            <div className="grid grid-cols-2 justify-center items-center gap-1  ">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group
                    flex   items-center gap-3 sm:gap-4
                    px-2  py-3.5 sm:py-4
                    rounded-xl sm:rounded-2xl
                    transition-all duration-300
                     min-w-fit
                    ${
                      activeTab === tab.id
                        ? `
                          bg-gradient-to-r from-[#0A1D37]/15 to-[#4DBFF0]/15 
                          border-2 border-[#0A1D37]/40 
                          text-[#0A1D37] 
                           
                          scale-[1.03]
                        `
                        : `
                          bg-gray-50 
                          hover:bg-gray-100 
                          text-gray-700 
                          hover:text-[#0A1D37] 
                          hover:shadow-lg 
                          hover:scale-[1.02] 
                          border-2 border-gray-200
                          hover:border-gray-300
                        `
                    }
                  `}
                >
                  {/* Icon Container */}
                  <div
                    className={`
                      flex-shrink-0 
                      md:p-2 sm:p-2.5
                      rounded-lg sm:rounded-xl
                      transition-all duration-300
                      ${
                        activeTab === tab.id
                          ? "text-[#0A1D37]  shadow-md scale-110"
                          : "text-gray-500   group-hover:text-[#0A1D37] group-hover:bg-[#0A1D37]/10 group-hover:scale-105"
                      }
                    `}
                  >
                    {tab.icon}
                  </div>

                  {/* Text Content */}
                  <div className="text-right space-y-0.5">
                    <p className="font-bold text-xs sm:text-base">
                      {tab.label}
                    </p>
                    <p className="text-xs sm:text-sm hidden md:block opacity-75 leading-tight max-w-[200px]">
                      {tab.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content - Better container */}
        <div
          className="
          bg-white 
          rounded-2xl 
          shadow-lg 
          border border-gray-100 
          p-6 sm:p-8
          min-h-[400px]
          animate-in fade-in duration-500
        "
        >
          <ActiveComponent />
        </div>
 
      </div>
    </div>
  );
};

export default CustomerLotteryWrapper;
