"use client";

import React, { useState, useEffect } from "react";
import {
  FaWallet,
  FaArrowUp,
  FaArrowDown,
   FaRedo,
  FaHourglassHalf,
} from "react-icons/fa";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { showToast } from "@/utilities/toast";

// Import wallet components
import IncomesHistory from "./incomes";
import AddAmountComponent from "./addamount";
import WithdrawComponent from "./withdraw";

interface WalletWrapperProps {
  initialTab?: "dashboard" | "incomes" | "withdraws" | "add-funds";
  className?: string;
}

interface WalletTransaction {
  _id?: string;
  amount: number;
  type: "income" | "outcome";
  tag: string;
  description: string;
  date: Date;
  verifiedAt?: Date;
  status: "pending" | "verified" | "rejected";
  verifiedBy?: string;
}

interface WalletStats {
  currentBalance: number;
  totalIncomes: number;
  totalOutcomes: number;
  pendingIncomes: number;
  pendingOutcomes: number;
  verifiedIncomes: number;
  verifiedOutcomes: number;
  recentTransactions: WalletTransaction[];
}

interface WalletData {
  _id: string;
  userId: string;
  inComes: string[];
  outComes: string[];
  balance: string[];
  currentBalance: number;
}

const WalletWrapper: React.FC<WalletWrapperProps> = ({
  initialTab = "dashboard",
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "incomes" | "withdraws" | "add-funds"
  >(initialTab);

  const [walletStats, setWalletStats] = useState<WalletStats>({
    currentBalance: 0,
    totalIncomes: 0,
    totalOutcomes: 0,
    pendingIncomes: 0,
    pendingOutcomes: 0,
    verifiedIncomes: 0,
    verifiedOutcomes: 0,
    recentTransactions: [],
  });

  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  console.log(walletData);

  const { isLoggedIn, loading: userLoading } = useCurrentUser();

  // Fetch wallet data and statistics
  const fetchWalletData = async () => {
    if (!isLoggedIn || userLoading) {
      setStatsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/wallet", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setWalletData(data.wallet);
        setWalletStats(data.stats);
      } else {
        console.log("Failed to fetch wallet data:", data.error);
        showToast.error("خطا در دریافت اطلاعات کیف پول");
      }
    } catch (error) {
      console.log("Error fetching wallet data:", error);
      showToast.error("خطا در ارتباط با سرور");
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && !userLoading) {
      fetchWalletData();
    } else if (!userLoading) {
      setStatsLoading(false);
    }
  }, [isLoggedIn, userLoading]);

  const tabs = [
    {
      id: "dashboard" as const,
      label: "داشبورد کیف پول",
      icon: <FaWallet className="text-lg sm:text-xl" />,
      description: "نمای کلی و موجودی",
      badge:
        walletStats.currentBalance > 0
          ? `${walletStats.currentBalance.toLocaleString()} تومان`
          : undefined,
    },
    {
      id: "incomes" as const,
      label: "تاریخچه واریزی‌ها",
      icon: <FaArrowUp className="text-lg sm:text-xl" />,
      description: "تاریخچه پرداخت‌ها",
      badge:
        walletStats.pendingIncomes > 0 ? walletStats.pendingIncomes : undefined,
    },
    {
      id: "withdraws" as const,
      label: "درخواست‌  برداشت",
      icon: <FaArrowDown className="text-lg sm:text-xl" />,
      description: "تاریخچه برداشت‌ها",
    },
  ];

  // Stats cards data
  const statsCards = [
    {
      title: "موجودی فعلی",
      value: walletStats.currentBalance.toLocaleString("fa-IR"),
      suffix: "تومان",
      icon: <FaWallet className="text-xl sm:text-2xl" />,
      bgColor: "bg-gradient-to-br from-[#0A1D37]/5 to-[#0A1D37]/10",
      iconBg: "bg-gradient-to-r from-[#0A1D37]/20 to-[#0A1D37]/10",
      iconColor: "text-[#0A1D37]",
      textColor: "text-[#0A1D37]",
    },
    {
      title: "کل واریزی‌ها",
      value: walletStats.totalIncomes.toLocaleString("fa-IR"),
      suffix: "تومان",
      icon: <FaArrowUp className="text-xl sm:text-2xl" />,
      bgColor: "bg-gradient-to-br from-green-50 to-green-100/50",
      iconBg: "bg-gradient-to-r from-green-100 to-green-50",
      iconColor: "text-green-600",
      textColor: "text-green-700",
    },
    {
      title: "کل برداشت‌ها",
      value: walletStats.totalOutcomes.toLocaleString("fa-IR"),
      suffix: "تومان",
      icon: <FaArrowDown className="text-xl sm:text-2xl" />,
      bgColor: "bg-gradient-to-br from-red-50 to-red-100/50",
      iconBg: "bg-gradient-to-r from-red-100 to-red-50",
      iconColor: "text-red-600",
      textColor: "text-red-700",
    },
    {
      title: "در انتظار تایید",
      value: walletStats.pendingIncomes + walletStats.pendingOutcomes,
      suffix: "مورد",
      icon: <FaHourglassHalf className="text-xl sm:text-2xl" />,
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100/50",
      iconBg: "bg-gradient-to-r from-orange-100 to-orange-50",
      iconColor: "text-orange-600",
      textColor: "text-orange-700",
    },
  ];

  const handleTabChange = (
    tabId: "dashboard" | "incomes" | "withdraws" | "add-funds"
  ) => {
    setActiveTab(tabId);
    fetchWalletData(); // Refresh data when switching tabs
  };

  // Stats cards section
  const renderStatsCards = () => {
    if (!isLoggedIn || statsLoading || userLoading) {
      return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 animate-pulse"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg sm:rounded-xl"></div>
                <div className="flex-1 mr-3">
                  <div className="h-6 sm:h-8 bg-gray-200 rounded w-3/4 mr-auto"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} backdrop-blur-sm border border-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group`}
          >
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex items-start justify-between">
                <div
                  className={`p-2 sm:p-2.5 lg:p-3 ${stat.iconBg} rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                >
                  <div className={stat.iconColor}>{stat.icon}</div>
                </div>
                <div className="text-left flex-1 min-w-0 mr-2">
                  <p
                    className={`text-lg sm:text-xl lg:text-2xl font-bold ${stat.textColor} mb-0.5 sm:mb-1 truncate`}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">
                    {stat.suffix}
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm lg:text-base text-gray-700 font-semibold leading-relaxed">
                {stat.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (userLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${className}`}
        dir="rtl"
      >
        <div className="text-center space-y-4">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A1D37] to-[#0A1D37]/50 rounded-2xl animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaRedo className="animate-spin text-3xl sm:text-4xl text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-base sm:text-lg font-bold text-[#0A1D37]">
              در حال بارگذاری...
            </p>
            <p className="text-xs sm:text-sm text-gray-600">لطفاً صبر کنید</p>
          </div>
        </div>
      </div>
    );
  }

  // Render active tab content
  const renderActiveContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <AddAmountComponent
            walletBalance={walletStats.currentBalance}
            walletStats={walletStats}
          />
        );
      case "incomes":
        return <IncomesHistory />;
      case "withdraws":
        return (
          <WithdrawComponent
            onSuccess={() => {
              fetchWalletData(); // Refresh wallet data after successful withdrawal
              showToast.success("درخواست برداشت با موفقیت ثبت شد");
            }}
            onCancel={() => setActiveTab("dashboard")}
            walletBalance={walletStats.currentBalance}
            walletStats={walletStats}
          />
        );
      case "add-funds":
        return (
          <AddAmountComponent
            onSuccess={() => {
              fetchWalletData(); // Refresh wallet data after successful payment
              showToast.success("به درگاه پرداخت منتقل شدید");
            }}
            onCancel={() => setActiveTab("dashboard")}
            walletBalance={walletStats.currentBalance}
            walletStats={walletStats}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen ${className}`} dir="rtl">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Stats Cards */}
        {renderStatsCards()}

        {/* Navigation Tabs */}
        <div className="backdrop-blur-sm bg-white/80 border border-gray-100 rounded-2xl p-2 sm:p-3 lg:p-4 mb-6 sm:mb-8 shadow-sm">
          <div className="grid  grid-cols-3 gap-1 lg:gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative flex  items-center justify-center gap-2 sm:gap-3 px-1 sm:px-5 lg:px-6 py-3 sm:py-4 rounded-xl sm:rounded-xl lg:rounded-2xl font-medium transition-all duration-300 group ${
                  activeTab === tab.id
                    ? "border-2 border-[#0A1D37] bg-gradient-to-br from-[#0A1D37]/5 to-[#0A1D37]/10 text-[#0A1D37] shadow-md scale-[1.02]"
                    : "border-2 border-transparent text-gray-700 hover:bg-gray-50 hover:scale-[1.02] hover:shadow-sm"
                }`}
              >
                {/* Icon */}
                <div
                  className={`transition-all hidden lg:block duration-300 ${
                    activeTab === tab.id
                      ? "text-[#0A1D37] scale-110"
                      : "text-gray-500 group-hover:text-[#0A1D37] group-hover:scale-110"
                  }`}
                >
                  {tab.icon}
                </div>

                {/* Text Content */}
                <div className="text-center sm:text-right flex-1 min-w-0">
                  <div className="font-bold text-xs sm:text-base lg:text-lg mb-0.5 sm:mb-1 truncate">
                    {tab.label}
                  </div>
                  <div
                    className={`text-xs sm:text-sm hidden sm:block transition-colors duration-300 truncate ${
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
        <div className="backdrop-blur-sm bg-white/90 border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
            {renderActiveContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletWrapper;
