 import PerfectMoney from "@/components/static/perfectMoney";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "افتتاح حساب پرفکت‌مانی در ایران | وریفای و خرید ووچر | ارزی پلاس",
  description:
    "افتتاح حساب پرفکت‌مانی وریفای‌شده در کمتر از ۲۴ ساعت با ارزی پلاس. خرید و فروش ووچر، انتقال وجه دلاری، یورویی، طلا و رمزارز با کارمزد پایین.",
  keywords: [
    "افتتاح حساب پرفکت‌مانی",
    "افتتاح حساب پرفکت‌مانی در ایران",
    "وریفای پرفکت‌مانی",
    "خرید ووچر پرفکت‌مانی",
    "حساب بین‌المللی پرفکت‌مانی",
    "انتقال وجه پرفکت‌مانی",
    "کارمزد پرفکت‌مانی",
    "پرفکت‌مانی طلا",
    "خرید رمزارز با پرفکت‌مانی",
    "ساخت اکانت Perfect Money",
  ],
  openGraph: {
    title: "افتتاح حساب پرفکت‌مانی در ایران | وریفای و خرید ووچر | ارزی پلاس",
    description:
      "افتتاح حساب پرفکت‌مانی وریفای‌شده در کمتر از ۲۴ ساعت با ارزی پلاس. خرید و فروش ووچر، انتقال وجه دلاری، یورویی، طلا و رمزارز با کارمزد پایین.",
    url: "https://arziPlus.com/opening-perfectmoney",
    type: "website",
    images: [
      {
        url: "https://arziPlus.com/assets/images/perfectmoney-opening.webp",
        width: 1200,
        height: 630,
        alt: "افتتاح حساب پرفکت‌مانی در ایران",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "افتتاح حساب پرفکت‌مانی در ایران | وریفای و خرید ووچر | ارزی پلاس",
    description:
      "افتتاح حساب پرفکت‌مانی وریفای‌شده در کمتر از ۲۴ ساعت با ارزی پلاس. خرید و فروش ووچر، انتقال وجه دلاری، یورویی، طلا و رمزارز با کارمزد پایین.",
    images: ["https://arziPlus.com/assets/images/perfectmoney-opening.webp"],
  },
  alternates: {
    canonical: "https://arziPlus.com/opening-perfectmoney",
  },
};

const PerfectMoneyContainer = () => {
  return (
    <main>
      <PerfectMoney />
    </main>
  );
};

export default PerfectMoneyContainer;
