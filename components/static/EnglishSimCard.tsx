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
  FaClock,
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
import TextBox from "../global/textBox";
import { FaMedal, FaLock, FaHeadset } from "react-icons/fa";
import HeroSplitSection from "../global/heroSplitSection";
import { FaSimCard } from "react-icons/fa";

const EnglishSimCard = () => {
  const longText = `با خرید سیم کارت های ودافون انگلیس به یک خط دائمی برای ایجاد ارتباط با کل جهان دست یابید. با داشتن سیم کارت ودافون می توانید ارسال و دریافت پیامک به تمامی خطوط بین المللی داشته  و در اکثر سایت هایی که ایران را تحریم کرده اند ثبت نام کنید. این سیم کارت ها با پیش شماره کشور انگلستان ارائه می‌شوند: در سال 2025، Vodafone UK prepaid SIMها با پلن‌های Unlimited Max (unlimited data/calls/texts برای 30 days از £10) و roaming در 108 destinations بدون extra cost گزینه‌ای ایده‌آل برای verification و international communication فراهم می‌کنند. ارزی پلاس با صدور فیزیکی و ارسال به ایران، فرآیند را ایمن نگه می‌دارد، و با recharge هر 5 ماه، از غیرفعال شدن جلوگیری می‌کند.`;

  const simSteps = [
    {
      id: "activation",
      title: "گام چهارم: فعال سازی سیم‌کارت",
      description:
        "ظرف چند ساعت سیم‌کارت شما فعال و کمتر از یک هفته به آدرس شما در ایران تحویل داده می‌شود، همراه با راهنمایی برای recharge اولیه.",
      icon: <FaRocket />,
    },
    {
      id: "payment",
      title: "گام سوم: پرداخت",
      description:
        "هزینه سفارش را از طریق شماره حساب سایت پرداخت نمایید، با گزینه‌های امن و شفاف برای پلن‌های prepaid.",
      icon: <FaMoneyBillWave />,
      isActive: true,
    },
    {
      id: "request",
      title: "گام دوم: ثبت درخواست",
      description:
        "درخواست خود را از طریق فرم ثبت سفارش ارسال کنید، با انتخاب Vodafone یا EE و جزئیات پلن مورد نظر.",
      icon: <FaDollarSign />,
    },
    {
      id: "membership",
      title: "گام اول: عضویت در سایت",
      description:
        "حساب کاربری خود را درسایت ارزی پلاس ایجاد کنید و اطلاعات اولیه را برای سفارشی‌سازی سیمکارت وارد نمایید.",
      icon: <FaRegClipboard />,
      isActive: true,
    },
  ];

  const simWhyUs = [
    {
      id: 1,
      icon: <FaClock size={32} />,
      title: "فعال سازی فوری",
      description:
        "فعال سازی با نام کاربر سیم‌کارت بلافاصله قبل از ارسال به صورت کامل فعال می‌شود و نیازی به مراحل پیچیده یا مدارک خاص ندارد. آماده استفاده برای پیامک، تماس و ثبت‌نام در سایت‌های بین‌المللی می‌باشد، با Vodafone Basics PAYG (double data 3 months)",
    },
    {
      id: 2,
      icon: <FaMapMarkerAlt size={32} />,
      title: "تحویل سریع در ایران",
      description:
        "سیم‌کارت به صورت فیزیکی مستقیماً درب منزل شما در ایران تحویل داده می‌شود. جهت فعال سازی نیازی به مراجعه حضور و یا سفر خارج از کشور نمی‌باشد، با پوشش roaming در 220+ countries",
    },
    {
      id: 3,
      icon: <FaPhone size={32} />,
      title: "دریافت و ارسال پیامک و تماس",
      description:
        "سیمکارت‌های فیزیکی انگلیس از اپراتور‌های معتبر ایرانی سرویس دریافت می‌کنند، امکان ارسال و دریافت پیامک و تماس با شماره‌های داخلی و بین‌المللی را خواهید داشت، با Vodafone unlimited calls/texts domestic",
    },
    {
      id: 4,
      icon: <FaGlobe size={32} />,
      title: "ثبت نام در سایت‌های تحریم شده",
      description:
        "سیم‌کارت دارای پیش‌شماره معتبر انگلیس بوده و در بیشتر پلتفرم‌ها و سایت‌هایی که ایران را تحریم کرده‌اند، برای احراز هویت و ثبت‌نام قابل استفاده است، ایده‌آل برای Upwork و freelancing.",
    },
    {
      id: 5,
      icon: <FaShieldAlt size={32} />,
      title: "آنتن‌دهی مناسب",
      description:
        "سیم‌کارت‌های Vodafone و EE با پوشش 4G/5G در UK و roaming partners در ایران، آنتن‌دهی مناسب در مراکز استان‌ها فراهم می‌کنند",
    },
  ];

  const simFaq = [
    {
      id: "1",
      question: "آیا سیم‌کارت‌ها واقعی هستند؟",
      answer:
        "بله، سیم‌کارت‌ها به صورت فیزیکی هستند و به نام متقاضی فعال و به آدرس شما در ایران ارسال میشوند. Vodafone و EE prepaid SIMهای فیزیکی با roaming international",
      category: "واقعی بودن",
    },
    {
      id: "2",
      question: "تفاوت سیم‌کارت‌های مجازی و فیزیکی چیست؟",
      answer:
        "سیم‌کارت‌های مجازی وجود خارجی نداشته و صرفا شماره می‌باشد که امکان تماس ندارند، همچنین احتمال از دست دادن شماره سیم‌کارت هم وجود دارد. سیم‌کارت‌های فیزیکی با مشخصات متقاضی فعال و با شماره ثابت در اختیار وی قرار می‌گیرد. فیزیکی: تماس/SMS واقعی، مجازی: فقط SMS موقت، با eSIM گزینه جایگزین در 2025",
      category: "تفاوت مجازی/فیزیکی",
    },
    {
      id: "3",
      question: "آیا این سیم‌کارت‌ها تاریخ انقضا دارند؟",
      answer:
        "خیر، این سیم‌کارت‌ها تاریخ انقضا ندارند و فقط لازم است که هر 5 ماه یک بار شارژ شوند تا غیرفعال نشوند. Vodafone: recharge هر 90 days برای validity، EE: مشابه prepaid plans",
      category: "تاریخ انقضا",
    },
    {
      id: "4",
      question: "سیم‌کارت چه کشورهایی موجود است؟",
      answer:
        "در حال حاضر سیم‌کارت ودافون انگلیس، O2 آلمان، استونی و سلکام مالزی موجود می‌باشد. انگلیس از Vodafone/EE برای freelancing و banking verification ایده‌آل است",
      category: "کشورهای موجود",
    },
    {
      id: "5",
      question: "وضعیت آنتن دهی این سیم‌کارت‌ها در ایران چگونه است؟",
      answer:
        "کلیه سیم‌کارت‌های مجموعه ارزی پلاس از پوشش مناسبی در کشور برخوردار بوده و قابلیت دریافت پیامک و تماس‌های بین المللی را دارا می‌باشند. Vodafone با roaming partners ایرانی مانند MCI برای coverage",
      category: "آنتن‌دهی",
    },
    {
      id: "6",
      question: "آیا از ایران می‌توان با این سیم‌کارت‌ها تماس گرفت؟",
      answer:
        "بله، اما هزینه‌های تماس آن طبق تعرفه رومینگ حساب می‌شود. برای calls به EU/international، rates از 0.09€/min در Vodafone، EE: $1.25/min international",
      category: "تماس از ایران",
    },
  ];

  return (
    <div>
      <HeroSection
        heading="سیم‌کارت‌ بین المللی انگلیس  ارزی پلاس نماینده فروش سیم‌کارت های بین المللی"
        subheading="سیم‌کارت‌ بین المللی انگلیس"
        description="با داشتن سیم کارت ودافون می توانید ارسال و دریافت پیامک به تمامی خطوط بین المللی داشته  و در اکثر سایت هایی که ایران را تحریم کرده اند ثبت نام کنید. این سیم کارت ها با پیش شماره کشور انگلستان ارائه می‌شوند: Vodafone و EE با پلن‌های 2025 prepaid، ایده‌آل برای verification و international roaming. با خرید سیم کارت های ودافون انگلیس به یک خط دائمی برای ایجاد ارتباط با کل جهان دست یابید."
        buttons={[
          {
            text: "خرید سیمکارت انگلیس",
            href: "/services/EnglishSimCard",
            variant: "secondary",
            icon: <FaExplosion />,
          },
        ]}
        media={{
          type: "image",
          src: "https://arziplus.storage.c2.liara.space/images/pages/44-min.png",
          alt: "سیمکارت Vodafone و EE انگلیس با ارزی پلاس",
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
        heading="چهار گام تا دریافت سیم‌کارت فیزیکی ودافون انگلیس"
        description="با ارزی پلاس، فرآیند خرید و فعال‌سازی سیمکارت انگلیس ساده و سریع است."
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
        heading="ویژگی‌ و کاربرد‌ سیم‌کارت‌های Vodafone "
        description="سیمکارت بین‌المللی Vodafone با پیش‌شماره ‎0044‎ و پوشش در بیش از ‎220‎ کشور، فعال در ایران برای تماس و پیامک. ایده‌آل برای ثبت‌نام در سایت‌های خارجی، فریلنسری، گیمینگ، ترید و وریفای بین‌المللی با شماره ثابت جهانی."
        buttonText="خرید سیمکارت"
        buttonLink="/services/EnglishSimCard"
        items={simWhyUs}
         theme={themesWhyus.default}
      />

      <TextBox
        heading="توجه! شارژ منظم"
        content={longText}
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
      <HeroSplitSection
        heading="چرا ارزی پلاس؟"
        subHeading="سابقه، امنیت و پشتیبانی حرفه‌ای"
        description="ارزی پلاس با سابقه چندین ساله، تضمین امنیت تراکنش‌ها و نرخ رقابتی، بهترین گزینه برای نقد کردن پی‌پال است."
        buttons={[
          {
            text: "خرید سیم کارت انگلیس",
            href: "/services/EnglishSimCard",
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
        heading="سوال پر تکرار"
        description="پاسخ به متداول‌ترین سوالاتی که در ذهن دارید درباره سیم‌کارت‌های انگلیس"
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
        heading="✅ همین حالا به دنیای ارتباطات بین‌المللی بپیوندید!"
        description="  ثبت نام سریع و ساده در ارزی پلاس، شروعی تازه برای شماست. جهت ثبت سفارش کلیک کنید"
        button={{
          text: "خرید سیمکارت انگلیس",
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

export default EnglishSimCard;
