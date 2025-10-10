"use client";
import { useState } from "react";
import { FaPhone } from "react-icons/fa";
import { MdCurrencyExchange } from "react-icons/md";
import toast from "react-hot-toast";

interface PhoneVerificationFormProps {
  onPhoneVerified: (phone: string, action: 'login' | 'register') => void;
}

export default function PhoneVerificationForm({ onPhoneVerified }: PhoneVerificationFormProps) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/sms/check-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const result = await res.json();

      if (res.ok) {
        onPhoneVerified(phone, result.action);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.log(error)
      toast.error("خطا در اتصال به سرور");
    } finally {
      setLoading(false);
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
              ارزی پلاس
            </h1>
            <p className="text-gray-600 mt-2">
              ورود یا ثبت نام با شماره تلفن
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <FaPhone className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                placeholder="شماره تلفن (09xxxxxxxxx)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pr-12 pl-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || phone.length !== 11}
              className="w-full py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold disabled:opacity-50"
            >
              {loading ? "در حال بررسی..." : "ادامه"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}