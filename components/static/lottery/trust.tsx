import React from "react";
import { COLORS } from "../lottery";
import { Shield, CheckCircle, Award, Star } from "lucide-react";

const TrustBadges = () => {
  const badges = [
    {
      icon: <Shield className="w-12 h-12" />,
      text: "پرداخت امن",
      color: COLORS.accent,
    },
    {
      icon: <CheckCircle className="w-12 h-12" />,
      text: "تاییدیه ثبت نام",
      color: COLORS.secondary,
    },
    {
      icon: <Award className="w-12 h-12" />,
      text: "ثبت نام تخصصی",
      color: COLORS.primary,
    },
    {
      icon: <Star className="w-12 h-12" />,
      text: "پشتیبانی ۲۴/۷",
      color: COLORS.accent,
    },
  ];
  return (
    <section className="py-2 px-4" >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-3 p-6 rounded-xl transition-all hover:scale-105"
              style={{ backgroundColor: COLORS.white }}
            >
              <div style={{ color: badge.color }}>{badge.icon}</div>
              <span
                className="font-bold text-center"
                style={{ color: COLORS.primary }}
              >
                {badge.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
