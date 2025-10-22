"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  FaCheckCircle,
  FaWallet,
  FaCalendarAlt,
  FaCopy,
  FaDownload,
  FaHome,
  FaSpinner,
  FaPrint,
} from "react-icons/fa";
import { showToast } from "@/utilities/toast";

const WalletPaymentSuccessPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    user: currentUser,
    isLoggedIn,
    loading: userLoading,
  } = useCurrentUser();

  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<{
    orderId: string;
    amount: number;
    description: string;
    type: string;
    timestamp: string;
  } | null>(null);

  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const type = searchParams.get("type");

  useEffect(() => {
    // Wait for user loading to complete before checking authentication
    if (userLoading) return;

    if (!isLoggedIn) {
      router.push("/auth/sms");
      return;
    }

    // Debug logging
    console.log("Wallet Success page params:", {
      orderId,
      amount,
      type,
    });

    if (!orderId || !amount) {
      console.log("Missing payment data, redirecting to dashboard");
      router.push("/dashboard");
      return;
    }

    // Set payment data
    setPaymentData({
      orderId,
      amount: parseInt(amount),
      description: getDescriptionByType(type || "unknown"),
      type: type || "unknown",
      timestamp: new Date().toISOString(),
    });

    setLoading(false);

    // Show success message
    showToast.success("پرداخت از کیف پول با موفقیت انجام شد");
  }, [orderId, amount, type, isLoggedIn, userLoading, router]);

  const getDescriptionByType = (type: string): string => {
    switch (type) {
      case "lottery":
        return "ثبت‌نام در قرعه‌کشی";
      case "hozori":
        return "رزرو وقت حضوری";
      case "service":
        return "پرداخت سرویس";
      default:
        return "پرداخت از کیف پول";
    }
  };

  const getTypeTitle = (type: string): string => {
    switch (type) {
      case "lottery":
        return "ثبت‌نام قرعه‌کشی";
      case "hozori":
        return "رزرو وقت حضوری";
      case "service":
        return "پرداخت سرویس";
      default:
        return "پرداخت";
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast.success(`${label} کپی شد`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const generateReceipt = () => {
    if (!paymentData) return;

    const receiptContent = `
رسید پرداخت آرزی پلاس (کیف پول)
------------------------
نوع تراکنش: ${paymentData.description}
مبلغ: ${paymentData.amount.toLocaleString("fa-IR")} تومان
شماره سفارش: ${paymentData.orderId}
تاریخ: ${formatDate(paymentData.timestamp)}
وضعیت: پرداخت شده
روش پرداخت: کیف پول
------------------------
`;

    const blob = new Blob([receiptContent], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wallet-receipt-${paymentData.orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printReceipt = () => {
    if (!paymentData) return;

    const printContent = `
      <div style="font-family: Arial, sans-serif; direction: rtl; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0A1D37;">آرزی پلاس</h1>
          <h2>رسید پرداخت (کیف پول)</h2>
        </div>
        <div style="border: 2px solid #ddd; padding: 20px; border-radius: 10px;">
          <p><strong>نوع تراکنش:</strong> ${paymentData.description}</p>
          <p><strong>مبلغ:</strong> ${paymentData.amount.toLocaleString(
            "fa-IR"
          )} تومان</p>
          <p><strong>شماره سفارش:</strong> ${paymentData.orderId}</p>
          <p><strong>تاریخ:</strong> ${formatDate(paymentData.timestamp)}</p>
          <p><strong>وضعیت:</strong> پرداخت شده</p>
          <p><strong>روش پرداخت:</strong> کیف پول</p>
        </div>
      </div>
    `;

    const printWindow = window.open("", "", "width=600,height=400");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Show loading while checking authentication
  if (userLoading) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#0A1D37] mx-auto mb-4" />
          <p className="text-gray-600">در حال بررسی احراز هویت...</p>
        </div>
      </div>
    );
  }

  // Redirect if not logged in (after loading is complete)
  if (!isLoggedIn || !currentUser) {
    return null;
  }

  if (loading || !paymentData) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#0A1D37] mx-auto mb-4" />
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-bounce">
            <FaCheckCircle className="text-5xl text-green-500" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0A1D37] mb-2">
            پرداخت موفق! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            {getTypeTitle(paymentData.type)} شما با موفقیت انجام شد
          </p>
        </div>

        {/* Payment Details Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaWallet className="text-3xl text-white" />
                <div>
                  <h2 className="text-xl font-bold text-white">
                    جزئیات پرداخت
                  </h2>
                  <p className="text-blue-100 text-sm">پرداخت از کیف پول</p>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-white font-bold text-lg">
                  {paymentData.amount.toLocaleString("fa-IR")} تومان
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-4">
            {/* Order ID */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaWallet className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">شماره سفارش</p>
                  <p className="font-bold text-[#0A1D37]">
                    {paymentData.orderId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(paymentData.orderId, "شماره سفارش")}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <FaCopy className="text-gray-500" />
              </button>
            </div>

            {/* Amount */}
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-xl">💰</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">مبلغ پرداختی</p>
                  <p className="font-bold text-green-600 text-lg">
                    {paymentData.amount.toLocaleString("fa-IR")} تومان
                  </p>
                </div>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaCalendarAlt className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">تاریخ و زمان</p>
                  <p className="font-bold text-[#0A1D37]">
                    {formatDate(paymentData.timestamp)}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 text-xl">📝</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">توضیحات</p>
                  <p className="font-bold text-[#0A1D37]">
                    {paymentData.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaWallet className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">روش پرداخت</p>
                  <p className="font-bold text-[#0A1D37]">کیف پول</p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border-2 border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaCheckCircle className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">وضعیت پرداخت</p>
                  <p className="font-bold text-green-600">موفق</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <button
            onClick={printReceipt}
            className="flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all shadow-md"
          >
            <FaPrint />
            چاپ رسید
          </button>

          <button
            onClick={generateReceipt}
            className="flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all shadow-md"
          >
            <FaDownload />
            دانلود رسید
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
          >
            <FaHome />
            بازگشت به داشبورد
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border-r-4 border-blue-500 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-blue-500 text-xl mt-1">ℹ️</div>
            <div>
              <h3 className="font-bold text-blue-900 mb-1">نکات مهم</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• رسید پرداخت به ایمیل شما ارسال خواهد شد</li>
                <li>• می‌توانید تاریخچه تراکنش‌ها را در داشبورد مشاهده کنید</li>
                <li>
                  • در صورت بروز هرگونه مشکل با پشتیبانی تماس بگیرید
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPaymentSuccessPage;
