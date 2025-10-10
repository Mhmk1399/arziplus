"use client";
import { useState, useEffect } from "react";
import { FaKey } from "react-icons/fa";
import { MdCurrencyExchange } from "react-icons/md";
import toast from "react-hot-toast";

interface VerificationFormProps {
  phone: string;
  onVerified: () => void;
  onBack: () => void;
  loading: boolean;
}

export default function VerificationForm({ phone, onVerified, onBack, loading }: VerificationFormProps) {
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(120);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch("/api/sms/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });

      if (res.ok) {
        toast.success("کد با موفقیت تایید شد");
        onVerified();
      } else {
        const error = await res.json();
        toast.error(error.error);
      }
    } catch (error) {
      toast.error("خطا در اتصال به سرور");
    }
  };

  const handleResend = async () => {
    try {
      const res = await fetch("/api/sms/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      
      if (res.ok) {
        toast.success("کد مجدداً ارسال شد");
        setCountdown(120);
        setCanResend(false);
      } else {
        const error = await res.json();
        toast.error(error.error);
      }
    } catch (error) {
      toast.error("خطا در ارسال کد");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-blue-600 via-blue-400 to-blue-500 rounded-2xl shadow-lg">
                <MdCurrencyExchange className="text-white text-4xl" />
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              تایید شماره تلفن
            </h1>
            <p className="text-gray-600 mt-2">
              کد تایید به شماره {phone} ارسال شد
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="relative">
              <FaKey className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="کد تایید"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full pr-12 pl-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-center text-2xl tracking-widest"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold disabled:opacity-50"
            >
              {loading ? "در حال تایید..." : "تایید کد"}
            </button>
          </form>

          <div className="mt-6 text-center space-y-4">
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                ارسال مجدد کد
              </button>
            ) : (
              <p className="text-gray-600">
                ارسال مجدد کد در {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
              </p>
            )}
            
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-700"
            >
              بازگشت
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}