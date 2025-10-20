"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Clock } from "lucide-react";
import { COLORS } from "../lottery";
import Link from "next/link";

const HeroSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [serverOffset, setServerOffset] = useState(0);

  // 🕒 دریافت زمان UTC از سرور امن
  useEffect(() => {
    const getServerTime = async () => {
      const apis = [
        "https://worldtimeapi.org/api/timezone/Etc/UTC",
        "https://timeapi.io/api/Time/current/zone?timeZone=UTC",
      ];

      for (const api of apis) {
        try {
          const response = await fetch(api);
          const data = await response.json();

          let serverTime;
          if (data.utc_datetime)
            serverTime = new Date(data.utc_datetime).getTime();
          else if (data.dateTime)
            serverTime = new Date(data.dateTime).getTime();
          else if (data.currentDateTime)
            serverTime = new Date(data.currentDateTime).getTime();
          else continue;

          setServerOffset(serverTime - Date.now());
          return;
        } catch {
          continue;
        }
      }

      // fallback → استفاده از زمان سیستم
      setServerOffset(0);
    };

    getServerTime();
  }, []);

  // ⏳ شمارش معکوس تا 30 نوامبر 2025
  useEffect(() => {
    const targetDate = new Date("2025-11-30T23:59:00.000Z").getTime();

    const updateTimer = () => {
      const now = Date.now() + serverOffset;
      const distance = targetDate - now;

      if (distance > 0) {
        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({
          days: d.toString().padStart(2, "0"),
          hours: h.toString().padStart(2, "0"),
          minutes: m.toString().padStart(2, "0"),
          seconds: s.toString().padStart(2, "0"),
        });
      } else {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
      }
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer();

    return () => clearInterval(timer);
  }, [serverOffset]);

  return (
    <section
      className="relative py-20 -mt-20 px-4 overflow-hidden min-h-screen"
      style={{ backgroundColor: COLORS.primary }}
      dir="rtl"
    >
      {/* پس‌زمینه بلوری جذاب */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: COLORS.secondary }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: COLORS.accent }}
        ></div>
      </div>

      <div className="max-w-7xl mt-20 md:mt-24 mx-auto relative z-10 text-center">
        {/* تگ اطلاع‌رسانی */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
          style={{
            backgroundColor: "rgba(77, 191, 240, 0.1)",
            border: `1px solid ${COLORS.secondary}`,
          }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: COLORS.accent }}
          ></span>
          <span
            style={{ color: COLORS.secondary }}
            className="text-xs md:text-sm font-medium"
          >
            ثبت‌نام لاتاری ۱۴۰۴ آغاز شده است
          </span>
        </div>

        {/* تیتر اصلی */}
        <h1
          className="text-xl md:text-6xl font-bold mb-6 leading-snug"
          style={{ color: COLORS.white }}
        >
          ثبت‌نام لاتاری گرین‌کارت ۲۰۲۵ آمریکا
        </h1>

        <p
          className="text-sm md:text-2xl mb-8 font-medium"
          style={{ color: COLORS.secondary }}
        >
          با خدمات سریع و مطمئن ارزی‌پلاس
        </p>

        {/* دکمه‌ها */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link href="/lottery/form">
            <button
              className="md:px-8 md:py-4 px-4 py-2 bg-white rounded-lg font-bold text-sm md:text-lg cursor-pointer   transition-all duration-300 shadow-lg flex items-center gap-2"
              style={{ color: COLORS.accent }}
            >
              ورود به ثبت‌نام آنلاین
              <ArrowLeft className="w-5 h-5" />
            </button>{" "}
          </Link>
          <Link href="/lottery/present">
            {" "}
            <button
              className="md:px-8 md:py-4 px-4 py-2 rounded-lg font-bold text-sm md:text-lg cursor-pointer  transition-all duration-300 shadow-lg flex items-center gap-2"
              style={{
                backgroundColor: "transparent",
                color: COLORS.white,
                border: `2px solid ${COLORS.white}`,
              }}
            >
              رزرو وقت حضوری
            </button>
          </Link>
        </div>

        {/* تایمر شمارش معکوس */}
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="w-5 h-5" style={{ color: COLORS.accent }} />
            <span
              className="text-lg font-semibold"
              style={{ color: COLORS.white }}
            >
              تا ۳۰ نوامبر ۲۰۲۵ (UTC)
            </span>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "روز", value: timeLeft.days },
              { label: "ساعت", value: timeLeft.hours },
              { label: "دقیقه", value: timeLeft.minutes },
              { label: "ثانیه", value: timeLeft.seconds },
            ].map((item) => (
              <div
                key={item.label}
                className="text-center p-3 rounded-lg backdrop-blur-sm"
                style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                <div className="text-2xl font-bold text-white/80">
                  {item.value}
                </div>
                <div
                  className="text-xs mt-1"
                  style={{ color: COLORS.secondary }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
