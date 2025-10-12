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
      iconColor: "bg-blue-700",
      title: "خرید از فروشگاه‌های خارجی",
      description:
        "امکان خرید آنلاین از فروشگاه‌های بین‌المللی مثل Amazon، eBay و AliExpress با حساب پی‌پال شارژ شده.",
    },
    {
      id: 2,
      icon: <FaFileInvoiceDollar size={32} />,
      iconColor: "bg-blue-700",
      title: "پرداخت آزمون‌های بین‌المللی",
      description:
        "پرداخت هزینه آزمون‌های بین‌المللی مانند IELTS، TOEFL و GRE به‌سادگی و بدون محدودیت.",
    },
    {
      id: 3,
      icon: <FaDesktop size={32} />,
      iconColor: "bg-blue-700",
      title: "پرداخت نرم‌افزار و سرویس‌ها",
      description:
        "پرداخت اشتراک سرویس‌های آنلاین و نرم‌افزارها مانند Netflix، Adobe و ChatGPT با حساب پی‌پال شارژ شده.",
    },
    {
      id: 4,
      icon: <FaExchangeAlt size={32} />,
      iconColor: "bg-blue-700",
      title: "انتقال وجه به حساب‌های دیگر",
      description:
        "امکان انتقال سریع و امن وجه به سایر حساب‌های پی‌پال دیگر با کارمزد مناسب.",
    },
    {
      id: 5,
      icon: <FaHandshake size={32} />,
      iconColor: "bg-blue-700",
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
  const faqIcons = {
    question: (
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
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    help: (
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
          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z"
        />
      </svg>
    ),
    support: (
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
          d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3"
        />
      </svg>
    ),
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
    chat: (
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
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  };

  return (
    <div>
      {" "}
      <HeroSection
        heading="شارژ آنی و مطمئن حساب پی‌پال در ایران با ارزی پلاس – پرداخت سریع و امن"
        subheading="شارژ آنی و مطمئن حساب پی‌پال"
        description="پی‌پال (PayPal) یکی از معتبرترین سیستم‌های پرداخت آنلاین در جهان است که میلیون‌ها کاربر برای خرید اینترنتی، انتقال وجه و دریافت درآمد دلاری از آن استفاده می‌کنند. اما برای کاربران ایرانی، به دلیل محدودیت‌های بانکی، شارژ مستقیم حساب پی‌پال ممکن نیست.
با خدمات ارزی پلاس می‌توانید حساب پی‌پال خود را در کوتاه‌ترین زمان و با کمترین کارمزد شارژ کنید، بدون نگرانی از مسدود شدن یا بروز مشکل در حساب."
        buttons={[
          {
            text: "شارژ آنی و مطمئن حساب پی‌پال",
            href: "/register",
            variant: "secondary",
            icon: <FaExplosion />,
          },
        ]}
        media={{
          type: "image",
          src: "https://arziplus.s3.eu-north-1.amazonaws.com/Desktop/19-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQ5L2LD2VE%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T104428Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRjBEAiA0MLxgSIIoUN3W8JF95JsP29QAjfVzg%2Ft9wMbJp4qivgIgeCD51u6yTwDJkRostmxTP1kiI1Gwki%2FW1eDp3FqW43wq1gIILBAAGgwzMTEzNzYxMjAyMjUiDCVZ%2B7HCi0Xt8Y8nwyqzAtqH0AsJUAb5b%2Fzw5MwWdapiBX6kl1grhJh24QAeZEePaUQ8fnkqYARUpRonlmcGZaSD3TKxb0Ji1uTGWZR7p%2FkiDXeoQBXBGQU2oiGraIz46M6IlYd9F2FpcCDYl5paP4uDzYlFO3dcPq16Jmo9jxJdztzGb6z749K0IFKzX5VznV7YQ%2F1xl0TqduIssznSTqD7FY2beBW9x4epk3MTO5In9vgH9FRuMQGPq5U2ygMtH6eItCLyWchtxNKNhltfWiC6cZBJOZ6X%2FwBd6wGdEgT8ZusR4xg%2FYqM94FuQIka4FlJ3QLu5oS8CSxQ0VlcgYwRlLXk4ExsKcj4zeVwq2gFHpms7ppuI2dCPhA8QL0ljt7BBuPuZVDktcXyuszNM1KB2P4FFNWTRN2deE0PRec3TzywwkvKtxwY6rgJkr2xPFv0s8b7U2lDkbKcOmotJOn9%2BdD3J%2Bkxo7q2cs%2BBpLKGOyhd6ZyqJFIUeQyZEdV5xRZy2k4pSY1%2BJvY519DxuFLe3WXgh%2FYw8yVF%2F80cVSbVFLMoy7RJjWQTMKUdblgFhXBgSkR0mbD0ALTNQLlWwG2mdK%2F8VifIL2Wi5KUpwJw7uUayy7mugxhKGi546F9zS6P2hY0XEu3KMgmCrhHJAOmcK6xYkaoXxuWHU0QAvVQLpP2MO8ZlnolbnsP9%2F67yQbZZHYSXFqT6X%2FKVb0Dp9k7uOHNCeNGy8Vhk0qFHnsDPxbck4rGOvp1V%2B72Wo6JNbWpybz9NKd2qyJYGF4khp0Qa1XddPmTxMMQdR%2FQNNVb0pKxrXLQV5WSKVLwmzF25WXQzzLah9zjz3Eg%3D%3D&X-Amz-Signature=7267b8637c78a5fc79030043bcee00eeed16199207caead21fd9a753c1290b23&X-Amz-SignedHeaders=host&response-content-disposition=inline",
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
        buttonLink="/paypal-topup"
        items={paypalItemsWhyus}
        buttonColor="bg-blue-700 hover:bg-blue-800 text-white"
        theme={themesWhyus.default}
      />
   
      <HeroSplitSection
        heading="چرا ارزی پلاس؟"
        subHeading="امنیت و اطمینان در شارژ و مدیریت حساب پی‌پال"
        description="ارزی پلاس با تجربه چندین ساله در خدمات پی‌پال، استفاده از منابع ارزی قانونی و امن، و ارائه مشاوره برای جلوگیری از مسدود شدن حساب، بهترین گزینه برای مدیریت مالی بین‌المللی شماست."
        buttons={[
          {
            text: "شارژ حساب پی‌پال با ارزی پلاس",
            href: "/paypal-topup",
            variant: "primary",
            icon: <FaShieldAlt />,
          },
        ]}
        imageSrc="/assets/images/paypal2.webp"
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
        svgIcon={faqIcons.info}
        faqItems={paypalFaqData}
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
        heading="همین حالا حساب پی‌پال خود را با ارزی پلاس شارژ کنید و بدون محدودیت خرید و پرداخت بین‌المللی انجام دهید!"
        description="با ارزی پلاس، حساب پی‌پال شما به‌سرعت شارژ می‌شود تا بتوانید به‌راحتی از خدمات بین‌المللی خرید و پرداخت بهره‌مند شوید."
        button={{
          text: "ثبت سفارش شارژ پی‌پال",
          href: "/paypal-topup",
          variant: "primary",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.primary} // رنگ سبز مناسب برای خدمات مالی
        height={50}
      />
    </div>
  );
};

export default PaypalCharge;
