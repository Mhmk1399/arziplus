 import PayeerCharge from "@/components/static/payeerCharge";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "شارژ فوری پایر با بهترین نرخ | امن، سریع و پشتیبانی ۲۴ ساعته – ارزی پلاس",
  description:
    "شارژ سریع پایر به دلار، یورو و روبل در کمتر از ۳۰ دقیقه با بهترین نرخ و کارمزد شفاف. خدمات امن و پشتیبانی ۲۴ ساعته توسط ارزی پلاس.",
  keywords: [
    "شارژ پایر",
    "شارژ فوری پایر",
    "خرید پایر",
    "شارژ دلار پایر",
    "شارژ یورو پایر",
    "شارژ روبل پایر",
  ],
  openGraph: {
    title: "شارژ فوری پایر در ایران با بهترین نرخ | ارزی پلاس",
    description:
      "خدمات سریع و امن شارژ پایر به دلار، یورو و روبل با پشتیبانی ۲۴ ساعته. بدون نیاز به کارت بین‌المللی و با کارمزد شفاف.",
    url: "https://arziplus.com/payeer",
    type: "website",
    images: [
      {
        url: "https://arziplus.com/assets/images/payeer.webp",
        width: 1200,
        height: 630,
        alt: "شارژ سریع پایر در ایران",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "شارژ فوری پایر با بهترین نرخ | ارزی پلاس",
    description:
      "با ارزی پلاس حساب پایر خود را در کمتر از ۳۰ دقیقه شارژ کنید. امن، سریع و با بهترین نرخ.",
    images: ["https://arziplus.com/assets/images/payeer.webp"],
  },
  alternates: {
    canonical: "https://arziplus.com/payeer",
  },
};

const PayeerChargeContainer = () => {
  return (
    <main>
      <PayeerCharge />
    </main>
  );
};

export default PayeerChargeContainer;
