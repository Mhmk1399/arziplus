import React from "react";
import { COLORS } from "../lottery";

const RegistrationTypes = () => {
  const types = [
    {
      emoji: "👤",
      title: "ثبت‌نام لاتاری افراد مجرد",
      description:
        "افراد مجرد بالای ۱۸ سال می‌توانند به‌صورت مستقل در لاتاری گرین‌کارت آمریکا شرکت کنند و شانس خود را برای دریافت اقامت دائم ایالات متحده امتحان کنند. افرادی که هنوز به‌صورت رسمی ازدواج نکرده‌اند، باید به‌صورت مستقل و جداگانه ثبت‌نام نمایند.",
      color: COLORS.primary,
    },
    {
      emoji: "👨‍👩‍👧",
      title: "ثبت‌نام لاتاری افراد متأهل و خانواده",
      description:
        "افراد متأهل باید حتماً به همراه همسر و فرزندان مجرد زیر ۲۱ سال خود در لاتاری ثبت‌نام کنند. عدم ثبت اطلاعات کامل اعضای خانواده، منجر به از بین رفتن شانس دریافت ویزای آمریکا خواهد شد.",
      color: COLORS.primary,
    },
    {
      emoji: "🎯",
      title: "ثبت‌نام لاتاری دو‌شانسه",
      description:
        "افراد متأهل می‌توانند به‌صورت دو‌شانسه در لاتاری شرکت کنند. به این شکل که یک‌بار آقا به عنوان متقاضی اصلی و همسر و فرزندان به‌عنوان زیرمجموعه ثبت‌نام می‌شوند و بار دیگر، برعکس این ترتیب انجام می‌گیرد.",
      color: COLORS.primary,
    },
    {
      emoji: "🌟",
      title: "ثبت‌نام لاتاری سه‌شانسه",
      description:
        "افراد مجرد ۱۸ تا ۲۱ سال می‌توانند علاوه بر ثبت‌نام مستقل، به‌عنوان زیرمجموعه والدین نیز ثبت شوند. در این صورت، فرد دارای سه شانس مجزا برای برنده شدن در لاتاری خواهد بود.",
      color: COLORS.primary,
    },
  ];
  return (
    <section className="py-20 px-4" style={{ backgroundColor: COLORS.white }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: COLORS.primary }}
          >
            همه چیز درباره ثبت‌نام لاتاری آمریکا با ارزی پلاس
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {types.map((type, index) => (
            <div
              key={index}
              className="rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
              style={{
                backgroundColor: COLORS.white,
                border: `2px solid ${type.color}`,
              }}
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{type.emoji}</div>
                <h3
                  className="text-2xl font-bold"
                  style={{ color: COLORS.primary }}
                >
                  {type.title}
                </h3>
              </div>

              <p
                className="leading-relaxed text-center"
                style={{ color: COLORS.gray }}
              >
                {type.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RegistrationTypes;
