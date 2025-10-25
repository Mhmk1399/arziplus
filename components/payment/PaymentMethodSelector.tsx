"use client";
import React, { useState } from "react";
import {
  FaWallet,
  FaCreditCard,
   FaCheck,
} from "react-icons/fa";
import { estedadBold } from "@/next-persian-fonts/estedad/index";
 
interface PaymentMethodSelectorProps {
  amount: number;
  walletBalance?: number;
  onPaymentMethodSelect: (method: "wallet" | "direct" | "card") => void;
  isWalletEnabled?: boolean;
  className?: string;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  amount,
  walletBalance,
  onPaymentMethodSelect,
  isWalletEnabled = false,
  className = "",
}) => {
  const [selectedMethod, setSelectedMethod] = useState<
    "wallet" | "direct"  | null
  >(null);
  if (!walletBalance) {
    walletBalance = 0;
  }
  const hasEnoughWalletBalance = walletBalance >= amount;

  const paymentMethods = [
    {
      id: "wallet" as const,
      title: "پرداخت با کیف پول",
      description: hasEnoughWalletBalance
        ? `موجودی کیف پول: ${walletBalance.toLocaleString()} تومان`
        : `موجودی ناکافی - موجودی فعلی: ${walletBalance.toLocaleString()} تومان`,
      icon: <FaWallet className="text-2xl" />,
      available: isWalletEnabled && hasEnoughWalletBalance,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-500",
      textColor: "text-green-700",
      hoverBorder: "hover:border-green-300",
    },
    {
      id: "direct" as const,
      title: "پرداخت مستقیم آنلاین",
      description: "پرداخت امن از طریق درگاه بانکی",
      icon: <FaCreditCard className="text-2xl" />,
      available: true,
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
      textColor: "text-blue-700",
      hoverBorder: "hover:border-blue-300",
    },
  
  ];

  const handleMethodSelect = (methodId: "wallet" | "direct" ) => {
    setSelectedMethod(methodId);
  };

  const handleConfirm = () => {
    if (selectedMethod) {
      onPaymentMethodSelect(selectedMethod);
    }
  };

  return (
    <div
      className={`w-full max-w-5xl z-800 mx-auto p-2  max-h-[70vh] overflow-auto ${className}`}
      dir="rtl"
    >
      {/* Header Section - Improved spacing and hierarchy */}
      <div className="text-center mb-4 space-y-3">
        <h3
          className={`text-xl sm:text-2xl font-bold text-[#0A1D37] ${estedadBold.className}`}
        >
          روش پرداخت را انتخاب کنید
        </h3>
        <div className="inline-block bg-gradient-to-r from-[#0A1D37]/10 to-[#4DBFF0]/10 px-6 py-3 rounded-full">
          <p className="text-[#0A1D37]/80 text-sm sm:text-base">
            مبلغ قابل پرداخت:{" "}
            <span className="font-bold text-[#0A1D37] text-;g">
              {amount.toLocaleString()}
            </span>{" "}
            تومان
          </p>
        </div>
      </div>

      {/* Payment Methods Grid - Better spacing */}
      <div className="space-y-2 mb-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`
              relative group
              p-3   
              rounded-2xl 
              border-2 
              transition-all 
              duration-300 
              ease-in-out
              ${
                method.available
                  ? `cursor-pointer ${method.hoverBorder} hover:shadow-xl hover:-translate-y-1`
                  : "opacity-50 cursor-not-allowed"
              }
              ${
                selectedMethod === method.id
                  ? `${method.borderColor} ${method.bgColor} shadow-xl scale-[1.02]`
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }
            `}
            onClick={() => method.available && handleMethodSelect(method.id)}
          >
            {/* Selection Indicator - Better positioning */}
            {selectedMethod === method.id && (
              <div className="absolute top-5 left-5 animate-in zoom-in duration-300">
                <div
                  className={`
                  w-8 h-8 
                  bg-gradient-to-r ${method.color} 
                  rounded-full 
                  flex items-center justify-center
                  shadow-lg
                  ring-4 ring-white
                `}
                >
                  <FaCheck className="text-white text-sm" />
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              {/* Icon Container - Improved styling */}
              <div
                className={`
                p-4 sm:p-5
                rounded-xl sm:rounded-2xl 
                transition-all duration-300
                ${
                  selectedMethod === method.id
                    ? `bg-gradient-to-r ${method.color} shadow-lg`
                    : "bg-gray-100 group-hover:bg-gray-200"
                }
              `}
              >
                <div
                  className={
                    selectedMethod === method.id
                      ? "text-white"
                      : "text-gray-600"
                  }
                >
                  {method.icon}
                </div>
              </div>

              {/* Text Content - Better spacing */}
              <div className="flex-1 space-y-1.5">
                <h4
                  className={`
                  font-bold text-sm sm:text-lg
                  transition-colors duration-300
                  ${
                    selectedMethod === method.id
                      ? method.textColor
                      : "text-[#0A1D37]"
                  }
                `}
                >
                  {method.title}
                </h4>
                <p
                  className={`
                  text-xs sm:text-base
                  leading-relaxed
                  transition-colors duration-300
                  ${
                    selectedMethod === method.id
                      ? method.textColor + "/80"
                      : "text-[#0A1D37]/60"
                  }
                `}
                >
                  {method.description}
                </p>
              </div>

              {/* Status Badge */}
              {!method.available && (
                <div
                  className="
                  px-3 py-1.5 
                  bg-red-100 
                  border border-red-300 
                  rounded-full
                  text-red-600 text-xs sm:text-sm font-medium
                "
                >
                  غیرفعال
                </div>
              )}
            </div>

            {/* Wallet Warning - Better styling */}
            {method.id === "wallet" &&
              !hasEnoughWalletBalance &&
              isWalletEnabled && (
                <div
                  className="
                mt-5 
                p-4 
                bg-red-50 
                border-r-4 border-red-500 
                rounded-lg
                animate-in slide-in-from-top duration-300
              "
                >
                  <p className="text-red-700 text-xs sm:text-base leading-relaxed">
                    ⚠️ برای استفاده از این روش، ابتدا کیف پول خود را شارژ کنید.
                    <br />
                    <span className="font-bold">
                      کمبود: {(amount - walletBalance).toLocaleString()} تومان
                    </span>
                  </p>
                </div>
              )}
          </div>
        ))}
      </div>

      {/* Action Button - Improved design */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleConfirm}
          disabled={!selectedMethod}
          className={`
            flex items-center justify-center gap-3
            px-10 sm:px-12 py-2 sm:py-3
            rounded-xl sm:rounded-2xl
            font-bold text-base sm:text-lg
            transition-all duration-300
            min-w-[200px] sm:min-w-[240px]
            ${
              selectedMethod
                ? `
                bg-gradient-to-l from-[#0A1D37] to-[#4DBFF0] 
                text-white 
                hover:opacity-90 
                hover:shadow-2xl
                hover:scale-105
                active:scale-95
                shadow-lg
              `
                : `
                bg-gray-200 
                text-gray-400 
                cursor-not-allowed
                shadow-none
              `
            }
          `}
        >
          <FaCheck className="text-lg" />
          ادامه پرداخت
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
