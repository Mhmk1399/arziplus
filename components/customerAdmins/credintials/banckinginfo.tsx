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
import { showToast } from "@/utilities/toast";

interface requestData {
  bankName?: string;
  cardNumber: string;
  shebaNumber?: string;
  accountHolderName?: string;
  bankingInfoId?: string; // For updates
}

interface BankingInfoData {
  _id?: string; // Add ID for existing banking info
  bankName: string;
  cardNumber: string;
  shebaNumber: string;
  accountHolderName: string;
  status?: "accepted" | "rejected" | "pending_verification";
  rejectionNotes?: string;
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
    _id: initialData?._id || undefined,
    bankName: initialData?.bankName || "",
    cardNumber: initialData?.cardNumber || "",
    shebaNumber: initialData?.shebaNumber || "",
    accountHolderName: initialData?.accountHolderName || "",
    status: initialData?.status || "pending_verification",
    rejectionNotes: initialData?.rejectionNotes || "",
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

      // Check if this is an update (has _id) or create new
      const isUpdate = !!formData._id;
      const method = isUpdate ? "PATCH" : "POST";

      // Clean and format data before sending
      const requestData: requestData = {
        bankName: formData.bankName.trim(),
        cardNumber: formData.cardNumber.replace(/\s/g, ""), // Remove spaces from card number
        shebaNumber: formData.shebaNumber.trim().toUpperCase(),
        accountHolderName: formData.accountHolderName.trim(),
      };

      // Add bankingInfoId for updates
      if (isUpdate) {
        requestData.bankingInfoId = formData._id;
      }

      console.log(
        `${isUpdate ? "Updating" : "Creating"} banking data:`,
        requestData
      ); // Debug log

      const response = await fetch("/api/users/banckingifo", {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Banking API Error Response:", errorData); // Debug log
        throw new Error(
          errorData.error || `خطا در ذخیره اطلاعات بانکی (${response.status})`
        );
      }

      const result = await response.json();

      // Update form data with response if it's a new creation (will have new _id)
      if (!isUpdate && result.bankingInfo && result.bankingInfo.length > 0) {
        const newBankingInfo =
          result.bankingInfo[result.bankingInfo.length - 1];
        setFormData((prev) => ({ ...prev, _id: newBankingInfo._id }));
      }

      onSave?.(formData);
      setIsSaved(true);
      showToast.success(
        isUpdate
          ? "اطلاعات بانکی با موفقیت به‌روزرسانی شد"
          : "اطلاعات بانکی با موفقیت ذخیره شد"
      );
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.log("Error saving banking info:", error);
      showToast.error(
        error instanceof Error ? error.message : "خطا در ذخیره اطلاعات بانکی"
      );
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
      {/* Status Display */}
      {formData.status && (
        <div
          className={`mt-6 p-6 mb-6 rounded-xl border ${
            formData.status === "accepted"
              ? "bg-green-50 border-green-200"
              : formData.status === "rejected"
              ? "bg-red-50 border-red-200"
              : "bg-yellow-50 border-yellow-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {formData.status === "accepted" && (
              <>
                <FaCheck className="text-green-600" />
                <h3 className="font-medium text-green-900">تایید شده</h3>
              </>
            )}
            {formData.status === "rejected" && (
              <>
                <FaExclamationTriangle className="text-red-600" />
                <h3 className="font-medium text-red-900">رد شده</h3>
              </>
            )}
            {formData.status === "pending_verification" && (
              <>
                <FaExclamationTriangle className="text-yellow-600" />
                <h3 className="font-medium text-yellow-900">در انتظار بررسی</h3>
              </>
            )}
          </div>
          {formData.status === "accepted" && (
            <p className="text-sm text-green-800">
              اطلاعات بانکی شما توسط ادمین تایید شده است.
            </p>
          )}
          {formData.status === "pending_verification" && (
            <p className="text-sm text-yellow-800">
              اطلاعات بانکی شما در انتظار بررسی توسط ادمین است.
            </p>
          )}
          {formData.status === "rejected" && formData.rejectionNotes && (
            <div className="text-sm text-red-800">
              <p className="mb-1">دلیل رد:</p>
              <p className="bg-red-100 p-2 rounded">
                {formData.rejectionNotes}
              </p>
            </div>
          )}
        </div>
      )}

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
            ) : formData._id ? (
              "به‌روزرسانی اطلاعات"
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
