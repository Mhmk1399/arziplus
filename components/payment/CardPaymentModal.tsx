"use client";
import React, { useState } from "react";
import { FaCreditCard, FaUpload, FaCheck, FaTimes, FaCopy } from "react-icons/fa";
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
  serviceName
}) => {
  const [receiptUrl, setReceiptUrl] = useState<string>("");
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bank card information (this could be fetched from admin settings)
  const bankCardInfo = {
    cardNumber: "6037-9974-5555-1234", // This should come from admin settings
    cardHolder: "ارزی پلاس",
    bankName: "بانک ملی ایران",
    iban: "IR123456789012345678901234"
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
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
      
      onPaymentComplete(receiptUrl);
      showToast.success("رسید واریز با موفقیت ثبت شد");
    } catch (error) {
      showToast.error("خطا در ثبت رسید");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Modal Header */}
          <div className="bg-gradient-to-l from-[#FF7A00] to-[#4DBFF0] p-6 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaCreditCard className="text-white text-2xl" />
                <h2 className={`text-2xl font-bold text-white ${estedadBold.className}`}>
                  واریز کارت به کارت
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {/* Service Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-medium text-[#0A1D37] mb-2">خدمت مورد نظر:</h3>
              <p className="text-[#0A1D37]/80">{serviceName}</p>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-[#0A1D37]/70">مبلغ قابل پرداخت:</span>
                <span className="text-2xl font-bold text-[#FF7A00]">
                  {amount.toLocaleString()} تومان
                </span>
              </div>
            </div>

            {/* Bank Card Information */}
            <div className="border-2 border-[#4DBFF0]/30 rounded-xl p-4">
              <h3 className="font-bold text-[#0A1D37] mb-4 flex items-center gap-2">
                <FaCreditCard className="text-[#4DBFF0]" />
                اطلاعات کارت مقصد
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-[#4DBFF0]/10 rounded-lg">
                  <div>
                    <p className="text-sm text-[#0A1D37]/70">شماره کارت:</p>
                    <p className="font-mono text-lg font-bold text-[#0A1D37]">
                      {bankCardInfo.cardNumber}
                    </p>
                  </div>
                  <button
                    onClick={handleCopyCardNumber}
                    className="p-2 text-[#4DBFF0] hover:bg-[#4DBFF0]/20 rounded-lg transition-colors"
                    title="کپی شماره کارت"
                  >
                    <FaCopy />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-[#0A1D37]/70">نام صاحب حساب:</p>
                    <p className="font-medium text-[#0A1D37]">{bankCardInfo.cardHolder}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#0A1D37]/70">بانک:</p>
                    <p className="font-medium text-[#0A1D37]">{bankCardInfo.bankName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h4 className="font-bold text-yellow-800 mb-2">دستورالعمل پرداخت:</h4>
              <ol className="text-sm text-yellow-700 space-y-1">
                <li>1. مبلغ {amount.toLocaleString()} تومان را به شماره کارت فوق واریز کنید</li>
                <li>2. عکس رسید واریز را گرفته و آپلود کنید</li>
                <li>3. بر روی دکمه "تأیید پرداخت" کلیک کنید</li>
                <li>4. پس از بررسی، درخواست شما پردازش خواهد شد</li>
              </ol>
            </div>

            {/* Receipt Upload */}
            <div className="space-y-3">
              <label className="block font-medium text-[#0A1D37]">
                آپلود رسید واریز <span className="text-red-500">*</span>
              </label>
              
              {receiptUrl ? (
                <div className="border border-green-200 bg-green-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaCheck className="text-green-600" />
                      <span className="text-green-700 font-medium">رسید آپلود شد</span>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 text-sm border border-green-300 px-3 py-1 rounded-lg hover:bg-green-100"
                      >
                        مشاهده
                      </a>
                      <button
                        onClick={() => setReceiptUrl("")}
                        className="text-red-600 text-sm border border-red-300 px-3 py-1 rounded-lg hover:bg-red-100"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                  
                  {receiptUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                    <div className="mt-3">
                      <img
                        src={receiptUrl}
                        alt="رسید واریز"
                        className="w-full max-w-xs mx-auto rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsFileModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-[#4DBFF0] rounded-xl text-[#4DBFF0] hover:bg-[#4DBFF0]/10 transition-colors"
                >
                  <FaUpload />
                  کلیک کنید تا رسید را آپلود کنید
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={handleSubmit}
                disabled={!receiptUrl || isSubmitting}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  receiptUrl && !isSubmitting
                    ? "bg-gradient-to-l from-[#FF7A00] to-[#4DBFF0] text-white hover:opacity-90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? "در حال ثبت..." : "تأیید پرداخت"}
              </button>
            </div>
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