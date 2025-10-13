import React from "react";
import { COLORS } from "../lottery";
import { Users, Award, Star, CheckCircle } from "lucide-react";

const stats = [
  {
    number: "۱۰۰,۰۰۰+",
    label: "ثبت‌نام موفق",
    icon: <Users className="w-8 h-8" />,
  },
  {
    number: "۶,۰۰۰+",
    label: "برنده از ایران",
    icon: <Award className="w-8 h-8" />,
  },
  { number: "۱۵", label: "سال تجربه", icon: <Star className="w-8 h-8" /> },
  {
    number: "۹۸٪",
    label: "رضایت مشتریان",
    icon: <CheckCircle className="w-8 h-8" />,
  },
];

const StatsSection = () => {
  return (
    <section
      className="py-20 px-4"
      style={{ backgroundColor: COLORS.secondary }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div
                className="flex justify-center mb-4"
                style={{ color: COLORS.white }}
              >
                {stat.icon}
              </div>
              <div
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{ color: COLORS.white }}
              >
                {stat.number}
              </div>
              <div className="text-lg" style={{ color: COLORS.primary }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
