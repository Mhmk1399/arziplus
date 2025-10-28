"use client";
import { useState, useEffect } from "react";
import {
  FaIdCard,
  FaUser,
  FaFileImage,
  FaUpload,
  FaCheck,
  FaExclamationTriangle,
  FaEye,
  FaTimes,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaSpinner,
  FaImage,
  FaQuestion,
} from "react-icons/fa";
import Image from "next/image";
import { showToast } from "@/utilities/toast";
import FileUploaderModal from "@/components/FileUploaderModal";

interface NationalCredentialsData {
  firstName?: string;
  lastName?: string;
  nationalNumber?: string;
  nationalCardImageUrl?: string;
  verificationImageUrl?: string;
  status?: "accepted" | "rejected" | "pending_verification";
  rejectionNotes?: string;
}

interface NationalCredentialsProps {
  initialData?: NationalCredentialsData;
  onSave?: (data: NationalCredentialsData) => void;
  onValidationChange?: (isValid: boolean) => void;
}

const NationalCredentials = ({
  initialData,
  onSave,
  onValidationChange,
}: NationalCredentialsProps) => {
  const [formData, setFormData] = useState<NationalCredentialsData>({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    nationalNumber: initialData?.nationalNumber || "",
    nationalCardImageUrl: initialData?.nationalCardImageUrl || "",
    verificationImageUrl: initialData?.verificationImageUrl || "",
    status: initialData?.status || "pending_verification",
    rejectionNotes: initialData?.rejectionNotes || "",
  });

  const [errors, setErrors] = useState<Partial<NationalCredentialsData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Identity validation portal state
  const [showValidationPortal, setShowValidationPortal] = useState(false);

  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentUploadField, setCurrentUploadField] = useState<
    "nationalCardImageUrl" | "verificationImageUrl" | null
  >(null);

  // Show validation portal on mount if user hasn't validated their national ID
  useEffect(() => {
    const hasValidatedNationalId =
      formData.status === "accepted" ||
      (formData.nationalCardImageUrl && formData.verificationImageUrl);

    if (!hasValidatedNationalId) {
      setShowValidationPortal(true);
    }
  }, [
    formData.status,
    formData.nationalCardImageUrl,
    formData.verificationImageUrl,
  ]);

  // Validation functions
  const validateNationalNumber = (nationalNumber?: string): boolean => {
    if (!nationalNumber) return false;
    const regex = /^\d{10}$/;
    if (!regex.test(nationalNumber)) return false;

    // Checksum validation for Iranian national code
    const digits = nationalNumber.split("").map(Number);
    const checksum =
      digits.reduce((sum, digit, index) => {
        if (index < 9) return sum + digit * (10 - index);
        return sum;
      }, 0) % 11;

    const lastDigit = digits[9];
    return checksum < 2 ? lastDigit === checksum : lastDigit === 11 - checksum;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<NationalCredentialsData> = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = "نام الزامی است";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "نام باید حداقل 2 کاراکتر باشد";
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = "نام خانوادگی الزامی است";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "نام خانوادگی باید حداقل 2 کاراکتر باشد";
    }

    if (!formData.nationalNumber?.trim()) {
      newErrors.nationalNumber = "کد ملی الزامی است";
    } else if (!validateNationalNumber(formData.nationalNumber)) {
      newErrors.nationalNumber = "کد ملی معتبر نیست";
    }

    if (!formData.nationalCardImageUrl) {
      newErrors.nationalCardImageUrl = "تصویر کارت ملی الزامی است";
    }

    if (!formData.verificationImageUrl) {
      newErrors.verificationImageUrl = "تصویر احراز هویت الزامی است";
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    onValidationChange?.(isValid);
    return isValid;
  };

  const handleInputChange = (
    field: keyof NationalCredentialsData,
    value: string
  ) => {
    let processedValue = value;

    // Only allow digits for national number
    if (field === "nationalNumber") {
      processedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    // Clean names (only Persian and English letters)
    if (field === "firstName" || field === "lastName") {
      processedValue = value.replace(/[^a-zA-Zآ-ی\s]/g, "");
    }

    setFormData((prev) => ({ ...prev, [field]: processedValue }));
    setIsSaved(false);

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleUploadClick = (
    field: "nationalCardImageUrl" | "verificationImageUrl"
  ) => {
    setCurrentUploadField(field);
    setShowUploadModal(true);
  };

  const handleFileUploaded = (fileUrl: string) => {
    if (currentUploadField) {
      setFormData((prev) => ({ ...prev, [currentUploadField]: fileUrl }));

      // Clear error for this field
      if (errors[currentUploadField]) {
        setErrors((prev) => ({ ...prev, [currentUploadField]: undefined }));
      }
    }
    setShowUploadModal(false);
    setCurrentUploadField(null);
  };

  const handleModalClose = () => {
    setShowUploadModal(false);
    setCurrentUploadField(null);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/users/nationalverifications", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          nationalNumber: formData.nationalNumber,
          nationalCardImageUrl: formData.nationalCardImageUrl,
          verificationImageUrl: formData.verificationImageUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در ذخیره اطلاعات هویتی");
      }

      const result = await response.json();
      console.log(result);
      onSave?.(formData);
      setIsSaved(true);
      showToast.success("اطلاعات هویتی با موفقیت ذخیره شد");
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.log("Error saving national credentials:", error);
      showToast.error(
        error instanceof Error ? error.message : "خطا در ذخیره اطلاعات هویتی"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const FileUploadBox = ({
    field,
    label,
    icon,
    description,
  }: {
    field: "nationalCardImageUrl" | "verificationImageUrl";
    label: string;
    icon: React.ReactNode;
    description: string;
  }) => (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#0A1D37]">
        {icon}
        <span>{label}</span>
        <span className="text-red-500 text-lg">*</span>
      </label>

      {formData[field] ? (
        <div className="relative">
          <div className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <FaCheckCircle className="text-white text-base sm:text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-bold text-green-800">
                    فایل آپلود شد ✓
                  </p>
                  <p className="text-xs sm:text-sm text-green-600">
                    برای مشاهده کلیک کنید
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewImage(formData[field] ?? null)}
                  className="p-2.5 sm:p-3 text-green-700 hover:bg-green-200 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
                  title="پیش‌نمایش"
                >
                  <FaEye className="text-base sm:text-lg" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, [field]: "" }))
                  }
                  className="p-2.5 sm:p-3 text-red-600 hover:bg-red-100 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
                  title="حذف"
                >
                  <FaTimes className="text-base sm:text-lg" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => handleUploadClick(field)}
          className={`border-2 border-dashed rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 text-center cursor-pointer transition-all duration-300 group ${
            errors[field]
              ? "border-red-300 bg-red-50 hover:border-red-400 hover:bg-red-100"
              : "border-gray-300 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50 hover:scale-[1.02]"
          }`}
        >
          <div className="space-y-3 sm:space-y-4">
            <div
              className={`p-3 sm:p-4 rounded-full w-fit mx-auto transition-all duration-300 ${
                errors[field]
                  ? "bg-red-200"
                  : "bg-emerald-100 group-hover:bg-emerald-200 group-hover:scale-110"
              }`}
            >
              <FaUpload
                className={`text-xl sm:text-2xl lg:text-3xl ${
                  errors[field] ? "text-red-600" : "text-emerald-600"
                }`}
              />
            </div>
            <div>
              <p className="font-bold text-[#0A1D37] text-sm sm:text-base mb-1">
                {description}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                فرمت‌های مجاز: JPG, PNG, GIF, WebP
                <br />
                <span className="text-xs">(حداکثر 10MB)</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {errors[field] && (
        <div className="flex items-center gap-2 text-red-600 text-xs sm:text-sm bg-red-50 p-3 rounded-xl border border-red-200">
          <FaExclamationTriangle className="text-sm flex-shrink-0" />
          <span>{errors[field]}</span>
        </div>
      )}
    </div>
  );

  return (
    <div
      className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 p-3 sm:p-4 lg:p-6"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        {/* Status Display */}
        {formData.status && (
          <div
            className={`mb-6 sm:mb-8 rounded-2xl sm:rounded-3xl border-2 shadow-lg overflow-hidden ${
              formData.status === "accepted"
                ? "border-green-300 bg-gradient-to-br from-green-50 to-green-100/50"
                : formData.status === "rejected"
                ? "border-red-300 bg-gradient-to-br from-red-50 to-red-100/50"
                : "border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100/50"
            }`}
          >
            <div className="p-5 sm:p-6 lg:p-8">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
                    formData.status === "accepted"
                      ? "bg-green-500"
                      : formData.status === "rejected"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  } shadow-md`}
                >
                  {formData.status === "accepted" && (
                    <FaCheckCircle className="text-white text-lg sm:text-xl" />
                  )}
                  {formData.status === "rejected" && (
                    <FaTimesCircle className="text-white text-lg sm:text-xl" />
                  )}
                  {formData.status === "pending_verification" && (
                    <FaClock className="text-white text-lg sm:text-xl" />
                  )}
                </div>
                <div>
                  <h3
                    className={`text-base sm:text-lg lg:text-xl font-bold ${
                      formData.status === "accepted"
                        ? "text-green-900"
                        : formData.status === "rejected"
                        ? "text-red-900"
                        : "text-yellow-900"
                    }`}
                  >
                    {formData.status === "accepted" && "تایید شده ✓"}
                    {formData.status === "rejected" && "رد شده ✗"}
                    {formData.status === "pending_verification" &&
                      "در انتظار بررسی "}
                  </h3>
                </div>
              </div>

              <p
                className={`text-sm sm:text-base leading-relaxed ${
                  formData.status === "accepted"
                    ? "text-green-800"
                    : formData.status === "rejected"
                    ? "text-red-800"
                    : "text-yellow-800"
                }`}
              >
                {formData.status === "accepted" &&
                  "مدارک هویتی شما توسط ادمین تایید شده است."}
                {formData.status === "pending_verification" &&
                  "مدارک هویتی شما در انتظار بررسی توسط ادمین است."}
              </p>

              {formData.status === "rejected" && formData.rejectionNotes && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaExclamationTriangle className="text-red-600" />
                    <p className="text-sm sm:text-base font-bold text-red-900">
                      دلیل رد:
                    </p>
                  </div>
                  <div className="bg-red-100 border border-red-300 p-3 sm:p-4 rounded-xl">
                    <p className="text-sm sm:text-base text-red-800 leading-relaxed">
                      {formData.rejectionNotes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Help Text */}
        <div className="mt-6 sm:mt-8 bg-gradient-to-br mb-4 from-emerald-50 to-emerald-100/50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-emerald-200 shadow-sm">
          <div className="flex items-start gap-3 sm:gap-4 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <FaInfoCircle className="text-white text-base sm:text-lg" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-emerald-900 mb-2">
                راهنمای تکمیل فرم
              </h3>
            </div>
          </div>
          <ul className="text-xs sm:text-sm text-emerald-800 space-y-2 mr-14 sm:mr-16">
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-emerald-600 text-sm flex-shrink-0 mt-0.5" />
              <span>نام و نام خانوادگی باید مطابق کارت ملی باشد</span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-emerald-600 text-sm flex-shrink-0 mt-0.5" />
              <span>کد ملی باید معتبر و 10 رقمی باشد</span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-emerald-600 text-sm flex-shrink-0 mt-0.5" />
              <span>تصویر کارت ملی باید واضح و خوانا باشد</span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-emerald-600 text-sm flex-shrink-0 mt-0.5" />
              <span>
                برای تصویر احراز هویت، سلفی با کارت ملی در کنار صورت بگیرید
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-emerald-600 text-sm flex-shrink-0 mt-0.5" />
              <span>حجم فایل‌ها نباید بیش از 10 مگابایت باشد</span>
            </li>
          </ul>

          {/* Identity Validation Guidelines Button */}
          <div className="mt-4 mr-14 sm:mr-16">
            <button
              onClick={() => setShowValidationPortal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              <FaQuestion className="text-white" />
              <span>شرایط بارگذاری عکس هویتی</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border-2 border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b-2 border-gray-100">
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#0A1D37] flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <FaUser className="text-emerald-600 text-sm sm:text-base" />
              </div>
              <span>اطلاعات شخصی</span>
            </h3>
          </div>

          <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            {/* Personal Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* First Name */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#0A1D37]">
                  <FaUser className="text-emerald-600 text-sm sm:text-base" />
                  <span>نام</span>
                  <span className="text-red-500 text-lg">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    placeholder="نام خود را وارد کنید"
                    className={`w-full px-4 sm:px-5 py-3 sm:py-4 pr-12 sm:pr-14 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 text-sm sm:text-base ${
                      errors.firstName
                        ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500/30"
                        : (formData.firstName?.length ?? 0) >= 2
                        ? "border-green-300 bg-green-50 focus:ring-2 focus:ring-green-500/30"
                        : "border-gray-200 bg-gray-50 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                    }`}
                    dir="rtl"
                  />
                  <div className="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2">
                    {errors.firstName ? (
                      <FaTimesCircle className="text-red-500 text-base sm:text-lg" />
                    ) : (formData.firstName?.length ?? 0) >= 2 ? (
                      <FaCheckCircle className="text-green-500 text-base sm:text-lg" />
                    ) : (
                      <FaUser className="text-gray-400 text-base sm:text-lg" />
                    )}
                  </div>
                </div>
                {errors.firstName && (
                  <div className="flex items-center gap-2 text-red-600 text-xs sm:text-sm bg-red-50 p-3 rounded-xl border border-red-200">
                    <FaExclamationTriangle className="text-sm flex-shrink-0" />
                    <span>{errors.firstName}</span>
                  </div>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#0A1D37]">
                  <FaUser className="text-emerald-600 text-sm sm:text-base" />
                  <span>نام خانوادگی</span>
                  <span className="text-red-500 text-lg">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    placeholder="نام خانوادگی خود را وارد کنید"
                    className={`w-full px-4 sm:px-5 py-3 sm:py-4 pr-12 sm:pr-14 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 text-sm sm:text-base ${
                      errors.lastName
                        ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500/30"
                        : (formData.lastName?.length ?? 0) >= 2
                        ? "border-green-300 bg-green-50 focus:ring-2 focus:ring-green-500/30"
                        : "border-gray-200 bg-gray-50 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                    }`}
                    dir="rtl"
                  />
                  <div className="absolute right-4 sm:right-5 top-1/2 transform -translate-y-1/2">
                    {errors.lastName ? (
                      <FaTimesCircle className="text-red-500 text-base sm:text-lg" />
                    ) : (formData.lastName?.length ?? 0) >= 2 ? (
                      <FaCheckCircle className="text-green-500 text-base sm:text-lg" />
                    ) : (
                      <FaUser className="text-gray-400 text-base sm:text-lg" />
                    )}
                  </div>
                </div>
                {errors.lastName && (
                  <div className="flex items-center gap-2 text-red-600 text-xs sm:text-sm bg-red-50 p-3 rounded-xl border border-red-200">
                    <FaExclamationTriangle className="text-sm flex-shrink-0" />
                    <span>{errors.lastName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* National Number */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#0A1D37]">
                <FaIdCard className="text-emerald-600 text-sm sm:text-base" />
                <span>کد ملی</span>
                <span className="text-red-500 text-lg">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.nationalNumber}
                  onChange={(e) =>
                    handleInputChange("nationalNumber", e.target.value)
                  }
                  placeholder="کد ملی 10 رقمی"
                  maxLength={10}
                  className={`w-full text-left px-4 sm:px-5 py-3 sm:py-4 pl-12 sm:pl-14 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 font-mono text-sm sm:text-base ${
                    errors.nationalNumber
                      ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500/30"
                      : validateNationalNumber(formData.nationalNumber)
                      ? "border-green-300 bg-green-50 focus:ring-2 focus:ring-green-500/30"
                      : "border-gray-200 bg-gray-50 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  }`}
                  dir="ltr"
                />
                <div className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2">
                  {errors.nationalNumber ? (
                    <FaTimesCircle className="text-red-500 text-base sm:text-lg" />
                  ) : validateNationalNumber(formData.nationalNumber) ? (
                    <FaCheckCircle className="text-green-500 text-base sm:text-lg" />
                  ) : (
                    <FaIdCard className="text-gray-400 text-base sm:text-lg" />
                  )}
                </div>
              </div>
              {errors.nationalNumber ? (
                <div className="flex items-center gap-2 text-red-600 text-xs sm:text-sm bg-red-50 p-3 rounded-xl border border-red-200">
                  <FaExclamationTriangle className="text-sm flex-shrink-0" />
                  <span>{errors.nationalNumber}</span>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-gray-600 text-xs sm:text-sm bg-blue-50 p-3 rounded-xl border border-blue-200">
                  <FaInfoCircle className="text-emerald-600 text-sm flex-shrink-0 mt-0.5" />
                  <span>کد ملی باید 10 رقم و معتبر باشد</span>
                </div>
              )}
            </div>

            {/* Document Uploads Section */}
            <div className="bg-gradient-to-br from-gray-50 to-emerald-50/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border-2 border-gray-100">
              <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                  <FaImage className="text-emerald-600 text-base sm:text-lg" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg lg:text-xl font-bold text-[#0A1D37]">
                    بارگذاری مدارک
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    تصاویر کارت ملی و احراز هویت
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <FileUploadBox
                  field="nationalCardImageUrl"
                  label="تصویر کارت ملی"
                  icon={
                    <FaIdCard className="text-emerald-600 text-sm sm:text-base" />
                  }
                  description="تصویر واضح از کارت ملی"
                />

                <FileUploadBox
                  field="verificationImageUrl"
                  label="تصویر احراز هویت"
                  icon={
                    <FaFileImage className="text-emerald-600 text-sm sm:text-base" />
                  }
                  description="سلفی با کارت ملی"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gradient-to-r from-gray-50 to-emerald-50/30 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-t-2 border-gray-100">
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className={`flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 ${
                  isLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : isSaved
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
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
                    <FaCheck className="text-lg" />
                    <span>ذخیره مدارک</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Identity Validation Guidelines Portal */}
      {showValidationPortal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-amber-50 to-amber-100 p-4 sm:p-6 border-b-2 border-amber-200 flex justify-between items-center backdrop-blur-sm z-10">
              <h3 className="text-base sm:text-lg font-bold text-amber-900 flex items-center gap-2">
                <FaExclamationTriangle className="text-amber-600" />
                <span>⚠️ نکات مهم در ارسال مدارک هویتی</span>
              </h3>
              <button
                onClick={() => setShowValidationPortal(false)}
                className="p-2.5 sm:p-3 hover:bg-amber-200 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
              >
                <FaTimes className="text-amber-700 text-lg sm:text-xl" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-6" dir="rtl">
              {/* Main Warning */}
              <div className="bg-gradient-to-r from-red-50 to-red-100 border-r-4 border-red-400 p-4 rounded-lg">
                <p className="text-sm sm:text-base text-red-800 font-bold">
                  کارت ملی قدیمی مورد تأیید نمی‌باشد.
                </p>
                <p className="text-xs sm:text-sm text-red-700 mt-2">
                  در صورت نداشتن کارت ملی جدید، لطفاً دو مدرک هویتی معتبر از
                  میان گزینه‌های زیر انتخاب و ارسال نمایید:
                </p>
              </div>

              {/* Alternative Documents */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 sm:p-5">
                <h4 className="text-sm sm:text-base font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <FaIdCard className="text-blue-600" />
                  مدارک هویتی مورد قبول:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-800">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <span>کارت پایان خدمت</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-800">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <span>گواهینامه رانندگی</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-800">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <span>شناسنامه</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-800">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      4
                    </span>
                    <span>رسید کارت ملی جدید</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-800 sm:col-span-2">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      5
                    </span>
                    <span>پاسپورت معتبر</span>
                  </div>
                </div>
              </div>

              {/* Upload Instructions */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 sm:p-5">
                <h4 className="text-sm sm:text-base font-bold text-green-900 mb-3 flex items-center gap-2">
                  <FaUpload className="text-green-600" />
                  نحوه آپلود مدارک:
                </h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-xs sm:text-sm text-green-800">
                    <span className="text-green-600 mt-1">🔸</span>
                    <span>نیازی به ارسال پشت مدارک نیست.</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs sm:text-sm text-green-800">
                    <span className="text-green-600 mt-1">🔸</span>
                    <span>
                      لطفاً یک مدرک را در بخش روی کارت ملی و مدرک دوم را در بخش
                      پشت کارت ملی آپلود نمایید.
                    </span>
                  </div>
                </div>
              </div>

              {/* Photo Guidelines */}
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 sm:p-5">
                <h4 className="text-sm sm:text-base font-bold text-purple-900 mb-3 flex items-center gap-2">
                  <FaImage className="text-purple-600" />
                  📸 راهنمای ارسال تصویر مدارک:
                </h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-xs sm:text-sm text-purple-800">
                    <span className="text-purple-600 mt-1">✓</span>
                    <span>
                      لبه‌های مدارک باید کاملاً مشخص و درون کادر عکس قرار داشته
                      باشند.
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-xs sm:text-sm text-purple-800">
                    <span className="text-purple-600 mt-1">✓</span>
                    <span>از ارسال عکس اسکن‌شده یا تیره خودداری کنید.</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs sm:text-sm text-purple-800">
                    <span className="text-purple-600 mt-1">✓</span>
                    <span>تمامی اطلاعات مدارک باید واضح و خوانا باشند.</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs sm:text-sm text-purple-800">
                    <span className="text-purple-600 mt-1">✓</span>
                    <span>
                      لطفاً از پوشاندن هر بخش از اطلاعات هویتی خودداری نمایید.
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-xs sm:text-sm text-purple-800">
                    <span className="text-purple-600 mt-1">✓</span>
                    <span>
                      تصاویر را با کیفیت مناسب و نور کافی ارسال کنید تا بررسی
                      سریع‌تر انجام شود.
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowValidationPortal(false)}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-bold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                >
                  متوجه شدم
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl">
            <div className="sticky top-0 bg-white p-4 sm:p-6 border-b-2 border-gray-100 flex justify-between items-center backdrop-blur-sm z-10">
              <h3 className="text-base sm:text-lg font-bold text-[#0A1D37] flex items-center gap-2">
                <FaEye className="text-emerald-600" />
                <span>پیش‌نمایش تصویر</span>
              </h3>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-2.5 sm:p-3 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
              >
                <FaTimes className="text-gray-600 text-lg sm:text-xl" />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <Image
                src={previewImage}
                alt="پیش‌نمایش"
                width={1200}
                height={900}
                className="w-full h-auto rounded-xl sm:rounded-2xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* File Upload Modal */}
      <FileUploaderModal
        isOpen={showUploadModal}
        onClose={handleModalClose}
        onFileUploaded={handleFileUploaded}
        acceptedTypes={[".jpg", ".jpeg", ".png", ".gif", ".webp"]}
        maxFileSize={10 * 1024 * 1024} // 10MB
        title={
          currentUploadField === "nationalCardImageUrl"
            ? "آپلود تصویر کارت ملی"
            : "آپلود تصویر احراز هویت"
        }
      />
    </div>
  );
};

export default NationalCredentials;
