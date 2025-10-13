 import WiseOpening from "@/components/static/wiseOpening";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "افتتاح حساب وایز (Wise) در ایران | وریفای و کارت | ارزی پلاس",
  description:
    "با ارزی پلاس، حساب وایز (Wise) وریفای‌شده در انگلستان/اروپا افتتاح کنید. کارت فیزیکی/مجازی، کارمزد پایین، اتصال به PayPal/Stripe و پشتیبانی ۲۴ ساعته.",
  keywords: [
    "افتتاح حساب وایز",
    "افتتاح حساب وایز در ایران",
    "وریفای وایز",
    "حساب بین‌المللی وایز",
    "کارت وایز",
  ],
  openGraph: {
    title: "افتتاح حساب وایز (Wise) در ایران | وریفای و کارت | ارزی پلاس",
    description:
      "با ارزی پلاس، حساب وایز وریفای‌شده و امن در انگلستان/اروپا افتتاح کنید. کارت فیزیکی و مجازی، اتصال به PayPal/Stripe و پشتیبانی ۲۴ ساعته.",
    url: "https://arziPlus.com/opening-wise",
    type: "website",
    images: [
      {
        url: "https://arziPlus.com/assets/images/wise-opening.webp",
        width: 1200,
        height: 630,
        alt: "افتتاح حساب وایز در ایران",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "افتتاح حساب وایز (Wise) در ایران | وریفای و کارت | ارزی پلاس",
    description:
      "با ارزی پلاس، حساب وایز وریفای‌شده و امن در انگلستان/اروپا افتتاح کنید. کارت فیزیکی/مجازی، کارمزد پایین و پشتیبانی ۲۴ ساعته.",
    images: ["https://arziPlus.com/assets/images/wise-opening.webp"],
  },
  alternates: {
    canonical: "https://arziPlus.com/opening-wise",
  },
};

const RegisterInternationalExams = () => {
  return (
    <main>
      <WiseOpening />
    </main>
  );
};

export default RegisterInternationalExams;
