"use client";
import { useState, useEffect } from "react";
import {
  FaUniversity,
  FaIdCard,
  FaPhone,
  FaShieldAlt,
  FaCheck,
  FaExclamationTriangle,
  FaClock,
} from "react-icons/fa";
import { estedadBold } from "@/next-persian-fonts/estedad/index";

// Import the form components
import BankingInfo from "./banckinginfo";
import NationalCredentials from "./natinals";
import ContactInfo from "./phonrnumber";
import Security from "./security";

interface ValidationStatus {
  bankingInfo: boolean;
  nationalCredentials: boolean;
  contactInfo: boolean;
  security: boolean;
}

interface UserValidationWrapperProps {
  initialData?: {
    bankingInfo?: any;
    nationalCredentials?: any;
    contactInfo?: any;
    security?: any;
    verificationStatus?: any;
  };
  onSave?: (section: string, data: any) => void;
}

const UserValidationWrapper = ({
  initialData,
  onSave,
}: UserValidationWrapperProps) => {
  const [activeTab, setActiveTab] = useState("security");
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>({
    bankingInfo: false,
    nationalCredentials: false,
    contactInfo: false,
    security: false,
  });
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [userData, setUserData] = useState<any>(initialData || {});
  const [loading, setLoading] = useState(false);

  // Load user data from API
  const loadUserData = async () => {
    if (initialData) return; // Use provided data if available

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      
      // Load current user data
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setUserData({
          security: {
            username: result.user.username,
            status: result.user.status,
            roles: result.user.roles,
          },
          nationalCredentials: result.user.nationalCredentials,
          contactInfo: result.user.contactInfo,
          bankingInfo: result.user.bankingInfo?.[0], // Get first banking info
          verificationStatus: result.user.verifications,
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  // Calculate completion percentage
  useEffect(() => {
    const completedSections =
      Object.values(validationStatus).filter(Boolean).length;
    const percentage = (completedSections / 4) * 100;
    setCompletionPercentage(percentage);
  }, [validationStatus]);

  // Tab configuration
  const tabs = [
    {
      id: "security",
      label: "امنیت و دسترسی",
      icon: <FaShieldAlt />,
      component: Security,
      description: "نام کاربری، رمز عبور و تنظیمات امنیتی",
      color: "purple",
    },
    {
      id: "nationalCredentials",
      label: "مدارک هویتی",
      icon: <FaIdCard />,
      component: NationalCredentials,
      description: "کارت ملی، احراز هویت و مدارک شخصی",
      color: "emerald",
    },
    {
      id: "contactInfo",
      label: "اطلاعات تماس",
      icon: <FaPhone />,
      component: ContactInfo,
      description: "شماره تماس، ایمیل و آدرس",
      color: "blue",
    },
    {
      id: "bankingInfo",
      label: "اطلاعات بانکی",
      icon: <FaUniversity />,
      component: BankingInfo,
      description: "حساب بانکی برای دریافت درآمد",
      color: "indigo",
    },
  ];

  const handleValidationChange = (
    section: keyof ValidationStatus,
    isValid: boolean
  ) => {
    setValidationStatus((prev) => ({ ...prev, [section]: isValid }));
  };

  const handleSectionSave = (section: string, data: any) => {
    onSave?.(section, data);
  };

  const getTabStatus = (tabId: string) => {
    const isValid = validationStatus[tabId as keyof ValidationStatus];
    if (isValid) {
      return {
        icon: <FaCheck />,
        color: "text-green-600",
        bg: "bg-green-100",
        border: "border-green-200",
      };
    }
    return {
      icon: <FaExclamationTriangle />,
      color: "text-red-400",
      bg: "bg-red-50",
      border: "border-red-200",
    };
  };

  const getColorClasses = (color: string, isActive: boolean = false) => {
    const colors = {
      purple: {
        active: "bg-purple-600 text-white border-purple-600",
        inactive: "text-purple-600 border-purple-200 hover:bg-purple-50",
        icon: "text-purple-600",
      },
      emerald: {
        active: "bg-emerald-600 text-white border-emerald-600",
        inactive: "text-emerald-600 border-emerald-200 hover:bg-emerald-50",
        icon: "text-emerald-600",
      },
      blue: {
        active: "bg-blue-600 text-white border-blue-600",
        inactive: "text-blue-600 border-blue-200 hover:bg-blue-50",
        icon: "text-blue-600",
      },
      indigo: {
        active: "bg-indigo-600 text-white border-indigo-600",
        inactive: "text-indigo-600 border-indigo-200 hover:bg-indigo-50",
        icon: "text-indigo-600",
      },
    };
    return (
      colors[color as keyof typeof colors]?.[
        isActive ? "active" : "inactive"
      ] || ""
    );
  };

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || Security;

  return (
    <div className="w-full max-w-7xl mx-auto p-6 mt-32 " dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className={`text-3xl font-bold text-gray-900 ${estedadBold.className}`}
            >
              تکمیل اطلاعات کاربری
            </h1>
            <p className="text-gray-600 mt-2">
              برای استفاده کامل از خدمات، لطفاً تمامی بخش‌های زیر را تکمیل کنید
            </p>
          </div>

          {/* Progress Circle */}
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20">
              <svg
                className="w-20 h-20 transform -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  className="text-gray-200"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`${
                    completionPercentage === 100
                      ? "text-green-500"
                      : "text-indigo-500"
                  }`}
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={`${completionPercentage}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-700">
                  {Math.round(completionPercentage)}%
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <div className="font-medium">پیشرفت کلی</div>
              <div>
                {Object.values(validationStatus).filter(Boolean).length} از 4
                بخش
              </div>
            </div>
          </div>
        </div>


      </div>

      {/* Tabs */}
      <div className=" rounded-4xl overflow-hidden">
        {/* Tab Headers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 my-8 max-w-4xl mx-auto">
          {tabs.map((tab) => {
            const isCompleted =
              validationStatus[tab.id as keyof ValidationStatus];
            const status = getTabStatus(tab.id);

            return (
              <div
                key={tab.id}
                className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                  activeTab === tab.id
                    ? `${status.bg} ${status.border}`
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="flex items-center gap-3 mb-2">
                
                  <div className={`text-lg ${status.color}`}>{status.icon}</div>
                </div>

                <h3 className="font-medium text-gray-900 text-sm mb-1">
                  {tab.label}
                </h3>


                <div
                  className={`text-xs font-medium ${
                    isCompleted ? "text-green-700" : "text-red-600"
                  }`}
                >
                  {isCompleted ? "✓ تکمیل شده" : "! تکمیل نشده"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Final Status */}
        {completionPercentage === 100 && (
          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-200 rounded-full">
                <FaCheck className="text-green-700 text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-green-900 text-lg">
                  🎉 تبریک! تمامی اطلاعات تکمیل شد
                </h3>
                <p className="text-green-700 mt-1">
                  حساب کاربری شما آماده استفاده است. می‌توانید از تمامی خدمات
                  ارزی پلاس بهره‌مند شوید.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="p-8">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">در حال بارگذاری...</p>
            </div>
          ) : (
            <ActiveComponent
              initialData={userData?.[activeTab as keyof typeof userData]}
              verificationStatus={userData?.verificationStatus}
              onSave={(data: any) => handleSectionSave(activeTab, data)}
              onValidationChange={(isValid: boolean) =>
                handleValidationChange(
                  activeTab as keyof ValidationStatus,
                  isValid
                )
              }
            />
          )}
        </div>
      </div>

      {/* Completion Status Cards */}
    </div>
  );
};

export default UserValidationWrapper;
