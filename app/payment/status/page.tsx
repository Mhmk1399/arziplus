"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  FaSearch,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationTriangle,
  FaRedo,
  FaCreditCard,
  FaCalendarAlt,
  FaCopy,
  FaHome,
  FaReceipt,
  FaInfoCircle,
} from "react-icons/fa";
import { showToast } from "@/utilities/toast";

interface PaymentStatus {
  _id: string;
  authority: string;
  amount: number;
  currency: 'IRR' | 'IRT';
  description: string;
  status: 'pending' | 'paid' | 'verified' | 'failed' | 'cancelled';
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
}

const PaymentStatusPage: React.FC = () => {
  const router = useRouter();
  const { user: currentUser, isLoggedIn, loading: userLoading } = useCurrentUser();
  
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [authority, setAuthority] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Wait for user loading to complete before checking authentication
    if (userLoading) return;
    
    if (!isLoggedIn) {
      router.push("/auth/sms");
    }
  }, [isLoggedIn, userLoading, router]);

  const checkPaymentStatus = async (authorityCode?: string) => {
    const searchAuthority = authorityCode || authority.trim();
    
    if (!searchAuthority) {
      setError("لطفاً کد پیگیری را وارد کنید");
      return;
    }

    if (searchAuthority.length < 10) {
      setError("کد پیگیری باید حداقل ۱۰ کاراکتر باشد");
      return;
    }

    setLoading(true);
    setError("");
    setPaymentStatus(null);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/payment/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ authority: searchAuthority }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.data) {
        setPaymentStatus(data.data);
        setError("");
      } else {
        setError("پرداختی با این کد پیگیری یافت نشد");
        setPaymentStatus(null);
      }
    } catch (error) {
      console.log("Error checking payment status:", error);
      setError("خطا در اتصال به سرور");
      setPaymentStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async () => {
    if (!paymentStatus) return;

    setVerifying(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/payment/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ authority: paymentStatus.authority }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPaymentStatus(prev => prev ? { ...prev, ...data.data } : null);
        showToast.success("پرداخت با موفقیت تایید شد");
      } else {
        showToast.error(data.error || "خطا در تایید پرداخت");
      }
    } catch (error) {
      console.log("Verification error:", error);
      showToast.error("خطا در اتصال به سرور");
    } finally {
      setVerifying(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast.success(`${label} کپی شد`);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <FaCheckCircle className="text-green-500 text-4xl" />;
      case 'paid':
        return <FaCheckCircle className="text-blue-500 text-4xl" />;
      case 'pending':
        return <FaClock className="text-yellow-500 text-4xl" />;
      case 'failed':
        return <FaTimesCircle className="text-red-500 text-4xl" />;
      case 'cancelled':
        return <FaExclamationTriangle className="text-gray-500 text-4xl" />;
      default:
        return <FaClock className="text-gray-500 text-4xl" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified': return 'تایید شده';
      case 'paid': return 'پرداخت شده';
      case 'pending': return 'در انتظار پرداخت';
      case 'failed': return 'پرداخت ناموفق';
      case 'cancelled': return 'لغو شده';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-700';
      case 'paid': return 'text-blue-700';
      case 'pending': return 'text-yellow-700';
      case 'failed': return 'text-red-700';
      case 'cancelled': return 'text-gray-700';
      default: return 'text-gray-700';
    }
  };

  const getStatusBackground = (status: string) => {
    switch (status) {
      case 'verified': return 'from-green-50 to-green-100';
      case 'paid': return 'from-blue-50 to-blue-100';
      case 'pending': return 'from-yellow-50 to-yellow-100';
      case 'failed': return 'from-red-50 to-red-100';
      case 'cancelled': return 'from-gray-50 to-gray-100';
      default: return 'from-gray-50 to-gray-100';
    }
  };

  // Show loading while checking authentication
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center" dir="rtl">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 mt-20">
          <div className="w-20 h-20 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] rounded-full flex items-center justify-center mx-auto mb-4">
            <FaSearch className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-[#0A1D37] mb-2">استعلام وضعیت پرداخت</h1>
          <p className="text-gray-600">وضعیت پرداخت خود را با کد پیگیری بررسی کنید</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Search Form */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                  کد پیگیری پرداخت *
                </label>
                <div className="relative">
                  <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0A1D37]" />
                  <input
                    type="text"
                    value={authority}
                    onChange={(e) => {
                      setAuthority(e.target.value);
                      setError("");
                      setPaymentStatus(null);
                    }}
                    className="w-full pr-12 pl-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] transition-all font-mono"
                    placeholder="کد پیگیری را وارد کنید"
                    maxLength={50}
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <FaExclamationTriangle />
                    {error}
                  </p>
                )}
              </div>

              <button
                onClick={() => checkPaymentStatus()}
                disabled={loading || !authority.trim()}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white rounded-xl hover:shadow-lg disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    در حال بررسی...
                  </>
                ) : (
                  <>
                    <FaSearch />
                    استعلام وضعیت
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Payment Status Result */}
          {paymentStatus && (
            <div className={`bg-gradient-to-r ${getStatusBackground(paymentStatus.status)} border border-gray-200/50 rounded-2xl p-8`}>
              {/* Status Header */}
              <div className="text-center mb-8">
                <div className="mb-4">
                  {getStatusIcon(paymentStatus.status)}
                </div>
                <h2 className={`text-2xl font-bold ${getStatusColor(paymentStatus.status)} mb-2`}>
                  {getStatusText(paymentStatus.status)}
                </h2>
                <p className="text-gray-600">
                  وضعیت پرداخت شما
                </p>
              </div>

              {/* Amount */}
              <div className="text-center mb-8">
                <div className="text-3xl font-bold text-[#0A1D37] mb-2">
                  {formatAmount(paymentStatus.amount, paymentStatus.currency)}
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">کد پیگیری:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-xs">{paymentStatus.authority}</span>
                    <button
                      onClick={() => copyToClipboard(paymentStatus.authority, 'کد پیگیری')}
                      className="text-[#0A1D37] hover:text-[#e56a00] transition-colors"
                    >
                      <FaCopy />
                    </button>
                  </div>
                </div>

                {paymentStatus.zarinpalResponse?.refId && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">شماره مرجع:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium">{paymentStatus.zarinpalResponse.refId}</span>
                      <button
                        onClick={() => copyToClipboard(paymentStatus.zarinpalResponse?.refId || '', 'شماره مرجع')}
                        className="text-[#0A1D37] hover:text-[#e56a00] transition-colors"
                      >
                        <FaCopy />
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">تاریخ ایجاد:</span>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-400" />
                    <span>{formatDate(paymentStatus.createdAt)}</span>
                  </div>
                </div>

                {paymentStatus.verifiedAt && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">تاریخ تایید:</span>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-400" />
                      <span>{formatDate(paymentStatus.verifiedAt)}</span>
                    </div>
                  </div>
                )}

                {paymentStatus.zarinpalResponse?.cardPan && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">شماره کارت:</span>
                    <div className="flex items-center gap-2">
                      <FaCreditCard className="text-gray-400" />
                      <span className="font-mono">****{paymentStatus.zarinpalResponse.cardPan}</span>
                    </div>
                  </div>
                )}

                <div className="py-3">
                  <span className="text-gray-600 block mb-2">توضیحات:</span>
                  <p className="text-[#0A1D37] bg-white/70 p-3 rounded-lg">
                    {paymentStatus.description}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {paymentStatus.status === 'paid' && (
                  <button
                    onClick={verifyPayment}
                    disabled={verifying}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 transition-colors"
                  >
                    {verifying ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        در حال تایید...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle />
                        تایید پرداخت
                      </>
                    )}
                  </button>
                )}
                
                <button
                  onClick={() => checkPaymentStatus(paymentStatus.authority)}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  <FaRedo />
                  بروزرسانی
                </button>
                
                <button
                  onClick={() => router.push('/payment/history')}
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <FaReceipt />
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
          )}

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
            <h3 className="font-semibold text-[#0A1D37] mb-4">دسترسی سریع</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => router.push('/payment/request')}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white rounded-xl hover:shadow-lg transition-all"
              >
                <FaCreditCard />
                پرداخت جدید
              </button>
              
              <button
                onClick={() => router.push('/payment/history')}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <FaReceipt />
                تاریخچه پرداخت
              </button>
              
              <button
                onClick={() => router.push('/contact')}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <FaInfoCircle />
                پشتیبانی
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <FaInfoCircle className="text-white text-sm" />
              </div>
              <div>
                <p className="font-medium text-blue-800">راهنما</p>
                <p className="text-sm text-blue-600">
                  کد پیگیری در پایان فرآیند پرداخت به شما ارائه می‌شود و در ایمیل و پیامک نیز ارسال می‌گردد
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusPage;