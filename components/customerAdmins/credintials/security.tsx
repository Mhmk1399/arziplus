"use client";
import { useState } from "react";
import {
  FaShieldAlt,
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaExclamationTriangle,
  FaCheck,
  FaKey,
} from "react-icons/fa";
import { estedadBold } from "@/next-persian-fonts/estedad/index";
import { showToast } from "@/utilities/toast";

interface SecurityData {
  username: string;
  password: string;
  confirmPassword: string;
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
  };
  identity: {
    status: "not_submitted" | "pending" | "approved" | "rejected";
    submittedAt?: Date;
    reviewedAt?: Date;
    rejectionReason?: string;
  };
}

interface SecurityProps {
  initialData?: Partial<SecurityData>;
  verificationStatus?: VerificationStatus;
  onSave?: (data: SecurityData) => void;
  onValidationChange?: (isValid: boolean) => void; // Optional for backward compatibility
}

const Security = ({
  initialData,
  onSave,
  onValidationChange,
}: SecurityProps) => {
  const [formData, setFormData] = useState<SecurityData>({
    username: initialData?.username || "",
    password: "",
    confirmPassword: "",
    status: initialData?.status || "pending_verification",
    roles: initialData?.roles || ["user"],
  });

  const [errors, setErrors] = useState<
    Partial<SecurityData & { confirmPassword: string }>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Default verification status
  const defaultVerificationStatus: VerificationStatus = {
    email: { isVerified: false },
    phone: { isVerified: false },
    identity: { status: "not_submitted" },
  };





  // Validation functions
  const validateUsername = (username: string): boolean => {
    return (
      username.length >= 3 &&
      username.length <= 30 &&
      /^[a-zA-Z0-9_]+$/.test(username)
    );
  };

  const validatePassword = (password: string): boolean => {
    return (
      password.length >= 6 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<SecurityData & { confirmPassword: string }> = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "نام کاربری الزامی است";
    } else if (!validateUsername(formData.username)) {
      newErrors.username =
        "نام کاربری باید 3-30 کاراکتر و شامل حروف، اعداد و _ باشد";
    }

    // Password validation (only if provided)
    if (formData.password) {
      if (!validatePassword(formData.password)) {
        newErrors.password =
          "رمز عبور باید حداقل 6 کاراکتر، شامل حروف بزرگ، کوچک و عدد باشد";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "تکرار رمز عبور مطابقت ندارد";
      }
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    onValidationChange?.(isValid);
    return isValid;
  };

  const handleInputChange = (
    field: keyof SecurityData | "confirmPassword",
    value: string | string[]
  ) => {
    if (field === "confirmPassword") {
      setFormData((prev) => ({ ...prev, confirmPassword: value as string }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
    setIsSaved(false);

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };



  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      
      // Get current user info to determine userId
      const currentUserResponse = await fetch("/api/auth/me", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (!currentUserResponse.ok) {
        throw new Error("خطا در دریافت اطلاعات کاربری");
      }
      
      const currentUser = await currentUserResponse.json();
      
      const requestData = {
        userId: currentUser.user.id, // Add the required userId field
        username: formData.username,
        password: formData.password || undefined,
        roles: formData.roles,
        status: formData.status,
      };

      console.log("Sending security data:", requestData); // Debug log
      
      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Security API Error Response:", errorData); // Debug log
        throw new Error(errorData.error || `خطا در ذخیره اطلاعات (${response.status})`);
      }

      const result = await response.json();
      console.log(result)
      onSave?.(formData);
      setIsSaved(true);
      showToast.success("تنظیمات امنیتی با موفقیت ذخیره شد");
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Error saving security settings:", error);
      showToast.error(error instanceof Error ? error.message : "خطا در ذخیره اطلاعات");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="w-full max-w-4xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-[#4DBFF0]/20 rounded-xl">
            <FaShieldAlt className="text-[#0A1D37] text-xl" />
          </div>
          <div>
            <h2
              className={`text-2xl font-bold text-gray-900 ${estedadBold.className}`}
            >
              تنظیمات اطلاعات کاربری
            </h2>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Account Information */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <FaUser className="text-[#0A1D37]" />
            اطلاعات حساب کاربری
          </h3>

          <div className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FaUser className="text-[#0A1D37]" />
                نام کاربری
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                placeholder="نام کاربری منحصر به فرد"
                className={`w-full px-4 py-3 pr-12 rounded-xl border transition-all duration-200 ${
                  errors.confirmPassword
                    ? "border-red-300 bg-red-50 focus:ring-red-500"
                    : "border-gray-200 bg-gray-50"
                } `}
                dir="ltr"
              />
              {errors.username && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <FaExclamationTriangle className="text-xs" />
                  {errors.username}
                </div>
              )}
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* New Password */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaLock className="text-[#0A1D37]" />
                  رمز عبور جدید
                  <span className="text-gray-400 text-xs">(اختیاری)</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder="حداقل 6 کاراکتر"
                    className={`w-full px-4 py-3 pr-12 rounded-xl border transition-all duration-200 ${
                      errors.password
                        ? "border-red-300 bg-red-50 focus:ring-red-500"
                        : "border-gray-200 bg-gray-50"
                    } `}
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <FaExclamationTriangle className="text-xs" />
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaKey className="text-[#0A1D37]" />
                  تکرار رمز عبور
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    placeholder="تکرار رمز عبور"
                    disabled={!formData.password}
                    className={`w-full px-4 py-3 pr-12 rounded-xl border transition-all duration-200 ${
                      errors.confirmPassword
                        ? "border-red-300 bg-red-50 focus:ring-red-500"
                        : "border-gray-200 bg-gray-50"
                    } `}
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={!formData.password}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <FaExclamationTriangle className="text-xs" />
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                isLoading
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : isSaved
                  ? "bg-green-600 text-white"
                  : "bg-[#0A1D37] hover:bg-[#4DBFF0]/20 text-white hover:text-black shadow-lg hover:shadow-xl"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  در حال ذخیره...
                </>
              ) : isSaved ? (
                <>
                  <FaCheck />
                  ذخیره شد
                </>
              ) : (
                "ذخیره تنظیمات"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
