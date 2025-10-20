import { FaExplosion } from "react-icons/fa6";
import {
  ctaThemes,
  faqThemes,
  splitSectionThemes,
  stepThemes,
  themesWhyus,
} from "@/lib/theme";
import {
  FaClock,
  FaGlobe,
  FaHeadset,
  FaLock,
  FaShieldAlt,
  FaDollarSign,
  FaShoppingCart,
  FaEnvelope,
  FaRocket,
  FaCoins,
  FaPercentage,
  FaTools,
  FaExchangeAlt,
  FaBitcoin,
} from "react-icons/fa";
import HeroSection from "../global/heroSection";
import StepsSection from "../global/stepsSection";
import WhyUsSection from "../global/whyUs";
import HeroSplitSection from "../global/heroSplitSection";
import FAQSection from "../global/faqSection";
import CTABanner from "../global/ctaBanner";

const PayeerOpening = () => {
  const payeerSteps = [
    {
      id: "fastRegistration",
      title: "افتتاح سریع حساب",
      description:
        "افتتاح حساب پایر در کمتر از ۲۴ ساعت کاری بدون پیچیدگی‌های اداری.",
      icon: <FaClock />,
      isActive: true,
    },
    {
      id: "fullVerification",
      title: "وریفای کامل",
      description:
        "افزایش سقف تراکنش‌ها و امنیت بیشتر با وریفای کامل حساب پایر.",
      icon: <FaShieldAlt />,
    },
    {
      id: "multiCurrency",
      title: "پشتیبانی از ارزها و رمزارزها",
      description:
        "امکان نگهداری و استفاده از دلار، یورو، روبل و رمزارزها در حساب پایر.",
      icon: <FaCoins />,
      isActive: true,
    },
    {
      id: "globalTransfer",
      title: "انتقال سریع وجه جهانی",
      description:
        "انتقال وجه به کاربران و حساب‌ها در سراسر جهان با سرعت بالا و کارمزد پایین.",
      icon: <FaGlobe />,
    },
    {
      id: "lowFees",
      title: "کارمزد پایین",
      description:
        "تراکنش‌ها و تبدیل ارزها با کمترین هزینه و نرخ رقابتی انجام می‌شود.",
      icon: <FaPercentage />,
      isActive: true,
    },
    {
      id: "support247",
      title: "پشتیبانی ۲۴ ساعته",
      description:
        "تیم پشتیبانی ارزی پلاس همیشه آماده پاسخ‌گویی و ارائه مشاوره اختصاصی است.",
      icon: <FaHeadset />,
    },
  ];

  const payeerItemsWhyus = [
    {
      id: 1,
      icon: <FaBitcoin size={32} />,
      iconColor: "bg-blue-500",
      title: "خرید و فروش رمزارزها",
      description:
        "امکان خرید و فروش مستقیم رمزارزها داخل پلتفرم پایر با امنیت بالا.",
    },
    {
      id: 2,
      icon: <FaExchangeAlt size={32} />,
      iconColor: "bg-blue-500",
      title: "انتقال سریع وجه بین کاربران پایر",
      description:
        "انتقال وجه بین کاربران پایر با سرعت بالا و بدون محدودیت جغرافیایی.",
    },
    {
      id: 3,
      icon: <FaShoppingCart size={32} />,
      iconColor: "bg-blue-500",
      title: "خرید آنلاین از فروشگاه‌های بین‌المللی",
      description:
        "پرداخت امن در فروشگاه‌ها و سرویس‌های بین‌المللی با حساب پایر.",
    },
    {
      id: 4,
      icon: <FaDollarSign size={32} />,
      iconColor: "bg-blue-500",
      title: "تبدیل سریع ارزها و رمزارزها",
      description:
        "امکان تبدیل سریع بین ارزهای دیجیتال و فیات با کمترین کارمزد.",
    },
    {
      id: 5,
      icon: <FaCoins size={32} />,
      iconColor: "bg-blue-500",
      title: "نگهداری امن سرمایه",
      description:
        "مدیریت و نگهداری امن دارایی‌های شما در چندین واحد ارزی بدون محدودیت.",
    },
  ];

  const payeerFaqData = [
    {
      id: "1",
      question: "آیا پایر برای ایرانی‌ها محدودیت دارد؟",
      answer:
        "خیر؛ پایر به کاربران ایرانی خدمات ارائه می‌دهد و با راهکارهای ارزی پلاس، استفاده شما روان و ایمن خواهد بود.",
      category: "محدودیت کاربران",
    },
    {
      id: "2",
      question: "آیا می‌توان رمزارزهای موجود در پایر را نقد کرد؟",
      answer:
        "بله؛ ارزی پلاس امکان نقد کردن رمزارزها و موجودی پایر را به‌صورت مطمئن فراهم می‌کند.",
      category: "تبدیل ارز",
    },
    {
      id: "3",
      question: "آیا افتتاح حساب پایر نیاز به وریفای دارد؟",
      answer:
        "برای سقف تراکنش بالا و دسترسی کامل، بله. فرآیند وریفای توسط تیم ارزی پلاس انجام می‌شود.",
      category: "وریفای حساب",
    },
  ];
 

  return (
    <div>
      {" "}
      <HeroSection
        heading="افتتاح حساب پایر در ایران با ارزی پلاس – سریع، امن و بدون محدودیت"
        subheading="افتتاح حساب پایر"
        description="پایر (Payeer) یک سیستم پرداخت الکترونیکی چندمنظوره است که علاوه بر پشتیبانی از ارزهای فیات و رمزارزها، امکان انتقال وجه، خرید و فروش ارز دیجیتال و تبدیل بین ارزها را با کارمزد پایین و تسویه سریع فراهم می‌کند. به‌دلیل انعطاف بالا و محدودیت‌های کمتر، پایر برای کاربران ایرانی یک گزینه ایده‌آل محسوب می‌شود.
با خدمات ارزی پلاس می‌توانید در کوتاه‌ترین زمان، حساب پایر وریفای‌شده و آماده استفاده دریافت کنید و به تمام قابلیت‌های آن دسترسی داشته باشید."
        buttons={[
          {
            text: "افتتاح حساب پایر",
            href: "/register",
            variant: "secondary",
            icon: <FaExplosion />,
          },
        ]}
        media={{
          type: "image",
          src: "/assets/images/Payeer sakht.png",
          alt: "افتتاح حساب وب‌مانی",
          width: 1200,
          height: 1200,
        }}
        layout="default"
        theme={{
          headingColor: "text-gray-50",
          subheadingColor: "text-gray-700",
          descriptionColor: "text-slate-50",
          backgroundColor: "bg-blue-500",
          bgSubHeadingColor: "bg-gray-50",
        }}
      />
      <StepsSection
        heading="مزایای افتتاح حساب پایر با ارزی پلاس"
        description="با افتتاح حساب پایر از طریق ارزی پلاس، می‌توانید به‌سرعت و با کمترین هزینه به امکانات مالی بین‌المللی دسترسی پیدا کنید. برخی از مزایای کلیدی افتتاح حساب پایر عبارت‌اند از:"
        steps={payeerSteps}
        theme={stepThemes.neon}
        layout="vertical"
        boxShape="rounded"
        boxSize="sm"
        showNumbers={true}
        animated={true}
        interactive={false}
        showIcons={true}
      />
      <WhyUsSection
        heading="کاربردهای حساب پایر"
        description="با افتتاح حساب پایر از طریق ارزی پلاس، می‌توانید به امکانات گسترده‌ای دسترسی داشته باشید:"
        buttonText="افتتاح حساب پایر"
        buttonLink="/payeer-account"
        items={payeerItemsWhyus}
        buttonColor="bg-blue-500 hover:bg-blue-700 text-white"
        theme={themesWhyus.minimal}
      />
      <HeroSplitSection
        heading="چرا ارزی پلاس؟"
        subHeading="امنیت و اطمینان در افتتاح حساب پایر"
        description="ارزی پلاس با تجربه چندین ساله در افتتاح و وریفای حساب‌های بین‌المللی، امنیت بالا و خدمات جامع، بهترین گزینه برای مدیریت مالی بین‌المللی شما است."
        buttons={[
          {
            text: "افتتاح حساب پایر با ارزی پلاس",
            href: "/payeer-register",
            variant: "primary",
            icon: <FaShieldAlt />,
          },
        ]}
        imageSrc="/assets/images/payeer.jpeg"
        imageAlt="افتتاح حساب بین‌المللی پایر در ایران با ارزی پلاس"
        theme={splitSectionThemes.dark}
        layout="image-left"
        imageWidth="1/2"
        features={[
          {
            id: 1,
            title: "تجربه تخصصی",
            description:
              "افتتاح و وریفای حساب‌های بین‌المللی پایر با تجربه چندین ساله و تیم متخصص.",
            icon: <FaClock />,
            style: {
              bg: "bg-yellow-900/30",
              border: "border-yellow-400",
              text: "text-yellow-200",
              iconColor: "text-yellow-400",
              shadow: "shadow-lg",
              rounded: "rounded-xl",
            },
          },
          {
            id: 2,
            title: "امنیت و محرمانگی",
            description:
              "اطمینان از امنیت داده‌ها و حفاظت کامل اطلاعات کاربران در استفاده از پایر.",
            icon: <FaLock />,
            style: {
              bg: "bg-rose-900/20",
              border: "border-rose-400",
              text: "text-rose-200",
              iconColor: "text-rose-400",
            },
          },
          {
            id: 3,
            title: "خدمات جانبی کامل",
            description:
              "شارژ حساب، نقد موجودی، خرید و فروش ووچر و خدمات ارزی کامل برای کاربران پایر.",
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
            title: "پشتیبانی سریع و دائمی",
            description:
              "تیم پشتیبانی ارزی پلاس در تمام مراحل همراه شماست تا تراکنش‌ها به‌راحتی انجام شود.",
            icon: <FaGlobe />,
            style: {
              bg: "bg-emerald-900/20",
              border: "border-emerald-400",
              text: "text-emerald-200",
              iconColor: "text-emerald-400",
            },
          },
        ]}
      />
      <FAQSection
        heading="سوالات متداول"
        description="پاسخ سوالات رایج درباره خدمات ارزی پلاس و افتتاح حساب پایر را در اینجا بیابید"
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
        heading="همین حالا حساب پایر خود را با ارزی پلاس افتتاح کنید و از خدمات پرداخت بین‌المللی بدون محدودیت بهره‌مند شوید!"
        description="با ارزی پلاس، حساب پایر خود را به‌سرعت و با امنیت کامل فعال کنید و از تراکنش‌های بین‌المللی بدون محدودیت لذت ببرید."
        button={{
          text: "ثبت درخواست افتتاح حساب پایر",
          href: "/payeer-register",
          variant: "primary",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.primary} // رنگ سبز یا مناسب برای پایر
        height={50}
      />
    </div>
  );
};

export default PayeerOpening;
