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
    { label: "10 هزار تومان", value: 10000, popular: false },
    { label: "25 هزار تومان", value: 25000, popular: false },
    { label: "50 هزار تومان", value: 50000, popular: true },
    { label: "100 هزار تومان", value: 100000, popular: true },
    { label: "250 هزار تومان", value: 250000, popular: true },
    { label: "500 هزار تومان", value: 500000, popular: false },
    { label: "1 میلیون تومان", value: 1000000, popular: false },
    { label: "2 میلیون تومان", value: 2000000, popular: false },
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
      console.error("Payment request error:", error);
      showToast.error("خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (userLoading) {
    return (
      <div className="flex items-center justify-center p-8" dir="rtl">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#FF7A00] mx-auto mb-4" />
          <p className="text-gray-600">در حال بررسی احراز هویت...</p>
        </div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!isLoggedIn || !currentUser) {
    return (
      <div className="text-center p-8" dir="rtl">
        <FaExclamationTriangle className="text-4xl text-yellow-500 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">
          برای ادامه لطفاً وارد حساب کاربری خود شوید
        </p>
        <button
          onClick={() => router.push("/auth/sms")}
          className="px-6 py-3 bg-[#FF7A00] text-white rounded-lg hover:bg-[#e56900] transition-colors"
        >
          ورود / ثبت نام
        </button>
      </div>
    );
  }

  return (
    <div className="p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form - Left Side */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCreditCard className="text-white text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-[#0A1D37] mb-2">
                شارژ کیف پول
              </h2>
              <p className="text-gray-600">پرداخت امن از طریق درگاه زرین‌پال</p>
            </div>

            {/* User Info */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-[#FF7A00]/20 to-[#4DBFF0]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#FF7A00] font-bold">
                    {(currentUser.firstName || "ک").charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-[#0A1D37]">
                    {currentUser.firstName && currentUser.lastName
                      ? `${currentUser.firstName} ${currentUser.lastName}`
                      : "کاربر محترم"}
                  </p>
                  {currentUser.phone && (
                    <p className="text-sm text-gray-600">{currentUser.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                    مبلغ شارژ *(تومان)
                  </label>
                  <div className="relative">
                    <FaMoneyBillWave className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#FF7A00]" />
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) =>
                        handleInputChange("amount", e.target.value)
                      }
                      className="w-full pr-12 pl-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
                      placeholder="مبلغ را وارد کنید"
                      min="1"
                      required
                    />
                  </div>
                </div>

                {/* Predefined Amounts */}
                <div>
                  <label className="block text-sm font-medium text-[#0A1D37] mb-3">
                    انتخاب سریع مبلغ:
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {predefinedAmounts.map((preset, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handlePredefinedAmount(preset.value)}
                        className={`relative p-3 text-sm border rounded-lg transition-all duration-200 ${
                          Math.abs(parseFloat(formData.amount) - preset.value) <
                          1
                            ? "bg-[#FF7A00] text-white border-[#FF7A00] shadow-md"
                            : "bg-white text-gray-700 border-gray-200 hover:border-[#FF7A00] hover:bg-[#FF7A00]/5"
                        }`}
                      >
                        {preset.popular && (
                          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <FaCheckCircle className="text-white text-xs" />
                          </div>
                        )}
                        <div className="font-medium">{preset.label}</div>
                        <div className="text-xs opacity-75">
                          {formatAmount(preset.value)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                    توضیحات پرداخت *
                  </label>
                  <div className="relative">
                    <FaInfoCircle className="absolute right-4 top-4 text-[#FF7A00]" />
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      className="w-full pr-12 pl-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all resize-none"
                      placeholder="توضیحات مربوط به شارژ کیف پول"
                      rows={3}
                      maxLength={255}
                      required
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.description.length}/255 کاراکتر
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onCancel || (() => router.back())}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <FaArrowLeft className="text-sm" />
                    بازگشت
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] text-white rounded-xl hover:shadow-lg disabled:opacity-50 transition-all"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        در حال پردازش...
                      </>
                    ) : (
                      <>
                        <FaWallet className="text-sm" />
                        شارژ کیف پول
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Wallet Information Sidebar - Right Side */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Current Wallet Balance */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <FaWallet className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-800">موجودی فعلی</h3>
                    <p className="text-sm text-green-600">کیف پول شما</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-green-800">
                  {walletBalance.toLocaleString("fa-IR")} تومان
                </p>
              </div>

              {/* Wallet Statistics */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FaChartLine className="text-[#FF7A00]" />
                  <h3 className="font-bold text-[#0A1D37]">آمار کیف پول</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">کل واریزها:</span>
                    <span className="font-semibold text-blue-600">
                      {walletStats.totalIncomes.toLocaleString("fa-IR")} تومان
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">کل برداشت‌ها:</span>
                    <span className="font-semibold text-red-600">
                      {walletStats.totalOutcomes.toLocaleString("fa-IR")} تومان
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">
                      در انتظار تایید:
                    </span>
                    <span className="font-semibold text-yellow-600">
                      {walletStats.pendingIncomes.toLocaleString("fa-IR")} تومان
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FaHistory className="text-[#FF7A00]" />
                  <h3 className="font-bold text-[#0A1D37]">آخرین تراکنش‌ها</h3>
                </div>
                {walletStats.recentTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {walletStats.recentTransactions
                      .slice(0, 3)
                      .map((transaction, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            {transaction.type === "income" ? (
                              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-600 text-xs">
                                  +
                                </span>
                              </div>
                            ) : (
                              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-red-600 text-xs">-</span>
                              </div>
                            )}
                            <div>
                              <p className="text-xs font-medium">
                                {transaction.description || transaction.tag}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(transaction.date).toLocaleDateString(
                                  "fa-IR"
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="text-left">
                            <p
                              className={`text-xs font-bold ${
                                transaction.type === "income"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.type === "income" ? "+" : "-"}
                              {transaction.amount.toLocaleString("fa-IR")}
                            </p>
                            <p className="text-xs text-gray-500">
                              {transaction.status}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4 text-sm">
                    تراکنشی وجود ندارد
                  </p>
                )}
              </div>

              {/* Security Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <FaShieldAlt className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-800 text-sm">
                      پرداخت امن
                    </p>
                    <p className="text-xs text-blue-600">
                      تمامی پرداخت‌ها از طریق درگاه امن زرین‌پال انجام می‌شود
                    </p>
                  </div>
                </div>
              </div>

              {/* Processing Info */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <FaClock className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="font-medium text-yellow-800 text-sm">
                      زمان پردازش
                    </p>
                    <p className="text-xs text-yellow-600">
                      شارژ کیف پول پس از پرداخت موفق، فوراً انجام می‌شود
                    </p>
                  </div>
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
