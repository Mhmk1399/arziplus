 
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
  FaMoneyBillWave,
  FaRegClipboard,
} from "react-icons/fa6";
import { FaShieldAlt } from "react-icons/fa";
import HeroSection from "../global/heroSection";
import StepsSection from "../global/stepsSection";
import WhyUsSection from "../global/whyUs";
import HeroSplitSection from "../global/heroSplitSection";
import FAQSection from "../global/faqSection";
import CTABanner from "../global/ctaBanner";

const CashingPerfect = () => {
  const cashingSteps = [
    {
      id: "fastPayment",
      title: "تسویه سریع در کمتر از ۲۴ ساعت کاری",
      description:
        "با ارزی پلاس، موجودی پرفکت‌مانی شما در کوتاه‌ترین زمان به ریال یا ارز دلخواه منتقل می‌شود.",
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
      title: "امکان نقد موجودی دلاری، یورویی یا طلا",
      description:
        "تمام ارزهای اصلی قابل نقد شدن هستند و به حساب شما منتقل می‌شوند.",
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
      title: "بدون نیاز به فروش ووچر به واسطه‌های ناشناس",
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
      iconColor: "bg-blue-900",
      title: "دریافت درآمد فریلنسری",
      description: "برداشت درآمد از پلتفرم‌های مختلف بین‌المللی با امنیت کامل.",
    },
    {
      id: 2,
      icon: <FaCoins size={32} />,
      iconColor: "bg-blue-900",
      title: "تسویه حساب با مشتریان خارجی",
      description:
        "پرداخت‌ها و درآمدهای بین‌المللی به ریال یا ارز دیگر تبدیل می‌شوند.",
    },
    {
      id: 3,
      icon: <FaRocket size={32} />,
      iconColor: "bg-blue-900",
      title: "نقد کردن سرمایه‌گذاری‌ها",
      description: "تبدیل دارایی‌ها و موجودی پرفکت‌مانی به نرخ روز و سریع.",
    },
    {
      id: 4,
      icon: <FaMedal size={32} />,
      iconColor: "bg-blue-900",
      title: "فروش ووچر پرفکت‌مانی به نرخ روز",
      description: "بدون واسطه و با بهترین نرخ بازار ووچر خود را نقد کنید.",
    },
  ];

  const cashingStepsProcess = [
    {
      id: "step1",
      title: "ثبت درخواست نقد کردن",
      href: "/cashing-perfect",
      description:
        "درخواست نقد کردن موجودی پرفکت‌مانی خود را از طریق وب‌سایت ارزی پلاس ثبت کنید.",
      icon: <FaRegClipboard size={28} />,
      color: {
        bg: "bg-white",
        hover: "hover:bg-blue-100",
        icon: "text-blue-600",
        text: "text-blue-800",
      },
    },
    {
      id: "step2",
      title: "ارسال شماره حساب یا ووچر",
      href: "/cashing-perfect",
      description:
        "شماره حساب یا ووچر پرفکت‌مانی خود را برای ارزی پلاس ارسال کنید.",
      icon: <FaEnvelope size={28} />,
      color: {
        bg: "bg-white",
        hover: "hover:bg-blue-100",
        icon: "text-blue-600",
        text: "text-blue-800",
      },
    },
    {
      id: "step3",
      title: "تایید نرخ تبدیل",
      href: "/cashing-perfect",
      description: "کاربر نرخ تبدیل پیشنهادی را تأیید می‌کند.",
      icon: <FaDollarSign size={28} />,
      color: {
        bg: "bg-white",
        hover: "hover:bg-blue-100",
        icon: "text-blue-600",
        text: "text-blue-800",
      },
    },
    {
      id: "step4",
      title: "انتقال موجودی به ارزی پلاس",
      href: "/cashing-perfect",
      description: "موجودی به حساب ارزی پلاس منتقل می‌شود.",
      icon: <FaMoneyBillWave size={28} />,
      color: {
        bg: "bg-white",
        hover: "hover:bg-blue-100",
        icon: "text-blue-600",
        text: "text-blue-800",
      },
    },
    {
      id: "step5",
      title: "دریافت معادل ریالی/ارزی",
      href: "/cashing-perfect",
      description: "معادل ریالی یا ارزی موجودی شما به حساب شما واریز می‌شود.",
      icon: <FaRocket size={28} />,
      color: {
        bg: "bg-white",
        hover: "hover:bg-blue-100",
        icon: "text-blue-600",
        text: "text-blue-800",
      },
    },
  ];

  const cashingFaq = [
    {
      id: "1",
      question: "آیا امکان نقد کردن ووچر پرفکت‌مانی وجود دارد؟",
      answer: "بله، ارزی پلاس این کار را انجام می‌دهد.",
      category: "نقد کردن پرفکت‌مانی",
    },
    {
      id: "2",
      question: "آیا می‌توان موجودی را به ارز دیگری تبدیل کرد؟",
      answer: "بله، امکان تبدیل به رمزارز یا ارز فیات دیگر هم وجود دارد.",
      category: "نقد کردن پرفکت‌مانی",
    },
    {
      id: "3",
      question: "آیا مبلغی برای نقد کردن محدودیت دارد؟",
      answer: "خیر، هر مبلغی قابل نقد شدن است.",
      category: "نقد کردن پرفکت‌مانی",
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
        heading="تبدیل سریع و امن موجودی پرفکت‌مانی به ریال در ایران با ارزی پلاس"
        subheading="نقد کردن موجودی پرفکت‌مانی"
        description="پرفکت‌مانی (Perfect Money) یکی از محبوب‌ترین سیستم‌های پرداخت الکترونیکی بین‌المللی است که به دلیل عدم اعمال تحریم‌ها، کاربران ایرانی می‌توانند به‌راحتی از آن استفاده کنند. بسیاری از فریلنسرها، تریدرها و فعالان حوزه رمزارز درآمد خود را از طریق پرفکت‌مانی دریافت می‌کنند.
با خدمات ارزی پلاس، می‌توانید موجودی پرفکت‌مانی خود را در کوتاه‌ترین زمان به ریال یا ارزهای دیگر تبدیل کنید، با بهترین نرخ و بدون دغدغه."
        buttons={[
          {
            text: "ثبت درخواست نقد کردن پرفکت‌مانی",
            href: "/cashing-perfect",
            variant: "secondary",
            icon: <FaRocket />,
          },
        ]}
        media={{
          type: "image",
          src: "/assets/images/cash-perfect-hero.webp",
          alt: "نقد کردن موجودی پرفکت‌مانی",
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
        heading="مزایای نقد کردن پرفکت‌مانی با ارزی پلاس"
        description="با ارزی پلاس، تسویه سریع، کارمزد شفاف و امنیت کامل را تجربه کنید:"
        steps={cashingSteps}
        theme={stepThemes.minimal}
        layout="vertical"
        boxShape="rounded"
        boxSize="sm"
        showNumbers={true}
        animated={true}
        showIcons={true}
      />

      <WhyUsSection
        heading="کاربردهای نقد کردن پرفکت‌مانی"
        description="دریافت درآمد فریلنسری، تسویه حساب با مشتریان خارجی، نقد کردن سرمایه‌گذاری‌ها و فروش ووچر:"
        buttonText="ثبت درخواست نقد کردن"
        buttonLink="/cashing-perfect"
        items={cashingUseCases}
        buttonColor="bg-blue-800 hover:bg-blue-900 text-white"
        theme={themesWhyus.dark}
      />

    

      <HeroSplitSection
        heading="چرا ارزی پلاس؟"
        subHeading="تجربه، امنیت و پشتیبانی حرفه‌ای"
        description="ارزی پلاس با سابقه چندین ساله، تضمین امنیت تراکنش‌ها و نرخ رقابتی، بهترین گزینه برای نقد کردن پرفکت‌مانی است."
        buttons={[
          {
            text: "ثبت درخواست نقد کردن",
            href: "/cashing-perfect",
            variant: "primary",
            icon: <FaShieldAlt />,
          },
        ]}
        imageSrc="/assets/images/cash-perfect-2.webp"
        imageAlt="ارزی پلاس"
        theme={splitSectionThemes.dark}
        layout="image-left"
        imageWidth="1/2"
        features={[
          {
            id: 1,
            title: "تجربه چندین ساله",
            description:
              "ارزی پلاس با سابقه چندین ساله بهترین خدمات نقد کردن پرفکت‌مانی را ارائه می‌دهد.",
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
              "پشتیبانی ۲۴ ساعته در تمام مراحل نقد کردن موجودی پرفکت‌مانی.",
            icon: <FaHeadset />,
          },
        ]}
      />

      <FAQSection
        heading="سؤالات متداول"
        description="پرسش‌های پرتکرار درباره نقد کردن موجودی پرفکت‌مانی"
        svgIcon={faqIcons.info}
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
        heading="همین حالا موجودی پرفکت‌مانی خود را با ارزی پلاس نقد کنید!"
        description="با ارزی پلاس، درآمدتان سریع و مطمئن دریافت می‌شود."
        button={{
          text: "ثبت درخواست نقد کردن پرفکت‌مانی",
          href: "/cashing-perfect",
          variant: "primary",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.light}
        height={50}
      />
    </div>
  );
};

export default CashingPerfect;
