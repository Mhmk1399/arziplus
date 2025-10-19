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

const BookingPaymentPage = () => {
  const steps = [
    {
      id: "payment",
      title: "پرداخت معادل ریالی",
      description:
        "معادل ریالی هزینه رزرو هتل را پرداخت کن و سفارشت نهایی شود.",
      icon: <FaPercent />,
      isActive: true,
    },
    {
      id: "selectService",
      title: "انتخاب خدمت مورد نظر",
      description: "پرداخت هزینه Booking.com را انتخاب کن.",
      icon: <FaCoins />,
    },
    {
      id: "register",
      title: "ثبت نام در ارزی پلاس",
      description: "با چند کلیک ساده حساب کاربری بساز و آماده پرداخت شو.",
      icon: <FaDollarSign />,
      isActive: true,
    },
  ];

  const whyUsItems = [
    {
      id: 1,
      icon: <FaClock size={32} />,
      title: "پرداخت سریع",
      description:
        "پرداخت رزرو هتل شما توسط ارزی پلاس در کوتاه‌ترین زمان انجام می‌شود.",
    },
    {
      id: 2,
      icon: <FaLock size={32} />,
      title: "امنیت بالا",
      description:
        "تمامی تراکنش‌ها با امنیت کامل و از طریق حساب مطمئن انجام می‌شود.",
    },
    {
      id: 3,
      icon: <FaPercent size={32} />,
      title: "قیمت مناسب",
      description: "بهترین نرخ و کمترین کارمزد برای پرداخت‌های Booking.com.",
    },
    {
      id: 4,
      icon: <FaHeadset size={32} />,
      title: "پشتیبانی حرفه‌ای",
      description: "کارشناسان ارزی پلاس در تمام مراحل  همراه و کنار شما هستند.",
    },
  ];

  const faqItems = [
    {
      id: "1",
      question: "چگونه می‌توان هزینه رزرو هتل در Booking.com را پرداخت کرد؟",
      answer:
        "برای کاربران ایرانی که دسترسی به کارت‌های بین‌المللی ندارند، صرافی‌های آنلاین مانند ارزی پلاس امکان پرداخت مستقیم به Booking.com را فراهم می‌کنند.",
      category: "پرداخت",
    },
    {
      id: "2",
      question: "آیا استفاده از صرافی‌های آنلاین ایمن است؟",
      answer:
        "بله، صرافی‌های معتبر مانند ارزی پلاس با رعایت استانداردهای امنیتی و رمزنگاری، از اطلاعات مالی شما محافظت می‌کنند.",
      category: "پرداخت",
    },
    {
      id: "3",
      question: "چه مدارکی برای پرداخت نیاز است؟",
      answer:
        "اطلاعات رزرو هتل، اطلاعات کارت بانکی و اطلاعات حساب Booking.com یا ایمیل مرتبط با رزرو.",
      category: "پرداخت",
    },
    {
      id: "4",
      question: "مزایای استفاده از صرافی‌های آنلاین چیست؟",
      answer:
        "سهولت پرداخت، سرعت بالا، امنیت و پشتیبانی تخصصی از مهم‌ترین مزایا هستند.",
      category: "پرداخت",
    },
    {
      id: "5",
      question: "آیا کارمزد برای پرداخت وجود دارد؟",
      answer:
        "بله، کارمزد بسته به نوع ارز و مبلغ پرداخت متفاوت است؛ قبل از پرداخت کارمزد را بررسی کنید.",
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
        heading="پرداخت هزینه Booking.com"
        subheading="با چند کلیک، هتل دلخواهت را رزرو کن!"
        description="Booking.com با بیش از ۲۹ میلیون اقامتگاه در ۱۹۰ کشور، محبوب‌ترین پلتفرم رزرو هتل است، اما کاربران ایرانی به دلیل تحریم‌ها با محدودیت‌های پرداخت روبرو هستند – سایت‌های ایرانی فقط کارت‌های محلی می‌پذیرند و پرداخت خارجی‌ها مسدود است. ارزی پلاس (ArziPlus.com) این چالش را حل می‌کند و رزرو هتل را بدون کارت اعتباری بین‌المللی، با روش‌های داخلی امن، در عرض چند دقیقه انجام می‌دهد."
        buttons={[
          {
            text: "رزرو هتل",
            href: "/services/buy-booking",
            variant: "secondary",
            icon: <FaRocket />,
          },
        ]}
        features={[
          { text: "سریع و بدون تأخیر" },
          { text: "امن و مطمئن" },
          { text: "آسان برای همه" },
        ]}
        media={{
          type: "image",
          src: "https://arziplus.storage.c2.liara.space/images/pages/34-min.png",
          alt: "پرداخت هزینه Booking.com",
          width: 1200,
          height: 800,
        }}
        layout="default"
        theme={{
          headingColor: "text-gray-50",
          subheadingColor: "text-gray-500",
          descriptionColor: "text-gray-300",
          backgroundColor: "bg-indigo-700",
          featuresColor: "text-gray-600",
        }}
      />

      <StepsSection
        heading="مراحل پرداخت"
        description="رزرو هتل در Booking.com فقط با چند کلیک ساده"
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
        buttonText="رزرو هتل"
        buttonLink="/services/buy-booking"
        items={whyUsItems}
        theme={themesWhyus.dark}
      />

      <HeroSplitSection
        heading="ارزی پلاس، همراه امن پرداخت‌های بین‌المللی شما"
        subHeading="سریع، امن و مطمئن"
        description="پرداخت هزینه رزرو هتل در Booking.com را بدون دردسر و با چند کلیک انجام دهید."
        buttons={[
          {
            text: "رزرو هتل",
            href: "/services/buy-booking",
            variant: "green",
            icon: <FaShieldAlt />,
          },
        ]}
        imageSrc="/assets/images/booking-2.webp"
        imageAlt="پرداخت هزینه Booking.com"
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
        description="پاسخ به متداول‌ترین سوالات درباره پرداخت هزینه‌های Booking.com"
        svgIcon={faqIcons.info}
        faqItems={faqItems}
        buttons={[
          {
            text: "تماس با پشتیبانی",
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
        heading="همین حالا رزرو هتل خود را انجام بده!"
        description="با ارزی پلاس، پرداخت هزینه Booking.com سریع، امن و آسان است."
        button={{
          text: "رزرو هتل",
          href: "/dashboard#services",
          variant: "ghost",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.success}
        height={50}
      />
    </div>
  );
};

export default BookingPaymentPage;
