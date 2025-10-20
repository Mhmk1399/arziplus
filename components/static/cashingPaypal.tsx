import { Metadata } from "next";

import {
  ctaThemes,
  faqThemes,
  splitSectionThemes,
  stepThemes,
  themesWhyus,
} from "@/lib/theme";
import {
  FaClock,
  FaHeadset,
  FaLock,
  FaDollarSign,
  FaRocket,
  FaCoins,
  FaPercent,
  FaMedal,
  FaEnvelope,
} from "react-icons/fa6";
import { FaShieldAlt } from "react-icons/fa";
import HeroSection from "../global/heroSection";
import StepsSection from "../global/stepsSection";
import WhyUsSection from "../global/whyUs";
import HeroSplitSection from "../global/heroSplitSection";
import FAQSection from "../global/faqSection";
import CTABanner from "../global/ctaBanner";

export const metadata: Metadata = {
  title: "نقد کردن موجودی پی‌پال در ایران | ارزی پلاس",
  description:
    "با ارزی پلاس، موجودی پی‌پال خود را سریع و امن در ایران نقد کنید. تسویه در کمتر از ۲۴ ساعت، کارمزد پایین و پشتیبانی ۲۴ ساعته.",
  keywords: [
    "نقد کردن پی‌پال",
    "برداشت پی‌پال در ایران",
    "پی‌پال ارزی پلاس",
    "تبدیل موجودی پی‌پال",
    "حساب پی‌پال ایرانی",
  ],
  openGraph: {
    title: "نقد کردن موجودی پی‌پال در ایران | ارزی پلاس",
    description:
      "تسویه سریع و امن موجودی پی‌پال در ایران با ارزی پلاس. کارمزد پایین و پشتیبانی ۲۴ ساعته برای فریلنسرها و فروشندگان آنلاین.",
    url: "https://arziPlus.com/cashing-paypal",
    type: "website",
    images: [
      {
        url: "https://arziPlus.com/assets/images/cash-paypal.webp",
        width: 1200,
        height: 630,
        alt: "نقد کردن موجودی پی‌پال",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "نقد کردن موجودی پی‌پال در ایران | ارزی پلاس",
    description:
      "موجودی پی‌پال خود را با ارزی پلاس نقد کنید. تسویه سریع، کارمزد پایین و پشتیبانی ۲۴ ساعته.",
    images: ["https://arziPlus.com/assets/images/cash-paypal.webp"],
  },
  alternates: {
    canonical: "https://arziPlus.com/cashing-paypal",
  },
};

const CashingPaypal = () => {
  const cashingSteps = [
    {
      id: "fastPayment",
      title: "تسویه سریع در کمتر از ۲۴ ساعت کاری",
      description:
        "با ارزی پلاس، موجودی پی‌پال شما در کوتاه‌ترین زمان به ریال منتقل می‌شود.",
      icon: <FaClock />,
      isActive: true,
    },
    {
      id: "competitiveFees",
      title: "کارمزد رقابتی و نرخ تبدیل شفاف",
      description:
        "نرخ تبدیل و کارمزد کاملاً شفاف برای همه کاربران ارائه می‌شود.",
      icon: <FaPercent />,
    },
    {
      id: "multiCurrency",
      title: "امکان نقد موجودی دلاری، یورویی و سایر ارزها",
      description:
        " تمام ارزهای اصلی قابل نقد شدن هستند و مبلغ ریالی به حساب شما منتقل می‌شوند.",
      icon: <FaDollarSign />,
      isActive: true,
    },
    {
      id: "fullSupport",
      title: "پشتیبانی ۲۴ ساعته",
      description: "تیم پشتیبانی ارزی پلاس همیشه آماده پاسخگویی است.",
      icon: <FaHeadset />,
    },
    {
      id: "securePayment",
      title: "بدون ریسک مسدود شدن حساب",
      description:
        "تمامی تراکنش‌ها با امنیت بالا انجام می‌شود و حساب شما در امان است.",
      icon: <FaLock />,
      isActive: true,
    },
  ];
  const cashingUseCases = [
    {
      id: 1,
      icon: <FaDollarSign size={32} />,
      title: "دریافت درآمد فریلنسری",
      description:
        "برداشت درآمد از Upwork، Fiverr، Freelancer و سایر پلتفرم‌های خارجی.",
    },
    {
      id: 2,
      icon: <FaCoins size={32} />,
      title: "تسویه فروشگاه‌های بین‌المللی",
      description:
        "نقد کردن درآمد فروش در eBay، Etsy و دیگر فروشگاه ها با ارزی پلاس.",
    },
    {
      id: 3,
      icon: <FaRocket size={32} />,
      title: "پرداخت مشتریان خارجی",
      description:
        "دریافت و نقد کردن پرداخت‌های مشتریان خارج از ایران با امنیت کامل.",
    },
    {
      id: 4,
      icon: <FaMedal size={32} />,
      title: "تبدیل درآمد دلاری به ریال",
      description:
        "تبدیل سریع و مطمئن درآمد دلاری با بهترین نرخ بازار با ارزی پلاس.",
    },
  ];
  const cashingFaq = [
    {
      id: "1",
      question: "آیا امکان نقد کردن پی‌پال محدودشده وجود دارد؟",
      answer: "خیر، ابتدا باید محدودیت حساب رفع شود.",
      category: "نقد کردن پی‌پال",
    },
    {
      id: "2",
      question: "آیا می‌توان بخشی از موجودی را نقد کرد؟",
      answer: "بله، نقد کردن هر مبلغی امکان‌پذیر است.",
      category: "نقد کردن پی‌پال",
    },
    {
      id: "3",
      question: "آیا کارمزد ثابت وجود دارد؟",
      answer: "خیر، کارمزد بسته به مبلغ و نوع تراکنش محاسبه می‌شود.",
      category: "نقد کردن پی‌پال",
    },
  ];

  return (
    <div>
      <HeroSection
        heading="تسویه سریع و امن موجودی پی‌پال در ایران با ارزی پلاس"
        subheading="نقد کردن موجودی پی‌پال"
        description="پی‌پال (PayPal) یکی از محبوب‌ترین سیستم‌های پرداخت بین‌المللی است که بسیاری از فریلنسرها، فروشندگان آنلاین و صاحبان کسب‌وکارهای بین‌المللی از آن برای دریافت درآمد استفاده می‌کنند. اما کاربران ایرانی به دلیل محدودیت‌های بانکی، امکان برداشت مستقیم از پی‌پال را ندارند.
با خدمات ارزی پلاس، می‌توانید موجودی پی‌پال خود را در کوتاه‌ترین زمان به ریال یا ارزهای دیگر تبدیل کنید، با بهترین نرخ و بدون ریسک مسدود شدن حساب."
        buttons={[
          {
            text: "ثبت درخواست نقد کردن پی‌پال",
            href: "/services/cashing-out-PayPal-balance",
            variant: "secondary",
            icon: <FaRocket />,
          },
        ]}
        media={{
          type: "image",
          src: "https://arziplus.storage.c2.liara.space/images/pages/16-min.png",
          alt: "نقد کردن موجودی پی‌پال",
          width: 1200,
          height: 800,
        }}
        layout="default"
        theme={{
          headingColor: "text-gray-50",
          subheadingColor: "text-gray-700",
          descriptionColor: "text-gray-200",
          backgroundColor: "bg-blue-600",
        }}
      />

      <StepsSection
        heading="مزایای نقد کردن پی‌پال با ارزی پلاس"
        description="با ارزی پلاس، تسویه سریع، کارمزد شفاف و امنیت کامل را تجربه کنید:"
        steps={cashingSteps}
        theme={stepThemes.default}
        layout="vertical"
        boxShape="rounded"
        boxSize="sm"
        showNumbers={true}
        animated={true}
        showIcons={true}
      />

      <WhyUsSection
        heading="کاربردهای نقد کردن پی‌پال"
        description="دریافت درآمد از فریلنسری، فروشگاه‌ها و مشتریان خارجی:"
        buttonText="ثبت درخواست نقد کردن"
        buttonLink="/services/cashing-out-PayPal-balance"
        items={cashingUseCases}
        theme={themesWhyus.default}
      />

      <HeroSplitSection
        heading="چرا ارزی پلاس؟"
        subHeading="سابقه، امنیت و پشتیبانی حرفه‌ای"
        description="ارزی پلاس با سابقه چندین ساله، تضمین امنیت تراکنش‌ها و نرخ رقابتی، بهترین گزینه برای نقد کردن پی‌پال است."
        buttons={[
          {
            text: "ثبت درخواست نقد کردن",
            href: "/services/cashing-out-PayPal-balance",
            variant: "primary",
            icon: <FaShieldAlt />,
          },
        ]}
        imageSrc="https://arziplus.storage.c2.liara.space/images/pages/every.png"
        imageAlt="ارزی پلاس"
        theme={splitSectionThemes.dark}
        layout="image-left"
        imageWidth="1/2"
        features={[
          {
            id: 1,
            title: "تجربه چندین ساله",
            description:
              "ارزی پلاس با سابقه چندین ساله بهترین خدمات نقد کردن پی‌پال را ارائه می‌دهد.",
            icon: <FaMedal />,
          },
          {
            id: 2,
            title: "امنیت کامل تراکنش‌ها",
            description: "اطمینان از امنیت و محرمانگی کامل اطلاعات کاربران.",
            icon: <FaLock />,
          },
          {
            id: 3,
            title: "پشتیبانی حرفه‌ای",
            description:
              "پشتیبانی ۲۴ ساعته در تمام مراحل نقد کردن موجودی پی‌پال.",
            icon: <FaHeadset />,
          },
        ]}
      />

      <FAQSection
        heading="سؤالات متداول"
        description="پرسش‌های پرتکرار درباره نقد کردن موجودی پی‌پال"
        faqItems={cashingFaq}
        buttons={[
          {
            text: "ارسال سوال",
            href: "/contact",
            variant: "outline",
            icon: <FaEnvelope />,
          },
        ]}
        theme={faqThemes.dark}
        layout="default"
        showCategories={true}
        searchable={false}
        animate={true}
      />

      <CTABanner
        heading="    موجودی پی‌پال خود را با ارزی پلاس نقد کنید!"
        description="با ارزی پلاس، درآمدتان سریع و مطمئن دریافت می‌شود."
        button={{
          text: "ثبت درخواست نقد کردن پی‌پال",
          href: "/dashboard#services",
          variant: "primary",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.primary}
        height={50}
      />
    </div>
  );
};

export default CashingPaypal;
