"use client";
import { useState, useEffect } from "react";
import {
  FaUniversity,
  FaIdCard,
  FaPhone,
  FaShieldAlt,
  FaCheck,
  FaExclamationTriangle,
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
  onSave?: (section: string, data: BankingInfoData | NationalCredentialsData | ContactInfoData | SecurityData) => void;
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
      console.error("Error loading user data:", error);
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
      const nationalValid = /^\d{10}$/.test(data.nationalCredentials.nationalNumber);
      
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
      const emailValid = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.contactInfo.email);
      const mobileValid = /^09\d{9}$/.test(data.contactInfo.mobilePhone);
      
      // Validate optional fields if they exist
      let homePhoneValid = true;
      let postalCodeValid = true;
      let addressValid = true;
      
      if (data.contactInfo.homePhone && data.contactInfo.homePhone.trim() !== "") {
        homePhoneValid = /^0\d{2,3}-?\d{7,8}$/.test(data.contactInfo.homePhone);
      }
      
      if (data.contactInfo.postalCode && data.contactInfo.postalCode.trim() !== "") {
        postalCodeValid = /^\d{10}$/.test(data.contactInfo.postalCode);
      }
      
      if (data.contactInfo.address && data.contactInfo.address.trim() !== "") {
        addressValid = data.contactInfo.address.trim().length >= 10;
      }
      
      // Complete if all filled fields are valid AND status is accepted
      const fieldsValid = emailValid && mobileValid && homePhoneValid && postalCodeValid && addressValid;
      const statusAccepted = data.contactInfo.status === "accepted";
      status.contactInfo = fieldsValid && statusAccepted;
    }

    // Check Banking Info (at least one complete bank account)
    if (data.bankingInfo && Array.isArray(data.bankingInfo) && data.bankingInfo.length > 0) {
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

  const handleSectionSave = async (section: string, data: BankingInfoData | NationalCredentialsData | ContactInfoData | SecurityData): Promise<void> => {
    onSave?.(section, data);
    
    // Refresh user data to update status indicators
    await loadUserData();
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



  // Render the appropriate component based on active tab
  const renderActiveComponent = () => {
    const verificationStatusWithEmail = userData?.verificationStatus ? {
      ...userData.verificationStatus,
      email: userData.verificationStatus.email || { isVerified: false }
    } : undefined;

    switch (activeTab) {
      case "security":
        return (
          <Security
            initialData={userData?.security as Partial<SecurityData>}
            verificationStatus={verificationStatusWithEmail}
            onSave={(data) => handleSectionSave(activeTab, data)}
          />
        );
      case "nationalCredentials":
        return (
          <NationalCredentials
            initialData={userData?.nationalCredentials}
            onSave={(data) => handleSectionSave(activeTab, data)}
          />
        );
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
            renderActiveComponent()
          )}
        </div>
      </div>

      {/* Completion Status Cards */}
    </div>
  );
};

export default UserValidationWrapper;
