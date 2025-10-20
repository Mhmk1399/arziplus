"use client";

import React, { useState, useEffect } from "react";
import { FaUsers, FaIdCard, FaUniversity, FaCog } from "react-icons/fa";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { showToast } from "@/utilities/toast";

// Import admin components
import UsersList from "./usersList";
import NationalCredentialAdmin from "./nationalCredintial";
import BankingInfoAdmin from "./bankingInfo";
import Link from "next/link";

interface AdminWrapperProps {
  initialTab?: "users" | "credentials" | "banking" | "settings";
  className?: string;
}

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  pendingCredentials: number;
  pendingBanking: number;
}

const UserWrapper: React.FC<AdminWrapperProps> = ({
  initialTab = "users",
  className = "mx-10 my-28",
}) => {
  const [activeTab, setActiveTab] = useState<
    "users" | "credentials" | "banking" | "settings"
  >(initialTab);
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    pendingCredentials: 0,
    pendingBanking: 0,
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

      // Fetch multiple endpoints for stats
      const [usersRes, credentialsRes, bankingRes] = await Promise.all([
        fetch("/api/users?limit=1", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/users/nationalverifications?limit=1", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/users/banckingifo?limit=1", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const [usersData, credentialsData, bankingData] = await Promise.all([
        usersRes.json(),
        credentialsRes.json(),
        bankingRes.json(),
      ]);

      setAdminStats({
        totalUsers: usersData.pagination?.totalUsers || 0,
        activeUsers: usersData.pagination?.totalUsers || 0, // This could be refined
        pendingCredentials: credentialsData.pagination?.totalUsers || 0,
        pendingBanking: bankingData.pagination?.totalUsers || 0,
      });
    } catch (error) {
      console.log("Error fetching admin stats:", error);
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
      id: "users" as const,
      label: "مدیریت کاربران",
      icon: <FaUsers className="text-lg" />,
      description: "مشاهده و مدیریت کاربران",
      component: UsersList,
      badge: adminStats.totalUsers > 0 ? adminStats.totalUsers : undefined,
    },
    {
      id: "credentials" as const,
      label: "احراز هویت",
      icon: <FaIdCard className="text-lg" />,
      description: "بررسی مدارک هویتی",
      component: NationalCredentialAdmin,
      badge:
        adminStats.pendingCredentials > 0
          ? adminStats.pendingCredentials
          : undefined,
    },
    {
      id: "banking" as const,
      label: "اطلاعات بانکی",
      icon: <FaUniversity className="text-lg" />,
      description: "بررسی اطلاعات بانکی",
      component: BankingInfoAdmin,
      badge:
        adminStats.pendingBanking > 0 ? adminStats.pendingBanking : undefined,
    },
  ];

  // Stats cards data
  const statsCards = [
    {
      title: "کل کاربران",
      value: adminStats.totalUsers,
      icon: <FaUsers className="text-2xl text-[#0A1D37]" />,
      color: "",
      bgColor: "bg-gray-50",
    },
    {
      title: "کاربران فعال",
      value: adminStats.activeUsers,
      icon: <FaUsers className="text-2xl text-[#0A1D37]" />,
      color: "",
      bgColor: "bg-gray-50",
    },
    {
      title: "در انتظار احراز هویت",
      value: adminStats.pendingCredentials,
      icon: <FaIdCard className="text-2xl text-[#0A1D37]" />,
      color: "",
      bgColor: "bg-gray-50",
    },
    {
      title: "در انتظار تایید بانکی",
      value: adminStats.pendingBanking,
      icon: <FaUniversity className="text-2xl text-[#0A1D37]" />,
      color: "",
      bgColor: "bg-gray-50",
    },
  ];

  const handleTabChange = (tabId: "users" | "credentials" | "banking") => {
    setActiveTab(tabId);

    // Refresh stats when switching tabs
    if (isLoggedIn) {
      fetchAdminStats();
    }

    // Show appropriate message
    const tabLabels = {
      users: "مدیریت کاربران",
      credentials: "بررسی احراز هویت",
      banking: "بررسی اطلاعات بانکی",
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
      <div className=" backdrop-blur-sm  rounded-2xl p-1 sm:p-6 mb-8">
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
        className={`min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 ${className}`}
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
    tabs.find((tab) => tab.id === activeTab)?.component || UsersList;

  return (
    <div className={`min-h-screen  ${className}`} dir="rtl">
      <div className=" mx-auto p-0 sm:px-4 sm:py-8">
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

export default UserWrapper;
