"use client";

import React, { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaHistory,
  FaFileContract,
  FaUser,
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
  className = "mx-10 my-28",
}) => {
  const [activeTab, setActiveTab] = useState<
    "services" | "orders" | "terms"
  >(initialTab);
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
        console.error("Failed to fetch user stats:", data.error);
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
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
      icon: <FaShoppingCart className="text-lg" />,
      description: "مشاهده و سفارش خدمات",
      component: ServicesPage,
    },
    {
      id: "orders" as const,
      label: "سفارشات من",
      icon: <FaHistory className="text-lg" />,
      description: "تاریخچه و وضعیت سفارشات",
      component: CustomerRequestsTable,
      badge: userStats.pendingRequests > 0 ? userStats.pendingRequests : undefined,
    },
    {
      id: "terms" as const,
      label: "قوانین و شرایط",
      icon: <FaFileContract className="text-lg" />,
      description: "شرایط استفاده از خدمات",
      component: TermsPage,
    },
  ];

  // Stats cards data
  const statsCards = [
    {
      title: "کل سفارشات",
      value: userStats.totalRequests,
      icon: <FaShoppingCart className="text-2xl text-[#FF7A00]" />,
      color: "",
      bgColor: "bg-gray-50",
    },
    {
      title: "در انتظار بررسی",
      value: userStats.pendingRequests,
      icon: <FaHistory className="text-2xl text-[#FF7A00]" />,
      color: "",
      bgColor: "bg-gray-50",
    },
    {
      title: "تکمیل شده",
      value: userStats.completedRequests,
      icon: <FaShoppingCart className="text-2xl text-[#FF7A00]" />,
      color: "",
      bgColor: "bg-gray-50",
    },
    {
      title: "رد شده",
      value: userStats.rejectedRequests,
      icon: <FaFileContract className="text-2xl text-[#FF7A00]" />,
      color: "",
      bgColor: "bg-gray-50",
    },
  ];

  const handleTabChange = (tabId: "services" | "orders" | "terms") => {
    setActiveTab(tabId);

    // Refresh stats when switching tabs
    if (isLoggedIn) {
      fetchUserStats();
    }

    // Show appropriate message
    const tabLabels = {
      services: "خدمات",
      orders: "سفارشات من",
      terms: "قوانین و شرایط",
    };

    showToast.info(`بخش ${tabLabels[tabId]} باز شد`);
  };

  // User welcome section
  const renderUserWelcome = () => {
    if (!currentUser) return null;

    const userName =
      currentUser.firstName && currentUser.lastName
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : currentUser.firstName || "کاربر عزیز";

    return (
      <div className=" backdrop-blur-sm  rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12  rounded-full flex items-center justify-center">
              <FaUser className="text-[#FF7A00] text-xl" />
            </div>
            <div>
              <h2 className="sm:text-2xl text-base font-bold mb-2 text-[#0A1D37]">
                سلام {userName} عزیز
              </h2>
              <p className="text-gray-600 text-xs sm:text-md">
                به پنل خدمات ارزی پلاس خوش آمدید
              </p>
            </div>
          </div>

          <div className="text-sm hidden sm:block  text-gray-500">
            آخرین بروزرسانی: {new Date().toLocaleDateString("fa-IR")}
          </div>
        </div>
      </div>
    );
  };

  // Stats cards section
  const renderStatsCards = () => {
    if (!isLoggedIn || statsLoading) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 w-full max-w-3xl  mx-auto gap-4 mb-8">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} backdrop-blur-sm border border-[#0A1D37]/10 rounded-xl p-4 hover:shadow-lg transition-all  duration-300`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 bg-gradient-to-r ${stat.color} rounded-lg `}>
                {stat.icon}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
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
        <div className="container mx-auto px-4 py-32">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUser className="text-white text-3xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ورود به سیستم لازم است
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              برای دسترسی به خدمات، لطفاً وارد حساب کاربری خود شوید
            </p>
            <div className="space-y-4">
              <a
                href="/auth/sms"
                className="block w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
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
    <div className={`min-h-screen  ${className}`} dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* User Welcome Section */}
        {renderUserWelcome()}

        {/* Stats Cards */}
        {renderStatsCards()}

        {/* Navigation Tabs */}
        <div className=" backdrop-blur-sm border border-white/20 rounded-2xl p-2 mb-8 ">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "border-[#FF7A00] border bg-gray-50 text-[#0A1D37] shadow-lg scale-105"
                    : "text-gray-700  hover:scale-105"
                }`}
              >
                {tab.icon}
                <div className="text-center">
                  <div className="font-bold text-sm">{tab.label}</div>
                  <div
                    className={`text-xs ${
                      activeTab === tab.id ? "text-[#0A1D37]" : "text-gray-500"
                    }`}
                  >
                    {tab.description}
                  </div>
                </div>

                {/* Notification Badge */}
                {tab.badge && (
                  <div className="absolute -top-4 -right-4 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {tab.badge}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className=" backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden ">
          {/* Tab Content */}
          <div className="min-h-[600px]">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceWrapper;
