"use client";
import { useState, useEffect } from "react";
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
  FaSpinner,
  FaCamera,
  FaUserCircle,
} from "react-icons/fa";
import { showToast } from "@/utilities/toast";
import FileUploaderModal from "@/components/FileUploaderModal";
import Image from "next/image";

interface SecurityData {
  username: string;
  password: string;
  confirmPassword: string;
  status: "active" | "suspended" | "banned" | "pending_verification";
  roles: ("user" | "admin" | "super_admin" | "moderator" | "support")[];
  profile: {
    avatar: string;
    bio: string;
    preferences: {
      language: "fa" | "en";
      notifications: {
        email: boolean;
        sms: boolean;
        push: boolean;
      };
    };
  };
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
    profile: {
      avatar: initialData?.profile?.avatar || "",
      bio: initialData?.profile?.bio || "",
      preferences: {
        language: initialData?.profile?.preferences?.language || "fa",
        notifications: {
          email:
            initialData?.profile?.preferences?.notifications?.email ?? true,
          sms: initialData?.profile?.preferences?.notifications?.sms ?? true,
          push: initialData?.profile?.preferences?.notifications?.push ?? true,
        },
      },
    },
  });

  const [errors, setErrors] = useState<
    Partial<SecurityData & { confirmPassword: string }>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

  // Load current user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          const user = userData.user;

          console.log("Loaded user data:", user);

          setFormData((prev) => ({
            ...prev,
            username: user.username || "",
            status: user.status || "pending_verification",
            roles: user.roles || ["user"],
            profile: {
              avatar: user.profile?.avatar || "",
              bio: user.profile?.bio || "",
              preferences: {
                language: user.profile?.preferences?.language || "fa",
                notifications: {
                  email:
                    user.profile?.preferences?.notifications?.email ?? true,
                  sms: user.profile?.preferences?.notifications?.sms ?? true,
                  push: user.profile?.preferences?.notifications?.push ?? true,
                },
              },
            },
          }));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, []);

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
    field: keyof SecurityData | "confirmPassword" | string,
    value: string | string[] | boolean
  ) => {
    if (field === "confirmPassword") {
      setFormData((prev) => ({ ...prev, confirmPassword: value as string }));
    } else if (field.startsWith("profile.")) {
      const profileField = field.split(".")[1];
      if (profileField === "avatar" || profileField === "bio") {
        setFormData((prev) => ({
          ...prev,
          profile: {
            ...prev.profile,
            [profileField]: value as string,
          },
        }));
      } else if (profileField === "language") {
        setFormData((prev) => ({
          ...prev,
          profile: {
            ...prev.profile,
            preferences: {
              ...prev.profile.preferences,
              language: value as "fa" | "en",
            },
          },
        }));
      } else if (profileField.startsWith("notifications.")) {
        const notificationField = profileField.split(".")[1];
        setFormData((prev) => ({
          ...prev,
          profile: {
            ...prev.profile,
            preferences: {
              ...prev.profile.preferences,
              notifications: {
                ...prev.profile.preferences.notifications,
                [notificationField]: value as boolean,
              },
            },
          },
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
      console.log(formData);
    }
    setIsSaved(false);

    // Clear error for this field
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileUploaded = (fileUrl: string) => {
    handleInputChange("profile.avatar", fileUrl);
    setIsFileModalOpen(false);
    showToast.success("تصویر پروفایل با موفقیت آپلود شد!");
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
        profile: {
          avatar: formData.profile.avatar,
          bio: formData.profile.bio,
          preferences: {
            language: formData.profile.preferences.language,
            notifications: {
              email: formData.profile.preferences.notifications.email,
              sms: formData.profile.preferences.notifications.sms,
              push: formData.profile.preferences.notifications.push,
            },
          },
        },
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
    <div className="w-full min-h-screen sm:p-4 lg:p-6" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* Main Form */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border-2 border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#4DBFF0]/10 to-[#0A1D37]/5 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-gray-100">
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#0A1D37] flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <FaUser className="text-[#0A1D37] text-sm sm:text-base" />
              </div>
              <span>اطلاعات حساب کاربری</span>
            </h3>
          </div>

          <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            {/* Profile Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-blue-100">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500/20 to-indigo-500/10 rounded-xl flex items-center justify-center">
                  <FaUserCircle className="text-blue-600 text-sm sm:text-base" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-[#0A1D37]">
                    پروفایل کاربری
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    تصویر، بیوگرافی و تنظیمات شخصی
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Avatar Section */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#0A1D37]">
                    <FaCamera className="text-blue-500 text-sm sm:text-base" />
                    <span>تصویر پروفایل</span>
                  </label>

                  <div className="flex items-center gap-4">
                    {/* Avatar Display */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-blue-200 bg-gradient-to-br from-blue-100 to-indigo-100">
                      {formData.profile.avatar ? (
                        <Image
                          src={formData.profile.avatar}
                          alt="تصویر پروفایل"
                          fill
                          className="object-cover"
                          unoptimized={true}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaUserCircle className="text-blue-400 text-3xl sm:text-4xl" />
                        </div>
                      )}
                    </div>

                    {/* Upload Button */}
                    <div className="flex-1">
                      <button
                        type="button"
                        onClick={() => setIsFileModalOpen(true)}
                        className="w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base font-medium text-blue-700"
                      >
                        <FaCamera className="text-sm" />
                        <span>انتخاب تصویر</span>
                      </button>
                      {formData.profile.avatar && (
                        <button
                          type="button"
                          onClick={() =>
                            handleInputChange("profile.avatar", "")
                          }
                          className="w-full mt-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all duration-300 text-xs sm:text-sm font-medium text-red-600"
                        >
                          حذف تصویر
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio Section */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#0A1D37]">
                    <FaUser className="text-blue-500 text-sm sm:text-base" />
                    <span>بیوگرافی</span>
                    <span className="text-gray-400 text-xs sm:text-sm font-normal">
                      (حداکثر 500 کاراکتر)
                    </span>
                  </label>
                  <textarea
                    value={formData.profile.bio}
                    onChange={(e) =>
                      handleInputChange("profile.bio", e.target.value)
                    }
                    placeholder="درباره خود بنویسید..."
                    maxLength={500}
                    rows={4}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-gray-200 bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base resize-none"
                  />
                  <div className="text-xs text-gray-500 text-left">
                    {formData.profile.bio.length}/500
                  </div>
                </div>
              </div>
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

      {/* File Upload Modal */}
      <FileUploaderModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        onFileUploaded={handleFileUploaded}
        acceptedTypes={[".jpg", ".jpeg", ".png", ".gif", ".webp"]}
        maxFileSize={5 * 1024 * 1024} // 5MB
        title="آپلود تصویر پروفایل"
      />
    </div>
  );
};

export default Security;
