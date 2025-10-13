import React from "react";
import { COLORS } from "../lottery";

const WhatIsGreenCard = () => {
  return (
    <section className="py-20 px-4" style={{ backgroundColor: COLORS.primary }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: COLORS.white }}
          >
            🌍 لاتاری گرین کارت چیست؟
          </h2>
          <div className="max-w-4xl mx-auto space-y-4">
            <p
              className="text-lg leading-relaxed"
              style={{ color: COLORS.secondary }}
            >
              برنامه لاتاری گرین کارت آمریکا یکی از ساده‌ترین و
              مقرون‌به‌صرفه‌ترین روش‌های مهاجرت به ایالات متحده است. با ثبت‌نام
              در لاتاری از طریق ارزی پلاس، بدون نیاز به شرایط خاص می‌توانید شانس
              خود را برای دریافت اقامت دائم آمریکا امتحان کنید.
            </p>
            <p
              className="text-lg leading-relaxed"
              style={{ color: COLORS.white }}
            >
              این برنامه هر سال برگزار می‌شود و تقریباً همه افراد واجد شرایط
              می‌توانند در آن شرکت کنند. برندگان پس از دریافت ویزای لاتاری،
              همراه با همسر و فرزندان زیر ۲۱ سال مجرد خود وارد خاک آمریکا
              می‌شوند و از تمامی امتیازات شهروندی مانند کار در آمریکا، افتتاح
              حساب بانکی، تحصیل، دریافت شماره تأمین اجتماعی و زندگی دائم در
              آمریکا بهره‌مند خواهند شد.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsGreenCard;
