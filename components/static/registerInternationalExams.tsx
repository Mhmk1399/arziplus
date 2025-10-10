 
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
  FaRegClipboard,
  FaEnvelope,
  FaRocket,
  FaMedal,
  FaShield,
  FaScrewdriverWrench,
  FaBookOpen,
  FaCircleCheck,
} from "react-icons/fa6";
import HeroSection from "../global/heroSection";
import StepsSection from "../global/stepsSection";
import WhyUsSection from "../global/whyUs";
import HeroSplitSection from "../global/heroSplitSection";
import FAQSection from "../global/faqSection";
import CTABanner from "../global/ctaBanner";

const RegisterInternationalExamsContainer = () => {
  // مزایا
  const examBenefits = [
    {
      id: "fastPayment",
      title: "پرداخت سریع",
      description: "هزینه آزمون شما در کمتر از ۲۴ ساعت کاری پرداخت می‌شود.",
      icon: <FaClock />,
      isActive: true,
    },
    {
      id: "transparentFees",
      title: "کارمزد منصفانه",
      description: "پرداخت‌ها با کارمزدی رقابتی و نرخ شفاف انجام می‌شود.",
      icon: <FaDollarSign />,
    },
    {
      id: "officialPayment",
      title: "پرداخت رسمی",
      description: "مبلغ شما مستقیماً به حساب رسمی مرکز آزمون واریز می‌شود.",
      icon: <FaCircleCheck />,
      isActive: true,
    },
    {
      id: "supportAllExams",
      title: "پشتیبانی از تمام آزمون‌ها",
      description: "از IELTS و TOEFL تا آزمون‌های IT و حرفه‌ای.",
      icon: <FaBookOpen />,
    },
    {
      id: "security",
      title: "امنیت کامل تراکنش‌ها",
      description: "اطلاعات شما با بالاترین سطح امنیتی محافظت می‌شود.",
      icon: <FaLock />,
      isActive: true,
    },
    {
      id: "support247",
      title: "پشتیبانی ۲۴ ساعته",
      description: "تیم ارزی پلاس همیشه پاسخگوی شماست.",
      icon: <FaHeadset />,
    },
  ];

  // کاربردها (انواع آزمون‌ها)
  const examUseCases = [
    {
      id: 1,
      icon: <FaBookOpen size={32} />,
      iconColor: "bg-blue-900",
      title: "آزمون‌های زبان",
      description: "IELTS، TOEFL، PTE Academic و سایر آزمون‌های معتبر.",
    },
    {
      id: 2,
      icon: <FaBookOpen size={32} />,
      iconColor: "bg-blue-900",
      title: "آزمون‌های تحصیلات تکمیلی",
      description: "GRE، GMAT و سایر آزمون‌های ورود به دانشگاه‌ها.",
    },
    {
      id: 3,
      icon: <FaBookOpen size={32} />,
      iconColor: "bg-blue-900",
      title: "آزمون‌های حرفه‌ای و مالی",
      description: "CFA، ACCA و آزمون‌های مشابه.",
    },
    {
      id: 4,
      icon: <FaBookOpen size={32} />,
      iconColor: "bg-blue-900",
      title: "آزمون‌های IT و فنی",
      description: "Cisco، Microsoft، AWS و ده‌ها مورد دیگر.",
    },
  ];

  // مراحل
  const examSteps = [
    {
      id: "step1",
      title: "ثبت درخواست",
      href: "/exams",
      description: "در وب‌سایت ارزی پلاس درخواست پرداخت خود را ثبت کنید.",
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
      title: "ارسال اطلاعات آزمون",
      href: "/exams",
      description: "اطلاعات آزمون و مرکز برگزارکننده را ارسال کنید.",
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
      title: "اعلام مبلغ نهایی",
      href: "/exams",
      description: "مبلغ و نوع ارز پرداختی به شما اعلام خواهد شد.",
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
      title: "پرداخت ریالی",
      href: "/exams",
      description: "هزینه را به‌صورت ریالی پرداخت کنید.",
      icon: <FaDollarSign size={28} />,
      color: {
        bg: "bg-white",
        hover: "hover:bg-blue-100",
        icon: "text-blue-600",
        text: "text-blue-800",
      },
    },
    {
      id: "step5",
      title: "انجام تراکنش و دریافت رسید",
      href: "/exams",
      description: "پرداخت به مرکز آزمون انجام شده و رسید رسمی ارسال می‌شود.",
      icon: <FaRocket size={28} />,
      color: {
        bg: "bg-white",
        hover: "hover:bg-blue-100",
        icon: "text-blue-600",
        text: "text-blue-800",
      },
    },
  ];

  // FAQ
  const examFaqData = [
    {
      id: "1",
      question: "آیا امکان پرداخت به همه مراکز آزمون وجود دارد؟",
      answer:
        "بله، هر مرکزی که پرداخت آنلاین داشته باشد توسط ما پوشش داده می‌شود.",
      category: "عمومی",
    },
    {
      id: "2",
      question: "آیا امکان پرداخت هزینه آزمون در خارج از کشور وجود دارد؟",
      answer:
        "بله، حتی اگر آزمون شما در خارج از ایران برگزار شود، پرداخت انجام می‌شود.",
      category: "مکان آزمون",
    },
    {
      id: "3",
      question: "پرداخت هزینه آزمون چقدر زمان می‌برد؟",
      answer: "در بیشتر موارد پرداخت در کمتر از ۲۴ ساعت کاری انجام می‌شود.",
      category: "زمان",
    },
  ];

  return (
    <div>
      <HeroSection
        heading="پرداخت آسان هزینه آزمون‌های بین‌المللی در ایران با ارزی پلاس"
        subheading="پرداخت هزینه آزمون"
        description="آزمون‌های بین‌المللی مانند IELTS، TOEFL، GRE، GMAT، PTE Academic و بسیاری از آزمون‌های تخصصی و حرفه‌ای، کلید ورود به دانشگاه‌ها، مهاجرت تحصیلی و پیشرفت شغلی هستند. اما به دلیل تحریم‌ها و محدودیت‌های بانکی، پرداخت هزینه ثبت‌نام این آزمون‌ها برای ایرانیان چالش‌برانگیز است.
با خدمات سریع و امن ارزی پلاس، می‌توانید هزینه آزمون خود را در کوتاه‌ترین زمان و با کارمزدی منصفانه پرداخت کنید و بدون دغدغه در آزمون ثبت‌نام شوید."
        buttons={[
          {
            text: "ثبت سفارش پرداخت آزمون",
            href: "/exams",
            variant: "secondary",
            icon: <FaRocket />,
          },
        ]}
        media={{
          type: "image",
          src: "/assets/images/RegisterInternationalExams.avif",
          alt: "پرداخت هزینه آزمون‌های بین‌المللی",
          width: 1200,
          height: 800,
        }}
        layout="default"
        theme={{
          headingColor: "text-gray-200",
          subheadingColor: "text-gray-700",
          descriptionColor: "text-gray-200",
          backgroundColor: "bg-blue-600",
        }}
      />

      <StepsSection
        heading="مزایای پرداخت هزینه آزمون با ارزی پلاس"
        description="چرا داوطلبان آزمون‌های بین‌المللی، ارزی پلاس را انتخاب می‌کنند:"
        steps={examBenefits}
        theme={stepThemes.dark}
        layout="vertical"
        boxShape="rounded"
        boxSize="sm"
        showNumbers={true}
        animated={true}
        showIcons={true}
      />

      <WhyUsSection
        heading="آزمون‌هایی که پرداخت آن‌ها با ارزی پلاس امکان‌پذیر است"
        description="با خدمات ما، هزینه ثبت‌نام آزمون‌های مختلف بین‌المللی خود را بپردازید:"
        buttonText="ثبت سفارش"
        buttonLink="/exams"
        items={examUseCases}
        buttonColor="bg-blue-800 hover:bg-blue-900 text-white"
        theme={themesWhyus.default}
      />

   

      <HeroSplitSection
        heading="چرا ارزی پلاس؟"
        subHeading="امنیت و تجربه حرفه‌ای در خدمات پرداخت آزمون‌ها"
        description="با چندین سال تجربهمئن‌ترین گزینه برای شماست."
        buttons={[
          {
            text: "ثبت سفارش پرداخت آزمون",
            href: "/exams",
            variant: "primary",
            icon: <FaShield />,
          },
        ]}
        imageSrc="/assets/images/RegisterInternationalExams.avif"
        imageAlt="پرداخت هزینه آزمون‌های بین‌المللی"
        theme={splitSectionThemes.dark}
        layout="image-left"
        imageWidth="1/2"
        features={[
          {
            id: 1,
            title: "تجربه حرفه‌ای",
            description: "چندین سال تجربه در پرداخت هزینه آزمون‌ها.",
            icon: <FaMedal />,
          },
          {
            id: 2,
            title: "امنیت کامل اطلاعات",
            description: "تضمین امنیت تراکنش‌ها و اطلاعات شما.",
            icon: <FaLock />,
          },
          {
            id: 3,
            title: "پوشش کامل آزمون‌ها",
            description: "از آزمون‌های زبان تا آزمون‌های IT و مالی.",
            icon: <FaScrewdriverWrench />,
          },
          {
            id: 4,
            title: "پشتیبانی ۲۴ ساعته",
            description: "تیم پشتیبانی همیشه همراه شماست.",
            icon: <FaHeadset />,
          },
        ]}
      />

      <FAQSection
        heading="سؤالات متداول"
        description="پاسخ به پرسش‌های پرتکرار داوطلبان آزمون‌های بین‌المللی"
        svgIcon={<FaBookOpen />}
        faqItems={examFaqData}
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
        heading="همین حالا هزینه آزمون بین‌المللی خود را با ارزی پلاس پرداخت کنید!"
        description="با خیال راحت در آزمون ثبت‌نام شوید و دغدغه پرداخت نداشته باشید."
        button={{
          text: "ثبت سفارش پرداخت آزمون",
          href: "/exams",
          variant: "primary",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.primary}
        height={50}
      />
    </div>
  );
};

export default RegisterInternationalExamsContainer;
