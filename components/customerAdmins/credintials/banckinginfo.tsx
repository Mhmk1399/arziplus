"use client";
import { useState } from "react";
import {
  FaUniversity,
  FaCreditCard,
  FaUser,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";
import { estedadBold } from "@/next-persian-fonts/estedad/index";

interface BankingInfoData {
  bankName: string;
  cardNumber: string;
  shebaNumber: string;
  accountHolderName: string;
}

interface BankingInfoProps {
  initialData?: BankingInfoData;
  onSave?: (data: BankingInfoData) => void;
  onValidationChange?: (isValid: boolean) => void;
}

const BankingInfo = ({
  initialData,
  onSave,
  onValidationChange,
}: BankingInfoProps) => {
  const [formData, setFormData] = useState<BankingInfoData>({
    bankName: initialData?.bankName || "",
    cardNumber: initialData?.cardNumber || "",
    shebaNumber: initialData?.shebaNumber || "",
    accountHolderName: initialData?.accountHolderName || "",
  });

  const [errors, setErrors] = useState<Partial<BankingInfoData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Validation functions
  const validateShebaNumber = (sheba: string): boolean => {
    const shebaRegex = /^IR\d{24}$/;
    return shebaRegex.test(sheba);
  };

  const validateCardNumber = (cardNumber: string): boolean => {
    const cleanCardNumber = cardNumber.replace(/\s/g, "");
    return cleanCardNumber.length === 16 && /^\d+$/.test(cleanCardNumber);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<BankingInfoData> = {};

    if (!formData.bankName.trim()) {
      newErrors.bankName = "نام بانک الزامی است";
    }

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "شماره کارت الزامی است";
    } else if (!validateCardNumber(formData.cardNumber)) {
      newErrors.cardNumber = "شماره کارت باید 16 رقم باشد";
    }

    if (!formData.shebaNumber.trim()) {
      newErrors.shebaNumber = "شماره شبا الزامی است";
    } else if (!validateShebaNumber(formData.shebaNumber)) {
      newErrors.shebaNumber = "فرمت شماره شبا صحیح نیست (IR + 24 رقم)";
    }

    if (!formData.accountHolderName.trim()) {
      newErrors.accountHolderName = "نام صاحب حساب الزامی است";
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    onValidationChange?.(isValid);
    return isValid;
  };

  const handleInputChange = (field: keyof BankingInfoData, value: string) => {
    let processedValue = value;

    // Format card number with spaces
    if (field === "cardNumber") {
      processedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})(?=\d)/g, "$1 ");
    }

    // Format SHEBA number
    if (field === "shebaNumber") {
      processedValue = value.toUpperCase().replace(/[^IR0-9]/g, "");
      if (!processedValue.startsWith("IR") && processedValue.length > 0) {
        processedValue = "IR" + processedValue;
      }
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
      const response = await fetch("/api/users/banckingifo", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bankName: formData.bankName,
          cardNumber: formData.cardNumber,
          shebaNumber: formData.shebaNumber,
          accountHolderName: formData.accountHolderName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در ذخیره اطلاعات بانکی");
      }

      const result = await response.json();
      onSave?.(formData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Error saving banking info:", error);
      alert(error instanceof Error ? error.message : "خطا در ذخیره اطلاعات بانکی");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <FaUniversity className="text-indigo-700 text-xl" />
          </div>
          <div>
            <h2
              className={`text-2xl font-bold text-gray-900 ${estedadBold.className}`}
            >
              اطلاعات بانکی
            </h2>
            <p className="text-gray-600 mt-1">
              اطلاعات حساب بانکی خود را برای دریافت درآمد وارد کنید
            </p>
          </div>
        </div>
      </div>
      {/* Help Text */}
      <div className="mt-6 p-6 mb-6 bg-blue-50 rounded-xl border border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">راهنمای تکمیل:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• شماره کارت باید 16 رقم باشد</li>
          <li>• شماره شبا باید با IR شروع شده و 24 رقم داشته باشد</li>
          <li>• نام صاحب حساب باید دقیقاً مطابق مدارک بانکی باشد</li>
          <li>• اطلاعات وارد شده برای برداشت درآمد استفاده خواهد شد</li>
        </ul>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bank Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaUniversity className="text-indigo-600" />
              نام بانک
            </label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => handleInputChange("bankName", e.target.value)}
              placeholder="مثال: بانک ملی ایران"
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                errors.bankName
                  ? "border-red-300 bg-red-50 focus:ring-red-500"
                  : "border-gray-200 bg-gray-50 focus:ring-indigo-500"
              } focus:ring-2 focus:border-transparent`}
              dir="rtl"
            />
            {errors.bankName && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <FaExclamationTriangle className="text-xs" />
                {errors.bankName}
              </div>
            )}
          </div>

          {/* Account Holder Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaUser className="text-indigo-600" />
              نام صاحب حساب
            </label>
            <input
              type="text"
              value={formData.accountHolderName}
              onChange={(e) =>
                handleInputChange("accountHolderName", e.target.value)
              }
              placeholder="نام و نام خانوادگی صاحب حساب"
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                errors.accountHolderName
                  ? "border-red-300 bg-red-50 focus:ring-red-500"
                  : "border-gray-200 bg-gray-50 focus:ring-indigo-500"
              } focus:ring-2 focus:border-transparent`}
              dir="rtl"
            />
            {errors.accountHolderName && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <FaExclamationTriangle className="text-xs" />
                {errors.accountHolderName}
              </div>
            )}
          </div>

          {/* Card Number */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaCreditCard className="text-indigo-600" />
              شماره کارت
            </label>
            <input
              type="text"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange("cardNumber", e.target.value)}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 font-mono ${
                errors.cardNumber
                  ? "border-red-300 bg-red-50 focus:ring-red-500"
                  : "border-gray-200 bg-gray-50 focus:ring-indigo-500"
              } focus:ring-2 focus:border-transparent`}
              dir="ltr"
            />
            {errors.cardNumber && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <FaExclamationTriangle className="text-xs" />
                {errors.cardNumber}
              </div>
            )}
          </div>

          {/* SHEBA Number */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FaUniversity className="text-indigo-600" />
              شماره شبا
            </label>
            <input
              type="text"
              value={formData.shebaNumber}
              onChange={(e) => handleInputChange("shebaNumber", e.target.value)}
              placeholder="IR123456789012345678901234"
              maxLength={26}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 font-mono ${
                errors.shebaNumber
                  ? "border-red-300 bg-red-50 focus:ring-red-500"
                  : "border-gray-200 bg-gray-50 focus:ring-indigo-500"
              } focus:ring-2 focus:border-transparent`}
              dir="ltr"
            />
            {errors.shebaNumber && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <FaExclamationTriangle className="text-xs" />
                {errors.shebaNumber}
              </div>
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
                : "bg-indigo-700 hover:bg-indigo-800 text-white shadow-lg hover:shadow-xl"
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
    </div>
  );
};

export default BankingInfo;
