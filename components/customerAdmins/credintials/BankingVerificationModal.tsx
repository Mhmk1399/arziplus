"use client";
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaCreditCard, FaUniversity } from "react-icons/fa";

interface BankingVerificationModalProps {
  isOpen: boolean;
  isVerifying: boolean;
  verificationResult: {
    verified: boolean;
    message: string;
    details?: {
      card?: {
        verified: boolean;
        error?: string;
      };
      sheba?: {
        verified: boolean;
        error?: string;
      };
    };
  } | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const BankingVerificationModal = ({
  isOpen,
  isVerifying,
  verificationResult,
  onConfirm,
  onCancel,
}: BankingVerificationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-tra">
      {/* Backdrop */}
      <div
        className="absolute  inset-0 bg-black/10 p bg-opacity-50 backdrop-blur-sm"
        onClick={!isVerifying ? onCancel : undefined}
      />

      {/* Modal */}
      <div className="relative  rounded-2xl shadow-2xl max-w-xl w-full m-4 p-8 animate-in fade-in my-4  duration-300">
        {/* Verifying State */}
        {isVerifying && (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <FaSpinner className="text-6xl text-indigo-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-indigo-200 rounded-full animate-ping" />
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              در حال احراز هویت اطلاعات بانکی
            </h2>
            <p className="text-gray-600">
              لطفاً صبر کنید، در حال بررسی تطابق اطلاعات بانکی با کد ملی شما هستیم...
            </p>
            <div className="mt-6 flex justify-center">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}

        {/* Success State */}
        {!isVerifying && verificationResult?.verified && (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <FaCheckCircle className="text-6xl text-green-600 animate-in zoom-in duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 border-4 border-green-200 rounded-full animate-ping" />
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-green-900 mb-3">
              احراز هویت موفق!
            </h2>
            <p className="text-gray-700 mb-6">{verificationResult.message}</p>

            {/* Verification Details */}
            <div className="space-y-3 mb-6">
              {verificationResult.details?.card && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-3">
                  <FaCreditCard className="text-green-600 text-xl flex-shrink-0" />
                  <div className="text-sm text-right flex-1">
                    <p className="font-semibold text-green-900">شماره کارت</p>
                    <p className="text-green-700">تایید شده ✓</p>
                  </div>
                </div>
              )}
              {verificationResult.details?.sheba && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-3">
                  <FaUniversity className="text-green-600 text-xl flex-shrink-0" />
                  <div className="text-sm text-right flex-1">
                    <p className="font-semibold text-green-900">شماره شبا</p>
                    <p className="text-green-700">تایید شده ✓</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-green-800">
                اطلاعات بانکی شما با کد ملی ثبت شده مطابقت دارد. اطلاعات بانکی شما به
                صورت خودکار تایید خواهد شد.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onConfirm}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                تایید و ذخیره
              </button>
              <button
                onClick={onCancel}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-200"
              >
                انصراف
              </button>
            </div>
          </div>
        )}

        {/* Failure State */}
        {!isVerifying && verificationResult && !verificationResult.verified && (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <FaTimesCircle className="text-6xl text-red-600 animate-in zoom-in duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 border-4 border-red-200 rounded-full animate-ping" />
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-red-900 mb-3">
              احراز هویت ناموفق
            </h2>
            <p className="text-gray-700 mb-6">{verificationResult.message}</p>

            {/* Verification Details */}
            <div className="space-y-3 mb-6">
              {verificationResult.details?.card && (
                <div className={`border rounded-xl p-3 flex items-center gap-3 ${
                  verificationResult.details.card.verified
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}>
                  <FaCreditCard className={`text-xl flex-shrink-0 ${
                    verificationResult.details.card.verified ? "text-green-600" : "text-red-600"
                  }`} />
                  <div className="text-sm text-right flex-1">
                    <p className={`font-semibold ${
                      verificationResult.details.card.verified ? "text-green-900" : "text-red-900"
                    }`}>شماره کارت</p>
                    <p className={verificationResult.details.card.verified ? "text-green-700" : "text-red-700"}>
                      {verificationResult.details.card.verified ? "تایید شده ✓" : "تایید نشد ✗"}
                    </p>
                    {verificationResult.details.card.error && (
                      <p className="text-xs text-red-600 mt-1">
                        {verificationResult.details.card.error}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {verificationResult.details?.sheba && (
                <div className={`border rounded-xl p-3 flex items-center gap-3 ${
                  verificationResult.details.sheba.verified
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}>
                  <FaUniversity className={`text-xl flex-shrink-0 ${
                    verificationResult.details.sheba.verified ? "text-green-600" : "text-red-600"
                  }`} />
                  <div className="text-sm text-right flex-1">
                    <p className={`font-semibold ${
                      verificationResult.details.sheba.verified ? "text-green-900" : "text-red-900"
                    }`}>شماره شبا</p>
                    <p className={verificationResult.details.sheba.verified ? "text-green-700" : "text-red-700"}>
                      {verificationResult.details.sheba.verified ? "تایید شده ✓" : "تایید نشد ✗"}
                    </p>
                    {verificationResult.details.sheba.error && (
                      <p className="text-xs text-red-600 mt-1">
                        {verificationResult.details.sheba.error}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-red-800 mb-3">
                اطلاعات بانکی وارد شده با کد ملی شما مطابقت ندارد. لطفاً موارد زیر
                را بررسی کنید:
              </p>
              <ul className="text-sm text-red-700 text-right space-y-2">
                <li>• شماره کارت یا شبا را به درستی وارد کرده‌اید؟</li>
                <li>• حساب بانکی متعلق به خودتان است؟</li>
                <li>• اطلاعات کد ملی در پروفایل شما صحیح است؟</li>
              </ul>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-yellow-800">
                در صورت ادامه، اطلاعات بانکی شما ثبت می‌شود اما باید توسط ادمین
                تایید شود.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onConfirm}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                ادامه و ذخیره
              </button>
              <button
                onClick={onCancel}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-200"
              >
                بازگشت و ویرایش
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankingVerificationModal;
