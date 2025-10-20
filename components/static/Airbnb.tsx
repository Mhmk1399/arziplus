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
      id: "payment",
      title: "پرداخت معادل ریالی",
      description:
        "معادل ریالی هزینه رزرو اقامتگاه را پرداخت کن و سفارشت نهایی شود.",
      icon: <FaPercent />,
      isActive: true,
    },
    {
      id: "selectService",
      title: "انتخاب خدمت مورد نظر",
      description: "پرداخت هزینه Airbnb را انتخاب کن.",
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
      description: "پرداخت رزرو اقامتگاه شما در کوتاه‌ترین زمان انجام می‌شود.",
    },
    {
      id: 2,
      icon: <FaLock size={32} />,
      title: "امنیت بالا",
      description: "تمامی تراکنش‌ها از طریق حساب امن و مطمئن انجام می‌شود.",
    },
    {
      id: 3,
      icon: <FaPercent size={32} />,
      title: "بدون کارمزد و قیمت مناسب",
      description: "بهترین نرخ و کمترین کارمزد برای پرداخت‌های Airbnb.",
    },
    {
      id: 4,
      icon: <FaHeadset size={32} />,
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

  

  return (
    <div>
      <HeroSection
        heading="پرداخت هزینه Airbnb با ارزی پلاس در ایران"
        subheading="رزرو آسان و سریع اقامتگاه با Airbnb"
        description="Airbnb با به‌روزرسانی‌های سیاست‌های پرداخت در ژوئن (برای کاربران جدید فوری و قدیمی از سپتامبر)، پلتفرمی برتر برای رزرو اقامتگاه‌های جهانی است، اما تحریم‌های بین‌المللی پرداخت را برای ایرانیان چالش‌برانگیز می‌کند – کارت‌های محلی رد می‌شوند و محدودیت‌های ریسک اعمال می‌گردد. ارزی پلاس (ArziPlus.com) این مشکل را حل می‌کند و پرداخت هزینه Airbnb را بدون کارت اعتباری خارجی، با روش‌های داخلی امن، در عرض چند دقیقه انجام می‌دهد."
        buttons={[
          {
            text: "رزرو اقامتگاه",
            href: "/services/buy-Airbnb",
            variant: "secondary",
            icon: <FaRocket />,
          },
        ]}
        media={{
          type: "image",
          src: "https://arziplus.storage.c2.liara.space/images/pages/35-min.png",
          alt: "پرداخت هزینه Airbnb",
          width: 1200,
          height: 800,
        }}
        layout="default"
        theme={{
          headingColor: "text-gray-50",
          subheadingColor: "text-gray-500",
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
        buttonLink="/services/buy-Airbnb"
        items={whyUsItems}
        theme={themesWhyus.default}
      />

      <HeroSplitSection
        heading="ارزی پلاس، همراه امن پرداخت‌های بین‌المللی شما"
        subHeading="سریع، امن و مطمئن"
        description="پرداخت هزینه رزرو اقامتگاه در Airbnb را بدون دردسر و با چند کلیک انجام دهید."
        buttons={[
          {
            text: "رزرو اقامتگاه",
            href: "/services/buy-Airbnb",
            variant: "green",
            icon: <FaShieldAlt />,
          },
        ]}
        imageSrc="https://arziplus.storage.c2.liara.space/images/pages/every.png"
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
        heading="همین حالا رزرو اقامتگاه خود را انجام بده!"
        description="با ارزی پلاس، پرداخت هزینه Airbnb سریع، امن و آسان است."
        button={{
          text: "رزرو اقامتگاه",
          href: "/dashboard#services",
          variant: "ghost",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.primary}
        height={50}
      />
    </div>
  );
};

export default AirbnbPaymentPage;
