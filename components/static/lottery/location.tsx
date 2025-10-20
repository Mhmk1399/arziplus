import React from "react";
import { COLORS } from "../lottery";
import { MapPin, Phone, Clock, Camera } from "lucide-react";
import Link from "next/link";

const LocationSection = () => {
  return (
    <section className="py-20 px-4" style={{ backgroundColor: COLORS.white }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ color: COLORS.primary }}
            >
              ثبت‌نام حضوری لاتاری در تهران
            </h2>
            <div
              className="p-6 rounded-xl mb-6"
              style={{ backgroundColor: `${COLORS.accent}10` }}
            >
              <div className="flex items-start gap-4">
                <MapPin
                  className="w-6 h-6 flex-shrink-0"
                  style={{ color: COLORS.accent }}
                />
                <div>
                  <h3
                    className="font-bold mb-2"
                    style={{ color: COLORS.primary }}
                  >
                    📍 آدرس دفتر ارزی پلاس:
                  </h3>
                  <p style={{ color: COLORS.gray }} className="leading-relaxed">
                    تهران، خیابان فلسطین تقاطع  بزرگمهر 
                    پلاک ۷۸
                  </p>
                </div>
              </div>
            </div>

            <p className="leading-relaxed mb-6" style={{ color: COLORS.gray }}>
              در این دفتر، تمام مراحل شامل تکمیل فرم، بررسی کارشناسی و عکاسی
              استاندارد در حضور مشتری انجام می‌شود.
            </p>
            <Link href="/contact">
              <button
                className="px-8 py-4 rounded-lg font-bold transition-all hover:scale-105 flex items-center gap-2"
                style={{ backgroundColor: COLORS.accent, color: COLORS.white }}
              >
                <Phone className="w-5 h-5" />
                تماس با ارزی پلاس
              </button>{" "}
              
            </Link>
          </div>

          <div
            className="rounded-2xl p-8 shadow-xl"
            style={{ backgroundColor: COLORS.primary }}
          >
            <div
              className="aspect-video rounded-lg mb-6 flex items-center justify-center"
              style={{ backgroundColor: `${COLORS.secondary}20` }}
            >
              <MapPin
                className="w-20 h-20"
                style={{ color: COLORS.secondary }}
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5" style={{ color: COLORS.accent }} />
                <span style={{ color: COLORS.white }}>
                  ساعات کاری: شنبه تا چهارشنبه ۹ صبح تا ۶ عصر
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5" style={{ color: COLORS.accent }} />
                <span style={{ color: COLORS.white }}>
                  پشتیبانی تلفنی و تلگرامی
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Camera className="w-5 h-5" style={{ color: COLORS.accent }} />
                <span style={{ color: COLORS.white }}>
                  عکاسی استاندارد در محل
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
