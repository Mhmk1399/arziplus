import CashingPerfect from "@/components/static/cashingPerfectMoney";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "نقد کردن پرفکت‌مانی | تبدیل سریع Perfect Money به ریال – ارزی پلاس",
  description:
    "تبدیل و نقد کردن موجودی پرفکت‌مانی به ریال یا ارز دیگر در کمتر از ۲۴ ساعت، با بهترین نرخ و کارمزد رقابتی. تسویه امن ووچر و حساب پرفکت‌مانی با ارزی پلاس.",
  keywords: [
    "نقد کردن پرفکت‌مانی",
    "فروش پرفکت‌مانی",
    "تبدیل پرفکت‌مانی به ریال",
    "نقد ووچر پرفکت‌مانی",
    "فروش دلار پرفکت‌مانی",
    "تسویه پرفکت‌مانی",
    "تبدیل PM به ریال",
    "دریافت درآمد پرفکت‌مانی",
  ],
  openGraph: {
    title: "نقد کردن پرفکت‌مانی | تبدیل سریع Perfect Money به ریال – ارزی پلاس",
    description:
      "تبدیل و نقد کردن موجودی پرفکت‌مانی به ریال یا ارز دیگر در کمتر از ۲۴ ساعت، با بهترین نرخ و کارمزد رقابتی. تسویه امن ووچر و حساب پرفکت‌مانی با ارزی پلاس.",
    url: "https://yourdomain.com/cashing-perfect",
    siteName: "ارزی پلاس",
    images: [
      {
        url: "/assets/images/cash-perfect-hero.webp",
        width: 1200,
        height: 630,
        alt: "نقد کردن موجودی پرفکت‌مانی با ارزی پلاس",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "نقد کردن پرفکت‌مانی | تبدیل سریع Perfect Money به ریال – ارزی پلاس",
    description:
      "تبدیل و نقد کردن موجودی پرفکت‌مانی به ریال یا ارز دیگر در کمتر از ۲۴ ساعت، با بهترین نرخ و کارمزد رقابتی. تسویه امن ووچر و حساب پرفکت‌مانی با ارزی پلاس.",
    images: ["/assets/images/cash-perfect-hero.webp"],
  },
};

const RegisterInternationalExams = () => {
  return (
    <main>
      <CashingPerfect />
    </main>
  );
};

export default RegisterInternationalExams;
