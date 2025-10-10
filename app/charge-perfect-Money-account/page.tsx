import PerfectCharge from "@/components/static/perfectMoneyCharge";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "شارژ سریع پرفکت‌مانی و خرید ووچر در ایران | امن و فوری | ارزی پلاس",
  description:
    "شارژ حساب پرفکت‌مانی و خرید ووچر با ارزی پلاس در کمتر از ۳۰ دقیقه، با کارمزد شفاف و نرخ رقابتی. پشتیبانی ۲۴ ساعته و امنیت کامل تراکنش‌ها.",
  keywords: [
    "شارژ پرفکت‌مانی",
    "خرید ووچر پرفکت‌مانی",
    "Perfect Money",
    "شارژ حساب بین‌المللی",
    "ووچر پرفکت‌مانی",
    "پرداخت آنلاین",
    "نقد کردن ووچر",
  ],
  openGraph: {
    title: "شارژ سریع پرفکت‌مانی و خرید ووچر پرفکت‌مانی در ایران | ارزی پلاس",
    description:
      "با ارزی پلاس حساب پرفکت‌مانی خود را شارژ یا ووچر خریداری کنید. خدمات سریع، امن و با پشتیبانی ۲۴ ساعته.",
    url: "https://arziplus.com/perfect-money",
    type: "website",
    images: [
      {
        url: "https://arziplus.com/assets/images/perfectmoney.webp",
        width: 1200,
        height: 630,
        alt: "شارژ و خرید ووچر پرفکت‌مانی",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "شارژ سریع پرفکت‌مانی و خرید ووچر در ایران | ارزی پلاس",
    description:
      "با ارزی پلاس، حساب پرفکت‌مانی خود را شارژ یا ووچر خریداری کنید. امن، سریع و با نرخ رقابتی.",
    images: ["https://arziplus.com/assets/images/perfectmoney.webp"],
  },
  alternates: {
    canonical: "https://arziplus.com/perfect-money",
  },
};

const PerfectVoucherContainer = () => {
  return (
    <main>
      <PerfectCharge />
    </main>
  );
};

export default PerfectVoucherContainer;
