import HeroSection from "../global/heroSection";
import { FaExplosion } from "react-icons/fa6";
import StepsSection from "../global/stepsSection";
import {
  ctaThemes,
  faqThemes,
  splitSectionThemes,
  stepThemes,
  themesWhyus,
} from "@/lib/theme";
import {
  FaHeadset,
  FaDollarSign,
  FaMoneyBillWave,
  FaRegClipboard,
  FaEnvelope,
  FaRocket,
  FaShieldAlt,
  FaGlobe,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import WhyUsSection from "../global/whyUs";
import FAQSection from "../global/faqSection";
import CTABanner from "../global/ctaBanner";
import { FaMedal, FaLock } from "react-icons/fa";
import HeroSplitSection from "../global/heroSplitSection";
import { FaSimCard } from "react-icons/fa";

const MalaysianSimCard = () => {
  const simSteps = [
    {
      id: "activation",
      title: "قدم چهارم: فعال سازی سیمکارت",
      description:
        "ظرف چند ساعت سیمکارت شما فعال و کمتر از یک هفته به آدرس شما در ایران تحویل داده میشود، همراه با راهنمایی برای recharge اولیه.",
      icon: <FaRocket />,
    },
    {
      id: "payment",
      title: "قدم سوم: پرداخت",
      description:
        "هزینه سفارش را از طریق شماره حساب سایت پرداخت نمایید، با گزینه‌های امن و شفاف برای پلن‌های prepaid.",
      icon: <FaMoneyBillWave />,
      isActive: true,
    },
    {
      id: "request",
      title: "قدم دوم: ثبت درخواست",
      description:
        "درخواست خود را از طریق فرم ثبت سفارش ارسال کنید، با انتخاب اپراتور Celcom یا XOX و جزئیات پلن مورد نظر.",
      icon: <FaDollarSign />,
    },
    {
      id: "membership",
      title: "قدم اول: عضویت در سایت",
      description:
        "حساب کاربری خود را درسایت ارزی پلاس ایجاد کنید و اطلاعات اولیه را برای سفارشی‌سازی سیمکارت وارد نمایید.",
      icon: <FaRegClipboard />,
      isActive: true,
    },
  ];

  const simWhyUs = [
    {
      id: 1,
      icon: <FaGlobe size={32} />,
      title: "سیمکارت های مالزی",
      description:
        "سیمکارت‌های Celcom و XOX با آنتن‌دهی قوی در ایران، ویژه وریفای حساب‌های بانکی و اکانت‌های بین‌المللی. به‌صورت فیزیکی و به نام متقاضی صادر شده و با قابلیت پیام‌رسانی بین‌المللی از سپتامبر ۲۰۲۵ فعال هستند.",
    },
    {
      id: 2,
      icon: <FaPhone size={32} />,
      title: "سیمکارت های Celcom",
      description:
        "سیمکارت اعتباری بدون تاریخ انقضا، با الزام شارژ هر ۴ هفته. فعال در ایران از طریق شبکه رایتل برای پیام و تماس بین‌المللی. پلن Biru: ‌۳GB پرسرعت + اینترنت نامحدود ۱Mbps برای ۷ روز.",
    },
    {
      id: 3,
      icon: <FaPhone size={32} />,
      title: "سیمکارت های XOX",
      description:
        "سیمکارت دائمی با نیاز به شارژ هر ۱۰۰ روز، متصل به شبکه رایتل در ایران. مناسب برای ثبت‌نام پلتفرم‌های بین‌المللی با طرح ONE-X: تماس و دیتای نامحدود از RM18 در ماه و اعتبار یک‌ساله.",
    },
    {
      id: 4,
      icon: <FaMapMarkerAlt size={32} />,
      title: "مقایسه     Celcom و XOX",
      description:
        "Celcom اعتباری و نیازمند شارژ هر ۴ هفته، XOX دائمی با دوره ۱۰۰ روزه. هر دو مناسب برای ثبت‌نام و وریفای بین‌المللی با قابلیت تماس و پیام در ایران از طریق شبکه رایتل.",
    },
    {
      id: 5,
      icon: <FaShieldAlt size={32} />,
      title: "نمایندگی ارزی پلاس",
      description:
        "ارزی پلاس با بیش از 10 سال فعالیت در مالزی، نماینده رسمی Celcom و XOX است، با صدور فیزیکی به نام متقاضی و ارسال ایمن به ایران.",
    },
  ];

  const simFaq = [
    {
      id: "1",
      question: "آیا سیمکارت ها واقعی هستند؟",
      answer:
        "بله، سیمکارت ها به صورت فیزیکی هستند و به نام متقاضی فعال و به آدرس شما در ایران ارسال میشوند. Celcom و XOX prepaid SIMs فیزیکی با validity طولانی و roaming international",
      category: "واقعی بودن",
    },
    {
      id: "2",
      question: "تفاوت سیمکارت های مجازی و فیزیکی چیست؟",
      answer:
        "سیمکارت های مجازی وجود خارجی نداشته و صرفا شماره میباشد که امکان تماس ندارند، همچنین احتمال از دست دادن شماره سیمکارت هم وجود دارد. سیمکارت های فیزیکی با مشخصات متقاضی فعال و با شماره ثایت در اختیار وی قرار میگیرد. فیزیکی: تماس/SMS واقعی، مجازی: فقط SMS موقت.",
      category: "تفاوت مجازی/فیزیکی",
    },
    {
      id: "3",
      question: "آیا این سیمکارت ها تاریخ انقضا دارند؟",
      answer:
        "خیر، این سیمکارت ها تاریخ انقضا ندارند و فقط لازم است که هر 4 هفته یک بار شارژ شوند تا غیرفعال نشوند. Celcom: هر 4 weeks, XOX: هر 100 days برای حفظ فعال ماندن",
      category: "تاریخ انقضا",
    },
  ];

  return (
    <div>
      <HeroSection
        heading="سیمکارت مالزی   ارزی پلاس نماینده اپراتور سلکام و XOX مالزی"
        subheading="سیمکارت مالزی"
        description="مجموعه ارزی پلاس با بیش از 10 سال فعالیت در کشور مالزی با توافقات صورت گرفته توانسته است به عنوان نماینده اپراتورهای سلکام و XOX مالزی در این کشور فعالیت کند. سیمکارت‌های Celcom و XOX با پوشش 5G و roaming international، ایده‌آل برای verification در 2025. سیمکارت های مالزی آنتن دهی مناسبی در ایران داشته و گزینه مناسبی برای افرادی که به شماره تماس بین المللی جهت وریفای حساب های بانکی و وریفای اکانت ها در سایر وب سایت ها نیاز دارند می‌باشد."
        buttons={[
          {
            text: "خرید سیمکارت مالزی",
            href: "/services/MalaysianSimCard",
            variant: "secondary",
            icon: <FaExplosion />,
          },
        ]}
        media={{
          type: "image",
          src: "https://arziplus.storage.c2.liara.space/images/pages/42-min.png",
          alt: "سیمکارت مالزی Celcom و XOX با ارزی پلاس",
          width: 1200,
          height: 800,
        }}
        layout="default"
        theme={{
          headingColor: "text-gray-50",
          subheadingColor: "text-gray-500",
          descriptionColor: "text-gray-200",
          backgroundColor: "bg-indigo-700",
          bgSubHeadingColor: "bg-fuchsia-50",
        }}
      />

      <StepsSection
        heading="چهار قدم تا دریافت سیمکارت فیزیکی مالزی"
        description="با ارزی پلاس، فرآیند خرید و فعال‌سازی سیمکارت مالزی ساده و سریع است."
        steps={simSteps}
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
        heading="سیمکارت های مالزی"
        description="سیمکارت های اپراتور Celcom و XOX مالزی دارای آنتن دهی مناسب در مراکز استان‌های ایران می‌باشند. این سیمکارت ها برای وریفای حساب های بانکی و وریفای اکانت به عنوان شهروند مالزی استفاده ویژه ای دارند. سیمکارت های مالزی به صورت فیزیکی و به نام متقاضی صادر می‌شود و به به آدرس متقاضی در ایران ارسال می شود. قابلیت ارسال و دریافت پیام‌های بین المللی."
        buttonText="خرید سیمکارت"
        buttonLink="/services/MalaysianSimCard"
        items={simWhyUs}
        buttonColor="bg-indigo-700 hover:bg-indigo-800 text-white"
        theme={themesWhyus.default}
      />

      <HeroSplitSection
        heading="چرا ارزی پلاس؟"
        subHeading="سابقه، امنیت و پشتیبانی حرفه‌ای"
        description="ارزی پلاس با سابقه چندین ساله، تضمین امنیت تراکنش‌ها و نرخ رقابتی، بهترین گزینه برای نقد کردن پی‌پال است."
        buttons={[
          {
            text: "خرید سیم کارت مالزی",
            href: "/services/MalaysianSimCard",
            variant: "secondary",
            icon: <FaSimCard />,
          },
        ]}
        imageSrc="/assets/images/cash-paypal-2.webp"
        imageAlt="ارزی پلاس"
        theme={splitSectionThemes.dark}
        layout="image-left"
        imageWidth="1/2"
        features={[
          {
            id: 1,
            title: "تجربه چندین ساله",
            description:
              "ارزی پلاس با سابقه چندین ساله بهترین خدمات نقد کردن پی‌پال را ارائه می‌دهد.",
            icon: <FaMedal />,
          },
          {
            id: 2,
            title: "امنیت کامل تراکنش‌ها",
            description: "اطمینان از امنیت و محرمانگی کامل اطلاعات کاربران.",
            icon: <FaLock />,
          },
          {
            id: 3,
            title: "پشتیبانی حرفه‌ای",
            description:
              "پشتیبانی ۲۴ ساعته در تمام مراحل نقد کردن موجودی پی‌پال.",
            icon: <FaHeadset />,
          },
        ]}
      />

      <FAQSection
        heading="سوالات متداول کاربران"
        description="پاسخ به متداول‌ترین سوالاتی که در ذهن دارید درباره سیمکارت‌های مالزی"
        faqItems={simFaq}
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
        searchable={true}
        animate={true}
      />

      <CTABanner
        heading="خرید سیم کارت فیزیکی مالزی با ارزی پلاس"
        description="  ارزی پلاس با سرعت، امنیت و کارمزد کم، سیمکارت مالزی را مدیریت می‌کند."
        button={{
          text: "خرید سیمکارت مالزی",
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

export default MalaysianSimCard;
