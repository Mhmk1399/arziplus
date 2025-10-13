 import RegisterInternationalExamsContainer from "@/components/static/registerInternationalExams";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "پرداخت هزینه آزمون‌های بین‌المللی در ایران | ارزی پلاس",
  description:
    "پرداخت سریع و امن هزینه آزمون‌های بین‌المللی مانند IELTS، TOEFL، GRE، GMAT و PTE در ایران با خدمات ارزی پلاس. کارمزد پایین، پشتیبانی ۲۴ ساعته و انجام پرداخت در کمتر از ۲۴ ساعت.",
  keywords: [
    "پرداخت هزینه آزمون آیلتس",
    "پرداخت هزینه TOEFL",
    "پرداخت هزینه GRE",
    "پرداخت آزمون بین‌المللی",
    "پرداخت هزینه PTE",
    "پرداخت آزمون‌های زبان",
    "پرداخت آزمون CFA",
    "پرداخت آزمون ACCA",
    "پرداخت آزمون IT",
    "پرداخت آزمون Cisco",
  ],
  openGraph: {
    title: "پرداخت هزینه آزمون‌های بین‌المللی در ایران | ارزی پلاس",
    description:
      "پرداخت هزینه آزمون‌های بین‌المللی مانند IELTS، TOEFL، GRE، GMAT و PTE به‌سادگی و در کوتاه‌ترین زمان با ارزی پلاس. کارمزد رقابتی و پشتیبانی ۲۴ ساعته.",
    url: "https://arziPlus.com/exam-payment",
    siteName: "ارزی پلاس",
    images: [
      {
        url: "/assets/images/exam-payment.jpg",
        width: 1200,
        height: 630,
        alt: "پرداخت هزینه آزمون‌های بین‌المللی",
      },
    ],
    locale: "fa_IR",
    type: "website",
  },
  alternates: {
    canonical: "https://arziPlus.com/exam-payment",
  },
};

const RegisterInternationalExams = () => {
  return (
    <main>
      <RegisterInternationalExamsContainer />
    </main>
  );
};

export default RegisterInternationalExams;
