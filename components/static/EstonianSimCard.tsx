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

const EstonianSimCard = () => {
  const longText = `مجموعه ارزی پلاس با بیش از 13سال فعالیت در خدمات بین الملل با توافقات صورت گرفته توانسته است به عنوان نماینده فروش سیم‌کارت‌های ودافون انگلیس، سیم‌کارت استونی و سلکام مالزی فعالیت کند. هر سیم‌کارت با  پیش شماره رسمی آن کشور ارائه می‌شود: در سال 2025، سیمکارت‌های prepaid استونی از اپراتورهای Elisa, Tele2 و Telia با پلن‌های مقرون‌به‌صرفه از 5€ (شامل 5-10GB داده EU + calls/SMS)، گزینه‌ای ایده‌آل برای verification بین‌المللی و roaming فراهم می‌کنند. ارزی پلاس با صدور فیزیکی و ارسال به ایران، فرآیند را ایمن نگه می‌دارد، و با recharge هر 5 ماه، از غیرفعال شدن جلوگیری می‌کند. این سیمکارت‌ها با پوشش 5G در استونی و roaming partners در 220+ کشور (شامل ایران از طریق MCI/RighTel)، برای فریلنسرها، تریدرها و کاربران crypto مناسب هستند.`;

  const simSteps = [
    {
      id: "membership",
      title: "گام اول: عضویت در سایت",
      description:
        "حساب کاربری خود را درسایت ارزی پلاس ایجاد کنید و اطلاعات اولیه را برای سفارشی‌سازی سیمکارت وارد نمایید.",
      icon: <FaRegClipboard />,
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
      id: "payment",
      title: "گام سوم: پرداخت",
      description:
        "هزینه سفارش را از طریق شماره حساب سایت پرداخت نمایید، با گزینه‌های امن و شفاف برای پلن‌های prepaid.",
      icon: <FaMoneyBillWave />,
      isActive: true,
    },
    {
      id: "activation",
      title: "گام چهارم: فعال سازی سیم‌کارت",
      description:
        "ظرف چند ساعت سیم‌کارت شما فعال و کمتر از یک هفته به آدرس شما در ایران تحویل داده می‌شود، همراه با راهنمایی برای recharge اولیه.",
      icon: <FaRocket />,
    },
  ];

  const simWhyUs = [
    {
      id: 1,
      icon: <FaShieldAlt size={32} />,
      iconColor: "bg-emerald-700",
      title: "این سیمکارت در ایران آنتن دهی ندارد",
      description:
        "این سیمکارت در ایران آنتن دهی ندارد، اما برای verification SMS-based ایده‌آل است، با roaming data expensive (تا 250$/GB) – تمرکز روی SMS/call verification در پلتفرم‌های تحریم‌شده",
    },
    {
      id: 2,
      icon: <FaGlobe size={32} />,
      iconColor: "bg-emerald-700",
      title: "ویژگی‌ و کاربرد‌ سیم‌کارت‌های بین المللی",
      description:
        "با داشتن این سیم‌کارت می‌توان در سایت‌های فریلنسری مانند upwork ،peopleperhour و فریلنسر ثبت‌نام کرده و به کسب درآمد ارزی بپردازید. بازیکنان حرفه‌ای به کمک این سیم‌کارت می‌توانند در سایت‌های مرتبط با صنعت گیمینگ و بازی مانند g2g، G2A و PlayerAuctions و …. ثبت‌نام نموده و از مزایای آن برخوردار شوند. تریدر‌ها با کمک این سیم‌کارت در بروکرهای فارکس و صرافی های ارز دیجیتال خارجی مانند گیت، بایننس و coinbase می‌توانند ثبت‌نام کرده و معاملات خود را به راحتی انجام دهند. ایجاد حساب OpenAI و سایر وب‌سایت‌ها جهت استفاده از خدمات هوش مصنوعی مانند chat gbt، DALL-E و …. برای انواع حساب‌های ارزی مثل وب مانی، پی پال، پرفکت مانی و … می‌توان از این سیم‌کارت استفاده نمود. در شبکه‌های اجتماعی مختلف مثل اینستاگرام، توییتر، تلگرام، واتساپ، تیندر و … (بدون نیاز به اقدام مجزا برای خرید خط مجازی) می‌توان ثبت‌نام کرد. امکان استفاده از اینترنت سیم‌کارت در ایران وجود دارد اما هزینه آن به صورت رومینگ بوده و به ازای مصرف هر گیگ ۲۵۰ دلار به قبض شما اضافه می‌گردد که صرفه اقتصادی نداشته، لذا استفاده ازآن توصیه نمی‌شود. کلیه سیم‌کارت‌های بین الملل شرکت ارزی پلاس از پوشش آنتن دهی مناسبی در ایران برخوردار بوده و توسط اپراتورهای ایرانی به خوبی پشتیبانی می‌گردد. این سیم‌کارت‌ها دارای قابلیت اتصال به اینترنت در ایران را دارا می‌باشند اما به علت اتصال رومینگ در ایران هزینه استفاده از هر گیگ اینترنت 250 دلار می‌باشد، لذا توصیه به استفاده از اینترنت سیم‌کارت در ایران نمی‌شود.",
    },
    {
      id: 3,
      icon: <FaPhone size={32} />,
      iconColor: "bg-emerald-700",
      title: "ویژگی و کاربرد‌های اختصاصی سیم‌کارت‌های بین المللی ارزی پلاس",
      description:
        " کلیه سیم‌کارت‌های بین المللی علاوه بر خدمات و ویژگی‌های بالا، برای افرادی که قصد سفر یا اقامت در یک کشور را دارند، گزینه مناسبی می‌باشد. همچنین کسانی که می خواهند از خدمات دولتی یا خصوصی یک کشور مانند ثبت شرکت، ایجاد حساب بانکی، احراز هویت پیامکی، تایید آدرس و …. را بهره ببرند، نیاز به تهیه سیم‌کارت آن کشور را دارند. استونی با e-Residency و banking verification ایده‌آل برای fintech و freelancing",
    },
    {
      id: 4,
      icon: <FaShieldAlt size={32} />,
      iconColor: "bg-emerald-700",
      title: "توجه! شارژ منظم",
      description:
        " سیم‌کارت‌ استونی حتما باید هر 5 ماه شارژ شود و حداقل یک بار استفاده شود( ارسال یا دریافت یک پیامک، تماس کوتاه) در غیر اینصورت سیم‌کارت غیر فعال شده و فعال کردن مجدد آن امکان پذیر نمی‌باشد. مشابه prepaid validity در Elisa (recharge هر 90 days)",
    },
    {
      id: 5,
      icon: <FaDollarSign size={32} />,
      iconColor: "bg-emerald-700",
      title: "مزایای خرید سیمکارت از ارزی پلاس",
      description:
        "هزینه مناسب تحویل سریع امکان شارژ سیم کارت توسط ارزی پلاس نماینده فروش سیم‌کارت های بین المللی با بیش از ده سال سابقه، با پلن‌های Tele2 از 5€ برای SMS/international verification",
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
        heading="سیم‌کارت‌ بین المللی استونی — ارزی پلاس نماینده فروش سیم‌کارت های بین المللی"
        subheading="شارژ سیم‌کارت بین‌المللی – ارزی پلاس"
        description="این سیمکارت در ایران آنتن دهی ندارد، اما برای verification SMS-based ایده‌آل است، با prepaid plans از Elisa/Tele2/Telia در 2025 از 5€، تمرکز روی international SMS/call برای Upwork و banking. هر سیم‌کارت با  پیش شماره رسمی آن کشور ارائه می‌شود:"
        buttons={[
          {
            text: "خرید سیمکارت استونی",
            href: "/register",
            variant: "primary",
            icon: <FaExplosion />,
          },
        ]}
        media={{
          type: "image",
          src: "https://arziPlus.s3.eu-north-1.amazonaws.com/Desktop/45-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQ2DXOXLEH%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T110240Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiSDBGAiEA7j6WAMP1u1nfiaV79Cz9%2FEZUIyYCIDHKzozggwDz140CIQDnthjc3yYD%2F%2FXfMx1ak35ldEdIvBOgeJ4Cip6PxekkDSrWAggsEAAaDDMxMTM3NjEyMDIyNSIM50z1mbFqn5gqtpCQKrMCyAkPydmA1K4N1bjT6x7XcWoTdw6ZVVR%2BQucAHXV0%2F1QVCYOlUXgm8FEfivGw9%2BGzrroVbH6IeIQRB7YgD9Em6JLvo8v0ZfwCwy3ZUgrzvj%2FMSkHO%2FwkG8%2FBCb%2FRBG%2FwdFWRkDP5N9Sz2s5uceapHoiekLVmXIAnbbEL5psB%2BKWYZ6yxS32IeRmCiR9agnAys6PgvvXwS9BLE4Y0fb2loscnip4o6aXqplbjG3uSJDR4j3QUHW%2BUycWr8kAXs6Hff0GrqOuRY9zawgV4n0aS7PjVKgMf6Ln3tfhukdCUboN5mQrwWwSbA1fJb85vDBQNWDA8PWRmRBAycYMyVzsCCuICEn22ijbE82y9RUOmloKYVJZWOInNm4yUrNln9LGq9FVAJ9HPuMNd6znaKkjOXuulD2zCS8q3HBjqsAgU9718iPRglCh0yo7WNHVt0wy%2F3we5Ze4N5kduwFteznnYuDMRyyiPugl9nFkZr5vmVbaD%2BNNdvBCvf3gtlxtZu2UVO3yyx5TR%2B8dNdfVeRRHl%2Fr11LpWhzzqsGLdNKAzUyuhbiUBjmBlpU57s9TjDQdK89IAtVwZmUcvzdAqnKmLLk9IyIB%2BlfWwhRC6Mb8yVHmjNZ7rGYi08hnGoQj%2FOBMwE99JOYBdcHS2kzjGUbIyxnWFNcUDgyOgh6WWp%2FhhcoV2YPxU8kST6dwRfVOqyhQGbrDTfjdj1U724UWtX7gB5IBB%2Bk3a2uu5x%2B9n6dW%2BQLwfUkJgeTuAffzmeTX3w9u%2FbwuO0ZQDI%2F%2BTVYwzgMy9uy6y3p9eh1ipVozq7KXyt46HEqdmlBPlns%2BA%3D%3D&X-Amz-Signature=5a68146da93b20e1a0dd019c98f336e0c76fe7c5815c5aac2a8e2b8a7c84f46e&X-Amz-SignedHeaders=host&response-content-disposition=inline",
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
        description="با داشتن این سیم‌کارت می‌توان در سایت‌های فریلنسری مانند upwork ،peopleperhour و فریلنسر ثبت‌نام کرده و به کسب درآمد ارزی بپردازید. بازیکنان حرفه‌ای به کمک این سیم‌کارت می‌توانند در سایت‌های مرتبط با صنعت گیمینگ و بازی مانند g2g، G2A و PlayerAuctions و …. ثبت‌نام نموده و از مزایای آن برخوردار شوند. تریدر‌ها با کمک این سیم‌کارت در بروکرهای فارکس و صرافی های ارز دیجیتال خارجی مانند گیت، بایننس و coinbase می‌توانند ثبت‌نام کرده و معاملات خود را به راحتی انجام دهند. ایجاد حساب OpenAI و سایر وب‌سایت‌ها جهت استفاده از خدمات هوش مصنوعی مانند chat gbt، DALL-E و …. برای انواع حساب‌های ارزی مثل وب مانی، پی پال، پرفکت مانی و … می‌توان از این سیم‌کارت استفاده نمود. در شبکه‌های اجتماعی مختلف مثل اینستاگرام، توییتر، تلگرام، واتساپ، تیندر و … (بدون نیاز به اقدام مجزا برای خرید خط مجازی) می‌توان ثبت‌نام کرد. امکان استفاده از اینترنت سیم‌کارت در ایران وجود دارد اما هزینه آن به صورت رومینگ بوده و به ازای مصرف هر گیگ ۲۵۰ دلار به قبض شما اضافه می‌گردد که صرفه اقتصادی نداشته، لذا استفاده ازآن توصیه نمی‌شود. کلیه سیم‌کارت‌های بین الملل شرکت ارزی پلاس از پوشش آنتن دهی مناسبی در ایران برخوردار بوده و توسط اپراتورهای ایرانی به خوبی پشتیبانی می‌گردد. این سیم‌کارت‌ها دارای قابلیت اتصال به اینترنت در ایران را دارا می‌باشند اما به علت اتصال رومینگ در ایران هزینه استفاده از هر گیگ اینترنت 250 دلار می‌باشد، لذا توصیه به استفاده از اینترنت سیم‌کارت در ایران نمی‌شود."
        buttonText="خرید سیمکارت"
        buttonLink="/estonian-sim"
        items={simWhyUs}
        buttonColor="bg-indigo-700 hover:bg-indigo-800 text-white"
        theme={themesWhyus.default}
      />

      <TextBox
        heading="ویژگی و کاربرد‌های اختصاصی سیم‌کارت‌های بین المللی ارزی پلاس"
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
        description="پاسخ به متداول‌ترین سوالاتی که در ذهن دارید درباره سیم‌کارت‌های استونی"
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
        heading="✅ همین حالا به دنیای ارتباطات بین‌المللی بپیوندید!"
        description="🚀 ثبت نام سریع و ساده در ارزی پلاس، شروعی تازه برای شماست. فرآیند سفارش سیم کارت بین‌المللی‌تان تنها چند گام کوتاه فاصله دارد. جهت ثبت سفارش کلیک کنید"
        button={{
          text: "خرید سیمکارت استونی",
          href: "/estonian-sim",
          variant: "primary",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.primary}
        height={50}
      />
    </div>
  );
};

export default EstonianSimCard;
