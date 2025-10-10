"use client";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaUser, FaLock, FaPhone } from "react-icons/fa";
import { MdCurrencyExchange } from "react-icons/md";
import VerificationForm from "./VerificationForm";
import toast from "react-hot-toast";

interface AuthFormProps {
  type: "login" | "register";
  onSubmit: (data: {firstName: string, lastName: string, phone: string, password: string, email?: string}) => void;
  loading: boolean;
  phone: string;
}

export default function AuthForm({ type, onSubmit, loading, phone }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: phone,
    password: "",
    email: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = await fetch("/api/sms/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    if (res.ok) {
      setStep('verify');
    } else {
      const error = await res.json();
      toast.error(error.error);
    }
  };

  if (step === 'verify') {
    return (
      <VerificationForm
        phone={phone}
        onVerified={() => onSubmit(formData)}
        onBack={() => setStep('form')}
        loading={loading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-100">
          {/* Logo */}
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
              {type === "login" ? "ورود به حساب کاربری" : "ایجاد حساب کاربری"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {type === "register" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <FaUser className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="نام"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full pr-12 pl-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
                <div className="relative">
                  <FaUser className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="نام خانوادگی"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full pr-12 pl-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <FaPhone className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                placeholder="شماره تلفن"
                value={phone}
                className="w-full pr-12 pl-4 py-4 border border-gray-200 rounded-xl bg-gray-50 text-gray-600"
                disabled
              />
            </div>

            <div className="relative">
              <FaLock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="رمز عبور"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full pr-12 pl-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold disabled:opacity-50"
            >
              {loading ? "در حال پردازش..." : type === "login" ? "ورود" : "ثبت نام"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {type === "login" ? "حساب کاربری ندارید؟" : "حساب کاربری دارید؟"}
              <a
                href={type === "login" ? "/auth/register" : "/auth/login"}
                className="text-blue-600 hover:text-blue-700 font-semibold mr-2"
              >
                {type === "login" ? "ثبت نام" : "ورود"}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}