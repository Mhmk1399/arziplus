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

const DIDPage = () => {
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
      title: "انتخاب اشتراک D-ID",
      description: "وارد بخش ثبت سفارش شوید و اشتراک D-ID را انتخاب کنید.",
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
      title: "رابط کاربری آسان و جذاب",
      description:
        "استفاده از D-ID ساده است و همه می‌توانند ویدیوهای حرفه‌ای بسازند.",
    },
    {
      id: 2,
      icon: <FaLock size={32} />,
      iconColor: "bg-indigo-700",
      title: "پشتیبانی از بیش از 100 زبان",
      description:
        "می‌توانید ویدیوهای خود را با صدا و متن در بیش از 100 زبان بسازید.",
    },
    {
      id: 3,
      icon: <FaPercent size={32} />,
      iconColor: "bg-indigo-700",
      title: "سرعت بالا",
      description: "ویدیوهای شما در کوتاه‌ترین زمان ممکن ساخته می‌شوند.",
    },
    {
      id: 4,
      icon: <FaHeadset size={32} />,
      iconColor: "bg-indigo-700",
      title: "پشتیبانی حرفه‌ای",
      description:
        "کارشناسان ما در تمام مراحل خرید و فعال‌سازی همراه شما هستند.",
    },
  ];

  const faqItems = [
    {
      id: "1",
      question: "چگونه می‌توانم در ایران اشتراک D-ID را خریداری کنم؟",
      answer:
        "برای خرید اشتراک D-ID در ایران، می‌توانید از کارت‌های اعتباری بین‌المللی، کیف پول‌های دیجیتال یا سایت‌های واسطه مانند ارزی پلاس استفاده کنید.",
      category: "خرید",
    },
    {
      id: "2",
      question: "بهترین روش برای خرید اشتراک D-ID از داخل ایران چیست؟",
      answer:
        "استفاده از کارت‌های اعتباری بین‌المللی مجازی یا سایت‌های واسطه پرداخت ارزی مانند ارزی پلاس سریع، امن و قابل اعتماد است.",
      category: "روش‌ها",
    },
    {
      id: "3",
      question: "چه تفاوت‌هایی بین پلن‌های مختلف اشتراک D-ID وجود دارد؟",
      answer:
        "پلن‌های مختلف از نظر تعداد پروژه‌ها، ویژگی‌های پیشرفته و میزان استفاده از منابع متفاوت هستند. پلن‌های حرفه‌ای امکانات بیشتری ارائه می‌دهند.",
      category: "پلن‌ها",
    },
    {
      id: "4",
      question: "آیا D-ID نسخه رایگان دارد و چه محدودیت‌هایی دارد؟",
      answer:
        "نسخه رایگان محدودیت‌هایی مانند تعداد کمتر پروژه‌ها و دسترسی محدود به ویژگی‌ها دارد.",
      category: "نسخه رایگان",
    },
    {
      id: "5",
      question: "هوش مصنوعی D-ID چه ویژگی‌هایی دارد؟",
      answer:
        "D-ID قابلیت ساخت ویدیوهای واقعی‌نما از تصاویر ثابت، تغییر چهره و حرکات لب، و ترکیب صدا با تصویر را دارد و برای تولید محتواهای دیجیتال و تبلیغات عالی است.",
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
        heading="خرید اکانت D-ID — خالق ویدیوهای حرفه‌ای"
        subheading="ایده‌هایت را در کسری از ثانیه به ویدیو تبدیل کن"
        description="با D-ID دیگر نیازی به دوربین یا تجهیزات حرفه‌ای نیست و می‌توانید ویدیوهای جذاب و خلاقانه بسازید."
        buttons={[
          {
            text: "ثبت سفارش D-ID",
            href: "/d-id",
            variant: "secondary",
            icon: <FaRocket />,
          },
        ]}
        media={{
          type: "image",
          src: "/assets/images/d-id.webp",
          alt: "خرید اکانت D-ID",
          width: 1200,
          height: 800,
        }}
        layout="default"
        theme={{
          headingColor: "text-gray-50",
          subheadingColor: "text-gray-200",
          descriptionColor: "text-gray-300",
          backgroundColor: "bg-indigo-700",
        }}
      />

      <StepsSection
        heading="مراحل خرید D-ID"
        description="خرید اشتراک D-ID با ارزی پلاس ساده و شفاف است."
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
        heading="مزایای خرید D-ID با ارزی پلاس"
        description="رابط کاربری آسان، سرعت بالا و پشتیبانی حرفه‌ای تنها بخشی از مزایای ماست."
        buttonText="ثبت سفارش D-ID"
        buttonLink="/d-id"
        items={whyUsItems}
        buttonColor="bg-indigo-800 hover:bg-indigo-900 text-white"
        theme={themesWhyus.dark}
      />

      <HeroSplitSection
        heading="ارزی پلاس، همراه شما در خرید هوش مصنوعی"
        subHeading="امنیت، سرعت و پشتیبانی حرفه‌ای"
        description="با ارزی پلاس می‌توانید اشتراک D-ID را به ساده‌ترین روش خریداری کنید و از امکانات آن بهره‌مند شوید."
        buttons={[
          {
            text: "ثبت سفارش D-ID",
            href: "/d-id",
            variant: "green",
            icon: <FaShieldAlt />,
          },
        ]}
        imageSrc="/assets/images/d-id-2.webp"
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
        description="پرسش‌های پرتکرار درباره D-ID"
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
        heading="همین حالا اشتراک D-ID خود را خریداری کنید!"
        description="با ارزی پلاس، به راحتی به هوش مصنوعی D-ID دسترسی پیدا کنید و ویدیوهای حرفه‌ای بسازید."
        button={{
          text: "ثبت سفارش D-ID",
          href: "/d-id",
          variant: "ghost",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.success}
        height={50}
      />
    </div>
  );
};

export default DIDPage;
