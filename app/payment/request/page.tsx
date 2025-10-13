"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { showToast } from "@/utilities/toast";
import {
  FaCreditCard,
  FaSpinner,
  FaMoneyBillWave,
  FaShoppingCart,
  FaInfoCircle,
  FaArrowLeft,
} from "react-icons/fa";

const PaymentRequestPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: currentUser, isLoggedIn, loading: userLoading } = useCurrentUser();
  
  const [loading, setLoading] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [formData, setFormData] = useState({
    amount: searchParams.get('amount') || '',
    description: searchParams.get('description') || '',
    serviceId: searchParams.get('serviceId') || '',
    orderId: searchParams.get('orderId') || '',
    currency: 'IRR' as 'IRR' | 'IRT',
  });

  useEffect(() => {
    // Wait for user loading to complete before checking authentication
    if (userLoading) return;
    
    if (!isLoggedIn) {
      router.push("/auth/sms");
    }
  }, [isLoggedIn, userLoading, router]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatAmount = (amount: number, currency: 'IRR' | 'IRT') => {
    if (currency === 'IRT') {
      return `${amount.toLocaleString('fa-IR')} تومان`;
    }
    return `${amount.toLocaleString('fa-IR')} ریال`;
  };

  const convertCurrency = (amount: number, from: 'IRR' | 'IRT', to: 'IRR' | 'IRT') => {
    if (from === to) return amount;
    if (from === 'IRT' && to === 'IRR') return amount * 10;
    if (from === 'IRR' && to === 'IRT') return amount / 10;
    return amount;
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

    if (amount < 1000) {
      showToast.error("حداقل مبلغ پرداخت ۱۰۰۰ ریال است");
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
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Check if this is a duplicate payment
        if (data.data.duplicate) {
          if (data.data.redirectTo) {
            // Already verified payment, redirect to success page
            showToast.info("پرداخت قبلاً انجام شده است");
            router.push(data.data.redirectTo);
            return;
          } else {
            // Pending duplicate, show warning and redirect to existing payment
            showToast.warning("درخواست پرداخت تکراری - به درگاه موجود منتقل می‌شوید");
          }
        } else {
          showToast.success("درخواست پرداخت با موفقیت ایجاد شد");
        }
        
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center" dir="rtl">
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

  const displayAmount = parseFloat(formData.amount.toString()) || 0;
  const convertedAmount = convertCurrency(displayAmount, formData.currency, formData.currency === 'IRR' ? 'IRT' : 'IRR');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCreditCard className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-[#0A1D37] mb-2">درخواست پرداخت</h1>
          <p className="text-gray-600">از درگاه امن زرین‌پال</p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* User Info */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#FF7A00]/20 to-[#4DBFF0]/20 rounded-full flex items-center justify-center">
                <span className="text-[#FF7A00] font-bold text-lg">
                  {(currentUser.firstName || 'ک').charAt(0)}
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
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                  مبلغ پرداخت *
                </label>
                <div className="relative">
                  <FaMoneyBillWave className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#FF7A00]" />
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className="w-full pr-12 pl-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
                    placeholder="مبلغ را وارد کنید"
                    min="1000"
                    required
                  />
                </div>
                
                {/* Currency Toggle */}
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => handleInputChange('currency', 'IRR')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        formData.currency === 'IRR'
                          ? 'bg-[#FF7A00] text-white'
                          : 'text-gray-600 hover:text-[#FF7A00]'
                      }`}
                    >
                      ریال
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('currency', 'IRT')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        formData.currency === 'IRT'
                          ? 'bg-[#FF7A00] text-white'
                          : 'text-gray-600 hover:text-[#FF7A00]'
                      }`}
                    >
                      تومان
                    </button>
                  </div>
                  
                  {displayAmount > 0 && (
                    <div className="text-sm text-gray-600">
                      معادل: {formatAmount(convertedAmount, formData.currency === 'IRR' ? 'IRT' : 'IRR')}
                    </div>
                  )}
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
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full pr-12 pl-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all resize-none"
                    placeholder="توضیحات مربوط به پرداخت را وارد کنید"
                    rows={3}
                    maxLength={255}
                    required
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/255 کاراکتر
                </div>
              </div>

              {/* Service/Order IDs (Optional) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                    شناسه سرویس (اختیاری)
                  </label>
                  <input
                    type="text"
                    value={formData.serviceId}
                    onChange={(e) => handleInputChange('serviceId', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
                    placeholder="شناسه سرویس"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                    شماره سفارش (اختیاری)
                  </label>
                  <input
                    type="text"
                    value={formData.orderId}
                    onChange={(e) => handleInputChange('orderId', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
                    placeholder="شماره سفارش"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
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
                      <FaShoppingCart className="text-sm" />
                      ادامه پرداخت
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <FaCreditCard className="text-white text-sm" />
              </div>
              <div>
                <p className="font-medium text-green-800">پرداخت امن</p>
                <p className="text-sm text-green-600">
                  این پرداخت از طریق درگاه امن زرین‌پال انجام می‌شود
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentRequestPage;