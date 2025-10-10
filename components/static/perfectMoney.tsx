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
  FaBook,
  FaMoneyBillWave,
  FaRegClipboard,
  FaUserAlt,
  FaEnvelope,
  FaRocket,
  FaCoins,
  FaPercentage,
  FaTools,
  FaBitcoin,
  FaExchangeAlt,
} from "react-icons/fa";
import HeroSection from "../global/heroSection";
import StepsSection from "../global/stepsSection";
import WhyUsSection from "../global/whyUs";
import HeroSplitSection from "../global/heroSplitSection";
import FAQSection from "../global/faqSection";
import CTABanner from "../global/ctaBanner";

const PerfectMoney = () => {
  const perfectMoneySteps = [
    {
      id: "fastRegistration",
      title: "افتتاح فوری",
      description:
        "افتتاح حساب پرفکت‌مانی در کمتر از ۲۴ ساعت کاری بدون پیچیدگی‌های اداری.",
      icon: <FaClock />,
      isActive: true,
    },
    {
      id: "fullVerification",
      title: "وریفای کامل",
      description:
        "افزایش سقف تراکنش‌ها و امنیت بیشتر با انجام وریفای کامل حساب شما.",
      icon: <FaShieldAlt />,
    },
    {
      id: "multiCurrency",
      title: "پشتیبانی از ارزهای مختلف",
      description:
        "امکان نگهداری و استفاده از دلار، یورو، طلا و رمزارز در حساب پرفکت‌مانی.",
      icon: <FaCoins />,
      isActive: true,
    },
    {
      id: "iranAccess",
      title: "دسترسی از ایران",
      description:
        "بدون محدودیت جغرافیایی؛ امکان دسترسی مستقیم کاربران ایرانی به خدمات پرفکت‌مانی.",
      icon: <FaGlobe />,
    },
    {
      id: "lowFees",
      title: "کارمزد پایین",
      description:
        "انتقال وجه و خرید ووچر پرفکت‌مانی با کمترین هزینه و نرخ رقابتی.",
      icon: <FaPercentage />,
      isActive: true,
    },
    {
      id: "support247",
      title: "پشتیبانی ۲۴ ساعته",
      description:
        "تیم پشتیبانی ارزی پلاس همیشه آماده پاسخ‌گویی و رفع مشکلات احتمالی شماست.",
      icon: <FaHeadset />,
    },
  ];

  const perfectMoneyItemsWhyus = [
    {
      id: 1,
      icon: <FaShoppingCart size={32} />,
      iconColor: "bg-red-500",
      title: "خرید و فروش ووچر پرفکت‌مانی",
      description:
        "به راحتی ووچر پرفکت‌مانی بخرید یا بفروشید و تراکنش‌های خود را سریع و امن انجام دهید.",
    },
    {
      id: 2,
      icon: <FaExchangeAlt size={32} />,
      iconColor: "bg-red-500",
      title: "انتقال سریع پول بین کاربران پرفکت‌مانی",
      description:
        "انتقال وجه بین کاربران پرفکت‌مانی با سرعت بالا و بدون کارمزدهای اضافی.",
    },
    {
      id: 3,
      icon: <FaShoppingCart size={32} />,
      iconColor: "bg-red-500",
      title: "خرید آنلاین از وب‌سایت‌های بین‌المللی",
      description:
        "پرداخت آنلاین امن در فروشگاه‌های خارجی و سرویس‌های بین‌المللی با حساب پرفکت‌مانی.",
    },
    {
      id: 4,
      icon: <FaDollarSign size={32} />,
      iconColor: "bg-red-500",
      title: "نگهداری دارایی به‌صورت دلار، یورو یا طلا",
      description:
        "مدیریت و نگهداری امن دارایی‌های شما به ارزهای مختلف یا حتی طلا در حساب پرفکت‌مانی.",
    },
    {
      id: 5,
      icon: <FaBitcoin size={32} />,
      iconColor: "bg-red-500",
      title: "خرید و فروش مستقیم رمزارزها با پرفکت‌مانی",
      description:
        "امکان معامله مستقیم رمزارزها و مدیریت دارایی دیجیتال با امنیت بالا.",
    },
  ];

  const perfectMoneyVipSteps = [
    {
      id: "step1",
      title: "ثبت درخواست آنلاین",
      href: "/perfectmoney-register",
      description:
        "اولین مرحله، ثبت درخواست افتتاح حساب پرفکت‌مانی از طریق وب‌سایت ارزی پلاس می‌باشد.",
      icon: <FaRegClipboard size={28} />,
      color: {
        bg: "bg-white",
        hover: "hover:bg-red-100",
        icon: "text-red-600",
        text: "text-red-800",
      },
    },
    {
      id: "step2",
      title: "ارسال اطلاعات اولیه",
      href: "/perfectmoney-register",
      description:
        "ارسال اطلاعات اولیه شامل نام، ایمیل و شماره تماس برای شروع فرآیند افتتاح حساب.",
      icon: <FaUserAlt size={28} />,
      color: {
        bg: "bg-white",
        hover: "hover:bg-red-100",
        icon: "text-red-600",
        text: "text-red-800",
      },
    },
    {
      id: "step3",
      title: "پرداخت هزینه افتتاح حساب",
      href: "/perfectmoney-register",
      description:
        "پرداخت هزینه افتتاح حساب به‌صورت ریالی جهت تسریع در فرآیند و فعال‌سازی حساب.",
      icon: <FaMoneyBillWave size={28} />,
      color: {
        bg: "bg-white",
        hover: "hover:bg-red-100",
        icon: "text-red-600",
        text: "text-red-800",
      },
    },
    {
      id: "step4",
      title: "ساخت و وریفای حساب",
      href: "/perfectmoney-register",
      description:
        "حساب شما با مدارک معتبر بین‌المللی ساخته و وریفای می‌شود تا بدون محدودیت استفاده کنید.",
      icon: <FaShieldAlt size={28} />,
      color: {
        bg: "bg-white",
        hover: "hover:bg-red-100",
        icon: "text-red-600",
        text: "text-red-800",
      },
    },
    {
      id: "step5",
      title: "آموزش استفاده امن",
      href: "/perfectmoney-register",
      description:
        "آموزش کامل نحوه استفاده و انجام تراکنش‌ها به‌صورت ایمن برای مدیریت حساب شما.",
      icon: <FaBook size={28} />,
      color: {
        bg: "bg-white",
        hover: "hover:bg-red-100",
        icon: "text-red-600",
        text: "text-red-800",
      },
    },
  ];

  const faqData = [
    {
      id: "1",
      question: "آیا پرفکت‌مانی کاربران ایرانی را محدود می‌کند؟",
      answer: "خیر، پرفکت‌مانی خدمات کامل را به کاربران ایرانی ارائه می‌دهد.",
      category: "محدودیت کاربران",
    },
    {
      id: "2",
      question: "آیا می‌توان بدون حساب، ووچر پرفکت‌مانی خرید؟",
      answer:
        "بله، ارزی پلاس خدمات فروش ووچر را بدون نیاز به حساب ارائه می‌دهد.",
      category: "خرید ووچر",
    },
    {
      id: "3",
      question: "آیا امکان نگهداری طلا در پرفکت‌مانی وجود دارد؟",
      answer: "بله، شما می‌توانید موجودی خود را به طلا تبدیل و ذخیره کنید.",
      category: "مدیریت دارایی",
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
        heading="افتتاح حساب پرفکت‌مانی در ایران با ارزی پلاس – سریع، امن و بدون محدودیت"
        subheading="افتتاح حساب پرفکت‌مانی"
        description="پرفکت‌مانی (Perfect Money) یک سیستم پرداخت الکترونیکی جهانی است که امکان نگهداری، ارسال و دریافت پول را در قالب دلار، یورو، طلا و حتی بیت‌کوین فراهم می‌کند. به دلیل عدم اعمال تحریم‌های بانکی، این سیستم برای کاربران ایرانی یک انتخاب ایده‌آل محسوب می‌شود.
با خدمات ارزی پلاس می‌توانید تنها در کمتر از ۲۴ ساعت صاحب یک حساب پرفکت‌مانی وریفای‌شده و بدون محدودیت شوید و از تمامی قابلیت‌های آن برای خرید، انتقال و نگهداری ارز استفاده کنید."
        buttons={[
          {
            text: "افتتاح حساب پرفکت‌مانی",
            href: "/register",
            variant: "secondary",
            icon: <FaExplosion />,
          },
        ]}
        media={{
          type: "image",
          src: "/assets/images/Perfect Money sakht.png",
          alt: "افتتاح حساب پرفکت‌مانی",
          width: 1200,
          height: 400,
        }}
        layout="default"
        theme={{
          headingColor: "text-gray-50",
          subheadingColor: "text-gray-700",
          descriptionColor: "text-slate-50",
          backgroundColor: "bg-red-500",
          bgSubHeadingColor: "bg-gray-50",
        }}
      />
      <StepsSection
        heading="مزایای افتتاح حساب پرفکت‌مانی با ارزی پلاس"
        description="با افتتاح حساب پرفکت‌مانی از طریق ارزی پلاس، می‌توانید به‌سرعت و با کمترین هزینه به امکانات مالی بین‌المللی دسترسی پیدا کنید. برخی از مزایای کلیدی افتتاح حساب پرفکت‌مانی با ما عبارت‌اند از:"
        steps={perfectMoneySteps}
        theme={stepThemes.red}
        layout="timeline"
        boxShape="square"
        boxSize="sm"
        showNumbers={true}
        animated={true}
        interactive={true}
        showIcons={true} // چون مزایا داری بهتره آیکون‌ها هم نمایش داده بشن
      />
      <WhyUsSection
        heading="کاربردهای حساب پرفکت‌مانی"
        description="با افتتاح حساب پرفکت‌مانی از طریق ارزی پلاس، می‌توانید به امکانات گسترده‌ای دسترسی داشته باشید:"
        buttonText="افتتاح حساب پرفکت‌مانی"
        buttonLink="/perfectmoney-account"
        items={perfectMoneyItemsWhyus}
        buttonColor="bg-red-500 hover:bg-red-700 text-white"
        theme={themesWhyus.default}
      />
      <HeroSplitSection
        heading="چرا ارزی پلاس؟"
        subHeading="امنیت و اطمینان در افتتاح حساب پرفکت‌مانی"
        description="ارزی پلاس با تجربه چندین ساله در افتتاح و وریفای حساب‌های بین‌المللی، امنیت بالا و خدمات جامع، بهترین گزینه برای مدیریت مالی بین‌المللی شما است."
        buttons={[
          {
            text: "افتتاح حساب با ارزی پلاس",
            href: "/wise-account",
            variant: "red",
            icon: <FaShieldAlt />,
          },
        ]}
        imageSrc="/assets/images/perfect.webp"
        imageAlt="افتتاح حساب بین‌المللی در ایران با ارزی پلاس"
        theme={splitSectionThemes.dark}
        layout="image-left"
        features={[
          {
            id: 1,
            title: "تجربه تخصصی",
            description:
              "افتتاح و وریفای حساب‌های بین‌المللی با تجربه چندین ساله و تیم متخصص.",
            icon: <FaClock />,
            style: {
              bg: "bg-indigo-900/30",
              border: "border-indigo-400",
              text: "text-indigo-200",
              iconColor: "text-indigo-400",
              shadow: "shadow-lg",
              rounded: "rounded-xl",
            },
          },
          {
            id: 2,
            title: "امنیت و محرمانگی",
            description:
              "اطمینان از امنیت داده‌ها و حفاظت کامل اطلاعات کاربران.",
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
              "شارژ حساب، نقد موجودی، خرید و فروش ووچر و خدمات ارزی کامل برای شما.",
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
        description="پاسخ سوالات رایج درباره خدمات ارزی پلاس و افتتاح حساب پرفکت‌مانی را در اینجا بیابید"
        svgIcon={faqIcons.info}
        faqItems={faqData}
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
        heading="همین حالا حساب پرفکت‌مانی خود را با ارزی پلاس افتتاح کنید و بدون محدودیت تراکنش انجام دهید!"
        description="با ارزی پلاس، حساب پرفکت‌مانی خود را به‌سرعت و با امنیت کامل فعال کنید و از انجام تراکنش‌های بین‌المللی لذت ببرید."
        button={{
          text: "ثبت درخواست افتتاح حساب پرفکت‌مانی",
          href: "/perfectmoney-register",
          variant: "primary",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.danger}
        height={50}
      />
    </div>
  );
};

export default PerfectMoney;
