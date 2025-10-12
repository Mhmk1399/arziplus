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
  FaLock,
  FaDollarSign,
  FaRocket,
  FaPercent,
  FaEnvelope,
} from "react-icons/fa6";
import { FaShieldAlt, FaCoins } from "react-icons/fa";
import HeroSection from "../global/heroSection";
import StepsSection from "../global/stepsSection";
import WhyUsSection from "../global/whyUs";
import HeroSplitSection from "../global/heroSplitSection";
import FAQSection from "../global/faqSection";
import CTABanner from "../global/ctaBanner";

const DALLEPage = () => {
  const steps = [
    {
      id: "register",
      title: "ثبت نام در ارزی پلاس",
      description: "به راحتی در سایت ارزی پلاس حساب کاربری بسازید.",
      icon: <FaDollarSign />,
      isActive: true,
    },
    {
      id: "selectPlan",
      title: "انتخاب اشتراک DALL-E",
      description: "وارد بخش ثبت سفارش شوید و اشتراک DALL-E را انتخاب کنید.",
      icon: <FaCoins />,
    },
    {
      id: "payment",
      title: "پرداخت معادل ریالی",
      description:
        "معادل ریالی هزینه اشتراک را پرداخت کنید و دسترسی کامل دریافت کنید.",
      icon: <FaPercent />,
      isActive: true,
    },
  ];

  const whyUsItems = [
    {
      id: 1,
      icon: <FaClock size={32} />,
      iconColor: "bg-indigo-700",
      title: "تولید تصاویر سفارشی و دلخواه",
      description:
        "با DALL-E می‌توانید هر تصویری که در ذهن دارید را به تصویر واقعی و جذاب تبدیل کنید.",
    },
    {
      id: 2,
      icon: <FaLock size={32} />,
      iconColor: "bg-indigo-700",
      title: "بالا رفتن خلاقیت و نوآوری",
      description:
        "ایده‌های خود را با کمک این هوش مصنوعی به بهترین شکل ممکن بصری کنید.",
    },
    {
      id: 3,
      icon: <FaPercent size={32} />,
      iconColor: "bg-indigo-700",
      title: "صرفه‌جویی در زمان و هزینه",
      description:
        "دیگر نیاز به نقاشی دستی یا تجهیزات گران‌قیمت ندارید، همه چیز با DALL-E انجام می‌شود.",
    },
    {
      id: 4,
      icon: <FaHeadset size={32} />,
      iconColor: "bg-indigo-700",
      title: "امنیت بالا",
      description:
        "تمامی تراکنش‌ها و اشتراک‌های شما با امنیت کامل انجام می‌شود.",
    },
  ];

  const faqItems = [
    {
      id: "1",
      question:
        "آیا نسخه رایگان DALL-E برای نیازهای من کافی است یا باید اشتراک آن را بخرم؟",
      answer:
        "نسخه رایگان محدودیت‌هایی دارد و فقط تعداد محدودی تصویر با کیفیت پایین می‌توانید تولید کنید. اگر به تصاویر حرفه‌ای و بدون محدودیت نیاز دارید، خرید اشتراک مناسب است.",
      category: "نسخه رایگان",
    },
    {
      id: "2",
      question:
        "محدودیت‌های نسخه رایگان DALL-E چیست و چه تفاوت‌هایی با نسخه اشتراکی دارد؟",
      answer:
        "نسخه رایگان دارای محدودیت تعداد درخواست و کیفیت تصویر است. نسخه اشتراکی دسترسی کامل به قابلیت‌ها و کیفیت بالاتر را فراهم می‌کند.",
      category: "نسخه رایگان",
    },
    {
      id: "3",
      question: "آیا اشتراک DALL-E برای تولید تصاویر حرفه‌ای مناسب است؟",
      answer:
        "بله، با اشتراک می‌توانید تصاویر با کیفیت بالا و ویژگی‌های پیشرفته برای تولید تصاویر حرفه‌ای دریافت کنید.",
      category: "ویژگی‌ها",
    },
    {
      id: "4",
      question:
        "آیا با خرید اشتراک DALL-E می‌توانم به تمامی قابلیت‌های تولید تصویر دسترسی داشته باشم؟",
      answer:
        "بله، اشتراک DALL-E دسترسی کامل به تمامی ابزارها و قابلیت‌های پیشرفته را فراهم می‌کند.",
      category: "ویژگی‌ها",
    },
    {
      id: "5",
      question:
        "آیا خرید اشتراک DALL-E ارزش هزینه کردن دارد یا می‌توانم با نسخه رایگان کار خود را انجام دهم؟",
      answer:
        "اگر تصاویر حرفه‌ای، با کیفیت و بدون محدودیت می‌خواهید، خرید اشتراک ارزشمند است. نسخه رایگان فقط برای استفاده ساده و محدود مناسب است.",
      category: "ارزش خرید",
    },
  ];

  const faqIcons = {
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
  };

  return (
    <div>
      <HeroSection
        heading="خرید اکانت DALL-E — خالق تصاویر حرفه‌ای"
        subheading="به عکسی که دوست داری تبدیل شو"
        description="با DALL-E می‌توانید هر ایده‌ای که دارید را به تصویر جذاب و واقع‌گرایانه تبدیل کنید."
        buttons={[
          {
            text: "ثبت سفارش DALL-E",
            href: "/dalle",
            variant: "secondary",
            icon: <FaRocket />,
          },
        ]}
        media={{
          type: "image",
          src: "https://arziplus.s3.eu-north-1.amazonaws.com/Desktop/25-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQ2CKVNDEY%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T104923Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiSDBGAiEAroahCXaVYk22b8MRRjyD90bYDmYNnZ2PUWY0mk6%2BviQCIQC%2FeqQfmHQdNzD2%2BiddHkRYY65fg%2B9CSKea6FDiOYJfhyrWAggsEAAaDDMxMTM3NjEyMDIyNSIMOFOz6l7nN%2B05MdYRKrMCQOBDkN%2FtvrvNnG8hvz%2FeJnqJq7yaIdT8gQ%2FfUAiJbfZ%2FqRD8jACx8F%2BrZlQ5HTktHpBNNtzoJMRsq0EqEoSUCsuq%2FWdCsFzqbT6biwT2dipHTfU3%2B%2Fanhpz4gtFJXzAtOC3Hh9jt1KDOz0pzjWO3qdxDo6URdMSlNZnjhW9h3nrFfX%2B8YxgNGymG32bYs5UEwJ3tnmBc%2BT7lowM6axEr6QNyjnQRe336wD7NoKyZHahs1a56gQTjgPjNlZvAh6vASOqvZkhdJsqFubWn%2FKGJPgCg0EKcyXqWyFIcIAFGJmWpNBEBZJESucCSU3OXy3IoeyKQSn0JDKaLRdNP88C2AlTD0Ib2Fjez839JpQ0k8HOiBBKCRpPogV3qjmUZVVUYnEQdkEye%2Fj3iWoXJEZLJiejGHjCS8q3HBjqsAhfGESqf5%2BMKuY3sqcBvImReQCb9XAmDtSJ2e9uJBU0Q8o9QRaotnGfDAmEbUem6b9BHLODjQuY6T9HePfDuu70sLU9eukf%2B8sFreaxzk79NkK5Flujz%2BP49AY8rRHeCdRi38zeavlTc0iko7YtfAyXYgXfdpbT3oEW076zMwBtNRmbnPUL5ggAbyHRKkEiAuBRAKjuWWFwPGqzhkiMlWRtfGUr9KWySZrPNsi5HwMCriMlocw8D4fFPKdZjIr2MeuN7%2FrQAvnYPy7Q4krHJO37L4Thg1JGeGpbB1zGI0FJj5%2F1Nip%2FJrjeFkofrSSGeRZbm%2BYYzfRZoj5dtRj%2Fvrc78Jve70v%2FNz02f0J49G5PKOZ%2Bf9lO8PrA4YJfxOePwO7YHpGbUdG2leCO%2FXQ%3D%3D&X-Amz-Signature=d8b419b4fe2fec91da9b0387727631897dc09f3cc46f7bc31fbfb143a48cc6c0&X-Amz-SignedHeaders=host&response-content-disposition=inline",
          alt: "خرید اکانت DALL-E",
          width: 1200,
          height: 800,
        }}
        layout="default"
        theme={{
          headingColor: "text-gray-50",
          subheadingColor: "text-gray-200",
          descriptionColor: "text-gray-300",
          backgroundColor: "bg-indigo-700",
        }}
      />

      <StepsSection
        heading="مراحل خرید DALL-E"
        description="خرید اشتراک DALL-E با ارزی پلاس ساده و شفاف است."
        steps={steps}
        theme={stepThemes.default}
        layout="vertical"
        boxShape="rounded"
        boxSize="sm"
        showNumbers={true}
        animated={true}
        showIcons={true}
      />

      <WhyUsSection
        heading="مزایای خرید DALL-E با ارزی پلاس"
        description="تولید تصاویر سفارشی، بالا رفتن خلاقیت و امنیت بالا تنها بخشی از مزایای ماست."
        buttonText="ثبت سفارش DALL-E"
        buttonLink="/dalle"
        items={whyUsItems}
        buttonColor="bg-indigo-800 hover:bg-indigo-900 text-white"
        theme={themesWhyus.dark}
      />

      <HeroSplitSection
        heading="ارزی پلاس، همراه شما در خرید هوش مصنوعی"
        subHeading="امنیت، سرعت و پشتیبانی حرفه‌ای"
        description="با ارزی پلاس می‌توانید اشتراک DALL-E را به ساده‌ترین روش خریداری کنید و از امکانات آن بهره‌مند شوید."
        buttons={[
          {
            text: "ثبت سفارش DALL-E",
            href: "/dalle",
            variant: "green",
            icon: <FaShieldAlt />,
          },
        ]}
        imageSrc="/assets/images/dalle-2.webp"
        imageAlt="ارزی پلاس"
        theme={splitSectionThemes.dark}
        layout="image-left"
        imageWidth="1/2"
        features={[
          {
            id: 1,
            title: "پرداخت امن و سریع",
            description: "تمامی تراکنش‌ها با امنیت کامل و سریع انجام می‌شود.",
            icon: <FaLock />,
          },
          {
            id: 2,
            title: "پشتیبانی حرفه‌ای",
            description:
              "کارشناسان ما در تمام مراحل خرید و فعال‌سازی همراه شما هستند.",
            icon: <FaHeadset />,
          },
          {
            id: 3,
            title: "کارمزد شفاف",
            description:
              "قبل از پرداخت، میزان کارمزد و نرخ دقیق مشخص و شفاف است.",
            icon: <FaPercent />,
          },
        ]}
      />

      <FAQSection
        heading="سؤالات متداول"
        description="پرسش‌های پرتکرار درباره DALL-E"
        svgIcon={faqIcons.info}
        faqItems={faqItems}
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
        heading="همین حالا اشتراک DALL-E خود را خریداری کنید!"
        description="با ارزی پلاس، به راحتی به هوش مصنوعی DALL-E دسترسی پیدا کنید و تصاویر حرفه‌ای بسازید."
        button={{
          text: "ثبت سفارش DALL-E",
          href: "/dalle",
          variant: "ghost",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.success}
        height={50}
      />
    </div>
  );
};

export default DALLEPage;
