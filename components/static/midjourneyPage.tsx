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
  FaPercent,
  FaEnvelope,
} from "react-icons/fa6";
import { FaShieldAlt, FaCoins } from "react-icons/fa";
import HeroSection from "../global/heroSection";
import StepsSection from "../global/stepsSection";
import WhyUsSection from "../global/whyUs";
import HeroSplitSection from "../global/heroSplitSection";
import FAQSection from "../global/faqSection";
import CTABanner from "../global/ctaBanner";

const MidjourneyPage = () => {
  const steps = [
    {
      id: "register",
      title: "ثبت نام در ارزی پلاس",
      description: "به راحتی در سایت ارزی پلاس حساب کاربری بسازید.",
      icon: <FaDollarSign />,
      isActive: true,
    },
    {
      id: "selectPlan",
      title: "انتخاب اشتراک Midjourney",
      description:
        "وارد بخش ثبت سفارش شوید و اشتراک Midjourney را انتخاب کنید.",
      icon: <FaCoins />,
    },
    {
      id: "payment",
      title: "پرداخت معادل ریالی",
      description:
        "معادل ریالی هزینه اشتراک را پرداخت کنید و دسترسی کامل دریافت کنید.",
      icon: <FaPercent />,
      isActive: true,
    },
  ];

  const whyUsItems = [
    {
      id: 1,
      icon: <FaClock size={32} />,
      iconColor: "bg-indigo-700",
      title: "نیاز به دانش فنی ندارد",
      description:
        "استفاده از Midjourney ساده است و هر کسی می‌تواند تصاویر خلاقانه بسازد.",
    },
    {
      id: 2,
      icon: <FaLock size={32} />,
      iconColor: "bg-indigo-700",
      title: "کیفیت خروجی بالا",
      description:
        "تصاویر تولید شده توسط Midjourney از کیفیت و جذابیت بالایی برخوردارند.",
    },
    {
      id: 3,
      icon: <FaPercent size={32} />,
      iconColor: "bg-indigo-700",
      title: "کارمزد منصفانه",
      description: "تمامی پرداخت‌ها با کارمزد شفاف و بدون واسطه انجام می‌شوند.",
    },
    {
      id: 4,
      icon: <FaHeadset size={32} />,
      iconColor: "bg-indigo-700",
      title: "پشتیبانی حرفه‌ای",
      description:
        "کارشناسان ما در تمام مراحل خرید و فعال‌سازی اشتراک همراه شما هستند.",
    },
  ];

  const faqItems = [
    {
      id: "1",
      question: "ابزار Midjourney چیست و چگونه کار می‌کند؟",
      answer:
        "Midjourney یک ابزار هوش مصنوعی است که متن شما را به تصویر تبدیل می‌کند. کافی است یک جمله وارد کنید و تصویر خلاقانه تحویل بگیرید.",
      category: "ابزار",
    },
    {
      id: "2",
      question:
        "آیا می‌توان اکانت Midjourney را روی همه دستگاه‌ها استفاده کرد؟",
      answer:
        "بله، می‌توانید از طریق برنامه Discord یا نسخه وب Midjourney به راحتی استفاده کنید.",
      category: "دستگاه‌ها",
    },
    {
      id: "3",
      question: "چقدر طول می‌کشد تا اکانت Midjourney شارژ شود؟",
      answer:
        "با خدمات پرداخت ارزی پلاس، اکانت شما معمولاً در کمتر از 1 ساعت کاری شارژ می‌شود.",
      category: "پرداخت",
    },
    {
      id: "4",
      question: "چرا از Midjourney استفاده کنیم؟",
      answer:
        "Midjourney ابزاری خلاقانه برای طراحان و هنرمندان است که ایده‌های شما را به تصاویر خیره‌کننده تبدیل می‌کند.",
      category: "ویژگی‌ها",
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
        heading="خرید اکانت Midjourney — خالق تصاویر خیره‌کننده"
        subheading="ایده‌هایت را به تصاویر خلاقانه تبدیل کن"
        description="با Midjourney، بدون نیاز به دانش فنی، تصاویر خلاقانه و با کیفیت بالا بسازید."
        buttons={[
          {
            text: "ثبت سفارش Midjourney",
            href: "/midjourney",
            variant: "secondary",
            icon: <FaRocket />,
          },
        ]}
        media={{
          type: "image",
          src: "/assets/images/Midjourney.png",
          alt: "خرید اکانت Midjourney",
          width: 1200,
          height: 800,
        }}
        layout="default"
        theme={{
          headingColor: "text-gray-50",
          subheadingColor: "text-gray-500",
          descriptionColor: "text-gray-300",
          backgroundColor: "bg-indigo-700",
        }}
      />

      <StepsSection
        heading="مراحل خرید Midjourney"
        description="خرید اشتراک Midjourney با ارزی پلاس ساده و شفاف است."
        steps={steps}
        theme={stepThemes.default}
        layout="vertical"
        boxShape="rounded"
        boxSize="sm"
        showNumbers={true}
        animated={true}
        showIcons={true}
      />

      <WhyUsSection
        heading="مزایای خرید Midjourney با ارزی پلاس"
        description="کیفیت، خلاقیت و پشتیبانی حرفه‌ای تنها بخشی از مزایای ماست."
        buttonText="ثبت سفارش Midjourney"
        buttonLink="/midjourney"
        items={whyUsItems}
        buttonColor="bg-indigo-800 hover:bg-indigo-900 text-white"
        theme={themesWhyus.dark}
      />

      <HeroSplitSection
        heading="ارزی پلاس، همراه شما در خرید هوش مصنوعی"
        subHeading="امنیت، سرعت و پشتیبانی حرفه‌ای"
        description="با ارزی پلاس می‌توانید اشتراک Midjourney را به ساده‌ترین روش خریداری کنید و از امکانات آن بهره‌مند شوید."
        buttons={[
          {
            text: "ثبت سفارش Midjourney",
            href: "/midjourney",
            variant: "green",
            icon: <FaShieldAlt />,
          },
        ]}
        imageSrc="/assets/images/midjourney-2.webp"
        imageAlt="ارزی پلاس"
        theme={splitSectionThemes.dark}
        layout="image-left"
        imageWidth="1/2"
        features={[
          {
            id: 1,
            title: "پرداخت امن و سریع",
            description: "تمامی تراکنش‌ها با امنیت کامل و سریع انجام می‌شود.",
            icon: <FaLock />,
          },
          {
            id: 2,
            title: "پشتیبانی حرفه‌ای",
            description:
              "کارشناسان ما در تمام مراحل خرید و فعال‌سازی همراه شما هستند.",
            icon: <FaHeadset />,
          },
          {
            id: 3,
            title: "کارمزد شفاف",
            description:
              "قبل از پرداخت، میزان کارمزد و نرخ دقیق مشخص و شفاف است.",
            icon: <FaPercent />,
          },
        ]}
      />

      <FAQSection
        heading="سؤالات متداول"
        description="پرسش‌های پرتکرار درباره Midjourney"
        svgIcon={faqIcons.info}
        faqItems={faqItems}
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
        heading="همین حالا اشتراک Midjourney خود را خریداری کنید!"
        description="با ارزی پلاس، به راحتی به هوش مصنوعی Midjourney دسترسی پیدا کنید و تصاویر خلاقانه بسازید."
        button={{
          text: "ثبت سفارش Midjourney",
          href: "/midjourney",
          variant: "ghost",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.success}
        height={50}
      />
    </div>
  );
};

export default MidjourneyPage;
