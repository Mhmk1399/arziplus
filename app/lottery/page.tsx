import LotteryRegistrationPage from "@/components/static/lottery";
import { SchemaGenerator } from "@/lib/schema-generator";
import { Metadata } from "next";
import React from "react";

// Generate metadata for lottery page
export const metadata: Metadata = {
  title: "ثبت نام لاتاری گرین کارت آمریکا از ایران - ارزی پلاس",
  description:
    "ثبت نام حرفه ای در لاتاری گرین کارت آمریکا با ارزی پلاس. خدمات کامل شامل ثبت نام، بررسی مدارک، اصلاح عکس و پیگیری تا دریافت ویزا. ضمانت ثبت نام موفق",
  keywords: [
    "لاتاری گرین کارت",
    "ثبت نام لاتاری آمریکا",
    "گرین کارت آمریکا",
    "اقامت دائم آمریکا",
    "ویزا آمریکا",
    "مهاجرت به آمریکا",
    "لاتاری DV",
    "ارزی پلاس",
    "ثبت نام آنلاین لاتاری",
    "خدمات مهاجرتی",
  ],
  authors: [{ name: "ارزی پلاس" }],
  creator: "ارزی پلاس",
  publisher: "ارزی پلاس",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "https://arziPlus.com/lottery",
    title: "ثبت نام لاتاری گرین کارت آمریکا از ایران - ارزی پلاس",
    description:
      "ثبت نام حرفه ای در لاتاری گرین کارت آمریکا با ارزی پلاس. خدمات کامل شامل ثبت نام، بررسی مدارک، اصلاح عکس و پیگیری تا دریافت ویزا",
    siteName: "ارزی پلاس",
    images: [
      {
        url: "https://arziPlus.com/images/lottery-og.jpg",
        width: 1200,
        height: 630,
        alt: "ثبت نام لاتاری گرین کارت آمریکا - ارزی پلاس",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ثبت نام لاتاری گرین کارت آمریکا از ایران - ارزی پلاس",
    description:
      "ثبت نام حرفهای در لاتاری گرین کارت آمریکا با ارزی پلاس. خدمات کامل و ضمانت ثبت نام موفق",
    images: ["https://arziPlus.com/images/lottery-twitter.jpg"],
  },
  alternates: {
    canonical: "https://arziPlus.com/lottery",
  },
};

// Generate FAQ schema from components
function generateFAQSchema() {
  const faqData = [
    // FAQSection data
    {
      question: "گرین کارت چیست؟",
      answer:
        "گرین کارت (اقامت دائم آمریکا) یک سند قانونی است که به دارنده آن اجازه میدهد مانند شهروند آمریکا در این کشور زندگی کند، کار کند و از حمایت قوانین شهروندان بهرهمند شود.",
    },
    {
      question: "برنامه لاتاری گرین کارت چیست؟",
      answer:
        "لاتاری گرین کارت آمریکا یک قرعهکشی سالانه است که افراد واجد شرایط را انتخاب میکند تا اقامت دائم ایالات متحده را دریافت کنند.",
    },
    {
      question: "مزایای برنده شدن در لاتاری چیست؟",
      answer:
        "برندگان لاتاری با ارزی پلاس میتوانند از حقوق و مزایایی شبیه شهروندان آمریکا بهرهمند شوند، مانند تحصیل، کار، بیمه، خدمات درمانی، امکان درخواست تابعیت و پاسپورت آمریکا.",
    },
    {
      question: "شرایط و مدارک لازم ثبتنام چیست؟",
      answer:
        "برای ثبتنام با ارزی پلاس کافی است: مشخصات فردی، عکس لاتاری استاندارد، پرداخت هزینه ثبتنام. نیازی به ارسال مدارک تحصیلی، شغلی یا زبان در مرحله ثبتنام نیست.",
    },
    {
      question: "چه افرادی واجد شرایط شرکت در لاتاری هستند؟",
      answer:
        "افرادی که در کشور مجاز به ثبتنام متولد شدهاند و دارای حداقل مدرک دیپلم یا دو سال سابقه کار معتبر هستند، میتوانند ثبتنام کنند.",
    },
    {
      question: "شرایط فرزندان برای ثبت در زیر مجموعه چیست؟",
      answer:
        "فرزندان زیر ۱۸ سال باید به عنوان زیرمجموعه والدین ثبت شوند. فرزندان بین ۱۸ تا ۲۱ سال میتوانند هم در فرم والدین باشند و هم بهصورت مستقل ثبتنام کنند.",
    },
    {
      question: "عکس لاتاری چگونه باید باشد؟",
      answer:
        "عکس باید با وضوح بالا، بدون کلاه یا عینک، چهره کاملاً مشخص باشد. ارزی پلاس راهنمای تهیه عکس را به شما ارائه میدهد و در صورت نیاز عکس شما را اصلاح میکند.",
    },
    // AdditionalFAQs data
    {
      question: "چگونه در لاتاری شرکت کنم؟",
      answer:
        "کافی است به پلتفرم رسمی ثبتنام لاتاری ارزی پلاس مراجعه کرده و فرم را تکمیل کنید.",
    },
    {
      question: "روش افزایش شانس برنده شدن وجود دارد؟",
      answer:
        "هیچ روشی قطعی برای افزایش شانس وجود ندارد؛ اما افراد متأهل میتوانند با ثبتنام دوشانسه، شانس خود را دو برابر کنند.",
    },
    {
      question: "تاریخ و روند اعلام نتایج چیست؟",
      answer:
        "نتایج قرعهکشی معمولاً در اواسط اردیبهشت ماه منتشر میشوند. در صورتی که برنده شوید، تیم ارزی پلاس مراحل بعدی مهاجرت و ویزا را برای شما پیگیری میکند.",
    },
    {
      question: "چگونه بفهمم برنده شدهام؟",
      answer:
        "افراد باید به پورتال استعلام نتایج مراجعه کنند و وضعیت خود را وارد کنند. ارزی پلاس برای کاربران خود نتایج را بصورت ایمیل، پیامک و در پنل کاربری اعلام میکند.",
    },
    {
      question: "چه زمانی باید وارد آمریکا شویم؟",
      answer:
        "معمولاً پس از صدور ویزا، شما حدود ۶ ماه فرصت دارید به آمریکا وارد شوید. انتخاب ایالت و محل سكونت به عهده خودتان است.",
    },
    {
      question: "هزینه خدمات آنلاین چیست؟",
      answer:
        "هزینه خدمات به تعداد اعضای خانواده بستگی دارد و پس از محاسبه، به متقاضی اعلام میشود.",
    },
    {
      question: "چرا به ارزی پلاس اعتماد کنیم؟",
      answer:
        "ارزی پلاس با تیم متخصص، مجوزهای معتبر و سابقه موفق در امور مهاجرتی، تمامی مراحل ثبتنام، بررسی فرم، ترجمه، عکاسی، و کارگزاری امور برندگان را به صورت کاملاً حرفهای انجام میدهد.",
    },
    {
      question: "خدمات ارزی پلاس چیست؟",
      answer:
        "ثبتنام کامل لاتاری، مشاوره پیش از ثبتنام، بررسی اطلاعات و رفع ایرادات، ترجمه به انگلیسی، اصلاح عکس، پشتیبانی ۲۴ ساعته، ارسال PDF تأییدیه، اعلام نتایج و کارگزاری کامل پرونده برندگان.",
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

const page = () => {
  const schemaGenerator = new SchemaGenerator();
  const serviceSchema = schemaGenerator.generateSchema("/lottery");
  const faqSchema = generateFAQSchema();

  return (
    <>
      {/* Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "ارزی پلاس",
            url: "https://arziPlus.com",
            logo: "https://arziPlus.com/logo.png",
            description: "ارائه خدمات پرداخت ارزی، خرید اشتراک و خدمات مهاجرتی",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+98-21-12345678",
              contactType: "customer service",
              availableLanguage: "Persian",
            },
            areaServed: "Iran",
            serviceType: [
              "Immigration Services",
              "Payment Services",
              "Currency Exchange",
            ],
          }),
        }}
      />

      <div className="mt-20">
        <LotteryRegistrationPage />
      </div>
    </>
  );
};

export default page;
