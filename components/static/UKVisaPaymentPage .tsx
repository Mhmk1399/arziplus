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
      description: "پرداخت هزینه سفارت انگلیس را انتخاب کن.",
      icon: <FaCoins />,
    },
    {
      id: "register",
      title: "ثبت نام در ارزی پلاس",
      description: "به راحتی حساب کاربری بساز و آماده پرداخت شو.",
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
        "پرداخت شما در کوتاه‌ترین زمان ممکن توسط ارزی پلاس انجام می‌شود.",
    },
    {
      id: 2,
      icon: <FaLock size={32} />,
      title: "امنیت بالا",
      description: "تمامی تراکنش‌ها با امنیت کامل از حساب مطمئن انجام می‌شود.",
    },
    {
      id: 3,
      icon: <FaPercent size={32} />,
      title: "قیمت مناسب",
      description: "کمترین کارمزد و نرخ منصفان در ارزی پلاس برای پرداخت ارزیت.",
    },
    {
      id: 4,
      icon: <FaHeadset size={32} />,
      title: "پشتیبانی حرفه‌ای",
      description: "کارشناسان ما در تمام مراحل در کنار شما و همراه شما هستند.",
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

  return (
    <div>
      <HeroSection
        heading="پرداخت هزینه سفارت انگلیس"
        subheading="زندگی در انگلیس تجربه‌ای که ارزشش را دارد..."
        description="فرآیند تعیین وقت سفارت انگلیس برای ویزاهای توریستی، تحصیلی یا کاری، از طریق پلتفرم VFS Global و سایت Gov.uk، با به‌روزرسانی‌های اخیر پرداخت، ساده‌تر شده است. از ۱۶ آگوست ۲۰۲۵، روش‌های پرداخت برای متقاضیان ایرانی بهبود یافته، اما تحریم‌ها همچنان چالش ایجاد می‌کند. ارزی پلاس (arziPlus.com) این مشکل را حل می‌کند و پرداخت هزینه تعیین وقت را بدون نیاز به کارت اعتباری بین‌المللی، با روش‌های امن داخلی، در عرض چند دقیقه انجام می‌دهد."
        buttons={[
          {
            text: "پرداخت هزینه سفارت",
            href: "/services/Paying-for-the-england-Embassy",
            variant: "secondary",
            icon: <FaRocket />,
          },
        ]}
        media={{
          type: "image",
          src: "https://arziplus.storage.c2.liara.space/images/pages/32-min.png",
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
        buttonLink="/services/Paying-for-the-england-Embassy"
        items={whyUsItems}
        theme={themesWhyus.default}
      />

      <HeroSplitSection
        heading="ارزی پلاس، همراه امن پرداخت‌های بین‌المللی شما"
        subHeading="سریع، امن و مطمئن"
        description="پرداخت هزینه سفارت انگلیس را بدون دردسر و با چند کلیک انجام دهید."
        buttons={[
          {
            text: "پرداخت هزینه سفارت",
            href: "/services/Paying-for-the-england-Embassy",
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
        description="با ارزی پلاس، پرداخت هزینه سفارت انگلیس سریع، امن و آسان است."
        button={{
          text: "پرداخت هزینه سفارت",
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

export default UKVisaPaymentPage;
