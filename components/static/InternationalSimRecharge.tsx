import HeroSection from "../global/heroSection";
import { FaExplosion } from "react-icons/fa6";
import StepsSection from "../global/stepsSection";
import {
  ctaThemes,
  faqThemes,
  splitSectionThemes,
  stepThemes,
  textBoxThemes,
  textBoxTypography,
  themesWhyus,
} from "@/lib/theme";
import {
  FaDollarSign,
  FaMoneyBillWave,
  FaRegClipboard,
  FaEnvelope,
  FaRocket,
} from "react-icons/fa";
import WhyUsSection from "../global/whyUs";
import FAQSection from "../global/faqSection";
import CTABanner from "../global/ctaBanner";
import TextBox from "../global/textBox";
import { FaMedal, FaHeadset } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import HeroSplitSection from "../global/heroSplitSection";
import { FaSimCard } from "react-icons/fa";

const InternationalSimRecharge = () => {
  const longText = `🔋 شارژ سیم‌کارت بین‌المللی در ایران با ارزی پلاس تمدید آسان، سریع و بدون نیاز به کارت ارزی اگر از سیم‌کارت‌های بین‌المللی برای کارهای بانکی، احراز هویت یا ثبت‌نام در سایت‌های خارجی استفاده می‌کنی، خدمات شارژ سیم‌کارت بین‌المللی ارزی پلاس مخصوص توست. با ارزی پلاس می‌تونی سیم‌کارت‌های کشورهای انگلیس، آلمان، استونی و مالزی رو به‌صورت ریالی از داخل ایران شارژ و تمدید کنی — بدون نیاز به کارت بانکی خارجی یا سفر خارج از کشور. ارزی پلاس به عنوان یکی از نمایندگان رسمی خدمات بین‌المللی ارتباطی با همکاری اپراتورهای معتبر جهانی مثل Vodafone، O2، Celcom و XOX، راهی امن و ساده برای فعال نگه‌داشتن خطوط بین‌المللی در اختیارت قرار می‌دهد. علاوه بر این، با تمرکز بر نرخ‌های رقابتی و فرآیندهای شفاف، ارزی پلاس نه تنها تمدید سریع سیمکارت بین‌المللی را تضمین می‌کند، بلکه با مشاوره‌های رایگان در مورد بهترین پلن‌های recharge (مانند Vodafone Unlimited Max از 10£/30 days با unlimited data/calls در 108 destinations)، از هدررفت هزینه‌ها جلوگیری می‌کند و امنیت تراکنش‌های ریالی را با رمزنگاری پیشرفته حفظ می‌نماید. تصور کنید بدون نگرانی از انقضای شماره +44، +49 یا +60، فقط روی پروژه‌های دلاری Upwork یا ترید در Binance تمرکز کنید — ارزی پلاس دقیقاً این آرامش را برای هزاران کاربر ایرانی فراهم کرده است. ⚡️ 
  چرا باید سیم‌کارت بین‌المللی خود را شارژ کنی؟
   سیم‌کارت‌های بین‌المللی ابزار اصلی برای بسیاری از کاربران در ایران هستند؛ از احراز هویت بانکی و ساخت حساب‌های فریلنسری گرفته تا ثبت‌نام در سایت‌های تحریم‌شده و اپلیکیشن‌های جهانی. اما در صورت شارژ نکردن دوره‌ای، این سیم‌کارت‌ها غیرفعال شده و قابل بازیابی نخواهند بود.
    با تمدید به‌موقع، از مزایای زیر بهره‌مند می‌شوی:
    حفظ شماره ثابت بین‌المللی بدون تغییر جلوگیری از لغو یا حذف شماره توسط اپراتور دریافت پیامک‌های تأیید حساب‌های خارجی (PayPal، Binance، Upwork و...) ادامه استفاده در سایت‌های تحریم‌شده و سرویس‌های بین‌المللی   `;

  const rechargeSteps = [
    {
      id: "confirm",
      title: "تأیید و شارژ",
      description:
        "در کمتر از 1 ساعت، شارژ اعمال شده و تأییدیه دریافت می‌کنید، با راهنمایی برای حفظ validity.",
      icon: <FaRocket />,
    },
    {
      id: "payment",
      title: "پرداخت ریالی",
      description:
        "هزینه تمدید را به‌صورت ریالی از درگاه امن پرداخت کنید، با نرخ‌های رقابتی و بدون کارمزد پنهان.",
      icon: <FaMoneyBillWave />,
      isActive: true,
    },
    {
      id: "select",
      title: "انتخاب کشور و اپراتور",
      description:
        "کشور (انگلیس، آلمان، استونی، مالزی) و اپراتور (Vodafone، O2، Celcom، Elisa) را انتخاب کنید و جزئیات شماره را وارد نمایید.",
      icon: <FaDollarSign />,
    },
    {
      id: "register",
      title: "ثبت نام و ورود",
      description:
        "حساب کاربری خود را در ارزی پلاس ایجاد یا وارد شوید و بخش شارژ سیم‌کارت بین‌المللی را انتخاب کنید.",
      icon: <FaRegClipboard />,
      isActive: true,
    },
  ];

  const rechargeWhyUs = [
    {
      id: 1,
      icon: <FaDollarSign size={32} />,
      title: "هزینه مناسب",
      description:
        "شارژ سیم‌کارت بین‌المللی با نرخ‌های رقابتی و بدون هزینه‌های پنهان، مناسب برای تمدید سیم‌کارت انگلیس، آلمان، استونی و مالزی از ایران.",
    },
    {
      id: 2,
      icon: <FaRocket size={32} />,
      title: "تحویل سریع",
      description:
        "تمدید سریع سیم‌کارت خارجی در کمتر از 1 ساعت، بدون نیاز به سفر یا کارت ارزی برای فعالسازی سیم‌کارت بین‌المللی.",
    },
    {
      id: 3,
      icon: <FaMoneyBillWave size={32} />,
      title: "امکان شارژ سیم کارت توسط ارزی پلاس",
      description:
        "پرداخت شارژ سیم‌کارت بین‌المللی به‌صورت ریالی، با مدیریت مستقیم توسط ارزی پلاس برای تمدید سیم‌کارت مالزی و آلمان.",
    },
    {
      id: 4,
      icon: <FaMedal size={32} />,
      title: "نماینده فروش سیم‌کارت های بین المللی با بیش از ده سال سابقه",
      description:
        "ارزی پلاس با بیش از 10 سال تجربه، شارژ سیم‌کارت استونی و انگلیس را با تضمین امنیت و پشتیبانی کامل ارائه می‌دهد.",
    },
    {
      id: 5,
      icon: <FaHeadset size={32} />,
      title: "پشتیبانی کامل",
      description:
        "مشاوره رایگان برای شارژ سیم‌کارت بین‌المللی، جلوگیری از انقضا و حل مشکلات تمدید سیم‌کارت خارجی.",
    },
  ];

  const rechargeFaq = [
    {
      id: "1",
      question: " آیا می‌توان سیم‌کارت بین‌المللی را از ایران شارژ کرد؟",
      answer:
        "بله، ارزی پلاس امکان شارژ ریالی از داخل ایران را فراهم کرده است؛ بدون نیاز به کارت ارزی یا حساب خارجی. فرآیند شارژ سیم‌کارت انگلیس و آلمان در کمتر از 1 ساعت تکمیل می‌شود.",
      category: "شارژ از ایران",
    },
    {
      id: "2",
      question: " اگر سیم‌کارت شارژ نشود، چه اتفاقی می‌افتد؟",
      answer:
        "در صورت عدم شارژ در بازه مشخص (۴ تا ۵ ماه بسته به اپراتور)، سیم‌کارت غیرفعال می‌شود و قابل بازیابی نیست. ارزی پلاس با هشدارهای خودکار، از این مسئله جلوگیری می‌کند.",
      category: "عواقب عدم شارژ",
    },
    {
      id: "3",
      question: " آیا پس از شارژ، قابلیت پیامک و تماس حفظ می‌شود؟",
      answer:
        "بله، با شارژ مجدد می‌توانید مثل قبل تماس گرفته و پیامک‌های بین‌المللی دریافت کنید، مناسب برای احراز هویت در Upwork و Binance.",
      category: "حفظ قابلیت‌ها",
    },
    {
      id: "4",
      question: " آیا ارزی پلاس خودش عملیات شارژ را انجام می‌دهد؟",
      answer:
        "بله، تمامی مراحل شارژ به‌صورت مستقیم و رسمی از طریق تیم فنی ارزی پلاس انجام می‌شود، با تأییدیه فوری برای تمدید سیم‌کارت مالزی و استونی.",
      category: "عملیات شارژ",
    },
  ];

  return (
    <div>
      <HeroSection
        heading="شارژ سیم‌کارت بین‌المللی  ارزی پلاس"
        subheading="تمدید آسان، سریع و بدون نیاز به کارت ارزی"
        description="اگر از سیم‌کارت‌های بین‌المللی برای کارهای بانکی، احراز هویت یا ثبت‌نام در سایت‌های خارجی استفاده می‌کنی، خدمات شارژ سیم‌کارت بین‌المللی ارزی پلاس مخصوص توست. با ارزی پلاس می‌تونی سیم‌کارت‌های کشورهای انگلیس، آلمان، استونی و مالزی رو به‌صورت ریالی از داخل ایران شارژ و تمدید کنی — بدون نیاز به کارت بانکی خارجی یا سفر خارج از کشور."
        buttons={[
          {
            text: "شارژ سیم‌کارت",
            href: "/services/InternationalSimRecharge",
            variant: "secondary",
            icon: <FaExplosion />,
          },
        ]}
        media={{
          type: "image",
          src: "https://arziplus.storage.c2.liara.space/images/pages/47-min.png",
          alt: "شارژ سیم‌کارت بین‌المللی با ارزی پلاس",
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
        heading="فرآیند شارژ سیم‌کارت بین‌المللی با ارزی پلاس"
        description="تمدید سیم‌کارت خارجی در 4 گام ساده: شارژ سیم‌کارت انگلیس، آلمان، استونی و مالزی بدون دردسر."
        steps={rechargeSteps}
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
        heading="مزایای شارژ سیم‌کارت بین‌المللی با ارزی پلاس"
        description="ارزی پلاس، شارژ سیم‌کارت بین‌المللی را به تجربه‌ای لذت‌بخش تبدیل کرده؛ چون که... فعالسازی سیم‌کارت بین‌المللی، تمدید سیم‌کارت خارجی و پرداخت شارژ سیم‌کارت بین‌المللی با نرخ‌های رقابتی و امنیت بالا."
        buttonText="شارژ کن"
        buttonLink="/services/InternationalSimRecharge"
        items={rechargeWhyUs}
        theme={themesWhyus.default}
      />

      <TextBox
        heading="سیم‌کارت‌های پشتیبانی‌شده توسط ارزی پلاس"
        content={longText}
        height={400}
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

      <HeroSplitSection
        heading="چرا ارزی پلاس؟"
        subHeading="سابقه، امنیت و پشتیبانی حرفه‌ای"
        description="ارزی پلاس با سابقه چندین ساله، تضمین امنیت تراکنش‌ها و نرخ رقابتی، بهترین گزینه برای نقد کردن پی‌پال است."
        buttons={[
          {
            text: "ثبت درخواست  سیم کارت",
            href: "/services/InternationalSimRecharge",
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
        heading=" سوالات متداول درباره شارژ سیم‌کارت بین‌المللی"
        description="پاسخ به متداول‌ترین سوالاتی که در ذهن دارید درباره تمدید سیم‌کارت خارجی و شارژ سیم‌کارت بین‌المللی"
        faqItems={rechargeFaq}
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
        heading="شارژ سیم‌کارت بین‌المللی در ایران"
        description="تمدید سیم‌کارت انگلیس، آلمان، استونی و مالزی با ارزی پلاس   ."
        button={{
          text: "شارژ کن",
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

export default InternationalSimRecharge;
