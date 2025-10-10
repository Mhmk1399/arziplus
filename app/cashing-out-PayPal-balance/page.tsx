 import CashingPaypal from "@/components/static/cashingPaypal";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "نقد کردن موجودی پی‌پال | تسویه سریع و امن با ارزی پلاس",
  description:
    "نقد کردن موجودی پی‌پال در کمتر از ۲۴ ساعت با بهترین نرخ و کارمزد رقابتی. تسویه امن درآمد فریلنسری و فروش بین‌المللی به ریال یا ارز دیگر با ارزی پلاس.",
  keywords: [
    "نقد کردن پی‌پال",
    "فروش دلار پی‌پال",
    "تبدیل پی‌پال به ریال",
    "تسویه پی‌پال",
    "نقد کردن موجودی دلاری پی‌پال",
    "دریافت درآمد فریلنسری",
    "فروش دلار پی‌پال فوری",
    "تبدیل یورو پی‌پال به ریال",
  ],
  openGraph: {
    title: "نقد کردن موجودی پی‌پال | تسویه سریع و امن با ارزی پلاس",
    description:
      "با ارزی پلاس، موجودی پی‌پال خود را سریع و امن نقد کنید. تسویه درآمد فریلنسری و فروش بین‌المللی به ریال یا ارز دیگر در کمتر از ۲۴ ساعت و با کارمزد رقابتی.",
    url: "https://arziplus.com/cashing-paypal",
    siteName: "ارزی پلاس",
    type: "website",
    images: [
      {
        url: "https://arziplus.com/assets/images/cash-paypal.webp",
        width: 1200,
        height: 630,
        alt: "نقد کردن موجودی پی‌پال با ارزی پلاس",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "نقد کردن موجودی پی‌پال | تسویه سریع و امن با ارزی پلاس",
    description:
      "موجودی پی‌پال خود را با ارزی پلاس نقد کنید. تسویه سریع درآمد فریلنسری و فروش بین‌المللی به ریال یا ارز دیگر با کارمزد رقابتی و پشتیبانی ۲۴ ساعته.",
    images: ["https://arziplus.com/assets/images/cash-paypal.webp"],
  },
  alternates: {
    canonical: "https://arziplus.com/cashing-paypal",
  },
};
const RegisterInternationalExams = () => {
  return (
    <main>
      <CashingPaypal />
    </main>
  );
};

export default RegisterInternationalExams;
