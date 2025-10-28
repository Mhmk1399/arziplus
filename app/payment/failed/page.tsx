"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  FaTimesCircle,
  FaRedo,
  FaHome,
  FaPhone,
  FaExclamationTriangle,
  FaArrowLeft,
  FaSpinner,
  FaInfoCircle,
} from "react-icons/fa";

interface FailedPaymentDetails {
  authority?: string;
  amount?: number;
  currency?: 'IRR' | 'IRT';
  description?: string;
  status?: string;
  errorMessage?: string;
  createdAt?: string;
}

const PaymentFailedPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: currentUser, isLoggedIn, loading: userLoading } = useCurrentUser();
  
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<FailedPaymentDetails | null>(null);
  
  const authority = searchParams.get('Authority');
  const status = searchParams.get('Status');

  useEffect(() => {
    // Wait for user loading to complete before checking authentication
    if (userLoading) return;
    
    if (!isLoggedIn) {
      router.push("/auth/sms");
      return;
    }

    fetchPaymentDetails();
  }, [authority, isLoggedIn, userLoading, router]);

  const fetchPaymentDetails = async () => {
    if (!authority) {
      setLoading(false);
      return;
    }

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

      if (response.ok && data.success && data.data) {
        setPaymentDetails(data.data);
      }
    } catch (error) {
      console.log("Error fetching payment details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFailureReason = () => {
    if (!status) return "پرداخت ناموفق";
    
    switch (status) {
      case 'NOK':
        return "پرداخت توسط کاربر لغو شد";
      case 'cancel':
        return "پرداخت لغو شده";
      case 'error':
        return "خطا در فرآیند پرداخت";
      case 'timeout':
        return "زمان پرداخت به پایان رسید";
      default:
        return "پرداخت ناموفق";
    }
  };

  const formatAmount = (amount: number, currency: 'IRR' | 'IRT') => {
    if (currency === 'IRT') {
      return `${amount.toLocaleString('fa-IR')} تومان`;
    }
    return `${amount.toLocaleString('fa-IR')} ریال`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const retryPayment = () => {
    const params = new URLSearchParams();
    
    if (paymentDetails?.amount) {
      params.set('amount', paymentDetails.amount.toString());
    }
    if (paymentDetails?.description) {
      params.set('description', paymentDetails.description);
    }
    
    router.push(`/payment/request?${params.toString()}`);
  };

  // Show loading while checking authentication
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center" dir="rtl">
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#0A1D37] mx-auto mb-4" />
          <p className="text-gray-600">در حال بررسی...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Failed Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <FaTimesCircle className="text-white text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-red-700 mb-2">
            پرداخت ناموفق
          </h1>
          <p className="text-gray-600">
            {getFailureReason()}
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Payment Details */}
          {paymentDetails && (
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8">
              <h3 className="font-semibold text-[#0A1D37] mb-6 flex items-center gap-2">
                <FaInfoCircle />
                جزئیات پرداخت
              </h3>

              <div className="space-y-4">
                {paymentDetails.amount && (
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-[#0A1D37] mb-2">
                      {formatAmount(paymentDetails.amount, paymentDetails.currency || 'IRR')}
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                      <FaTimesCircle />
                      پرداخت نشده
                    </div>
                  </div>
                )}

                {authority && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">کد پیگیری:</span>
                    <span className="font-mono font-medium text-xs">{authority}</span>
                  </div>
                )}

                {paymentDetails.createdAt && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">تاریخ تلاش:</span>
                    <span>{formatDate(paymentDetails.createdAt)}</span>
                  </div>
                )}

                {paymentDetails.description && (
                  <div className="py-3">
                    <span className="text-gray-600 block mb-2">توضیحات:</span>
                    <p className="text-[#0A1D37] bg-gray-50 p-3 rounded-lg">
                      {paymentDetails.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error Information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="text-yellow-600 text-xl mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">
                  دلایل احتمالی عدم موفقیت پرداخت:
                </h3>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• لغو پرداخت توسط کاربر</li>
                  <li>• ناکافی بودن موجودی حساب</li>
                  <li>• خطا در اتصال به بانک</li>
                  <li>• تایید نکردن پرداخت در نرم‌افزار بانک</li>
                  <li>• بسته بودن حساب یا کارت</li>
                  <li>• پایان یافتن زمان پرداخت</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
            <h3 className="font-semibold text-[#0A1D37] mb-4">گزینه‌های موجود</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentDetails && (
                <button
                  onClick={retryPayment}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white rounded-xl hover:shadow-lg transition-all"
                >
                  <FaRedo />
                  تلاش مجدد
                </button>
              )}
              
              <button
                onClick={() => router.push('/payment/request')}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                <FaRedo />
                پرداخت جدید
              </button>              <button
                onClick={() => router.push('/payment/history')}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <FaArrowLeft />
                تاریخچه پرداخت
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <FaHome />
                صفحه اصلی
              </button>
            </div>
          </div>

          {/* Support Contact */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <FaPhone className="text-white text-lg" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">
                  نیاز به راهنمایی دارید؟
                </h3>
                <p className="text-blue-700 text-sm mb-3">
                  اگر مشکل همچنان پابرجا است، با تیم پشتیبانی تماس بگیرید
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="tel:+989123456789"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    <FaPhone />
                    تماس با پشتیبانی
                  </a>
                  <button
                    onClick={() => router.push('/contact')}
                    className="flex items-center gap-2 px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                  >
                    <FaInfoCircle />
                    ارسال پیام
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-[#0A1D37] mb-3">
              نکاتی برای پرداخت موفق:
            </h3>
            <ul className="text-gray-600 text-sm space-y-2">
              <li>• از موجودی کافی حساب اطمینان حاصل کنید</li>
              <li>• فرآیند پرداخت را کامل کنید و صفحه را نبندید</li>
              <li>• از اتصال اینترنت پایدار استفاده کنید</li>
              <li>• اطلاعات کارت را دقیق وارد کنید</li>
              <li>• پرداخت را در نرم‌افزار بانک تایید کنید</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;