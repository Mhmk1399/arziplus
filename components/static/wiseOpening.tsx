import React from "react";
import { FaExplosion } from "react-icons/fa6";
import {
  ctaThemes,
  faqThemes,
  splitSectionThemes,
  stepThemes,
  themesWhyus,
} from "@/lib/theme";
import {
  FaClock,
  FaGlobe,
  FaLock,
  FaShieldAlt,
  FaDollarSign,
  FaPeopleArrows,
  FaShoppingCart,
  FaUniversity,
  FaEnvelope,
  FaRocket,
  FaCreditCard,
  FaPercentage,
  FaTools,
} from "react-icons/fa";
import HeroSection from "../global/heroSection";
import StepsSection from "../global/stepsSection";
import WhyUsSection from "../global/whyUs";
import HeroSplitSection from "../global/heroSplitSection";
import FAQSection from "../global/faqSection";
import CTABanner from "../global/ctaBanner";
import { FaGlobeEurope } from "react-icons/fa";
import { FaHandshake } from "react-icons/fa6";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { FaExchangeAlt, FaMoneyCheckAlt } from "react-icons/fa";
import { FaFileSignature, FaStore } from "react-icons/fa6";
import { FaSimCard } from "react-icons/fa6";
import SmoothTimeline from "../global/scrollTimeline";

const WiseOpening = () => {
  const wiseRegistrationSteps = [
    {
      id: "bankAccount",
      title: "حساب بانکی بین‌المللی",
      description:
        "افتتاح حساب شخصی و بیزینسی در انگلستان یا اروپا برای دریافت و انتقال امن درآمد ارزی.",
      icon: <FaUniversity />,
      isActive: true,
    },
    {
      id: "Sim",
      title: "سیم کارت فیزیکی بین الملل",
      description:
        "ارائه سیم کارت فیزیکی بین الملل با قابلیت دریافت پیامک و تماس در ایران",
      icon: <FaSimCard />,
      isActive: true,
    },
    {
      id: "brandReputation",
      title: "اعتبار برند جهانی",
      description:
        "کسب هویت رسمی و حرفه‌ای برای برند شما در سطح بین‌المللی و افزایش اعتماد مشتریان.",
      icon: <FaGlobeEurope />,
    },
    {
      id: "globalCollaboration",
      title: "همکاری با شرکت‌های خارجی",
      description:
        "امکان عقد قرارداد و همکاری رسمی با برندها و مشتریان خارج از کشور.",
      icon: <FaHandshake />,
      isActive: true,
    },
    {
      id: "taxNumber",
      title: "شماره مالیاتی ",
      description:
        "دریافت شماره مالیاتی معتبر اروپا برای انجام فعالیت‌های تجاری رسمی و قانونی.",
      icon: <FaFileInvoiceDollar />,
    },
    {
      id: "officialDocs",
      title: "مدارک رسمی قابل استعلام",
      description:
        "صدور گواهی ثبت شرکت و مدارک بین‌المللی معتبر جهت افزایش اعتماد و رسمیت.",
      icon: <FaFileSignature />,
    },
    {
      id: "globalPlatforms",
      title: "فعالیت در پلتفرم‌های جهانی",
      description:
        "دسترسی و فعالیت تجاری در سایت‌های بین‌المللی مانند Amazon، eBay و Etsy.",
      icon: <FaStore />,
      isActive: true,
    },
    {
      id: "currencyTransfers",
      title: "دریافت حواله‌های ارزی",
      description:
        "امکان دریافت و ارسال وجه با 80 ارز مختلف دنیا مانند USD، EUR و GBP با امنیت بالا.",
      icon: <FaExchangeAlt />,
    },
    {
      id: "debitCards",
      title: "کارت‌های فیزیکی و مجازی",
      description:
        "دریافت یک ویزاکارت‌ فیزیکی و تعداد بیشماری کارت های مجازی بین‌المللی برای برداشت و پرداخت آسان در سراسر جهان.",
      icon: <FaCreditCard />,
      isActive: true,
    },
    {
      id: "domainOffer",
      title: "دامنه اختصاصی رایگان",
      description:
        "اختصاص دامنه حرفه‌ای .CO.UK به‌صورت رایگان برای برندینگ دیجیتال و اعتبار بیشتر.",
      icon: <FaGlobe />,
    },
    {
      id: "paymentGateway",
      title: "درگاه پرداخت بین‌المللی",
      description:
        "دریافت درگاه پرداخت ارزی برای فروش محصولات و خدمات در بازار جهانی.",
      icon: <FaMoneyCheckAlt />,
      isActive: true,
    },
  ];

  const wiseItemsWhyus = [
    {
      id: 1,
      icon: <FaDollarSign size={32} />,
      iconColor: "bg-[#FF7A00]",
      title: "دریافت درآمد ارزی",
      description:
        "به راحتی درآمد خود را از مشتریان یا پلتفرم‌های فریلنسری به حساب وایز منتقل کنید و بدون محدودیت برداشت نمایید.",
    },
    {
      id: 2,
      icon: <FaPeopleArrows size={32} />,
      iconColor: "bg-[#FF7A00]",
      title: "ارسال پول به حساب‌های خارجی",
      description:
        "انتقال سریع و امن وجه به حساب‌های خارجی با کمترین کارمزد و بدون نیاز به حساب بانکی سنتی.",
    },
    {
      id: 3,
      icon: <FaShoppingCart size={32} />,
      iconColor: "bg-[#FF7A00]",
      title: "خرید از فروشگاه‌های بین‌المللی",
      description:
        "امکان خرید مستقیم از فروشگاه‌های خارجی و پرداخت اشتراک سرویس‌های آنلاین مثل Netflix، Adobe و دیگر پلتفرم‌ها.",
    },
    {
      id: 4,
      icon: <FaGlobe size={32} />,
      iconColor: "bg-[#FF7A00]",
      title: "انتقال سریع ارز به حساب‌های بانکی",
      description:
        "انتقال وجه به حساب‌های بانکی در سراسر دنیا با سرعت و کارمزد پایین، بدون محدودیت‌های بانکی ایران.",
    },
    {
      id: 5,
      icon: <FaUniversity size={32} />,
      iconColor: "bg-[#FF7A00]",
      title: "حسابی دارای سوئیفت و IBAN",
      description:
        "حساب بانکی وایز قابلیت سوئیفت و IBAN  را برای ارسال و دریافت 80 ارز دنیا را دارد.",
    },
    {
      id: 6,
      icon: <FaUniversity size={32} />,
      iconColor: "bg-[#FF7A00]",
      title: "ارائه مدارک حقوقی از انگلستان",
      description:
        "با افتتاح حساب وایز مدارک حقوقی از انگلستان صادر میشو که با استفاده از آن میتوانید در تمام پلتفرم ها دنیا احراز هویت کنید.",
    },
  ];

  const companyDocuments = [
    {
      id: 1,
      title: "پاسپورت معتبر",
      description:
        "ارائه اسکن رنگی با کیفیت از پاسپورت معتبر برای تمامی سهام‌داران.",
      icon: <FaFileSignature size={32} />,
      iconColor: "bg-[#4DBFF0]",
    },
    {
      id: 2,
      title: "عکس پرسنلی",
      description:
        "  ارسال عکس پرسنلی واضح از هر شریک یا سهام دار با شرایط گفته شده.",
      icon: <FaPeopleArrows size={32} />,
      iconColor: "bg-[#4DBFF0]",
    },
    {
      id: 3,
      title: "نام شرکت",
      description:
        "حداقل یک نام پیشنهادی لاتین (سه نام برای انتخاب سریع‌تر بهتر است).",
      icon: <FaFileInvoiceDollar size={32} />,
      iconColor: "bg-[#4DBFF0]",
    },
    {
      id: 4,
      title: "آدرس محل سکونت",
      description: "آدرس کامل جهت ارسال مدارک رسمی و سیم‌کارت بین‌المللی.",
      icon: <FaSimCard size={32} />,
      iconColor: "bg-[#4DBFF0]",
    },
    {
      id: 5,
      title: "تعیین سهام‌داران",
      description: "مشخص کردن میزان سهم هر شریک (ثبت حتی با یک نفر ممکن است).",
      icon: <FaHandshake size={32} />,
      iconColor: "bg-[#4DBFF0]",
    },
    {
      id: 6,
      title: "زمینه فعالیت",
      description:
        "توضیح کوتاهی درباره نوع فعالیت و حوزه کاری شرکت و فیلدهای کاری.",
      icon: <FaStore size={32} />,
      iconColor: "bg-[#4DBFF0]",
    },
  ];
  const defaultSteps = [
    { id: 1, title: " افتتاح حساب کاربری در وبسایت", desc: "" },
    { id: 2, title: "احراز حویت حساب کاربری", desc: "" },
    { id: 3, title: "ثبت درخواست افتتاح حساب وایز", desc: "" },
    { id: 4, title: "حساب شما آمادست", desc: "" },
  ];

  const companyCosts = [
    {
      id: "audit",
      title: "حسابرسی سالانه",
      description:
        "۳۵۰ پوند برای تمدید و بررسی مالی شرکت در پایان هر سال.(در صورت نیاز مشتری)",
      icon: <FaFileInvoiceDollar className="text-[#4DBFF0]" />,
      isActive: true,
    },
    {
      id: "dissolution",
      title: "انحلال شرکت",
      description: "در صورت نیاز به بستن شرکت، هزینه خدمات ۳۵۰ پوند است.",
      icon: <FaLock className="text-[#4DBFF0]" />,
      isActive: true,
    },
    {
      id: "address",
      title: "آدرس فیزیکی اروپا",
      description:
        " پوند برای دریافت آدرس معتبر جهت دریافت مرسولات رسمی.(در صورت نیاز مشتری)",
      icon: <FaGlobe className="text-[#4DBFF0]" />,
      isActive: true,
    },
    {
      id: "tax",
      title: "مالیات سالانه",
      description:
        "تنها در صورت سود خالص بالای ۱۳ هزار پوند، با نرخ ۱۹٪ محاسبه می‌شود.",
      icon: <FaDollarSign className="text-[#4DBFF0]" />,
      isActive: true,
    },
  ];

  const faqCompany = [
    {
      id: "1",
      question: "آیا بدون حضور فیزیکی می‌توان شرکت ثبت کرد؟",
      answer:
        "بله، تمامی مراحل ثبت شرکت به‌صورت آنلاین و از داخل ایران انجام می‌شود.",
    },
    {
      id: "2",
      question: "آیا پکیج ثبت شامل حساب بانکی است؟",
      answer:
        "بله، همراه با ثبت شرکت یک حساب بانکی بیزینسی وایز و کارت‌ فیزیکی آن ارائه می‌شود.",
    },
    {
      id: "3",
      question: "آیا می‌توان اقامت دریافت کرد؟",
      answer:
        "در کشورهایی مانند انگلستان در صورت تراکنش بانکی بالا امکان دریافت اقامت از طریق شرکت وجود دارد.",
    },
    {
      id: "4",
      question: "آیا وایز برای کاربران ایرانی فعال است؟",
      answer:
        "بله، از طریق ارزی پلاس به‌صورت واسطه‌ای و امن فعال‌سازی انجام می‌شود.",
    },
    {
      id: "5",
      question: "آیا کارت فیزیکی لازم است؟",
      answer:
        "خیر، ولی کارت فیزیکی ویزا به صورت رایگان صادر و برای شما ارسال میشود و  شما می‌توانید از کارت مجازی هم استفاده کنید  .",
    },
  ];

  const faqIcons = {
    question: (
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
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    help: (
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
          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z"
        />
      </svg>
    ),
    support: (
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
          d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3"
        />
      </svg>
    ),
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
    chat: (
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
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  };

  return (
    <div>
      {" "}
      <HeroSection
        heading="ثبت شرکت بین‌المللی و افتتاح حساب بانکی وایز (Wise) با ارزی پلاس"
        subheading="افتتاح حساب بین‌المللی وایز"
        description="ثبت شرکت در خارج از کشور و افتتاح حساب بانکی بین‌المللی، از مؤثرترین روش‌ها برای ورود به بازارهای جهانی، دریافت خدمات بانکی معتبر و افزایش اعتبار برند در سطح بین‌المللی است.
ارزی پلاس با تجربه طولانی در امور مالی بین‌المللی، ثبت شرکت شما را در کشورهای معتبری مانند انگلستان و آمریکا به‌صورت قانونی و سریع انجام می‌دهد و همراه با آن، یک حساب بانکی بین‌المللی و وریفای‌شده وایز (Wise) به شما ارائه می‌کند تا به دنیای تراکنش‌های جهانی متصل شوید."
        buttons={[
          {
            text: "افتتاح حساب وایز",
            href: "/register",
            variant: "secondary",
            icon: <FaExplosion />,
          },
        ]}
        media={{
          type: "image",
          src: "/assets/images/wise sakht.png",
          alt: "افتتاح حساب بانکی بین‌المللی وایز",
          width: 1200,
          height: 400,
        }}
        layout="default"
        theme={{
          headingColor: "text-gray-50",
          subheadingColor: "text-gray-700",
          descriptionColor: "text-slate-50",
          backgroundColor: "bg-emerald-500",
          bgSubHeadingColor: "bg-gray-50",
        }}
      />
      <StepsSection
        heading="مزایای افتتاح حساب وایز با ارزی پلاس"
        description="با افتتاح حساب بین‌المللی وایز، می‌توانید تراکنش‌های خود را سریع، امن و کم‌هزینه انجام دهید. از جمله مزایای بارز افتتاح حساب با ارزی پلاس می‌توان به امکانات زیر اشاره نمود:"
        steps={wiseRegistrationSteps}
        theme={stepThemes.blue}
        layout="timeline"
        boxShape="square"
        boxSize="sm"
        showNumbers={true}
        animated={true}
        interactive={true}
        showIcons={true} // اگه بخوای آیکون‌ها نمایش داده بشن اینو بذار true
      />
      <WhyUsSection
        heading="کاربردهای حساب وایز"
        description="با افتتاح حساب وایز از طریق ارزی پلاس، می‌توانید به امکانات گسترده‌ای دسترسی داشته باشید:"
        buttonText="افتتاح حساب وایز"
        buttonLink="/wise-account"
        items={wiseItemsWhyus}
        buttonColor="bg-[#FF7A00] hover:bg-[#FF7A00]/80 text-white"
        theme={themesWhyus.default}
      />
      <SmoothTimeline
        title="مراحل ساخت حساب پی پال"
        subtitle="با طی کردن مراحل زیر به راحتی حساب خود را افتتاح کنید"
        steps={defaultSteps}
        compact={false}
      />
      <WhyUsSection
        heading="مدارک مورد نیاز برای ثبت شرکت"
        description="برای شروع، تنها چند مدرک ساده لازم دارید:"
        items={companyDocuments}
        theme={themesWhyus.dark}
        buttonText="افتتاح حساب وایز"
        buttonLink="#"
        buttonColor="bg-[#4DBFF0] hover:bg-blue-700 text-white"
      />
      <StepsSection
        heading="هزینه‌های جانبی پس از ثبت شرکت"
        description="در این بخش، هزینه‌های سالانه و خدماتی ذکر شده‌اند:"
        steps={companyCosts}
        theme={stepThemes.colorful}
        layout="timeline"
        boxShape="square"
        boxSize="xl"
        showNumbers={true}
        animated={true}
        interactive={true}
        showIcons={true}
      />
      <HeroSplitSection
        heading="چرا ارزی پلاس؟"
        subHeading="امنیت و اطمینان در افتتاح حساب وایز"
        description="در ارزی پلاس، تمام مراحل افتتاح و وریفای حساب وایز (Wise) توسط تیمی حرفه‌ای و متخصص در حوزه پرداخت‌های بین‌المللی انجام می‌شود. ما علاوه بر افتتاح حساب، مشاوره امنیتی و مالی ارائه می‌کنیم تا بتوانید از حساب وایز خود بدون نگرانی از مسدود شدن یا محدودیت استفاده کنید.
هدف ما این است که کاربران ایرانی بتوانند به‌صورت قانونی و مطمئن، به سیستم بانکی بین‌المللی وایز متصل شوند و پرداخت‌ها، دریافت‌ها و تراکنش‌های ارزی خود را با خیالی آسوده انجام دهند."
        buttons={[
          {
            text: "افتتاح حساب وایز با ارزی پلاس",
            href: "/wise-account",
            variant: "secondary",
            icon: <FaShieldAlt />,
          },
        ]}
        imageSrc="/assets/images/wise2.png"
        imageAlt="افتتاح حساب وایز (Wise) در ایران"
        theme={splitSectionThemes.dark}
        layout="image-left"
        features={[
          {
            id: 1,
            title: "تجربه چندساله",
            description: "افتتاح حساب‌های بین‌المللی و وریفای مطمئن.",
            icon: <FaClock />,
            style: {
              bg: "bg-indigo-900/30",
              border: "border-indigo-400",
              text: "text-indigo-200",
              iconColor: "text-indigo-400",
              shadow: "shadow-lg",
              rounded: "rounded-xl",
            },
          },
          {
            id: 2,
            title: "پلتفرم‌های معتبر",
            description: "همکاری با مسیرهای مطمئن و قانونی.",
            icon: <FaGlobe />,
            style: {
              bg: "bg-emerald-900/20",
              border: "border-emerald-400",
              text: "text-emerald-200",
              iconColor: "text-emerald-400",
            },
          },
          {
            id: 3,
            title: "مشاوره امنیتی",
            description: "کاهش ریسک محدودیت حساب.",
            icon: <FaLock />,
            style: {
              bg: "bg-rose-900/20",
              border: "border-rose-400",
              text: "text-rose-200",
              iconColor: "text-rose-400",
            },
          },
          {
            id: 4,
            title: "خدمات تکمیلی",
            description:
              "شارژ حساب، نقد کردن موجودی، پرداخت ارزی و اتصال به سرویس‌ها",
            icon: <FaTools />,
            style: {
              bg: "bg-amber-900/20",
              border: "border-amber-400",
              text: "text-amber-200",
              iconColor: "text-amber-400",
            },
          },
        ]}
      />
      <FAQSection
        heading="سوالات متداول"
        description="پاسخ سوالات رایج درباره خدمات ارزی پلاس و افتتاح حساب وایز را در اینجا بیابید"
        svgIcon={faqIcons.info}
        faqItems={faqCompany}
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
        heading="همین حالا حساب وایز خود را افتتاح کنید!"
        description="با ارزی پلاس، تراکنش‌های بین‌المللی خود را سریع، امن و با کمترین کارمزد انجام دهید."
        button={{
          text: "ثبت درخواست افتتاح حساب وایز",
          href: "/wise-register",
          variant: "primary",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.success}
        height={50}
      />
    </div>
  );
};

export default WiseOpening;
