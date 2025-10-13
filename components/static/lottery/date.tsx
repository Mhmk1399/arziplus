import React from "react";
import { COLORS } from "../lottery";
import { Calendar, Award } from "lucide-react";

const ImportantDates = () => {
  const dates = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "   زمان شروع و پایان ثبت‌نام لاتاری ۲۰۲۷",
      content:
        "ثبت‌نام لاتاری آمریکا از تاریخ ۲ اکتبر ساعت ۱۹:۳۰ به وقت تهران آغاز شده و تا ۷ نوامبر ساعت ۲۰:۳۰ ادامه دارد. ثبت‌نام شما در ارزی پلاس به‌صورت کاملاً آنلاین و تحت نظارت کارشناسان مهاجرتی انجام می‌شود تا تمام اطلاعات مطابق با استانداردهای رسمی وزارت خارجه آمریکا ثبت گردد.",
      note: "برنامه لاتاری هر سال در ماه اکتبر (مهر) شروع شده و تا نوامبر (آبان) ادامه دارد. برای اطلاع از تاریخ دقیق شروع و پایان ثبت‌نام هر دوره، صفحه رسمی اینستاگرام ارزی پلاس را دنبال کنید.",
      color: COLORS.accent,
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "  تاریخ اعلام نتایج لاتاری",
      content:
        "اعلام نتایج لاتاری گرین کارت ۲۰۲۷ آمریکا در اردیبهشت‌ماه سال آینده انجام خواهد شد. کاربران ارزی پلاس پس از اعلام رسمی، نتیجه ثبت‌نام خود را از طریق ایمیل و پیامک دریافت می‌کنند.",
      color: COLORS.secondary,
    },
  ];
  return (
    <section className="py-20 px-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {dates.map((date, index) => (
            <div
              key={index}
              className="rounded-2xl p-8 shadow-lg"
              style={{ backgroundColor: COLORS.white }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="p-4 rounded-xl"
                  style={{
                    backgroundColor: `${date.color}20`,
                    color: date.color,
                  }}
                >
                  {date.icon}
                </div>
                <h3
                  className="text-2xl font-bold flex-1 "
                  style={{ color: COLORS.primary }}
                >
                  {date.title}
                </h3>
              </div>

              <p
                className="leading-relaxed mb-4"
                style={{ color: COLORS.gray }}
              >
                {date.content}
              </p>

              {date.note && (
                <div
                  className="p-4 rounded-lg mt-4"
                  style={{ backgroundColor: `${date.color}10` }}
                >
                  <p className="text-sm" style={{ color: COLORS.primary }}>
                    {date.note}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImportantDates;
