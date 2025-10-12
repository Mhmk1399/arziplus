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
  FaTimes,
  FaPaperPlane,
  FaClock,
} from "react-icons/fa";

interface ContactInfoData {
  homePhone: string;
  mobilePhone: string;
  email: string;
  address: string;
  postalCode: string;
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
  });

  const [errors, setErrors] = useState<Partial<ContactInfoData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Verification states
  const [emailVerificationModal, setEmailVerificationModal] = useState(false);
  const [phoneVerificationModal, setPhoneVerificationModal] = useState(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState("");
  const [phoneVerificationCode, setPhoneVerificationCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);

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
      const response = await fetch("/api/users/contact", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          homePhone: formData.homePhone,
          mobilePhone: formData.mobilePhone,
          email: formData.email,
          address: formData.address,
          postalCode: formData.postalCode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در ذخیره اطلاعات تماس");
      }

      const result = await response.json();
      onSave?.(formData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Error saving contact info:", error);
      alert(error instanceof Error ? error.message : "خطا در ذخیره اطلاعات تماس");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verification functions
  const handleSendEmailCode = async () => {
    if (!formData.email || !validateEmail(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "لطفاً ایمیل معتبر وارد کنید" }));
      return;
    }

    setSendingCode(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/users/email", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در ارسال کد تایید");
      }

      setEmailVerificationModal(true);
    } catch (error) {
      console.error("Error sending email code:", error);
      alert(error instanceof Error ? error.message : "خطا در ارسال کد تایید ایمیل");
    } finally {
      setSendingCode(false);
    }
  };

  const handleSendPhoneCode = async () => {
    if (!formData.mobilePhone || !validateMobilePhone(formData.mobilePhone)) {
      setErrors((prev) => ({
        ...prev,
        mobilePhone: "لطفاً شماره موبایل معتبر وارد کنید",
      }));
      return;
    }

    setSendingCode(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/users/phoneVerification", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formData.mobilePhone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در ارسال کد تایید");
      }

      setPhoneVerificationModal(true);
    } catch (error) {
      console.error("Error sending phone code:", error);
      alert(error instanceof Error ? error.message : "خطا در ارسال کد تایید پیامک");
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!emailVerificationCode || emailVerificationCode.length !== 6) {
      return;
    }

    setVerifyingCode(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/users/email", {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          code: emailVerificationCode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در تایید ایمیل");
      }

      setEmailVerified(true);
      setEmailVerificationModal(false);
      setEmailVerificationCode("");
    } catch (error) {
      console.error("Error verifying email:", error);
      alert(error instanceof Error ? error.message : "خطا در تایید ایمیل");
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (!phoneVerificationCode || phoneVerificationCode.length !== 5) {
      return;
    }

    setVerifyingCode(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/users/phoneVerification", {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formData.mobilePhone,
          code: phoneVerificationCode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در تایید شماره تلفن");
      }

      setPhoneVerified(true);
      setPhoneVerificationModal(false);
      setPhoneVerificationCode("");
    } catch (error) {
      console.error("Error verifying phone:", error);
      alert(error instanceof Error ? error.message : "خطا در تایید شماره تلفن");
    } finally {
      setVerifyingCode(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto ">
      {/* Enhanced Header - Card Style */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <FaPhone className="text-blue-500 text-xl" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold text-gray-900 `}>
              اطلاعات تماس
            </h2>
          </div>
        </div>
      </div>
      {/* Help Text */}
      <div className=" mb-4 p-6 bg-blue-50 rounded-xl border border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">راهنمای تکمیل:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• شماره موبایل باید با 09 شروع شده و 11 رقم باشد</li>
          <li>• ایمیل برای تأیید حساب و دریافت اطلاعیه‌ها استفاده می‌شود</li>
          <li>• تلفن ثابت و آدرس اختیاری هستند اما توصیه می‌شوند</li>
          <li>• کد پستی باید 10 رقم و معتبر باشد</li>
          <li>
            • پس از وارد کردن اطلاعات، حتماً ایمیل و موبایل خود را تأیید کنید
          </li>
        </ul>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="space-y-6">
          {/* Phone Numbers Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mobile Phone */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FaMobile className="text-blue-600" />
                شماره موبایل
                <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.mobilePhone}
                onChange={(e) =>
                  handleInputChange("mobilePhone", e.target.value)
                }
                placeholder="09123456789"
                maxLength={11}
                className={`w-full text-end px-4 py-3 rounded-xl border transition-all duration-200 font-mono ${
                  errors.mobilePhone
                    ? "border-red-300 bg-red-50 focus:ring-red-500"
                    : "border-gray-200 bg-gray-50 focus:ring-blue-500"
                } focus:ring-2 focus:border-transparent`}
                dir="ltr"
              />
              {errors.mobilePhone && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <FaExclamationTriangle className="text-xs" />
                  {errors.mobilePhone}
                </div>
              )}
            </div>

            {/* Home Phone */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FaPhone className="text-blue-600" />
                تلفن ثابت
                <span className="text-gray-400 text-xs">(اختیاری)</span>
              </label>
              <input
                type="tel"
                value={formData.homePhone}
                onChange={(e) => handleInputChange("homePhone", e.target.value)}
                placeholder="021-12345678"
                className={`w-full text-end px-4 py-3 rounded-xl border transition-all duration-200 font-mono ${
                  errors.homePhone
                    ? "border-red-300 bg-red-50 focus:ring-red-500"
                    : "border-gray-200 bg-gray-50 focus:ring-blue-500"
                } focus:ring-2 focus:border-transparent`}
                dir="ltr"
              />
              {errors.homePhone && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <FaExclamationTriangle className="text-xs" />
                  {errors.homePhone}
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaEnvelope className="text-blue-600" />
              آدرس ایمیل
              <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="example@email.com"
              className={`w-full px-4 text-end py-3 rounded-xl border transition-all duration-200 font-mono ${
                errors.email
                  ? "border-red-300 bg-red-50 focus:ring-red-500"
                  : "border-gray-200 bg-gray-50 focus:ring-blue-500"
              } focus:ring-2 focus:border-transparent`}
              dir="ltr"
            />
            {errors.email && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <FaExclamationTriangle className="text-xs" />
                {errors.email}
              </div>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaMapMarkerAlt className="text-blue-600" />
              آدرس
              <span className="text-gray-400 text-xs">(اختیاری)</span>
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="آدرس کامل محل سکونت خود را وارد کنید..."
              rows={3}
              className={`w-full px-4  py-3 rounded-xl border transition-all duration-200 resize-none ${
                errors.address
                  ? "border-red-300 bg-red-50 focus:ring-red-500"
                  : "border-gray-200 bg-gray-50 focus:ring-blue-500"
              } focus:ring-2 focus:border-transparent`}
              dir="rtl"
            />
            {errors.address && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <FaExclamationTriangle className="text-xs" />
                {errors.address}
              </div>
            )}
          </div>

          {/* Postal Code */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaEnvelopeOpen className="text-blue-600" />
              کد پستی
              <span className="text-gray-400 text-xs">(اختیاری)</span>
            </label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) => handleInputChange("postalCode", e.target.value)}
              placeholder="1234567890"
              maxLength={10}
              className={`w-full text-end max-w-xs px-4 py-3 rounded-xl border transition-all duration-200 font-mono ${
                errors.postalCode
                  ? "border-red-300 bg-red-50 focus:ring-red-500"
                  : "border-gray-200 bg-gray-50 focus:ring-blue-500"
              } focus:ring-2 focus:border-transparent`}
              dir="ltr"
            />
            {errors.postalCode && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <FaExclamationTriangle className="text-xs" />
                {errors.postalCode}
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email Verification */}
          <div
            className={`p-4 border rounded-xl transition-all duration-200 ${
              emailVerified
                ? "bg-green-50 border-green-200"
                : " border[0A1D37]"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`p-2 rounded-lg ${
                  emailVerified ? "bg-green-200" : " bg-blue-500"
                }`}
              >
                <FaEnvelope
                  className={`text-sm ${
                    emailVerified ? "text-green-700" : "text-[#fff]"
                  }`}
                />
              </div>
              <div className="flex-1">
                <h4
                  className={`font-medium ${
                    emailVerified ? "text-green-900" : "text-[#0A1D37]"
                  }`}
                >
                  تأیید ایمیل
                </h4>
                <p
                  className={`text-sm ${
                    emailVerified ? "text-green-700" : "text-[#0A1D37]"
                  }`}
                >
                  {emailVerified
                    ? "ایمیل شما تأیید شده است"
                    : "ایمیل شما هنوز تأیید نشده است"}
                </p>
              </div>
              <div
                className={`text-lg ${
                  emailVerified ? "text-green-600" : "text-blue-500"
                }`}
              >
                {emailVerified ? <FaCheck /> : <FaClock />}
              </div>
            </div>

            {!emailVerified && (
              <button
                onClick={handleSendEmailCode}
                disabled={sendingCode || !formData.email}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  sendingCode
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : " bg-blue-500  text-[#fff]"
                }`}
              >
                {sendingCode ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    در حال ارسال...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    ارسال کد تأیید
                  </>
                )}
              </button>
            )}
          </div>

          {/* Phone Verification */}
          <div
            className={`p-4 border rounded-xl transition-all duration-200 ${
              phoneVerified
                ? "bg-green-50 border-green-200"
                : "border-[#0A1D37]"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`p-2 rounded-lg ${
                  phoneVerified ? "bg-green-200" : " bg-blue-500 "
                }`}
              >
                <FaMobile
                  className={`text-sm ${
                    phoneVerified ? "text-green-700" : "text-[#fff]"
                  }`}
                />
              </div>
              <div className="flex-1">
                <h4
                  className={`font-medium ${
                    phoneVerified ? "text-green-900" : "text-[#0A1D37]"
                  }`}
                >
                  تأیید شماره موبایل
                </h4>
                <p
                  className={`text-sm ${
                    phoneVerified ? "text-green-700" : "text-[#0A1D37]"
                  }`}
                >
                  {phoneVerified
                    ? "شماره موبایل شما تأیید شده است"
                    : "شماره موبایل شما هنوز تأیید نشده است"}
                </p>
              </div>
              <div
                className={`text-lg ${
                  phoneVerified ? "text-green-600" : "text-blue-500"
                }`}
              >
                {phoneVerified ? <FaCheck /> : <FaClock />}
              </div>
            </div>

            {!phoneVerified && (
              <button
                onClick={handleSendPhoneCode}
                disabled={sendingCode || !formData.mobilePhone}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  sendingCode
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : " bg-blue-500  text-[#fff]"
                }`}
              >
                {sendingCode ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    در حال ارسال...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    ارسال کد تأیید
                  </>
                )}
              </button>
            )}
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
                : "bg-blue-700 hover:bg-blue-800 text-white shadow-lg hover:shadow-xl"
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
              "ذخیره اطلاعات"
            )}
          </button>
        </div>
      </div>

      {/* Enhanced Verification Status */}
      {/* Email Verification Modal */}
      {emailVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">تأیید ایمیل</h3>
              <button
                onClick={() => setEmailVerificationModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                کد 6 رقمی ارسال شده به ایمیل{" "}
                <span className="font-mono text-blue-600">
                  {formData.email}
                </span>{" "}
                را وارد کنید:
              </p>

              <input
                type="text"
                value={emailVerificationCode}
                onChange={(e) =>
                  setEmailVerificationCode(
                    e.target.value.replace(/\D/g, "").slice(0, 6)
                  )
                }
                placeholder="123456"
                maxLength={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-center text-lg"
                dir="ltr"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEmailVerificationModal(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={handleVerifyEmail}
                disabled={verifyingCode || emailVerificationCode.length !== 6}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  verifyingCode || emailVerificationCode.length !== 6
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {verifyingCode ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    در حال تأیید...
                  </div>
                ) : (
                  "تأیید کد"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Phone Verification Modal */}
      {phoneVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                تأیید شماره موبایل
              </h3>
              <button
                onClick={() => setPhoneVerificationModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                کد 5 رقمی ارسال شده به شماره{" "}
                <span className="font-mono text-blue-600">
                  {formData.mobilePhone}
                </span>{" "}
                را وارد کنید:
              </p>

              <input
                type="text"
                value={phoneVerificationCode}
                onChange={(e) =>
                  setPhoneVerificationCode(
                    e.target.value.replace(/\D/g, "").slice(0, 5)
                  )
                }
                placeholder="12345"
                maxLength={5}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-center text-lg"
                dir="ltr"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPhoneVerificationModal(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={handleVerifyPhone}
                disabled={verifyingCode || phoneVerificationCode.length !== 5}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  verifyingCode || phoneVerificationCode.length !== 5
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {verifyingCode ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    در حال تأیید...
                  </div>
                ) : (
                  "تأیید کد"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactInfo;
