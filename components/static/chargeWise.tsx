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
  FaBolt,
  FaGlobeAmericas,
} from "react-icons/fa";
import HeroSplitSection from "../global/heroSplitSection";
import WhyUsSection from "../global/whyUs";
import FAQSection from "../global/faqSection";
import CTABanner from "../global/ctaBanner";
import TextBox from "../global/textBox";

const WiseCharge = () => {
  const longText = ` شارژ حساب وایز چه مزایایی برای شما دارد؟
شارژ حساب وایز از ارزی پلاس این امکان را در اختیار شما قرار می‌دهد تا بدون نیاز به حساب ارزی به صورت بین المللی پول ارسال یا دریافت کنید. شاید فکر کنید که هزینه کارمزد چنین شبکه‌ای برای تبدیل نرخ ارزها به یکدیگر باید بالا باشد اما وایز از رقبای خود بسیار ارزان‌تر است. انتقال و دریافت پول از طریق وایز به صورت دیجیتالی است به این شکل که شما برای انتقال پول باید نام دارنده حساب مقصد و ایمیل حساب مقصد را وارد کنید. سپس با پرداخت مبلغ ریالی انتقال به ما، انتقال به صورت آنی برای شما انجام خواهد شد. حجم انتقال وجه در حساب وایز معمولاً بالا است و مشکلی برای انتقال وجه وجود ندارد. البته بهتر است که قبل از انتقال مبالغ سنگین از پشتیبانی ارزی پلاس مشاوره بگیرید. 

برای شارژ حساب وایز و انتقال وجه بین‌المللی چه چیزهایی نیاز است؟
برای شارژ حساب وایز نام و آدرس ایمیل حساب مقصد مورد نیاز است. امکان ارسال پول با سه واحد اصلی یعنی یورو، دلار و پوند در حال حاضر امکان‌پذیر است. محاسبه ریالی مبلغ شارژ بر اساس نرخ روز ارزهای مورد نظر خواهد بود و مبلغ اضافه‌ای از شما دریافت نخواهد شد. زمان انتقال وجه با حساب وایز از 1 تا 3 ساعت طول می‌کشد که البته این موضوع به مبلغی که می‌خواهید ارسال کنید دارد و در برخی اوقات ممکن است تا 1 الی 2 روز نیز به طول بی‌انجامد. وایز یک سیستم پرداخت است که در سال 2011 در کشور انگلستان شروع به کار کرد. هدف اصلی وایز این بود که انتقال وجه از یک کشور به کشور دیگر را آسان و ارزان‌تر کند. برای مثال، در آن زمان اگر فردی از یک کشور اروپایی مثل آلمان (یورو) می‌خواست مقداری وجه به آمریکا (دلار) انتقال دهد باید علاوه بر کارمزد انتقال، هزینه تبدیل ارزها را نیز باید پرداخت می‌کرد. حساب وایز یکی از سیستم‌های بانکی بسیار خوب به شمار می‌رود که سرعت انتقال وجه بسیار سریعی دارد.

علاوه بر این، کارمزدی که وایز از کاربران برای انتقال وجه بین‌المللی دریافت می‌کند در مقایسه با رقبای دیگر بسیار کمتر است. برای این که پول را به صورت الکترونیکی انتقال دهید باید شماره حساب وایز طرف مقابل که همان ایمیل او در سایت wise است را از او بگیرید. در حقیقت، با وایز شما پول از مرزهای کشور خارج نمی‌کنید بلکه آن را به حساب وایز واریز می‌کنید و آن پول را به کشور دیگری انتقال می‌دهد.  شارژ حساب وایز در ارزی پلاس نیز به راحتی انجام می‌شود و شما با دادن ایمیل فردی که می‌خواهید برای او پول منتقل کنید می‎‌توانید انتقال وجه بین‌المللی را انجام دهید. اگر شما درآمدی دارید و می‌خواهید آن را طریق وایز نقد کنید، وارد پنل کاربری شوید و نقد کردن درآمد وایز را انتخاب کنید. کارشناسان مجموعه ارزی پلاس در سریع ترین زمان ممکن درخواست نقد شما را انجام خواهند داد.
`;

  // Steps derived and expanded from provided data, SEO-friendly and unique
  const wiseChargeSteps = [
    {
      id: "register",
      title: "ثبت‌نام سریع در ارزی پلاس",
      description:
        "با چند مرحله ساده در ارزی پلاس ثبت‌نام کنید و پنل کاربری خود را فعال نمایید.",
      icon: <FaRegClipboard />,
      isActive: true,
    },
    {
      id: "enterAmount",
      title: "وارد کردن مبلغ و انتخاب ارز",
      description:
        "مقدار موردنظر برای شارژ حساب وایز (دلار، یورو یا پوند) را وارد کنید تا معادل ریالی محاسبه شود.",
      icon: <FaDollarSign />,
    },
    {
      id: "payInRial",
      title: "پرداخت ریالی به‌سرعت",
      description:
        "معادل ریالی مبلغ را از طریق درگاه‌های امن پرداخت کنید؛ رسید پرداخت به‌صورت خودکار ثبت می‌شود.",
      icon: <FaMoneyBillWave />,
      isActive: true,
    },
    {
      id: "instantTopup",
      title: "شارژ آنی و اتوماتیک",
      description:
        "پس از تأیید پرداخت، حساب وایز شما به‌صورت آنی یا در بازهٔ ۱ تا ۳ ساعت شارژ خواهد شد.",
      icon: <FaBolt />,
      isActive: true,
    },
    {
      id: "transfer",
      title: "انتقال وجه بین‌المللی",
      description:
        "با حساب شارژ شده می‌توانید به‌راحتی به هر نقطهٔ دنیا پول ارسال یا دریافت کنید.",
      icon: <FaExchangeAlt />,
    },
    {
      id: "support",
      title: "پشتیبانی و مشاوره تخصصی",
      description:
        "پشتیبانان ارزی پلاس در تمام مراحل در دسترس هستند تا پاسخ‌گوی سؤالات و راهنمایی‌های لازم باشند.",
      icon: <FaHeadset />,
    },
  ];

  const wiseItemsWhyus = [
    {
      id: 1,
      icon: <FaGlobeAmericas size={32} />,
      iconColor: "bg-blue-700",
      title: "ارسال و دریافت بین‌المللی با وایز",
      description:
        "وایز (Wise) بستری امن و ارزان برای انتقال پول بین‌المللی است؛ با شارژ حساب در ارزی پلاس می‌توانید پرداخت‌های برون‌مرزی خود را سریع انجام دهید.",
    },
    {
      id: 2,
      icon: <FaPercentage size={32} />,
      iconColor: "bg-blue-700",
      title: "کارمزد پایین و نرخ رقابتی",
      description:
        "نرخ تبدیل و کارمزد خدمات در ارزی پلاس شفاف و اقتصادی است؛ هزینه‌ها پیش از انجام تراکنش به‌صورت کامل نمایش داده می‌شوند.",
    },
    {
      id: 3,
      icon: <FaClock size={32} />,
      iconColor: "bg-blue-700",
      title: "سرعت انجام تراکنش",
      description:
        "اغلب تراکنش‌ها ظرف ۱ تا ۳ ساعت انجام می‌شود و در موارد معمولاً کمتر از چند ساعت تکمیل می‌گردد.",
    },
    {
      id: 4,
      icon: <FaLock size={32} />,
      iconColor: "bg-blue-700",
      title: "امنیت و محرمانگی اطلاعات",
      description:
        "اطلاعات حساب و تراکنش‌ها در ارزی پلاس با استانداردهای امنیتی مدیریت می‌شود و محرمانگی کامل رعایت می‌شود.",
    },
    {
      id: 5,
      icon: <FaHeadset size={32} />,
      iconColor: "bg-blue-700",
      title: "پشتیبانی و مشاوره اختصاصی",
      description:
        "قبل از انتقال مبالغ بالا می‌توانید از مشاورهٔ رایگان کارشناسان ما برای کاهش ریسک و انتخاب بهترین روش استفاده کنید.",
    },
  ];

  const wiseFaqData = [
    {
      id: "1",
      question: "شارژ حساب وایز چگونه انجام می‌شود؟",
      answer:
        "کافی است در ارزی پلاس ثبت‌نام کنید، سفارش شارژ وایز ثبت نمایید، ایمیل حساب مقصد را وارد کنید و معادل ریالی را پرداخت کنید؛ ما حساب شما را شارژ می‌کنیم.",
      category: "عمومی",
    },
    {
      id: "2",
      question: "چه ارزهایی در ارزی پلاس قابل شارژ با وایز هستند؟",
      answer:
        "در حال حاضر امکان شارژ با سه ارز اصلی شامل دلار (USD)، یورو (EUR) و پوند (GBP) وجود دارد. در صورت نیاز به ارزهای دیگر با پشتیبانی تماس بگیرید.",
      category: "ارزها",
    },
    {
      id: "3",
      question: "مدت زمان انجام شارژ چقدر است؟",
      answer:
        "معمولاً بین ۱ تا ۳ ساعت، بسته به مبلغ و شرایط بانکی زمان لازم است؛ در موارد نادر تا ۱ الی ۲ روز ممکن است طول بکشد.",
      category: "سرعت",
    },
    {
      id: "4",
      question: "آیا سقف برای شارژ وجود دارد؟",
      answer:
        "خیر؛ ارزی پلاس محدودیتی برای سقف شارژ اعلام نکرده و شما می‌توانید بر اساس نیاز خود سفارش ثبت کنید. برای مبالغ بسیار بالا توصیه به مشاوره با پشتیبانی می‌شود.",
      category: "سقف شارژ",
    },
    {
      id: "5",
      question: "برای انتقال پول به حساب وایز چه اطلاعاتی نیاز است؟",
      answer:
        "نام صاحب حساب و آدرس ایمیل حساب وایز مقصد مورد نیاز است؛ در صورتی که نیاز به اطلاعات بیشتر باشد، پشتیبانی ارزی پلاس راهنمایی خواهد کرد.",
      category: "مدارک موردنیاز",
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
        heading="شارژ حساب وایز (Wise) در ایران — سریع، امن و با کارمزد مناسب"
        subheading="شارژ آنی حساب وایز با ارزی پلاس"
        description={`ارزی پلاس ارائه‌دهندهٔ سرویس شارژ حساب وایز در ایران است. با خدمات ما می‌توانید بدون نیاز به حساب ارزی، حساب وایز خود را شارژ کرده و به‌راحتی پول ارسال یا دریافت کنید. خدمات ما شامل پرداخت سریع، نرخ‌های شفاف و پشتیبانی تخصصی است که تجربهٔ امن و مطمئنی برای کاربران فراهم می‌کند.`}
        buttons={[
          {
            text: "شارژ سریع حساب وایز",
            href: "/register",
            variant: "secondary",
            icon: <FaExplosion />,
          },
        ]}
        media={{
          type: "image",
          src: "https://arziplus.s3.eu-north-1.amazonaws.com/Desktop/18-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQUUDOL5QN%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T095303Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRjBEAiBXtYOL4KzukItKW5cR06TECtEWmkaI3TidbrFQH86OXAIgKko%2FfYGv3y%2F9FnCTE8qnqOoB%2BlXOmAF%2FzAmZuVwGWz0q1gIIKxAAGgwzMTEzNzYxMjAyMjUiDB7Y3t%2Bar%2FCrii3AvSqzAnHLh6gk6p2Jez9yo%2F84PgH%2FWb9ZNf8PVjj72WI40Z1NNx7QfeywUw491EK56YJXmyyaWw1%2FlYLoI3GmmqVRcj%2BaBh5C%2FOWIkqul7vr4XkTksVLT4zkSXjhUK1mxRYi9%2BdZ3Qv5p1%2F1mlsgV2X%2FoYpYLjEMypFKfRYpJhZPbSQEhot28za3HCQZn0JZk8Ltf9uL6I1v%2BerRG%2Fsxh7NN7DbqXEEsjc%2BoiTbbq8m7xErr9z4u0y7%2BW4RixvFpE3qcMxPH5pPusGQuGDRHkilS%2FUo06dVDPnUFWJwRCIzgCUL6VleL3vZ5wopEKYEKKGyjOyZEzBRF%2BBxg7zq4FPxtXKWCew00a99w3HL%2BiHpANrdFGE7rkO58nr1R994Mpbok2a5tcUgjaVlb5wZNKI95w2OtwupMwkvKtxwY6rgKHUBs7LkdPKSSMrgcPgR%2B4pCCGtyONHpe5L4bq7JbROknolB%2BEwUtjNxTotEafRFRUwUrUQ7hEU0TCqHC64eOCl1DDw2MfmSIEUMEJmL7I8s%2Fr633kXmNzNGGL9V2n6bAnzt%2Bau4WLk7HjmQdrZ7UcvlWh6HHkGijd%2FcMgxA7fItq0DmkJJwNskemAFkXyuV2yfiGNtz0M8EY51KgHK4wM5jwEs6Q5Vex1cSeK1Zl%2B6UMGtWC7WKvfwOXToZmIe6qbk85rWVzUBudeRjgxnjhUss%2BCEe35uiU3CpB7Mt150hvn3QAYyq7bGZ1kVNHpWpRoIe3oauIBFyw9da0T0D0S9boJxFgrciFDI3aenGwAT7aCs9C1gbm7dZNSPCNLB3JOmx0pb47%2BLul%2BppYQjQ%3D%3D&X-Amz-Signature=74daed03c24e9dbc9ef422f2aea7f06802c5eadadf970fa8aeb2d23a479a92f2&X-Amz-SignedHeaders=host&response-content-disposition=inline",
          alt: "شارژ حساب وایز در ارزی پلاس",
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
        heading="چرا شارژ حساب وایز؟"
        description={`شارژ حساب وایز با ارزی پلاس امکان ارسال پول بین‌المللی را با هزینهٔ کمتر، سرعت بالاتر و فرایندی ساده فراهم می‌کند. خدمات ما مناسب افرادی است که به دنبال انتقال سریع، امن و مقرون‌به‌صرفه پول هستند.`}
        steps={wiseChargeSteps}
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
        heading="مزایا و کاربردها"
        description="با شارژ حساب وایز از ارزی پلاس می‌توانید انتقال وجه، دریافت درآمدهای ارزی و پرداخت‌های بین‌المللی را به‌راحتی انجام دهید. برخی از کاربردهای متداول عبارت‌اند از:"
        buttonText="شارژ حساب وایز"
        buttonLink="/wise-topup"
        items={wiseItemsWhyus}
        buttonColor="bg-emerald-700 hover:bg-emerald-800 text-white"
        theme={themesWhyus.default}
      />
      <TextBox
        heading="شارژ حساب وایز"
        content={longText}
        height={280}
        theme={textBoxThemes.minimal}
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
        heading="چرا ارزی پلاس بهترین انتخاب است؟"
        subHeading="امنیت، شفافیت و سرعت در خدمات شارژ وایز"
        description={`ارزی پلاس با تیمی مجرب و فرایندهای استاندارد، شارژ حساب وایز را به‌صورت امن و سریع انجام می‌دهد. نرخ‌ها و کارمزدها پیش از انجام تراکنش شفاف ارائه می‌شود و پشتیبانی پاسخگو در تمام مراحل همراه شماست.`}
        buttons={[
          {
            text: "ثبت سفارش شارژ وایز",
            href: "/wise-topup",
            variant: "primary",
            icon: <FaShieldAlt />,
          },
        ]}
        imageSrc="/assets/images/wise2.webp"
        imageAlt="شارژ حساب وایز با ارزی پلاس"
        theme={splitSectionThemes.dark}
        layout="image-left"
        imageWidth="1/2"
        features={[
          {
            id: 1,
            title: "بدون محدودیت سقف شارژ",
            description:
              "در ارزی پلاس محدودیتی برای شارژ حساب وایز وجود ندارد؛ برای مبالغ بالا قبل از ثبت نهایی با پشتیبانی هماهنگ کنید.",
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
            title: "سرعت بالا در پردازش سفارش",
            description:
              "معمولاً سفارش‌ها در بازهٔ ۱ تا ۳ ساعت تکمیل می‌شوند و پیگیری لحظه‌ای از طریق پنل امکان‌پذیر است.",
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
            title: "نرخ شفاف و منصفانه",
            description:
              "محاسبهٔ معادل ریالی بر اساس نرخ روز انجام می‌شود و هیچ هزینهٔ پنهانی از شما دریافت نخواهد شد.",
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
            title: "پشتیبانی سریع و اختصاصی",
            description:
              "تیم ارزی پلاس در تمام طول فرآیند همراه شماست و برای رفع هرگونه سوال و مشکل پاسخگو خواهد بود.",
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
        heading="پرسش‌های متداول شارژ وایز"
        description="پاسخ به سؤالات رایج درباره خدمات شارژ حساب وایز در ارزی پلاس"
        svgIcon={faqIcons.info}
        faqItems={wiseFaqData}
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
        heading="  حساب وایز خود را در ارزی پلاس شارژ کنید"
        description="شارژ حساب وایز با نرخ شفاف، سرعت بالا و پشتیبانی تخصصی — اکنون ثبت سفارش کنید."
        button={{
          text: "ثبت سفارش شارژ وایز",
          href: "/wise-topup",
          variant: "primary",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.primary}
        height={50}
      />
    </div>
  );
};

export default WiseCharge;
