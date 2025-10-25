"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  FaCheckCircle,
  FaCreditCard,
  FaCalendarAlt,
  FaCopy,
  FaDownload,
  FaHome,
  FaReceipt,
  FaSpinner,
  FaPrint,
} from "react-icons/fa";
import { showToast } from "@/utilities/toast";

 

interface ordercreation {
  type: string;
  requestNumber: number;
  amount: number;
}

interface PaymentDetails {
  _id: string;
  hozoriData: string;
  authority: string;
  amount: number;
  currency: "IRR" | "IRT";
  description: string;
  status: "pending" | "paid" | "verified" | "failed" | "cancelled";
  zarinpalResponse?: {
    refId?: string;
    cardHash?: string;
    cardPan?: string;
    feeType?: string;
    fee?: number;
  };
  createdAt: string;
  verifiedAt?: string;
  user?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  lotteryData: string;
}

const PaymentSuccessPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    user: currentUser,
    isLoggedIn,
    loading: userLoading,
  } = useCurrentUser();

  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [verifying, setVerifying] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [orderCreated, setOrderCreated] = useState<ordercreation | null>(null);

  const authority = searchParams.get("Authority");
  const status = searchParams.get("Status");
  const paymentType = searchParams.get("type");

  useEffect(() => {
    // Wait for user loading to complete before checking authentication
    if (userLoading) return;

    if (!isLoggedIn) {
      router.push("/auth/sms");
      return;
    }

    // Debug logging
    console.log("Success page params:", {
      authority,
      status,
      type: paymentType,
    });

    if (!authority) {
      console.log("No authority found, redirecting to failed");
      router.push("/payment/failed");
      return;
    }

    // Special handling for different payment types - redirect to dashboard
    if (
      paymentType === "lottery" ||
      paymentType === "wallet" ||
      paymentType === "service" ||
      paymentType === "hozori"
    ) {
      console.log(`${paymentType} payment detected, redirecting to dashboard`);
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000); // Show success message for 3 seconds then redirect
    }

    // Don't require status to be exactly 'OK' - just check if authority exists
    // The status will be determined by fetching payment details from our database
    fetchPaymentDetails();
  }, [authority, status, paymentType, isLoggedIn, userLoading, router]);

  const fetchPaymentDetails = async () => {
    if (!authority) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/payment/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ authority }),
      });

      const data = await response.json();

      console.log("Payment details response:", data);

      if (response.ok && data.success && data.data) {
        console.log("Payment found:", data.data.status, data.data.authority);
        setPaymentDetails(data.data);

        // Check if this is actually a failed payment
        if (data.data.status === "failed" || data.data.status === "cancelled") {
          console.log("Payment failed, redirecting to failed page");
          router.push(`/payment/failed?Authority=${authority}`);
          return;
        }

        // Auto-verify if payment is in 'paid' status
        if (data.data.status === "paid") {
          await verifyPayment();
        } else if (data.data.status === "verified") {
          // Payment already verified, process the order
          await processOrder(data.data.authority);
        }
      } else {
        console.log("Failed to get payment details:", data);
        showToast.error("خطا در دریافت جزئیات پرداخت");
        router.push("/payment/failed");
      }
    } catch (error) {
      console.log("Error fetching payment details:", error);
      showToast.error("خطا در اتصال به سرور");
      router.push("/payment/failed");
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async () => {
    if (!authority) return;

    setVerifying(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/payment/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ authority }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPaymentDetails((prev) => (prev ? { ...prev, ...data.data } : null));
        showToast.success("پرداخت با موفقیت تایید شد");

        // After verification, process the order
        if (data.data?.authority) {
          await processOrder(data.data.authority);
        }
      }
    } catch (error) {
      console.log("Verification error:", error);
    } finally {
      setVerifying(false);
    }
  };

  const sendOrderSMS = async (authority: string, orderId: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const customerName = currentUser?.firstName && currentUser?.lastName
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : currentUser?.firstName || "کاربر";

      await fetch("/api/sms/order-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: orderId || authority,
          customerName,
        }),
      });
    } catch (error) {
      console.log("Failed to send SMS notification:", error);
      // Don't show error to user, SMS is not critical
    }
  };

  const processOrder = async (authority: PaymentDetails | string) => {
    if (orderCreated) return; // Prevent duplicate processing

    setProcessingOrder(true);
    try {
      const token = localStorage.getItem("authToken");
      // Determine authority string whether we received a PaymentDetails or a string
      const authorityValue =
        typeof authority === "string" ? authority : authority.authority;

      // Request body expects an authority string and optional data
      const requestBody: {
        authority: string;
        hozoriData?: PaymentDetails;
        lotteryData?: string;
      } = {
        authority: authorityValue,
      };

      // Look for hozori data in localStorage
      const storageKeys = Object.keys(localStorage);
      const hozoriKey = storageKeys.find((key) =>
        key.startsWith("hozori_HOZORI-")
      );

      if (hozoriKey) {
        try {
          const hozoriData = JSON.parse(
            localStorage.getItem(hozoriKey) || "{}"
          );
          requestBody.hozoriData = hozoriData;
          localStorage.removeItem(hozoriKey);
        } catch   {
          console.log("Failed to parse hozori data from localStorage");
        }
      }

      const lotteryKey = storageKeys.find((key) =>
        key.startsWith("lottery_LOTTERY-")
      );
      if (lotteryKey) {
        try {
          const lotteryData = JSON.parse(
            localStorage.getItem(lotteryKey) || "{}"
          );
          requestBody.lotteryData = lotteryData;
          localStorage.removeItem(lotteryKey);
        } catch   {
          console.log("Failed to parse lottery data from localStorage");
        }
      }

      const response = await fetch("/api/payment/process-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOrderCreated(data.data);

        // Send SMS notification
        await sendOrderSMS(authorityValue, data.data.requestNumber || authorityValue);

        // Show success message based on order type
        if (data.data.type === "service") {
          showToast.success(
            `درخواست سرویس با شماره ${data.data.requestNumber} ایجاد شد! 🎉`
          );
        } else if (data.data.type === "lottery") {
          showToast.success("ثبت‌نام در قرعه‌کشی با موفقیت انجام شد! 🎲");
        } else if (data.data.type === "wallet") {
          showToast.success(
            `کیف پول شما ${data.data.amount.toLocaleString()} تومان شارژ شد! 💰`
          );
        }
      } else {
        console.log("Order processing failed:", data);
        showToast.warning(
          "پرداخت موفق بود اما سفارش ایجاد نشد. لطفاً با پشتیبانی تماس بگیرید."
        );
      }
    } catch (error) {
      console.log("Order processing error:", error);
      showToast.warning(
        "پرداخت موفق بود اما سفارش ایجاد نشد. لطفاً با پشتیبانی تماس بگیرید."
      );
    } finally {
      setProcessingOrder(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast.success(`${label} کپی شد`);
  };

  const formatAmount = (amount: number, currency: "IRR" | "IRT") => {
    if (currency === "IRT") {
      return `${amount.toLocaleString("fa-IR")} تومان`;
    }
    return `${amount.toLocaleString("fa-IR")} ریال`;
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
    if (!paymentDetails) return;

    const receiptContent = `
رسید پرداخت آرزی پلاس
------------------------
مبلغ: ${formatAmount(paymentDetails.amount, paymentDetails.currency)}
کد پیگیری: ${paymentDetails.authority}
${
  paymentDetails.zarinpalResponse?.refId
    ? `شماره مرجع: ${paymentDetails.zarinpalResponse.refId}`
    : ""
}
تاریخ: ${formatDate(paymentDetails.createdAt)}
وضعیت: ${paymentDetails.status === "verified" ? "تایید شده" : "پرداخت شده"}
------------------------
توضیحات: ${paymentDetails.description}
    `;

    const blob = new Blob([receiptContent], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${paymentDetails.authority}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printReceipt = () => {
    if (!paymentDetails) return;

    const printContent = `
      <div style="font-family: Arial, sans-serif; direction: rtl; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0A1D37;">آرزی پلاس</h1>
          <h2>رسید پرداخت</h2>
        </div>
        <div style="border: 2px solid #ddd; padding: 20px; border-radius: 10px;">
          <p><strong>مبلغ:</strong> ${formatAmount(
            paymentDetails.amount,
            paymentDetails.currency
          )}</p>
          <p><strong>کد پیگیری:</strong> ${paymentDetails.authority}</p>
          ${
            paymentDetails.zarinpalResponse?.refId
              ? `<p><strong>شماره مرجع:</strong> ${paymentDetails.zarinpalResponse.refId}</p>`
              : ""
          }
          <p><strong>تاریخ:</strong> ${formatDate(paymentDetails.createdAt)}</p>
          <p><strong>وضعیت:</strong> ${
            paymentDetails.status === "verified" ? "تایید شده" : "پرداخت شده"
          }</p>
          <p><strong>توضیحات:</strong> ${paymentDetails.description}</p>
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
    return null; // Component will unmount due to router.push in useEffect
  }

  // Special handling for specific payment types
  if (
    paymentType === "lottery" ||
    paymentType === "wallet" ||
    paymentType === "service" ||
    paymentType === "hozori"
  ) {
    const getPaymentTypeTitle = () => {
      switch (paymentType) {
        case "lottery":
          return "ثبت نام قرعه کشی موفق";
        case "wallet":
          return "شارژ کیف پول موفق";
        case "service":
          return "پرداخت سرویس موفق";
        case "hozori":
          return "رزرو وقت حضوری موفق";
        default:
          return "پرداخت موفق";
      }
    };

    const getPaymentTypeMessage = () => {
      switch (paymentType) {
        case "lottery":
          return "ثبت نام شما در قرعه کشی با موفقیت انجام شد";
        case "wallet":
          return "کیف پول شما با موفقیت شارژ شد";
        case "service":
          return "پرداخت سرویس شما با موفقیت انجام شد";
        case "hozori":
          return "وقت حضوری شما با موفقیت رزرو شد";
        default:
          return "پرداخت شما با موفقیت انجام شد";
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                {getPaymentTypeTitle()}
              </h2>
              <div className="mt-4 space-y-4">
                <p className="text-lg text-gray-600">
                  {getPaymentTypeMessage()}
                </p>
                <p className="text-sm text-gray-500">
                  در حال انتقال به داشبورد...
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-right">
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        کد پیگیری:
                      </span>
                      <span className="text-sm text-gray-900 mr-2">
                        {authority}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    رفتن به داشبورد
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#0A1D37] mx-auto mb-4" />
          <p className="text-gray-600">در حال بررسی پرداخت...</p>
        </div>
      </div>
    );
  }

  if (!paymentDetails) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center">
          <p className="text-red-600">خطا در دریافت جزئیات پرداخت</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50"
      dir="rtl"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8 mt-20">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <FaCheckCircle className="text-white text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            پرداخت موفقیت‌آمیز
          </h1>
          <p className="text-gray-600">پرداخت شما با موفقیت انجام شد</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Payment Summary */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-[#0A1D37] mb-2">
                {formatAmount(paymentDetails.amount, paymentDetails.currency)}
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <FaCheckCircle />
                {paymentDetails.status === "verified"
                  ? "تایید شده"
                  : "پرداخت شده"}
                {verifying && <FaSpinner className="animate-spin" />}
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">کد پیگیری:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium">
                    {paymentDetails.authority}
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(paymentDetails.authority, "کد پیگیری")
                    }
                    className="text-[#0A1D37] hover:text-[#e56a00] transition-colors"
                  >
                    <FaCopy />
                  </button>
                </div>
              </div>

              {paymentDetails.zarinpalResponse?.refId && (
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">شماره مرجع:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium">
                      {paymentDetails.zarinpalResponse.refId}
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          paymentDetails.zarinpalResponse?.refId || "",
                          "شماره مرجع"
                        )
                      }
                      className="text-[#0A1D37] hover:text-[#e56a00] transition-colors"
                    >
                      <FaCopy />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">تاریخ پرداخت:</span>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-400" />
                  <span>{formatDate(paymentDetails.createdAt)}</span>
                </div>
              </div>

              {paymentDetails.zarinpalResponse?.cardPan && (
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">شماره کارت:</span>
                  <div className="flex items-center gap-2">
                    <FaCreditCard className="text-gray-400" />
                    <span className="font-mono">
                      ****{paymentDetails.zarinpalResponse.cardPan}
                    </span>
                  </div>
                </div>
              )}

              <div className="py-3">
                <span className="text-gray-600 block mb-2">توضیحات:</span>
                <p className="text-[#0A1D37] bg-gray-50 p-3 rounded-lg">
                  {paymentDetails.description}
                </p>
              </div>

              {/* Order Processing Status */}
              <div className="py-3 border-t border-gray-100 mt-4">
                <span className="text-gray-600 block mb-2">وضعیت سفارش:</span>
                <div className="bg-gray-50 p-3 rounded-lg">
                  {processingOrder ? (
                    <div className="flex items-center gap-2 text-blue-600">
                      <FaSpinner className="animate-spin" />
                      <span>در حال ایجاد سفارش...</span>
                    </div>
                  ) : orderCreated ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <FaCheckCircle />
                      <span>
                        {orderCreated.type === "service" &&
                          `درخواست سرویس ${orderCreated.requestNumber} ایجاد شد`}
                        {orderCreated.type === "lottery" &&
                          "ثبت‌نام در قرعه‌کشی موفق"}
                        {orderCreated.type === "wallet" &&
                          `کیف پول ${orderCreated.amount.toLocaleString()} تومان شارژ شد`}
                        {orderCreated.type === "hozori" &&
                          "رزرو وقت حضوری با موفقیت انجام شد"}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-500">
                      <FaSpinner className="animate-spin" />
                      <span>در انتظار ایجاد سفارش...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
            <h3 className="font-semibold text-[#0A1D37] mb-4">عملیات</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={printReceipt}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                <FaPrint />
                چاپ رسید
              </button>

              <button
                onClick={generateReceipt}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
              >
                <FaDownload />
                دانلود رسید
              </button>

              {/* Dynamic action based on order type */}
              {orderCreated?.type === "service" && (
                <button
                  onClick={() => router.push("/dashboard/requests")}
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-blue-300 text-blue-700 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  <FaReceipt />
                  مشاهده درخواست
                </button>
              )}

              {orderCreated?.type === "lottery" && (
                <button
                  onClick={() => router.push("/dashboard/lottery")}
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-purple-300 text-purple-700 rounded-xl hover:bg-purple-50 transition-colors"
                >
                  <FaReceipt />
                  وضعیت قرعه‌کشی
                </button>
              )}

              {orderCreated?.type === "wallet" && (
                <button
                  onClick={() => router.push("/dashboard/wallet")}
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-green-300 text-green-700 rounded-xl hover:bg-green-50 transition-colors"
                >
                  <FaReceipt />
                  مشاهده کیف پول
                </button>
              )}

              {orderCreated?.type === "hozori" && (
                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-blue-300 text-blue-700 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  <FaReceipt />
                  مشاهده رزروها
                </button>
              )}

              <button
                onClick={() => router.push("/payment/history")}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <FaReceipt />
                تاریخچه پرداخت
              </button>

              <button
                onClick={() => router.push("/")}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white rounded-xl hover:shadow-lg transition-all"
              >
                <FaHome />
                بازگشت به خانه
              </button>
            </div>
          </div>

          {/* Support Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <FaReceipt className="text-white text-sm" />
              </div>
              <div>
                <p className="font-medium text-blue-800">نیاز به کمک دارید؟</p>
                <p className="text-sm text-blue-600">
                  در صورت بروز هرگونه مشکل، با پشتیبانی تماس بگیرید
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
