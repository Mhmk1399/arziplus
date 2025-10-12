import HeroSection from "../global/heroSection";
import { FaExplosion } from "react-icons/fa6";
import StepsSection from "../global/stepsSection";
import SmoothTimeline from "../global/scrollTimeline";
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
  FaCreditCard,
  FaGraduationCap,
  FaUserCheck,
  FaGift,
  FaBuilding,
  FaBitcoin,
  FaSimCard,
  FaPlane,
} from "react-icons/fa";
import WhyUsSection from "../global/whyUs";
import FAQSection from "../global/faqSection";
import CTABanner from "../global/ctaBanner";
import TextBox from "../global/textBox";
import { FaClock } from "react-icons/fa";

const AboutPage = () => {
  const missionSteps = [
    {
      id: 1,
      title: "حذف محدودیت‌ها",
      desc: " ",
    },
    {
      id: 2,
      title: "دسترسی آسان و سریع",
      desc: " ",
    },
    {
      id: 3,
      title: "امکانات مالی جهانی",
      desc: " ",
    },
  ];

  const servicesData = [
    {
      id: 1,
      icon: <FaCreditCard size={32} />,
      iconColor: "bg-emerald-700",
      title: "افتتاح حساب‌های بین‌المللی",
      description:
        "Wise، PayPal، Skrill، Payoneer و سایر پلتفرم‌های معتبر مالی",
    },
    {
      id: 2,
      icon: <FaGraduationCap size={32} />,
      iconColor: "bg-blue-700",
      title: "پرداخت آزمون‌های بین‌المللی",
      description: "IELTS، TOEFL، GRE، Duolingo و سایر آزمون‌های معتبر",
    },
    {
      id: 3,
      icon: <FaUserCheck size={32} />,
      iconColor: "bg-purple-700",
      title: "احراز هویت فریلنسینگ",
      description: "Upwork، Fiverr، Freelancer، Prop Firms و پلتفرم‌های کاری",
    },
    {
      id: 4,
      icon: <FaGift size={32} />,
      iconColor: "bg-orange-700",
      title: "ووچر و گیفت کارت",
      description: "Google Play، Steam، Apple، Binance و سایر پلتفرم‌ها",
    },
    {
      id: 5,
      icon: <FaBuilding size={32} />,
      iconColor: "bg-indigo-700",
      title: "ثبت شرکت بین‌المللی",
      description: "انگلستان، امارات، استونی و سایر کشورهای معتبر",
    },
    {
      id: 6,
      icon: <FaBitcoin size={32} />,
      iconColor: "bg-yellow-600",
      title: "خرید و فروش رمزارز",
      description: "تبدیل ارز دیجیتال به ریال و بالعکس با بهترین نرخ‌ها",
    },
    {
      id: 7,
      icon: <FaSimCard size={32} />,
      iconColor: "bg-green-700",
      title: "سیم‌کارت بین‌المللی",
      description: "انگلستان، آلمان، مالزی و سایر کشورها",
    },
    {
      id: 8,
      icon: <FaPlane size={32} />,
      iconColor: "bg-red-700",
      title: "خدمات گردشگری",
      description: "پرداخت بلیط، رزرو هتل و سرویس‌های سفر بین‌المللی",
    },
  ];

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
      icon: <FaShieldAlt size={32} />,
      iconColor: "bg-emerald-700",
      title: "امنیت بالا و کارمزد منصفانه",
      description:
        "تمام تراکنش‌ها از طریق کانال‌های مطمئن و با کمترین کارمزد ممکن انجام می‌شوند.",
    },
    {
      id: 2,
      icon: <FaClock size={32} />,
      iconColor: "bg-blue-700",
      title: "سرعت و سادگی در انجام خدمات",
      description:
        "از ثبت سفارش تا انجام پرداخت، همه‌چیز در کوتاه‌ترین زمان ممکن انجام می‌شود.",
    },
    {
      id: 3,
      icon: <FaHeadset size={32} />,
      iconColor: "bg-purple-700",
      title: "پشتیبانی واقعی و متخصص",
      description:
        "تیم ارزی پلاس همیشه در کنار شماست تا پاسخ‌گوی تمام سوالات و نیازهای شما باشد.",
    },
    {
      id: 4,
      icon: <FaGlobe size={32} />,
      iconColor: "bg-orange-700",
      title: "پوشش کامل خدمات مالی جهانی",
      description:
        "فرقی ندارد فریلنسر باشید، دانشجو یا تاجر — هر نوع نیاز ارزی خود را در یک پلتفرم پیدا می‌کنید.",
    },
    {
      id: 5,
      icon: <FaCheckCircle size={32} />,
      iconColor: "bg-indigo-700",
      title: "شفافیت کامل در نرخ‌ها",
      description:
        "تمام هزینه‌ها پیش از پرداخت به شما اعلام می‌شود، بدون هیچ کارمزد پنهان.",
    },
  ];

  const targetAudience = [
    {
      id: 1,
      icon: <FaUsers size={32} />,
      iconColor: "bg-emerald-700",
      title: "فریلنسرها و دورکاران بین‌المللی",
      description: "دریافت پرداخت از پلتفرم‌های جهانی و احراز هویت حساب‌ها",
    },
    {
      id: 2,
      icon: <FaGraduationCap size={32} />,
      iconColor: "bg-blue-700",
      title: "دانشجویان متقاضی تحصیل خارج",
      description: "پرداخت شهریه، آزمون‌ها و هزینه‌های تحصیلی",
    },
    {
      id: 3,
      icon: <FaBuilding size={32} />,
      iconColor: "bg-purple-700",
      title: "تجار و واردکنندگان",
      description: "پرداخت‌های تجاری و خدمات مالی بین‌المللی",
    },
    {
      id: 4,
      icon: <FaBitcoin size={32} />,
      iconColor: "bg-yellow-600",
      title: "تریدرها و فعالان رمزارز",
      description: "خرید، فروش و تبدیل ارزهای دیجیتال",
    },
    {
      id: 5,
      icon: <FaGift size={32} />,
      iconColor: "bg-red-700",
      title: "علاقه‌مندان خرید خارجی",
      description: "خرید از سایت‌های خارجی و پلتفرم‌های بین‌المللی",
    },
  ];

  const aboutFaq = [
    {
      id: "1",
      question: "ارزی پلاس چیست؟",
      answer:
        "ارزی پلاس درگاه امن پرداخت‌های بین‌المللی برای ایرانیان است که خدمات جامعی از افتتاح حساب تا پرداخت‌های بین‌المللی ارائه می‌دهد.",
      category: "درباره ما",
    },
    {
      id: "2",
      question: "چه خدماتی ارائه می‌دهید؟",
      answer:
        "افتتاح حساب‌های بین‌المللی، پرداخت آزمون‌ها، احراز هویت فریلنسینگ، خرید ووچر، ثبت شرکت، خرید و فروش رمزارز، سیم‌کارت بین‌المللی و خدمات گردشگری.",
      category: "خدمات",
    },
    {
      id: "3",
      question: "چرا ارزی پلاس را انتخاب کنیم؟",
      answer:
        "امنیت بالا، کارمزد منصفانه، سرعت در انجام خدمات، پشتیبانی متخصص، پوشش کامل خدمات و شفافیت کامل در نرخ‌ها.",
      category: "مزایا",
    },
    {
      id: "4",
      question: "چشم‌انداز ارزی پلاس چیست؟",
      answer:
        "تبدیل شدن به بزرگ‌ترین و معتبرترین اکوسیستم خدمات ارزی و مالی ایرانیان در سطح بین‌المللی، با اقتصاد دیجیتال بدون مرز.",
      category: "آینده",
    },
    {
      id: "5",
      question: "مخاطبان ارزی پلاس چه کسانی هستند؟",
      answer:
        "فریلنسرها، دانشجویان، تجار، تریدرها و تمام کسانی که نیاز به خدمات مالی بین‌المللی دارند.",
      category: "مخاطبان",
    },
  ];

  return (
    <div>
      <HeroSection
        heading="ارزی پلاس؛ درگاه امن پرداخت‌های بین‌المللی برای ایرانیان"
        subheading="همراه مطمئن شما در دنیای پرداخت‌های بین‌المللی"
        description=" در دنیایی که همه‌چیز به‌صورت جهانی و دیجیتال پیش می‌رود، نیاز به خدمات مالی بین‌المللی بیش از هر زمان دیگری احساس می‌شود.
اما تحریم‌ها و محدودیت‌های بانکی باعث شده‌اند کاربران ایرانی در انجام پرداخت‌ها، خریدهای خارجی یا نقد کردن درآمدهای ارزی با چالش‌های جدی روبه‌رو شوند.
اینجاست که ارزی پلاس متولد شد — پلی مطمئن میان کاربران ایرانی و دنیای پرداخت‌های بین‌المللی."
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
          src: "https://arziplus.s3.eu-north-1.amazonaws.com/Desktop/52-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQRMW2TZ6Q%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T110544Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRzBFAiAJOhJC3JqmqcFU5dcvkdwLgAEaNn%2Fp%2BkjRPEkNcM2YDAIhANi6e7OwDchX6FqVPHT0vuqSz7us5m8VMwioA7CK0aWUKtYCCCwQABoMMzExMzc2MTIwMjI1IgxP633J5pDI4XxhSeEqswIzYraBsy5zXpg7jCRz8VLx6bPbY5r1qO86s9ps%2F%2BoRleN9uwWVxX9YFWpLfJeirzOZFx%2F5TVXgLJM1mJ1O3rF4Zm7V%2BS9hntmXP0w%2Fo4MOB9hl8O8%2BVhUn1B9wpEOgOX38cgilM0JCjV3JpWqX543AeWKT%2FWdU4SaMZ3u%2BX2ACEpWpgzyZeKg9nWL7cKQKZzdoS2jVNNR8iwvpkqoKINdH%2F8%2B6Y9rZIjxwd5wprpD2Duldf3P10Tgun%2FUI9hl6Rzyy%2FMhjz41vx1uc%2FOghReDLNqYmwf3VRVxihpYrOAEs%2FgyyMc0jJRGKvF0BQeJIsi2eyc5VGlL5SOI3ZqYTE5NREG%2Fv8muF%2Br8S%2B609Uz7KAlWRFnNPZE%2Bi6UQ5ogDV6JdK500jD0gPlArCbyEFJdx8VsnsMJLyrccGOq0C9E4GpJioSb%2BJ%2B4%2FmcnZ3gAd4eue%2BYMBm0exsKfHjClWHE4sbwuYW3KBxyoYgwVm3SnWJhOoUcuzOPWVoKT7TJ9oTO9IxGUK0%2BacsN128nA%2FL3J2Aej1XWb93VeXLc8QFBA9Z7pCbLRsAR4gcrVyeWcqGmxdNzyFgb0ZXFxluRDlR7RifyuSFatH4zbKlw%2FJYf1QnoHft6KjKWiu2wj7LAWro8nWBskrU5WMZR2GgJUBUYuxGf35SwE2k2Pnks32NjnxhI4H%2FUkMQL5pLHeVCadcSDghYPyQv5IWLp5hLSTt85udsTwTohv6IeQOXJpxwBoNriB%2BEl4gtsOScZsFTpg0KL4ZWROBCkFBCnexGLJKRqt2avRcKs4nN0gYYTUxjRsB4mVzRtEWHbB58Tw%3D%3D&X-Amz-Signature=d53042402edc99e1e629a3b2197a03e1342374594a73f1a8f812ef5382fd4bee&X-Amz-SignedHeaders=host&response-content-disposition=inline",
          alt: "درباره ارزی پلاس",
          width: 2000,
          height: 1200,
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

      <SmoothTimeline
        title="💳 مأموریت ما"
        subtitle="هدف ارزی پلاس ساده است: حذف محدودیت‌ها و فراهم کردن دسترسی آسان، سریع و قانونی به خدمات ارزی جهانی برای ایرانیان."
        steps={missionSteps}
        compact={false}
      />

      <WhyUsSection
        heading="🌍 خدمات ارزی پلاس"
        description="ارزی پلاس یک پلتفرم جامع خدمات ارزی و بین‌المللی است که با پشتیبانی تخصصی و سیستم امن پرداخت، امکانات زیر را ارائه می‌دهد:"
        buttonText="مشاهده تمام خدمات"
        buttonLink="/services"
        items={servicesData}
        buttonColor="#0A1D37 hover:bg-indigo-800 text-white"
        theme={themesWhyus.default}
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
        heading="⚙️ چرا ارزی پلاس را انتخاب کنیم؟"
        description="ویژگی‌های منحصربه‌فرد ما که ما را متفاوت می‌کند."
        buttonText="تماس با ما"
        buttonLink="/contact"
        items={aboutWhyUs}
        buttonColor="#0A1D37 hover:bg-indigo-800 text-white"
        theme={themesWhyus.default}
      />

      <WhyUsSection
        heading="👥 مخاطبان ما"
        description="ارزی پلاس برای تمام کسانی که نیاز به خدمات مالی بین‌المللی دارند، طراحی شده است."
        buttonText="عضویت در ارزی پلاس"
        buttonLink="/register"
        items={targetAudience}
        buttonColor="#0A1D37 hover:bg-indigo-800 text-white"
        theme={themesWhyus.default}
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
