"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaUsers,
  FaChild,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaClock,
  FaCalendarAlt,
  FaPhone,
  FaIdCard,
} from "react-icons/fa";
import { showToast } from "@/utilities/toast";
import PersianDatePicker from "@/components/ui/PersianDatePicker";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import PaymentMethodSelector from "@/components/payment/PaymentMethodSelector";
import CardPaymentModal from "@/components/payment/CardPaymentModal";

// Types based on the hozori model
interface HozoriFormData {
  name: string;
  lastname: string;
  phoneNumber: string;
  childrensCount: number;
  maridgeStatus: string;
  dateObject: {
    year: string;
    month: string;
    day: string;
  };
  time: string;
  paymentType: string;
  paymentDate: Date | null;
  paymentImage: string;
}

const HozoriMultiStepForm: React.FC = () => {
  const router = useRouter();
  const { user: currentUser, isLoggedIn, loading } = useCurrentUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [showCardPaymentModal, setShowCardPaymentModal] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const [formData, setFormData] = useState<HozoriFormData>({
    name: "",
    lastname: "",
    phoneNumber: "",
    childrensCount: 0,
    maridgeStatus: "",
    dateObject: {
      year: "",
      month: "",
      day: "",
    },
    time: "",
    paymentType: "",
    paymentDate: null,
    paymentImage: "",
  });

  const steps = [
    {
      id: 0,
      title: "اطلاعات شخصی",
      icon: <FaUser className="text-xl" />,
      description: "نام، نام خانوادگی و شماره تلفن",
    },
    {
      id: 1,
      title: "اطلاعات خانوادگی",
      icon: <FaUsers className="text-xl" />,
      description: "وضعیت تأهل و تعداد فرزندان",
    },
    {
      id: 2,
      title: "انتخاب تاریخ",
      icon: <FaCalendarAlt className="text-xl" />,
      description: "انتخاب تاریخ مراجعه",
    },
    {
      id: 3,
      title: "انتخاب زمان",
      icon: <FaClock className="text-xl" />,
      description: "انتخاب ساعت مراجعه",
    },
  ];

  // Time slots for selection
  const timeSlots = [
    { value: "09:00", label: "09:00 - 10:00" },
    { value: "10:00", label: "10:00 - 11:00" },
    { value: "14:00", label: "14:00 - 15:00" },
    { value: "15:00", label: "15:00 - 16:00" },
  ];

  // Marriage status options
  const maritalStatusOptions = [
    { value: "single", label: "مجرد" },
    { value: "married", label: "متأهل" },
  ];

  // Validation functions
  const validateStep = (step: number): boolean => {
    const errors: { [key: string]: string } = {};

    switch (step) {
      case 0: // Personal Information
        if (!formData.name.trim()) errors.name = "نام الزامی است";
        if (!formData.lastname.trim()) errors.lastname = "نام خانوادگی الزامی است";
        if (!formData.phoneNumber.trim()) errors.phoneNumber = "شماره تلفن الزامی است";
        if (formData.phoneNumber && !/^09\d{9}$/.test(formData.phoneNumber)) {
          errors.phoneNumber = "شماره تلفن باید با 09 شروع شده و 11 رقم باشد";
        }
        break;

      case 1: // Family Information
        if (!formData.maridgeStatus) errors.maridgeStatus = "وضعیت تأهل الزامی است";
        if (formData.childrensCount < 0) errors.childrensCount = "تعداد فرزندان نمی‌تواند منفی باشد";
        break;

      case 2: // Date Selection
        if (!formData.dateObject.year || !formData.dateObject.month || !formData.dateObject.day) {
          errors.dateObject = "انتخاب تاریخ الزامی است";
        }
        break;

      case 3: // Time Selection
        if (!formData.time) errors.time = "انتخاب زمان الزامی است";
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
    } else {
      showToast.error("لطفاً تمامی فیلدهای الزامی را تکمیل کنید");
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  // Fetch wallet balance
  const fetchWalletBalance = async () => {
    if (!currentUser) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/wallet", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWalletBalance(data.balance || 0);
      }
    } catch (error) {
      console.log("Error fetching wallet balance:", error);
    }
  };

  // Fetch wallet balance when user loads
  useEffect(() => {
    if (currentUser) {
      fetchWalletBalance();
    }
  }, [currentUser]);

  // Authentication check - redirect if not logged in
  useEffect(() => {
    // Only check authentication after loading is complete
    if (!loading && !isLoggedIn) {
      showToast.error("برای دسترسی به این صفحه باید وارد حساب کاربری خود شوید");
      setTimeout(() => {
        router.push("/auth/sms");
      }, 2000);
    }
  }, [isLoggedIn, loading, router]);

  // Loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  // Not logged in state - only show after loading is complete
  if (!loading && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">برای دسترسی به این صفحه باید وارد حساب کاربری خود شوید</p>
          <button
            onClick={() => router.push("/auth/sms")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ورود به حساب کاربری
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!currentUser?.id) {
      showToast.error("لطفاً ابتدا وارد حساب کاربری خود شوید");
      return;
    }

    // Validate all steps before submission
    for (let i = 0; i < steps.length; i++) {
      if (!validateStep(i)) {
        showToast.error(`لطفاً ابتدا اطلاعات مرحله "${steps[i].title}" را تکمیل کنید`);
        setCurrentStep(i);
        return;
      }
    }

    // Show payment method selection
    setShowPaymentSelector(true);
  };

  const hozoriFee = 200000; // Fixed fee for hozori service

  // Handle wallet payment
  const handleWalletPayment = async () => {
    setIsSubmitting(true);
    try {
      // Check wallet balance
      if (walletBalance < hozoriFee) {
        showToast.error("موجودی کیف پول کافی نیست");
        window.location.href = "/dashboard?tab=wallet";
        return;
      }

      // Submit hozori registration with wallet payment
      await submitHozoriRegistration("wallet", hozoriFee);

      showToast.success(
        `رزرو وقت حضوری با موفقیت انجام شد. مبلغ ${hozoriFee.toLocaleString()} تومان از کیف پول کسر گردید.`
      );

      // Update wallet balance
      setWalletBalance((prev) => prev - hozoriFee);

      // Redirect to dashboard after successful submission
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.log("Wallet payment error:", error);
      showToast.error("خطا در پرداخت از کیف پول");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle direct payment (ZarinPal)
  const handleDirectPayment = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");

      // Convert Persian date for metadata
      const convertPersianToDate = (dateObj: { year: string; month: string; day: string }): Date => {
        const persianYear = parseInt(dateObj.year);
        const persianMonth = parseInt(dateObj.month);
        const persianDay = parseInt(dateObj.day);
        const gregorianYear = persianYear + 621;
        const gregorianMonth = persianMonth;
        const gregorianDay = persianDay;
        return new Date(gregorianYear, gregorianMonth - 1, gregorianDay);
      };

      const appointmentDate = convertPersianToDate(formData.dateObject);

      const paymentData = {
        amount: hozoriFee,
        description: `رزرو وقت حضوری - ${formData.name} ${formData.lastname}`,
        orderId: `HOZORI-${Date.now()}`,
        currency: "IRT",
        metadata: {
          mobile: currentUser!.phone,
          order_id: `HOZORI-${Date.now()}`,
          hozoriData: JSON.stringify({
            ...formData,
            Date: appointmentDate,
          }),
          customerName: `${formData.name} ${formData.lastname}`,
          customerPhone: formData.phoneNumber,
          type: "hozori_payment",
        },
      };

      const response = await fetch("/api/payment/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast.success("درخواست پرداخت با موفقیت ایجاد شد");
        if (data.data.paymentUrl) {
          window.location.href = data.data.paymentUrl;
        }
      } else {
        showToast.error(data.error || "خطا در ایجاد درخواست پرداخت");
      }
    } catch (error) {
      console.log("Payment request error:", error);
      showToast.error("خطا در اتصال به سرور");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle card payment
  const handleCardPayment = () => {
    setShowCardPaymentModal(true);
  };

  // Submit hozori registration after successful payment
  const submitHozoriRegistration = async (
    paymentMethod: string,
    amount: number,
    receiptUrl?: string
  ) => {
    const token = localStorage.getItem("authToken");

    // Convert Persian date object to JavaScript Date
    const convertPersianToDate = (dateObj: { year: string; month: string; day: string }): Date => {
      // Simple conversion - in production, you might want to use a proper Persian calendar library
      const persianYear = parseInt(dateObj.year);
      const persianMonth = parseInt(dateObj.month);
      const persianDay = parseInt(dateObj.day);
      
      // Approximate conversion to Gregorian (this is a simplified approach)
      // For accurate conversion, consider using a library like moment-jalaali
      const gregorianYear = persianYear + 621;
      const gregorianMonth = persianMonth;
      const gregorianDay = persianDay;
      
      return new Date(gregorianYear, gregorianMonth - 1, gregorianDay);
    };

    const appointmentDate = convertPersianToDate(formData.dateObject);

    const hozoriData = {
      name: formData.name,
      lastname: formData.lastname,
      phoneNumber: formData.phoneNumber,
      childrensCount: formData.childrensCount,
      maridgeStatus: formData.maridgeStatus,
      Date: appointmentDate,
      time: formData.time,
      paymentType: paymentMethod,
      paymentDate: new Date(),
      paymentImage: paymentMethod === "card" ? receiptUrl || "" : "",
    };

    const response = await fetch("/api/hozori", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(hozoriData),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "خطا در ثبت اطلاعات");
    }

    return result;
  };

  const updateFormData = (field: keyof HozoriFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderPersonalInfoStep();
      case 1:
        return renderFamilyInfoStep();
      case 2:
        return renderDateSelectionStep();
      case 3:
        return renderTimeSelectionStep();
      default:
        return null;
    }
  };

  const renderPersonalInfoStep = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-gray-200">
        <h3 className="text-lg font-bold text-[#0A1D37] mb-4 flex items-center gap-3">
          <FaUser className="text-[#FF7A00]" />
          اطلاعات شخصی
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="نام خود را وارد کنید"
              value={formData.name}
              onChange={(e) => updateFormData("name", e.target.value)}
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] outline-none transition-all ${
                validationErrors.name ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {validationErrors.name && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام خانوادگی <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="نام خانوادگی خود را وارد کنید"
              value={formData.lastname}
              onChange={(e) => updateFormData("lastname", e.target.value)}
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] outline-none transition-all ${
                validationErrors.lastname ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {validationErrors.lastname && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.lastname}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              شماره تلفن <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="09123456789"
              value={formData.phoneNumber}
              onChange={(e) => updateFormData("phoneNumber", e.target.value)}
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] outline-none transition-all ${
                validationErrors.phoneNumber ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {validationErrors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.phoneNumber}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFamilyInfoStep = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-gray-200">
        <h3 className="text-lg font-bold text-[#0A1D37] mb-4 flex items-center gap-3">
          <FaUsers className="text-[#FF7A00]" />
          اطلاعات خانوادگی
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              وضعیت تأهل <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.maridgeStatus}
              onChange={(e) => updateFormData("maridgeStatus", e.target.value)}
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] outline-none transition-all ${
                validationErrors.maridgeStatus ? "border-red-500" : "border-gray-300"
              }`}
              required
            >
              <option value="">انتخاب کنید</option>
              {maritalStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {validationErrors.maridgeStatus && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.maridgeStatus}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              تعداد فرزندان <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              max="10"
              placeholder="0"
              value={formData.childrensCount}
              onChange={(e) => updateFormData("childrensCount", parseInt(e.target.value) || 0)}
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] outline-none transition-all ${
                validationErrors.childrensCount ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {validationErrors.childrensCount && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.childrensCount}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDateSelectionStep = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-gray-200">
        <h3 className="text-lg font-bold text-[#0A1D37] mb-4 flex items-center gap-3">
          <FaCalendarAlt className="text-[#FF7A00]" />
          انتخاب تاریخ مراجعه
        </h3>

        <div className="max-w-md mx-auto">
          <PersianDatePicker
            value={formData.dateObject}
            onChange={(date) => updateFormData("dateObject", date)}
            placeholder="تاریخ مراجعه را انتخاب کنید"
            className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] outline-none transition-all ${
              validationErrors.dateObject ? "border-red-500" : "border-gray-300"
            }`}
          />
          {validationErrors.dateObject && (
            <p className="text-red-500 text-xs mt-1 text-center">{validationErrors.dateObject}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderTimeSelectionStep = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl border border-gray-200">
        <h3 className="text-lg font-bold text-[#0A1D37] mb-4 flex items-center gap-3">
          <FaClock className="text-[#FF7A00]" />
          انتخاب زمان مراجعه
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {timeSlots.map((slot) => (
            <button
              key={slot.value}
              onClick={() => updateFormData("time", slot.value)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                formData.time === slot.value
                  ? "border-[#FF7A00] bg-[#FF7A00] text-white shadow-lg"
                  : "border-gray-300 bg-white text-gray-700 hover:border-[#FF7A00] hover:shadow-md"
              }`}
            >
              <FaClock className="mx-auto mb-2" />
              <div className="text-sm font-medium">{slot.label}</div>
            </button>
          ))}
        </div>

        {validationErrors.time && (
          <p className="text-red-500 text-xs mt-4 text-center">{validationErrors.time}</p>
        )}
      </div>
    </div>
  );

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-2 sm:p-4"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto mt-16 sm:mt-20 md:mt-28">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A1D37] mb-2">
            رزرو وقت حضوری
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            برای رزرو وقت حضوری اطلاعات زیر را تکمیل کنید
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm font-medium mb-2 transition-all ${
                    currentStep >= index
                      ? "bg-[#FF7A00] text-white shadow-lg"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep > index ? <FaCheck /> : step.icon}
                </div>
                <div className="text-center">
                  <p
                    className={`text-xs sm:text-sm font-medium ${
                      currentStep >= index ? "text-[#0A1D37]" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`hidden sm:block w-full h-0.5 mt-6 ${
                      currentStep > index ? "bg-[#FF7A00]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-4 sm:p-6 lg:p-8 mb-6">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
              currentStep === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
            }`}
          >
            <FaArrowRight />
            قبلی
          </button>

          {isLastStep ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? "در حال پردازش..." : "تکمیل رزرو"}
              <FaCheck />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] text-white rounded-xl hover:shadow-lg transition-all"
            >
              بعدی
              <FaArrowLeft />
            </button>
          )}
        </div>
      </div>

      {/* Payment Method Selection Modal */}
      {showPaymentSelector && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-[#0A1D37] mb-4 text-center">
              انتخاب روش پرداخت
            </h3>
            <p className="text-center text-gray-600 mb-6">
              هزینه رزرو وقت حضوری:{" "}
              <span className="font-bold text-[#FF7A00]">
                {hozoriFee.toLocaleString()} تومان
              </span>
            </p>
            <PaymentMethodSelector
              amount={hozoriFee}
              walletBalance={walletBalance}
              onPaymentMethodSelect={(method) => {
                setShowPaymentSelector(false);
                if (method === "wallet") {
                  handleWalletPayment();
                } else if (method === "direct") {
                  handleDirectPayment();
                } else if (method === "card") {
                  handleCardPayment();
                }
              }}
              isWalletEnabled={walletBalance >= hozoriFee}
            />
            <button
              onClick={() => setShowPaymentSelector(false)}
              className="mt-4 w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              انصراف
            </button>
          </div>
        </div>
      )}

      {/* Card Payment Modal */}
      <CardPaymentModal
        isOpen={showCardPaymentModal}
        onClose={() => setShowCardPaymentModal(false)}
        amount={hozoriFee}
        serviceName="رزرو وقت حضوری"
        onPaymentComplete={async (receiptUrl: string) => {
          await submitHozoriRegistration("card", hozoriFee, receiptUrl);
          setShowCardPaymentModal(false);
          showToast.success("رزرو وقت حضوری با موفقیت انجام شد");

          // Redirect to dashboard after successful submission
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        }}
      />
    </div>
  );
};

export default HozoriMultiStepForm;