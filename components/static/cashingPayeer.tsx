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

const CashingPayeer = () => {
  const cashingSteps = [
    {
      id: "fastPayment",
      title: "تسویه سریع ",
      description:
        "با ارزی پلاس، موجودی پایر شما در کوتاه‌ترین زمان به ریال یا ارز دلخواه منتقل می‌شود.",
      icon: <FaClock />,
      isActive: true,
    },
    {
      id: "competitiveFees",
      title: "کارمزد منصفانه و نرخ تبدیل شفاف",
      description:
        "نرخ تبدیل و کارمزد کاملاً شفاف برای همه کاربران ارائه می‌شود.",
      icon: <FaPercent />,
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
      iconColor: "bg-green-900",
      title: "دریافت درآمد از سایت‌های خارجی و پلتفرم‌های فریلنسری",
      description: "برداشت درآمد از پلتفرم‌های مختلف بین‌المللی با امنیت کامل.",
    },
    {
      id: 2,
      icon: <FaCoins size={32} />,
      iconColor: "bg-green-900",
      title: "تسویه حساب با مشتریان بین‌المللی",
      description:
        "پرداخت‌ها و درآمدهای بین‌المللی به ریال یا ارز دیگر تبدیل می‌شوند.",
    },
    {
      id: 3,
      icon: <FaRocket size={32} />,
      iconColor: "bg-green-900",
      title: "تبدیل ارزهای دیجیتال به ریال",
      description:
        "ارزی پلاس می‌تواند ارز دیجیتال شما را از طریق پایر به ریال نقد کند.",
    },
    {
      id: 4,
      icon: <FaMedal size={32} />,
      iconColor: "bg-green-900",
      title: "فروش موجودی پایر به نرخ روز",
      description:
        "بدون واسطه و با بهترین نرخ بازار موجودی پایر خود را نقد کنید.",
    },
  ];

  const cashingFaq = [
    {
      id: "1",
      question: "آیا امکان نقد کردن ارز دیجیتال در پایر وجود دارد؟",
      answer:
        "بله، ارزی پلاس می‌تواند ارز دیجیتال شما را از طریق پایر نقد کند.",
      category: "نقد کردن پایر",
    },
    {
      id: "2",
      question: "آیا مبلغی برای نقد کردن محدودیت دارد؟",
      answer: "خیر، هر مبلغی قابل نقد کردن است.",
      category: "نقد کردن پایر",
    },
    {
      id: "3",
      question: "آیا نقد کردن پایر شامل ووچر هم می‌شود؟",
      answer: "بله، ووچر پایر نیز نقد می‌شود.",
      category: "نقد کردن پایر",
    },
  ];

   
  return (
    <div>
      <HeroSection
        heading="تبدیل سریع و امن موجودی پایر به ریال در ایران با ارزی پلاس"
        subheading="نقد کردن موجودی پایر"
        description="پایر (Payeer) یک سیستم پرداخت الکترونیکی چندارزی و معتبر است که از دلار، یورو، روبل و ارزهای دیجیتال پشتیبانی می‌کند. بسیاری از فریلنسرها، تریدرها و صاحبان کسب‌وکارهای بین‌المللی از پایر برای دریافت درآمد خود استفاده می‌کنند.
با خدمات ارزی پلاس، می‌توانید موجودی پایر خود را به‌سادگی و با بهترین نرخ روز بازار به ریال یا ارز دلخواه تبدیل کنید و در کوتاه‌ترین زمان وجه خود را دریافت کنید."
        buttons={[
          {
            text: "ثبت درخواست نقد کردن پایر",
            href: "/cashing-payeer",
            variant: "primary",
            icon: <FaRocket />,
          },
        ]}
        media={{
          type: "image",
          src: "/assets/images/Payeer sharj.png",
          alt: "نقد کردن موجودی پایر",
          width: 1200,
          height: 800,
        }}
        layout="default"
        theme={{
          headingColor: "text-gray-50",
          subheadingColor: "text-gray-700",
          descriptionColor: "text-gray-200",
          backgroundColor: "bg-green-600",
        }}
      />

      <StepsSection
        heading="مزایای نقد کردن پایر با ارزی پلاس"
        description="با ارزی پلاس، تسویه سریع، کارمزد شفاف و امنیت کامل را تجربه کنید:"
        steps={cashingSteps}
        theme={stepThemes.green}
        layout="vertical"
        boxShape="rounded"
        boxSize="sm"
        showNumbers={true}
        animated={true}
        showIcons={true}
      />

      <WhyUsSection
        heading="کاربردهای نقد کردن پایر"
        description="دریافت درآمد فریلنسری، تسویه حساب با مشتریان بین‌المللی، تبدیل ارز دیجیتال به ریال و فروش موجودی:"
        buttonText="ثبت درخواست نقد کردن"
        buttonLink="/cashing-payeer"
        items={cashingUseCases}
        buttonColor="bg-green-800 hover:bg-green-900 text-white"
        theme={themesWhyus.dark}
      />

      <HeroSplitSection
        heading="چرا ارزی پلاس؟"
        subHeading="تجربه، امنیت و پشتیبانی حرفه‌ای"
        description="ارزی پلاس با سابقه چندین ساله در نقد کردن پایر، امنیت کامل تراکنش‌ها و نرخ رقابتی، بهترین گزینه برای شماست."
        buttons={[
          {
            text: "ثبت درخواست نقد کردن",
            href: "/cashing-payeer",
            variant: "green",
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
              "ارزی پلاس با تجربه چندین ساله بهترین خدمات نقد کردن پایر را ارائه می‌دهد.",
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
            title: "پشتیبانی ۲۴ ساعته",
            description:
              "تیم پشتیبانی ارزی پلاس در تمام مراحل نقد کردن موجودی پایر همراه شماست.",
            icon: <FaHeadset />,
          },
        ]}
      />

      <FAQSection
        heading="سؤالات متداول"
        description="پرسش‌های پرتکرار درباره نقد کردن موجودی پایر"
         faqItems={cashingFaq}
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
        heading="همین حالا موجودی پایر خود را با ارزی پلاس نقد کنید!"
        description="با ارزی پلاس، درآمدتان سریع و مطمئن دریافت می‌شود."
        button={{
          text: "ثبت درخواست نقد کردن پایر",
          href: "/cashing-payeer",
          variant: "ghost",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.primary}
        height={50}
      />
    </div>
  );
};

export default CashingPayeer;
