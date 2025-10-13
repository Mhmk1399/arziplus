import PaypalCharge from "@/components/static/chargePaypal";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "شارژ فوری پی‌پال در ایران | کمترین کارمزد، امن و سریع – ارزی پلاس",
  description:
    "شارژ حساب پی‌پال شما در کمتر از ۳۰ دقیقه با کمترین کارمزد. بدون نیاز به کارت بین‌المللی، امن و مطمئن. خدمات ویژه ارزی پلاس برای کاربران ایرانی.",
  keywords: [
    "شارژ پی‌پال",
    "شارژ فوری پی‌پال",
    "خرید پی‌پال",
    "پرداخت پی‌پال",
    "افزایش موجودی پی‌پال",
  ],
  openGraph: {
    title: "شارژ فوری پی‌پال در ایران | کمترین کارمزد، امن و سریع – ارزی پلاس",
    description:
      "با ارزی پلاس، حساب پی‌پال خود را سریع، امن و با کمترین کارمزد شارژ کنید. بدون نیاز به کارت بین‌المللی و با پشتیبانی ۲۴ ساعته.",
    url: "https://arziPlus.com/paypal-topup",
    type: "website",
    images: [
      {
        url: "https://arziPlus.com/assets/images/paypal-topup.webp",
        width: 1200,
        height: 630,
        alt: "شارژ پی‌پال در ایران با ارزی پلاس",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "شارژ فوری پی‌پال در ایران | کمترین کارمزد، امن و سریع – ارزی پلاس",
    description:
      "شارژ سریع و امن پی‌پال بدون نیاز به کارت بین‌المللی با ارزی پلاس. مناسب برای کاربران ایرانی.",
    images: ["https://arziPlus.com/assets/images/paypal-topup.webp"],
  },
  alternates: {
    canonical: "https://arziPlus.com/paypal-topup",
  },
};

const RegisterInternationalExams = () => {
  return (
    <main>
      <PaypalCharge />
    </main>
  );
};

export default RegisterInternationalExams;
