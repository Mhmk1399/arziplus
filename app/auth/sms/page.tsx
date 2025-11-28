"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FaPhone,
  FaKey,
  FaSpinner,
  FaIdCard,
  FaUser,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { showToast } from "@/utilities/toast";
import { estedadBold } from "@/next-persian-fonts/estedad";
import Link from "next/link";

// Loading component for Suspense fallback
function SMSAuthLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    </div>
  );
}

// Main SMS Auth component that uses useSearchParams
function SMSAuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSignupMode, setIsSignupMode] = useState(true); // Toggle between signup and login
  const [step, setStep] = useState<
    "nationalCode" | "phone" | "verification" | "profile" | "nationalVerify"
  >("nationalCode");
  const [nationalCode, setNationalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [userId, setUserId] = useState("");
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [needsNationalVerification, setNeedsNationalVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [redirectUrl, setRedirectUrl] = useState<string>("/dashboard");
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [shahkarVerified, setShahkarVerified] = useState(false);
  const [showShahkarModal, setShowShahkarModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errors, setErrors] = useState<{
    nationalCode?: string;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
  }>({});

  // Capture redirect URL and referral code from query params
  useEffect(() => {
    const redirect = searchParams.get("redirect");
    const ref = searchParams.get("ref");
    const referrer = document.referrer;

    // Store referral code if present
    if (ref) {
      setReferralCode(ref);
      showToast.info("شما از طریق لینک دعوت وارد شده‌اید");
    }

    const storedRedirect = localStorage.getItem("redirectAfterAuth");

    if (storedRedirect) {
      setRedirectUrl(storedRedirect);
    } else if (redirect) {
      setRedirectUrl(decodeURIComponent(redirect));
    } else if (referrer && !referrer.includes("/auth")) {
      // Extract path from referrer if it's from the same domain
      try {
        const referrerUrl = new URL(referrer);
        if (referrerUrl.origin === window.location.origin) {
          setRedirectUrl(referrerUrl.pathname + referrerUrl.search);
        }
      } catch {
        // Keep default redirect
      }
    }
  }, [searchParams]);

  // Validate national code format and checksum
  const validateNationalCode = (code: string): boolean => {
    if (!/^\d{10}$/.test(code)) return false;

    const digits = code.split("").map(Number);
    const checksum =
      digits.reduce((sum, digit, index) => {
        if (index < 9) return sum + digit * (10 - index);
        return sum;
      }, 0) % 11;

    const lastDigit = digits[9];
    return checksum < 2 ? lastDigit === checksum : lastDigit === 11 - checksum;
  };

  // Step 1: Shahkar Verification
  const handleShahkarVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!nationalCode.trim()) {
      newErrors.nationalCode = "کد ملی الزامی است";
    } else if (!validateNationalCode(nationalCode)) {
      newErrors.nationalCode = "کد ملی معتبر نیست";
    }

    if (!phone.trim()) {
      newErrors.phoneNumber = "شماره موبایل الزامی است";
    } else if (!/^09\d{9}$/.test(phone)) {
      newErrors.phoneNumber = "فرمت شماره موبایل صحیح نیست (09xxxxxxxxx)";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach((error) => showToast.error(error));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/verification/shahkar-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nationalCode,
          phoneNumber: phone,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "خطا در تایید اطلاعات");
      }

      if (result.verified) {
        setShahkarVerified(true);
        setShowShahkarModal(true);
        showToast.success("✅ کد ملی و شماره موبایل با هم مطابقت دارند");

        // Auto close modal and proceed after 2 seconds
        setTimeout(() => {
          setShowShahkarModal(false);
          handleSendOTP();
        }, 2000);
      } else {
        showToast.error("❌ کد ملی و شماره موبایل با هم مطابقت ندارند");
      }
    } catch (error: any) {
      console.error("Shahkar verification error:", error);
      showToast.error(error.message || "خطا در تایید اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  // Send OTP after Shahkar verification
  const handleSendOTP = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phone,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "خطا در ارسال کد تایید");
      }

      setUserId(result.userId);
      setIsExistingUser(result.isExistingUser);
      setStep("verification");
      showToast.success("کد تایید به شماره شما ارسال شد");

      // Start countdown timer
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
    } catch (error: any) {
      console.error("Send OTP error:", error);
      showToast.error(error.message || "خطا در ارسال کد تایید");
    } finally {
      setLoading(false);
    }
  };

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
        setNeedsNationalVerification(data.needsNationalVerification || false);
        
        // If existing user needs national verification, ask for national code first
        if (data.needsNationalVerification && !isSignupMode) {
          setStep("nationalVerify");
          showToast.info("لطفاً کد ملی خود را برای تایید هویت وارد کنید");
        } else {
          setStep("verification");
          showToast.success(data.message);
        }

        // Start countdown only if not going to national verify step
        if (!data.needsNationalVerification || isSignupMode) {
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
        }
      } else {
        showToast.error(data.error);
      }
    } catch (error) {
      console.log(error);
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
        body: JSON.stringify({
          phone,
          code: verificationCode,
          userId,
          referralCode: referralCode, // Send referral code if present
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token
        console.log("Storing token:", data.token?.substring(0, 20) + "...");
        localStorage.setItem("authToken", data.token);

        // Check if new user in signup mode and Shahkar was verified - show profile step
        if (!isExistingUser && shahkarVerified && isSignupMode) {
          showToast.success("✅ شماره موبایل با موفقیت تایید شد");
          setStep("profile");
          setLoading(false);
          return;
        }

        // Clear stored redirect
        localStorage.removeItem("redirectAfterAuth");

        const finalRedirect =
          redirectUrl !== "/dashboard" ? redirectUrl : data.redirectTo;
        console.log("Token stored, redirecting to:", finalRedirect);

        // Show success message with redirect info
        if (referralCode && !isExistingUser) {
          showToast.success("ثبت نام موفق! شما از طریق لینک دعوت وارد شدید");
        } else if (redirectUrl !== "/dashboard") {
          showToast.success(` ... در حال انتقال به صفحه قبلی`, {
            duration: 3000,
          });
        } else {
          showToast.success(data.message);
        }

        // Trigger navbar refresh
        window.dispatchEvent(new CustomEvent("userLoggedIn"));

        // Redirect to previous page or dashboard
        setTimeout(() => {
          router.push(finalRedirect);
        }, 1000);
      } else {
        showToast.error(data.error);
      }
    } catch (error) {
      console.log(error);
      showToast.error("خطا در تایید کد");
    } finally {
      if (step !== "profile") {
        setLoading(false);
      }
    }
  };

  // Step 4: Complete profile with names
  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "نام الزامی است";
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = "نام باید حداقل 2 کاراکتر باشد";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "نام خانوادگی الزامی است";
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = "نام خانوادگی باید حداقل 2 کاراکتر باشد";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach((error) => showToast.error(error));
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch("/api/verification/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          nationalNumber: nationalCode,
          phoneNumber: phone,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "خطا در ثبت اطلاعات");
      }

      showToast.success("✅ اطلاعات با موفقیت ثبت شد");

      // Clear stored redirect
      localStorage.removeItem("redirectAfterAuth");

      const finalRedirect =
        redirectUrl !== "/dashboard" ? redirectUrl : "/dashboard";

      // Trigger navbar refresh
      window.dispatchEvent(new CustomEvent("userLoggedIn"));

      // Redirect
      setTimeout(() => {
        router.push(finalRedirect);
      }, 1500);
    } catch (error: any) {
      console.error("Complete profile error:", error);
      showToast.error(error.message || "خطا در ثبت اطلاعات");
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
      console.log(error);
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

  // Handle national verification for existing users during login
  const handleNationalVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateNationalCode(nationalCode)) {
      showToast.error("کد ملی معتبر نیست");
      return;
    }

    setLoading(true);

    try {
      // Verify with Shahkar
      const shahkarResponse = await fetch("/api/verification/shahkar-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nationalCode,
          phoneNumber: phone,
        }),
      });

      const shahkarResult = await shahkarResponse.json();

      if (!shahkarResponse.ok || !shahkarResult.verified) {
        showToast.error("کد ملی با شماره موبایل شما مطابقت ندارد");
        setLoading(false);
        return;
      }

      showToast.success("✅ کد ملی با موفقیت تایید شد");

      // Update national credentials status
      const token = localStorage.getItem("authToken");
      if (token) {
        await fetch("/api/verification/update-national-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nationalCode,
            phoneNumber: phone,
          }),
        });
      }

      // Proceed to verification step
      setStep("verification");
      
      // Start countdown
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

    } catch (error: any) {
      console.error("National verification error:", error);
      showToast.error(error.message || "خطا در تایید کد ملی");
    } finally {
      setLoading(false);
    }
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
                  i % 3 === 0 ? "#0A1D37" : i % 3 === 1 ? "#4DBFF0" : "#FFFFFF"
                }, 
                ${i % 3 === 0 ? "#0A1D37" : i % 3 === 1 ? "#4DBFF0" : "#FFFFFF"}
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
        <div className="absolute bottom-20 left-16 w-20 h-20 border-2 border-[#0A1D37]/20 rotate-45 animate-pulse"></div>
        <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-gradient-to-br from-[#0A1D37]/10 to-[#4DBFF0]/10 rounded-lg rotate-12 animate-bounce"></div>
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
                className={`inline-flex items-center justify-center md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-[#0A1D37]/20 to-[#4DBFF0]/20 backdrop-blur-sm border border-[#0A1D37]/30 shadow-lg text-[#0A1D37]`}
              >
                {step === "nationalCode" ? (
                  <FaIdCard className="text-xl" />
                ) : step === "verification" ? (
                  <FaKey className="text-xl" />
                ) : step === "profile" ? (
                  <FaUser className="text-xl" />
                ) : (
                  <FaPhone className="text-xl" />
                )}
              </div>
            </div>

            <h1
              className={`text-xl md:text-2xl text-[#0A1D37] ${estedadBold.className} mb-2 relative z-10`}
            >
              {step === "nationalCode"
                ? "ثبت نام"
                : step === "verification"
                ? "تایید شماره تلفن"
                : step === "profile"
                ? "تکمیل اطلاعات"
                : step === "nationalVerify"
                ? "احراز هویت"
                : isSignupMode
                ? "ثبت نام"
                : "ورود"}
            </h1>

            {/* Toggle Button for Signup/Login - Only show on initial steps */}

            <p className="text-[#A0A0A0] text-base leading-relaxed relative z-10 max-w-md mx-auto">
              {step === "nationalCode" ? (
                "کد ملی و شماره موبایل خود را وارد کنید"
              ) : step === "verification" ? (
                <>
                  کد تایید ارسال شده به{" "}
                  <strong className="font-bold text-[#0A1D37]">{phone}</strong>{" "}
                  را وارد کنید
                </>
              ) : step === "profile" ? (
                "نام و نام خانوادگی خود را وارد کنید"
              ) : step === "nationalVerify" ? (
                "برای امنیت حساب، کد ملی خود را تایید کنید"
              ) : redirectUrl !== "/dashboard" ? (
                "برای ادامه، شماره تلفن خود را وارد کنید"
              ) : (
                "شماره تلفن خود را وارد کنید"
              )}
            </p>

            {redirectUrl !== "/dashboard" && (
              <div className="mt-4 p-3 bg-gradient-to-r from-[#0A1D37]/70 to-[#4DBFF0]/90 rounded-xl border border-[#0A1D37]/20">
                <p className="text-[#ffffff] text-sm font-medium">
                  پس از ورود موفق، به صفحه قبلی بازمیگردید
                </p>
              </div>
            )}

            {step === "verification" && (
              <div className="mt-6">
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border ${
                    isExistingUser
                      ? "bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30 text-gray-800"
                      : "bg-gradient-to-r from-[#0A1D37]/20 to-[#4DBFF0]/20 border-[#0A1D37]/30 text-[#0A1D37]"
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

          {/* National Code Input Form - Only for Signup */}
          {step === "nationalCode" && isSignupMode && (
            <form
              onSubmit={handleShahkarVerification}
              className="relative z-10 space-y-6"
            >
              <div className="relative">
                <FaIdCard className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0A1D37]" />
                <input
                  type="text"
                  placeholder="کد ملی (10 رقم)"
                  value={nationalCode}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                    setNationalCode(value);
                    setErrors({ ...errors, nationalCode: undefined });
                  }}
                  className={`w-full pr-12 pl-4 py-4 bg-white/10 border ${
                    errors.nationalCode
                      ? "border-red-500"
                      : "border-[#0A1D37]/30"
                  } text-[#0A1D37] rounded-2xl focus:ring-2 focus:ring-[#4DBFF0] focus:border-[#4DBFF0] focus:outline-none backdrop-blur-sm transition-all duration-300 placeholder:text-[#A0A0A0] text-left hover:bg-white/15`}
                  maxLength={10}
                  dir="ltr"
                  required
                />
              </div>

              <div className="relative">
                <FaPhone className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0A1D37]" />
                <input
                  type="tel"
                  placeholder="09123456789"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 11);
                    setPhone(value);
                    setErrors({ ...errors, phoneNumber: undefined });
                  }}
                  className={`w-full pr-12 pl-4 py-4 bg-white/10 border ${
                    errors.phoneNumber
                      ? "border-red-500"
                      : "border-[#0A1D37]/30"
                  } text-[#0A1D37] rounded-2xl focus:ring-2 focus:ring-[#4DBFF0] focus:border-[#4DBFF0] focus:outline-none backdrop-blur-sm transition-all duration-300 placeholder:text-[#A0A0A0] text-left hover:bg-white/15`}
                  maxLength={11}
                  dir="ltr"
                  required
                />
              </div>

              <div className="bg-white/10 border border-[#4DBFF0]/30 rounded-2xl p-4 flex items-start gap-3 backdrop-blur-sm">
                <FaExclamationTriangle className="text-[#4DBFF0] mt-1 flex-shrink-0" />
                <p className="text-sm text-[#A0A0A0]">
                  کد ملی و شماره موبایل شما از طریق سامانه شاهکار وزارت ارتباطات
                  تایید می‌شود
                </p>
              </div>

              <button
                type="submit"
                disabled={
                  loading || nationalCode.length !== 10 || phone.length !== 11
                }
                className="w-full py-4 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-[#FFFFFF] rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center backdrop-blur-sm hover:scale-105 transform"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin ml-2" />
                    در حال تایید...
                  </>
                ) : (
                  <>
                    تایید و ادامه
                    <FaArrowLeft className="mr-2" />
                  </>
                )}
              </button>
              <div className="mt-3 mb-2">
                <button
                  type="button"
                  onClick={() => {
                    const newMode = !isSignupMode;
                    setIsSignupMode(newMode);
                    setStep(newMode ? "nationalCode" : "phone");
                    setErrors({});
                    setNationalCode("");
                    setPhone("");
                  }}
                  className="w-full py-4 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-[#FFFFFF] rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center backdrop-blur-sm hover:scale-105 transform"
                >
                  {isSignupMode
                    ? "قبلاً ثبت نام کرده‌اید؟ وارد شوید"
                    : "حساب کاربری ندارید؟ ثبت نام کنید"}
                </button>
              </div>
            </form>
          )}

          {/* National Verification Form - For Existing Users During Login */}
          {step === "nationalVerify" && !isSignupMode && (
            <form
              onSubmit={handleNationalVerification}
              className="relative z-10 space-y-6"
            >
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <FaExclamationTriangle className="text-yellow-600 mt-1 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">تکمیل احراز هویت</p>
                    <p>
                      برای امنیت حساب شما، لطفاً کد ملی خود را وارد کنید تا با
                      شماره موبایل شما تطابق داده شود.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <FaIdCard className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0A1D37]" />
                <input
                  type="text"
                  placeholder="کد ملی (10 رقم)"
                  value={nationalCode}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                    setNationalCode(value);
                  }}
                  className="w-full pr-12 pl-4 py-4 bg-white/10 border border-[#0A1D37]/30 text-[#0A1D37] rounded-2xl focus:ring-2 focus:ring-[#4DBFF0] focus:border-[#4DBFF0] focus:outline-none backdrop-blur-sm transition-all duration-300 placeholder:text-[#A0A0A0] text-left hover:bg-white/15"
                  maxLength={10}
                  dir="ltr"
                  required
                />
              </div>

              <div className="bg-white/10 border border-[#4DBFF0]/30 rounded-2xl p-4 flex items-start gap-3 backdrop-blur-sm">
                <FaCheckCircle className="text-[#4DBFF0] mt-1 flex-shrink-0" />
                <p className="text-sm text-[#A0A0A0]">
                  کد ملی شما از طریق سامانه شاهکار با شماره موبایل{" "}
                  <strong className="text-[#0A1D37]">{phone}</strong> تطابق داده
                  می‌شود
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || nationalCode.length !== 10}
                className="w-full py-4 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-[#FFFFFF] rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center backdrop-blur-sm hover:scale-105 transform"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin ml-2" />
                    در حال تایید...
                  </>
                ) : (
                  <>
                    تایید و ادامه
                    <FaArrowLeft className="mr-2" />
                  </>
                )}
              </button>

              {/* Back Button */}
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setNationalCode("");
                }}
                className="w-full py-3 text-[#A0A0A0] font-semibold bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm hover:scale-105 transform"
              >
                تغییر شماره تلفن
              </button>
            </form>
          )}

          {/* Phone Input Form - For Login Mode */}
          {step === "phone" && !isSignupMode && (
            <form
              onSubmit={handlePhoneSubmit}
              className="relative z-10 space-y-6"
            >
              <div className="relative">
                <FaPhone className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0A1D37]" />
                <input
                  type="tel"
                  placeholder="09123456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pr-12 pl-4 py-4 bg-white/10 border text-[#0A1D37] border-[#0A1D37]/30 rounded-2xl focus:ring-2 focus:ring-[#4DBFF0] focus:border-[#4DBFF0] focus:outline-none backdrop-blur-sm transition-all duration-300 placeholder:text-[#A0A0A0] text-left hover:bg-white/15"
                  maxLength={11}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || phone.length !== 11}
                className="w-full py-4 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-[#FFFFFF] rounded-2xl  transition-all duration-300 shadow-lg hover:shadow-2xl font-semibold  disabled:cursor-not-allowed flex items-center justify-center backdrop-blur-sm  hover:scale-105 transform"
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
                <FaKey className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0A1D37]" />
                <input
                  type="text"
                  name="otp"
                  autoComplete="one-time-code"
                  placeholder="123456"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full placeholder:text-xs text-lg pr-12 pl-4 py-4 bg-white/10 border border-[#0A1D37]/30 rounded-2xl focus:ring-2 focus:ring-[#4DBFF0] focus:border-[#4DBFF0] focus:outline-none backdrop-blur-sm transition-all duration-300 text-[#0A1D37] placeholder:text-[#A0A0A0] text-center   tracking-widest hover:bg-white/15"
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || verificationCode.length !== 6}
                className="w-full py-4 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-[#FFFFFF] rounded-2xl hover:from-green-700 hover:to-[#4DBFF0]/90 transition-all duration-300 shadow-lg hover:shadow-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center backdrop-blur-sm   hover:scale-105 transform"
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
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#0A1D37]/20 to-[#4DBFF0]/20 backdrop-blur-sm border border-[#0A1D37]/30">
                    <svg
                      className="w-4 h-4 text-[#0A1D37]"
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
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0A1D37]/20 to-[#4DBFF0]/20 text-[#0A1D37] rounded-full font-semibold hover:from-[#0A1D37]/30 hover:to-[#4DBFF0]/30 hover:text-[#FFFFFF] transition-all duration-300 backdrop-blur-sm border border-[#0A1D37]/30 disabled:opacity-50 hover:scale-105 transform"
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
                  setStep(isSignupMode ? "nationalCode" : "phone");
                  setVerificationCode("");
                  setCountdown(0);
                }}
                className="w-full py-3 text-[#A0A0A0] font-semibold bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm hover:scale-105 transform"
              >
                تغییر شماره تلفن
              </button>
            </form>
          )}

          {/* Profile Completion Form */}
          {step === "profile" && (
            <form
              onSubmit={handleCompleteProfile}
              className="relative z-10 space-y-6"
            >
              <div className="relative">
                <FaUser className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0A1D37]" />
                <input
                  type="text"
                  placeholder="نام"
                  value={firstName}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Zآ-ی\s]/g, "");
                    setFirstName(value);
                    setErrors({ ...errors, firstName: undefined });
                  }}
                  className={`w-full pr-12 pl-4 py-4 bg-white/10 border ${
                    errors.firstName ? "border-red-500" : "border-[#0A1D37]/30"
                  } text-[#0A1D37] rounded-2xl focus:ring-2 focus:ring-[#4DBFF0] focus:border-[#4DBFF0] focus:outline-none backdrop-blur-sm transition-all duration-300 placeholder:text-[#A0A0A0] hover:bg-white/15`}
                  required
                />
              </div>

              <div className="relative">
                <FaUser className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0A1D37]" />
                <input
                  type="text"
                  placeholder="نام خانوادگی"
                  value={lastName}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Zآ-ی\s]/g, "");
                    setLastName(value);
                    setErrors({ ...errors, lastName: undefined });
                  }}
                  className={`w-full pr-12 pl-4 py-4 bg-white/10 border ${
                    errors.lastName ? "border-red-500" : "border-[#0A1D37]/30"
                  } text-[#0A1D37] rounded-2xl focus:ring-2 focus:ring-[#4DBFF0] focus:border-[#4DBFF0] focus:outline-none backdrop-blur-sm transition-all duration-300 placeholder:text-[#A0A0A0] hover:bg-white/15`}
                  required
                />
              </div>

              <div className="bg-white/10 border border-green-500/30 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <FaCheckCircle />
                  <span className="font-bold text-sm">تایید شده</span>
                </div>
                <div className="text-xs text-[#A0A0A0] space-y-1">
                  <p>✓ کد ملی: {nationalCode}</p>
                  <p>✓ شماره موبایل: {phone}</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !firstName.trim() || !lastName.trim()}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-[#FFFFFF] rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center backdrop-blur-sm hover:scale-105 transform"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin ml-2" />
                    در حال ثبت...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="ml-2" />
                    ثبت نهایی و ورود
                  </>
                )}
              </button>
            </form>
          )}

          {/* Shahkar Success Modal */}
          {showShahkarModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="text-5xl text-green-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-[#0A1D37]">
                  تایید موفق
                </h3>
                <p className="text-gray-600">
                  کد ملی و شماره موبایل شما با موفقیت از طریق سامانه شاهکار
                  تایید شد
                </p>
                <div className="mt-6">
                  <FaSpinner className="animate-spin text-3xl text-[#4DBFF0] mx-auto" />
                  <p className="text-sm text-gray-500 mt-2">
                    در حال ارسال کد تایید...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Glow Effect */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#0A1D37]/20 via-[#4DBFF0]/20 to-[#0A1D37]/20 blur-sm opacity-50 -z-10"></div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-center mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20">
            <svg
              className="w-4 h-4 text-[#0A1D37]"
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
              <Link
                href="/terms-and-conditions"
                className="text-[#0A1D37] hover:text-[#4DBFF0] mx-1 transition-colors duration-300"
              >
                {""} قوانین و مقررات {""}
              </Link>
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

// Main page component with Suspense wrapper
export default function SMSAuthPage() {
  return (
    <Suspense fallback={<SMSAuthLoading />}>
      <SMSAuthContent />
    </Suspense>
  );
}
