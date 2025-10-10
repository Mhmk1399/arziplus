"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaIdCard,
  FaEnvelope,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";
import { showToast } from "@/utilities/toast";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  nationalNumber?: string;
}

export default function CompleteProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    nationalNumber: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/auth/sms");
    }
  }, [router]);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "firstName":
        if (!value.trim()) return "نام الزامی است";
        if (value.trim().length < 2) return "نام باید حداقل ۲ کاراکتر باشد";
        break;
      case "lastName":
        if (!value.trim()) return "نام خانوادگی الزامی است";
        if (value.trim().length < 2)
          return "نام خانوادگی باید حداقل ۲ کاراکتر باشد";
        break;
      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "فرمت ایمیل صحیح نیست";
        }
        break;
      case "nationalNumber":
        if (value && !/^\d{10}$/.test(value)) {
          return "کد ملی باید ۱۰ رقم باشد";
        }
        break;
    }
    return undefined;
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof typeof formData]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key as keyof FormErrors] = error;
    });

    setErrors(newErrors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      nationalNumber: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast.error("لطفاً خطاهای فرم را برطرف کنید");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        showToast.success("پروفایل با موفقیت تکمیل شد");
        setTimeout(() => {
          router.push("/admin");
        }, 1000);
      } else {
        showToast.error(data.error);
      }
    } catch (error) {
      showToast.error("خطا در تکمیل پروفایل");
    } finally {
      setLoading(false);
    }
  };

  const getInputClasses = (fieldName: keyof FormErrors) => {
    const hasError = touched[fieldName] && errors[fieldName];
    return `w-full pr-12 pl-4 py-4 border rounded-xl transition-all duration-300 ${
      hasError
        ? "border-red-500 focus:ring-2 focus:ring-red-200 focus:border-red-500"
        : "border-[#A0A0A0] focus:ring-2 focus:ring-[#4DBFF0] focus:border-[#4DBFF0]"
    }`;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A1D37" }}>
      <div className="flex items-center justify-center min-h-screen p-4 ">
        <div className="w-full max-w-md mt-24" dir="rtl">
          <div className="bg-[#FFFFFF] rounded-2xl shadow-2xl p-8 border border-[#A0A0A0]/20">
            {/* Header */}
            <div className="text-center mb-8">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#FF7A00" }}
              >
                <FaUser className="text-white text-xl" />
              </div>
              <h1
                className="text-2xl font-bold mb-2"
                style={{ color: "#0A1D37" }}
              >
                تکمیل پروفایل
              </h1>
              <p style={{ color: "#A0A0A0" }}>
                لطفاً اطلاعات خود را تکمیل کنید
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name */}
              <div>
                <div className="relative">
                  <FaUser
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    style={{ color: "#A0A0A0" }}
                  />
                  <input
                    type="text"
                    placeholder="نام"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    onBlur={() => handleBlur("firstName")}
                    className={getInputClasses("firstName")}
                  />
                  {touched.firstName && errors.firstName && (
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <FaExclamationCircle className="text-red-500" />
                    </div>
                  )}
                </div>
                {touched.firstName && errors.firstName && (
                  <p className="text-red-500 text-sm mt-1 mr-2">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <div className="relative">
                  <FaUser
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    style={{ color: "#A0A0A0" }}
                  />
                  <input
                    type="text"
                    placeholder="نام خانوادگی"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    onBlur={() => handleBlur("lastName")}
                    className={getInputClasses("lastName")}
                  />
                  {touched.lastName && errors.lastName && (
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <FaExclamationCircle className="text-red-500" />
                    </div>
                  )}
                </div>
                {touched.lastName && errors.lastName && (
                  <p className="text-red-500 text-sm mt-1 mr-2">
                    {errors.lastName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <div className="relative">
                  <FaEnvelope
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    style={{ color: "#A0A0A0" }}
                  />
                  <input
                    type="email"
                    placeholder="ایمیل (اختیاری)"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className={getInputClasses("email")}
                  />
                  {touched.email && errors.email && (
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <FaExclamationCircle className="text-red-500" />
                    </div>
                  )}
                </div>
                {touched.email && errors.email && (
                  <p className="text-red-500 text-sm mt-1 mr-2">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* National Number */}
              <div>
                <div className="relative">
                  <FaIdCard
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    style={{ color: "#A0A0A0" }}
                  />
                  <input
                    type="text"
                    placeholder="کد ملی (اختیاری)"
                    value={formData.nationalNumber}
                    onChange={(e) =>
                      handleInputChange(
                        "nationalNumber",
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                    onBlur={() => handleBlur("nationalNumber")}
                    className={getInputClasses("nationalNumber")}
                    maxLength={10}
                  />
                  {touched.nationalNumber && errors.nationalNumber && (
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <FaExclamationCircle className="text-red-500" />
                    </div>
                  )}
                </div>
                {touched.nationalNumber && errors.nationalNumber && (
                  <p className="text-red-500 text-sm mt-1 mr-2">
                    {errors.nationalNumber}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-6"
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = "#e66a00";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = "#FF7A00";
                  }
                }}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin ml-2" />
                    در حال تکمیل...
                  </>
                ) : (
                  "تکمیل پروفایل"
                )}
              </button>
            </form>

            {/* Skip Button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => router.push("/admin")}
                className="font-medium transition-colors duration-200"
                style={{ color: "#A0A0A0" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#0A1D37";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#A0A0A0";
                }}
              >
                رد کردن و ادامه
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
