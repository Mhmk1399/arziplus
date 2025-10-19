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
  FaShieldAlt,
  FaGlobe,
  FaPhone,
} from "react-icons/fa";
import WhyUsSection from "../global/whyUs";
import FAQSection from "../global/faqSection";
import CTABanner from "../global/ctaBanner";
import TextBox from "../global/textBox";
import { FaMedal, FaLock, FaHeadset } from "react-icons/fa";
import HeroSplitSection from "../global/heroSplitSection";
import { FaSimCard } from "react-icons/fa";

const EstonianSimCard = () => {
  const longText = `مجموعه ارزی پلاس با بیش از 13سال فعالیت در خدمات بین الملل با توافقات صورت گرفته توانسته است به عنوان نماینده فروش سیم‌کارت‌های ودافون انگلیس، سیم‌کارت استونی و سلکام مالزی فعالیت کند. هر سیم‌کارت با  پیش شماره رسمی آن کشور ارائه می‌شود: در سال 2025، سیمکارت‌های prepaid استونی از اپراتورهای Elisa, Tele2 و Telia با پلن‌های مقرون‌به‌صرفه از 5€ (شامل 5-10GB داده EU + calls/SMS)، گزینه‌ای ایده‌آل برای verification بین‌المللی و roaming فراهم می‌کنند. ارزی پلاس با صدور فیزیکی و ارسال به ایران، فرآیند را ایمن نگه می‌دارد، و با recharge هر 5 ماه، از غیرفعال شدن جلوگیری می‌کند. این سیمکارت‌ها با پوشش 5G در استونی و roaming partners در 220+ کشور (شامل ایران از طریق MCI/RighTel)، برای فریلنسرها، تریدرها و کاربران crypto مناسب هستند.`;

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
        "درخواست خود را از طریق فرم ثبت سفارش ارسال کنید، با انتخاب اپراتور Elisa/Tele2/Telia و جزئیات پلن مورد نظر.",
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
      icon: <FaShieldAlt size={32} />,
      title: "این سیمکارت در ایران آنتن دهی ندارد",
      description:
        "این سیم‌کارت در ایران آنتن ندارد، اما برای SMS و Call Verification در سایت‌های تحریم‌شده عالی است. رومینگ دیتا فعال اما بسیار گران (تا ‎250$/GB‎) بوده و استفاده از اینترنت آن در ایران توصیه نمی‌شود.",
    },
    {
      id: 2,
      icon: <FaGlobe size={32} />,
      title: "ویژگی‌ و کاربرد‌ سیم‌کارت‌های بین المللی",
      description:
        "مناسب برای ثبت‌نام و احراز هویت در سایت‌های فریلنسری، بروکرها، صرافی‌های ارز دیجیتال، گیمینگ، و پلتفرم‌های هوش مصنوعی مانند Upwork، Binance و ChatGPT. همچنین برای ساخت اکانت در شبکه‌های اجتماعی بدون نیاز به شماره مجازی.",
    },
    {
      id: 3,
      icon: <FaPhone size={32} />,
      title: "ویژگی و کاربرد‌های اختصاصی سیم‌کارت‌های بین المللی ارزی پلاس",
      description:
        " گزینه‌ای ایده‌آل برای افرادی که قصد سفر، اقامت، ثبت شرکت یا ایجاد حساب بانکی در خارج دارند. سیم‌کارت استونی برای e-Residency و Banking Verification فوق‌العاده بوده و در حوزه فین‌تک و فریلنسینگ کاربرد فراوان دارد.",
    },
    {
      id: 4,
      icon: <FaShieldAlt size={32} />,
      title: "توجه! شارژ منظم",
      description:
        " سیم‌کارت استونی باید هر ۵ ماه شارژ و حداقل یک‌بار استفاده شود (ارسال پیامک یا تماس کوتاه). در غیر این صورت غیرفعال شده و بازیابی آن ممکن نیست. مشابه سیم‌کارت‌های Elisa با شارژ هر ‎90‎ روز.",
    },
    {
      id: 5,
      icon: <FaDollarSign size={32} />,
      title: "مزایای خرید سیمکارت از ارزی پلاس",
      description:
        "تحویل سریع، قیمت مناسب، پشتیبانی شارژ مستقیم و نمایندگی رسمی بیش از ۱۰ ساله. عرضه سیم‌کارت‌های بین‌المللی با پلن‌های Tele2 از ۵ یورو برای خدمات SMS و وریفای بین‌المللی با ارسال ایمن به ایران.",
    },
  ];

  const simFaq = [
    {
      id: "1",
      question: "آیا سیم‌کارت‌ها واقعی هستند؟",
      answer:
        "بله، سیم‌کارت‌ها به صورت فیزیکی هستند و به نام متقاضی فعال و به آدرس شما در ایران ارسال میشوند. از اپراتورهای معتبر مانند Elisa/Tele2/Telia، با physical SIM برای international use",
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
        "خیر، این سیم‌کارت‌ها تاریخ انقضا ندارند و فقط لازم است که هر 4 هفته یک بار شارژ شوند تا غیرفعال نشوند. استونی prepaid: recharge هر 90 days برای validity در Telia",
      category: "تاریخ انقضا",
    },
    {
      id: "4",
      question: "سیم‌کارت چه کشورهایی موجود است؟",
      answer:
        "در حال حاضر سیم‌کارت ودافون انگلیس، O2 آلمان، استونی و سلکام مالزی موجود می‌باشد. استونی از Elisa/Tele2 برای e-Residency و fintech verification ایده‌آل است",
      category: "کشورهای موجود",
    },
    {
      id: "5",
      question: "وضعیت آنتن دهی این سیم‌کارت‌ها در ایران چگونه است؟",
      answer:
        "کلیه سیم‌کارت‌های مجموعه ارزی پلاس از پوشش مناسبی در کشور برخوردار بوده و قابلیت دریافت پیامک و تماس‌های بین المللی را دارا می‌باشند. استونی با roaming partners ایرانی مانند RighTel برای coverage SMS",
      category: "آنتن‌دهی",
    },
    {
      id: "6",
      question: "آیا از ایران می‌توان با این سیم‌کارت‌ها تماس گرفت؟",
      answer:
        "بله، اما هزینه‌های تماس آن طبق تعرفه رومینگ حساب می‌شود. برای calls به EU/international، rates از 0.09€/min در Tele2 Estonia",
      category: "تماس از ایران",
    },
  ];

  return (
    <div>
      <HeroSection
        heading="سیم‌کارت‌ بین المللی استونی  ارزی پلاس نماینده فروش سیم‌کارت های بین المللی"
        subheading="شارژ سیم‌کارت بین‌المللی – ارزی پلاس"
        description="این سیمکارت در ایران آنتن دهی ندارد، اما برای verification SMS-based ایده‌آل است، با prepaid plans از Elisa/Tele2/Telia در 2025 از 5€، تمرکز روی international SMS/call برای Upwork و banking. هر سیم‌کارت با  پیش شماره رسمی آن کشور ارائه می‌شود:"
        buttons={[
          {
            text: "خرید سیمکارت استونی",
            href: "/services/EstonianSimCard",
            variant: "secondary",
            icon: <FaExplosion />,
          },
        ]}
        media={{
          type: "image",
          src: "https://arziplus.storage.c2.liara.space/images/pages/45-min.png",
          alt: "سیمکارت استونی با ارزی پلاس",
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
        heading="چهار گام تا دریافت سیم‌کارت فیزیکی بین الملل"
        description="با ارزی پلاس، فرآیند خرید و فعال‌سازی سیمکارت استونی ساده و سریع است."
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
        heading="ویژگی‌ و کاربرد‌ سیم‌کارت‌های بین المللی"
        description="با این سیم‌کارت می‌توانید در سایت‌های فریلنسری، گیمینگ، ترید، صرافی‌های ارزی، OpenAI و شبکه‌های اجتماعی ثبت‌نام کنید. پشتیبانی آنتن در ایران فعال است اما اینترنت آن رومینگ و بسیار گران (حدود ‎250‎ دلار/GB) می‌باشد."
        buttonText="خرید سیمکارت"
        buttonLink="/services/EstonianSimCard"
        items={simWhyUs}
        theme={themesWhyus.default}
      />

      <TextBox
        heading="ویژگی و کاربرد‌های اختصاصی سیم‌کارت‌های بین المللی ارزی پلاس"
        content={longText}
        height={300}
        animate={false}
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
        heading="چرا ارزی پلاس؟"
        subHeading="سابقه، امنیت و پشتیبانی حرفه‌ای"
        description="ارزی پلاس با سابقه چندین ساله، تضمین امنیت تراکنش‌ها و نرخ رقابتی، بهترین گزینه برای نقد کردن پی‌پال است."
        buttons={[
          {
            text: "ثبت درخواست  سیم کارت",
            href: "/services/EstonianSimCard",
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
        description="پاسخ به متداول‌ترین سوالاتی که در ذهن دارید درباره سیم‌کارت‌های استونی"
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
        description=" ثبت نام سریع و ساده در ارزی پلاس، شروعی تازه برای شماست. فرآیند سفارش سیم کارت بین‌المللی‌تان تنها چند گام کوتاه فاصله دارد. جهت ثبت سفارش کلیک کنید"
        button={{
          text: "خرید سیمکارت استونی",
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

export default EstonianSimCard;
