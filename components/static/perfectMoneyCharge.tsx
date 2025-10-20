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
  FaShield,
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

const PerfectCharge = () => {
  const pmChargeSteps = [
    {
      id: "instantCharge",
      title: "شارژ آنی و سریع",
      description: "شارژ حساب پرفکت‌مانی در کمتر از ۳۰ دقیقه در ساعات کاری.",
      icon: <FaClock />,
      isActive: true,
    },
    {
      id: "competitiveFees",
      title: "کارمزد شفاف و نرخ رقابتی",
      description: "پرداخت با کمترین هزینه و نرخ‌های شفاف برای هر تراکنش.",
      icon: <FaPercent />,
    },
    {
      id: "directOrVoucher",
      title: "امکان شارژ مستقیم حساب یا صدور ووچر",
      description:
        "می‌توانید حساب خود را مستقیم شارژ کرده یا ووچر دریافت کنید.",
      icon: <FaDollarSign />,
      isActive: true,
    },
    {
      id: "noAccountNeeded",
      title: "خرید ووچر بدون نیاز به حساب پرفکت‌مانی",
      description: "امکان تهیه ووچر حتی بدون داشتن حساب پرفکت‌مانی.",
      icon: <FaCoins />,
    },
    {
      id: "security",
      title: "امنیت کامل تراکنش‌ها",
      description: "اطلاعات شما در بالاترین سطح امنیت حفظ می‌شود.",
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

  const pmItemsWhyus = [
    {
      id: 1,
      icon: <FaCartShopping size={32} />,
      iconColor: "bg-red-700",
      title: "خرید از فروشگاه‌های خارجی",
      description:
        "امکان خرید از فروشگاه‌ها و سایت‌های بین‌المللی با ووچر پرفکت‌مانی.",
    },
    {
      id: 2,
      icon: <FaDollarSign size={32} />,
      iconColor: "bg-red-700",
      title: "انتقال وجه بین کاربران",
      description: "انتقال وجه بین حساب‌های پرفکت‌مانی به‌صورت امن و سریع.",
    },
    {
      id: 3,
      icon: <FaMoneyBillWave size={32} />,
      iconColor: "bg-red-700",
      title: "پرداخت سرویس‌ها و اشتراک‌ها",
      description: "پرداخت هزینه سرویس‌ها و اشتراک‌های آنلاین با پرفکت‌مانی.",
    },
    {
      id: 4,
      icon: <FaCoins size={32} />,
      iconColor: "bg-red-700",
      title: "نقد کردن ووچر",
      description: "تبدیل ووچر پرفکت‌مانی به ریال یا سایر ارزها.",
    },
    {
      id: 5,
      icon: <FaShield size={32} />,
      iconColor: "bg-red-700",
      title: "سرمایه‌گذاری امن",
      description: "نگهداری دارایی و سرمایه‌گذاری با امنیت کامل.",
    },
  ];

  const pmFaqData = [
    {
      id: "1",
      question: "آیا امکان خرید ووچر بدون حساب پرفکت‌مانی وجود دارد؟",
      answer: "بله، ارزی پلاس این امکان را فراهم می‌کند.",
      category: "ووچر و حساب",
    },
    {
      id: "2",
      question: "آیا شارژ پرفکت‌مانی محدودیت مبلغ دارد؟",
      answer: "خیر، می‌توانید هر مبلغی را سفارش دهید.",
      category: "محدودیت تراکنش",
    },
    {
      id: "3",
      question: "آیا ووچر پرفکت‌مانی تاریخ انقضا دارد؟",
      answer: "خیر، ووچرهای پرفکت‌مانی بدون تاریخ انقضا هستند.",
      category: "ویژگی ووچر",
    },
  ];

  return (
    <div>
      <HeroSection
        heading="شارژ سریع پرفکت‌مانی و خرید ووچر پرفکت‌مانی در ایران با ارزی پلاس – امن، فوری و با بهترین نرخ"
        subheading="شارژ سریع پرفکت‌مانی و ووچر"
        description="پرفکت‌مانی (Perfect Money) یکی از معتبرترین و محبوب‌ترین سیستم‌های پرداخت بین‌المللی است که به کاربران امکان نگهداری، ارسال و دریافت ارزهای مختلف و حتی طلا را می‌دهد. از مهم‌ترین قابلیت‌های این سیستم، ووچر پرفکت‌مانی است که به‌عنوان یک کد دیجیتال، امکان پرداخت آنی و انتقال وجه را بدون نیاز به حساب بانکی بین‌المللی فراهم می‌کند.
با خدمات ارزی پلاس می‌توانید در کوتاه‌ترین زمان، حساب پرفکت‌مانی خود را شارژ کرده یا ووچر موردنظر خود را با بهترین نرخ و پشتیبانی ۲۴ ساعته تهیه کنید."
        buttons={[
          {
            text: "ثبت سفارش شارژ یا خرید ووچر",
            href: "/perfect-money",
            variant: "secondary",
            icon: <FaRocket />,
          },
        ]}
        media={{
          type: "image",
          src: "/assets/images/perfect.webp",
          alt: "شارژ پرفکت‌مانی",
          width: 1200,
          height: 800,
        }}
        layout="default"
        theme={{
          headingColor: "text-gray-50",
          subheadingColor: "text-gray-700",
          descriptionColor: "text-gray-200",
          backgroundColor: "bg-red-500",
        }}
      />

      <StepsSection
        heading="مزایای شارژ پرفکت‌مانی با ارزی پلاس"
        description="با استفاده از خدمات ارزی پلاس، حساب پرفکت‌مانی خود را سریع، امن و با کارمزد رقابتی شارژ کنید:"
        steps={pmChargeSteps}
        theme={stepThemes.red}
        layout="vertical"
        boxShape="rounded"
        boxSize="sm"
        showNumbers={true}
        animated={true}
        showIcons={true}
      />

      <WhyUsSection
        heading="کاربردهای شارژ پرفکت‌مانی و ووچر"
        description="با شارژ پرفکت‌مانی می‌توانید از امکانات گسترده پرداخت و انتقال بین‌المللی بهره‌مند شوید:"
        buttonText="ثبت سفارش"
        buttonLink="/perfect-money"
        items={pmItemsWhyus}
        buttonColor="bg-red-700 hover:bg-red-800 text-white"
        theme={themesWhyus.red}
      />

      <HeroSplitSection
        heading="چرا ارزی پلاس؟"
        subHeading="امنیت و اطمینان در شارژ و مدیریت حساب"
        description="ارزی پلاس با تجربه چندین ساله، منابع ارزی معتبر و پشتیبانی حرفه‌ای، بهترین گزینه برای مدیریت مالی بین‌المللی شماست."
        buttons={[
          {
            text: "ثبت سفارش شارژ یا خرید ووچر",
            href: "/perfect-money",
            variant: "red",
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
            title: "تجربه حرفه‌ای",
            description:
              "ارزی پلاس با تجربه چندین ساله در افتتاح حساب‌های ترید بین‌المللی، بهترین خدمات را به شما ارائه می‌دهد.",
            icon: <FaMedal />,
            style: {
              bg: "bg-blue-900/30",
              border: "border-blue-400",
              text: "text-blue-200",
              iconColor: "text-blue-400",
              shadow: "shadow-lg",
              rounded: "rounded-xl",
            },
          },
          {
            id: 2,
            title: "امنیت کامل اطلاعات",
            description:
              "حفظ کامل امنیت تراکنش‌ها و محرمانگی اطلاعات کاربران در تمامی مراحل افتتاح و استفاده از حساب.",
            icon: <FaLock />,
            style: {
              bg: "bg-indigo-900/20",
              border: "border-indigo-400",
              text: "text-indigo-200",
              iconColor: "text-indigo-400",
            },
          },
          {
            id: 3,
            title: "خدمات جانبی کامل",
            description:
              "ارائه خدمات متنوع شامل پرداخت هزینه عضویت، شارژ حساب و نقد سود معاملات به‌صورت سریع و امن.",
            icon: <FaTools />,
            style: {
              bg: "bg-amber-900/20",
              border: "border-amber-400",
              text: "text-amber-200",
              iconColor: "text-amber-400",
            },
          },
          {
            id: 4,
            title: "پشتیبانی ۲۴ ساعته",
            description:
              "تیم پشتیبانی ارزی پلاس به‌صورت دائمی در تمام مراحل افتتاح و استفاده از حساب همراه شماست.",
            icon: <FaHeadset />,
            style: {
              bg: "bg-cyan-900/20",
              border: "border-cyan-400",
              text: "text-cyan-200",
              iconColor: "text-cyan-400",
            },
          },
        ]}
      />

      <FAQSection
        heading="سؤالات متداول"
        description="پاسخ به پرسش‌های رایج درباره شارژ پرفکت‌مانی و ووچر"
        faqItems={pmFaqData}
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
        heading="همین حالا حساب پرفکت‌مانی خود را شارژ کنید یا ووچر خود را دریافت کنید!"
        description="با ارزی پلاس، حساب شما در کوتاه‌ترین زمان و با امنیت کامل شارژ می‌شود."
        button={{
          text: "ثبت سفارش شارژ یا خرید ووچر پرفکت‌مانی",
          href: "/perfect-money",
          variant: "outline",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.primary}
        height={50}
      />
    </div>
  );
};

export default PerfectCharge;
