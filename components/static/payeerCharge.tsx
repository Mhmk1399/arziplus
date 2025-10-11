 
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
  FaCartShopping,
  FaMoneyBillWave,
  FaEnvelope,
  FaRocket,
  FaCoins,
  FaPercent,
} from "react-icons/fa6";
import { FaMedal, FaShieldAlt, FaTools } from "react-icons/fa";
import HeroSection from "../global/heroSection";
import StepsSection from "../global/stepsSection";
import WhyUsSection from "../global/whyUs";
import HeroSplitSection from "../global/heroSplitSection";
import FAQSection from "../global/faqSection";
import CTABanner from "../global/ctaBanner";

const PayeerCharge = () => {
  const payeerChargeSteps = [
    {
      id: "instantCharge",
      title: "شارژ آنی و سریع",
      description: "شارژ حساب پایر در کمتر از ۳۰ دقیقه در ساعات کاری.",
      icon: <FaClock />,
      isActive: true,
    },
    {
      id: "competitiveFees",
      title: "کارمزد شفاف و رقابتی",
      description: "پرداخت با کمترین هزینه و نرخ‌های کاملاً شفاف.",
      icon: <FaPercent />,
    },
    {
      id: "currencyOptions",
      title: "پشتیبانی از دلار، یورو و روبل",
      description: "امکان شارژ به ارزهای USD، EUR و RUB.",
      icon: <FaDollarSign />,
      isActive: true,
    },
    {
      id: "directTransfer",
      title: "انتقال مستقیم به کیف پول",
      description: "مبلغ به‌طور مستقیم به حساب پایر شما منتقل می‌شود.",
      icon: <FaCoins />,
    },
    {
      id: "security",
      title: "امنیت و محرمانگی کامل",
      description: "اطلاعات شما با بالاترین سطح امنیتی محافظت می‌شود.",
      icon: <FaLock />,
      isActive: true,
    },
    {
      id: "support247",
      title: "پشتیبانی ۲۴ ساعته",
      description: "تیم ارزی پلاس همیشه پاسخگوی شماست.",
      icon: <FaHeadset />,
    },
  ];

  const payeerUseCases = [
    {
      id: 1,
      icon: <FaCartShopping size={32} />,
      iconColor: "bg-blue-700",
      title: "خرید از فروشگاه‌های خارجی",
      description: "پرداخت آسان در سایت‌ها و فروشگاه‌های بین‌المللی.",
    },
    {
      id: 2,
      icon: <FaDollarSign size={32} />,
      iconColor: "bg-blue-700",
      title: "انتقال وجه به کاربران دیگر",
      description: "انتقال سریع و امن بین حساب‌های پایر.",
    },
    {
      id: 3,
      icon: <FaMoneyBillWave size={32} />,
      iconColor: "bg-blue-700",
      title: "پرداخت سرویس‌ها و نرم‌افزارها",
      description: "پرداخت هزینه اشتراک‌ها و سرویس‌های بین‌المللی.",
    },
    {
      id: 4,
      icon: <FaCoins size={32} />,
      iconColor: "bg-blue-700",
      title: "خرید و فروش ارز دیجیتال",
      description: "مدیریت و معامله رمزارزها به‌صورت مستقیم در پایر.",
    },
    {
      id: 5,
      icon: <FaLock size={32} />,
      iconColor: "bg-blue-700",
      title: "امنیت کامل",
      description: "تراکنش‌های پایر با امنیت و اطمینان کامل انجام می‌شود.",
    },
  ];



  const payeerFaqData = [
    {
      id: "1",
      question: "آیا امکان شارژ هر مبلغی وجود دارد؟",
      answer: "بله، هیچ محدودیتی در مبلغ شارژ وجود ندارد.",
      category: "شارژ حساب",
    },
    {
      id: "2",
      question: "آیا شارژ پایر فوری انجام می‌شود؟",
      answer: "بله، در ساعات کاری کمتر از ۳۰ دقیقه انجام خواهد شد.",
      category: "زمان تراکنش",
    },
    {
      id: "3",
      question: "آیا می‌توانم موجودی پایر را به ریال نقد کنم؟",
      answer: "بله، ارزی پلاس خدمات نقد کردن پایر را نیز ارائه می‌دهد.",
      category: "خدمات",
    },
  ];

  const faqIcons = {
    info: (
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        className="w-full h-full"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  return (
    <div>
      <HeroSection
        heading="شارژ سریع و امن حساب پایر در ایران با ارزی پلاس – آنی، مطمئن و بدون محدودیت"
        subheading="شارژ حساب پایر"
        description="پایر (Payeer) یکی از محبوب‌ترین سیستم‌های پرداخت بین‌المللی است که علاوه بر نگهداری ارزهای فیات، امکان خرید رمزارز، انتقال وجه و پرداخت سرویس‌ها را فراهم می‌کند. با ارزی پلاس حساب پایر خود را سریع و امن شارژ کنید."
        buttons={[
          {
            text: "ثبت سفارش شارژ پایر",
            href: "/payeer",
            variant: "primary",
            icon: <FaRocket />,
          },
        ]}
        media={{
          type: "image",
          src: "/assets/images/payeer.jpeg",
          alt: "شارژ پایر",
          width: 1200,
          height: 800,
        }}
        layout="default"
        theme={{
          headingColor: "text-gray-50",
          subheadingColor: "text-gray-700",
          descriptionColor: "text-gray-200",
          backgroundColor: "bg-blue-500",
        }}
      />

      <StepsSection
        heading="مزایای شارژ پایر با ارزی پلاس"
        description="با خدمات ارزی پلاس، حساب پایر خود را سریع، امن و با کارمزد رقابتی شارژ کنید:"
        steps={payeerChargeSteps}
        theme={stepThemes.dark}
        layout="vertical"
        boxShape="rounded"
        boxSize="sm"
        showNumbers={true}
        animated={true}
        showIcons={true}
      />

      <WhyUsSection
        heading="کاربردهای شارژ پایر"
        description="با شارژ حساب پایر می‌توانید از امکانات گسترده پرداخت و مدیریت دارایی بین‌المللی استفاده کنید:"
        buttonText="ثبت سفارش"
        buttonLink="/payeer"
        items={payeerUseCases}
        buttonColor="bg-blue-700 hover:bg-blue-800 text-white"
        theme={themesWhyus.dark}
      />

    

      <HeroSplitSection
        heading="چرا ارزی پلاس؟"
        subHeading="امنیت و تجربه حرفه‌ای در خدمات پایر"
        description="ارزی پلاس با سابقه چندین ساله، منابع ارزی معتبر و پشتیبانی حرفه‌ای، بهترین گزینه برای مدیریت حساب پایر شماست."
        buttons={[
          {
            text: "ثبت سفارش شارژ پایر",
            href: "/payeer",
            variant: "primary",
            icon: <FaShieldAlt />,
          },
        ]}
        imageSrc="/assets/images/payeer.jpeg"
        imageAlt="ارزی پلاس"
        theme={splitSectionThemes.dark}
        layout="image-left"
        imageWidth="1/2"
        features={[
          {
            id: 1,
            title: "تجربه حرفه‌ای",
            description:
              "ارزی پلاس با تجربه چندین ساله در ارائه خدمات پرداخت بین‌المللی، بهترین خدمات را ارائه می‌دهد.",
            icon: <FaMedal />,
          },
          {
            id: 2,
            title: "امنیت کامل اطلاعات",
            description:
              "تضمین امنیت تراکنش‌ها و حفظ محرمانگی اطلاعات کاربران.",
            icon: <FaLock />,
          },
          {
            id: 3,
            title: "خدمات جانبی کامل",
            description:
              "شامل نقد کردن موجودی پایر و پرداخت سرویس‌های بین‌المللی.",
            icon: <FaTools />,
          },
          {
            id: 4,
            title: "پشتیبانی ۲۴ ساعته",
            description: "تیم پشتیبانی ارزی پلاس همیشه آماده پاسخگویی است.",
            icon: <FaHeadset />,
          },
        ]}
      />

      <FAQSection
        heading="سؤالات متداول"
        description="پاسخ به پرسش‌های پرتکرار درباره شارژ پایر"
        svgIcon={faqIcons.info}
        faqItems={payeerFaqData}
        buttons={[
          {
            text: "ارسال سوال",
            href: "/support",
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
        heading="همین حالا حساب پایر خود را با ارزی پلاس شارژ کنید!"
        description="با ارزی پلاس، حساب شما در کوتاه‌ترین زمان و با امنیت کامل شارژ می‌شود."
        button={{
          text: "ثبت سفارش شارژ پایر",
          href: "/payeer",
          variant: "primary",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.gradient}
        height={50}
      />
    </div>
  );
};

export default PayeerCharge;
