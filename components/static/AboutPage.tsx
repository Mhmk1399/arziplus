import HeroSection from "../global/heroSection";
import { FaExplosion } from "react-icons/fa6";
import StepsSection from "../global/stepsSection";
import {
  ctaThemes,
  faqThemes,
  stepThemes,
  textBoxThemes,
  textBoxTypography,
  themesWhyus,
  
} from "@/lib/theme";
import {
  FaHeadset,
  FaDollarSign,
  FaRegClipboard,
  FaEnvelope,
  FaRocket,
  FaShieldAlt,
  FaGlobe,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";
import WhyUsSection from "../global/whyUs";
import FAQSection from "../global/faqSection";
import CTABanner from "../global/ctaBanner";
import TextBox from "../global/textBox";

const AboutPage = () => {
  const aboutSteps = [
    {
      id: "foundation",
      title: "بنیان‌گذاری ارزی پلاس",
      description:
        "با بیش از 7 سال تجربه در خدمات پرداخت‌های بین‌المللی، ارزی پلاس در سال 2018 تأسیس شد تا موانع ارزی را برای کاربران ایرانی برطرف کند.",
      icon: <FaRegClipboard />,
      isActive: true,
    },
    {
      id: "growth",
      title: "رشد و گسترش خدمات",
      description:
        "از پرداخت شهریه دانشگاه تا افتتاح حساب Upwork و شارژ سیم‌کارت‌های خارجی، خدمات ما به هزاران کاربر کمک کرده تا به اهداف جهانی برسند.",
      icon: <FaDollarSign />,
    },
    {
      id: "future",
      title: "آینده ارزی پلاس",
      description:
        "با تمرکز بر نوآوری‌های 2025، مانند API پرداخت‌های AI-driven و وریفای دیجیتال، ارزی پلاس همراه مطمئن شما برای دنیای دیجیتال است.",
      icon: <FaRocket />,
      isActive: true,
    },
  ];

  const aboutWhyUs = [
    {
      id: 1,
      icon: <FaGlobe size={32} />,
      iconColor: "bg-emerald-700",
      title: "پوشش جهانی",
      description:
        "خدمات پرداخت و وریفای از بیش از 50 کشور، با تمرکز بر انگلیس، آلمان، مالزی و استونی برای کاربران ایرانی.",
    },
    {
      id: 2,
      icon: <FaShieldAlt size={32} />,
      iconColor: "bg-emerald-700",
      title: "امنیت حداکثری",
      description:
        "تمام تراکنش‌ها با رمزنگاری SSL و 2FA، بدون ذخیره اطلاعات حساس کاربران.",
    },
    {
      id: 3,
      icon: <FaHeadset size={32} />,
      iconColor: "bg-emerald-700",
      title: "پشتیبانی 24/7",
      description:
        "تیم متخصص 24 ساعته آماده پاسخگویی از چت آنلاین تا مشاوره تلفنی.",
    },
    {
      id: 4,
      icon: <FaUsers size={32} />,
      iconColor: "bg-emerald-700",
      title: "جامعه کاربران",
      description:
        "بیش از 10,000 کاربر راضی، با نظرات واقعی و داستان‌های موفقیت در وبلاگ ارزی پلاس.",
    },
    {
      id: 5,
      icon: <FaCheckCircle size={32} />,
      iconColor: "bg-emerald-700",
      title: "رشد پایدار",
      description:
        "رشد 150% سالانه، با گواهینامه‌های ISO 27001 برای امنیت اطلاعات.",
    },
  ];

  const aboutFaq = [
    {
      id: "1",
      question: "ارزی پلاس چیست؟",
      answer:
        "ارزی پلاس پلتفرمی برای خدمات پرداخت بین‌المللی، افتتاح حساب، سیم‌کارت‌های خارجی و مدارک وریفای است، با تمرکز بر کاربران ایرانی.",
      category: "درباره ما",
    },
    {
      id: "2",
      question: "چرا ارزی پلاس را انتخاب کنیم؟",
      answer:
        "با 7+ سال تجربه، نرخ‌های رقابتی، امنیت بالا و پشتیبانی سریع، ارزی پلاس موانع ارزی را برمی‌دارد.",
      category: "مزایا",
    },
    {
      id: "3",
      question: "ارزی پلاس کجا فعالیت می‌کند؟",
      answer:
        "خدمات جهانی با تمرکز بر اروپا و آسیا، از انگلیس و آلمان تا مالزی و استونی.",
      category: "پوشش",
    },
  ];

  return (
    <div>
      <HeroSection
        heading="درباره ارزی پلاس"
        subheading="همراه مطمئن شما در دنیای پرداخت‌های بین‌المللی"
        description="ارزی پلاس با بیش از 7 سال تجربه، خدمات پرداخت ارزی، افتتاح حساب، سیم‌کارت‌های خارجی و مدارک وریفای را برای کاربران ایرانی فراهم می‌کند. ما موانع تحریم‌ها را برمی‌داریم تا به اهداف جهانی‌تان برسید."
        buttons={[
          {
            text: "شروع همکاری",
            href: "/register",
            variant: "primary",
            icon: <FaExplosion />,
          },
        ]}
        media={{
          type: "image",
          src: "/assets/images/about-us.webp",
          alt: "درباره ارزی پلاس",
          width: 1200,
          height: 800,
        }}
        layout="default"
        theme={{
          headingColor: "text-gray-50",
          subheadingColor: "text-gray-700",
          descriptionColor: "text-gray-200",
          backgroundColor: "#0A1D37",
          bgSubHeadingColor: "#FF7A00",
        }}
      />

      <StepsSection
        heading="داستان ارزی پلاس"
        description="از بنیان‌گذاری تا گسترش خدمات، ارزی پلاس همیشه در کنار شما بوده است."
        steps={aboutSteps}
        theme={stepThemes.default}
        layout="vertical"
        boxShape="rounded"
        boxSize="sm"
        showNumbers={true}
        animated={true}
        interactive={false}
        showIcons={true}
      />

      <WhyUsSection
        heading="چرا ارزی پلاس؟"
        description="ویژگی‌های منحصربه‌فرد ما که ما را متفاوت می‌کند."
        buttonText="تماس با ما"
        buttonLink="/contact"
        items={aboutWhyUs}
        buttonColor="#0A1D37 hover:bg-indigo-800 text-white"
        theme={themesWhyus.default}
      />

      <TextBox
        heading="مأموریت ارزی پلاس"
        content="ارزی پلاس متعهد به فراهم کردن دسترسی آسان به خدمات جهانی است. با تمرکز بر امنیت، سرعت و شفافیت، ما پلی بین کاربران ایرانی و دنیای دیجیتال می‌سازیم. از پرداخت شهریه تا وریفای حساب، هر خدمتی با استانداردهای بین‌المللی ارائه می‌شود."
        height={300}
        theme={textBoxThemes.default}
        typography={textBoxTypography.medium}
        spacing={{
          padding: "p-8",
          gap: "space-y-6",
        }}
        style={{
          rounded: true,
          shadow: true,
          border: true,
        }}
      />

      <FAQSection
        heading="سوالات متداول درباره ارزی پلاس"
        description="پاسخ به سوالات رایج کاربران ما."
        faqItems={aboutFaq}
        buttons={[
          {
            text: "سوالات بیشتر",
            href: "/faq",
            variant: "outline",
            icon: <FaEnvelope />,
          },
        ]}
        theme={faqThemes.dark}
        layout="default"
        showCategories={true}
        searchable={true}
        animate={true}
      />

      <CTABanner
        heading="آماده همکاری با ارزی پلاس هستید؟"
        description="با ما تماس بگیرید و خدمات سفارشی را دریافت کنید. ارزی پلاس، شریک قابل اعتماد شما در پرداخت‌های جهانی."
        button={{
          text: "تماس بگیرید",
          href: "/contact",
          variant: "primary",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.primary}
        height={50}
      />
    </div>
  );
};

export default AboutPage;
