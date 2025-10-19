"use client";
import React, { useState } from "react";
import {
  FaCreditCard,
  FaUpload,
  FaCheck,
  FaTimes,
  FaCopy,
  FaInfoCircle,
  FaUniversity,
} from "react-icons/fa";
import { estedadBold } from "@/next-persian-fonts/estedad/index";
import FileUploaderModal from "@/components/FileUploaderModal";
import { showToast } from "@/utilities/toast";

interface CardPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: (receiptUrl: string) => void;
  amount: number;
  serviceName: string;
}

const CardPaymentModal: React.FC<CardPaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentComplete,
  amount,
  serviceName,
}) => {
  const [receiptUrl, setReceiptUrl] = useState<string>("");
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bank card information (this could be fetched from admin settings)
  const bankCardInfo = {
    cardNumber: "6037-9974-5555-1234", // This should come from admin settings
    cardHolder: "ارزی پلاس",
    bankName: "بانک ملی ایران",
    iban: "IR123456789012345678901234",
  };

  const handleFileUploaded = (fileUrl: string) => {
    setReceiptUrl(fileUrl);
    setIsFileModalOpen(false);
    showToast.success("رسید با موفقیت آپلود شد!");
  };

  const handleCopyCardNumber = () => {
    navigator.clipboard.writeText(bankCardInfo.cardNumber.replace(/-/g, ""));
    showToast.success("شماره کارت کپی شد");
  };

  const handleSubmit = async () => {
    if (!receiptUrl) {
      showToast.error("لطفاً رسید واریز را آپلود کنید");
      return;
    }

    setIsSubmitting(true);
    try {
      // Here you could validate the receipt or do additional processing
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate processing

      onPaymentComplete(receiptUrl);
      showToast.success("رسید واریز با موفقیت ثبت شد");
    } catch (error) {
      console.log("Error submitting receipt:", error);
      showToast.error("خطا در ثبت رسید");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-300"
        dir="rtl"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[95vh] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
          {/* Modal Header - Enhanced */}
          <div className="bg-gradient-to-l from-[#FF7A00] to-[#4DBFF0] p-5 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <FaCreditCard className="text-white text-2xl sm:text-3xl" />
                </div>
                <div>
                  <h2
                    className={`text-xl sm:text-2xl font-bold text-white ${estedadBold.className}`}
                  >
                    واریز کارت به کارت
                  </h2>
                  <p className="text-white/80 text-xs sm:text-sm mt-1">
                    پرداخت امن و سریع
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 sm:w-12 sm:h-12 text-white hover:bg-white/20 rounded-xl transition-all duration-300 flex items-center justify-center hover:rotate-90"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>

          {/* Modal Content - Scrollable */}
          <div className="p-5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 overflow-y-auto max-h-[calc(95vh-180px)] custom-scrollbar">
            {/* Service Info - Enhanced */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border-2 border-blue-200">
              <div className="flex items-start gap-3 mb-4">
                <FaInfoCircle className="text-blue-500 text-xl flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-bold text-[#0A1D37] mb-2 text-sm sm:text-base">
                    خدمت مورد نظر:
                  </h3>
                  <p className="text-[#0A1D37]/80 text-sm sm:text-base">
                    {serviceName}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t-2 border-blue-200">
                <span className="text-[#0A1D37]/70 text-sm sm:text-base font-medium">
                  مبلغ قابل پرداخت:
                </span>
                <div className="bg-white px-4 py-2 rounded-xl border-2 border-[#FF7A00]/30">
                  <span className="text-xl sm:text-2xl font-bold bg-gradient-to-l from-[#FF7A00] to-[#4DBFF0] bg-clip-text text-transparent">
                    {amount.toLocaleString()}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-[#0A1D37] mr-1">
                    تومان
                  </span>
                </div>
              </div>
            </div>

            {/* Bank Card Information - Enhanced */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 border-2 border-gray-300 shadow-lg">
              <div className="flex items-center gap-2 mb-4 sm:mb-5">
                <div className="w-10 h-10 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] rounded-xl flex items-center justify-center">
                  <FaCreditCard className="text-white text-lg" />
                </div>
                <h3 className="font-bold text-[#0A1D37] text-base sm:text-lg">
                  اطلاعات کارت مقصد
                </h3>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* Card Number - Enhanced */}
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border-2 border-[#4DBFF0]/30 hover:border-[#4DBFF0] transition-all duration-300 shadow-md">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm text-[#0A1D37]/60 mb-2 font-medium">
                        شماره کارت:
                      </p>
                      <p className="font-mono text-lg sm:text-xl lg:text-2xl font-bold text-[#0A1D37] tracking-wider">
                        {bankCardInfo.cardNumber}
                      </p>
                    </div>
                    <button
                      onClick={handleCopyCardNumber}
                      className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-[#4DBFF0]/10 text-[#4DBFF0] hover:bg-[#4DBFF0] hover:text-white rounded-xl transition-all duration-300 flex items-center justify-center group hover:scale-110 active:scale-95"
                      title="کپی شماره کارت"
                    >
                      <FaCopy className="text-lg sm:text-xl" />
                    </button>
                  </div>
                </div>

                {/* Card Holder & Bank - Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-white rounded-xl p-4 border-2 border-gray-200">
                    <p className="text-xs text-[#0A1D37]/60 mb-2 font-medium">
                      صاحب حساب:
                    </p>
                    <p className="font-bold text-[#0A1D37] text-sm sm:text-base">
                      {bankCardInfo.cardHolder}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border-2 border-gray-200 flex items-start gap-2">
                    <FaUniversity className="text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-[#0A1D37]/60 mb-2 font-medium">
                        بانک:
                      </p>
                      <p className="font-bold text-[#0A1D37] text-sm sm:text-base">
                        {bankCardInfo.bankName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions - Enhanced */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-md">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">📋</span>
                </div>
                <h4 className="font-bold text-amber-800 text-sm sm:text-base">
                  دستورالعمل پرداخت
                </h4>
              </div>
              <ol className="text-xs sm:text-sm text-amber-700 space-y-2 mr-2">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <span className="flex-1 pt-0.5">
                    مبلغ{" "}
                    <span className="font-bold">
                      {amount.toLocaleString()} تومان
                    </span>{" "}
                    را به شماره کارت فوق واریز کنید
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <span className="flex-1 pt-0.5">
                    عکس رسید واریز را گرفته و آپلود کنید
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <span className="flex-1 pt-0.5">
                    بر روی دکمه <span className="font-bold">تأیید پرداخت</span>{" "}
                    کلیک کنید
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    4
                  </span>
                  <span className="flex-1 pt-0.5">
                    پس از بررسی، درخواست شما پردازش خواهد شد
                  </span>
                </li>
              </ol>
            </div>

            {/* Receipt Upload - Enhanced */}
            <div className="space-y-3 sm:space-y-4 pb-12">
              <label className="flex items-center gap-2 font-bold text-[#0A1D37] text-sm sm:text-base">
                <FaUpload className="text-[#4DBFF0]" />
                آپلود رسید واریز
                <span className="text-red-500 text-lg">*</span>
              </label>

              {receiptUrl ? (
                <div className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg animate-in slide-in-from-top duration-300">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <FaCheck className="text-white text-lg" />
                      </div>
                      <div>
                        <span className="text-green-700 font-bold text-sm sm:text-base block">
                          رسید آپلود شد
                        </span>
                        <span className="text-green-600 text-xs">
                          فایل با موفقیت بارگذاری شد
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-green-700 bg-white border-2 border-green-300 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        مشاهده
                      </a>
                      <button
                        onClick={() => setReceiptUrl("")}
                        className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-red-700 bg-white border-2 border-red-300 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        حذف
                      </button>
                    </div>
                  </div>

                  {receiptUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                    <div className="mt-4 pt-4 border-t-2 border-green-200">
                      <img
                        src={receiptUrl}
                        alt="رسید واریز"
                        className="w-full max-w-sm mx-auto rounded-xl border-2 border-green-300 shadow-lg"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsFileModalOpen(true)}
                  className="group w-full flex flex-col items-center justify-center gap-3 p-6 sm:p-8 border-2 border-dashed border-[#4DBFF0] rounded-xl sm:rounded-2xl text-[#4DBFF0] hover:bg-[#4DBFF0]/10 hover:border-[#4DBFF0] transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#4DBFF0]/10 group-hover:bg-[#4DBFF0]/20 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <FaUpload className="text-2xl sm:text-3xl" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-sm sm:text-base mb-1">
                      کلیک کنید تا رسید را آپلود کنید
                    </p>
                    <p className="text-xs sm:text-sm text-[#4DBFF0]/70">
                      فرمت‌های مجاز: JPG, PNG, PDF (حداکثر 10MB)
                    </p>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons - Fixed Footer */}
          <div className="sticky bottom-0 bg-gradient-to-r from-gray-50 to-blue-50 p-5 sm:p-6 border-t-2 border-gray-200 flex gap-3 sm:gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 sm:py-4 px-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 text-sm sm:text-base hover:scale-[1.02] active:scale-95"
            >
              انصراف
            </button>
            <button
              onClick={handleSubmit}
              disabled={!receiptUrl || isSubmitting}
              className={`flex-1 py-3 sm:py-4 px-4 rounded-xl font-bold transition-all duration-300 text-sm sm:text-base ${
                receiptUrl && !isSubmitting
                  ? "bg-gradient-to-l from-[#FF7A00] to-[#4DBFF0] text-white hover:shadow-2xl hover:scale-[1.02] active:scale-95"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  در حال ثبت...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <FaCheck />
                  تأیید پرداخت
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* File Upload Modal */}
      <FileUploaderModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        onFileUploaded={handleFileUploaded}
        acceptedTypes={[".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf"]}
        maxFileSize={10 * 1024 * 1024} // 10MB
        title="آپلود رسید واریز"
      />
    </>
  );
};

export default CardPaymentModal;
