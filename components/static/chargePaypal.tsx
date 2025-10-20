import HeroSection from "../global/heroSection";
import { FaExplosion } from "react-icons/fa6";
import StepsSection from "../global/stepsSection";
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
  FaShieldAlt,
  FaShoppingCart,
  FaEnvelope,
  FaRocket,
  FaCoins,
  FaPercentage,
  FaExchangeAlt,
  FaCreditCard,
  FaBolt,
  FaHandshake,
  FaDesktop,
  FaFileInvoiceDollar,
  FaGlobeAmericas,
} from "react-icons/fa";
import WhyUsSection from "../global/whyUs";
import HeroSplitSection from "../global/heroSplitSection";
import FAQSection from "../global/faqSection";
import CTABanner from "../global/ctaBanner";

const PaypalCharge = () => {
  const paypalChargeSteps = [
    {
      id: "instantCharge",
      title: "شارژ آنی و سریع",
      description: "شارژ حساب پی‌پال در کمتر از 5 ساعت در ساعات کاری.",
      icon: <FaBolt />,
      isActive: true,
    },
    {
      id: "competitiveFees",
      title: "کارمزد رقابتی",
      description: "پرداخت با کمترین هزینه و نرخ‌های شفاف برای هر تراکنش.",
      icon: <FaPercentage />,
    },
    {
      id: "multiCurrencySupport",
      title: "پشتیبانی از تمام ارزها",
      description:
        "امکان شارژ حساب پی‌پال به تمامی ارزهای پشتیبانی‌شده توسط پی‌پال.",
      icon: <FaCoins />,
      isActive: true,
    },
    {
      id: "trustedSources",
      title: "شارژ از منابع معتبر",
      description:
        "تمام تراکنش‌ها از طریق منابع بین‌المللی معتبر انجام می‌شوند.",
      icon: <FaShieldAlt />,
    },
    {
      id: "support247",
      title: "پشتیبانی ۲۴ ساعته",
      description:
        "تیم ارزی پلاس در تمام مراحل پیگیری سفارش‌ها و حل مشکلات همراه شماست.",
      icon: <FaHeadset />,
      isActive: true,
    },
    {
      id: "noCardRequired",
      title: "بدون نیاز به کارت بانکی بین‌المللی",
      description: "می‌توانید بدون داشتن کارت خارجی، حساب خود را شارژ کنید.",
      icon: <FaCreditCard />,
    },
  ];
  const paypalItemsWhyus = [
    {
      id: 1,
      icon: <FaShoppingCart size={32} />,
      title: "خرید از فروشگاه‌های خارجی",
      description:
        "امکان خرید آنلاین از فروشگاه‌های بین‌المللی مثل Amazon، eBay و AliExpress با حساب پی‌پال شارژ شده.",
    },
    {
      id: 2,
      icon: <FaFileInvoiceDollar size={32} />,
      title: "پرداخت آزمون‌های بین‌المللی",
      description:
        "پرداخت هزینه آزمون‌های بین‌المللی مانند IELTS، TOEFL و GRE به‌سادگی و بدون محدودیت.",
    },
    {
      id: 3,
      icon: <FaDesktop size={32} />,
      title: "پرداخت نرم‌افزار و سرویس‌ها",
      description:
        "پرداخت اشتراک سرویس‌های آنلاین و نرم‌افزارها مانند Netflix، Adobe و ChatGPT با حساب پی‌پال شارژ شده.",
    },
    {
      id: 4,
      icon: <FaExchangeAlt size={32} />,
      title: "انتقال وجه به حساب‌های دیگر",
      description:
        "امکان انتقال سریع و امن وجه به سایر حساب‌های پی‌پال دیگر با کارمزد مناسب.",
    },
    {
      id: 5,
      icon: <FaHandshake size={32} />,
      title: "تسویه‌حساب با مشتریان و فریلنسرها",
      description:
        "استفاده از پی‌پال برای تسویه حساب با مشتریان یا همکاران فریلنسر به‌صورت آسان و امن.",
    },
  ];
  const paypalFaqData = [
    {
      id: "1",
      question: "آیا شارژ پی‌پال برای حساب‌های محدودشده انجام می‌شود؟",
      answer:
        "خیر؛ ابتدا باید مشکل محدودیت حساب برطرف شود تا امکان شارژ پی‌پال فراهم گردد.",
      category: "محدودیت حساب",
    },
    {
      id: "2",
      question: "آیا می‌توانم مبلغ دلخواه شارژ کنم؟",
      answer:
        "بله؛ کاربران می‌توانند هر مبلغی را که مدنظر دارند، برای شارژ حساب پی‌پال انتخاب کنند.",
      category: "محدودیت مبلغ",
    },
    {
      id: "3",
      question: "آیا امکان شارژ فوری وجود دارد؟",
      answer:
        "بله؛ در ساعات کاری، شارژ حساب پی‌پال کمتر از 5 ساعت انجام می‌شود.",
      category: "سرعت و زمان",
    },
  ];

  return (
    <div>
      {" "}
      <HeroSection
        heading="شارژ آنی و مطمئن حساب پی‌پال در ایران با ارزی پلاس   پرداخت سریع و امن"
        subheading="شارژ آنی و مطمئن حساب پی‌پال"
        description="پی‌پال (PayPal) یکی از معتبرترین سیستم‌های پرداخت آنلاین در جهان است که میلیون‌ها کاربر برای خرید اینترنتی، انتقال وجه و دریافت درآمد دلاری از آن استفاده می‌کنند. اما برای کاربران ایرانی، به دلیل محدودیت‌های بانکی، شارژ مستقیم حساب پی‌پال ممکن نیست.
با خدمات ارزی پلاس می‌توانید حساب پی‌پال خود را در کوتاه‌ترین زمان و با کمترین کارمزد شارژ کنید، بدون نگرانی از مسدود شدن یا بروز مشکل در حساب."
        buttons={[
          {
            text: "شارژ آنی و مطمئن حساب پی‌پال",
            href: "/services/charge-paypal-account",
            variant: "secondary",
            icon: <FaExplosion />,
          },
        ]}
        media={{
          type: "image",
          src: "https://arziplus.storage.c2.liara.space/images/pages/19-min.png",
          alt: "شارژ آنی و مطمئن حساب پی‌پال",
          width: 1200,
          height: 1200,
        }}
        layout="default"
        theme={{
          headingColor: "text-gray-50",
          subheadingColor: "text-gray-700",
          descriptionColor: "text-gray-200",
          backgroundColor: "bg-blue-700",
          bgSubHeadingColor: "bg-fuchsia-50",
        }}
      />
      <StepsSection
        heading="مزایای شارژ پی‌پال با ارزی پلاس"
        description="با استفاده از خدمات ارزی پلاس، می‌توانید حساب پی‌پال خود را سریع، امن و با کارمزد رقابتی شارژ کنید. برخی از مزایای کلیدی عبارت‌اند از:"
        steps={paypalChargeSteps}
        theme={stepThemes.default}
        layout="vertical"
        boxShape="rounded"
        boxSize="sm"
        showNumbers={true}
        animated={true}
        interactive={false}
        showIcons={true}
      />
      <WhyUsSection
        heading="کاربردهای شارژ پی‌پال"
        description="با شارژ حساب پی‌پال از طریق ارزی پلاس، می‌توانید از امکانات گسترده پرداخت و انتقال بین‌المللی بهره‌مند شوید:"
        buttonText="شارژ حساب پی‌پال"
        buttonLink="/services/charge-paypal-account"
        items={paypalItemsWhyus}
        theme={themesWhyus.default}
      />
      <HeroSplitSection
        heading="چرا ارزی پلاس؟"
        subHeading="امنیت و اطمینان در شارژ و مدیریت حساب پی‌پال"
        description="ارزی پلاس با تجربه چندین ساله در خدمات پی‌پال، استفاده از منابع ارزی قانونی و امن، و ارائه مشاوره برای جلوگیری از مسدود شدن حساب، بهترین گزینه برای مدیریت مالی بین‌المللی شماست."
        buttons={[
          {
            text: "شارژ حساب پی‌پال با ارزی پلاس",
            href: "/services/charge-paypal-account",
            variant: "primary",
            icon: <FaShieldAlt />,
          },
        ]}
        imageSrc="https://arziplus.storage.c2.liara.space/images/pages/every.png"
        imageAlt="شارژ و مدیریت حساب پی‌پال با ارزی پلاس"
        theme={splitSectionThemes.dark}
        layout="image-left"
        imageWidth="1/2"
        features={[
          {
            id: 1,
            title: "استفاده از منابع مطمئن",
            description:
              "تمامی عملیات شارژ و مدیریت حساب از طریق منابع ارزی قانونی و معتبر انجام می‌شود.",
            icon: <FaGlobeAmericas />,
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
            title: "تجربه حرفه‌ای",
            description:
              "چندین سال تجربه در خدمات پی‌پال و مدیریت حساب‌های بین‌المللی با موفقیت بالا.",
            icon: <FaClock />,
            style: {
              bg: "bg-indigo-900/20",
              border: "border-indigo-400",
              text: "text-indigo-200",
              iconColor: "text-indigo-400",
            },
          },
          {
            id: 3,
            title: "امنیت کامل تراکنش‌ها",
            description:
              "اطمینان از امنیت تراکنش‌ها و محرمانگی کامل اطلاعات کاربران در تمام مراحل.",
            icon: <FaLock />,
            style: {
              bg: "bg-emerald-900/20",
              border: "border-emerald-400",
              text: "text-emerald-200",
              iconColor: "text-emerald-400",
            },
          },
          {
            id: 4,
            title: "مشاوره و پشتیبانی حرفه‌ای",
            description:
              "ارائه مشاوره برای استفاده امن و جلوگیری از مسدود شدن حساب و پشتیبانی سریع در تمام مراحل.",
            icon: <FaHeadset />,
            style: {
              bg: "bg-teal-900/20",
              border: "border-teal-400",
              text: "text-teal-200",
              iconColor: "text-teal-400",
            },
          },
        ]}
      />
      <FAQSection
        heading="سؤالات متداول"
        description="پاسخ به پرسش‌های رایج درباره خدمات شارژ پی‌پال و مدیریت حساب‌های بین‌المللی با ارزی پلاس"
        faqItems={paypalFaqData}
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
        heading="    حساب پی‌پال خود را با ارزی پلاس شارژ کنید    !"
        description="حساب پی‌پال شما به‌سرعت شارژ می‌شود تا بتوانید از خدمات بین‌المللی بهره‌مند شوید."
        button={{
          text: "ثبت سفارش شارژ پی‌پال",
          href: "/dashboard#services",
          variant: "ghost",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.primary} // رنگ سبز مناسب برای خدمات مالی
        height={50}
      />
    </div>
  );
};

export default PaypalCharge;
