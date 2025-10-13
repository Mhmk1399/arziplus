// app/lottery-registration/page.tsx - COMPLETE VERSION

"use client";

import React from "react";
import {
  Users,
  Phone,
  Clock,
  ArrowRight,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import HeroSection from "./lottery/hero";
import PricingSection from "./lottery/price";
import TrustBadges from "./lottery/trust";
import ProcessSteps from "./lottery/process";
import WhatIsGreenCard from "./lottery/greenCard";
import ImportantDates from "./lottery/date";
import RegistrationTypes from "./lottery/register";
import Requirements from "./lottery/required";
import DocumentsAndPhoto from "./lottery/document";
import CTASection from "./lottery/cta";
import AdditionalFAQs from "./lottery/morefaq";
import FAQSection from "./lottery/faq1";
import FeaturesSection from "./lottery/feature";
import LocationSection from "./lottery/location";

export const COLORS = {
  primary: "#0A1D37",
  accent: "#FF7A00",
  secondary: "#4DBFF0",
  white: "#FFFFFF",
  gray: "#A0A0A0",
};

// Testimonials Section
// function TestimonialsSection() {
//   const testimonials = [
//     {
//       name: "احمد رضایی",
//       role: "برنده لاتاری ۲۰۲۳",
//       image: "👨‍💼",
//       comment:
//         "با کمک تیم ارزی پلاس توانستم بدون هیچ مشکلی در لاتاری ثبت‌نام کنم. خدمات حرفه‌ای و پشتیبانی عالی داشتند. الان در کالیفرنیا زندگی می‌کنم.",
//       rating: 5,
//     },
//     {
//       name: "مریم احمدی",
//       role: "برنده لاتاری ۲۰۲۲",
//       image: "👩‍💼",
//       comment:
//         "تیم ارزی پلاس در تمام مراحل از ثبت‌نام تا دریافت ویزا کنارم بودند. به همه توصیه می‌کنم حتماً از خدمات این مجموعه استفاده کنند.",
//       rating: 5,
//     },
//     {
//       name: "علی محمدی",
//       role: "برنده لاتاری ۲۰۲۴",
//       image: "👨‍🎓",
//       comment:
//         "فرآیند ثبت‌نام خیلی ساده و سریع بود. کارشناسان ارزی پلاس به تمام سوالاتم پاسخ دادند و عکس منو هم استاندارد کردند.",
//       rating: 5,
//     },
//     {
//       name: "فاطمه کریمی",
//       role: "برنده لاتاری ۲۰۲۳",
//       image: "👩‍🔬",
//       comment:
//         "ممنون از تیم ارزی پلاس. با ثبت‌نام دو شانسه، همسرم برنده شد و الان با خانواده در آمریکا هستیم. خدمات بی‌نظیری دارند.",
//       rating: 5,
//     },
//   ];

//   return (
//     <section className="py-20 px-4" style={{ backgroundColor: "#f8f9fa" }}>
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-16">
//           <div
//             className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
//             style={{ backgroundColor: `${COLORS.accent}20` }}
//           >
//             <Heart className="w-5 h-5" style={{ color: COLORS.accent }} />
//             <span className="font-bold" style={{ color: COLORS.accent }}>
//               نظرات برندگان
//             </span>
//           </div>
//           <h2
//             className="text-4xl md:text-5xl font-bold mb-4"
//             style={{ color: COLORS.primary }}
//           >
//             موفقیت‌های واقعی با ارزی پلاس
//           </h2>
//           <p className="text-lg" style={{ color: COLORS.gray }}>
//             تجربه هزاران نفر از برندگان لاتاری که با ما به رویای آمریکایی خود
//             رسیدند
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 gap-8">
//           {testimonials.map((testimonial, index) => (
//             <div
//               key={index}
//               className="rounded-2xl p-8 shadow-lg transition-all hover:shadow-2xl hover:scale-105"
//               style={{ backgroundColor: COLORS.white }}
//             >
//               <div className="flex items-start gap-4 mb-6">
//                 <div className="text-6xl">{testimonial.image}</div>
//                 <div className="flex-1">
//                   <h4
//                     className="text-xl font-bold mb-1"
//                     style={{ color: COLORS.primary }}
//                   >
//                     {testimonial.name}
//                   </h4>
//                   <p className="text-sm mb-2" style={{ color: COLORS.gray }}>
//                     {testimonial.role}
//                   </p>
//                   <div className="flex gap-1">
//                     {[...Array(testimonial.rating)].map((_, i) => (
//                       <Star
//                         key={i}
//                         className="w-4 h-4 fill-current"
//                         style={{ color: COLORS.accent }}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//               <p className="leading-relaxed" style={{ color: COLORS.gray }}>
//                 "{testimonial.comment}"
//               </p>
//             </div>
//           ))}
//         </div>

//         <div className="text-center mt-12">
//           <button
//             className="px-8 py-4 rounded-lg font-bold transition-all hover:scale-105"
//             style={{ backgroundColor: COLORS.accent, color: COLORS.white }}
//           >
//             مشاهده بیشتر داستان‌های موفقیت
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }

// Process Timeline
// function ProcessTimeline() {
//   const timeline = [
//     {
//       date: "مهر ۱۴۰۴",
//       title: "شروع ثبت‌نام",
//       description: "ثبت‌نام در لاتاری از ۲ اکتبر آغاز می‌شود",
//       icon: <Calendar className="w-6 h-6" />,
//     },
//     {
//       date: "آبان ۱۴۰۴",
//       title: "پایان ثبت‌نام",
//       description: "آخرین مهلت ثبت‌نام ۷ نوامبر است",
//       icon: <Clock className="w-6 h-6" />,
//     },
//     {
//       date: "اردیبهشت ۱۴۰۵",
//       title: "اعلام نتایج",
//       description: "نتایج قرعه‌کشی اعلام می‌شود",
//       icon: <Award className="w-6 h-6" />,
//     },
//     {
//       date: "خرداد ۱۴۰۵ به بعد",
//       title: "مراحل ویزا",
//       description: "شروع فرآیند دریافت ویزا برای برندگان",
//       icon: <CheckCircle className="w-6 h-6" />,
//     },
//   ];

//   return (
//     <section className="py-20 px-4" style={{ backgroundColor: COLORS.white }}>
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-16">
//           <h2
//             className="text-4xl md:text-5xl font-bold mb-4"
//             style={{ color: COLORS.primary }}
//           >
//             مراحل زمان‌بندی لاتاری
//           </h2>
//         </div>

//         <div className="relative">
//           {/* Timeline Line */}
//           <div
//             className="absolute right-1/2 top-0 bottom-0 w-1 hidden md:block"
//             style={{ backgroundColor: COLORS.secondary }}
//           ></div>

//           <div className="space-y-12">
//             {timeline.map((item, index) => (
//               <div
//                 key={index}
//                 className={`flex items-center gap-8 ${
//                   index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
//                 }`}
//               >
//                 <div
//                   className={`flex-1 ${
//                     index % 2 === 0 ? "text-left md:text-right" : "text-left"
//                   }`}
//                 >
//                   <div
//                     className="inline-block rounded-2xl p-6 shadow-lg"
//                     style={{
//                       backgroundColor: COLORS.white,
//                       border: `2px solid ${COLORS.secondary}`,
//                     }}
//                   >
//                     <div
//                       className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
//                       style={{ backgroundColor: `${COLORS.accent}20` }}
//                     >
//                       <div style={{ color: COLORS.accent }}>{item.icon}</div>
//                       <span
//                         className="text-sm font-bold"
//                         style={{ color: COLORS.accent }}
//                       >
//                         {item.date}
//                       </span>
//                     </div>
//                     <h3
//                       className="text-xl font-bold mb-2"
//                       style={{ color: COLORS.primary }}
//                     >
//                       {item.title}
//                     </h3>
//                     <p style={{ color: COLORS.gray }}>{item.description}</p>
//                   </div>
//                 </div>

//                 <div
//                   className="hidden md:flex w-12 h-12 rounded-full items-center justify-center relative z-10"
//                   style={{ backgroundColor: COLORS.secondary }}
//                 >
//                   <div
//                     className="w-6 h-6 rounded-full"
//                     style={{ backgroundColor: COLORS.white }}
//                   ></div>
//                 </div>

//                 <div className="flex-1"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// Benefits Grid
function BenefitsGrid() {
  const benefits = [
    {
      icon: "🏠",
      title: "حق اقامت دائم",
      description: "زندگی دائم در ایالات متحده آمریکا بدون نیاز به تمدید",
    },
    {
      icon: "💼",
      title: "اشتغال آزاد",
      description: "امکان کار در هر شغل و هر ایالت بدون محدودیت",
    },
    {
      icon: "🎓",
      title: "تحصیل رایگان",
      description: "دسترسی به آموزش رایگان برای فرزندان و شهریه دانشگاهی کمتر",
    },
    {
      icon: "🏥",
      title: "بیمه درمانی",
      description: "دسترسی به خدمات بهداشتی و درمانی معتبر",
    },
    {
      icon: "🛂",
      title: "سفر آزاد",
      description: "رفت و آمد آزاد به ایران و سایر کشورها",
    },
    {
      icon: "👨‍👩‍👧‍👦",
      title: "اقامت خانواده",
      description: "همسر و فرزندان زیر ۲۱ سال نیز گرین کارت دریافت می‌کنند",
    },
    {
      icon: "🏦",
      title: "خدمات بانکی",
      description: "افتتاح حساب بانکی و دریافت کارت اعتباری",
    },
    {
      icon: "📊",
      title: "سرمایه‌گذاری",
      description: "امکان سرمایه‌گذاری و راه‌اندازی کسب‌وکار",
    },
    {
      icon: "🇺🇸",
      title: "مسیر تابعیت",
      description: "امکان درخواست تابعیت آمریکا پس از ۵ سال",
    },
    {
      icon: "🎯",
      title: "فرصت‌های شغلی",
      description: "دسترسی به بازار کار قدرتمند آمریکا",
    },
    {
      icon: "🏛️",
      title: "حمایت قانونی",
      description: "بهره‌مندی از حقوق شهروندی و حمایت قانونی",
    },
    {
      icon: "✈️",
      title: "بدون ویزا",
      description: "سفر به بسیاری از کشورها بدون نیاز به ویزا",
    },
  ];

  return (
    <section className="py-20 px-4" style={{ backgroundColor: COLORS.primary }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Sparkles
            className="w-12 h-12 mx-auto mb-6"
            style={{ color: COLORS.accent }}
          />
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: COLORS.white }}
          >
            مزایای گرین کارت آمریکا
          </h2>
          <p className="text-xl" style={{ color: COLORS.secondary }}>
            چه امکاناتی در انتظار برندگان لاتاری است؟
          </p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="rounded-xl p-6 transition-all hover:scale-105"
              style={{ backgroundColor: `${COLORS.white}10` }}
            >
              <div className="text-5xl mb-4 text-center">{benefit.icon}</div>
              <h3
                className="text-lg font-bold mb-2 text-center"
                style={{ color: COLORS.white }}
              >
                {benefit.title}
              </h3>
              <p
                className="text-sm text-center"
                style={{ color: COLORS.secondary }}
              >
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Quick Info Cards
function QuickInfoCards() {
  const cards = [
    {
      icon: <Clock className="w-10 h-10" />,
      title: "زمان ثبت‌نام",
      value: "۱۵ دقیقه",
      description: "فقط ۱۵ دقیقه وقت نیاز دارید",
      color: COLORS.primary,
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "برندگان از ایران",
      value: "۶,۰۰۰+",
      description: "کیس برنده در هر دوره",
      color: COLORS.secondary,
    },
  ];

  return (
    <section className="py-12 px-4" style={{ backgroundColor: COLORS.white }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="rounded-2xl p-6 text-center transition-all hover:scale-105 shadow-lg"
              style={{
                backgroundColor: `${card.color}10`,
                border: `2px solid ${card.color}`,
              }}
            >
              <div
                className="flex justify-center mb-4"
                style={{ color: card.color }}
              >
                {card.icon}
              </div>
              <div
                className="text-4xl font-bold mb-2"
                style={{ color: card.color }}
              >
                {card.value}
              </div>
              <h3 className="font-bold mb-2" style={{ color: COLORS.primary }}>
                {card.title}
              </h3>
              <p className="text-sm" style={{ color: COLORS.gray }}>
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Update main component to include new sections
export default function LotteryRegistrationPage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <HeroSection />
      <QuickInfoCards />
      <PricingSection />
      <TrustBadges />
      <ProcessSteps />
      {/* <ProcessTimeline /> */}
      <WhatIsGreenCard />
      <BenefitsGrid />
      <ImportantDates />
      <RegistrationTypes />
      <Requirements />
      <DocumentsAndPhoto />
      {/* <ResultsSection /> */}
      <LocationSection />
      <FeaturesSection />
      {/* <TestimonialsSection /> */}
      <FAQSection />
      <AdditionalFAQs />
      {/* <StatsSection /> */}
      <CTASection />
    </div>
  );
}
