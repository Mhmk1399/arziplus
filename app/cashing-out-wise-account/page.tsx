import WisePayout from "@/components/static/cashingWise";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: " نقد وایز در ایران | کمترین کارمزد، امن و سریع – ارزی پلاس",
  description:
    "نقد حساب وایز شما در کمتر از ۳۰ دقیقه با کمترین کارمزد. بدون نیاز به کارت بین‌المللی، امن و مطمئن. خدمات ویژه ارزی پلاس برای کاربران ایرانی.",
  keywords: [
    "شارژ پی‌پال",
    "شارژ فوری پی‌پال",
    "خرید پی‌پال",
    "پرداخت پی‌پال",
    "افزایش موجودی پی‌پال",
  ],
  openGraph: {
    title: "نقد   وایز در ایران | کمترین کارمزد، امن و سریع – ارزی پلاس",
    description:
      "با ارزی پلاس، حساب وایز خود را سریع، امن و با کمترین کارمزد نقد کنید. بدون نیاز به کارت بین‌المللی و با پشتیبانی ۲۴ ساعته.",
    url: "https://arziplus.com/paypal-topup",
    type: "website",
    images: [
      {
        url: "https://arziplus.com/assets/images/paypal-topup.webp",
        width: 1200,
        height: 630,
        alt: "نقد وایز در ایران با ارزی پلاس",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "نقد فوری وایز در ایران | کمترین کارمزد، امن و سریع – ارزی پلاس",
    description:
      "نقد سریع و امن وایز بدون نیاز به کارت بین‌المللی با ارزی پلاس. مناسب برای کاربران ایرانی.",
    images: ["https://arziplus.com/assets/images/paypal-topup.webp"],
  },
  alternates: {
    canonical: "https://arziplus.com/paypal-topup",
  },
};

const RegisterInternationalExams = () => {
  return (
    <main>
      <WisePayout />
    </main>
  );
};

export default RegisterInternationalExams;
