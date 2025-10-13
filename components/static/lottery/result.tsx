import React from "react";
import { COLORS } from "../lottery";
import { Award } from "lucide-react";

const ResultsSection = () => {
  return (
    <section className="py-20 px-4" style={{ backgroundColor: COLORS.primary }}>
      <div className="max-w-4xl mx-auto text-center">
        <Award
          className="w-16 h-16 mx-auto mb-6"
          style={{ color: COLORS.accent }}
        />
        <h2
          className="text-4xl md:text-5xl font-bold mb-6"
          style={{ color: COLORS.white }}
        >
            اعلام نتایج لاتاری
        </h2>
        <p
          className="text-xl leading-relaxed mb-8"
          style={{ color: COLORS.secondary }}
        >
          قرعه‌کشی لاتاری هر سال در ماه اردیبهشت (May) برگزار می‌شود. برای
          مشاهده نتیجه، کافی است وارد صفحه اعلام نتایج لاتاری ارزی پلاس شوید و
          کد رهگیری ثبت‌نام خود را وارد کنید تا وضعیت برنده شدن شما نمایش داده
          شود.
        </p>
        <button
          className="px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105"
          style={{ backgroundColor: COLORS.accent, color: COLORS.white }}
        >
          استعلام نتایج لاتاری
        </button>
      </div>
    </section>
  );
};

export default ResultsSection;
