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
  FaInfoCircle,
  FaCheck,
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
    avatar?: string;
    bio?: string;
    preferences?: {
      language: "fa" | "en";
      notifications?: {
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
        console.log("Error loading user data:", error);
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

    if (!formData.username.trim()) {
      newErrors.username = "نام کاربری الزامی است";
    } else if (!validateUsername(formData.username)) {
      newErrors.username =
        "نام کاربری باید 3-30 کاراکتر و شامل حروف، اعداد و _ باشد";
    }

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
        setFormData((prev) => {
          const prevPrefs = prev.profile.preferences ?? {
            language: "fa",
            notifications: { email: true, sms: true, push: true },
          };
          const prevNotifications = prevPrefs.notifications ?? {
            email: true,
            sms: true,
            push: true,
          };
          return {
            ...prev,
            profile: {
              ...prev.profile,
              preferences: {
                language: value as "fa" | "en",
                notifications: {
                  email: prevNotifications.email,
                  sms: prevNotifications.sms,
                  push: prevNotifications.push,
                },
              },
            },
          };
        });
      } else if (profileField.startsWith("notifications.")) {
        const notificationField = profileField.split(".")[1] as
          | "email"
          | "sms"
          | "push";
        setFormData((prev) => {
          const prevPrefs = prev.profile.preferences ?? {
            language: "fa",
            notifications: { email: true, sms: true, push: true },
          };
          const prevNotifications = prevPrefs.notifications ?? {
            email: true,
            sms: true,
            push: true,
          };
          return {
            ...prev,
            profile: {
              ...prev.profile,
              preferences: {
                language: prevPrefs.language ?? "fa",
                notifications: {
                  ...prevNotifications,
                  [notificationField]: value as boolean,
                },
              },
            },
          };
        });
      }
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
    setIsSaved(false);

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
            language: formData.profile.preferences?.language,
            notifications: {
              email: formData.profile.preferences?.notifications?.email,
              sms: formData.profile.preferences?.notifications?.sms,
              push: formData.profile.preferences?.notifications?.push,
            },
          },
        },
      };

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
        throw new Error(
          errorData.error || `خطا در ذخیره اطلاعات (${response.status})`
        );
      }

      const result = await response.json();
      onSave?.(formData);
      setIsSaved(true);
      showToast.success("تنظیمات امنیتی با موفقیت ذخیره شد");
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      showToast.error(
        error instanceof Error ? error.message : "خطا در ذخیره اطلاعات"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="w-full min-h-screen  " dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Main Form */}
        <div className="bg-white rounded-2xl sm:rounded-3xl   overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            {/* Profile Section */}
            <div className="relative">
              {/* Avatar & Bio Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
                {/* Avatar Section */}
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FaCamera className="text-blue-500" />
                    <span>تصویر پروفایل</span>
                  </label>

                  <div className="flex items-center gap-4 sm:gap-5 p-4 sm:p-5 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-300 transition-all duration-300">
                    {/* Avatar Display */}
                    <div className="relative">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-blue-100 to-indigo-100">
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
                            <FaUserCircle className="text-blue-300 text-4xl sm:text-5xl" />
                          </div>
                        )}
                      </div>
                      {formData.profile.avatar && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <FaCheck className="text-white text-xs" />
                        </div>
                      )}
                    </div>

                    {/* Upload Controls */}
                    <div className="flex-1 space-y-2">
                      <button
                        type="button"
                        onClick={() => setIsFileModalOpen(true)}
                        className="w-full px-4 py-2.5 sm:py-3 bg-white border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-semibold text-blue-700 shadow-sm hover:shadow"
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
                          className="w-full px-4 py-2 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all duration-300 text-xs sm:text-sm font-medium text-red-600"
                        >
                          حذف تصویر
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Image Tips */}
                  <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <FaInfoCircle className="text-blue-500 text-sm mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-700">
                      فرمت‌های مجاز: JPG, PNG, GIF, WEBP - حداکثر حجم: 5MB
                    </p>
                  </div>
                </div>

                {/* Bio Section */}
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FaUser className="text-blue-500" />
                    <span>بیوگرافی</span>
                    <span className="text-gray-400 text-xs font-normal">
                      (اختیاری)
                    </span>
                  </label>
                  <div className="relative">
                    <textarea
                      value={formData.profile.bio}
                      onChange={(e) =>
                        handleInputChange("profile.bio", e.target.value)
                      }
                      placeholder="چند کلمه درباره خودتان بنویسید..."
                      maxLength={500}
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-sm resize-none placeholder:text-gray-400"
                    />
                    <div className="absolute bottom-3 left-3 text-xs text-gray-400 bg-white px-2 py-1 rounded-lg border border-gray-200">
                      {formData.profile.bio?.length}/500
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-100"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs sm:text-sm font-medium text-gray-400">
                  امنیت حساب
                </span>
              </div>
            </div>

            {/* Password Section */}
            <div className="relative">
              {/* Section Header */}
              <div className="flex items-start sm:items-center justify-between mb-5 sm:mb-6 pb-4 sm:pb-5 border-b-2 border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl flex items-center justify-center">
                    <FaLock className="text-indigo-600 text-lg sm:text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                      تغییر رمز عبور
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                      فقط در صورت نیاز به تغییر رمز عبور، این فیلدها را پر کنید
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
                {/* New Password */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FaLock className="text-indigo-500" />
                    <span>رمز عبور جدید</span>
                    <span className="text-gray-400 text-xs font-normal">
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
                      className={`w-full px-5 py-3.5 pr-12 rounded-xl border-2 transition-all duration-300 text-sm focus:outline-none ${
                        errors.password
                          ? "border-red-300 bg-red-50/50 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                          : formData.password &&
                            validatePassword(formData.password)
                          ? "border-green-300 bg-green-50/50 focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                          : "border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      }`}
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                      {showPassword ? (
                        <FaEyeSlash className="text-lg" />
                      ) : (
                        <FaEye className="text-lg" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600 font-medium">
                            قدرت رمز عبور:
                          </span>
                          <span
                            className={`text-xs font-bold ${
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
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${passwordStrength.color}`}
                            style={{
                              width: `${(passwordStrength.level / 3) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Password Requirements */}
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                        <p className="text-xs font-semibold text-gray-700 mb-2">
                          الزامات رمز عبور:
                        </p>
                        <div className="space-y-1.5">
                          <div
                            className={`flex items-center gap-2 text-xs ${
                              formData.password.length >= 6
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            <FaCheckCircle
                              className={
                                formData.password.length >= 6
                                  ? "text-green-500"
                                  : "text-gray-300"
                              }
                            />
                            <span>حداقل 6 کاراکتر</span>
                          </div>
                          <div
                            className={`flex items-center gap-2 text-xs ${
                              /[A-Z]/.test(formData.password)
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            <FaCheckCircle
                              className={
                                /[A-Z]/.test(formData.password)
                                  ? "text-green-500"
                                  : "text-gray-300"
                              }
                            />
                            <span>حداقل یک حرف بزرگ (A-Z)</span>
                          </div>
                          <div
                            className={`flex items-center gap-2 text-xs ${
                              /[a-z]/.test(formData.password)
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            <FaCheckCircle
                              className={
                                /[a-z]/.test(formData.password)
                                  ? "text-green-500"
                                  : "text-gray-300"
                              }
                            />
                            <span>حداقل یک حرف کوچک (a-z)</span>
                          </div>
                          <div
                            className={`flex items-center gap-2 text-xs ${
                              /[0-9]/.test(formData.password)
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            <FaCheckCircle
                              className={
                                /[0-9]/.test(formData.password)
                                  ? "text-green-500"
                                  : "text-gray-300"
                              }
                            />
                            <span>حداقل یک عدد (0-9)</span>
                          </div>
                        </div>
                      </div>

                      {errors.password && (
                        <div className="flex items-start gap-2 text-red-600 text-xs bg-red-50 p-3 rounded-xl border border-red-200">
                          <FaExclamationTriangle className="text-sm mt-0.5 flex-shrink-0" />
                          <span>{errors.password}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FaKey className="text-indigo-500" />
                    <span>تکرار رمز عبور</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      placeholder="تکرار رمز عبور جدید"
                      disabled={!formData.password}
                      className={`w-full px-5 py-3.5 pl-12 rounded-xl border-2 transition-all duration-300 text-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                        errors.confirmPassword
                          ? "border-red-300 bg-red-50/50 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                          : formData.confirmPassword &&
                            formData.password === formData.confirmPassword
                          ? "border-green-300 bg-green-50/50 focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                          : "border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      }`}
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={!formData.password}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed p-1"
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="text-lg" />
                      ) : (
                        <FaEye className="text-lg" />
                      )}
                    </button>
                    {formData.confirmPassword && (
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        {formData.password === formData.confirmPassword ? (
                          <FaCheckCircle className="text-green-500 text-lg" />
                        ) : (
                          <FaTimesCircle className="text-red-500 text-lg" />
                        )}
                      </div>
                    )}
                  </div>

                  {errors.confirmPassword && (
                    <div className="flex items-start gap-2 text-red-600 text-xs bg-red-50 p-3 rounded-xl border border-red-200">
                      <FaExclamationTriangle className="text-sm mt-0.5 flex-shrink-0" />
                      <span>{errors.confirmPassword}</span>
                    </div>
                  )}

                  {formData.confirmPassword &&
                    formData.password === formData.confirmPassword && (
                      <div className="flex items-start gap-2 text-green-600 text-xs bg-green-50 p-3 rounded-xl border border-green-200">
                        <FaCheckCircle className="text-sm mt-0.5 flex-shrink-0" />
                        <span>رمز عبور با موفقیت تطابق دارد</span>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Security Tips */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 sm:p-5 border-2 border-amber-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaShieldAlt className="text-amber-600 text-sm" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-amber-900">
                    نکات امنیتی مهم
                  </h4>
                  <ul className="space-y-1.5 text-xs text-amber-800">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>از رمز عبور قوی و منحصر به فرد استفاده کنید</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>رمز عبور خود را در اختیار دیگران قرار ندهید</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>به صورت دوره‌ای رمز عبور خود را تغییر دهید</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Sticky Footer */}
          <div className="sticky bottom-0 bg-gradient-to-r from-gray-50 via-white to-blue-50/30 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-t-2 border-gray-100 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                <FaInfoCircle className="text-blue-500" />
                <span>تمامی تغییرات پس از ذخیره اعمال می‌شود</span>
              </div>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className={`w-full sm:w-auto order-1 sm:order-2 flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 shadow-lg ${
                  isLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : isSaved
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/30 shadow-xl"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-xl hover:scale-105 active:scale-95 shadow-blue-500/30"
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
                    <span>ذخیره تنظیمات امنیتی</span>
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
        maxFileSize={5 * 1024 * 1024}
        title="آپلود تصویر پروفایل"
      />
    </div>
  );
};

export default Security;
