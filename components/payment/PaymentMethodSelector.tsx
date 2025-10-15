"use client";
import React, { useState } from "react";
import { FaWallet, FaCreditCard, FaMoneyBillWave, FaCheck } from "react-icons/fa";
import { estedadBold } from "@/next-persian-fonts/estedad/index";

interface PaymentMethodSelectorProps {
  amount: number;
  walletBalance?: number;
  onPaymentMethodSelect: (method: 'wallet' | 'direct' | 'card') => void;
  isWalletEnabled?: boolean;
  className?: string;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  amount,
  walletBalance = 0,
  onPaymentMethodSelect,
  isWalletEnabled = false,
  className = ""
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'wallet' | 'direct' | 'card' | null>(null);

  const hasEnoughWalletBalance = walletBalance >= amount;

  const paymentMethods = [
    {
      id: 'wallet' as const,
      title: 'پرداخت با کیف پول',
      description: hasEnoughWalletBalance 
        ? `موجودی کیف پول: ${walletBalance.toLocaleString()} تومان`
        : `موجودی ناکافی - موجودی فعلی: ${walletBalance.toLocaleString()} تومان`,
      icon: <FaWallet className="text-2xl" />,
      available: isWalletEnabled && hasEnoughWalletBalance,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700'
    },
    {
      id: 'direct' as const,
      title: 'پرداخت مستقیم آنلاین',
      description: 'پرداخت امن از طریق درگاه بانکی',
      icon: <FaCreditCard className="text-2xl" />,
      available: true,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700'
    },
    {
      id: 'card' as const,
      title: 'واریز کارت به کارت',
      description: 'واریز مبلغ به شماره کارت و ارسال رسید',
      icon: <FaMoneyBillWave className="text-2xl" />,
      available: true,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700'
    }
  ];

  const handleMethodSelect = (methodId: 'wallet' | 'direct' | 'card') => {
    setSelectedMethod(methodId);
  };

  const handleConfirm = () => {
    if (selectedMethod) {
      onPaymentMethodSelect(selectedMethod);
    }
  };

  return (
    <div className={`space-y-6 ${className}`} dir="rtl">
      {/* Header */}
      <div className="text-center">
        <h3 className={`text-2xl font-bold text-[#0A1D37] mb-2 ${estedadBold.className}`}>
          روش پرداخت را انتخاب کنید
        </h3>
        <p className="text-[#0A1D37]/70">
          مبلغ قابل پرداخت: <span className="font-bold text-[#FF7A00]">{amount.toLocaleString()} تومان</span>
        </p>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
              method.available ? 'hover:shadow-lg' : 'opacity-50 cursor-not-allowed'
            } ${
              selectedMethod === method.id
                ? `${method.borderColor} ${method.bgColor} shadow-lg`
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => method.available && handleMethodSelect(method.id)}
          >
            {/* Selection Indicator */}
            {selectedMethod === method.id && (
              <div className="absolute top-4 left-4">
                <div className={`w-6 h-6 bg-gradient-to-r ${method.color} rounded-full flex items-center justify-center`}>
                  <FaCheck className="text-white text-xs" />
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className={`p-4 rounded-xl ${
                selectedMethod === method.id ? method.bgColor : 'bg-gray-100'
              }`}>
                <div className={selectedMethod === method.id ? method.textColor : 'text-gray-600'}>
                  {method.icon}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h4 className={`font-bold text-lg ${
                  selectedMethod === method.id ? method.textColor : 'text-[#0A1D37]'
                }`}>
                  {method.title}
                </h4>
                <p className={`text-sm ${
                  selectedMethod === method.id ? method.textColor + '/80' : 'text-[#0A1D37]/60'
                }`}>
                  {method.description}
                </p>
              </div>

              {/* Status */}
              {!method.available && (
                <div className="text-red-500 text-sm font-medium">
                  غیرفعال
                </div>
              )}
            </div>

            {/* Special Wallet Warning */}
            {method.id === 'wallet' && !hasEnoughWalletBalance && isWalletEnabled && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">
                  برای استفاده از این روش، ابتدا کیف پول خود را شارژ کنید.
                  <span className="font-medium"> کمبود: {(amount - walletBalance).toLocaleString()} تومان</span>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center pt-4">
        <button
          onClick={handleConfirm}
          disabled={!selectedMethod}
          className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
            selectedMethod
              ? "bg-gradient-to-l from-[#FF7A00] to-[#4DBFF0] text-white hover:opacity-90 transform hover:scale-105 shadow-lg"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <FaCheck />
          اپرداخت
        </button>
      </div>

      {/* Additional Info */}
      <div className="text-center text-sm text-[#0A1D37]/60">
        <p>پس از انتخاب روش پرداخت، به مرحله پرداخت هدایت خواهید شد</p>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;