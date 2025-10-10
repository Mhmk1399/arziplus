"use client";
import PhoneVerificationFlow from "@/components/auth/PhoneVerificationForm";
import router from "next/router";

export default function RegisterPage() {
  const handlePhoneVerified = (phone: string, action: "login" | "register") => {
    router.push("/admin");
    console.log("Phone verified:", phone, "Action:", action);
  };

  return <PhoneVerificationFlow onPhoneVerified={handlePhoneVerified} />;
}
