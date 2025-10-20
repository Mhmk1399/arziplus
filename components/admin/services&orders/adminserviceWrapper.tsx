"use client";

import React, { useState, useEffect } from "react";
import {
  FaServicestack,
  FaClipboardList,
  FaCog,
  FaChartBar,
} from "react-icons/fa";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { showToast } from "@/utilities/toast";

// Import admin components
import AdminRequestsTable from "./AdminRequestsTable";
import { ServiceManager } from "./serviceBuilder";
import Link from "next/link";

interface AdminWrapperProps {
  initialTab?: "requests" | "services" | "analytics";
  className?: string;
}

interface AdminStats {
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  totalServices: number;
}

const ServiceWrapper: React.FC<AdminWrapperProps> = ({
  initialTab = "requests",
  className = "mx-10 my-4",
}) => {
  const [activeTab, setActiveTab] = useState<
    "requests" | "services" | "analytics"
  >(initialTab);
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    totalServices: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const { user: currentUser, isLoggedIn } = useCurrentUser();

  // Fetch admin statistics
  const fetchAdminStats = async () => {
    if (!isLoggedIn) {
      setStatsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      // Fetch statistics from service requests endpoint
      const [allRequestsRes, pendingRequestsRes, completedRequestsRes] =
        await Promise.all([
          fetch("/api/service-requests?limit=1", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/service-requests?status=pending&limit=1", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/service-requests?status=completed&limit=1", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      const [allRequestsData, pendingRequestsData, completedRequestsData] =
        await Promise.all([
          allRequestsRes.json(),
          pendingRequestsRes.json(),
          completedRequestsRes.json(),
        ]);

      setAdminStats({
        totalRequests: allRequestsData.pagination?.total || 0,
        pendingRequests: pendingRequestsData.pagination?.total || 0,
        completedRequests: completedRequestsData.pagination?.total || 0,
        totalServices: 0, // This can be added when services management is implemented
      });
    } catch (error) {
      console.log("Error fetching service stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchAdminStats();
    } else {
      setStatsLoading(false);
    }
  }, [isLoggedIn]);

  // Tab configuration
  const tabs = [
    {
      id: "requests" as const,
      label: "مدیریت درخواست‌ها",
      icon: <FaClipboardList className="text-lg" />,
      description: "مشاهده و مدیریت درخواست‌های سرویس",
      component: AdminRequestsTable,
      badge:
        adminStats.pendingRequests > 0 ? adminStats.pendingRequests : undefined,
    },
    {
      id: "services" as const,
      label: "مدیریت سرویس‌ها",
      icon: <FaServicestack className="text-lg" />,
      description: "مدیریت و ویرایش سرویس‌ها",
      component: ServiceManager,
      badge:
        adminStats.totalServices > 0 ? adminStats.totalServices : undefined,
    },
    {
      id: "analytics" as const,
      label: "آنالیز و گزارشات",
      icon: <FaChartBar className="text-lg" />,
      description: "آمار و گزارشات سرویس‌ها",
      component: () => (
        <div className="p-8 text-center">
          <FaChartBar className="text-6xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            آنالیز و گزارشات
          </h3>
          <p className="text-gray-500">این بخش در حال توسعه است</p>
        </div>
      ),
    },
  ];

  // Stats cards data
  const statsCards = [
    {
      title: "کل درخواست‌ها",
      value: adminStats.totalRequests,
      icon: <FaClipboardList className="text-2xl text-[#0A1D37]" />,
      color: "",
      bgColor: "bg-gray-50",
    },
    {
      title: "در انتظار بررسی",
      value: adminStats.pendingRequests,
      icon: <FaClipboardList className="text-2xl text-[#0A1D37]" />,
      color: "",
      bgColor: "bg-gray-50",
    },
    {
      title: "تکمیل شده",
      value: adminStats.completedRequests,
      icon: <FaClipboardList className="text-2xl text-[#0A1D37]" />,
      color: "",
      bgColor: "bg-gray-50",
    },
    {
      title: "سرویس‌های فعال",
      value: adminStats.totalServices,
      icon: <FaServicestack className="text-2xl text-[#0A1D37]" />,
      color: "",
      bgColor: "bg-gray-50",
    },
  ];

  const handleTabChange = (tabId: "requests" | "services" | "analytics") => {
    setActiveTab(tabId);

    // Refresh stats when switching tabs
    if (isLoggedIn) {
      fetchAdminStats();
    }

    // Show appropriate message
    const tabLabels = {
      requests: "مدیریت درخواست‌ها",
      services: "مدیریت سرویس‌ها",
      analytics: "آنالیز و گزارشات",
    };

    showToast.info(`بخش ${tabLabels[tabId]} باز شد`);
  };

  // Admin welcome section
  const renderAdminWelcome = () => {
    if (!currentUser) return null;

    const adminName =
      currentUser.firstName && currentUser.lastName
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : currentUser.firstName || "مدیر محترم";

    return (
      <div className=" backdrop-blur-sm  rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12  rounded-full flex items-center justify-center">
              <FaCog className="text-[#0A1D37] text-xl" />
            </div>
            <div>
              <h2 className="sm:text-2xl text-base font-bold mb-2 text-[#0A1D37]">
                سلام {adminName} عزیز
              </h2>
              <p className="text-gray-600 text-xs sm:text-md">
                به پنل مدیریت ارزی پلاس خوش آمدید
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
              <FaCog className="text-white text-3xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ورود به سیستم لازم است
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              برای دسترسی به پنل مدیریت، لطفاً وارد حساب کاربری خود شوید
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

  if (
    !currentUser?.roles.includes("admin") &&
    !currentUser?.roles.includes("super_admin")
  ) {
    return (
      <div
        className={`min-h-screen    ${className}`}
        dir="rtl"
      >
        <div className="container mx-auto px-4 py-32">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCog className="text-white text-3xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              دسترسی غیر مجاز
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              شما به این بخش دسترسی ندارید. لطفاً با مدیر سیستم تماس بگیرید.
            </p>
            <div className="space-y-4">
              <Link
                href="/"
                className="block w-full px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                بازگشت به خانه
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || AdminRequestsTable;

  return (
    <div className={`min-h-screen  ${className}`} dir="rtl">
      <div className="container mx-auto px-4  ">
        {/* Admin Welcome Section */}
        {renderAdminWelcome()}

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
                    ? "border-[#0A1D37] border bg-gray-50 text-[#0A1D37] shadow-lg scale-105"
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
        <div className="bg-white/50 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden shadow-xl">
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
