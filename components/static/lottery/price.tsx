import React from "react";
import { COLORS } from "../lottery";
import { Globe, MapPin, CheckCircle, Shield } from "lucide-react";

const plans = [
  {
    type: "online",
    title: "🟢 پذیرش غیرحضوری",
    icon: <Globe className="w-8 h-8" />,
    pricing: [
      {
        label: "بزرگسال: هر نفر",
        price: "۵۰۰ هزار تومان",
        extra: "عکاسی به عهده کاربر",
      },
      {
        label: "فرزند زیرمجموعه: هر نفر",
        price: "۱۵۰ هزار تومان",
        extra: "عکاسی به عهده کاربر",
      },
    ],
    description:
      "تمام مراحل ثبت‌نام غیرحضوری از طریق سیستم آنلاین ارزی پلاس انجام می‌شود و فایل تأییدیه رسمی پس از تکمیل ثبت‌نام برای شما ارسال خواهد شد.",
    features: [
      "پرداخت هزینه دلاری از طریق ارزی پلاس",
      "امکان پرداخت ریالی با درگاه امن یا کارت‌به‌کارت",
      "قابلیت تکمیل و ویرایش مشخصات در پنل کاربری اختصاصی",
      "ارائه فایل PDF شامل کد رهگیری رسمی",
      "راهنمای کامل تهیه عکس و استانداردسازی توسط کارشناسان ارزی پلاس",
      "بررسی دقیق فرم ثبت‌نام و رفع نواقص احتمالی پیش از ارسال",
      "پشتیبانی از طریق تلگرام و تماس تلفنی در ساعات کاری",
      "اعلام نتایج نهایی به‌صورت رایگان از طریق پیامک و ایمیل",
      "خدمات ویژه کارگزاری امور برندگان لاتاری در مراحل ویزا و اقامت",
    ],
    cta: "ورود به ثبت‌نام آنلاین",
    link: "#",
  },
  {
    type: "inperson",
    title: "🏢 پذیرش حضوری",
    icon: <MapPin className="w-8 h-8" />,
    pricing: [
      {
        label: "بزرگسال: هر نفر",
        price: "۸۰۰ هزار تومان",
        extra: "+ عکاسی حرفه‌ای در مجموعه",
      },
      {
        label: "فرزند زیرمجموعه: هر نفر",
        price: "۲۰۰ هزار تومان",
        extra: "+ عکاسی حرفه‌ای در مجموعه",
      },
    ],
    description:
      "در ثبت‌نام حضوری، تمامی مراحل از جمله تکمیل فرم، بررسی کارشناسی، و عکاسی استاندارد در دفاتر رسمی ارزی پلاس انجام می‌شود.",
    features: [
      "پرداخت هزینه دلاری از طریق ارزی پلاس",
      "پرداخت در محل با کارت‌خوان بانکی",
      "امکان تکمیل مشخصات از طریق پنل کاربری ارزی پلاس",
      "ارائه فایل PDF حاوی کد رهگیری رسمی",
      "عکاسی در مجموعه ارزی پلاس و استانداردسازی عکس طبق قوانین سفارت آمریکا",
      "بررسی فرم‌ها توسط کارشناسان و رفع نواقص در محل",
      "پشتیبانی تلفنی و تلگرامی در ساعات کاری",
      "اعلام نتایج رسمی از طریق ایمیل و پیامک",
      "خدمات جامع کارگزاری برای برندگان لاتاری",
    ],
    cta: "رزرو وقت حضوری",
    link: "#",
  },
];
const PricingSection = () => {
  return (
    <section className="pt-20  px-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: COLORS.primary }}
          >
            💰 پلن‌ها و هزینه ثبت‌نام لاتاری
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="rounded-2xl shadow-xl overflow-hidden  hover:shadow-2xl"
              style={{ backgroundColor: COLORS.white }}
            >
              <div
                className="p-8 text-center"
                style={{
                  backgroundColor:
                    index === 0 ? COLORS.secondary : COLORS.primary,
                }}
              >
                <div
                  className="flex justify-center mb-4"
                  style={{ color: COLORS.white }}
                >
                  {plan.icon}
                </div>
                <h3
                  className="text-2xl font-bold"
                  style={{ color: COLORS.white }}
                >
                  {plan.title}
                </h3>
              </div>

              <div className="p-8 flex flex-col gap-4">
                <div className="mb-6">
                  {plan.pricing.map((price, idx) => (
                    <div
                      key={idx}
                      className="mb-4 p-4 rounded-lg"
                      style={{ backgroundColor: "#f8f9fa" }}
                    >
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <span
                          style={{ color: COLORS.gray }}
                          className="text-sm"
                        >
                          • {price.label}
                        </span>
                        <span
                          className="font-bold text-lg"
                          style={{ color: COLORS.accent }}
                        >
                          {price.price}
                        </span>
                      </div>
                      {price.extra && (
                        <p
                          className="text-xs mt-2"
                          style={{ color: COLORS.gray }}
                        >
                          {price.extra}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <p
                  className="mb-6 leading-relaxed"
                  style={{ color: COLORS.gray }}
                >
                  {plan.description}
                </p>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        style={{ color: COLORS.accent }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: COLORS.primary }}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Important Notes */}
                <div className="grid md:grid-cols-1 gap-6 my-2">
                  <div
                    className="p-6 rounded-xl border-r-4 flex items-start gap-4"
                    style={{
                      backgroundColor: COLORS.white,
                      borderColor: COLORS.primary,
                    }}
                  >
                    <CheckCircle
                      className="w-6 h-6 flex-shrink-0"
                      style={{ color: COLORS.accent }}
                    />
                    <div>
                      <h4
                        className="font-bold mb-2"
                        style={{ color: COLORS.primary }}
                      >
                        📋 نکات مهم
                      </h4>
                      <p style={{ color: COLORS.gray }} className="text-sm">
                        ثبت‌نام لاتاری متأهلین بدون هزینه اضافه و با دو شانس
                        قرعه‌کشی توسط ارزی پلاس انجام می‌شود.
                      </p>
                      <p
                        style={{ color: COLORS.gray }}
                        className="text-sm mt-2"
                      >
                        هزینه ثبت‌نام با احتساب ۱ دلار هزینه رسمی اداره مهاجرت
                        آمریکا محاسبه شده است.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  className="w-full py-4 rounded-lg font-bold transition-all hover:scale-105"
                  style={{
                    backgroundColor: COLORS.accent,
                    color: COLORS.white,
                  }}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
