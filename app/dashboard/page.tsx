"use client";
import React, { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FaUsers,
  FaServicestack,
  FaClipboardList,
  FaIdCard,
  FaCog,
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaHome,
  FaSignOutAlt,
  FaWallet,
  FaMoneyBillWave,
  FaChevronRight,
  FaTicketAlt,
} from "react-icons/fa";
import { showToast } from "@/utilities/toast";

// Import wrappers
import UserWrapper from "@/components/admin/users/userWrapper";
import AdminServiceWrapper from "@/components/admin/services&orders/adminserviceWrapper";
import ServiceWrapper from "@/components/customerAdmins/ordersandservices/serviceWrapper";
import CredentialWrapper from "@/components/customerAdmins/credintials/credintialWrapper";
import WalletWrapper from "@/components/customerAdmins/wallet/walletWrapper";
import PaymentWrapper from "@/components/admin/payments/paymentWrapper";
import LotteryAdminWrapper from "@/components/admin/lottery/lotteryWrapper";
import CustomerLotteryWrapper from "@/components/customerAdmins/lottery/lotteryWrapper";
import Link from "next/link";
import Image from "next/image";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ComponentType;
  description: string;
  badge?: number;
}

const Dashboard: React.FC = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default open on desktop
  const [loading, setLoading] = useState(true);
  const {
    user: currentUser,
    isLoggedIn,
    loading: userLoading,
  } = useCurrentUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle URL hash changes for navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash && currentUser) {
        const isAdmin =
          currentUser.roles.includes("admin") ||
          currentUser.roles.includes("super_admin");
        const validTabs = isAdmin
          ? ["users", "lottery", "payments", "admin-services"]
          : ["services", "lottery", "wallet", "credentials"];

        if (validTabs.includes(hash)) {
          setSelectedMenuItem(hash);
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [currentUser]);

  // Check authentication and redirect if needed
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log("Dashboard auth check:", {
      isLoggedIn,
      currentUser,
      userLoading,
      hasToken: !!token,
      tokenPreview: token?.substring(0, 20) + "...",
    });

    // Wait for user loading to complete
    if (userLoading) {
      console.log("Still loading user data...");
      return;
    }

    if (!isLoggedIn || !currentUser) {
      console.log("Not logged in, redirecting to auth");
      router.push("/auth/sms");
      return;
    }

    console.log("User is logged in:", currentUser);
    setLoading(false);

    // Check for URL hash or parameters
    const hash = window.location.hash.substring(1);
    const tabParam = searchParams.get("tab");
    const targetTab = hash || tabParam;

    // Set menu item based on URL hash/parameter or user role
    if (targetTab) {
      // Validate the tab parameter against available menu items
      const isAdmin =
        currentUser.roles.includes("admin") ||
        currentUser.roles.includes("super_admin");
      const validTabs = isAdmin
        ? ["users", "lottery", "payments", "admin-services"]
        : ["services", "lottery", "wallet", "credentials"];

      if (validTabs.includes(targetTab)) {
        setSelectedMenuItem(targetTab);
        // Update hash if it came from tab parameter
        if (!hash && tabParam) {
          window.location.hash = targetTab;
        }
      } else {
        // Invalid tab, set default
        const defaultTab = isAdmin ? "users" : "services";
        setSelectedMenuItem(defaultTab);
        window.location.hash = defaultTab;
      }
    } else {
      // No tab parameter, set default based on role
      const defaultTab =
        currentUser.roles.includes("admin") ||
        currentUser.roles.includes("super_admin")
          ? "users"
          : "services";
      setSelectedMenuItem(defaultTab);
      window.location.hash = defaultTab;
    }
  }, [isLoggedIn, currentUser, userLoading, router, searchParams]);

  // Handle responsive sidebar - close on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Admin menu items
  const adminMenuItems: MenuItem[] = [
    {
      id: "users",
      label: "مدیریت کاربران",
      icon: <FaUsers className="text-lg" />,
      component: UserWrapper,
      description: "مدیریت کاربران و احراز هویت",
    },
    {
      id: "lottery",
      label: "مدیریت لاتاری",
      icon: <FaTicketAlt className="text-lg" />,
      component: LotteryAdminWrapper,
      description: "مدیریت ثبت‌نام‌های قرعه‌کشی گرین کارت",
    },
    {
      id: "payments",
      label: "مدیریت پرداخت‌ها",
      icon: <FaMoneyBillWave className="text-lg" />,
      component: PaymentWrapper,
      description: "مدیریت کیف پول‌ها و درخواست‌های برداشت",
    },
    {
      id: "admin-services",
      label: "مدیریت سرویس‌ها",
      icon: <FaServicestack className="text-lg" />,
      component: AdminServiceWrapper,
      description: "مدیریت سرویس‌ها و درخواست‌ها",
    },
  ];

  // Customer menu items
  const customerMenuItems: MenuItem[] = [
    {
      id: "services",
      label: "خدمات و سفارشات",
      icon: <FaClipboardList className="text-lg" />,
      component: ServiceWrapper,
      description: "مشاهده خدمات و سفارشات",
    },
    {
      id: "lottery",
      label: "ثبت‌نام‌های لاتاری",
      icon: <FaTicketAlt className="text-lg" />,
      component: CustomerLotteryWrapper,
      description: "مدیریت ثبت‌نام‌های قرعه‌کشی گرین کارت",
    },
    {
      id: "wallet",
      label: "کیف پول",
      icon: <FaWallet className="text-lg" />,
      component: WalletWrapper,
      description: "مدیریت موجودی و تراکنش‌ها",
    },
    {
      id: "credentials",
      label: "احراز هویت",
      icon: <FaIdCard className="text-lg" />,
      component: CredentialWrapper,
      description: "مدارک و احراز هویت",
    },
  ];

  // Get menu items based on user role
  const getMenuItems = (): MenuItem[] => {
    if (!currentUser) return [];

    if (
      currentUser.roles.includes("admin") ||
      currentUser.roles.includes("super_admin")
    ) {
      return adminMenuItems;
    }
    return customerMenuItems;
  };

  const menuItems = getMenuItems();
  const activeMenuItem = menuItems.find((item) => item.id === selectedMenuItem);
  const ActiveComponent =
    activeMenuItem?.component || (() => <div>صفحه پیدا نشد</div>);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    showToast.success("با موفقیت خارج شدید");
    router.push("/auth/sms");
  };

  const getUserRole = () => {
    if (!currentUser) return "";
    if (currentUser.roles.includes("super_admin")) return "مدیر ارشد";
    if (currentUser.roles.includes("admin")) return "مدیر";
    return "کاربر";
  };

  const getUserName = () => {
    if (!currentUser) return "";
    return currentUser.firstName && currentUser.lastName
      ? `${currentUser.firstName} ${currentUser.lastName}`
      : currentUser.firstName || "کاربر";
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (userLoading || loading) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] rounded-2xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
            <FaCog className="text-white text-3xl animate-spin" />
          </div>
          <p className="text-[#0A1D37] font-bold text-lg">در حال بارگذاری...</p>
          <p className="text-gray-500 text-sm">لطفاً صبر کنید</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen " dir="rtl">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed right-0 top-0 h-full w-80 bg-white/95 backdrop-blur-xl border-l border-gray-200/50 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-[#0A1D37]/5 to-[#4DBFF0]/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                {" "}
                <div className="flex items-center cursor-pointer">
                  <Image
                    src="/assets/images/loggo.png"
                    width={70}
                    height={70}
                    alt="logo"
                    priority
                    className="transition-all duration-300"
                  />
                </div>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-[#0A1D37] mb-1">
                  ارزی پلاس
                </h1>
                <p className="text-sm text-gray-600 font-medium">پنل مدیریت</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <FaTimes className="text-gray-500 text-lg" />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-200/50 bg-gradient-to-b from-transparent to-gray-50/30">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#0A1D37] text-sm mb-1 truncate">
                {getUserName()} - {getUserRole()}
              </p>
            </div>
            {currentUser.phone && (
              <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-xl p-3.5 border border-gray-100">
                <p className="text-sm text-gray-700 flex items-center gap-2.5">
                  <span className="font-medium">{currentUser.phone}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-6 flex-1 overflow-y-auto max-h-[calc(100vh-400px)]">
          <div className="space-y-2.5">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedMenuItem(item.id);
                  window.location.hash = item.id;
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                  showToast.info(`بخش ${item.label} باز شد`);
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                  selectedMenuItem === item.id
                    ? "bg-gradient-to-r from-[#0A1D37]/15 to-[#4DBFF0]/15 border-2 border-[#0A1D37]/30 text-[#0A1D37] shadow-lg transform scale-[1.02]"
                    : "hover:bg-gray-50 text-gray-700 hover:text-[#0A1D37] hover:shadow-md hover:scale-[1.01] border-2 border-transparent"
                }`}
              >
                {selectedMenuItem === item.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0A1D37]/5 to-[#4DBFF0]/5 rounded-2xl animate-pulse" />
                )}
                <div
                  className={`flex-shrink-0 relative z-10 p-2.5 rounded-xl ${
                    selectedMenuItem === item.id
                      ? "text-[#0A1D37] bg-white/70 shadow-md"
                      : "text-gray-500 group-hover:text-[#0A1D37] group-hover:bg-[#0A1D37]/10"
                  } transition-all duration-300`}
                >
                  {item.icon}
                </div>
                <div className="flex-1 text-right relative z-10 min-w-0">
                  <p
                    className={`font-bold text-base mb-1 truncate ${
                      selectedMenuItem === item.id
                        ? "text-[#0A1D37]"
                        : "text-gray-700 group-hover:text-[#0A1D37]"
                    }`}
                  >
                    {item.label}
                  </p>
                  <p className="text-xs opacity-70 leading-relaxed line-clamp-1">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 relative z-10 flex-shrink-0">
                  {item.badge && (
                    <div className="min-w-[24px] h-6 px-2 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md animate-bounce">
                      {item.badge}
                    </div>
                  )}
                  <FaChevronLeft
                    className={`text-sm transition-all duration-300 ${
                      selectedMenuItem === item.id
                        ? "rotate-90 text-[#0A1D37]"
                        : "text-gray-400 group-hover:text-[#0A1D37] group-hover:translate-x-[-2px]"
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200/50 bg-gradient-to-t from-white to-transparent backdrop-blur-sm">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-600 hover:bg-red-50 hover:shadow-lg transition-all duration-300 group hover:scale-[1.02] active:scale-95 border-2 border-transparent hover:border-red-100"
          >
            <div className="p-2.5 bg-red-100 rounded-xl group-hover:bg-red-200 transition-all duration-300 shadow-sm">
              <FaSignOutAlt className="text-lg" />
            </div>
            <span className="font-bold text-base">خروج از حساب</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ease-in-out ${
          sidebarOpen ? "lg:mr-80" : "lg:mr-0"
        }`}
      >
        {/* Header */}
        <header className="bg-white/90  backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center justify-between p-4 lg:p-6 gap-4">
            <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
              {/* Toggle Button */}
              <button
                onClick={toggleSidebar}
                className="p-3 hover:bg-gradient-to-r hover:from-[#0A1D37]/10 hover:to-[#4DBFF0]/10 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 group border-2 border-transparent hover:border-[#0A1D37]/20 shadow-sm hover:shadow-md"
                title={sidebarOpen ? "بستن منو" : "باز کردن منو"}
              >
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <FaBars
                    className={`text-[#0A1D37] text-lg group-hover:text-[#0A1D37] transition-all duration-300 absolute ${
                      sidebarOpen
                        ? "opacity-0 rotate-90"
                        : "opacity-100 rotate-0"
                    }`}
                  />
                  <FaChevronRight
                    className={`text-[#0A1D37] text-lg transition-all duration-300 absolute ${
                      sidebarOpen
                        ? "opacity-100 rotate-0"
                        : "opacity-0 -rotate-90"
                    }`}
                  />
                </div>
              </button>

              <div className="min-w-0 flex-1">
                <h1 className="font-bold text-[#0A1D37] text-lg lg:text-xl mb-1 truncate">
                  {activeMenuItem?.label || "داشبورد"}
                </h1>
                <p className="text-xs lg:text-sm text-gray-600 truncate">
                  {activeMenuItem?.description || "خوش آمدید به پنل مدیریت"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] rounded-xl text-white font-bold text-sm hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <FaHome className="text-base" />
                <span className="hidden sm:inline">صفحه اصلی</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30">
          <div className="">
            {selectedMenuItem === "wallet" ? (
              <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#0A1D37]/10 to-[#4DBFF0]/10 rounded-xl flex items-center justify-center">
                        <FaWallet className="text-[#0A1D37] text-xl" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-[#0A1D37]">
                          کیف پول من
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                          مدیریت موجودی و تراکنش‌های مالی
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <WalletWrapper
                  initialTab={
                    (searchParams.get("walletTab") as
                      | "dashboard"
                      | "incomes"
                      | "withdraws"
                      | "add-funds"
                      | undefined) || "dashboard"
                  }
                  className=""
                />
              </div>
            ) : (
              <div className="max-w-7xl  mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <ActiveComponent />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Toggle Button for Mobile */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] rounded-full shadow-2xl flex items-center justify-center z-40 hover:scale-110 active:scale-95 transition-all duration-300 animate-bounce"
        >
          <FaBars className="text-white text-xl" />
        </button>
      )}
    </div>
  );
};

export default Dashboard;
