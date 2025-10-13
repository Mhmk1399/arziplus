 import PayeerOpening from "@/components/static/payeerOpening";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "افتتاح حساب پایر (Payeer) در ایران | وریفای، تبدیل ارز، رمزارز | ارزی پلاس",
  description:
    "افتتاح حساب پایر وریفای‌شده در کمتر از ۲۴ ساعت با ارزی پلاس. کارمزد پایین، تبدیل سریع ارزها، خرید و فروش رمزارز و پشتیبانی ۲۴ ساعته.",
  keywords: [
    "افتتاح حساب پایر",
    "افتتاح حساب پایر در ایران",
    "وریفای پایر",
    "حساب بین‌المللی پایر",
    "کارمزد پایر",
    "ساخت اکانت Payeer",
    "تبدیل ارز در پایر",
    "خرید و فروش رمزارز با پایر",
    "شارژ حساب پایر",
    "نقد کردن موجودی پایر",
  ],
  openGraph: {
    title: "افتتاح حساب پایر (Payeer) در ایران | وریفای، تبدیل ارز، رمزارز | ارزی پلاس",
    description:
      "با ارزی پلاس، حساب پایر وریفای‌شده و امن در کمتر از ۲۴ ساعت افتتاح کنید. کارمزد پایین، تبدیل سریع ارزها، خرید و فروش رمزارز و پشتیبانی ۲۴ ساعته.",
    url: "https://arziPlus.com/opening-payeer",
    type: "website",
    images: [
      {
        url: "https://arziPlus.com/assets/images/payeer-opening.webp",
        width: 1200,
        height: 630,
        alt: "افتتاح حساب پایر در ایران",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "افتتاح حساب پایر (Payeer) در ایران | وریفای، تبدیل ارز، رمزارز | ارزی پلاس",
    description:
      "با ارزی پلاس، حساب پایر وریفای‌شده و امن در کمتر از ۲۴ ساعت افتتاح کنید. کارمزد پایین، تبدیل سریع ارزها، خرید و فروش رمزارز و پشتیبانی ۲۴ ساعته.",
    images: ["https://arziPlus.com/assets/images/payeer-opening.webp"],
  },
  alternates: {
    canonical: "https://arziPlus.com/opening-payeer",
  },
};


const PayeerContainer = () => {
  return (
    <main>
      <PayeerOpening />
    </main>
  );
};

export default PayeerContainer;
