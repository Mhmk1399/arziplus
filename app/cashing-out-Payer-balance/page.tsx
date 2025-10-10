import CashingPayeer from "@/components/static/cashingPayeer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "نقد کردن پایر | تبدیل Payeer به ریال سریع و امن – ارزی پلاس",
  description:
    "تبدیل و نقد کردن موجودی پایر (Payeer) دلاری، یورویی، روبلی یا رمزارز به ریال در کمتر از ۲۴ ساعت، با بهترین نرخ و کارمزد منصفانه. تسویه فوری پایر با ارزی پلاس.",
  keywords: [
    "نقد کردن پایر",
    "فروش پایر",
    "تبدیل پایر به ریال",
    "فروش دلار پایر",
    "نقد ووچر پایر",
    "تبدیل روبل پایر به ریال",
    "نقد ارز دیجیتال پایر",
    "تسویه پایر",
  ],
  openGraph: {
    title: "نقد کردن پایر | تبدیل Payeer به ریال سریع و امن – ارزی پلاس",
    description:
      "تبدیل و نقد کردن موجودی پایر (Payeer) دلاری، یورویی، روبلی یا رمزارز به ریال در کمتر از ۲۴ ساعت، با بهترین نرخ و کارمزد منصفانه. تسویه فوری پایر با ارزی پلاس.",
    url: "https://yourdomain.com/cashing-payeer",
    siteName: "ارزی پلاس",
    images: [
      {
        url: "/assets/images/cash-payeer-hero.webp",
        width: 1200,
        height: 630,
        alt: "نقد کردن موجودی پایر با ارزی پلاس",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "نقد کردن پایر | تبدیل Payeer به ریال سریع و امن – ارزی پلاس",
    description:
      "تبدیل و نقد کردن موجودی پایر (Payeer) دلاری، یورویی، روبلی یا رمزارز به ریال در کمتر از ۲۴ ساعت، با بهترین نرخ و کارمزد منصفانه. تسویه فوری پایر با ارزی پلاس.",
    images: ["/assets/images/cash-payeer-hero.webp"],
  },
};

const RegisterInternationalExams = () => {
  return (
    <main>
      <CashingPayeer />
    </main>
  );
};

export default RegisterInternationalExams;
