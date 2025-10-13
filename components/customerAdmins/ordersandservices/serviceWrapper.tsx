"use client";

import React, { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import ServiceRenderer from "./ServiceRenderer";
import CustomerRequestsTable from "./orderHistory";
import TermsPage from "./TermsPage";
import { showToast } from "@/utilities/toast";
import { FaShoppingCart, FaHistory, FaFileContract, FaUser, FaChartLine } from "react-icons/fa";

interface ServiceWrapperProps {
  initialTab?: "services" | "orders" | "terms";
  className?: string;
}

interface UserStats {
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  rejectedRequests: number;
  inProgressRequests?: number;
  requiresInfoRequests?: number;
  cancelledRequests?: number;
}

const ServiceWrapper: React.FC<ServiceWrapperProps> = ({
  initialTab = "services",
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState<"services" | "orders" | "terms">(initialTab);
  const [userStats, setUserStats] = useState<UserStats>({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    rejectedRequests: 0,
    inProgressRequests: 0,
    requiresInfoRequests: 0,
    cancelledRequests: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const { user, isLoggedIn } = useCurrentUser();

  // Fetch user statistics
  const fetchUserStats = async () => {
    if (!isLoggedIn) {
      setStatsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/customer/requests/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log("Stats API Response:", data); // Debug log

      if (data.success) {
        console.log("Setting user stats:", data.stats); // Debug log
        setUserStats(data.stats);
      } else {
        console.error("Failed to fetch user stats:", data.error);
        // Set empty stats on error
        setUserStats({
          totalRequests: 0,
          pendingRequests: 0,
          completedRequests: 0,
          rejectedRequests: 0,
          inProgressRequests: 0,
          requiresInfoRequests: 0,
          cancelledRequests: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
      // Set empty stats on error
      setUserStats({
        totalRequests: 0,
        pendingRequests: 0,
        completedRequests: 0,
        rejectedRequests: 0,
        inProgressRequests: 0,
        requiresInfoRequests: 0,
        cancelledRequests: 0,
      });
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
      description: "مشاهده و سفارش خدمات"
    },
    {
      id: "orders" as const,
      label: "سفارشات من",
      icon: <FaHistory className="text-lg" />,
      description: "تاریخچه و وضعیت سفارشات",
      badge: userStats.pendingRequests > 0 ? userStats.pendingRequests : undefined
    },
    {
      id: "terms" as const,
      label: "قوانین و شرایط",
      icon: <FaFileContract className="text-lg" />,
      description: "شرایط استفاده از خدمات"
    }
  ];

  // Stats cards data
  const statsCards = [
    {
      title: "کل سفارشات",
      value: userStats.totalRequests,
      icon: <FaChartLine className="text-2xl text-blue-600" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "در انتظار بررسی",
      value: userStats.pendingRequests,
      icon: <FaHistory className="text-2xl text-yellow-600" />,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "تکمیل شده",
      value: userStats.completedRequests,
      icon: <FaShoppingCart className="text-2xl text-green-600" />,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "رد شده",
      value: userStats.rejectedRequests,
      icon: <FaFileContract className="text-2xl text-red-600" />,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50"
    }
  ];

  const handleTabChange = (tabId: "services" | "orders" | "terms") => {
    setActiveTab(tabId);
    
    // Refresh stats when switching to orders tab
    if (tabId === "orders" && isLoggedIn) {
      fetchUserStats();
    }
    
    // Show appropriate welcome message
    if (tabId === "services") {
      showToast.success("خوش آمدید! خدمات موردنظر خود را انتخاب کنید");
    } else if (tabId === "orders") {
      showToast.info("تاریخچه سفارشات شما");
    } else if (tabId === "terms") {
      showToast.info("لطفاً قوانین و شرایط را مطالعه فرمایید");
    }
  };

  // User welcome section
  const renderUserWelcome = () => {
    if (!user) return null;

    const userName = user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}`
      : user.firstName || "کاربر عزیز";

    return (
      <div className="bg-gradient-to-r from-[#4DBFF0]/10 to-[#FF7A00]/10 backdrop-blur-sm border border-[#4DBFF0]/30 rounded-2xl p-6 m-20">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#4DBFF0] to-[#FF7A00] rounded-full flex items-center justify-center">
              <FaUser className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0A1D37]">
                سلام {userName}! 👋
              </h2>
              <p className="text-[#0A1D37]/70">
                به پنل خدمات ارزی پلاس خوش آمدید
              </p>
            </div>
          </div>
          
          {user.phone && (
            <div className="text-sm text-[#0A1D37]/60">
              شماره تماس: {user.phone}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Stats cards section
  const renderStatsCards = () => {
    if (!isLoggedIn || statsLoading) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:shadow-lg transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 bg-gradient-to-r ${stat.color} rounded-lg text-white`}>
                {stat.icon}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#0A1D37]">{stat.value}</p>
              </div>
            </div>
            <p className="text-sm text-[#0A1D37]/70 font-medium">{stat.title}</p>
          </div>
        ))}
      </div>
    );
  };

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-white via-[#E8F4FD] to-[#F0F9FF] ${className}`} dir="rtl">
        <div className="container mx-auto px-4 py-32">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-[#4DBFF0] to-[#FF7A00] rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUser className="text-white text-3xl" />
            </div>
            <h2 className="text-3xl font-bold text-[#0A1D37] mb-4">
              ورود به سیستم لازم است
            </h2>
            <p className="text-[#0A1D37]/70 mb-8 leading-relaxed">
              برای دسترسی به خدمات و مشاهده سفارشات خود، لطفاً وارد حساب کاربری شوید
            </p>
            <div className="space-y-4">
              <a
                href="/auth/sms"
                className="block w-full px-6 py-4 bg-gradient-to-r from-[#4DBFF0] to-[#FF7A00] text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                ورود / ثبت نام
              </a>
              <button
                onClick={() => setActiveTab("terms")}
                className="block w-full px-6 py-3 border border-[#4DBFF0] text-[#0A1D37] rounded-xl font-medium hover:bg-[#4DBFF0]/10 transition-all duration-300"
              >
                مطالعه قوانین و شرایط
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-white via-[#E8F4FD] to-[#F0F9FF] ${className}`} dir="rtl">
      <div className="container mx-auto px-4 py-8">
        
        {/* User Welcome Section */}
        {renderUserWelcome()}

        {/* Stats Cards */}
        {renderStatsCards()}

        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-2 mb-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-[#4DBFF0] to-[#FF7A00] text-white shadow-lg scale-105"
                    : "text-[#0A1D37] hover:bg-[#4DBFF0]/10 hover:scale-105"
                }`}
              >
                {tab.icon}
                <div className="text-center">
                  <div className="font-bold text-sm">{tab.label}</div>
                  <div className={`text-xs ${activeTab === tab.id ? "text-white/80" : "text-[#0A1D37]/60"}`}>
                    {tab.description}
                  </div>
                </div>
                
                {/* Notification Badge */}
                {tab.badge && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
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
            {activeTab === "services" && (
              <div className="p-0">
                <ServiceRenderer />
              </div>
            )}
            
            {activeTab === "orders" && (
              <div className="p-0">
                <CustomerRequestsTable className="p-8" />
              </div>
            )}
            
            {activeTab === "terms" && (
              <div className="p-0">
                <TermsPage />
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 text-[#0A1D37]/60">
          <p className="text-sm">
            در صورت بروز مشکل با پشتیبانی ارزی پلاس تماس بگیرید
          </p>
          <div className="flex items-center justify-center gap-4 mt-2 text-xs">
            <span>📞 پشتیبانی: ۰۲۱-۱۲۳۴۵۶۷۸</span>
            <span>✉️ ایمیل: support@arziplus.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceWrapper;
