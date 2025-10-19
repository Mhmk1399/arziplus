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

const USVisaPaymentPage = () => {
  const steps = [
    {
      id: "payment",
      title: "پرداخت معادل ریالی",
      description:
        "معادل ریالی هزینه مورد نظر را پرداخت کن و سفارشت نهایی شود.",
      icon: <FaPercent />,
      isActive: true,
    },
    {
      id: "selectService",
      title: "انتخاب خدمت مورد نظر",
      description: "پرداخت هزینه سفارت، SEVIS یا USCIS را انتخاب کن.",
      icon: <FaCoins />,
    },
    {
      id: "register",
      title: "ثبت نام در ارزی پلاس",
      description: "به سادگی حساب کاربری بساز و آماده پرداخت شو.",
      icon: <FaDollarSign />,
      isActive: true,
    },
  ];

  const whyUsItems = [
    {
      id: 1,
      icon: <FaClock size={32} />,
      title: "سرعت بالا",
      description:
        "پرداخت شما در کوتاه‌ترین زمان ممکن توسط کارشناسان ارزی پلاس انجام می‌شود.",
    },
    {
      id: 2,
      icon: <FaLock size={32} />,
      title: "امنیت بالا",
      description: "تمامی تراکنش‌ها با امنیت کاملا بالا و مطمئن انجام می‌شود.",
    },
    {
      id: 3,
      icon: <FaPercent size={32} />,
      title: "قیمت مناسب",
      description:
        "کمترین کارمزد و نرخ منصفانه برای پرداخت ارزی شما انجام میشود..",
    },
    {
      id: 4,
      icon: <FaHeadset size={32} />,
      title: "پشتیبانی حرفه‌ای",
      description:
        "کارشناسان ارزی پلاس در تمام مراحل همراه شما تا آخرین مرحله هستند.",
    },
  ];

  const faqItems = [
    {
      id: "1",
      question:
        "آیا می‌توانم با هر کارت بانکی ایرانی، هزینه تعیین وقت سفارت آمریکا را پرداخت کنم؟",
      answer:
        "خیر، معمولاً نیاز به کارت‌های بین‌المللی مانند مسترکارت یا ویزا کارت است. برای اطلاعات بیشتر با پشتیبانی تماس بگیرید.",
      category: "پرداخت",
    },
    {
      id: "2",
      question:
        "اگر بعد از پرداخت، زمان مصاحبه را تغییر دهم، باید دوباره هزینه پرداخت کنم؟",
      answer:
        "در بسیاری از موارد تغییر زمان بدون نیاز به پرداخت مجدد امکان‌پذیر است، اما بهتر است با سفارت بررسی کنید.",
      category: "پرداخت",
    },
    {
      id: "3",
      question:
        "آیا پرداخت از طریق ارزی پلاس روند صدور ویزا را تحت تأثیر قرار می‌دهد؟",
      answer:
        "خیر، پرداخت از طریق ارزی پلاس یا هر روش دیگر، روی تصمیم‌گیری افسر کنسولی تاثیری ندارد.",
      category: "پرداخت",
    },
    {
      id: "4",
      question:
        "اگر نتوانم در زمان مصاحبه حضور پیدا کنم، هزینه قابل برگشت است؟",
      answer:
        "خیر، هزینه پرداختی قابل برگشت نیست و باید برای رزرو مجدد پرداخت کنید.",
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
        heading="پرداخت هزینه سفارت آمریکا"
        subheading="وقت تحقق رویای آمریکایی توست!"
        description="در سال ۲۰۲۵، با افزایش تحریم‌ها، پرداخت هزینه‌های مهاجرتی آمریکا برای ایرانیان چالش‌برانگیز شده، اما ارزی پلاس (arziPlus.com) راه‌حلی ایده‌آل ارائه می‌دهد. SEVIS I-901 با برای ویزای دانشجویی F-1/M-1/J-1، هزینه‌های USCIS (مانند فرم I-129F       یا I-130       بر اساس به‌روزرسانی H.R.1)، و هزینه ویزای سفارت  را بدون کارت اعتباری بین‌المللی، با کارت شتاب یا رمزارز، در عرض چند دقیقه انجام دهید."
        buttons={[
          {
            text: "پرداخت هزینه سفارت",
            href: "/services/Paying-for-the-American-Embassy",
            variant: "secondary",
            icon: <FaRocket />,
          },
        ]}
        media={{
          type: "image",
          src: "https://arziplus.storage.c2.liara.space/images/pages/31-min.png",
          alt: "پرداخت هزینه سفارت آمریکا",
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
        description="پرداخت هزینه سفارت آمریکا فقط با چند کلیک ساده"
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
        buttonLink="/services/Paying-for-the-American-Embassy"
        items={whyUsItems}
         theme={themesWhyus.dark}
      />

      <HeroSplitSection
        heading="ارزی پلاس، همراه امن پرداخت‌های ارزی شما"
        subHeading="سریع، امن و مطمئن"
        description="با ارزی پلاس، پرداخت هزینه سفارت آمریکا، SEVIS و USCIS را بدون دردسر انجام بده."
        buttons={[
          {
            text: "پرداخت هزینه سفارت",
            href: "/services/Paying-for-the-American-Embassy",
            variant: "green",
            icon: <FaShieldAlt />,
          },
        ]}
        imageSrc="/assets/images/usa-visa-2.webp"
        imageAlt="پرداخت هزینه سفارت آمریکا"
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
        description="پاسخ به متداول‌ترین سوالات درباره پرداخت هزینه‌های سفارت آمریکا"
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
        heading="همین حالا پرداختت را انجام بده!"
        description="با ارزی پلاس، پرداخت هزینه سفارت آمریکا، SEVIS و USCIS سریع، امن و آسان است."
        button={{
          text: "پرداخت هزینه سفارت",
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

export default USVisaPaymentPage;
