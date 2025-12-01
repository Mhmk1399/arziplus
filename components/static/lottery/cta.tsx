"use client";
import React, { useState, useEffect } from "react";
import { Clock, Globe, ArrowRight, MapPin, Phone, Mail } from "lucide-react";
import { COLORS } from "../lottery";
import Link from "next/link";

const CTASection = () => {
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
    const targetDate = new Date("2025-12-30T23:59:00.000Z").getTime();

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
      className="py-20 px-4"
      style={{ backgroundColor: COLORS.primary }}
      dir="rtl"
    >
      <div className="max-w-5xl mx-auto text-center">
        <h2
          className="text-4xl md:text-6xl font-bold mb-6"
          style={{ color: COLORS.white }}
        >
          همین حالا ثبت‌نام کنید
        </h2>

        <p
          className="text-xl md:text-2xl mb-8"
          style={{ color: COLORS.secondary }}
        >
          فرصت طلایی برای دریافت گرین‌کارت آمریکا را از دست ندهید!
        </p>

        {/* Countdown */}
        <div
          className="inline-block p-1 rounded-2xl mb-8"
          style={{
            background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.secondary})`,
          }}
        >
          <div className="bg-white rounded-xl p-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Clock className="w-7 h-7" style={{ color: COLORS.accent }} />
              <span
                className="text-2xl font-bold"
                style={{ color: COLORS.primary }}
              >
                زمان باقی‌مانده تا پایان ثبت‌نام
              </span>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              {["روز", "ساعت", "دقیقه", "ثانیه"].map((label, i) => (
                <div key={label} className="text-center">
                  <div
                    className="text-4xl font-bold mb-1"
                    style={{ color: COLORS.accent }}
                  >
                    {Object.values(timeLeft)[i]}
                  </div>
                  <div className="text-sm" style={{ color: COLORS.gray }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-sm" style={{ color: COLORS.gray }}>
              تا ۳۰ نوامبر ۲۰۲۵ - ۲۳:۵۹ UTC
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <Link href="/lottery/form">
            {" "}
            <button
              className="px-10 py-5 rounded-xl font-bold text-xl transition-all hover:scale-105 shadow-2xl flex items-center gap-3"
              style={{ backgroundColor: COLORS.accent, color: COLORS.white }}
            >
              <Globe className="w-6 h-6" />
              ثبت‌نام آنلاین لاتاری
              <ArrowRight className="w-6 h-6" />
            </button>
          </Link>
          <Link href="/lottery/form/present">
            {" "}
            <button
              className="px-10 py-5 rounded-xl font-bold text-xl transition-all hover:scale-105 shadow-2xl flex items-center gap-3"
              style={{
                backgroundColor: "transparent",
                color: COLORS.white,
                border: `2px solid ${COLORS.white}`,
              }}
            >
              <MapPin className="w-6 h-6" />
              رزرو وقت حضوری
              <ArrowRight className="w-6 h-6" />
            </button>
          </Link>
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            {
              icon: (
                <Phone
                  className="w-8 h-8 mx-auto mb-3"
                  style={{ color: COLORS.secondary }}
                />
              ),
              title: "تماس تلفنی",
              value: "09991202049",
              href: "tel:+989991202049",
            },
            {
              icon: (
                <Mail
                  className="w-8 h-8 mx-auto mb-3"
                  style={{ color: COLORS.secondary }}
                />
              ),
              title: "ایمیل",
              value: "info@arziplus.com",
              href: "mailto:info@arziplus.com",
            },
            {
              icon: (
                <MapPin
                  className="w-8 h-8 mx-auto mb-3"
                  style={{ color: COLORS.secondary }}
                />
              ),
              title: "آدرس دفتر",
              value: "تهران، خیابان فلسطین",
              href: "https://maps.app.goo.gl/NQtGhVhuDr8aGpGJ8",
            },
          ].map((item) => (
            <a
              key={item.title}
              href={item.href}
              target={item.href.startsWith("https") ? "_blank" : undefined}
              rel={
                item.href.startsWith("https")
                  ? "noopener noreferrer"
                  : undefined
              }
              className="block p-6 rounded-xl backdrop-blur-md hover:scale-105 transition-all duration-300"
              style={{ backgroundColor: `${COLORS.white}10` }}
            >
              {item.icon}
              <div className="font-bold mb-1" style={{ color: COLORS.white }}>
                {item.title}
              </div>
              <div style={{ color: COLORS.secondary }}>{item.value}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
