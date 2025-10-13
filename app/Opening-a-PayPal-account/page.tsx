import PaypalOpening from "@/components/static/openingPaypal";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "افتتاح حساب پی پال بین‌المللی و وریفای‌شده در ایران | ارزی پلاس",
  description:
    "با ارزی پلاس، بدون نیاز به سفر یا اقامت خارج از کشور، حساب پی‌پال بین‌المللی و وریفای‌شده خود را در ایران افتتاح کنید. امکان ارسال و دریافت پول، خرید از سایت‌های خارجی و نقد کردن موجودی پی‌پال با امنیت کامل.",
  keywords: [
    "افتتاح حساب پی‌پال",
    "افتتاح حساب پی‌پال در ایران",
    "وریفای پی‌پال",
    "خرید پی‌پال در ایران",
    "حساب پی‌پال بین‌المللی",
    "ساخت اکانت پی‌پال وریفای شده",
    "نقد کردن موجودی پی‌پال",
    "خدمات پی‌پال برای ایرانیان",
    "ثبت نام پی‌پال بدون محدودیت",
    "آموزش استفاده از پی‌پال",
  ],
  openGraph: {
    title: "افتتاح حساب پی پال بین‌المللی و وریفای‌شده در ایران | ارزی پلاس",
    description:
      "ارزی پلاس خدمات افتتاح حساب پی‌پال وریفای‌شده و بدون محدودیت را برای ایرانیان فراهم می‌کند. نقد کردن موجودی پی‌پال و پرداخت‌های بین‌المللی با امنیت کامل.",
    url: "https://arziPlus.com/opening-paypal",
    type: "website",
    images: [
      {
        url: "https://arziPlus.com/assets/images/paypal-opening.webp",
        width: 1200,
        height: 630,
        alt: "افتتاح حساب پی‌پال در ایران",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "افتتاح حساب پی پال بین‌المللی در ایران | ارزی پلاس",
    description:
      "با ارزی پلاس، حساب پی‌پال وریفای‌شده خود را در ایران افتتاح کنید. خرید خارجی، انتقال پول و نقد کردن موجودی پی‌پال بدون محدودیت.",
    images: ["https://arziPlus.com/assets/images/paypal-opening.webp"],
  },
  alternates: {
    canonical: "https://arziPlus.com/opening-paypal",
  },
};

const RegisterInternationalExams = () => {
  return (
    <main>
      <PaypalOpening />
    </main>
  );
};

export default RegisterInternationalExams;
