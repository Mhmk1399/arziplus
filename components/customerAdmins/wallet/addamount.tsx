"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { showToast } from "@/utilities/toast";
import {
  FaCreditCard,
  FaSpinner,
  FaMoneyBillWave,
  FaWallet,
  FaInfoCircle,
  FaArrowLeft,
  FaShieldAlt,
  FaCheckCircle,
  FaClock,
  FaHistory,
  FaChartLine,
  FaExclamationTriangle,
  FaUser,
  FaArrowUp,
  FaArrowDown,
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

interface AddAmountComponentProps {
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

const AddAmountComponent: React.FC<AddAmountComponentProps> = ({
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
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [formData, setFormData] = useState({
    amount: "",
    description: "شارژ کیف پول",
    serviceId: "",
    orderId: "",
    currency: "IRT",
  });

  // Predefined amounts (in Toman)
  const predefinedAmounts = [
    { label: "10 هزار", value: 10000, popular: false },
    { label: "25 هزار", value: 25000, popular: false },
    { label: "50 هزار", value: 50000, popular: true },
    { label: "100 هزار", value: 100000, popular: true },
    { label: "250 هزار", value: 250000, popular: true },
    { label: "500 هزار", value: 500000, popular: false },
    { label: "1 میلیون", value: 1000000, popular: false },
    { label: "2 میلیون", value: 2000000, popular: false },
  ];

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePredefinedAmount = (amount: number) => {
    // All amounts are in Toman (IRT)
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

    // Prevent multiple rapid submissions (5 second cooldown)
    const now = Date.now();
    if (now - lastSubmitTime < 5000) {
      showToast.warning("لطفاً کمی صبر کنید و دوباره تلاش کنید");
      return;
    }
    setLastSubmitTime(now);

    if (!currentUser) {
      showToast.error("لطفاً وارد حساب کاربری خود شوید");
      return;
    }

    const amount = parseFloat(formData.amount.toString());

    if (!amount || amount <= 0) {
      showToast.error("لطفاً مبلغ معتبر وارد کنید");
      return;
    }

    const minAmount = 1; // 1 toman minimum
    if (amount < minAmount) {
      showToast.error(`حداقل مبلغ پرداخت ${formatAmount(minAmount)} است`);
      return;
    }

    if (!formData.description.trim()) {
      showToast.error("لطفاً توضیحات پرداخت را وارد کنید");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch("/api/payment/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          amount: amount, // Send in Toman directly
          orderId: `WALLET-${Date.now()}`, // Set wallet order ID
          metadata: {
            type: "wallet_charge",
            description: "شارژ کیف پول"
          }
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Check if this is a duplicate payment
        if (data.data.duplicate) {
          if (data.data.redirectTo) {
            // Already verified payment, redirect to success page
            showToast.info("پرداخت قبلاً انجام شده است");
            if (onSuccess) onSuccess();
            router.push(data.data.redirectTo);
            return;
          } else {
            // Pending duplicate, show warning and redirect to existing payment
            showToast.warning(
              "درخواست پرداخت تکراری - به درگاه موجود منتقل می‌شوید"
            );
          }
        } else {
          showToast.success("درخواست پرداخت با موفقیت ایجاد شد");
        }

        // Call success callback if provided
        if (onSuccess) onSuccess();

        // Redirect to ZarinPal (or existing payment URL)
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
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (userLoading) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center p-4"
        dir="rtl"
      >
        <div className="text-center">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] rounded-2xl animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaSpinner className="animate-spin text-2xl sm:text-3xl text-white" />
            </div>
          </div>
          <p className="text-base sm:text-lg font-medium text-gray-700 mb-2">
            در حال بررسی احراز هویت...
          </p>
          <p className="text-xs sm:text-sm text-gray-500">لطفاً صبر کنید</p>
        </div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!isLoggedIn || !currentUser) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center p-4"
        dir="rtl"
      >
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
            className="w-full px-6 py-3 sm:py-4 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white rounded-xl sm:rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 font-bold"
          >
            ورود / ثبت نام
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-3 sm:p-4 lg:p-6"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Form - Left Side */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                <FaCreditCard className="text-white text-xl sm:text-2xl lg:text-3xl" />
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0A1D37] mb-2 sm:mb-3">
                شارژ کیف پول  
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                پرداخت امن از طریق درگاه زرین‌پال
              </p>
            </div>

            {/* User Info */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-sm">
              <div className="flex items-center gap-3 sm:gap-4">
            
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#0A1D37] text-sm sm:text-base lg:text-lg truncate">
                    {currentUser.firstName && currentUser.lastName
                      ? `${currentUser.firstName} ${currentUser.lastName}`
                      : "کاربر محترم"}
                  </p>
                  {currentUser.phone && (
                    <p className="text-xs sm:text-sm text-gray-600">
                      {currentUser.phone}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <FaUser className="text-gray-400 text-lg sm:text-xl" />
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm">
              <form
                onSubmit={handleSubmit}
                className="space-y-5 sm:space-y-6 lg:space-y-8"
              >
                {/* Amount Input */}
                <div>
                  <label className="block text-sm sm:text-base font-bold text-[#0A1D37] mb-3 sm:mb-4">
                    مبلغ شارژ *(تومان)
                  </label>
                  <div className="relative">
                    <FaMoneyBillWave className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0A1D37] text-base sm:text-lg" />
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) =>
                        handleInputChange("amount", e.target.value)
                      }
                      className="w-full pr-12 sm:pr-14 pl-4 py-3 sm:py-4 lg:py-5 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#0A1D37]/30 focus:border-[#0A1D37] transition-all text-sm sm:text-base lg:text-lg font-medium"
                      placeholder="مبلغ را وارد کنید"
                      min="1"
                      required
                    />
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
                    {predefinedAmounts.map((preset, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handlePredefinedAmount(preset.value)}
                        className={`relative p-3 sm:p-4 text-xs sm:text-sm border-2 rounded-xl sm:rounded-2xl transition-all duration-300 group hover:scale-105 ${
                          Math.abs(parseFloat(formData.amount) - preset.value) <
                          1
                            ? "bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white border-[#0A1D37] shadow-lg scale-105"
                            : "bg-white text-gray-700 border-gray-200 hover:border-[#0A1D37] hover:shadow-md"
                        }`}
                      >
                        {preset.popular && (
                          <div className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md animate-pulse">
                            <FaCheckCircle className="text-white text-xs sm:text-sm" />
                          </div>
                        )}
                        <div className="font-bold mb-1">{preset.label}</div>
                        <div className="text-xs opacity-75">تومان</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm sm:text-base font-bold text-[#0A1D37] mb-3 sm:mb-4">
                    توضیحات پرداخت *
                  </label>
                  <div className="relative">
                    <FaInfoCircle className="absolute right-4 top-4 text-[#0A1D37] text-base sm:text-lg" />
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      className="w-full pr-12 sm:pr-14 pl-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#0A1D37]/30 focus:border-[#0A1D37] transition-all resize-none text-sm sm:text-base"
                      placeholder="توضیحات مربوط به شارژ کیف پول"
                      rows={4}
                      maxLength={255}
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs sm:text-sm text-gray-500">
                      {formData.description.length}/255 کاراکتر
                    </div>
                    <div
                      className={`text-xs sm:text-sm font-medium ${
                        formData.description.length > 200
                          ? "text-orange-500"
                          : "text-gray-400"
                      }`}
                    >
                      {255 - formData.description.length} باقی مانده
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
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white rounded-xl sm:rounded-2xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-sm sm:text-base"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin text-lg" />
                        <span>در حال پردازش...</span>
                      </>
                    ) : (
                      <>
                        <FaWallet className="text-lg" />
                        <span>شارژ کیف پول</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Wallet Information Sidebar - Right Side */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Current Wallet Balance */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-500 rounded-2xl flex items-center justify-center shadow-md">
                  <FaWallet className="text-white text-lg sm:text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-green-800 text-base sm:text-lg">
                    موجودی فعلی
                  </h3>
                  <p className="text-xs sm:text-sm text-green-600">
                    کیف پول شما
                  </p>
                </div>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-800">
                {walletBalance.toLocaleString("fa-IR")}
              </p>
              <p className="text-sm sm:text-base text-green-600 mt-1">تومان</p>
            </div>

            {/* Wallet Statistics */}
            <div className="bg-white border-2 border-gray-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <FaChartLine className="text-[#0A1D37] text-lg sm:text-xl" />
                <h3 className="font-bold text-[#0A1D37] text-base sm:text-lg">
                  آمار کیف پول
                </h3>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2">
                    <FaArrowUp className="text-blue-600 text-sm" />
                    <span className="text-gray-700 text-xs sm:text-sm font-medium">
                      کل واریزها:
                    </span>
                  </div>
                  <span className="font-bold text-blue-600 text-sm sm:text-base">
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
                <h3 className="font-bold text-[#0A1D37] text-base sm:text-lg">
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
                            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                              {transaction.description || transaction.tag}
                            </p>
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

            {/* Security Notice */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <FaShieldAlt className="text-white text-base sm:text-lg" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-blue-800 text-sm sm:text-base mb-1 sm:mb-2">
                    پرداخت امن  
                  </p>
                  <p className="text-xs sm:text-sm text-blue-600 leading-relaxed">
                    تمامی پرداخت‌ها از طریق درگاه امن زرین‌پال انجام می‌شود
                  </p>
                </div>
              </div>
            </div>

            {/* Processing Info */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <FaClock className="text-white text-base sm:text-lg" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-yellow-800 text-sm sm:text-base mb-1 sm:mb-2">
                    زمان پردازش  
                  </p>
                  <p className="text-xs sm:text-sm text-yellow-600 leading-relaxed">
                    شارژ کیف پول پس از پرداخت موفق، فوراً انجام می‌شود
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAmountComponent;
