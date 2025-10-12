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
  FaBuilding,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import WhyUsSection from "../global/whyUs";
import FAQSection from "../global/faqSection";
import CTABanner from "../global/ctaBanner";
import TextBox from "../global/textBox";
import { FaMedal, FaLock } from "react-icons/fa";
import HeroSplitSection from "../global/heroSplitSection";

const AddressVerificationDocuments = () => {



  
  const longText = `افراد ساکن ایران برای فعالیت در سایت هایی که کشور ایران را تحت تحریم قرار داده اند باید آدرس محل سکونت خود را کشوری به جز ایران اعلام کنند تا اجازه فعالیت داشته باشند. به همین جهت ارزی پلاس جهت وریفای آدرس قبض و پرینت حساب بانکی از کشور مالزی و اسپانیا به نام فرد متقاضی صادر می کند. توجه داشته باشید در این روش هیچ گونه آدرس و هویت غیرواقعی (فیک) ایجاد نمی شود و تمامی مدارک با هویت واقعی فرد درخواست کننده و مطابق با مشخصات پاسپورت فرد متقاضی می باشد. با خدمات مدارک تایید آدرس ارزی پلاس، فرآیند وریفای آدرس برای پلتفرم‌های تحریم‌شده مانند Upwork، PayPal، Binance و حساب‌های بانکی بین‌المللی را بدون چالش‌های تحریم‌ها مدیریت کنید — همه چیز با جزئیات واقعی و قانونی، مطابق با استانداردهای GDPR و KYC در سال 2025. ارزی پلاس با همکاری شرکای معتبر در مالزی (مانند Maybank برای پرینت حساب بانکی) و اسپانیا (مانند BBVA برای قبض‌های رسمی)، مدارک را در کمتر از 24 ساعت صادر می‌کند، با تمرکز بر حفظ حریم خصوصی و جلوگیری از ریسک‌های احراز هویت مجدد. تصور کنید بدون نگرانی از رد شدن مدارک فیک، فقط روی فعالیت دلاری‌تان تمرکز کنید — ارزی پلاس دقیقاً این امنیت و سرعت را برای هزاران کاربر ایرانی فراهم کرده است. علاوه بر این، خدمات شامل مشاوره رایگان برای انتخاب کشور مناسب (مالزی برای fintech آسیایی، اسپانیا برای EU banking) و پشتیبانی پس از صدور برای تمدید یا به‌روزرسانی است.`;

  const verificationSteps = [
    {
      id: "membership",
      title: "قدم اول: عضویت در سایت",
      description:
        "حساب کاربری خود را درسایت ارزی پلاس ایجاد کنید و اطلاعات پاسپورت و جزئیات هویتی را برای صدور مدارک واقعی وارد نمایید.",
      icon: <FaRegClipboard />,
      isActive: true,
    },
    {
      id: "request",
      title: "قدم دوم: ثبت درخواست",
      description:
        "درخواست خود را از طریق فرم ثبت سفارش ارسال کنید، با انتخاب کشور (مالزی یا اسپانیا) و نوع مدرک (قبض یا پرینت حساب بانکی).",
      icon: <FaDollarSign />,
    },
    {
      id: "payment",
      title: "قدم سوم: پرداخت",
      description:
        "هزینه سفارش را از طریق شماره حساب سایت پرداخت نمایید، با نرخ‌های رقابتی و شفاف برای وریفای آدرس.",
      icon: <FaMoneyBillWave />,
      isActive: true,
    },
    {
      id: "delivery",
      title: "قدم چهارم: ارائه مدرک درخواستی",
      description:
        "مدارک درخواستی شما حداکثر تا یک روز کاری بعد آماده می‌شود، با فرمت دیجیتال (PDF) و مشاوره برای استفاده در پلتفرم‌های تحریم‌شده.",
      icon: <FaRocket />,
    },
  ];

  const verificationWhyUs = [
    {
      id: 1,
      icon: <FaFileInvoiceDollar size={32} />,
      iconColor: "bg-emerald-700",
      title: "ارائه پرینت حساب بانکی جهت تایید محل سکونت",
      description:
        "تمام اطلاعات وارد شده به نام فرد متقاضی و بر اساس اطلاعات پاسپورت وی می باشد. پرینت حساب بانکی از Maybank مالزی یا BBVA اسپانیا، با جزئیات واقعی برای KYC در 2025.",
    },
    {
      id: 2,
      icon: <FaBuilding size={32} />,
      iconColor: "bg-emerald-700",
      title:
        "قبض و پرینت حساب بانکی در حال حاضر از کشورهای مالزی و اسپانیا صادر می شود",
      description:
        "قبض‌های رسمی با آدرس معتبر و هویت واقعی، ایده‌آل برای وریفای آدرس در Upwork، PayPal و Binance، بدون ریسک رد شدن به دلیل فیک بودن.",
    },
    {
      id: 3,
      icon: <FaShieldAlt size={32} />,
      iconColor: "bg-emerald-700",
      title: "هیچ گونه آدرس و هویت غیرواقعی (فیک) ایجاد نمی شود",
      description:
        "تمامی مدارک با هویت واقعی فرد درخواست کننده و مطابق با مشخصات پاسپورت فرد متقاضی می باشد، مطابق با استانداردهای قانونی و GDPR برای امنیت حداکثری.",
    },
    {
      id: 4,
      icon: <FaHeadset size={32} />,
      iconColor: "bg-emerald-700",
      title: "پشتیبانی کامل پس از صدور",
      description:
        "مشاوره رایگان برای استفاده از مدارک در پلتفرم‌های تحریم‌شده، تمدید یا به‌روزرسانی، و جلوگیری از مشکلات احراز هویت مجدد.",
    },
    {
      id: 5,
      icon: <FaGlobe size={32} />,
      iconColor: "bg-emerald-700",
      title: "صدور سریع و قانونی",
      description:
        "مدارک در کمتر از 24 ساعت آماده، با همکاری شرکای معتبر برای وریفای آدرس در مالزی و اسپانیا، بدون نیاز به سفر یا مدارک اضافی.",
    },
  ];

  const verificationFaq = [
    {
      id: "1",
      question:
        "افراد ساکن ایران برای فعالیت در سایت هایی که کشور ایران را تحت تحریم قرار داده اند باید آدرس محل سکونت خود را کشوری به جز ایران اعلام کنند تا اجازه فعالیت داشته باشند؟",
      answer:
        "بله، ارزی پلاس با صدور مدارک تایید آدرس از مالزی و اسپانیا، وریفای آدرس را بدون چالش‌های تحریم‌ها تسهیل می‌کند، با تمرکز بر هویت واقعی برای KYC در 2025.",
      category: "تحریم‌ها و وریفای",
    },
  ];

  return (
    <div>
      <HeroSection
        heading="مدارک تایید آدرس | قبض و پرینت حساب بانکی"
        subheading="مدارک تایید آدرس"
        description="به همین جهت ارزی پلاس جهت وریفای آدرس قبض و پرینت حساب بانکی از کشور مالزی و اسپانیا به نام فرد متقاضی صادر می کند. توجه داشته باشید در این روش هیچ گونه آدرس و هویت غیرواقعی (فیک) ایجاد نمی شود و تمامی مدارک با هویت واقعی فرد درخواست کننده و مطابق با مشخصات پاسپورت فرد متقاضی می باشد. خدمات تایید آدرس ارزی پلاس، راهکاری امن و قانونی برای وریفای آدرس در پلتفرم‌های تحریم‌شده. افراد ساکن ایران برای فعالیت در سایت هایی که کشور ایران را تحت تحریم قرار داده اند باید آدرس محل سکونت خود را کشوری به جز ایران اعلام کنند تا اجازه فعالیت داشته باشند."
        buttons={[
          {
            text: "درخواست مدرک تایید آدرس",
            href: "/register",
            variant: "primary",
            icon: <FaExplosion />,
          },
        ]}
        media={{
          type: "image",
          src: "https://arziplus.s3.eu-north-1.amazonaws.com/Desktop/49-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQYFLQHJ5D%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T110656Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRzBFAiEA%2FUABvA5plHk8vNWnUP0p97hbjqx0cVwR43qPwyqOXVECIAv6qfPKymQocp15dm5SGmT6xwMwh1pZlOIpNq5IYxuoKtYCCCwQABoMMzExMzc2MTIwMjI1IgwT6KoWGvgpRS%2BUrxkqswL%2FhEKQDOh3trY02Q4d3gc3UQa4eAwKX2xiYDefYIKC5117GWiKcFRTWaL1%2BEdpfqqTyH4JOXYfmpV%2FauAD9TNDJz8Zt4kBZyqZP8xldBwmgRLJUyEIc7zvurh%2BZj9eozgK1dIRsbXFpxEloxnHheiCMg%2B5IcWjh93keISV1gfijR1uEtr%2Fg9urvlbncRP2sBq1d%2FmGN5BtUNifRTQvlSr3Cbu8LeLSAAjdKuCoHTdKYmNt6rpVfo1ZwMxjDSkkMYaatWjMoYyFiK5iJXL6Q7Ti0BoXJKD5R3X91p95G2MCjUzVnsDEiQz7HpEq43rLtGdbu0s3Pj9exN9m%2BHEGOmaxDZZVmvUMMbbUWJOBEE7p%2FkuNAPbqJLUkxcjYAIH%2Bg0eRVskg9tNHWx%2Fc8kdYv0SDo2PDMJLyrccGOq0CUNx3Ac0JKX4IO1h0P%2B5b5qCLRADj6QMAxOk5bcg2%2BnQRoFSaiSaZmNavtRvJf59Ai3y9TZHNVf8Os05%2B2MyxzmiqeA1Ipo%2Bz0f0b7RqDQFi4jkSBMmTDhI%2FJzQPO0%2FWO5UJxNUUtx6e4VL5YKuGpCzPcDbdhOjhWfUKUGcGTnO7hiiyHN587kcWmY3CkqRI2PQAoQ%2BRpt7j%2B7%2FL1k8wK8tlecUAHDaXVTKPFH2RoCbFDumRWio4fnm222XfeQw8xyZE11%2FrFwpFaKbVyQy5S7vfYqR77hxdW0z7IMkH9TsL1vBmZAwv06GzDudAvWDaTLGLFiYFG19DQiq1vas%2Bx8ZWNQnDcGZofG9tMF0gS5EC5keCEkbWUc9J2rYVAn5wv8nk485j%2F5Oy5p6%2FSGw%3D%3D&X-Amz-Signature=5e59b8f3beba902fce71501758bfa2e488f553f40a2bfb8d07f0db69aee832b7&X-Amz-SignedHeaders=host&response-content-disposition=inline",
          alt: "مدارک تایید آدرس با ارزی پلاس",
          width: 1200,
          height: 800,
        }}
        layout="default"
        theme={{
          headingColor: "text-gray-50",
          subheadingColor: "text-gray-700",
          descriptionColor: "text-gray-200",
          backgroundColor: "bg-indigo-700",
          bgSubHeadingColor: "bg-fuchsia-50",
        }}
      />

      <StepsSection
        heading="مراحل انجام صدور پرینت صدور حساب بانکی"
        description="قدم به قدم با ارزی پلاس، مدارک تایید آدرس را دریافت کنید."
        steps={verificationSteps}
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
        heading="خدمات تایید آدرس مجموعه ارزی پلاس"
        description="ارائه پرینت حساب بانکی جهت تایید محل سکونت تمام اطلاعات وارد شده به نام فرد متقاضی و بر اساس اطلاعات پاسپورت وی می باشد قبض و پرینت حساب بانکی در حال حاضر از کشورهای مالزی و اسپانیا صادر می شود مزایای خرید مدارک تایید آدرس از ارزی پلاس هزینه مناسب تحویل سریع امکان شارژ سیم کارت توسط ارزی پلاس نماینده فروش مدارک تایید آدرس با بیش از ده سال سابقه"
        buttonText="درخواست مدرک"
        buttonLink="/address-verification"
        items={verificationWhyUs}
        buttonColor="bg-indigo-700 hover:bg-indigo-800 text-white"
        theme={themesWhyus.default}
      />

      <TextBox
        heading="ویژگی و کاربرد‌های اختصاصی مدارک تایید آدرس ارزی پلاس"
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
        heading="سوال پر تکرار"
        description="پاسخ به متداول‌ترین سوالاتی که در ذهن دارید درباره مدارک تایید آدرس"
        faqItems={verificationFaq}
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
        heading="مدارک تایید آدرس | قبض و پرینت حساب بانکی"
        description="ارزی پلاس مدارک وریفای آدرس از مالزی و اسپانیا را با هویت واقعی صادر می‌کند — سریع، امن و قانونی."
        button={{
          text: "درخواست مدرک تایید آدرس",
          href: "/address-verification",
          variant: "primary",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.primary}
        height={50}
      />
    </div>
  );
};

export default AddressVerificationDocuments;
