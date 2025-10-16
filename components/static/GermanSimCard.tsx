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
  FaClock,
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

const GermanSimCard = () => {
 

  const simSteps = [
    {
      id: "delivery",
      title: "تحویل و فعال‌سازی",
      description:
        "سیم‌کارت بلافاصله فعال و در کمتر از یک هفته به آدرس شما در ایران تحویل داده می‌شود.",
      icon: <FaRocket />,
    },
    {
      id: "payment",
      title: "پرداخت هزینه",
      description:
        "هزینه سفارش را از طریق شماره حساب سایت پرداخت نمایید، با گزینه‌های امن.",
      icon: <FaMoneyBillWave />,
      isActive: true,
    },
    {
      id: "request",
      title: "ثبت درخواست",
      description:
        "درخواست خود را از طریق فرم ثبت سفارش ارسال کنید، با انتخاب پلن prepaid مناسب.",
      icon: <FaDollarSign />,
    },
    {
      id: "register",
      title: "ثبت نام در ارزی پلاس",
      description:
        "حساب کاربری خود را در سایت ارزی پلاس ایجاد کنید و جزئیات سفارشی را برای سیمکارت وارد نمایید.",
      icon: <FaRegClipboard />,
      isActive: true,
    },
  ];

  const simWhyUs = [
    {
      id: 1,
      icon: <FaClock size={32} />,
      title: "فعال سازی سریع",
      description:
        "سیم‌کارت بلافاصله قبل از ارسال به صورت کامل فعال می‌شود و نیازی به مراحل پیچیده یا مدارک خاص ندارد. آماده استفاده برای پیامک، تماس و ثبت‌نام در سایت‌های بین‌المللی می‌باشد، با پلن‌های prepaid مانند O2 Prepaid 5G (5€/month, 3GB)",
    },
    {
      id: 2,
      icon: <FaMapMarkerAlt size={32} />,
      title: "تحویل سریع در ایران",
      description:
        "سیم‌کارت به صورت فیزیکی مستقیماً درب منزل شما در ایران تحویل داده می‌شود. جهت فعال سازی نیازی به مراجعه حضور و یا سفر خارج از کشور نمی‌باشد، با پوشش roaming در 220+ کشور",
    },
    {
      id: 3,
      icon: <FaPhone size={32} />,
      title: "دریافت و ارسال پیامک و تماس",
      description:
        "سیمکارت‌های فیزیکی آلمان از اپراتور‌های معتبر ایرانی سرویس دریافت می‌کنند، امکان ارسال و دریافت پیامک و تماس با شماره‌های داخلی و بین‌المللی را خواهید داشت، با unlimited calls در EU از Vodafone",
    },
    {
      id: 4,
      icon: <FaGlobe size={32} />,
      title: "جهت احراز هویت در سایت‌های بین‌المللی",
      description:
        "سیم‌کارت دارای پیش‌شماره معتبر آلمان بوده و در بیشتر پلتفرم‌ها و سایت‌هایی که ایران را تحریم کرده‌اند، برای احراز هویت و ثبت‌نام قابل استفاده است، ایده‌آل برای Upwork و banking verification",
    },
    {
      id: 5,
      icon: <FaShieldAlt size={32} />,
      title: "توجه! شارژ منظم",
      description:
        "سیم‌کارت‌های آلمان از نوع اعتباری بوده و هر 5 ماه باید شارژ شوند- در غیر اینصورت غیرفعال شده و  قابل بازیابی نمی‌باشند، مشابه prepaid validity در Telekom (recharge هر 90 days)",
    },
  ];

  const simFaq = [
    {
      id: "1",
      question: "آیا سیم‌کارت‌ها واقعی هستند؟",
      answer:
        "بله، سیم‌کارت‌ها به صورت فیزیکی هستند و به نام متقاضی فعال و به آدرس شما در ایران ارسال میشوند. از اپراتورهای معتبر مانند Telekom یا Vodafone، با physical SIM برای roaming international",
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
        "خیر، این سیم‌کارت‌ها تاریخ انقضا ندارند و فقط لازم است که هر 5 ماه یک بار شارژ شوند تا غیرفعال نشوند. مشابه prepaid plans در O2 (recharge هر 90 days برای validity)",
      category: "تاریخ انقضا",
    },
    {
      id: "4",
      question: "سیم‌کارت چه کشورهایی موجود است؟",
      answer:
        "در حال حاضر سیم‌کارت  انگلیس، آلمان، استونی و سلکام مالزی موجود می‌باشد. آلمان از Telekom/Vodafone برای verification banking و freelancing ایده‌آل است",
      category: "کشورهای موجود",
    },
    {
      id: "5",
      question: "وضعیت آنتن دهی این سیم‌کارت‌ها در ایران چگونه است؟",
      answer:
        "کلیه سیم‌کارت‌های مجموعه ارزی پلاس از پوشش مناسبی در کشور برخوردار بوده و قابلیت دریافت پیامک و تماس‌های بین المللی را دارا می‌باشند. از roaming partners ایرانی مانند MCI برای coverage",
      category: "آنتن‌دهی",
    },
    {
      id: "6",
      question: "آیا از ایران می‌توان با این سیم‌کارت‌ها تماس گرفت؟",
      answer:
        "بله، اما هزینه‌های تماس آن طبق تعرفه رومینگ حساب می‌شود. برای calls به EU/international، rates از 0.09€/min در Vodafone CallYa",
      category: "تماس از ایران",
    },
  ];

  return (
    <div>
      <HeroSection
        heading="سیم‌کارت‌ بین‌المللی آلمان  خرید سیمکارت فیزیکی آلمان در ایران"
        subheading=" خرید سیمکارت آلمان"
        description="این سیمکارت امکان ارسال و دریافت پیامک بین‌المللی، ثبت‌نام در سایت‌ها و اپلیکیشن‌هایی که ایران را تحریم کرده‌اند، و همچنین استفاده از سرویس‌های احراز هویت جهانی را برایتان فراهم می‌سازد. این سیم‌کارت‌ها بدون نیاز به اقامت یا مدارک آلمانی، قابل استفاده در ایران و خارج از کشور هستند و پس از فعال‌سازی، از طریق یکی از اپراتورهای معتبر ایرانی، سرویس‌دهی می‌شوند. با خرید سیم‌کارت فیزیکی آلمان از ارزی پلاس، یک خط بین‌المللی با پیش‌شماره معتبر آلمان (+49) دریافت می‌کنید."
        buttons={[
          {
            text: "خرید سیمکارت آلمان",
            href: "/register",
            variant: "primary",
            icon: <FaExplosion />,
          },
        ]}
        media={{
          type: "image",
          src: "https://arziPlus.s3.eu-north-1.amazonaws.com/Desktop/46-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQ3U76EU2X%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T110312Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRzBFAiAGf%2B9WkHSG4AXvuAvDV5%2F6V1j1cSK9ZgmpxcMUnw1dfQIhALHAMp4YflKopO9mVge90XHQ4%2B4z%2BTzd87T1qS7jAGNJKtYCCCwQABoMMzExMzc2MTIwMjI1Igzto4mTsPKN%2FB6JmbkqswKPPVQhRvK%2BXVf7CtVH%2FkccR9AenCDe4Zpog4uqMXgEPZXxV8WQHvv7y6R4TGr7IEZIXOU7M%2FaYN32CP%2FqDCHUq3DI3qovSOezKwmTWDno8WPOxXVh4%2BF0Wmw6tkChSqISJYnYDPz1kaglRuR8KBcDd4cnCfENa%2BbZR0ppxycjccDwg41KseqpW4QNUEOT2jX46PNR8bbLSMBtRvBwX0tsuizcN%2F1Z%2BhAaE7uNminGZxhapfHoM6wYyHauHVlBvb60G6EFKsQ9I9kO5rTXvWbW7IapsZ6nL5kVw7CKkB%2BC6NayJ6xXGrecDYwX7sL6%2FjVoLdHhwKXjdrVScDuSpHt3yw9A2GNMhtzCdinljhrsIyv4afP8sjOXlagQBLmGBR1gDSWcigJSmDqRjjt1aixUMAZr9MJLyrccGOq0CBFbpsXgLluWbYYV%2BURB5O3JXoQEptvEknwbrH%2B%2FnrIUj3lVAQXhT%2FfYiXXoMQntGGYmHqt3CEdG5aKHLLKQb63McI09lhFc8miAsYu1yXPWpfFTppJTZOSGUBNQYFGiazfe%2FYphFcd7mTCAXGNb3tVqgA6cNaTOG3QgWwoYu6QngRk6ZO5oENEiGTzARhlAn0lYrJGIAQxix%2BfQA7Vh2qZM0Vhs70n6lDjsyu31%2BiI9ceIwXb82ft94y9W5LI6sLs79XuWu%2FCuc1fRpdg8jltU1lgYhJhiuXQSEz%2FG2w0oTY59xsv8gUyOvrLp5RKrSH%2BsfxUhJGMhcmbTjAFjCHJpaV%2BtI%2FyjzdQkWTncV7EyF1Dxm2VxxxLtq0In7yBwO%2Bvr18kphpCIAEeyyRTQ%3D%3D&X-Amz-Signature=70e06f9e8974603ffcbaa5451cad8d8af7979178f2186b8b13cdeef788e5de89&X-Amz-SignedHeaders=host&response-content-disposition=inline",
          alt: "سیمکارت آلمان با ارزی پلاس",
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
        heading="ویژگی‌های سیمکارت بین‌المللی آلمان"
        description="با ارزی پلاس، خرید و فعال‌سازی سیمکارت آلمان ساده و سریع است."
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
        heading="ویژگی و کاربرد‌های اختصاصی سیم‌کارت‌های بین المللی ارزی پلاس"
        description="سیم‌کارت فیزیکی با پیش‌شماره ‎0049‎، فعال در ایران و بیش از ‎220‎ کشور. ایده‌آل برای ثبت شرکت، حساب بانکی، احراز هویت و وریفای سرویس‌های خارجی. مناسب فریلنسرها، گیمرها، تریدرها و کاربران هوش مصنوعی بدون نیاز به اقامت آلمان."
        buttonText="خرید سیمکارت"
        buttonLink="/german-sim"
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
        description="پاسخ به متداول‌ترین سوالاتی که در ذهن دارید درباره سیم‌کارت‌های آلمان"
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
        heading="خرید سیم‌کارت فیزیکی آلمان در ایران"
        description="با ارزی پلاس، سیمکارت آلمان را بدون نیاز به اقامت دریافت کنید. ارزی پلاس با سرعت، امنیت و کارمزد کم، فرآیند را مدیریت می‌کند."
        button={{
          text: "خرید سیمکارت آلمان",
          href: "/german-sim",
          variant: "primary",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.primary}
        height={50}
      />
    </div>
  );
};

export default GermanSimCard;
