"use client";
import { useState } from "react";
import {
  FaShieldAlt,
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaExclamationTriangle,
   FaKey,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaSpinner,
} from "react-icons/fa";
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
  onValidationChange?: (isValid: boolean) => void;
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

  const getPasswordStrength = (password: string) => {
    if (!password) return { level: 0, text: "", color: "" };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { level: 1, text: "ضعیف", color: "bg-red-500" };
    if (strength <= 4)
      return { level: 2, text: "متوسط", color: "bg-yellow-500" };
    return { level: 3, text: "قوی", color: "bg-green-500" };
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
          Authorization: `Bearer ${token}`,
        },
      });

      if (!currentUserResponse.ok) {
        throw new Error("خطا در دریافت اطلاعات کاربری");
      }

      const currentUser = await currentUserResponse.json();

      const requestData = {
        userId: currentUser.user.id,
        username: formData.username,
        password: formData.password || undefined,
        roles: formData.roles,
        status: formData.status,
      };

      console.log("Sending security data:", requestData);

      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Security API Error Response:", errorData);
        throw new Error(
          errorData.error || `خطا در ذخیره اطلاعات (${response.status})`
        );
      }

      const result = await response.json();
      console.log(result);
      onSave?.(formData);
      setIsSaved(true);
      showToast.success("تنظیمات امنیتی با موفقیت ذخیره شد");
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Error saving security settings:", error);
      showToast.error(
        error instanceof Error ? error.message : "خطا در ذخیره اطلاعات"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div
      className="w-full min-h-screen   sm:p-4 lg:p-6"
      dir="rtl"
    >
      <div className="max-w-5xl mx-auto">
        {/* Main Form */}
        <div className="  rounded-2xl sm:rounded-3xl shadow-lg border-2 border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#4DBFF0]/10 to-[#0A1D37]/5 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-gray-100">
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#0A1D37] flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <FaUser className="text-[#0A1D37] text-sm sm:text-base" />
              </div>
              <span>اطلاعات حساب کاربری</span>
            </h3>
          </div>

          <div className="p-2 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            {/* Username */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#0A1D37]">
                <FaUser className="text-[#4DBFF0] text-sm sm:text-base" />
                <span>نام کاربری</span>
                <span className="text-red-500 text-lg">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  placeholder="نام کاربری منحصر به فرد"
                  className={`w-full px-4 sm:px-5 py-3 sm:py-4 pr-12 sm:pr-14 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 text-sm sm:text-base ${
                    errors.username
                      ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500/30"
                      : formData.username && validateUsername(formData.username)
                      ? "border-green-300 bg-green-50 focus:ring-2 focus:ring-green-500/30"
                      : "border-gray-200 bg-gray-50 focus:ring-2 focus:ring-[#4DBFF0]/30 focus:border-[#4DBFF0]"
                  }`}
                  dir="ltr"
                />
                <div className="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2">
                  {errors.username ? (
                    <FaTimesCircle className="text-red-500 text-base sm:text-lg" />
                  ) : formData.username &&
                    validateUsername(formData.username) ? (
                    <FaCheckCircle className="text-green-500 text-base sm:text-lg" />
                  ) : (
                    <FaUser className="text-gray-400 text-base sm:text-lg" />
                  )}
                </div>
              </div>
              {errors.username ? (
                <div className="flex items-center gap-2 text-red-600 text-xs sm:text-sm bg-red-50 p-3 rounded-xl border border-red-200">
                  <FaExclamationTriangle className="text-sm flex-shrink-0" />
                  <span>{errors.username}</span>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-gray-600 text-xs sm:text-sm bg-blue-50 p-3 rounded-xl border border-blue-200">
                  <FaInfoCircle className="text-[#4DBFF0] text-sm flex-shrink-0 mt-0.5" />
                  <span>
                    نام کاربری باید 3-30 کاراکتر و شامل حروف، اعداد و _ باشد
                  </span>
                </div>
              )}
            </div>

            {/* Password Section */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-gray-100">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#4DBFF0]/20 to-[#0A1D37]/10 rounded-xl flex items-center justify-center">
                  <FaLock className="text-[#0A1D37] text-sm sm:text-base" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-[#0A1D37]">
                    تغییر رمز عبور
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    فقط در صورت نیاز به تغییر رمز عبور، این فیلدها را پر کنید
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* New Password */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#0A1D37]">
                    <FaLock className="text-[#4DBFF0] text-sm sm:text-base" />
                    <span>رمز عبور جدید</span>
                    <span className="text-gray-400 text-xs sm:text-sm font-normal">
                      (اختیاری)
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      placeholder="حداقل 6 کاراکتر"
                      className={`w-full px-4 sm:px-5 py-3 sm:py-4 pr-12 sm:pr-14 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 text-sm sm:text-base ${
                        errors.password
                          ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500/30"
                          : formData.password &&
                            validatePassword(formData.password)
                          ? "border-green-300 bg-green-50 focus:ring-2 focus:ring-green-500/30"
                          : "border-gray-200 bg-white focus:ring-2 focus:ring-[#4DBFF0]/30 focus:border-[#4DBFF0]"
                      }`}
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#0A1D37] transition-colors p-1"
                    >
                      {showPassword ? (
                        <FaEyeSlash className="text-base sm:text-lg" />
                      ) : (
                        <FaEye className="text-base sm:text-lg" />
                      )}
                    </button>
                  
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                            style={{
                              width: `${(passwordStrength.level / 3) * 100}%`,
                            }}
                          />
                        </div>
                        <span
                          className={`text-xs sm:text-sm font-bold ${
                            passwordStrength.level === 1
                              ? "text-red-600"
                              : passwordStrength.level === 2
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {passwordStrength.text}
                        </span>
                      </div>
                      {errors.password && (
                        <div className="flex items-center gap-2 text-red-600 text-xs sm:text-sm bg-red-50 p-2 sm:p-3 rounded-xl border border-red-200">
                          <FaExclamationTriangle className="text-sm flex-shrink-0" />
                          <span>{errors.password}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#0A1D37]">
                    <FaKey className="text-[#4DBFF0] text-sm sm:text-base" />
                    <span>تکرار رمز عبور</span>
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
                      className={`w-full px-4 sm:px-5 py-3 sm:py-4 pr-12 sm:pr-14 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed ${
                        errors.confirmPassword
                          ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500/30"
                          : formData.confirmPassword &&
                            formData.password === formData.confirmPassword
                          ? "border-green-300 bg-green-50 focus:ring-2 focus:ring-green-500/30"
                          : "border-gray-200 bg-white focus:ring-2 focus:ring-[#4DBFF0]/30 focus:border-[#4DBFF0]"
                      }`}
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={!formData.password}
                      className="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#0A1D37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed p-1"
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="text-base sm:text-lg" />
                      ) : (
                        <FaEye className="text-base sm:text-lg" />
                      )}
                    </button>
                    <div className="absolute right-4 sm:right-20 top-1/2 transform -translate-y-1/2">
                      {errors.confirmPassword ? (
                        <FaTimesCircle className="text-red-500 text-base sm:text-lg" />
                      ) : formData.confirmPassword &&
                        formData.password === formData.confirmPassword ? (
                        <FaCheckCircle className="text-green-500 text-base sm:text-lg" />
                      ) : (
                        <span />
                      )}
                    </div>
                  </div>
                  {errors.confirmPassword && (
                    <div className="flex items-center gap-2 text-red-600 text-xs sm:text-sm bg-red-50 p-2 sm:p-3 rounded-xl border border-red-200">
                      <FaExclamationTriangle className="text-sm flex-shrink-0" />
                      <span>{errors.confirmPassword}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Security Tips */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
               
                <div className="flex-1">
                  <h4 className="text-sm sm:text-base font-bold text-blue-800 mb-2 sm:mb-3">
                    نکات امنیتی مهم  
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-blue-700">
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-blue-600 text-sm flex-shrink-0 mt-0.5" />
                      <span>
                        از رمز عبور قوی استفاده کنید (حداقل 6 کاراکتر)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-blue-600 text-sm flex-shrink-0 mt-0.5" />
                      <span>
                        ترکیبی از حروف بزرگ، کوچک و اعداد استفاده کنید
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-blue-600 text-sm flex-shrink-0 mt-0.5" />
                      <span>رمز عبور خود را با دیگران به اشتراک نگذارید</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FaCheckCircle className="text-blue-600 text-sm flex-shrink-0 mt-0.5" />
                      <span>به صورت دوره‌ای رمز عبور خود را تغییر دهید</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-t-2 border-gray-100">
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className={`flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 ${
                  isLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : isSaved
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-gradient-to-r from-[#4DBFF0] to-[#4DBFF0] text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                }`}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin text-lg" />
                    <span>در حال ذخیره...</span>
                  </>
                ) : isSaved ? (
                  <>
                    <FaCheckCircle className="text-lg" />
                    <span>ذخیره شد ✓</span>
                  </>
                ) : (
                  <>
                    <FaShieldAlt className="text-lg" />
                    <span>ذخیره تنظیمات</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
