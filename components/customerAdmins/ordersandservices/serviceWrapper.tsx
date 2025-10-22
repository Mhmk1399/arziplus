"use client";

import React, { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaHistory,
  FaFileContract,
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { showToast } from "@/utilities/toast";

// Import customer components
import ServicesPage from "@/app/services/page";
import CustomerRequestsTable from "./orderHistory";
import TermsPage from "./TermsPage";

interface ServiceWrapperProps {
  initialTab?: "services" | "orders" | "terms";
  className?: string;
}

interface UserStats {
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  rejectedRequests: number;
}

const ServiceWrapper: React.FC<ServiceWrapperProps> = ({
  initialTab = "services",
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState<"services" | "orders" | "terms">(
    initialTab
  );
  const [userStats, setUserStats] = useState<UserStats>({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    rejectedRequests: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const { user: currentUser, isLoggedIn } = useCurrentUser();

  // Fetch user statistics
  const fetchUserStats = async () => {
    if (!isLoggedIn) {
      setStatsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/customer/requests/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setUserStats({
          totalRequests: data.stats.totalRequests || 0,
          pendingRequests: data.stats.pendingRequests || 0,
          completedRequests: data.stats.completedRequests || 0,
          rejectedRequests: data.stats.rejectedRequests || 0,
        });
      } else {
        console.log("Failed to fetch user stats:", data.error);
      }
    } catch (error) {
      console.log("Error fetching user stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserStats();
    } else {
      setStatsLoading(false);
    }
  }, [isLoggedIn]);

  // Tab configuration
  const tabs = [
    {
      id: "services" as const,
      label: "خدمات",
      icon: <FaShoppingCart className="text-lg sm:text-xl" />,
      description: "مشاهده و سفارش خدمات",
      component: ServicesPage,
    },
    {
      id: "orders" as const,
      label: "سفارشات من",
      icon: <FaHistory className="text-lg sm:text-xl" />,
      description: "تاریخچه و وضعیت سفارشات",
      component: CustomerRequestsTable,
      badge:
        userStats.pendingRequests > 0 ? userStats.pendingRequests : undefined,
    },
    {
      id: "terms" as const,
      label: "قوانین و شرایط",
      icon: <FaFileContract className="text-lg sm:text-xl" />,
      description: "شرایط استفاده از خدمات",
      component: TermsPage,
    },
  ];

  // Stats cards data
  const statsCards = [
    {
      title: "کل سفارشات",
      value: userStats.totalRequests,
      icon: <FaShoppingCart className="text-xl sm:text-2xl" />,
      color: "from-[#0A1D37]/10 to-[#0A1D37]/5",
      iconColor: "text-[#0A1D37]",
      bgColor: "bg-gradient-to-br from-gray-50 to-white",
    },
    {
      title: "در انتظار بررسی",
      value: userStats.pendingRequests,
      icon: <FaClock className="text-xl sm:text-2xl" />,
      color: "from-[#0A1D37]/10 to-[#0A1D37]/5",
      iconColor: "text-[#0A1D37]",
      bgColor: "bg-gradient-to-br from-orange-50 to-white",
    },
    {
      title: "تکمیل شده",
      value: userStats.completedRequests,
      icon: <FaCheckCircle className="text-xl sm:text-2xl" />,
      color: "from-green-100 to-green-50",
      iconColor: "text-green-600",
      bgColor: "bg-gradient-to-br from-green-50 to-white",
    },
    {
      title: "رد شده",
      value: userStats.rejectedRequests,
      icon: <FaTimesCircle className="text-xl sm:text-2xl" />,
      color: "from-red-100 to-red-50",
      iconColor: "text-red-600",
      bgColor: "bg-gradient-to-br from-red-50 to-white",
    },
  ];

  const handleTabChange = (tabId: "services" | "orders" | "terms") => {
    setActiveTab(tabId);

    // Refresh stats when switching tabs
    if (isLoggedIn) {
      fetchUserStats();
    }
  };

  // User welcome section
  const renderUserWelcome = () => {
    if (!currentUser) return null;

    const userName =
      currentUser.firstName && currentUser.lastName
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : currentUser.firstName || "کاربر عزیز";

    return (
      <div className="backdrop-blur-sm bg-white/80 border border-gray-100 rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-[#0A1D37]/10 to-[#0A1D37]/5 rounded-full sm:rounded-2xl flex items-center justify-center flex-shrink-0 border border-[#0A1D37]/20">
              <FaUser className="text-[#0A1D37] text-lg sm:text-xl lg:text-2xl" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-xl lg:text-2xl font-bold text-[#0A1D37] mb-1 truncate">
                سلام {userName} عزیز 👋
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                به پنل خدمات ارزی پلاس خوش آمدید
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs lg:text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{new Date().toLocaleDateString("fa-IR")}</span>
          </div>
        </div>
      </div>
    );
  };

  // Stats cards section
  const renderStatsCards = () => {
    if (!isLoggedIn || statsLoading) return null;

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} backdrop-blur-sm border border-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group`}
          >
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex items-center justify-between">
                <div
                  className={`p-2 sm:p-2.5 lg:p-3 bg-gradient-to-r ${stat.color} rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform duration-300`}
                >
                  <div className={stat.iconColor}>{stat.icon}</div>
                </div>
                <div className="text-right">
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0A1D37] group-hover:text-[#0A1D37] transition-colors duration-300">
                    {stat.value}
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium leading-relaxed">
                {stat.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!isLoggedIn) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 ${className}`}
        dir="rtl"
      >
        <div className="container mx-auto px-4 py-16 sm:py-24 lg:py-32">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-xl animate-pulse">
              <FaUser className="text-white text-2xl sm:text-3xl lg:text-4xl" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              ورود به سیستم لازم است
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed px-4">
              برای دسترسی به خدمات، لطفاً وارد حساب کاربری خود شوید
            </p>
            <div className="space-y-4 px-4">
              <a
                href="/auth/sms"
                className="block w-full px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl sm:rounded-2xl font-bold hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
              >
                ورود / ثبت نام
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || ServicesPage;

  return (
    <div className={`min-h-screen ${className}`} dir="rtl">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* User Welcome Section */}
        {renderUserWelcome()}

        {/* Stats Cards */}
        {renderStatsCards()}

        {/* Navigation Tabs */}
        <div className="backdrop-blur-sm bg-white/80 border border-gray-100 rounded-2xl p-2 sm:p-3 lg:p-4 mb-6 sm:mb-8 shadow-sm">
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-1 sm:gap-3 lg:gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-4 sm:px-5 lg:px-6 py-3 sm:py-4 rounded-xl sm:rounded-xl lg:rounded-2xl font-medium transition-all duration-300 group ${
                  activeTab === tab.id
                    ? "border-2 border-[#0A1D37] bg-gradient-to-br from-gray-50 to-white text-[#0A1D37] shadow-md scale-[1.02]"
                    : "border-2 border-transparent text-gray-700 hover:bg-gray-50 hover:scale-[1.02] hover:shadow-sm"
                }`}
              >
                {/* Icon */}
                <div
                  className={`transition-all duration-300 ${
                    activeTab === tab.id
                      ? "text-[#0A1D37] scale-110"
                      : "text-gray-500 group-hover:text-[#0A1D37] group-hover:scale-110"
                  }`}
                >
                  {tab.icon}
                </div>

                {/* Text Content */}
                <div className="text-center sm:text-right flex-1">
                  <div className="font-bold text-xs text-nowrap sm:text-base lg:text-lg mb-0.5 sm:mb-1">
                    {tab.label}
                  </div>
                  <div
                    className={`text-xs sm:text-sm hidden sm:block transition-colors duration-300 ${
                      activeTab === tab.id
                        ? "text-gray-600"
                        : "text-gray-500 group-hover:text-gray-600"
                    }`}
                  >
                    {tab.description}
                  </div>
                </div>

            
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="backdrop-blur-sm bg-white/80 border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          {/* Tab Content */}
          <div className="min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceWrapper;
