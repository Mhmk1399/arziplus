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
  FaHeadset,
  FaLock,
  FaShieldAlt,
  FaDollarSign,
  FaMoneyBillWave,
  FaRegClipboard,
  FaEnvelope,
  FaRocket,
  FaPercentage,
  FaExchangeAlt,
  FaGlobeAmericas,
} from "react-icons/fa";
import HeroSplitSection from "../global/heroSplitSection";
import WhyUsSection from "../global/whyUs";
import FAQSection from "../global/faqSection";
import CTABanner from "../global/ctaBanner";
import TextBox from "../global/textBox";

const WisePayout = () => {
  const longText = `نقد کردن درآمد وایز چه مزایایی دارد؟
نقد کردن درآمد وایز در ارزی پلاس این امکان را در اختیار شما قرار می‌دهد تا با پرداخت کارمزد کم و با سرعت بالا پول‌های ارسالی را به ریال تبدیل کنید. نکته قابل توجه در نقد کردن موجودی وایز این است که برای تبدیل نرخ ارزها به یکدیگر نیاز نیست کارمزد اضافی پرداخت کنید. خیلی از فریلنسرها برای دریافت دستمزد خود از حساب وایز استفاده می‌کنند. این حساب دردسرهای سیستم‌های پرداختی دیگر نظیر پی پال را ندارد و در بیشتر سایت‌های فریلنسری نظیر آپ وورک (Upwork) از وایز پشتیبانی می‌کنند. برای دریافت دستمزد خود در وایز بهتر است در ارزی پلاس ثبت نام کرده و بعد از پروسه احراز هویت، درخواست نقد کردن درآمد وایز را بگذارید. نرخ کارمزد وایز به مقدار پولی که دریافت می‌کنید بستگی دارد اما بر عهده شما که شخص گیرنده هستید نخواهد بود.

برای نقد کردن درآمد وایز چه چیزهایی نیاز است؟
برای نقد درآمد وایز به چیز خاصی نیاز ندارید. زمانی که پول به حسابتان آمد باید ثبت سفارش کرده و مبلغی که می‌خواهید برداشت بزنید را از حساب وایز خود به حسابی که ما به شما اعلام می‌کنیم انتقال دهید. سپس ما با بررسی انتقال، خیلی سریع معادل ریالی مبلغ انتقال را به کارت بانکی شما واریز خواهیم کرد. این کار معمولاً در عرض 3 ساعت انجام می‌شود اما در برخی اوقات و با توجه به شلوغی شبکه وایز یا مبلغ زیاد انتقال ممکن است بین 1 تا 3 روز نیز به طور بیانجامد. اگر حساب پی پال دارید نیز می‌توانید مستقیم از این حساب به حساب وایز پول انتقال دهید. در حال حاضر، ارزی پلاس نقد درآمد وایز پوند، دلار و یورو را انجام می‌دهد. اگر شما  می‌خواهید حساب وایز خود را شارژ کنید ابتدا وارد پنل کاربری شوید و شارژ حساب وایز را انتخاب کنید. در کمترین زمان ممکن حساب شما شارژ خواهد شد
    شرکت وایز در سال 2011 با هدف جابه‌جایی آسان ارز یک کشور به کشوری دیگر توسط دو برادر اهل کشور استونی راه‌اندازی شد. آن دو برادر با نام تاوت و کریستو در انگلستان کار می‌کردند و در زمان دریافت حقوق می‌خواستند پولشان را به حساب بانکی خود در کشور استونی منتقل کنند اما در زمان پرداخت باید کارمزد زیادی پرداخت می‌کردند. بنابراین، تصمیم گرفتند که شبکه‌ای راه‌اندازی کنند تا واحد پولی هر کشور را به راحتی و با کارمزدی ارزان به کشور دیگر انتقال دهند. وایز خیلی زود توانست اعتماد مردم را برای نقل و انتقال داریی‌هایشان جلب کند. در حقیقت، مردم بعد از این که با وایز کار کردند، فهمیدند که انجام کارهای مالی با وایز چقدر سریع‌ و ارزان‌تر است. حساب وایز به دلیل همین ویژگی‌ها به سرعت در سایت‌های استخدامی و فریلنسری نیز به محبوبیت دست پیدا کرد. حتی سرویس پی پال نیز سرویسی اضافه کرد که با استفاده از موجودی پی‌پال بتوان به وایز پول انتقال داد. بیشتر فریلنسرهای ایرانی که از سایت‌های خارجی مانند upwork پروژه دریافت می‌کنند، می‌توانند درآمد خود را با وایز دریافت کنند.  `;

  const cashoutSteps = [
    {
      id: "register",
      title: "ثبت‌نام در ارزی پلاس",
      description:
        "ابتدا یک حساب کاربری ایجاد کنید تا به پنل فروش و خدمات نقد دسترسی پیدا کنید.",
      icon: <FaRegClipboard />,
      isActive: true,
    },
    {
      id: "createOrder",
      title: "ثبت سفارش نقد کردن",
      description:
        "مقدار ارز (دلار، یورو یا پوند) را که می‌خواهید نقد شود وارد کنید و سفارش را ثبت نمایید.",
      icon: <FaDollarSign />,
    },
    {
      id: "transferToWise",
      title: "انتقال موجودی به حساب اعلام‌شده",
      description:
        "پس از ثبت سفارش، اطلاعات حساب و آدرس ایمیل مقصد برای انتقال اعلام می‌شود؛ مبلغ را به حساب وایز اعلام‌شده واریز کنید.",
      icon: <FaExchangeAlt />,
      isActive: true,
    },
    {
      id: "processing",
      title: "پردازش و بررسی سفارش",
      description:
        "تیم ارزی پلاس انتقال شما را بررسی می‌کند و پس از تأیید، معادل ریالی را واریز می‌نماید.",
      icon: <FaClock />,
      isActive: true,
    },
    {
      id: "receive",
      title: "دریافت ریال در کارت بانکی",
      description:
        "معادل ریالی مبلغ به‌صورت سریع به شماره کارت اعلام‌شده واریز خواهد شد؛ پیامک و رسید در پنل ارسال می‌شود.",
      icon: <FaMoneyBillWave />,
    },
    {
      id: "support",
      title: "پشتیبانی و پیگیری",
      description:
        "در صورت نیاز به راهنمایی یا پیگیری، تیم پشتیبانی ارزی پلاس در دسترس است.",
      icon: <FaHeadset />,
    },
  ];

  const whyUsItems = [
    {
      id: 1,
      icon: <FaGlobeAmericas size={32} />,
      iconColor: "bg-emerald-700",
      title: "تبدیل سریع درآمد ارزی",
      description:
        "موجودی وایز شما در کمترین زمان به معادل ریالی تبدیل و به حساب بانکی‌تان واریز می‌شود.",
    },
    {
      id: 2,
      icon: <FaPercentage size={32} />,
      iconColor: "bg-emerald-700",
      title: "کارمزد منصفانه و شفاف",
      description:
        "نرخ کارمزد قبل از ثبت نهایی نمایش داده می‌شود و هیچ هزینهٔ مخفی وجود ندارد.",
    },
    {
      id: 3,
      icon: <FaLock size={32} />,
      iconColor: "bg-emerald-700",
      title: "بدون نیاز به سفته یا چک",
      description:
        "فرایند اعتماد دوطرفه و بدون نیاز به ضمانت‌های غیرضروری طراحی شده است.",
    },
    {
      id: 4,
      icon: <FaClock size={32} />,
      iconColor: "bg-emerald-700",
      title: "پیگیری سریع و اطلاع‌رسانی",
      description:
        "وضعیت سفارش شما از طریق پنل و پیامک به‌صورت لحظه‌ای اطلاع‌رسانی می‌شود.",
    },
    {
      id: 5,
      icon: <FaHeadset size={32} />,
      iconColor: "bg-emerald-700",
      title: "مشاوره برای مبالغ بالا",
      description:
        "برای برداشت‌های بزرگ، کارشناسان ما راهکارهای کاهش ریسک و بهبود نرخی را پیشنهاد می‌دهند.",
    },
  ];

  const cashoutFaq = [
    {
      id: "1",
      question: "چطور موجودی وایز خود را نقد کنم؟",
      answer:
        "وارد پنل ارزی پلاس شوید، سفارش نقد کردن را ثبت کنید، مبلغ را به حساب وایز اعلام‌شده منتقل کنید؛ پس از تأیید، معادل ریالی به کارت شما واریز می‌شود.",
      category: "عمومی",
    },
    {
      id: "2",
      question: "چه مدت طول می‌کشد تا پول واریز شود؟",
      answer:
        "در شرایط عادی پرداخت‌ها ظرف چند ساعت انجام می‌شود؛ اما در مواقع شلوغی شبکه یا مبالغ بالا ممکن است بین ۱ تا ۳ روز طول بکشد.",
      category: "زمان‌بندی",
    },
    {
      id: "3",
      question: "آیا محدودیت سقف برای نقد کردن وجود دارد؟",
      answer:
        "ارزی پلاس به‌صورت عمومی سقف مشخصی اعلام نکرده است؛ برای مبالغ بسیار بالا پیش از ثبت سفارش با پشتیبانی هماهنگ کنید.",
      category: "سقف",
    },
    {
      id: "4",
      question: "چه اطلاعاتی لازم است؟",
      answer:
        "نام صاحب حساب و ایمیل مرتبط با حساب وایز دریافت‌کننده و شماره کارت بانکی شما برای واریز ریال کافی است.",
      category: "مدارک",
    },
    {
      id: "5",
      question: "چه ارزهایی قابل نقد شدن هستند؟",
      answer:
        "در حال حاضر دلار، یورو و پوند پشتیبانی می‌شوند؛ در صورت نیاز به ارزهای دیگر با تیم پشتیبانی تماس بگیرید.",
      category: "ارزها",
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
      <HeroSection
        heading="نقد درآمد وایز (Wise) در ایران — سریع، مطمئن و با کارمزد منصفانه"
        subheading="نقد کردن موجودی وایز با ارزی پلاس"
        description={`ارزی پلاس خدمات نقد درآمد وایز را برای تبدیل موجودی ارزی شما به ریال ارائه می‌دهد. با فرایندی ساده و شفاف می‌توانید درآمدهای ارزی خود را در کوتاه‌ترین زمان به حساب بانکی ایرانی منتقل کنید.`}
        buttons={[
          {
            text: "نقد سریع درآمد وایز",
            href: "/register",
            variant: "secondary",
            icon: <FaExplosion />,
          },
        ]}
        media={{
          type: "image",
          src: "/assets/images/chargeWise.png",
          alt: "نقد درآمد وایز در ارزی پلاس",
          width: 1200,
          height: 1200,
        }}
        layout="default"
        theme={{
          headingColor: "text-gray-50",
          subheadingColor: "text-gray-700",
          descriptionColor: "text-gray-200",
          backgroundColor: "bg-emerald-700",
          bgSubHeadingColor: "bg-fuchsia-50",
        }}
      />

      <StepsSection
        heading="مراحل نقد درآمد وایز"
        description={`نقد درآمد وایز در ارزی پلاس با چند کلیک انجام می‌شود: ثبت‌نام، ثبت سفارش، انتقال به حساب اعلام‌شده و دریافت ریال در کارت بانکی.`}
        steps={cashoutSteps}
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
        heading="چرا ارزی پلاس برای نقد درآمد وایز؟"
        description="ارزی پلاس با فرایندهای استاندارد، تیم پشتیبانی مجرب و نرخ‌های شفاف، نقد درآمد وایز را به‌صورت امن و سریع انجام می‌دهد."
        buttonText="نقد درآمد وایز"
        buttonLink="/wise-payout"
        items={whyUsItems}
        buttonColor="bg-emerald-700 hover:bg-emerald-800 text-white"
        theme={themesWhyus.default}
      />
      <TextBox
        heading="نقد کردن درآمد وایز"
        content={longText}
        height={320}
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
        heading="نقد درآمد وایز — مزایا و نکات مهم"
        subHeading="دریافت ریال از حساب‌های بین‌المللی با کمترین دردسر"
        description={`نقد درآمد وایز به شما امکان می‌دهد بدون نیاز به حساب ارزی، درآمدهای بین‌المللی را به ریال تبدیل کنید. ما فرایند را ساده کرده‌ایم تا شما با حداقل زمان و هزینه پول خود را دریافت نمایید.`}
        buttons={[
          {
            text: "ثبت سفارش نقد درآمد",
            href: "/wise-payout",
            variant: "primary",
            icon: <FaShieldAlt />,
          },
        ]}
        imageSrc="/assets/images/wise-payout-2.webp"
        imageAlt="نقد درآمد وایز با ارزی پلاس"
        theme={splitSectionThemes.dark}
        layout="image-left"
        imageWidth="1/2"
        features={[
          {
            id: 1,
            title: "بدون نیاز به ضمانت‌نامه",
            description:
              "فرایند ساده و مبتنی بر اعتماد طراحی شده است؛ نیازی به چک یا سفته نیست.",
            icon: <FaGlobeAmericas />,
            style: {
              bg: "bg-emerald-900/30",
              border: "border-emerald-400",
              text: "text-emerald-200",
              iconColor: "text-emerald-400",
              shadow: "shadow-lg",
              rounded: "rounded-xl",
            },
          },
          {
            id: 2,
            title: "پرداخت سریع",
            description:
              "پرداخت معادل ریالی معمولاً ظرف چند ساعت انجام می‌شود و رسید پرداخت برای شما ارسال می‌گردد.",
            icon: <FaClock />,
            style: {
              bg: "bg-indigo-900/20",
              border: "border-indigo-400",
              text: "text-indigo-200",
              iconColor: "text-indigo-400",
            },
          },
          {
            id: 3,
            title: "نرخ منصفانه",
            description:
              "نرخ تبدیل و کارمزدها پیش از نهایی کردن سفارش نمایش داده می‌شوند تا تصمیم‌گیری آگاهانه داشته باشید.",
            icon: <FaPercentage />,
            style: {
              bg: "bg-emerald-900/20",
              border: "border-emerald-400",
              text: "text-emerald-200",
              iconColor: "text-emerald-400",
            },
          },
          {
            id: 4,
            title: "پشتیبانی ۲۴/۷",
            description:
              "تیم پشتیبانی ارزی پلاس آماده پاسخگویی و کمک به حل مسائل شما در هر ساعت است.",
            icon: <FaHeadset />,
            style: {
              bg: "bg-teal-900/20",
              border: "border-teal-400",
              text: "text-teal-200",
              iconColor: "text-teal-400",
            },
          },
        ]}
      />

      <FAQSection
        heading="سؤالات متداول نقد درآمد وایز"
        description="پاسخ به پرسش‌های پرتکرار کاربران درباره فرایند نقد درآمد وایز در ارزی پلاس"
        svgIcon={faqIcons.info}
        faqItems={cashoutFaq}
        buttons={[
          {
            text: "تماس با پشتیبانی",
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
        heading="    درآمد وایز خود را در ارزی پلاس نقد کنید "
        description="ثبت سفارش نقد درآمد وایز با نرخ رقابتی و پشتیبانی تخصصی. هم‌اکنون سفارش دهید."
        button={{
          text: "ثبت سفارش نقد درآمد وایز",
          href: "/wise-payout",
          variant: "primary",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.primary}
        height={50}
      />
    </div>
  );
};

export default WisePayout;
