"use client";
import { useState, useEffect } from "react";
import {
  FaUniversity,
  FaIdCard,
  FaPhone,
  FaShieldAlt,
  FaCheck,
  FaExclamationTriangle,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
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

interface BankingInfoData {
  _id?: string;
  bankName: string;
  cardNumber: string;
  shebaNumber: string;
  accountHolderName: string;
  status?: "accepted" | "rejected" | "pending_verification";
  rejectionNotes?: string;
}

interface NationalCredentialsData {
  firstName: string;
  lastName: string;
  nationalNumber: string;
  nationalCardImageUrl: string;
  verificationImageUrl: string;
  status?: "accepted" | "rejected" | "pending_verification";
  rejectionNotes?: string;
}

interface ContactInfoData {
  homePhone: string;
  mobilePhone: string;
  email: string;
  address: string;
  postalCode: string;
  status?: "accepted" | "rejected" | "pending_verification";
  rejectionNotes?: string;
}

interface SecurityData {
  username: string;
  status: "active" | "suspended" | "banned" | "pending_verification";
  roles: ("user" | "admin" | "super_admin" | "moderator" | "support")[];
}

interface VerificationStatus {
  email: {
    isVerified: boolean;
    verifiedAt?: Date;
  };
  phone: {
    isVerified: boolean;
    verifiedAt?: Date;
    verificationCode?: string;
    verificationCodeExpires?: Date;
  };
  identity: {
    status: "not_submitted" | "pending" | "approved" | "rejected";
    submittedAt?: Date;
    reviewedAt?: Date;
    reviewedBy?: string;
    rejectionReason?: string;
  };
}

interface UserData {
  security?: SecurityData;
  nationalCredentials?: NationalCredentialsData;
  contactInfo?: ContactInfoData;
  bankingInfo?: BankingInfoData[];
  verificationStatus?: VerificationStatus;
}

interface UserApiResponse {
  user: {
    username: string;
    status: "active" | "suspended" | "banned" | "pending_verification";
    roles: ("user" | "admin" | "super_admin" | "moderator" | "support")[];
    nationalCredentials?: NationalCredentialsData;
    contactInfo?: ContactInfoData;
    bankingInfo?: BankingInfoData[];
    verifications?: VerificationStatus;
  };
}

interface UserValidationWrapperProps {
  initialData?: UserData;
  onSave?: (
    section: string,
    data:
      | BankingInfoData
      | NationalCredentialsData
      | ContactInfoData
      | SecurityData
  ) => void;
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
  const [userData, setUserData] = useState<UserData>(initialData || {});
  const [loading, setLoading] = useState(false);

  // Load user data from API
  const loadUserData = async (): Promise<void> => {
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
        const result: UserApiResponse = await response.json();
        setUserData({
          security: {
            username: result.user.username,
            status: result.user.status,
            roles: result.user.roles,
          },
          nationalCredentials: result.user.nationalCredentials || undefined,
          contactInfo: result.user.contactInfo || undefined,
          bankingInfo: result.user.bankingInfo || [], // Keep as array for proper checking
          verificationStatus: result.user.verifications || undefined,
        });
      }
    } catch (error) {
      console.log("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  // Check data completeness based on actual user data
  const checkDataCompleteness = (data: UserData): ValidationStatus => {
    const status: ValidationStatus = {
      security: false,
      nationalCredentials: false,
      contactInfo: false,
      bankingInfo: false,
    };

    // Check Security (username and basic setup)
    if (data.security?.username && data.security.username.trim() !== "") {
      status.security = true;
    }

    // Check National Credentials (name, national number, and documents)
    if (
      data.nationalCredentials?.firstName &&
      data.nationalCredentials?.lastName &&
      data.nationalCredentials?.nationalNumber &&
      data.nationalCredentials.firstName.trim() !== "" &&
      data.nationalCredentials.lastName.trim() !== "" &&
      data.nationalCredentials.nationalNumber.trim() !== ""
    ) {
      // Validate national number format
      const nationalValid = /^\d{10}$/.test(
        data.nationalCredentials.nationalNumber
      );

      // Complete if format is valid AND status is accepted
      const statusAccepted = data.nationalCredentials.status === "accepted";
      status.nationalCredentials = nationalValid && statusAccepted;
    }

    // Check Contact Info (required fields: email and mobilePhone)
    if (
      data.contactInfo?.email &&
      data.contactInfo?.mobilePhone &&
      data.contactInfo.email.trim() !== "" &&
      data.contactInfo.mobilePhone.trim() !== ""
    ) {
      // Validate required field formats
      const emailValid = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
        data.contactInfo.email
      );
      const mobileValid = /^09\d{9}$/.test(data.contactInfo.mobilePhone);

      // Validate optional fields if they exist
      let homePhoneValid = true;
      let postalCodeValid = true;
      let addressValid = true;

      if (
        data.contactInfo.homePhone &&
        data.contactInfo.homePhone.trim() !== ""
      ) {
        homePhoneValid = /^0\d{2,3}-?\d{7,8}$/.test(data.contactInfo.homePhone);
      }

      if (
        data.contactInfo.postalCode &&
        data.contactInfo.postalCode.trim() !== ""
      ) {
        postalCodeValid = /^\d{10}$/.test(data.contactInfo.postalCode);
      }

      if (data.contactInfo.address && data.contactInfo.address.trim() !== "") {
        addressValid = data.contactInfo.address.trim().length >= 10;
      }

      // Complete if all filled fields are valid AND status is accepted
      const fieldsValid =
        emailValid &&
        mobileValid &&
        homePhoneValid &&
        postalCodeValid &&
        addressValid;
      const statusAccepted = data.contactInfo.status === "accepted";
      status.contactInfo = fieldsValid && statusAccepted;
    }

    // Check Banking Info (at least one complete bank account)
    if (
      data.bankingInfo &&
      Array.isArray(data.bankingInfo) &&
      data.bankingInfo.length > 0
    ) {
      const firstBank = data.bankingInfo[0];
      if (
        firstBank?.bankName &&
        firstBank?.cardNumber &&
        firstBank?.shebaNumber &&
        firstBank?.accountHolderName &&
        firstBank.bankName.trim() !== "" &&
        firstBank.cardNumber.trim() !== "" &&
        firstBank.shebaNumber.trim() !== "" &&
        firstBank.accountHolderName.trim() !== ""
      ) {
        // Complete if banking info is filled AND status is accepted
        const statusAccepted = firstBank.status === "accepted";
        status.bankingInfo = statusAccepted;
      }
    }

    return status;
  };

  // Update validation status when user data changes
  useEffect(() => {
    if (userData && Object.keys(userData).length > 0) {
      const newStatus = checkDataCompleteness(userData);
      setValidationStatus(newStatus);
    }
  }, [userData]);

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
      icon: <FaShieldAlt className="text-lg sm:text-xl" />,
      component: Security,
      description: "نام کاربری، رمز عبور و تنظیمات امنیتی",
      color: "purple",
    },
    {
      id: "nationalCredentials",
      label: "مدارک هویتی",
      icon: <FaIdCard className="text-lg sm:text-xl" />,
      component: NationalCredentials,
      description: "کارت ملی، احراز هویت و مدارک شخصی",
      color: "emerald",
    },
    {
      id: "contactInfo",
      label: "اطلاعات تماس",
      icon: <FaPhone className="text-lg sm:text-xl" />,
      component: ContactInfo,
      description: "شماره تماس، ایمیل و آدرس",
      color: "blue",
    },
    {
      id: "bankingInfo",
      label: "اطلاعات بانکی",
      icon: <FaUniversity className="text-lg sm:text-xl" />,
      component: BankingInfo,
      description: "حساب بانکی برای دریافت درآمد",
      color: "indigo",
    },
  ];

  const handleSectionSave = async (
    section: string,
    data:
      | BankingInfoData
      | NationalCredentialsData
      | ContactInfoData
      | SecurityData
  ): Promise<void> => {
    onSave?.(section, data);

    // Refresh user data to update status indicators
    await loadUserData();
  };

  const getTabStatus = (tabId: string) => {
    const isValid = validationStatus[tabId as keyof ValidationStatus];
    if (isValid) {
      return {
        icon: <FaCheckCircle className="text-base sm:text-lg" />,
        color: "text-green-600",
        bg: "bg-gradient-to-br from-green-50 to-green-100/50",
        border: "border-green-300",
        statusText: "تکمیل شده",
        statusColor: "text-green-700",
        statusBg: "bg-green-100",
      };
    }
    return {
      icon: <FaTimesCircle className="text-base sm:text-lg" />,
      color: "text-orange-500",
      bg: "bg-gradient-to-br from-orange-50 to-orange-100/50",
      border: "border-orange-200",
      statusText: "تکمیل نشده",
      statusColor: "text-orange-700",
      statusBg: "bg-orange-100",
    };
  };

  // Render the appropriate component based on active tab
  const renderActiveComponent = () => {
    const verificationStatusWithEmail = userData?.verificationStatus
      ? {
          ...userData.verificationStatus,
          email: userData.verificationStatus.email || { isVerified: false },
        }
      : undefined;

    switch (activeTab) {
      case "security":
        return (
          <Security
            initialData={userData?.security as Partial<SecurityData>}
            verificationStatus={verificationStatusWithEmail}
            onSave={(data) => handleSectionSave(activeTab, data)}
          />
        );
      // case "nationalCredentials":
      //   return (
      //     <NationalCredentials
      //       initialData={userData?.nationalCredentials}
      //       onSave={(data) => handleSectionSave(activeTab, data)}
      //     />
      //   );
      case "contactInfo":
        return (
          <ContactInfo
            initialData={userData?.contactInfo}
            onSave={(data) => handleSectionSave(activeTab, data)}
          />
        );
      case "bankingInfo":
        return (
          <BankingInfo
            initialData={userData?.bankingInfo?.[0]}
            onSave={(data) => handleSectionSave(activeTab, data)}
          />
        );
      default:
        return (
          <Security
            initialData={userData?.security as Partial<SecurityData>}
            verificationStatus={verificationStatusWithEmail}
            onSave={(data) => handleSectionSave(activeTab, data)}
          />
        );
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
              <div className="flex-1">
                <h1
                  className={`text-xl  lg:text-2xl font-bold text-[#0A1D37] mb-2 sm:mb-3 ${estedadBold.className}`}
                >
                  تکمیل اطلاعات کاربری  
                </h1>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed">
                  برای استفاده کامل از خدمات، لطفاً تمامی بخش‌های زیر را تکمیل
                  کنید
                </p>
              </div>

              {/* Progress Circle */}
              <div className="flex items-center gap-3 sm:gap-4 self-center lg:self-auto">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24">
                  <svg
                    className="w-full h-full transform -rotate-90"
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
                      } transition-all duration-500`}
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={`${completionPercentage}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm sm:text-base lg:text-lg font-bold text-gray-700">
                      {Math.round(completionPercentage)}%
                    </span>
                  </div>
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-gray-600">
                  <div className="font-bold text-[#0A1D37] mb-1">
                    پیشرفت کلی
                  </div>
                  <div className="text-gray-600">
                    {Object.values(validationStatus).filter(Boolean).length} از
                    4 بخش
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden">
          {/* Tab Headers */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-1 mb-6 sm:mb-8 p-2">
            {tabs.map((tab) => {
              const status = getTabStatus(tab.id);
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 group hover:scale-[1.02] active:scale-[0.98] ${
                    isActive
                      ? `${status.bg} ${status.border} shadow-lg`
                      : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  {/* Icon and Status Indicator */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div
                      className={`flex items-center gap-2 sm:gap-3 ${status.color}`}
                    >
                      {tab.icon}
                      <div className={`transition-all duration-300`}>
                        {status.icon}
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-[#0A1D37] text-sm sm:text-base lg:text-lg mb-2 text-right">
                    {tab.label}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 leading-relaxed text-right line-clamp-2">
                    {tab.description}
                  </p>

                  {/* Status Badge */}
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold ${status.statusBg} ${status.statusColor}`}
                  >
                    {validationStatus[tab.id as keyof ValidationStatus] ? (
                      <>
                        <FaCheck className="text-xs" />
                        <span>{status.statusText}</span>
                      </>
                    ) : (
                      <>
                        <FaExclamationTriangle className="text-xs" />
                        <span>{status.statusText}</span>
                      </>
                    )}
                  </div>

               
                </button>
              );
            })}
          </div>

          {/* Final Status */}
          {completionPercentage === 100 && (
            <div className="mb-6 sm:mb-8">
              <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-green-50 to-green-100/50 border-2 border-green-300 rounded-2xl sm:rounded-3xl shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <div className="p-3 sm:p-4 bg-green-200 rounded-2xl flex-shrink-0">
                    <FaCheck className="text-green-700 text-2xl sm:text-3xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-green-900 text-lg sm:text-xl lg:text-2xl mb-2">
                      🎉 تبریک! تمامی اطلاعات تکمیل شد
                    </h3>
                    <p className="text-green-700 text-sm sm:text-base leading-relaxed">
                      حساب کاربری شما آماده استفاده است. می‌توانید از تمامی
                      خدمات ارزی پلاس بهره‌مند شوید.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-8">
              {loading ? (
                <div className="text-center py-12 sm:py-16 lg:py-20">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl animate-pulse"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FaSpinner className="animate-spin text-2xl sm:text-3xl text-white" />
                    </div>
                  </div>
                  <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-700 mb-2">
                    در حال بارگذاری...
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    لطفاً صبر کنید
                  </p>
                </div>
              ) : (
                <div className="min-h-[400px] sm:min-h-[500px]">
                  {renderActiveComponent()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="grid grid-cols-4 gap-1 p-2">
            {tabs.map((tab) => {
              // const status = getTabStatus(tab.id);
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 active:bg-gray-100"
                  }`}
                >
                  <div className="relative">
                    {tab.icon}
                    {validationStatus[tab.id as keyof ValidationStatus] && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <span className="text-xs font-medium truncate w-full text-center">
                    {tab.label.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Spacer for mobile navigation */}
        <div className="h-20 sm:hidden"></div>
      </div>
    </div>
  );
};

export default UserValidationWrapper;
