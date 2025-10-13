import React from "react";
import { COLORS } from "../lottery";
import { Shield, Users, Clock, CheckCircle, Star, Award } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Shield className="w-12 h-12" />,
      title: "امنیت کامل",
      description:
        "تمامی اطلاعات شما با بالاترین استانداردهای امنیتی محافظت می‌شود",
      color: COLORS.accent,
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "تیم متخصص",
      description: "کارشناسان مجرب ما در تمام مراحل در کنار شما هستند",
      color: COLORS.secondary,
    },
    {
      icon: <Clock className="w-12 h-12" />,
      title: "پشتیبانی ۲۴/۷",
      description: "پشتیبانی مداوم از طریق تلگرام، تماس و حضوری",
      color: COLORS.primary,
    },
    {
      icon: <CheckCircle className="w-12 h-12" />,
      title: "تضمین کیفیت",
      description: "بررسی دقیق فرم‌ها و رفع نواقص قبل از ارسال",
      color: COLORS.accent,
    },
    {
      icon: <Star className="w-12 h-12" />,
      title: "رضایت مشتریان",
      description: "هزاران مشتری راضی و برنده لاتاری با ارزی پلاس",
      color: COLORS.secondary,
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: "مجوزهای معتبر",
      description: "دارای تمامی مجوزهای لازم برای ارائه خدمات مهاجرتی",
      color: COLORS.primary,
    },
  ];
  return (
    <section className="py-20 px-4" style={{ backgroundColor: COLORS.primary }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: COLORS.white }}
          >
            چرا ارزی پلاس؟
          </h2>
          <p className="text-xl" style={{ color: COLORS.secondary }}>
            مزایای ثبت‌نام لاتاری با ارزی پلاس
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl p-8 transition-all hover:scale-105"
              style={{ backgroundColor: COLORS.white }}
            >
              <div
                className="inline-flex p-4 rounded-xl mb-6"
                style={{
                  backgroundColor: `${feature.color}20`,
                  color: feature.color,
                }}
              >
                {feature.icon}
              </div>
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: COLORS.primary }}
              >
                {feature.title}
              </h3>
              <p style={{ color: COLORS.gray }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
