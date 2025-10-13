import React from "react";
import { COLORS } from "../lottery";
import { FileText, CheckCircle, Camera } from "lucide-react";

const DocumentsAndPhoto = () => {
  return (
    <section className="py-20 px-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Documents */}
          <div
            className="rounded-2xl p-8 shadow-lg"
            style={{ backgroundColor: COLORS.white }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div
                className="p-4 rounded-xl"
                style={{ backgroundColor: `${COLORS.secondary}20` }}
              >
                <FileText
                  className="w-8 h-8"
                  style={{ color: COLORS.secondary }}
                />
              </div>
              <h3
                className="text-2xl font-bold"
                style={{ color: COLORS.primary }}
              >
                  مدارک لازم برای ثبت‌نام
              </h3>
            </div>

            <p className="mb-6" style={{ color: COLORS.gray }}>
              برای ثبت‌نام در لاتاری گرین‌کارت با ارزی پلاس نیاز است:
            </p>

            <div className="space-y-4">
              {[
                "تکمیل دقیق فرم مشخصات فردی",
                "بارگذاری عکس استاندارد مطابق با دستورالعمل سفارت آمریکا",
                "پرداخت هزینه ثبت‌نام",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle
                    className="w-5 h-5 flex-shrink-0 mt-1"
                    style={{ color: COLORS.secondary }}
                  />
                  <span style={{ color: COLORS.primary }}>{item}</span>
                </div>
              ))}
            </div>

            <div
              className="mt-6 p-4 rounded-lg"
              style={{ backgroundColor: `${COLORS.secondary}10` }}
            >
              <p className="text-sm" style={{ color: COLORS.primary }}>
                اطلاعات شما پس از بررسی نهایی توسط کارشناسان ارزی پلاس تأیید و
                ارسال می‌شود.
              </p>
            </div>
          </div>

          {/* Photo Requirements */}
          <div
            className="rounded-2xl p-8 shadow-lg"
            style={{ backgroundColor: COLORS.white }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div
                className="p-4 rounded-xl"
                style={{ backgroundColor: `${COLORS.accent}20` }}
              >
                <Camera className="w-8 h-8" style={{ color: COLORS.accent }} />
              </div>
              <h3
                className="text-2xl font-bold"
                style={{ color: COLORS.primary }}
              >
                 شرایط عکس لاتاری
              </h3>
            </div>

            <p className="mb-6" style={{ color: COLORS.gray }}>
              عکس باید واضح، بدون عینک، بدون کلاه و با پس‌زمینه ساده باشد.
            </p>

            <div className="space-y-4 mb-6">
              {[
                "واضح و با کیفیت بالا",
                "بدون عینک آفتابی یا طبی",
                "بدون کلاه یا پوشش سر (مگر به دلایل مذهبی)",
                "پس‌زمینه ساده و روشن",
                "چهره کاملاً نمایان",
                "عکس اخیر (حداکثر ۶ ماه گذشته)",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle
                    className="w-5 h-5 flex-shrink-0 mt-1"
                    style={{ color: COLORS.accent }}
                  />
                  <span style={{ color: COLORS.primary }}>{item}</span>
                </div>
              ))}
            </div>

            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: `${COLORS.accent}10` }}
            >
              <p className="text-sm" style={{ color: COLORS.primary }}>
                در صورت نیاز، عکس شما توسط تیم گرافیکی ارزی پلاس اصلاح و
                استانداردسازی می‌شود تا مطابق با معیارهای رسمی اداره مهاجرت
                آمریکا باشد.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocumentsAndPhoto;
