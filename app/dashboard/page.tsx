'use client'
import React, { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
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
  FaBell,
} from "react-icons/fa";
import { showToast } from "@/utilities/toast";

// Import wrappers
import UserWrapper from "@/components/admin/users/userWrapper";
import AdminServiceWrapper from "@/components/admin/services&orders/adminserviceWrapper";
import ServiceWrapper from "@/components/customerAdmins/ordersandservices/serviceWrapper";
import CredentialWrapper from "@/components/customerAdmins/credintials/credintialWrapper";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user: currentUser, isLoggedIn, loading: userLoading } = useCurrentUser();
  const router = useRouter();

  // Check authentication and redirect if needed
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log("Dashboard auth check:", { 
      isLoggedIn, 
      currentUser, 
      userLoading, 
      hasToken: !!token,
      tokenPreview: token?.substring(0, 20) + "..." 
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
    
    // Set default menu item based on role
    if (currentUser.roles.includes("admin") || currentUser.roles.includes("super_admin")) {
      setSelectedMenuItem("users");
    } else {
      setSelectedMenuItem("services");
    }
  }, [isLoggedIn, currentUser, userLoading, router]);

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
    
    if (currentUser.roles.includes("admin") || currentUser.roles.includes("super_admin")) {
      return adminMenuItems;
    }
    return customerMenuItems;
  };

  const menuItems = getMenuItems();
  const activeMenuItem = menuItems.find(item => item.id === selectedMenuItem);
  const ActiveComponent = activeMenuItem?.component || (() => <div>صفحه پیدا نشد</div>);

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

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <FaCog className="text-white text-2xl animate-spin" />
          </div>
          <p className="text-[#0A1D37] font-medium">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100" dir="rtl">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-white/80 backdrop-blur-xl border-l border-gray-200/50 shadow-xl z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] rounded-xl flex items-center justify-center">
                <FaHome className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#0A1D37]">ارزی پلاس</h1>
                <p className="text-sm text-gray-600">پنل مدیریت</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-[#FF7A00]/20 to-[#4DBFF0]/20 rounded-full flex items-center justify-center">
              <span className="text-[#FF7A00] font-bold text-lg">
                {getUserName().charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-semibold text-[#0A1D37]">{getUserName()}</p>
              <p className="text-sm text-gray-600">{getUserRole()}</p>
            </div>
          </div>
          {currentUser.phone && (
            <p className="text-xs text-gray-500 mb-2">📱 {currentUser.phone}</p>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 flex-1">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedMenuItem(item.id);
                  setSidebarOpen(false);
                  showToast.info(`بخش ${item.label} باز شد`);
                }}
                className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-200 group ${
                  selectedMenuItem === item.id
                    ? "bg-gradient-to-r from-[#FF7A00]/10 to-[#4DBFF0]/10 border border-[#FF7A00]/30 text-[#0A1D37] shadow-md"
                    : "hover:bg-gray-50 text-gray-700 hover:text-[#0A1D37]"
                }`}
              >
                <div className={`flex-shrink-0 ${
                  selectedMenuItem === item.id ? "text-[#FF7A00]" : "text-gray-500 group-hover:text-[#FF7A00]"
                }`}>
                  {item.icon}
                </div>
                <div className="flex-1 text-right">
                  <p className="font-semibold text-sm">{item.label}</p>
                  <p className="text-xs opacity-70">{item.description}</p>
                </div>
                <FaChevronLeft className={`text-xs transition-transform ${
                  selectedMenuItem === item.id ? "rotate-90 text-[#FF7A00]" : "text-gray-400"
                }`} />
                {item.badge && (
                  <div className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {item.badge}
                  </div>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 group"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="font-medium">خروج از حساب</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:mr-80">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white/80 backdrop-blur-xl border-b border-gray-200/50 p-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaBars className="text-[#0A1D37]" />
              </button>
              <div>
                <h1 className="font-bold text-[#0A1D37] text-sm">
                  {activeMenuItem?.label || "داشبورد"}
                </h1>
                <p className="text-xs text-gray-500">
                  خوش آمدید، {getUserName()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FaBell className="text-gray-600" />
                {/* Notification badge - you can add logic for actual notifications */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></div>
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] rounded-lg flex items-center justify-center">
                <FaHome className="text-white text-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="min-h-screen">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;