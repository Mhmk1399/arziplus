"use client";
import { useState, useRef } from "react";
import { 
  FaIdCard, 
  FaUser, 
  FaFileImage, 
  FaUpload,
  FaCheck,
  FaExclamationTriangle,
  FaEye,
  FaTimes
} from "react-icons/fa";
import { estedadBold } from "@/next-persian-fonts/estedad/index";
import Image from "next/image";

interface NationalCredentialsData {
  firstName: string;
  lastName: string;
  nationalNumber: string;
  nationalCardImageUrl: string;
  verificationImageUrl: string;
}

interface NationalCredentialsProps {
  initialData?: NationalCredentialsData;
  onSave?: (data: NationalCredentialsData) => void;
  onValidationChange?: (isValid: boolean) => void;
}

const NationalCredentials = ({ initialData, onSave, onValidationChange }: NationalCredentialsProps) => {
  const [formData, setFormData] = useState<NationalCredentialsData>({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    nationalNumber: initialData?.nationalNumber || "",
    nationalCardImageUrl: initialData?.nationalCardImageUrl || "",
    verificationImageUrl: initialData?.verificationImageUrl || "",
  });

  const [errors, setErrors] = useState<Partial<NationalCredentialsData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const nationalCardRef = useRef<HTMLInputElement>(null);
  const verificationRef = useRef<HTMLInputElement>(null);

  // Validation functions
  const validateNationalNumber = (nationalNumber: string): boolean => {
    const regex = /^\d{10}$/;
    if (!regex.test(nationalNumber)) return false;

    // Checksum validation for Iranian national code
    const digits = nationalNumber.split('').map(Number);
    const checksum = digits.reduce((sum, digit, index) => {
      if (index < 9) return sum + digit * (10 - index);
      return sum;
    }, 0) % 11;

    const lastDigit = digits[9];
    return checksum < 2 ? lastDigit === checksum : lastDigit === 11 - checksum;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<NationalCredentialsData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "نام الزامی است";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "نام باید حداقل 2 کاراکتر باشد";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "نام خانوادگی الزامی است";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "نام خانوادگی باید حداقل 2 کاراکتر باشد";
    }

    if (!formData.nationalNumber.trim()) {
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

  const handleInputChange = (field: keyof NationalCredentialsData, value: string) => {
    let processedValue = value;

    // Only allow digits for national number
    if (field === "nationalNumber") {
      processedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    // Clean names (only Persian and English letters)
    if (field === "firstName" || field === "lastName") {
      processedValue = value.replace(/[^a-zA-Zآ-ی\s]/g, "");
    }

    setFormData(prev => ({ ...prev, [field]: processedValue }));
    setIsSaved(false);

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileUpload = async (field: "nationalCardImageUrl" | "verificationImageUrl", file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, [field]: "فقط فایل‌های تصویری مجاز هستند" }));
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [field]: "حجم فایل نباید بیش از 5 مگابایت باشد" }));
      return;
    }

    setUploadingField(field);
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a fake URL for demonstration
      const fakeUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, [field]: fakeUrl }));
      
      // Clear error for this field
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, [field]: "خطا در آپلود فایل" }));
    } finally {
      setUploadingField(null);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/users/nationalverifications", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
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
      onSave?.(formData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Error saving national credentials:", error);
      alert(error instanceof Error ? error.message : "خطا در ذخیره اطلاعات هویتی");
    } finally {
      setIsLoading(false);
    }
  };

  const FileUploadBox = ({ 
    field, 
    label, 
    icon, 
    description,
    inputRef 
  }: { 
    field: "nationalCardImageUrl" | "verificationImageUrl";
    label: string;
    icon: React.ReactNode;
    description: string;
    inputRef: React.RefObject<HTMLInputElement | null>;
  }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {icon}
        {label}
      </label>
      
      {formData[field] ? (
        <div className="relative">
          <div className="border-2 border-green-200 bg-green-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-200 rounded-lg">
                  <FaCheck className="text-green-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">فایل آپلود شد</p>
                  <p className="text-xs text-green-600">برای مشاهده کلیک کنید</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewImage(formData[field])}
                  className="p-2 text-green-700 hover:bg-green-200 rounded-lg transition-colors"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => setFormData(prev => ({ ...prev, [field]: "" }))}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            uploadingField === field
              ? "border-indigo-300 bg-indigo-50"
              : errors[field]
              ? "border-red-300 bg-red-50 hover:border-red-400"
              : "border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50"
          }`}
        >
          {uploadingField === field ? (
            <div className="space-y-3">
              <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-indigo-600 font-medium">در حال آپلود...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-gray-200 rounded-full w-fit mx-auto">
                <FaUpload className="text-gray-600 text-xl" />
              </div>
              <div>
                <p className="font-medium text-gray-700">{description}</p>
                <p className="text-sm text-gray-500 mt-1">فرمت‌های مجاز: JPG, PNG, PDF (حداکثر 5MB)</p>
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(field, file);
        }}
        className="hidden"
      />

      {errors[field] && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <FaExclamationTriangle className="text-xs" />
          {errors[field]}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-emerald-100 rounded-xl">
            <FaIdCard className="text-emerald-700 text-xl" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold text-gray-900 ${estedadBold.className}`}>
              مدارک احراز هویت
            </h2>
            <p className="text-gray-600 mt-1">
              اطلاعات شخصی و مدارک هویتی خود را وارد کنید
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="space-y-8">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FaUser className="text-emerald-600" />
                نام
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="نام خود را وارد کنید"
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                  errors.firstName 
                    ? "border-red-300 bg-red-50 focus:ring-red-500" 
                  : "border-gray-200 bg-gray-50"
              } `}
                dir="rtl"
              />
              {errors.firstName && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <FaExclamationTriangle className="text-xs" />
                  {errors.firstName}
                </div>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FaUser className="text-emerald-600" />
                نام خانوادگی
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="نام خانوادگی خود را وارد کنید"
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                  errors.lastName 
                    ? "border-red-300 bg-red-50 focus:ring-red-500" 
                  : "border-gray-200 bg-gray-50"
              } `}
                dir="rtl"
              />
              {errors.lastName && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <FaExclamationTriangle className="text-xs" />
                  {errors.lastName}
                </div>
              )}
            </div>
          </div>

          {/* National Number */}
          <div className="space-y-2 w-full" >
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 w-full">
              <FaIdCard className="text-emerald-600" />
              کد ملی
            </label>
            <input
              type="text"
              value={formData.nationalNumber}
              onChange={(e) => handleInputChange("nationalNumber", e.target.value)}
              placeholder="کد ملی 10 رقمی"
              maxLength={10}
              className={`w-full text-end  px-4 py-3 rounded-xl border transition-all duration-200 font-mono ${
                errors.nationalNumber 
                  ? "border-red-300 bg-red-50 focus:ring-red-500" 
                  : "border-gray-200 bg-gray-50"
              } `}
              dir="ltr"
            />
            {errors.nationalNumber && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <FaExclamationTriangle className="text-xs" />
                {errors.nationalNumber}
              </div>
            )}
          </div>

          {/* Document Uploads */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FileUploadBox
              field="nationalCardImageUrl"
              label="تصویر کارت ملی"
              icon={<FaIdCard className="text-emerald-600" />}
              description="تصویر واضح از کارت ملی خود آپلود کنید"
              inputRef={nationalCardRef}
            />

            <FileUploadBox
              field="verificationImageUrl"
              label="تصویر احراز هویت"
              icon={<FaFileImage className="text-emerald-600" />}
              description="سلفی با کارت ملی در کنار صورت"
              inputRef={verificationRef}
            />
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
                : "bg-emerald-700 hover:bg-emerald-800 text-white shadow-lg hover:shadow-xl"
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
              "ذخیره مدارک"
            )}
          </button>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium text-gray-900">پیش‌نمایش تصویر</h3>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>
            <div className="p-4">
              <Image
                src={previewImage}
                alt="پیش‌نمایش"
                width={800}
                height={600}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 p-6 bg-emerald-50 rounded-xl border border-emerald-200">
        <h3 className="font-medium text-emerald-900 mb-2">راهنمای تکمیل:</h3>
        <ul className="text-sm text-emerald-800 space-y-1">
          <li>• نام و نام خانوادگی باید مطابق کارت ملی باشد</li>
          <li>• کد ملی باید معتبر و 10 رقمی باشد</li>
          <li>• تصویر کارت ملی باید واضح و خوانا باشد</li>
          <li>• برای تصویر احراز هویت، سلفی با کارت ملی در کنار صورت بگیرید</li>
          <li>• حجم فایل‌ها نباید بیش از 5 مگابایت باشد</li>
        </ul>
      </div>
    </div>
  );
};

export default NationalCredentials;
