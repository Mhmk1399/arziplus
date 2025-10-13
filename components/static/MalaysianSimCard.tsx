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
import TextBox from "../global/textBox";
import { FaMedal, FaLock } from "react-icons/fa";
import HeroSplitSection from "../global/heroSplitSection";

const MalaysianSimCard = () => {
  const longText = `مجموعه ارزی پلاس با بیش از 10 سال فعالیت در کشور مالزی با توافقات صورت گرفته توانسته است به عنوان نماینده اپراتورهای سلکام و XOX مالزی در این کشور فعالیت کند. سیمکارت های مالزی آنتن دهی مناسبی در ایران داشته و گزینه مناسبی برای افرادی که به شماره تماس بین المللی جهت وریفای حساب های بانکی و وریفای اکانت ها در سایر وب سایت ها نیاز دارند می‌باشد. در سال 2025، با گسترش خدمات دیجیتال و نیاز به verification جهانی، سیمکارت‌های Celcom و XOX به عنوان گزینه‌های ایده‌آل برای فریلنسرها، تریدرها و کاربران پلتفرم‌های بین‌المللی برجسته شده‌اند این سیمکارت‌ها با پوشش گسترده 5G در مالزی و roaming مناسب برای SMS/call بین‌المللی، از شبکه رایتل در ایران برای آنتن‌دهی استفاده می‌کنند، و با پلن‌های prepaid انعطاف‌پذیر مانند CelcomDigi Prepaid 5G Biru (500MB basic + 3GB high-speed برای 7 روز) یا ONE-X Prepaid 2025 XOX (unlimited data/calls از RM18/ماه)، بدون تاریخ انقضا (فقط نیاز به recharge منظم) ارائه می‌شوند ارزی پلاس با صدور فیزیکی به نام متقاضی و ارسال به ایران، فرآیند را ایمن و قانونی نگه می‌دارد، و با مشاوره برای رعایت validity periods (recharge هر 4-100 روز)، از غیرفعال شدن جلوگیری می‌کند.`;

  const simSteps = [
    {
      id: "membership",
      title: "قدم اول: عضویت در سایت",
      description:
        "حساب کاربری خود را درسایت ارزی پلاس ایجاد کنید و اطلاعات اولیه را برای سفارشی‌سازی سیمکارت وارد نمایید.",
      icon: <FaRegClipboard />,
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
      id: "payment",
      title: "قدم سوم: پرداخت",
      description:
        "هزینه سفارش را از طریق شماره حساب سایت پرداخت نمایید، با گزینه‌های امن و شفاف برای پلن‌های prepaid.",
      icon: <FaMoneyBillWave />,
      isActive: true,
    },
    {
      id: "activation",
      title: "قدم چهارم: فعال سازی سیمکارت",
      description:
        "ظرف چند ساعت سیمکارت شما فعال و کمتر از یک هفته به آدرس شما در ایران تحویل داده میشود، همراه با راهنمایی برای recharge اولیه.",
      icon: <FaRocket />,
    },
  ];

  const simWhyUs = [
    {
      id: 1,
      icon: <FaGlobe size={32} />,
      iconColor: "bg-emerald-700",
      title: "سیمکارت های مالزی",
      description:
        "سیمکارت های اپراتور Celcom و XOX مالزی دارای آنتن دهی مناسب در مراکز استان‌های ایران می‌باشند. این سیمکارت ها برای وریفای حساب های بانکی و وریفای اکانت به عنوان شهروند مالزی استفاده ویژه ای دارند. سیمکارت های مالزی به صورت فیزیکی و به نام متقاضی صادر می‌شود و به به آدرس متقاضی در ایران ارسال می شود. قابلیت ارسال و دریافت پیام‌های بین المللی با roaming passes از Sep 2025",
    },
    {
      id: 2,
      icon: <FaPhone size={32} />,
      iconColor: "bg-emerald-700",
      title: "سیمکارت های Celcom",
      description:
        "سیمکارت های سلکام مالزی از نوع اعتباری بوده و تاریخ انقضا ندارند اما ضروری است هر 4 هفته یکبار شارژ شده تا غیرفعال نشوند. در صورت غیرفعال شدن، امکان بازیابی وجود ندارد. این سیم کارت از شبکه رایتل در ایران برای آنتن دهی استفاده می‌کند. به کمک این سیمکارت می‌توانید در تمامی اپلیکیشن ها، وبسایت ها و پلتفرم‌هایی که برای ثبت نام نیازمند شماره بین المللی هستند، ثبت نام کنید و به راحتی از خدمات آن‌ها استفاده نمائید. پلن 5G Biru: 3GB high-speed + unlimited 1Mbps برای 7 days",
    },
    {
      id: 3,
      icon: <FaPhone size={32} />,
      iconColor: "bg-emerald-700",
      title: "سیمکارت های XOX",
      description:
        "سیمکارت های XOX مالزی از نوع دائمی بوده و هر ۱۰۰ روز حداقل ۱ بار باید شارژ شوند. در این مدت زمان تنها در صورت صفر شدن شارژ، برای استفاده مجدد باید آن را شارژ کنید. این سیم کارت نیز از شبکه رایتل در ایران برای آنتن دهی استفاده می‌کند. پلن ONE-X 2025: unlimited data/calls از RM18/ماه، validity 1 year با topup",
    },
    {
      id: 4,
      icon: <FaMapMarkerAlt size={32} />,
      iconColor: "bg-emerald-700",
      title: "مقایسه سیمکارت های Celcom و XOX",
      description:
        "سیمکارت سلکام مالزی اعتباری میباشد و هر سی روز باید شارژ شود در صورت عدم شارژ شدن، سیمکارت غیر فعال شده و مجددا نمی توان آن را فعال کرد. سیمکارت XOX هر ۱۰۰ روز باید شارژ شود. هر دو سیم کارت در ایران قابلیت دریافت و ارسال پیامک و تماس را دارند و می توانید ثبت‌نام های پلتفرم های اینترنتی را که نیازمند داشتن شماره همراه بین المللی هستند را انجام دهید. Celcom: recharge هر 4 weeks, XOX: هر 100 days",
    },
    {
      id: 5,
      icon: <FaShieldAlt size={32} />,
      iconColor: "bg-emerald-700",
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
        heading="سیمکارت مالزی — ارزی پلاس نماینده اپراتور سلکام و XOX مالزی"
        subheading="سیمکارت مالزی"
        description="مجموعه ارزی پلاس با بیش از 10 سال فعالیت در کشور مالزی با توافقات صورت گرفته توانسته است به عنوان نماینده اپراتورهای سلکام و XOX مالزی در این کشور فعالیت کند. سیمکارت‌های Celcom و XOX با پوشش 5G و roaming international، ایده‌آل برای verification در 2025. سیمکارت های مالزی آنتن دهی مناسبی در ایران داشته و گزینه مناسبی برای افرادی که به شماره تماس بین المللی جهت وریفای حساب های بانکی و وریفای اکانت ها در سایر وب سایت ها نیاز دارند می‌باشد."
        buttons={[
          {
            text: "خرید سیمکارت مالزی",
            href: "/register",
            variant: "primary",
            icon: <FaExplosion />,
          },
        ]}
        media={{
          type: "image",
          src: "https://arziPlus.s3.eu-north-1.amazonaws.com/Desktop/42-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQYCWD7YPE%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T110019Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRzBFAiEA0TpciGNG2tq2Y9yih%2FrRNpdT0TQ4MFTjniBtEnNv5uoCICAaqhKHe%2Fku3aen%2BvIUrRuF%2BScz0ksLkz9FVzesQTjxKtYCCCwQABoMMzExMzc2MTIwMjI1Igyq%2BygfxGpD4ignPN4qswI1MwKGfrt8DVsTGfeVCHXAHSjmOPKILG4d0jVR%2FdzSqo5SH2r9%2FLxEEJ2qLcf0DybSup%2FAEH7%2FNXR0ksWuwysKg3p%2BM4xHokibV7TYZb8FLnVUCJdvHS9j%2FxW8D%2BfYfGzO5TQS7vR3PLWpDAxWXOicTtutQiiju2HBpiJ6eeo2zR1S7k4%2FrmHBHHhBGWjckZJxiR0HIQh3TyrDvrjt1a4NI8707bRBusmWId8FNVclCc%2FcvxY3FraEOKRYzmC53QQz92cPJN2gXTHSUfwxKkfuNxfTN78aDskPmlcNisYbpPJQj8Y5KF%2F9dAHy6gySQ%2FxCDLg4ePqn%2FmtjkbOrkGF1iRaMhSwiPMMXfj8FciWjWHrn7nrYR%2B%2Fvv4zypzAmcjnX2eGGdNpLmzHpoYwCHskOjsMZMJLyrccGOq0CPYLpLUye96CO6N0vxOdO0j%2Fb1wOQFHxtQ2s2G%2Fj6hmSuRgiqY8KgsjBYxS7sC5GV5P6Xt87LQk4WmUdKSYuVwfzwPM%2BfptbWjfByxlpEmMdUisD4ELeX8qJ%2Bc3MZPafwedw2jIF6ay2Flwmh%2Bw6gE0R7DVBfIwssRxmBlPyTOg7Rt0XQlforG6j%2BLlfoCdzsJRQ6g0%2F3F%2B7DIkqc3jthszaGr%2Brv457HFZQaAW564XEixS2X4bJLpl6fG8oklaiC9AMHvidfn6Uun9uMVXYwF2KIKszbphTJRAtVHL7VlGq4tHlRFOF%2BR1b%2B63xaRHA6sYE%2BF1Udzwf4WKMgc25XClCQkiLJv21yNByY%2BQLpbKHM6V3Th1gqUQ0mvDZW5NWIQkBn5PVAhd7nTDINeA%3D%3D&X-Amz-Signature=fb1b38835bc432d6a7b21dea0841882d61c63fe5bc2d463a53a5eb78f897c9d7&X-Amz-SignedHeaders=host&response-content-disposition=inline",
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
        buttonLink="/malaysian-sim"
        items={simWhyUs}
        buttonColor="bg-indigo-700 hover:bg-indigo-800 text-white"
        theme={themesWhyus.default}
      />

      <TextBox
        heading="مقایسه سیمکارت های Celcom و XOX"
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
            text: "ثبت درخواست نقد کردن",
            href: "/cashing-paypal",
            variant: "primary",
            icon: <FaShieldAlt />,
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
            href: "/support",
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
        heading="خرید هاست و دامنه دلخواه و مورد نیازت رو بسپار به ارزی پلاس..."
        description="همین الان سفارش خریدت رو ثبت کن. ارزی پلاس با سرعت، امنیت و کارمزد کم، سیمکارت مالزی را مدیریت می‌کند."
        button={{
          text: "خرید سیمکارت مالزی",
          href: "/malaysian-sim",
          variant: "primary",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.primary}
        height={50}
      />
    </div>
  );
};

export default MalaysianSimCard;
