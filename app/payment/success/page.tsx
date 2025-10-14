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

interface PaymentDetails {
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

const PaymentSuccessPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: currentUser, isLoggedIn, loading: userLoading } = useCurrentUser();
  
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [verifying, setVerifying] = useState(false);
  
  const authority = searchParams.get('Authority');
  const status = searchParams.get('Status');

  useEffect(() => {
    // Wait for user loading to complete before checking authentication
    if (userLoading) return;
    
    if (!isLoggedIn) {
      router.push("/auth/sms");
      return;
    }

    // Debug logging
    console.log('Success page params:', { authority, status });

    if (!authority) {
      console.log('No authority found, redirecting to failed');
      router.push('/payment/failed');
      return;
    }

    // Don't require status to be exactly 'OK' - just check if authority exists
    // The status will be determined by fetching payment details from our database
    fetchPaymentDetails();
  }, [authority, status, isLoggedIn, userLoading, router]);

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
      
      console.log('Payment details response:', data);

      if (response.ok && data.success && data.data) {
        console.log('Payment found:', data.data.status, data.data.authority);
        setPaymentDetails(data.data);
        
        // Check if this is actually a failed payment
        if (data.data.status === 'failed' || data.data.status === 'cancelled') {
          console.log('Payment failed, redirecting to failed page');
          router.push(`/payment/failed?Authority=${authority}`);
          return;
        }
        
        // Auto-verify if payment is in 'paid' status
        if (data.data.status === 'paid') {
          await verifyPayment();
        }
      } else {
        console.log('Failed to get payment details:', data);
        showToast.error("خطا در دریافت جزئیات پرداخت");
        router.push('/payment/failed');
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
      showToast.error("خطا در اتصال به سرور");
      router.push('/payment/failed');
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
        setPaymentDetails(prev => prev ? { ...prev, ...data.data } : null);
        showToast.success("پرداخت با موفقیت تایید شد");
      }
    } catch (error) {
      console.error("Verification error:", error);
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

  const generateReceipt = () => {
    if (!paymentDetails) return;

    const receiptContent = `
رسید پرداخت آرزی پلاس
------------------------
مبلغ: ${formatAmount(paymentDetails.amount, paymentDetails.currency)}
کد پیگیری: ${paymentDetails.authority}
${paymentDetails.zarinpalResponse?.refId ? `شماره مرجع: ${paymentDetails.zarinpalResponse.refId}` : ''}
تاریخ: ${formatDate(paymentDetails.createdAt)}
وضعیت: ${paymentDetails.status === 'verified' ? 'تایید شده' : 'پرداخت شده'}
------------------------
توضیحات: ${paymentDetails.description}
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
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
          <h1 style="color: #FF7A00;">آرزی پلاس</h1>
          <h2>رسید پرداخت</h2>
        </div>
        <div style="border: 2px solid #ddd; padding: 20px; border-radius: 10px;">
          <p><strong>مبلغ:</strong> ${formatAmount(paymentDetails.amount, paymentDetails.currency)}</p>
          <p><strong>کد پیگیری:</strong> ${paymentDetails.authority}</p>
          ${paymentDetails.zarinpalResponse?.refId ? `<p><strong>شماره مرجع:</strong> ${paymentDetails.zarinpalResponse.refId}</p>` : ''}
          <p><strong>تاریخ:</strong> ${formatDate(paymentDetails.createdAt)}</p>
          <p><strong>وضعیت:</strong> ${paymentDetails.status === 'verified' ? 'تایید شده' : 'پرداخت شده'}</p>
          <p><strong>توضیحات:</strong> ${paymentDetails.description}</p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '', 'width=600,height=400');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Show loading while checking authentication
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#FF7A00] mx-auto mb-4" />
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#FF7A00] mx-auto mb-4" />
          <p className="text-gray-600">در حال بررسی پرداخت...</p>
        </div>
      </div>
    );
  }

  if (!paymentDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-red-600">خطا در دریافت جزئیات پرداخت</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8 mt-20">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <FaCheckCircle className="text-white text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            پرداخت موفقیت‌آمیز
          </h1>
          <p className="text-gray-600">
            پرداخت شما با موفقیت انجام شد
          </p>
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
                {paymentDetails.status === 'verified' ? 'تایید شده' : 'پرداخت شده'}
                {verifying && <FaSpinner className="animate-spin" />}
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">کد پیگیری:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium">{paymentDetails.authority}</span>
                  <button
                    onClick={() => copyToClipboard(paymentDetails.authority, 'کد پیگیری')}
                    className="text-[#FF7A00] hover:text-[#e56a00] transition-colors"
                  >
                    <FaCopy />
                  </button>
                </div>
              </div>

              {paymentDetails.zarinpalResponse?.refId && (
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">شماره مرجع:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium">{paymentDetails.zarinpalResponse.refId}</span>
                    <button
                      onClick={() => copyToClipboard(paymentDetails.zarinpalResponse?.refId || '', 'شماره مرجع')}
                      className="text-[#FF7A00] hover:text-[#e56a00] transition-colors"
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
                    <span className="font-mono">****{paymentDetails.zarinpalResponse.cardPan}</span>
                  </div>
                </div>
              )}

              <div className="py-3">
                <span className="text-gray-600 block mb-2">توضیحات:</span>
                <p className="text-[#0A1D37] bg-gray-50 p-3 rounded-lg">
                  {paymentDetails.description}
                </p>
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
              
              <button
                onClick={() => router.push('/payment/history')}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <FaReceipt />
                تاریخچه پرداخت
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] text-white rounded-xl hover:shadow-lg transition-all"
              >
                <FaHome />
                صفحه اصلی
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