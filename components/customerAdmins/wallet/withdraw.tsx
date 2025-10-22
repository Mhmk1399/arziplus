"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { showToast } from "@/utilities/toast";
import {
  FaMoneyBillWave,
  FaSpinner,
  FaWallet,
  FaUniversity,
  FaInfoCircle,
  FaArrowLeft,
  FaShieldAlt,
  FaCheckCircle,
  FaClock,
  FaHistory,
  FaChartLine,
  FaExclamationTriangle,
  FaTimesCircle,
  FaEdit,
  FaArrowDown,
  FaArrowUp,
} from "react-icons/fa";

interface WalletTransaction {
  _id?: string;
  amount: number;
  type: "income" | "outcome";
  tag: string;
  description: string;
  date: Date;
  verifiedAt?: Date;
  status: "pending" | "verified" | "rejected";
  verifiedBy?: string;
}

interface WithdrawComponentProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  walletBalance?: number;
  walletStats?: {
    totalIncomes: number;
    totalOutcomes: number;
    pendingIncomes: number;
    recentTransactions: WalletTransaction[];
  };
}

interface BankingInfo {
  bankName: string;
  cardNumber: string;
  shebaNumber: string;
  accountHolderName: string;
  status: "accepted" | "rejected" | "pending_verification";
  rejectionNotes?: string;
}

const WithdrawComponent: React.FC<WithdrawComponentProps> = ({
  onSuccess,
  onCancel,
  walletBalance = 0,
  walletStats = {
    totalIncomes: 0,
    totalOutcomes: 0,
    pendingIncomes: 0,
    recentTransactions: [],
  },
}) => {
  const router = useRouter();
  const {
    user: currentUser,
    isLoggedIn,
    loading: userLoading,
  } = useCurrentUser();

  const [loading, setLoading] = useState(false);
  const [bankingInfoLoading, setBankingInfoLoading] = useState(true);
  const [bankingInfo, setBankingInfo] = useState<BankingInfo | null>(null);
  const [formData, setFormData] = useState({
    amount: "",
    notes: "",
  });

  // Predefined amounts (in Toman) - smaller amounts for withdrawals
  const predefinedAmounts = [
    { label: "10 هزار", value: 10000, popular: false },
    { label: "25 هزار", value: 25000, popular: true },
    { label: "50 هزار", value: 50000, popular: true },
    { label: "100 هزار", value: 100000, popular: true },
    { label: "250 هزار", value: 250000, popular: false },
    { label: "500 هزار", value: 500000, popular: false },
    { label: "کل موجودی", value: walletBalance, popular: false },
  ];

  // Fetch banking information
  useEffect(() => {
    const fetchBankingInfo = async () => {
      if (!isLoggedIn || userLoading) {
        setBankingInfoLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("/api/users/banckingifo", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        console.log("Banking API Response:", data);

        if (
          data.bankingData &&
          Array.isArray(data.bankingData) &&
          data.bankingData.length > 0
        ) {
          const currentUser = data.bankingData[0];

          if (
            currentUser.bankingInfo &&
            Array.isArray(currentUser.bankingInfo) &&
            currentUser.bankingInfo.length > 0
          ) {
            const acceptedBanking = currentUser.bankingInfo.find(
              (banking: BankingInfo) => banking.status === "accepted"
            );
            const bankingToUse = acceptedBanking || currentUser.bankingInfo[0];
            console.log("Selected banking info:", bankingToUse);
            setBankingInfo(bankingToUse);
          } else {
            console.log("No banking info in user data");
            setBankingInfo(null);
          }
        } else {
          console.log("No banking data found:", data);
          setBankingInfo(null);
        }
      } catch (error) {
        console.log("Error fetching banking info:", error);
        setBankingInfo(null);
      } finally {
        setBankingInfoLoading(false);
      }
    };

    fetchBankingInfo();
  }, [isLoggedIn, userLoading]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePredefinedAmount = (amount: number) => {
    setFormData((prev) => ({
      ...prev,
      amount: amount.toString(),
    }));
  };

  const formatAmount = (amount: number) => {
    return `${amount.toLocaleString("fa-IR")} تومان`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      showToast.error("لطفاً وارد حساب کاربری خود شوید");
      return;
    }

    if (!bankingInfo || bankingInfo.status !== "accepted") {
      showToast.error("ابتدا اطلاعات بانکی خود را تکمیل و تایید کنید");
      return;
    }

    const amount = parseFloat(formData.amount.toString());

    if (!amount || amount <= 0) {
      showToast.error("لطفاً مبلغ معتبر وارد کنید");
      return;
    }

    if (amount > walletBalance) {
      showToast.error("مبلغ درخواستی بیشتر از موجودی کیف پول شماست");
      return;
    }

    const minAmount = 10000;
    if (amount < minAmount) {
      showToast.error(`حداقل مبلغ برداشت ${formatAmount(minAmount)} است`);
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch("/api/wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "withdraw",
          amount: amount,
          notes: formData.notes || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast.success("درخواست برداشت با موفقیت ثبت شد");

        setFormData({ amount: "", notes: "" });

        if (onSuccess) onSuccess();
      } else {
        showToast.error(data.error || "خطا در ثبت درخواست برداشت");
      }
    } catch (error) {
      console.log("Withdraw request error:", error);
      showToast.error("خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (userLoading || bankingInfoLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center p-4" dir="rtl">
        <div className="text-center">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaSpinner className="animate-spin text-2xl sm:text-3xl text-white" />
            </div>
          </div>
          <p className="text-base sm:text-lg font-medium text-gray-700 mb-2">
            در حال بارگذاری...
          </p>
          <p className="text-xs sm:text-sm text-gray-500">لطفاً صبر کنید</p>
        </div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!isLoggedIn || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center p-4" dir="rtl">
        <div className="text-center p-6 sm:p-8 lg:p-12 bg-white rounded-3xl shadow-xl max-w-md border border-gray-100">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FaExclamationTriangle className="text-3xl sm:text-4xl text-yellow-600" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#0A1D37] mb-3">
            ورود به سیستم لازم است
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
            برای ادامه لطفاً وارد حساب کاربری خود شوید
          </p>
          <button
            onClick={() => router.push("/auth/sms")}
            className="w-full px-6 py-3 sm:py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl sm:rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 font-bold"
          >
            ورود / ثبت نام
          </button>
        </div>
      </div>
    );
  }

  const hasInsufficientBalance = walletBalance < 10000;

  // Banking verification status component
  const renderBankingStatus = () => {
    if (!bankingInfo) {
      return (
        <div className=" rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center shadow-lg">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
            <FaUniversity className="text-white text-2xl sm:text-3xl" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">
            اطلاعات بانکی ثبت نشده 
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
            برای انجام برداشت از کیف پول، ابتدا اطلاعات بانکی خود را تکمیل کنید
          </p>
          <button
            onClick={() => router.push("/complete-profile")}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-slate-800 text-white rounded-xl sm:rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 font-bold text-sm sm:text-base"
          >
            <FaEdit />
            <span>تکمیل اطلاعات بانکی</span>
          </button>
        </div>
      );
    }

    if (bankingInfo.status === "pending_verification") {
      return (
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 border-2 border-yellow-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center shadow-lg">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl animate-pulse">
            <FaClock className="text-white text-2xl sm:text-3xl" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-yellow-800 mb-3 sm:mb-4">
            در انتظار تایید ⏳
          </h3>
          <p className="text-sm sm:text-base text-yellow-600 mb-6 sm:mb-8 leading-relaxed">
            اطلاعات بانکی شما در حال بررسی است. لطفاً منتظر تایید مدیر باشید
          </p>
          <div className="bg-white border-2 border-yellow-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-right space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-yellow-700 font-medium">
                بانک:
              </span>
              <span className="text-sm sm:text-base text-yellow-900 font-bold">
                {bankingInfo.bankName}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-yellow-700 font-medium">
                شماره کارت:
              </span>
              <span className="text-sm sm:text-base text-yellow-900 font-bold font-mono">
                {bankingInfo.cardNumber}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-yellow-700 font-medium">
                شماره شبا:
              </span>
              <span className="text-sm sm:text-base text-yellow-900 font-bold font-mono">
                {bankingInfo.shebaNumber}
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (bankingInfo.status === "rejected") {
      return (
        <div className="bg-gradient-to-br from-red-50 to-red-100/50 border-2 border-red-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center shadow-lg">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
            <FaTimesCircle className="text-white text-2xl sm:text-3xl" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-red-800 mb-3 sm:mb-4">
            اطلاعات رد شده ❌
          </h3>
          <p className="text-sm sm:text-base text-red-600 mb-6 leading-relaxed">
            اطلاعات بانکی شما توسط مدیر رد شده است. لطفاً اطلاعات صحیح را وارد
            کنید
          </p>
          {bankingInfo.rejectionNotes && (
            <div className="bg-red-100 border-2 border-red-300 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 text-right">
              <div className="flex items-start gap-3">
                <FaExclamationTriangle className="text-red-600 text-lg flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-red-800 mb-2">
                    دلیل رد:
                  </p>
                  <p className="text-sm text-red-700 leading-relaxed">
                    {bankingInfo.rejectionNotes}
                  </p>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => router.push("/complete-profile")}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-red-500 text-white rounded-xl sm:rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 font-bold text-sm sm:text-base"
          >
            <FaEdit />
            <span>ویرایش اطلاعات بانکی</span>
          </button>
        </div>
      );
    }

    return null;
  };

  const isBankingApproved = bankingInfo && bankingInfo.status === "accepted";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-3 sm:p-4 lg:p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Banking Status Check */}
        {!isBankingApproved && (
          <div className="mb-6 sm:mb-8">{renderBankingStatus()}</div>
        )}

        {/* Main Content - Only show if banking is approved */}
        {isBankingApproved && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Main Form - Left Side */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Header */}
              <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                  <FaArrowDown className="text-white text-xl sm:text-2xl lg:text-3xl" />
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0A1D37] mb-2 sm:mb-3">
                  درخواست برداشت 
                </h2>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                  برداشت از موجودی کیف پول
                </p>
              </div>

              {/* Current Balance Display */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100/50 border-2 border-blue-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-md">
                      <FaWallet className="text-white text-lg sm:text-xl" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-blue-600 mb-1">
                        موجودی قابل برداشت
                      </p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-800">
                        {walletBalance.toLocaleString("fa-IR")}
                      </p>
                      <p className="text-xs sm:text-sm text-blue-600">تومان</p>
                    </div>
                  </div>
                  {hasInsufficientBalance && (
                    <div className="flex items-center gap-2 bg-yellow-100 px-3 sm:px-4 py-2 rounded-xl border border-yellow-200">
                      <FaExclamationTriangle className="text-yellow-600 text-lg sm:text-xl" />
                      <p className="text-xs sm:text-sm text-yellow-700 font-medium">
                        موجودی کافی نیست
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Banking Info Display */}
              <div className="bg-gradient-to-br from-green-50 to-green-100/50 border-2 border-green-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-sm">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-500 rounded-2xl flex items-center justify-center shadow-md">
                    <FaCheckCircle className="text-white text-lg sm:text-xl" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-green-800">
                      اطلاعات بانکی تایید شده ✅
                    </h3>
                    <p className="text-xs sm:text-sm text-green-600">
                      برداشت به حساب زیر انجام می‌شود
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                  <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-green-100">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">
                      نام بانک:
                    </p>
                    <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                      {bankingInfo.bankName}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-green-100">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">
                      نام صاحب حساب:
                    </p>
                    <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                      {bankingInfo.accountHolderName}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-green-100">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">
                      شماره کارت:
                    </p>
                    <p className="text-sm sm:text-base font-bold text-[#0A1D37] font-mono">
                      {bankingInfo.cardNumber}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-green-100">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">
                      شماره شبا:
                    </p>
                    <p className="text-sm sm:text-base font-bold text-[#0A1D37] font-mono">
                      {bankingInfo.shebaNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Withdraw Form */}
              {!hasInsufficientBalance && (
                <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-sm">
                  <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 lg:space-y-8">
                    {/* Amount Input */}
                    <div>
                      <label className="block text-sm sm:text-base font-bold text-[#0A1D37] mb-3 sm:mb-4">
                        مبلغ برداشت *(تومان)
                      </label>
                      <div className="relative">
                        <FaMoneyBillWave className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500 text-base sm:text-lg" />
                        <input
                          type="number"
                          value={formData.amount}
                          onChange={(e) =>
                            handleInputChange("amount", e.target.value)
                          }
                          className="w-full pr-12 sm:pr-14 pl-4 py-3 sm:py-4 lg:py-5 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all text-sm sm:text-base lg:text-lg font-medium"
                          placeholder="مبلغ برداشت را وارد کنید"
                          min="10000"
                          max={walletBalance}
                          required
                        />
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs sm:text-sm text-gray-600">
                          حداقل: {formatAmount(10000)}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          حداکثر: {formatAmount(walletBalance)}
                        </p>
                      </div>
                      {formData.amount && (
                        <p className="text-xs sm:text-sm text-gray-600 mt-2 font-medium">
                          {parseFloat(formData.amount).toLocaleString("fa-IR")}{" "}
                          تومان
                        </p>
                      )}
                    </div>

                    {/* Predefined Amounts */}
                    <div>
                      <label className="block text-sm sm:text-base font-bold text-[#0A1D37] mb-3 sm:mb-4">
                        انتخاب سریع مبلغ:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                        {predefinedAmounts
                          .filter(
                            (preset) =>
                              preset.value <= walletBalance &&
                              preset.value >= 10000
                          )
                          .map((preset, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() =>
                                handlePredefinedAmount(preset.value)
                              }
                              className={`relative p-3 sm:p-4 text-xs sm:text-sm border-2 rounded-xl sm:rounded-2xl transition-all duration-300 group hover:scale-105 ${
                                Math.abs(
                                  parseFloat(formData.amount) - preset.value
                                ) < 1
                                  ? "bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-500 shadow-lg scale-105"
                                  : "bg-white text-gray-700 border-gray-200 hover:border-red-500 hover:shadow-md"
                              }`}
                            >
                              {preset.popular && (
                                <div className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md animate-pulse">
                                  <FaCheckCircle className="text-white text-xs sm:text-sm" />
                                </div>
                              )}
                              <div className="font-bold mb-1">
                                {preset.label}
                              </div>
                              <div className="text-xs opacity-75">تومان</div>
                            </button>
                          ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm sm:text-base font-bold text-[#0A1D37] mb-3 sm:mb-4">
                        یادداشت (اختیاری)
                      </label>
                      <div className="relative">
                        <FaInfoCircle className="absolute right-4 top-4 text-red-500 text-base sm:text-lg" />
                        <textarea
                          value={formData.notes}
                          onChange={(e) =>
                            handleInputChange("notes", e.target.value)
                          }
                          className="w-full pr-12 sm:pr-14 pl-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all resize-none text-sm sm:text-base"
                          placeholder="یادداشت یا توضیحات اضافی (اختیاری)"
                          rows={4}
                          maxLength={255}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs sm:text-sm text-gray-500">
                          {formData.notes.length}/255 کاراکتر
                        </div>
                        <div
                          className={`text-xs sm:text-sm font-medium ${
                            formData.notes.length > 200
                              ? "text-orange-500"
                              : "text-gray-400"
                          }`}
                        >
                          {255 - formData.notes.length} باقی مانده
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                      <button
                        type="button"
                        onClick={onCancel || (() => router.back())}
                        className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-4 border-2 border-gray-300 text-gray-700 rounded-xl sm:rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium text-sm sm:text-base"
                      >
                        <FaArrowLeft className="text-sm" />
                        <span>بازگشت</span>
                      </button>

                      <button
                        type="submit"
                        disabled={loading || hasInsufficientBalance}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl sm:rounded-2xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-sm sm:text-base"
                      >
                        {loading ? (
                          <>
                            <FaSpinner className="animate-spin text-lg" />
                            <span>در حال پردازش...</span>
                          </>
                        ) : (
                          <>
                            <FaArrowDown className="text-lg" />
                            <span>ثبت درخواست برداشت</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Insufficient Balance Message */}
              {hasInsufficientBalance && (
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 border-2 border-yellow-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center shadow-lg">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
                    <FaExclamationTriangle className="text-white text-2xl sm:text-3xl" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-yellow-800 mb-3 sm:mb-4">
                    موجودی کافی نیست ⚠️
                  </h3>
                  <p className="text-sm sm:text-base text-yellow-600 leading-relaxed">
                    حداقل موجودی مورد نیاز برای برداشت{" "}
                    {formatAmount(10000)} است
                  </p>
                </div>
              )}
            </div>

            {/* Wallet Information Sidebar - Right Side */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6">
              {/* Current Wallet Balance */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-100/50 border-2 border-blue-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-md">
                    <FaWallet className="text-white text-lg sm:text-xl" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-blue-800">
                      موجودی فعلی
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-600">
                      کیف پول شما
                    </p>
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-800">
                  {walletBalance.toLocaleString("fa-IR")}
                </p>
                <p className="text-sm sm:text-base text-blue-600 mt-1">
                  تومان
                </p>
              </div>

              {/* Wallet Statistics */}
              <div className="bg-white border-2 border-gray-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <FaChartLine className="text-[#0A1D37] text-lg sm:text-xl" />
                  <h3 className="text-base sm:text-lg font-bold text-[#0A1D37]">
                    آمار کیف پول
                  </h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl border border-green-100">
                    <div className="flex items-center gap-2">
                      <FaArrowUp className="text-green-600 text-sm" />
                      <span className="text-gray-700 text-xs sm:text-sm font-medium">
                        کل واریزها:
                      </span>
                    </div>
                    <span className="font-bold text-green-600 text-sm sm:text-base">
                      {walletStats.totalIncomes.toLocaleString("fa-IR")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl border border-red-100">
                    <div className="flex items-center gap-2">
                      <FaArrowDown className="text-red-600 text-sm" />
                      <span className="text-gray-700 text-xs sm:text-sm font-medium">
                        کل برداشت‌ها:
                      </span>
                    </div>
                    <span className="font-bold text-red-600 text-sm sm:text-base">
                      {walletStats.totalOutcomes.toLocaleString("fa-IR")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-yellow-600 text-sm" />
                      <span className="text-gray-700 text-xs sm:text-sm font-medium">
                        در انتظار تایید:
                      </span>
                    </div>
                    <span className="font-bold text-yellow-600 text-sm sm:text-base">
                      {walletStats.pendingIncomes.toLocaleString("fa-IR")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white border-2 border-gray-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <FaHistory className="text-[#0A1D37] text-lg sm:text-xl" />
                  <h3 className="text-base sm:text-lg font-bold text-[#0A1D37]">
                    آخرین تراکنش‌ها
                  </h3>
                </div>
                {walletStats.recentTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {walletStats.recentTransactions
                      .slice(0, 3)
                      .map((transaction, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100"
                        >
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            {transaction.type === "income" ? (
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FaArrowUp className="text-green-600 text-sm sm:text-base" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FaArrowDown className="text-red-600 text-sm sm:text-base" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              {/* <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                {transaction.description || transaction.tag}
                              </p> */}
                              <p className="text-xs text-gray-500">
                                {new Date(transaction.date).toLocaleDateString(
                                  "fa-IR"
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="text-left flex-shrink-0 mr-2">
                            <p
                              className={`text-xs sm:text-sm font-bold ${
                                transaction.type === "income"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.type === "income" ? "+" : "-"}
                              {transaction.amount.toLocaleString("fa-IR")}
                            </p>
                            <p className="text-xs text-gray-500">
                              {transaction.status === "verified"
                                ? "تایید شده"
                                : transaction.status === "pending"
                                ? "در انتظار"
                                : "رد شده"}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <FaHistory className="text-gray-400 text-xl sm:text-2xl" />
                    </div>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      تراکنشی وجود ندارد
                    </p>
                  </div>
                )}
              </div>

              {/* Processing Info */}
              <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <FaClock className="text-white text-base sm:text-lg" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-orange-800 text-sm sm:text-base mb-1 sm:mb-2">
                      زمان پردازش  
                    </p>
                    <p className="text-xs sm:text-sm text-orange-600 leading-relaxed">
                      برداشت پس از تایید، حداکثر ۳ روز کاری پردازش می‌شود
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <FaShieldAlt className="text-white text-base sm:text-lg" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-blue-800 text-sm sm:text-base mb-1 sm:mb-2">
                      برداشت امن  
                    </p>
                    <p className="text-xs sm:text-sm text-blue-600 leading-relaxed">
                      تمامی برداشت‌ها به حساب بانکی تایید شده شما انجام می‌شود
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawComponent;