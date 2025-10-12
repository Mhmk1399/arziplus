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

const UKVisaPaymentPage = () => {
  const steps = [
    {
      id: "register",
      title: "ثبت نام در ارزی پلاس",
      description: "به راحتی حساب کاربری بساز و آماده پرداخت شو.",
      icon: <FaDollarSign />,
      isActive: true,
    },
    {
      id: "selectService",
      title: "انتخاب خدمت مورد نظر",
      description: "پرداخت هزینه سفارت انگلیس را انتخاب کن.",
      icon: <FaCoins />,
    },
    {
      id: "payment",
      title: "پرداخت معادل ریالی",
      description:
        "معادل ریالی هزینه مورد نظر را پرداخت کن و سفارشت نهایی شود.",
      icon: <FaPercent />,
      isActive: true,
    },
  ];

  const whyUsItems = [
    {
      id: 1,
      icon: <FaClock size={32} />,
      iconColor: "bg-indigo-700",
      title: "سرعت بالا",
      description: "پرداخت شما در کوتاه‌ترین زمان ممکن انجام می‌شود.",
    },
    {
      id: 2,
      icon: <FaLock size={32} />,
      iconColor: "bg-indigo-700",
      title: "امنیت بالا",
      description: "تمامی تراکنش‌ها با امنیت کامل از حساب مطمئن انجام می‌شود.",
    },
    {
      id: 3,
      icon: <FaPercent size={32} />,
      iconColor: "bg-indigo-700",
      title: "قیمت مناسب",
      description: "کمترین کارمزد و نرخ منصفانه برای پرداخت ارزیت.",
    },
    {
      id: 4,
      icon: <FaHeadset size={32} />,
      iconColor: "bg-indigo-700",
      title: "پشتیبانی حرفه‌ای",
      description: "کارشناسان ما در تمام مراحل همراه شما هستند.",
    },
  ];

  const faqItems = [
    {
      id: "1",
      question:
        "چرا باید هزینه تعیین وقت سفارت انگلیس را از طریق ارزی پلاس پرداخت کنم؟",
      answer:
        "ارزی پلاس امکان پرداخت امن و سریع هزینه‌های مختلف از جمله تعیین وقت سفارت انگلیس را فراهم می‌کند و با پشتیبانی حرفه‌ای همراه شماست.",
      category: "پرداخت",
    },
    {
      id: "2",
      question: "چه مدارکی برای پرداخت هزینه تعیین وقت سفارت انگلیس نیاز است؟",
      answer:
        "شماره پاسپورت، اطلاعات کارت بانکی شامل شماره کارت، تاریخ انقضا و CVV2 و اطلاعات مربوط به وقت سفارت.",
      category: "پرداخت",
    },
    {
      id: "3",
      question: "آیا می‌توان هزینه IHS را نیز پرداخت کرد؟",
      answer:
        "بله، معمولاً امکان پرداخت هزینه IHS نیز از طریق پلتفرم‌هایی مانند ارزی پلاس وجود دارد.",
      category: "پرداخت",
    },
    {
      id: "4",
      question:
        "آیا پرداخت هزینه تعیین وقت سفارت انگلیس برای همه انواع ویزا امکان‌پذیر است؟",
      answer:
        "به طور کلی بله، اما بهتر است قبل از پرداخت لیست ویزاهای قابل پرداخت را بررسی کنید.",
      category: "پرداخت",
    },
    {
      id: "5",
      question: "در صورت بروز مشکل در پرداخت، چه کار باید کرد؟",
      answer:
        "با پشتیبانی آنلاین ارزی پلاس تماس بگیرید تا راهنمایی کامل دریافت کنید.",
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
        heading="پرداخت هزینه سفارت انگلیس"
        subheading="زندگی در انگلیس تجربه‌ای که ارزشش را دارد..."
        description="با ارزی پلاس، پرداخت هزینه تعیین وقت سفارت انگلیس را سریع، امن و آسان انجام بده."
        buttons={[
          {
            text: "پرداخت هزینه سفارت",
            href: "/uk-visa-payment",
            variant: "secondary",
            icon: <FaRocket />,
          },
        ]}
        media={{
          type: "image",
          src: "https://arziplus.s3.eu-north-1.amazonaws.com/Desktop/32-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQ7H6KSQTM%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T105430Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiSDBGAiEAtIdP37jq6qrBGgyxEMk60YkJRU5i1yYhWcEEMxaL0ukCIQDKOCEcURMm9hiYEptDGDUTW9V0xiHkyCHhfb%2F9Yan2VCrWAggsEAAaDDMxMTM3NjEyMDIyNSIM4usnjP0eIsfM22BcKrMCc8OyyTS1XXdKDSHfqHzVdjhdHSI9PshTbaS9cqOk7QA9i5FAjpuTNJ9SOwFOMtcLgjuLbNvGmogCuc9Qy0A%2BsvCirhEg6kNYZ0K1aLF%2BzY0GFJa%2B34funAERXN0rmkVfNfEuBXs6f%2FPMQGxgmOajvbH3B992sONbzaBtiaKJHtDagy8M0i7yKC3ZU7tDfmXfnMAcq8%2FZfZ5aENZbUKqNSj%2BZE4Esy53Zgl3lkzlWaT%2BhAs6PTlDunFHPBbU28NsCDFBMs8HcqaR%2BMATjq67cZfK%2BpYIfkNaFj4q8uLqivRG5FQY9MRHdHNAjGKoKaEgTCZ7rLr2ATNTiC5dlDispa73Ufu%2BJG6ObzAhsiQZxT9BbkG6VvdHW98h%2BOa%2BWbn075mtHqbKR364XwouqYQqfXai0EDCS8q3HBjqsAgCGA0FgGDKhQWTc5QYEOeekqAMkG7z0nK6GHbfkgAr9YQRmsWD6wWcyrDThG0Z%2BwfmrAMQGuqZyrQaAm%2Bi23WDIL8wUWV%2Fq70KtkV7pTAvbSE46MLY91py5VopFIGE13%2FPFLRYorAQeqDJ0fr1NAosPXeJW0c4Ec5jvL7mvmU0wXHO8jHKxHI4QDEthw%2BWcAOW51cZqK8FIKzCQypPSmWzDLCy5%2F94aCKnMZzHttrRZ6ahHy3CN6YlkN3%2BZTY8RT5ASjKO%2BT1c39RPWyUrdExjPQ6Hhwvxxf5mCvKIe2Plu%2FcmYIklZUtC%2BYylW6b9nuAYNOvYUSpn3NCRcgqea3rxgRyRgFq716oedhbKG%2FZlOKGskq1ipGT51nn04ry8Ub0Nijrkt%2FPb6ZvuW5A%3D%3D&X-Amz-Signature=5bf01f8a64ffd2effa766bf6eb339c1dd419dd3fcfc2c7bb4fd9fcdd5826d5e7&X-Amz-SignedHeaders=host&response-content-disposition=inline",
          alt: "پرداخت هزینه سفارت انگلیس",
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
        heading="چگونه پرداخت کنیم؟"
        description="پرداخت هزینه سفارت انگلیس فقط با چند کلیک ساده"
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
        buttonText="پرداخت هزینه سفارت"
        buttonLink="/uk-visa-payment"
        items={whyUsItems}
        buttonColor="bg-indigo-800 hover:bg-indigo-900 text-white"
        theme={themesWhyus.dark}
      />

      <HeroSplitSection
        heading="ارزی پلاس، همراه امن پرداخت‌های بین‌المللی شما"
        subHeading="سریع، امن و مطمئن"
        description="پرداخت هزینه سفارت انگلیس را بدون دردسر و با چند کلیک انجام دهید."
        buttons={[
          {
            text: "پرداخت هزینه سفارت",
            href: "/uk-visa-payment",
            variant: "green",
            icon: <FaShieldAlt />,
          },
        ]}
        imageSrc="/assets/images/uk-visa-2.webp"
        imageAlt="پرداخت هزینه سفارت انگلیس"
        theme={splitSectionThemes.dark}
        layout="image-left"
        imageWidth="1/2"
        features={[
          {
            id: 1,
            title: "پرداخت امن و سریع",
            description: "تمامی تراکنش‌ها با امنیت کامل انجام می‌شود.",
            icon: <FaLock />,
          },
          {
            id: 2,
            title: "پشتیبانی حرفه‌ای",
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
        description="پاسخ به متداول‌ترین سوالات درباره پرداخت هزینه‌های سفارت انگلیس"
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
        heading="همین حالا پرداختت را انجام بده!"
        description="با ارزی پلاس، پرداخت هزینه سفارت انگلیس سریع، امن و آسان است."
        button={{
          text: "پرداخت هزینه سفارت",
          href: "/uk-visa-payment",
          variant: "ghost",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.success}
        height={50}
      />
    </div>
  );
};

export default UKVisaPaymentPage;
