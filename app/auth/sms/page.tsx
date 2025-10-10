"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPhone, FaKey, FaSpinner } from "react-icons/fa";
import { showToast } from "@/utilities/toast";
import { estedadBold } from "@/next-persian-fonts/estedad";

export default function SMSAuthPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "verification">("phone");
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [userId, setUserId] = useState("");
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^09\d{9}$/.test(phone)) {
      showToast.error("فرمت شماره تلفن صحیح نیست");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserId(data.userId);
        setIsExistingUser(data.isExistingUser);
        setStep("verification");
        showToast.success(data.message);

        // Start countdown
        setCountdown(120); // 2 minutes
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        showToast.error(data.error);
      }
    } catch (error) {
      showToast.error("خطا در ارسال پیامک");
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (verificationCode.length !== 6) {
      showToast.error("کد تایید باید ۶ رقم باشد");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: verificationCode, userId }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token
        localStorage.setItem("authToken", data.token);

        showToast.success(data.message);

        // Redirect based on profile completeness
        setTimeout(() => {
          router.push(data.redirectTo);
        }, 1000);
      } else {
        showToast.error(data.error);
      }
    } catch (error) {
      showToast.error("خطا در تایید کد");
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (countdown > 0) return;

    setLoading(true);
    try {
      const response = await fetch("/api/auth/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast.success("کد جدید ارسال شد");
        setCountdown(120);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        showToast.error(data.error);
      }
    } catch (error) {
      showToast.error("خطا در ارسال مجدد");
    } finally {
      setLoading(false);
    }
  };

  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      dir="rtl"
      style={{
        background: `
          #0A1D37,
          radial-gradient(circle at 20% 80%, rgba(255, 122, 0, 0.15) 0%, transparent 40%),
          radial-gradient(circle at 80% 20%, rgba(77, 191, 240, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(255, 122, 0, 0.08) 0%, transparent 60%),
          linear-gradient(135deg, rgba(255, 122, 0, 0.05) 0%, rgba(77, 191, 240, 0.05) 100%)
        `,
      }}
    >
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="floating-element absolute opacity-20"
            style={{
              left: `${10 + ((i * 8) % 80)}%`,
              top: `${15 + ((i * 7) % 70)}%`,
              width: `${8 + (i % 4) * 6}px`,
              height: `${8 + (i % 4) * 6}px`,
              background: `linear-gradient(45deg, 
                ${
                  i % 3 === 0 ? "#FF7A00" : i % 3 === 1 ? "#4DBFF0" : "#FFFFFF"
                }, 
                ${i % 3 === 0 ? "#FF7A00" : i % 3 === 1 ? "#4DBFF0" : "#FFFFFF"}
              )`,
              borderRadius: i % 2 === 0 ? "50%" : "6px",
              filter: "blur(1px)",
              animation: `float ${4 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}

        {/* Geometric Shapes */}
        <div className="absolute top-20 right-16 w-24 h-24 border border-[#4DBFF0]/20 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-20 left-16 w-20 h-20 border-2 border-[#FF7A00]/20 rotate-45 animate-pulse"></div>
        <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-gradient-to-br from-[#FF7A00]/10 to-[#4DBFF0]/10 rounded-lg rotate-12 animate-bounce"></div>
      </div>

      {/* Glass Morphism Overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>

      <div className="relative z-10 w-full max-w-md px-4 mt-24 md:py-12">
        <div className="relative rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 shadow-2xl p-8">
          {/* Subtle Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-5 rounded-3xl"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,122,0,0.15) 1px, transparent 0)`,
              backgroundSize: "20px 20px",
            }}
          ></div>
          {/* Header */}
          <div className="relative z-10 text-center mb-8">
            <div className="mb-6">
              <div
                className={`inline-flex items-center justify-center md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-[#FF7A00]/20 to-[#4DBFF0]/20 backdrop-blur-sm border border-[#FF7A00]/30 shadow-lg text-[#FF7A00]`}
              >
                {step === "phone" ? (
                  <FaPhone className="text-xl" />
                ) : (
                  <FaKey className="text-xl" />
                )}
              </div>
            </div>

            <h1
              className={`text-xl md:text-2xl text-[#0A1D37] ${estedadBold.className} mb-2 relative z-10`}
            >
              {step === "phone" ? "ورود / ثبت نام" : "تایید شماره تلفن"}
            </h1>

            <p className="text-[#A0A0A0] text-base leading-relaxed relative z-10 max-w-md mx-auto">
              {step === "phone"
                ? "شماره تلفن خود را وارد کنید"
                : `کد تایید ارسال شده به ${phone} را وارد کنید`}
            </p>

            {step === "verification" && (
              <div className="mt-6">
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border ${
                    isExistingUser
                      ? "bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30 text-green-400"
                      : "bg-gradient-to-r from-[#FF7A00]/20 to-[#4DBFF0]/20 border-[#FF7A00]/30 text-[#FF7A00]"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    {isExistingUser
                      ? "کاربر موجود - ورود به حساب"
                      : "کاربر جدید - ایجاد حساب"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Phone Input Form */}
          {step === "phone" && (
            <form
              onSubmit={handlePhoneSubmit}
              className="relative z-10 space-y-6"
            >
              <div className="relative">
                <FaPhone className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#FF7A00]" />
                <input
                  type="tel"
                  placeholder="09123456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pr-12 pl-4 py-4 bg-white/10 border text-[#0A1D37] border-[#FF7A00]/30 rounded-2xl focus:ring-2 focus:ring-[#4DBFF0] focus:border-[#4DBFF0] focus:outline-none backdrop-blur-sm transition-all duration-300 placeholder:text-[#A0A0A0] text-left hover:bg-white/15"
                  maxLength={11}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || phone.length !== 11}
                className="w-full py-4 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] text-[#FFFFFF] rounded-2xl hover:from-[#FF7A00]/90 hover:to-[#4DBFF0]/90 transition-all duration-300 shadow-lg hover:shadow-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center backdrop-blur-sm border border-[#FF7A00]/30 hover:scale-105 transform"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin ml-2" />
                    در حال ارسال...
                  </>
                ) : (
                  "ارسال کد تایید"
                )}
              </button>
            </form>
          )}

          {/* Verification Code Form */}
          {step === "verification" && (
            <form
              onSubmit={handleVerificationSubmit}
              className="relative z-10 space-y-6"
            >
              <div className="relative">
                <FaKey className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#FF7A00]" />
                <input
                  type="text"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full pr-12 pl-4 py-4 bg-white/10 border border-[#FF7A00]/30 rounded-2xl focus:ring-2 focus:ring-[#4DBFF0] focus:border-[#4DBFF0] focus:outline-none backdrop-blur-sm transition-all duration-300 text-[#0A1D37] placeholder:text-[#A0A0A0] text-center text-2xl tracking-widest hover:bg-white/15"
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || verificationCode.length !== 6}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-[#4DBFF0] text-[#FFFFFF] rounded-2xl hover:from-green-700 hover:to-[#4DBFF0]/90 transition-all duration-300 shadow-lg hover:shadow-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center backdrop-blur-sm border border-green-600/30 hover:scale-105 transform"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin ml-2" />
                    در حال تایید...
                  </>
                ) : (
                  "تایید و ورود"
                )}
              </button>

              {/* Resend Code */}
              <div className="text-center">
                {countdown > 0 ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF7A00]/20 to-[#4DBFF0]/20 backdrop-blur-sm border border-[#FF7A00]/30">
                    <svg
                      className="w-4 h-4 text-[#FF7A00]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-[#0A1D37]">
                      ارسال مجدد کد در {formatCountdown(countdown)}
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={resendCode}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF7A00]/20 to-[#4DBFF0]/20 text-[#FF7A00] rounded-full font-semibold hover:from-[#FF7A00]/30 hover:to-[#4DBFF0]/30 hover:text-[#FFFFFF] transition-all duration-300 backdrop-blur-sm border border-[#FF7A00]/30 disabled:opacity-50 hover:scale-105 transform"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    ارسال مجدد کد تایید
                  </button>
                )}
              </div>

              {/* Back Button */}
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setVerificationCode("");
                  setCountdown(0);
                }}
                className="w-full py-3 text-[#A0A0A0]   font-semibold bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm hover:scale-105 transform"
              >
                تغییر شماره تلفن
              </button>
            </form>
          )}
          {/* Glow Effect */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#FF7A00]/20 via-[#4DBFF0]/20 to-[#FF7A00]/20 blur-sm opacity-50 -z-10"></div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-center mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20">
            <svg
              className="w-4 h-4 text-[#FF7A00]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-[#A0A0A0] text-sm">
              با ورود یا ثبت نام، شما
              <a
                href="/terms"
                className="text-[#FF7A00] hover:text-[#4DBFF0] mx-1 transition-colors duration-300"
              >
                {""} قوانین و مقررات {""}
              </a>
              را می‌پذیرید
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
}
