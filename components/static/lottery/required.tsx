import React from "react";
import { COLORS } from "../lottery";
import { ArrowLeft, ArrowRight } from "lucide-react";

const requirements = [
  {
    emoji: "🎓",
    title: "مدرک تحصیلی مورد نیاز در لاتاری",
    description:
      "برای شرکت در لاتاری آمریکا از طریق ارزی پلاس، داشتن حداقل مدرک دیپلم کافی است و نیازی به دانستن زبان انگلیسی نیست. افرادی که مدرک زیر دیپلم دارند نیز در صورت داشتن دو سال سابقه کار مرتبط می‌توانند در لاتاری ثبت‌نام کنند.",
  },
  {
    emoji: "🎂",
    title: "شرایط سنی شرکت در لاتاری",
    description:
      "حداقل سن مجاز برای شرکت در لاتاری گرین‌کارت، ۱۸ سال است. افراد زیر این سن می‌توانند زیرمجموعه والدین خود ثبت‌نام شوند. هیچ محدودیت سنی برای شرکت در لاتاری وجود ندارد و افراد با سن بالاتر نیز می‌توانند در این برنامه شرکت کنند.",
  },
  {
    emoji: "🌐",
    title: "سایت رسمی ثبت‌نام لاتاری",
    description:
      "سایت اصلی و معتبر ثبت‌نام لاتاری آمریکا برای کاربران ایرانی، وب‌سایت ارزی پلاس است. تمام مراحل ثبت‌نام، بررسی فرم‌ها، پرداخت هزینه دلاری و اعلام نتایج از طریق سامانه رسمی ارزی پلاس انجام می‌شود.",
  },
];

const Requirements = () => {
  return (
    <section className="py-20 px-4  " style={{ backgroundColor: "#f8f9fa" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {requirements.map((req, index) => (
            <div
              key={index}
              className="rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
              style={{ backgroundColor: COLORS.white }}
            >
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">{req.emoji}</div>
                <h3
                  className="text-xl font-bold"
                  style={{ color: COLORS.primary }}
                >
                  {req.title}
                </h3>
              </div>

              <p
                className="leading-relaxed mb-4"
                style={{ color: COLORS.gray }}
              >
                {req.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <a
        href="#"
        className="flex justify-center w-fit p-3 rounded-xl mx-auto mt-12 items-center gap-2 font-medium duration-500 hover:scale-105 hover:gap-3 transition-all"
        style={{ color: COLORS.white, backgroundColor: COLORS.primary }}
      >
        شروع ثبت‌نام لاتاری آمریکا با ارزی پلاس
        <ArrowLeft className="w-4 h-4" />
      </a>
    </section>
  );
};

export default Requirements;
