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

const AirbnbPaymentPage = () => {
  const steps = [
    {
      id: "register",
      title: "ثبت نام در ارزی پلاس",
      description: "با چند کلیک ساده حساب کاربری بساز و آماده پرداخت شو.",
      icon: <FaDollarSign />,
      isActive: true,
    },
    {
      id: "selectService",
      title: "انتخاب خدمت مورد نظر",
      description: "پرداخت هزینه Airbnb را انتخاب کن.",
      icon: <FaCoins />,
    },
    {
      id: "payment",
      title: "پرداخت معادل ریالی",
      description:
        "معادل ریالی هزینه رزرو اقامتگاه را پرداخت کن و سفارشت نهایی شود.",
      icon: <FaPercent />,
      isActive: true,
    },
  ];

  const whyUsItems = [
    {
      id: 1,
      icon: <FaClock size={32} />,
      iconColor: "bg-indigo-700",
      title: "پرداخت سریع",
      description: "پرداخت رزرو اقامتگاه شما در کوتاه‌ترین زمان انجام می‌شود.",
    },
    {
      id: 2,
      icon: <FaLock size={32} />,
      iconColor: "bg-indigo-700",
      title: "امنیت بالا",
      description: "تمامی تراکنش‌ها از طریق حساب امن و مطمئن انجام می‌شود.",
    },
    {
      id: 3,
      icon: <FaPercent size={32} />,
      iconColor: "bg-indigo-700",
      title: "بدون کارمزد و قیمت مناسب",
      description: "بهترین نرخ و کمترین کارمزد برای پرداخت‌های Airbnb.",
    },
    {
      id: 4,
      icon: <FaHeadset size={32} />,
      iconColor: "bg-indigo-700",
      title: "پشتیبانی تخصصی",
      description: "کارشناسان ما تمام مراحل رزرو و پرداخت را راهنمایی می‌کنند.",
    },
  ];

  const faqItems = [
    {
      id: "1",
      question:
        "چگونه می‌توان با وجود محدودیت‌های بانکی، هزینه رزرو Airbnb را پرداخت کرد؟",
      answer:
        "صرافی‌های آنلاین معتبر مانند ارزی پلاس امکان پرداخت مستقیم به Airbnb را فراهم می‌کنند و محدودیت‌های بین‌المللی را دور می‌زنند.",
      category: "پرداخت",
    },
    {
      id: "2",
      question: "آیا استفاده از صرافی‌های آنلاین ایمن است؟",
      answer:
        "بله، صرافی‌های معتبر با استفاده از سیستم‌های امنیتی پیشرفته، اطلاعات مالی شما را محافظت می‌کنند.",
      category: "پرداخت",
    },
    {
      id: "3",
      question: "چه مدارکی برای پرداخت نیاز است؟",
      answer:
        "اطلاعات کامل رزرو در Airbnb، اطلاعات کارت بانکی و ایمیل یا حساب Airbnb مرتبط با رزرو.",
      category: "پرداخت",
    },
    {
      id: "4",
      question: "مزایای استفاده از صرافی‌های آنلاین چیست؟",
      answer:
        "سهولت پرداخت، سرعت بالا، امنیت و پشتیبانی حرفه‌ای از مهم‌ترین مزایا هستند.",
      category: "پرداخت",
    },
    {
      id: "5",
      question: "به چه نکاتی هنگام انتخاب صرافی توجه کنیم؟",
      answer:
        "اعتبار صرافی، کارمزد، نرخ ارز و سرعت انجام تراکنش نکات مهم هستند.",
      category: "پرداخت",
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
        heading="پرداخت هزینه Airbnb"
        subheading="رزرو آسان و سریع اقامتگاه با Airbnb"
        description="با ارزی پلاس، پرداخت هزینه Airbnb سریع، امن و آسان است."
        buttons={[
          {
            text: "رزرو اقامتگاه",
            href: "/airbnb-payment",
            variant: "secondary",
            icon: <FaRocket />,
          },
        ]}
        media={{
          type: "image",
          src: "/assets/images/airbnb.webp",
          alt: "پرداخت هزینه Airbnb",
          width: 1200,
          height: 800,
        }}
        layout="default"
        theme={{
          headingColor: "text-gray-50",
          subheadingColor: "text-gray-200",
          descriptionColor: "text-gray-300",
          backgroundColor: "bg-red-600",
        }}
      />

      <StepsSection
        heading="مراحل پرداخت"
        description="رزرو اقامتگاه در Airbnb فقط با چند کلیک ساده"
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
        heading="مزایای پرداخت با ارزی پلاس"
        description="سرعت، امنیت، قیمت مناسب و پشتیبانی حرفه‌ای"
        buttonText="رزرو اقامتگاه"
        buttonLink="/airbnb-payment"
        items={whyUsItems}
        buttonColor="bg-red-700 hover:bg-red-800 text-white"
        theme={themesWhyus.dark}
      />

      <HeroSplitSection
        heading="ارزی پلاس، همراه امن پرداخت‌های بین‌المللی شما"
        subHeading="سریع، امن و مطمئن"
        description="پرداخت هزینه رزرو اقامتگاه در Airbnb را بدون دردسر و با چند کلیک انجام دهید."
        buttons={[
          {
            text: "رزرو اقامتگاه",
            href: "/airbnb-payment",
            variant: "green",
            icon: <FaShieldAlt />,
          },
        ]}
        imageSrc="/assets/images/airbnb-2.webp"
        imageAlt="پرداخت هزینه Airbnb"
        theme={splitSectionThemes.dark}
        layout="image-left"
        imageWidth="1/2"
        features={[
          {
            id: 1,
            title: "پرداخت امن و سریع",
            description: "تمامی تراکنش‌ها با امنیت کامل انجام می‌شوند.",
            icon: <FaLock />,
          },
          {
            id: 2,
            title: "پشتیبانی تخصصی",
            description: "کارشناسان ما تمام سوالات شما را پاسخ می‌دهند.",
            icon: <FaHeadset />,
          },
          {
            id: 3,
            title: "کارمزد شفاف",
            description: "قبل از پرداخت، میزان کارمزد مشخص و شفاف است.",
            icon: <FaPercent />,
          },
        ]}
      />

      <FAQSection
        heading="سوالات متداول"
        description="پاسخ به متداول‌ترین سوالات درباره پرداخت هزینه‌های Airbnb"
        svgIcon={faqIcons.info}
        faqItems={faqItems}
        buttons={[
          {
            text: "تماس با پشتیبانی",
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
        heading="همین حالا رزرو اقامتگاه خود را انجام بده!"
        description="با ارزی پلاس، پرداخت هزینه Airbnb سریع، امن و آسان است."
        button={{
          text: "رزرو اقامتگاه",
          href: "/airbnb-payment",
          variant: "ghost",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.success}
        height={50}
      />
    </div>
  );
};

export default AirbnbPaymentPage;
