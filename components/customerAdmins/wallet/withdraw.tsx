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
    { label: "10 هزار تومان", value: 10000, popular: false },
    { label: "25 هزار تومان", value: 25000, popular: true },
    { label: "50 هزار تومان", value: 50000, popular: true },
    { label: "100 هزار تومان", value: 100000, popular: true },
    { label: "250 هزار تومان", value: 250000, popular: false },
    { label: "500 هزار تومان", value: 500000, popular: false },
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

        console.log("Banking API Response:", data); // Debug log

        if (
          data.bankingData &&
          Array.isArray(data.bankingData) &&
          data.bankingData.length > 0
        ) {
          // Get the first user (should be current user)
          const currentUser = data.bankingData[0];

          if (
            currentUser.bankingInfo &&
            Array.isArray(currentUser.bankingInfo) &&
            currentUser.bankingInfo.length > 0
          ) {
            // Find the first accepted banking info, or the first one if none are accepted
            const acceptedBanking = currentUser.bankingInfo.find(
              (banking: BankingInfo) => banking.status === "accepted"
            );
            const bankingToUse = acceptedBanking || currentUser.bankingInfo[0];
            console.log("Selected banking info:", bankingToUse); // Debug log
            setBankingInfo(bankingToUse);
          } else {
            console.log("No banking info in user data"); // Debug log
            setBankingInfo(null);
          }
        } else {
          console.log("No banking data found:", data); // Debug log
          setBankingInfo(null);
        }
      } catch (error) {
        console.error("Error fetching banking info:", error);
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

    const minAmount = 10000; // 10,000 Toman minimum
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

        // Reset form
        setFormData({ amount: "", notes: "" });

        // Call success callback if provided
        if (onSuccess) onSuccess();
      } else {
        showToast.error(data.error || "خطا در ثبت درخواست برداشت");
      }
    } catch (error) {
      console.error("Withdraw request error:", error);
      showToast.error("خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (userLoading || bankingInfoLoading) {
    return (
      <div className="flex items-center justify-center p-8" dir="rtl">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#FF7A00] mx-auto mb-4" />
          <p className="text-gray-600">در حال بارگذاری...</p>
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

  // Check if wallet balance is insufficient
  const hasInsufficientBalance = walletBalance < 10000;

  // Banking verification status component
  const renderBankingStatus = () => {
    if (!bankingInfo) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUniversity className="text-white text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-red-800 mb-2">
            اطلاعات بانکی ثبت نشده
          </h3>
          <p className="text-red-600 mb-4">
            برای انجام برداشت از کیف پول، ابتدا اطلاعات بانکی خود را تکمیل کنید
          </p>
          <button
            onClick={() => router.push("/complete-profile")}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <FaEdit />
            تکمیل اطلاعات بانکی
          </button>
        </div>
      );
    }

    if (bankingInfo.status === "pending_verification") {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaClock className="text-white text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-yellow-800 mb-2">
            در انتظار تایید
          </h3>
          <p className="text-yellow-600 mb-4">
            اطلاعات بانکی شما در حال بررسی است. لطفاً منتظر تایید مدیر باشید
          </p>
          <div className="text-sm text-yellow-700 bg-yellow-100 rounded-lg p-3">
            <p>
              <strong>بانک:</strong> {bankingInfo.bankName}
            </p>
            <p>
              <strong>شماره کارت:</strong> {bankingInfo.cardNumber}
            </p>
            <p>
              <strong>شماره شبا:</strong> {bankingInfo.shebaNumber}
            </p>
          </div>
        </div>
      );
    }

    if (bankingInfo.status === "rejected") {
      return (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTimesCircle className="text-white text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-red-800 mb-2">
            اطلاعات رد شده
          </h3>
          <p className="text-red-600 mb-4">
            اطلاعات بانکی شما توسط مدیر رد شده است. لطفاً اطلاعات صحیح را وارد
            کنید
          </p>
          {bankingInfo.rejectionNotes && (
            <div className="text-sm text-red-700 bg-red-100 rounded-lg p-3 mb-4">
              <p>
                <strong>دلیل رد:</strong> {bankingInfo.rejectionNotes}
              </p>
            </div>
          )}
          <button
            onClick={() => router.push("/complete-profile")}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <FaEdit />
            ویرایش اطلاعات بانکی
          </button>
        </div>
      );
    }

    return null; // Banking info is accepted, don't show status
  };

  // Check if banking info is approved
  const isBankingApproved = bankingInfo && bankingInfo.status === "accepted";

  return (
    <div className="p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Banking Status Check */}
        {!isBankingApproved && (
          <div className="mb-6">{renderBankingStatus()}</div>
        )}

        {/* Main Content - Only show if banking is approved */}
        {isBankingApproved && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form - Left Side */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaArrowDown className="text-white text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-[#0A1D37] mb-2">
                  درخواست برداشت
                </h2>
                <p className="text-gray-600">برداشت از موجودی کیف پول</p>
              </div>

              {/* Current Balance Display */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <FaWallet className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">
                        موجودی قابل برداشت
                      </p>
                      <p className="text-2xl font-bold text-blue-800">
                        {formatAmount(walletBalance)}
                      </p>
                    </div>
                  </div>
                  {hasInsufficientBalance && (
                    <div className="text-right">
                      <FaExclamationTriangle className="text-yellow-500 text-2xl" />
                      <p className="text-xs text-yellow-600 mt-1">
                        موجودی کافی نیست
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Banking Info Display */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-800">
                      اطلاعات بانکی تایید شده
                    </h3>
                    <p className="text-sm text-green-600">
                      برداشت به حساب زیر انجام می‌شود
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-gray-600">نام بانک:</p>
                    <p className="font-semibold">{bankingInfo.bankName}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-gray-600">نام صاحب حساب:</p>
                    <p className="font-semibold">
                      {bankingInfo.accountHolderName}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-gray-600">شماره کارت:</p>
                    <p className="font-semibold font-mono">
                      {bankingInfo.cardNumber}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-gray-600">شماره شبا:</p>
                    <p className="font-semibold font-mono">
                      {bankingInfo.shebaNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Withdraw Form */}
              {!hasInsufficientBalance && (
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Amount Input */}
                    <div>
                      <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                        مبلغ برداشت *
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
                          placeholder="مبلغ برداشت را وارد کنید"
                          min="10000"
                          max={walletBalance}
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        حداقل: {formatAmount(10000)} - حداکثر:{" "}
                        {formatAmount(walletBalance)}
                      </p>
                    </div>

                    {/* Predefined Amounts */}
                    <div>
                      <label className="block text-sm font-medium text-[#0A1D37] mb-3">
                        انتخاب سریع مبلغ:
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                              className={`relative p-3 text-sm border rounded-lg transition-all duration-200 ${
                                Math.abs(
                                  parseFloat(formData.amount) - preset.value
                                ) < 1
                                  ? "bg-red-500 text-white border-red-500 shadow-md"
                                  : "bg-white text-gray-700 border-gray-200 hover:border-red-500 hover:bg-red-50"
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

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                        یادداشت (اختیاری)
                      </label>
                      <div className="relative">
                        <FaInfoCircle className="absolute right-4 top-4 text-[#FF7A00]" />
                        <textarea
                          value={formData.notes}
                          onChange={(e) =>
                            handleInputChange("notes", e.target.value)
                          }
                          className="w-full pr-12 pl-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all resize-none"
                          placeholder="یادداشت یا توضیحات اضافی (اختیاری)"
                          rows={3}
                          maxLength={255}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formData.notes.length}/255 کاراکتر
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
                        disabled={loading || hasInsufficientBalance}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:shadow-lg disabled:opacity-50 transition-all"
                      >
                        {loading ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            در حال پردازش...
                          </>
                        ) : (
                          <>
                            <FaArrowDown className="text-sm" />
                            ثبت درخواست برداشت
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Insufficient Balance Message */}
              {hasInsufficientBalance && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
                  <FaExclamationTriangle className="text-4xl text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-yellow-800 mb-2">
                    موجودی کافی نیست
                  </h3>
                  <p className="text-yellow-600">
                    حداقل موجودی مورد نیاز برای برداشت {formatAmount(10000)} است
                  </p>
                </div>
              )}
            </div>

            {/* Wallet Information Sidebar - Right Side */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Current Wallet Balance */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <FaWallet className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-blue-800">موجودی فعلی</h3>
                      <p className="text-sm text-blue-600">کیف پول شما</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-blue-800">
                    {formatAmount(walletBalance)}
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
                      <span className="font-semibold text-green-600">
                        {formatAmount(walletStats.totalIncomes)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">
                        کل برداشت‌ها:
                      </span>
                      <span className="font-semibold text-red-600">
                        {formatAmount(walletStats.totalOutcomes)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">
                        در انتظار تایید:
                      </span>
                      <span className="font-semibold text-yellow-600">
                        {formatAmount(walletStats.pendingIncomes)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FaHistory className="text-[#FF7A00]" />
                    <h3 className="font-bold text-[#0A1D37]">
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
                                  <span className="text-red-600 text-xs">
                                    -
                                  </span>
                                </div>
                              )}
                              <div>
                                <p className="text-xs font-medium">
                                  {transaction.description || transaction.tag}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(
                                    transaction.date
                                  ).toLocaleDateString("fa-IR")}
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

                {/* Processing Info */}
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <FaClock className="text-white text-sm" />
                    </div>
                    <div>
                      <p className="font-medium text-orange-800 text-sm">
                        زمان پردازش
                      </p>
                      <p className="text-xs text-orange-600">
                        برداشت پس از تایید، حداکثر ۳ روز کاری پردازش می‌شود
                      </p>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <FaShieldAlt className="text-white text-sm" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-800 text-sm">
                        برداشت امن
                      </p>
                      <p className="text-xs text-blue-600">
                        تمامی برداشت‌ها به حساب بانکی تایید شده شما انجام می‌شود
                      </p>
                    </div>
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
