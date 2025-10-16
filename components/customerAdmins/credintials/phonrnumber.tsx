"use client";
import { useState } from "react";
import {
  FaPhone,
  FaMobile,
  FaEnvelope,
  FaMapMarkerAlt,
  FaEnvelopeOpen,
  FaCheck,
  FaExclamationTriangle,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
   FaSpinner,
} from "react-icons/fa";
import { estedadBold } from "@/next-persian-fonts/estedad/index";
import { showToast } from "@/utilities/toast";

interface ContactInfoData {
  homePhone: string;
  mobilePhone: string;
  email: string;
  address: string;
  postalCode: string;
  status?: "accepted" | "rejected" | "pending_verification";
  rejectionNotes?: string;
}

interface ContactInfoProps {
  initialData?: ContactInfoData;
  onSave?: (data: ContactInfoData) => void;
  onValidationChange?: (isValid: boolean) => void;
}

const ContactInfo = ({
  initialData,
  onSave,
  onValidationChange,
}: ContactInfoProps) => {
  const [formData, setFormData] = useState<ContactInfoData>({
    homePhone: initialData?.homePhone || "",
    mobilePhone: initialData?.mobilePhone || "",
    email: initialData?.email || "",
    address: initialData?.address || "",
    postalCode: initialData?.postalCode || "",
    status: initialData?.status || "pending_verification",
    rejectionNotes: initialData?.rejectionNotes || "",
  });

  const [errors, setErrors] = useState<Partial<ContactInfoData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Validation functions
  const validateMobilePhone = (phone: string): boolean => {
    const regex = /^09\d{9}$/;
    return regex.test(phone);
  };

  const validateHomePhone = (phone: string): boolean => {
    if (!phone.trim()) return true; // Optional field
    const regex = /^0\d{2,3}-?\d{7,8}$/;
    return regex.test(phone);
  };

  const validateEmail = (email: string): boolean => {
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  };

  const validatePostalCode = (postalCode: string): boolean => {
    if (!postalCode.trim()) return true; // Optional field
    const regex = /^\d{10}$/;
    return regex.test(postalCode);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactInfoData> = {};

    // Mobile phone validation (required)
    if (!formData.mobilePhone.trim()) {
      newErrors.mobilePhone = "شماره موبایل الزامی است";
    } else if (!validateMobilePhone(formData.mobilePhone)) {
      newErrors.mobilePhone = "شماره موبایل باید با 09 شروع شده و 11 رقم باشد";
    }

    // Email validation (required)
    if (!formData.email.trim()) {
      newErrors.email = "ایمیل الزامی است";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "فرمت ایمیل صحیح نیست";
    }

    // Home phone validation (optional)
    if (formData.homePhone.trim() && !validateHomePhone(formData.homePhone)) {
      newErrors.homePhone = "فرمت تلفن ثابت صحیح نیست";
    }

    // Postal code validation (optional)
    if (
      formData.postalCode.trim() &&
      !validatePostalCode(formData.postalCode)
    ) {
      newErrors.postalCode = "کد پستی باید 10 رقم باشد";
    }

    // Address validation (optional but recommended)
    if (formData.address.trim() && formData.address.trim().length < 10) {
      newErrors.address = "آدرس باید حداقل 10 کاراکتر باشد";
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    onValidationChange?.(isValid);
    return isValid;
  };

  const handleInputChange = (field: keyof ContactInfoData, value: string) => {
    let processedValue = value;

    // Format mobile phone
    if (field === "mobilePhone") {
      processedValue = value.replace(/\D/g, "").slice(0, 11);
    }

    // Format home phone
    if (field === "homePhone") {
      processedValue = value.replace(/[^\d-]/g, "").slice(0, 12);
    }

    // Format postal code
    if (field === "postalCode") {
      processedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    // Format email (lowercase)
    if (field === "email") {
      processedValue = value.toLowerCase().trim();
    }

    setFormData((prev) => ({ ...prev, [field]: processedValue }));
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

      // Clean and format data before sending
      const requestData = {
        homePhone: formData.homePhone.trim(),
        mobilePhone: formData.mobilePhone.trim(),
        email: formData.email.toLowerCase().trim(),
        address: formData.address.trim(),
        postalCode: formData.postalCode.trim(),
      };

      console.log("Sending contact data:", requestData);

      const response = await fetch("/api/users/contact", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Contact API Error Response:", errorData);
        throw new Error(
          errorData.error || `خطا در ذخیره اطلاعات تماس (${response.status})`
        );
      }

      const result = await response.json();
      console.log(result);
      onSave?.(formData);
      setIsSaved(true);
      showToast.success("اطلاعات تماس با موفقیت ذخیره شد");
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Error saving contact info:", error);
      showToast.error(
        error instanceof Error ? error.message : "خطا در ذخیره اطلاعات تماس"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-3 sm:p-4 lg:p-6"
      dir="rtl"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl sm:rounded-3xl flex items-center justify-center border-2 border-blue-300 shadow-md">
              <FaPhone className="text-blue-700 text-lg sm:text-xl lg:text-2xl" />
            </div>
            <div className="flex-1">
              <h2
                className={`text-xl   lg:text-2xl font-bold text-[#0A1D37] mb-1 ${estedadBold.className}`}
              >
                اطلاعات تماس
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                شماره تماس، ایمیل و آدرس خود را وارد کنید
              </p>
            </div>
          </div>
        </div>

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
                      "در انتظار بررسی"}
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
                  "اطلاعات تماس شما توسط ادمین تایید شده است."}
                {formData.status === "pending_verification" &&
                  "اطلاعات تماس شما در انتظار بررسی توسط ادمین است."}
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
        <div className="mb-6 sm:mb-8 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-blue-200 shadow-sm">
          <div className="flex items-start gap-3 sm:gap-4 mb-4">
            
            <div>
              <h3 className="text-base sm:text-lg font-bold text-blue-900 mb-2">
                راهنمای تکمیل فرم 
              </h3>
            </div>
          </div>
          <ul className="text-xs sm:text-sm text-blue-800 space-y-2  mr-4">
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-blue-600 text-sm flex-shrink-0 mt-0.5" />
              <span>شماره موبایل باید با 09 شروع شده و 11 رقم باشد</span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-blue-600 text-sm flex-shrink-0 mt-0.5" />
              <span>
                ایمیل برای تأیید حساب و دریافت اطلاعیه‌ها استفاده می‌شود
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-blue-600 text-sm flex-shrink-0 mt-0.5" />
              <span>تلفن ثابت و آدرس اختیاری هستند اما توصیه می‌شوند</span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="text-blue-600 text-sm flex-shrink-0 mt-0.5" />
              <span>کد پستی باید 10 رقم و معتبر باشد</span>
            </li>
          </ul>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border-2 border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b-2 border-gray-100">
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#0A1D37] flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <FaMobile className="text-blue-600 text-sm sm:text-base" />
              </div>
              <span>اطلاعات تماس و آدرس</span>
            </h3>
          </div>

          <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            {/* Phone Numbers Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Mobile Phone */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#0A1D37]">
                  <FaMobile className="text-blue-600 text-sm sm:text-base" />
                  <span>شماره موبایل</span>
                  <span className="text-red-500 text-lg">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.mobilePhone}
                    onChange={(e) =>
                      handleInputChange("mobilePhone", e.target.value)
                    }
                    placeholder="09123456789"
                    maxLength={11}
                    className={`w-full text-left px-4 sm:px-5 py-3 sm:py-4 pl-12 sm:pl-14 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 font-mono text-sm sm:text-base ${
                      errors.mobilePhone
                        ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500/30"
                        : validateMobilePhone(formData.mobilePhone)
                        ? "border-green-300 bg-green-50 focus:ring-2 focus:ring-green-500/30"
                        : "border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    }`}
                    dir="ltr"
                  />
                  <div className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2">
                    {errors.mobilePhone ? (
                      <FaTimesCircle className="text-red-500 text-base sm:text-lg" />
                    ) : validateMobilePhone(formData.mobilePhone) ? (
                      <FaCheckCircle className="text-green-500 text-base sm:text-lg" />
                    ) : (
                      <FaMobile className="text-gray-400 text-base sm:text-lg" />
                    )}
                  </div>
                </div>
                {errors.mobilePhone && (
                  <div className="flex items-center gap-2 text-red-600 text-xs sm:text-sm bg-red-50 p-3 rounded-xl border border-red-200">
                    <FaExclamationTriangle className="text-sm flex-shrink-0" />
                    <span>{errors.mobilePhone}</span>
                  </div>
                )}
              </div>

              {/* Home Phone */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#0A1D37]">
                  <FaPhone className="text-blue-600 text-sm sm:text-base" />
                  <span>تلفن ثابت</span>
                  <span className="text-gray-400 text-xs sm:text-sm font-normal">
                    (اختیاری)
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.homePhone}
                    onChange={(e) =>
                      handleInputChange("homePhone", e.target.value)
                    }
                    placeholder="021-12345678"
                    className={`w-full text-left px-4 sm:px-5 py-3 sm:py-4 pl-12 sm:pl-14 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 font-mono text-sm sm:text-base ${
                      errors.homePhone
                        ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500/30"
                        : formData.homePhone &&
                          validateHomePhone(formData.homePhone)
                        ? "border-green-300 bg-green-50 focus:ring-2 focus:ring-green-500/30"
                        : "border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    }`}
                    dir="ltr"
                  />
                  <div className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2">
                    {errors.homePhone ? (
                      <FaTimesCircle className="text-red-500 text-base sm:text-lg" />
                    ) : formData.homePhone &&
                      validateHomePhone(formData.homePhone) ? (
                      <FaCheckCircle className="text-green-500 text-base sm:text-lg" />
                    ) : (
                      <FaPhone className="text-gray-400 text-base sm:text-lg" />
                    )}
                  </div>
                </div>
                {errors.homePhone && (
                  <div className="flex items-center gap-2 text-red-600 text-xs sm:text-sm bg-red-50 p-3 rounded-xl border border-red-200">
                    <FaExclamationTriangle className="text-sm flex-shrink-0" />
                    <span>{errors.homePhone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#0A1D37]">
                <FaEnvelope className="text-blue-600 text-sm sm:text-base" />
                <span>آدرس ایمیل</span>
                <span className="text-red-500 text-lg">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="example@email.com"
                  className={`w-full text-left px-4 sm:px-5 py-3 sm:py-4 pl-12 sm:pl-14 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 font-mono text-sm sm:text-base ${
                    errors.email
                      ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500/30"
                      : validateEmail(formData.email)
                      ? "border-green-300 bg-green-50 focus:ring-2 focus:ring-green-500/30"
                      : "border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  }`}
                  dir="ltr"
                />
                <div className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2">
                  {errors.email ? (
                    <FaTimesCircle className="text-red-500 text-base sm:text-lg" />
                  ) : validateEmail(formData.email) ? (
                    <FaCheckCircle className="text-green-500 text-base sm:text-lg" />
                  ) : (
                    <FaEnvelope className="text-gray-400 text-base sm:text-lg" />
                  )}
                </div>
              </div>
              {errors.email && (
                <div className="flex items-center gap-2 text-red-600 text-xs sm:text-sm bg-red-50 p-3 rounded-xl border border-red-200">
                  <FaExclamationTriangle className="text-sm flex-shrink-0" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Address & Postal Code Section */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border-2 border-gray-100">
              <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <FaMapMarkerAlt className="text-blue-600 text-base sm:text-lg" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg lg:text-xl font-bold text-[#0A1D37]">
                    آدرس و کد پستی
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    اطلاعات محل سکونت (اختیاری)
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Address */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#0A1D37]">
                    <FaMapMarkerAlt className="text-blue-600 text-sm sm:text-base" />
                    <span>آدرس</span>
                    <span className="text-gray-400 text-xs sm:text-sm font-normal">
                      (اختیاری)
                    </span>
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="آدرس کامل محل سکونت خود را وارد کنید..."
                    rows={4}
                    className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 resize-none text-sm sm:text-base ${
                      errors.address
                        ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500/30"
                        : formData.address && formData.address.length >= 10
                        ? "border-green-300 bg-green-50 focus:ring-2 focus:ring-green-500/30"
                        : "border-gray-200 bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    }`}
                    dir="rtl"
                  />
                  {errors.address && (
                    <div className="flex items-center gap-2 text-red-600 text-xs sm:text-sm bg-red-50 p-3 rounded-xl border border-red-200">
                      <FaExclamationTriangle className="text-sm flex-shrink-0" />
                      <span>{errors.address}</span>
                    </div>
                  )}
                </div>

                {/* Postal Code */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#0A1D37]">
                    <FaEnvelopeOpen className="text-blue-600 text-sm sm:text-base" />
                    <span>کد پستی</span>
                    <span className="text-gray-400 text-xs sm:text-sm font-normal">
                      (اختیاری)
                    </span>
                  </label>
                  <div className="relative max-w-xs">
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) =>
                        handleInputChange("postalCode", e.target.value)
                      }
                      placeholder="1234567890"
                      maxLength={10}
                      className={`w-full text-left px-4 sm:px-5 py-3 sm:py-4 pl-12 sm:pl-14 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 font-mono text-sm sm:text-base ${
                        errors.postalCode
                          ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500/30"
                          : validatePostalCode(formData.postalCode) &&
                            formData.postalCode
                          ? "border-green-300 bg-green-50 focus:ring-2 focus:ring-green-500/30"
                          : "border-gray-200 bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                      }`}
                      dir="ltr"
                    />
                    <div className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2">
                      {errors.postalCode ? (
                        <FaTimesCircle className="text-red-500 text-base sm:text-lg" />
                      ) : validatePostalCode(formData.postalCode) &&
                        formData.postalCode ? (
                        <FaCheckCircle className="text-green-500 text-base sm:text-lg" />
                      ) : (
                        <FaEnvelopeOpen className="text-gray-400 text-base sm:text-lg" />
                      )}
                    </div>
                  </div>
                  {errors.postalCode && (
                    <div className="flex items-center gap-2 text-red-600 text-xs sm:text-sm bg-red-50 p-3 rounded-xl border border-red-200">
                      <FaExclamationTriangle className="text-sm flex-shrink-0" />
                      <span>{errors.postalCode}</span>
                    </div>
                  )}
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
                    : "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
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
                    <span>ذخیره اطلاعات</span>
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

export default ContactInfo;
