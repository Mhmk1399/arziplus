"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PhoneVerificationForm from "@/components/auth/PhoneVerificationForm";
import AuthForm from "@/components/auth/AuthForm";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [step, setStep] = useState<'phone' | 'form'>('phone');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePhoneVerified = (verifiedPhone: string, action: 'login' | 'register') => {
    if (action === 'register') {
      router.push('/auth/register');
      return;
    }
    setPhone(verifiedPhone);
    setStep('form');
  };

  const handleLogin = async (data: { phone: string; password: string }) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, phone }),
      });

      const result = await res.json();

      if (res.ok) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        toast.success("ورود موفقیت آمیز بود");
        router.push("/dashboard");
      } else {
        toast.error(result.error || "خطا در ورود");
      }
    } catch (error) {
      console.log(error)
      toast.error("خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  if (step === 'phone') {
    return <PhoneVerificationForm onPhoneVerified={handlePhoneVerified} />;
  }

  return <AuthForm type="login" onSubmit={handleLogin} loading={loading} phone={phone} />;
}