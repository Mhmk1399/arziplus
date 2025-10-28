"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { FaCheckCircle } from "react-icons/fa";
import { ReactNode } from "react";

interface CredentialsWithProgressProps {
  children: ReactNode;
  currentStep: "security" | "national" | "contact" | "banking";
}

const CredentialsWithProgress = ({
  children,
  currentStep,
}: CredentialsWithProgressProps) => {
  const { user } = useCurrentUser();

  if (!user) return <>{children}</>;

  const steps = [
    {
      id: "security",
      hash: "securities",
      label: "امنیت",
      completed: !!user.username,
    },
    {
      id: "national",
      hash: "nationalCredentials",
      label: "مدارک",
      completed: !!(
        user.nationalCredentials?.firstName &&
        user.nationalCredentials?.lastName &&
        user.nationalCredentials?.nationalCode
      ),
    },
    {
      id: "contact",
      hash: "contactInfo",
      label: "تماس",
      completed: !!user.contactInfo?.mobilePhone,
    },
    {
      id: "banking",
      hash: "bankingInfo",
      label: "بانکی",
      completed: !!(
        user.bankingInfo?.accountNumber && user.bankingInfo?.shabaNumber
      ),
    },
  ];

  const handleStepClick = (hash: string) => {
    window.location.hash = hash;
  };

  const completedCount = steps.filter((s) => s.completed).length;
  const percentage = Math.round((completedCount / 4) * 100);
  const isComplete = percentage === 100;

  return (
    <div className="max-w-7xl mx-auto mt-2">
      {/* Progress Bar - Hidden when complete */}
      {!isComplete && (
        <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-[#0A1D37]">
              پیشرفت احراز هویت
            </span>
            <span className="text-lg font-bold text-[#0A1D37]">
              {percentage}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative w-full bg-gray-200 rounded-full h-2 mb-3">
            <div
              className="absolute top-0 right-0 h-full bg-gradient-to-l from-[#0A1D37] to-[#4DBFF0] rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-4 gap-2">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.hash)}
                className={`text-center p-2 rounded-lg transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                  step.completed
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : step.id === currentStep
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  {step.completed && <FaCheckCircle className="text-xs" />}
                  <span className="text-xs font-semibold">{step.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Original Component */}
      {children}
    </div>
  );
};

export default CredentialsWithProgress;
