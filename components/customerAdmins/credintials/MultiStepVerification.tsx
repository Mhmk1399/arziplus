"use client";
import { useState } from "react";
import {
  FaIdCard,
  FaPhone,
  FaUser,
  FaCheckCircle,
  FaSpinner,
  FaExclamationTriangle,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import { showToast } from "@/utilities/toast";

interface MultiStepVerificationProps {
  initialPhone?: string;
  initialNationalNumber?: string;
  onComplete?: () => void;
}

const MultiStepVerification = ({
  initialPhone,
  initialNationalNumber,
  onComplete,
}: MultiStepVerificationProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: National Code & Phone
  const [nationalCode, setNationalCode] = useState(initialNationalNumber || "");
  const [phoneNumber, setPhoneNumber] = useState(initialPhone || "");
  const [shahkarVerified, setShahkarVerified] = useState(false);
  const [showShahkarModal, setShowShahkarModal] = useState(false);

  // Step 2: OTP Verification
  const [otpCode, setOtpCode] = useState("");
  const [userId, setUserId] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Step 3: Name Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Errors
  const [errors, setErrors] = useState<{
    nationalCode?: string;
    phoneNumber?: string;
    otpCode?: string;
    firstName?: string;
    lastName?: string;
  }>({});

  // Validate national code format and checksum
  const validateNationalCode = (code: string): boolean => {
    if (!/^\d{10}$/.test(code)) return false;

    const digits = code.split("").map(Number);
    const checksum =
      digits.reduce((sum, digit, index) => {
        if (index < 9) return sum + digit * (10 - index);
        return sum;
      }, 0) % 11;

    const lastDigit = digits[9];
    return checksum < 2 ? lastDigit === checksum : lastDigit === 11 - checksum;
  };

  // Step 1: Verify with Shahkar API
  const handleShahkarVerification = async () => {
    const newErrors: typeof errors = {};

    if (!nationalCode.trim()) {
      newErrors.nationalCode = "کد ملی الزامی است";
    } else if (!validateNationalCode(nationalCode)) {
      newErrors.nationalCode = "کد ملی معتبر نیست";
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "شماره موبایل الزامی است";
    } else if (!/^09\d{9}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "فرمت شماره موبایل صحیح نیست (09xxxxxxxxx)";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/verification/shahkar-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nationalCode,
          phoneNumber,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "خطا در تایید اطلاعات");
      }

      if (result.verified) {
        setShahkarVerified(true);
        setShowShahkarModal(true);
        showToast.success("✅ کد ملی و شماره موبایل با هم مطابقت دارند");

        // Auto close modal and proceed after 2 seconds
        setTimeout(() => {
          setShowShahkarModal(false);
          handleSendOTP();
        }, 2000);
      } else {
        showToast.error("❌ کد ملی و شماره موبایل با هم مطابقت ندارند");
      }
    } catch (error) {
      console.error("Shahkar verification error:", error);
      showToast.error(error instanceof Error ? error.message : "خطا در تایید اطلاعات");
    } finally {
      setIsLoading(false);
    }
  };

  // Send OTP after Shahkar verification
  const handleSendOTP = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phoneNumber,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "خطا در ارسال کد تایید");
      }

      setUserId(result.userId);
      setCurrentStep(2);
      setResendTimer(120); // 2 minutes
      showToast.success("کد تایید به شماره شما ارسال شد");

      // Start countdown timer
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Send OTP error:", error);
      showToast.error(error instanceof Error ? error.message : "خطا در ارسال کد تایید");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    const newErrors: typeof errors = {};

    if (!otpCode.trim()) {
      newErrors.otpCode = "کد تایید الزامی است";
    } else if (!/^\d{5}$/.test(otpCode)) {
      newErrors.otpCode = "کد تایید باید 5 رقم باشد";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phoneNumber,
          code: otpCode,
          userId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "کد تایید اشتباه است");
      }

      showToast.success("✅ شماره موبایل با موفقیت تایید شد");
      setCurrentStep(3);
    } catch (error) {
      console.error("OTP verification error:", error);
      showToast.error(error instanceof Error ? error.message : "کد تایید اشتباه است");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Complete profile with names
  const handleCompleteProfile = async () => {
    const newErrors: typeof errors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "نام الزامی است";
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = "نام باید حداقل 2 کاراکتر باشد";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "نام خانوادگی الزامی است";
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = "نام خانوادگی باید حداقل 2 کاراکتر باشد";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/verification/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          nationalNumber: nationalCode,
          phoneNumber,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "خطا در ثبت اطلاعات");
      }

      showToast.success("✅ اطلاعات با موفقیت ثبت شد");
      
      // Call onComplete callback
      if (onComplete) {
        onComplete();
      }

      // Reload page to refresh user data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Complete profile error:", error);
      showToast.error(error instanceof Error ? error.message : "خطا در ثبت اطلاعات");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    await handleSendOTP();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 1
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {currentStep > 1 ? <FaCheckCircle /> : "1"}
            </div>
            <span className="text-sm">تایید کد ملی</span>
          </div>

          <div className="flex-1 h-1 bg-gray-300 mx-2">
            <div
              className={`h-full transition-all ${
                currentStep >= 2 ? "bg-green-500 w-full" : "bg-gray-300 w-0"
              }`}
            />
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 2
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {currentStep > 2 ? <FaCheckCircle /> : "2"}
            </div>
            <span className="text-sm">تایید موبایل</span>
          </div>

          <div className="flex-1 h-1 bg-gray-300 mx-2">
            <div
              className={`h-full transition-all ${
                currentStep >= 3 ? "bg-green-500 w-full" : "bg-gray-300 w-0"
              }`}
            />
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 3
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              3
            </div>
            <span className="text-sm">اطلاعات هویتی</span>
          </div>
        </div>
      </div>

      {/* Step 1: Shahkar Verification */}
      {currentStep === 1 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <FaIdCard className="text-3xl text-blue-500" />
            <div>
              <h2 className="text-2xl font-bold">تایید اطلاعات هویتی</h2>
              <p className="text-gray-600 text-sm">
                کد ملی و شماره موبایل خود را وارد کنید
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                کد ملی <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nationalCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setNationalCode(value);
                  setErrors({ ...errors, nationalCode: undefined });
                }}
                placeholder="0000000000"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.nationalCode ? "border-red-500" : "border-gray-300"
                }`}
                maxLength={10}
                dir="ltr"
              />
              {errors.nationalCode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nationalCode}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                شماره موبایل <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 11);
                  setPhoneNumber(value);
                  setErrors({ ...errors, phoneNumber: undefined });
                }}
                placeholder="09123456789"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
                }`}
                maxLength={11}
                dir="ltr"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <FaExclamationTriangle className="text-blue-500 mt-1 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                کد ملی و شماره موبایل شما از طریق سامانه شاهکار وزارت ارتباطات
                تایید می‌شود. در صورت عدم تطابق، امکان ادامه ثبت‌نام وجود ندارد.
              </p>
            </div>

            <button
              onClick={handleShahkarVerification}
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  در حال تایید...
                </>
              ) : (
                <>
                  تایید و ادامه
                  <FaArrowLeft />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: OTP Verification */}
      {currentStep === 2 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <FaPhone className="text-3xl text-green-500" />
            <div>
              <h2 className="text-2xl font-bold">تایید شماره موبایل</h2>
              <p className="text-gray-600 text-sm">
                کد 5 رقمی ارسال شده به {phoneNumber} را وارد کنید
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                کد تایید <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 5);
                  setOtpCode(value);
                  setErrors({ ...errors, otpCode: undefined });
                }}
                placeholder="12345"
                className={`w-full px-4 py-3 border rounded-lg text-center text-2xl tracking-widest focus:ring-2 focus:ring-green-500 ${
                  errors.otpCode ? "border-red-500" : "border-gray-300"
                }`}
                maxLength={6}
                dir="ltr"
              />
              {errors.otpCode && (
                <p className="text-red-500 text-sm mt-1 text-center">
                  {errors.otpCode}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <button
                onClick={handleResendOTP}
                disabled={resendTimer > 0}
                className="text-blue-500 hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {resendTimer > 0
                  ? `ارسال مجدد در ${resendTimer} ثانیه`
                  : "ارسال مجدد کد"}
              </button>
              <button
                onClick={() => setCurrentStep(1)}
                className="text-gray-500 hover:text-gray-600 flex items-center gap-1"
              >
                <FaArrowRight />
                تغییر شماره موبایل
              </button>
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={isLoading || otpCode.length !== 5}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  در حال تایید...
                </>
              ) : (
                <>
                  تایید و ادامه
                  <FaArrowLeft />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Name Fields */}
      {currentStep === 3 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <FaUser className="text-3xl text-purple-500" />
            <div>
              <h2 className="text-2xl font-bold">اطلاعات هویتی</h2>
              <p className="text-gray-600 text-sm">
                نام و نام خانوادگی خود را وارد کنید
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                نام <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Zآ-ی\s]/g, "");
                  setFirstName(value);
                  setErrors({ ...errors, firstName: undefined });
                }}
                placeholder="نام"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                نام خانوادگی <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-Zآ-ی\s]/g, "");
                  setLastName(value);
                  setErrors({ ...errors, lastName: undefined });
                }}
                placeholder="نام خانوادگی"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800 mb-2">
                <FaCheckCircle />
                <span className="font-bold">تایید شده</span>
              </div>
              <div className="text-sm text-green-700 space-y-1">
                <p>✓ کد ملی: {nationalCode}</p>
                <p>✓ شماره موبایل: {phoneNumber}</p>
              </div>
            </div>

            <button
              onClick={handleCompleteProfile}
              disabled={isLoading}
              className="w-full bg-purple-500 text-white py-3 rounded-lg font-bold hover:bg-purple-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  در حال ثبت...
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  ثبت نهایی اطلاعات
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Shahkar Success Modal */}
      {showShahkarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-5xl text-green-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">تایید موفق</h3>
            <p className="text-gray-600">
              کد ملی و شماره موبایل شما با موفقیت از طریق سامانه شاهکار تایید شد
            </p>
            <div className="mt-6">
              <FaSpinner className="animate-spin text-3xl text-blue-500 mx-auto" />
              <p className="text-sm text-gray-500 mt-2">
                در حال ارسال کد تایید...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiStepVerification;
