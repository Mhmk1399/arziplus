"use client";

import React, { useState, useEffect } from "react";
import {
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaUser,
  FaCog,
  FaRedo,
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

interface WalletStats {
  currentBalance: number;
  totalIncomes: number;
  totalOutcomes: number;
  pendingIncomes: number;
  pendingOutcomes: number;
  verifiedIncomes: number;
  verifiedOutcomes: number;
  recentTransactions: any[];
}

interface WalletData {
  _id: string;
  userId: string;
  inComes: any[];
  outComes: any[];
  balance: any[];
  currentBalance: number;
}

const WalletWrapper: React.FC<WalletWrapperProps> = ({
  initialTab = "dashboard",
  className = "mx-10 my-28",
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
  const [actionLoading, setActionLoading] = useState(false);

  // Form states
  const [addAmount, setAddAmount] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const {
    user: currentUser,
    isLoggedIn,
    loading: userLoading,
  } = useCurrentUser();

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
        console.error("Failed to fetch wallet data:", data.error);
        showToast.error("خطا در دریافت اطلاعات کیف پول");
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error);
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

  // Handle add funds
  const handleAddFunds = async () => {
    if (!addAmount || parseFloat(addAmount) <= 0) {
      showToast.error("لطفاً مبلغ معتبر وارد کنید");
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/wallet", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "add_income",
          amount: parseFloat(addAmount),
          description: addDescription || "افزودن موجودی دستی",
          tag: "manual_deposit",
        }),
      });

      const data = await response.json();

      if (data.success) {
        showToast.success("درخواست افزودن موجودی ثبت شد (در انتظار تایید)");
        setAddAmount("");
        setAddDescription("");
        fetchWalletData(); // Refresh data
      } else {
        showToast.error(data.error || "خطا در ثبت درخواست");
      }
    } catch (error) {
      console.error("Error adding funds:", error);
      showToast.error("خطا در ارتباط با سرور");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle withdraw request
  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      showToast.error("لطفاً مبلغ معتبر وارد کنید");
      return;
    }

    if (parseFloat(withdrawAmount) > walletStats.currentBalance) {
      showToast.error("موجودی کافی نیست");
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/wallet", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "withdraw",
          amount: parseFloat(withdrawAmount),
        }),
      });

      const data = await response.json();

      if (data.success) {
        showToast.success("درخواست برداشت ثبت شد");
        setWithdrawAmount("");
        fetchWalletData(); // Refresh data
      } else {
        showToast.error(data.error || "خطا در ثبت درخواست");
      }
    } catch (error) {
      console.error("Error creating withdraw request:", error);
      showToast.error("خطا در ارتباط با سرور");
    } finally {
      setActionLoading(false);
    }
  };

  // Tab configuration
  const tabs = [
    {
      id: "dashboard" as const,
      label: "داشبورد کیف پول",
      icon: <FaWallet className="text-lg" />,
      description: "نمای کلی و موجودی",
      badge:
        walletStats.currentBalance > 0
          ? `${walletStats.currentBalance.toLocaleString()} تومان`
          : undefined,
    },
    {
      id: "incomes" as const,
      label: "تاریخچه واریزی‌ها",
      icon: <FaArrowUp className="text-lg" />,
      description: "تاریخچه پرداخت‌ها",
      badge:
        walletStats.pendingIncomes > 0 ? walletStats.pendingIncomes : undefined,
    },
    {
      id: "withdraws" as const,
      label: "درخواست‌های برداشت",
      icon: <FaArrowDown className="text-lg" />,
      description: "تاریخچه برداشت‌ها",
    },
  ];

  // Stats cards data
  const statsCards = [
    {
      title: "موجودی فعلی",
      value: `${walletStats.currentBalance.toLocaleString()} تومان`,
      icon: <FaWallet className="text-2xl text-[#FF7A00]" />,
      bgColor: "bg-gray-50",
    },
    {
      title: "کل واریزی‌ها",
      value: `${walletStats.totalIncomes.toLocaleString()} تومان`,
      icon: <FaArrowUp className="text-2xl text-[#FF7A00]" />,
      bgColor: "bg-gray-50",
    },
    {
      title: "کل برداشت‌ها",
      value: `${walletStats.totalOutcomes.toLocaleString()} تومان`,
      icon: <FaArrowDown className="text-2xl text-[#FF7A00]" />,
      bgColor: "bg-gray-50",
    },
    {
      title: "در انتظار تایید",
      value: walletStats.pendingIncomes + walletStats.pendingOutcomes,
      icon: <FaCog className="text-2xl text-[#FF7A00]" />,
      bgColor: "bg-gray-50",
    },
  ];

  const handleTabChange = (
    tabId: "dashboard" | "incomes" | "withdraws" | "add-funds"
  ) => {
    setActiveTab(tabId);
    fetchWalletData(); // Refresh data when switching tabs

    const tabLabels = {
      dashboard: "داشبورد کیف پول",
      incomes: "تاریخچه واریزی‌ها",
      withdraws: "درخواست‌های برداشت",
      "add-funds": "مدیریت موجودی",
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
      <div className="backdrop-blur-sm rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <FaWallet className="text-[#FF7A00] text-xl" />
            </div>
            <div>
              <h2 className="sm:text-2xl text-base font-bold mb-2 text-[#0A1D37]">
                کیف پول {userName}
              </h2>
              <p className="text-gray-600 text-xs sm:text-md">
                مدیریت موجودی و تراکنش‌های شما
              </p>
            </div>
          </div>

          <div className="text-sm hidden sm:block text-gray-500">
            آخرین بروزرسانی: {new Date().toLocaleDateString("fa-IR")}
          </div>
        </div>
      </div>
    );
  };

  // Stats cards section
  const renderStatsCards = () => {
    if (!isLoggedIn || statsLoading || userLoading) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 w-full max-w-4xl mx-auto gap-4 mb-8">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} backdrop-blur-sm border border-[#0A1D37]/10 rounded-xl p-4 hover:shadow-lg transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 bg-gradient-to-r  rounded-lg`}>
                {stat.icon}
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
          </div>
        ))}
      </div>
    );
  };

  // Dashboard content

  if (userLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${className}`}
        dir="rtl"
      >
        <div className="text-center">
          <FaRedo className="animate-spin text-4xl text-[#FF7A00] mx-auto mb-4" />
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

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
              برای دسترسی به کیف پول، لطفاً وارد حساب کاربری خود شوید
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

  // Render active tab content
  const renderActiveContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AddAmountComponent />;
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
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        {renderStatsCards()}

        {/* Navigation Tabs */}
        <div className="backdrop-blur-sm border border-white/20 rounded-2xl p-2 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative flex flex-col items-center justify-center gap-3 px-4 py-4 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "border-[#FF7A00] border bg-gray-50 text-[#0A1D37] shadow-lg scale-105"
                    : "text-gray-700 hover:scale-105"
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

                {/* Badge */}
                {tab.badge && (
                  <div className="absolute -top-2 -right-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full font-bold">
                    {tab.badge}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="  overflow-hidden ">
          <div className="min-h-[600px]">{renderActiveContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default WalletWrapper;
