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

const DIDPage = () => {
  const steps = [
    {
      id: "payment",
      title: "پرداخت معادل ریالی",
      description:
        "معادل ریالی هزینه اشتراک را پرداخت کنید و دسترسی کامل دریافت کنید.",
      icon: <FaPercent />,
      isActive: true,
    },

    {
      id: "selectPlan",
      title: "انتخاب اشتراک D-ID",
      description: "وارد بخش ثبت سفارش شوید و اشتراک D-ID را انتخاب کنید.",
      icon: <FaCoins />,
    },

    {
      id: "register",
      title: "ثبت نام در ارزی پلاس",
      description: "به راحتی در سایت ارزی پلاس حساب کاربری بسازید.",
      icon: <FaDollarSign />,
      isActive: true,
    },
  ];

  const whyUsItems = [
    {
      id: 1,
      icon: <FaClock size={32} />,
      title: "رابط کاربری آسان و جذاب",
      description:
        "استفاده از D-ID ساده است و همه می‌توانند ویدیوهای حرفه‌ای بسازند.",
    },
    {
      id: 2,
      icon: <FaLock size={32} />,
      title: "پشتیبانی از بیش از 100 زبان",
      description:
        "می‌توانید ویدیوهای خود را با صدا و متن در بیش از 100 زبان بسازید.",
    },
    {
      id: 3,
      icon: <FaPercent size={32} />,
      title: "سرعت بالا",
      description: "ویدیوهای شما در کوتاه‌ترین زمان ممکن ساخته می‌شوند.",
    },
    {
      id: 4,
      icon: <FaHeadset size={32} />,
      title: "پشتیبانی حرفه‌ای",
      description:
        "کارشناسان ما در تمام مراحل خرید و فعال‌سازی همراه شما هستند.",
    },
  ];

  const faqItems = [
    {
      id: "1",
      question: "چگونه می‌توانم در ایران اشتراک D-ID را خریداری کنم؟",
      answer:
        "برای خرید اشتراک D-ID در ایران، می‌توانید از کارت‌های اعتباری بین‌المللی، کیف پول‌های دیجیتال یا سایت‌های واسطه مانند ارزی پلاس استفاده کنید.",
      category: "خرید",
    },
    {
      id: "2",
      question: "بهترین روش برای خرید اشتراک D-ID از داخل ایران چیست؟",
      answer:
        "استفاده از کارت‌های اعتباری بین‌المللی مجازی یا سایت‌های واسطه پرداخت ارزی مانند ارزی پلاس سریع، امن و قابل اعتماد است.",
      category: "روش‌ها",
    },
    {
      id: "3",
      question: "چه تفاوت‌هایی بین پلن‌های مختلف اشتراک D-ID وجود دارد؟",
      answer:
        "پلن‌های مختلف از نظر تعداد پروژه‌ها، ویژگی‌های پیشرفته و میزان استفاده از منابع متفاوت هستند. پلن‌های حرفه‌ای امکانات بیشتری ارائه می‌دهند.",
      category: "پلن‌ها",
    },
    {
      id: "4",
      question: "آیا D-ID نسخه رایگان دارد و چه محدودیت‌هایی دارد؟",
      answer:
        "نسخه رایگان محدودیت‌هایی مانند تعداد کمتر پروژه‌ها و دسترسی محدود به ویژگی‌ها دارد.",
      category: "نسخه رایگان",
    },
    {
      id: "5",
      question: "هوش مصنوعی D-ID چه ویژگی‌هایی دارد؟",
      answer:
        "D-ID قابلیت ساخت ویدیوهای واقعی‌نما از تصاویر ثابت، تغییر چهره و حرکات لب، و ترکیب صدا با تصویر را دارد و برای تولید محتواهای دیجیتال و تبلیغات عالی است.",
      category: "ویژگی‌ها",
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
        heading="خرید اکانت D-ID "
        subheading="ایده‌هایت را در کسری از ثانیه به ویدیو تبدیل کن"
        description="در دنیای دیجیتال ۲۰۲۵، D-ID به عنوان پلتفرمی پیشرو در تولید ویدیوهای AI، با خرید Simpleshow در سپتامبر، بازار ۵۰ میلیارد دلاری انسان‌های دیجیتال را رهبری می‌کند. این ابزار هوشمند، بدون نیاز به دوربین یا تجهیزات گران‌قیمت، از متن یا تصاویر، ویدیوهای انیمیشنی و تعاملی می‌سازد – ایده‌آل برای بازاریابان، معلمان و علاقه‌مندان به ارزهای دیجیتال."
        buttons={[
          {
            text: "ثبت سفارش D-ID",
            href: "/d-id",
            variant: "secondary",
            icon: <FaRocket />,
          },
        ]}
        media={{
          type: "image",
          src: "https://arziPlus.s3.eu-north-1.amazonaws.com/Desktop/24-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQR75UJG5I%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T104852Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRzBFAiB4JiMsd2NmUfVqDhag%2FbeezarWZgxG2MN0PA0yBwbSVQIhALvpnS9uQ6FXvJmAX8JCMZ75OMD3OtoIqNvX2tXdKTszKtYCCCwQABoMMzExMzc2MTIwMjI1Igzs%2FurrPXmBSwXYc04qswLHwF5vHHkAVnhF7%2BGV4I7%2BB8l2hB7%2BfQDEsco13XIVQ%2BxbWrI9t4KUzbP4t0dM%2FpyghS975IvZe4ReJqQfGAhqGBYlzZhbhzKAi294c4Zpp5XvPI%2FYRtMStB1GK88%2FILhoA42uaAe5tzvDce9RjR8TgNtTqXYxVtScqLDOY7RoDeOaRTp8qmTiCgWdV5HQ6veh%2BQivvzmA8NnjkQTmKTtL2WATTyEqCZBpGcc1L%2FXlfG42rUomvQRu1lJOEWFRsGjHdgaOSB5TI70BWR9VGA8siPKuFFLPIfqL89RwM7x9iBswWGqpb65or%2BCDDWb7uoqDoLE16lFrfnQ4lcKSIHtW6fmuZq8vUDDW7DUYvH06btoDc251%2B%2BFpjFvEUkM%2FQBxfksCLH6dwzUIqGoQSdfLLJxZwMJLyrccGOq0C9Zmhy%2BIXy1AunO6cM9BKsfpqY8XEXY3q5Gges5%2FYVBvlCJtMBaQcnA%2BPVTf2VB57jMUVIJXVhMV96Qu7CQKWqtYpjK8NYnqzIUQ%2FmiPAruDlnJcgXsIAkfFfw%2B2iRAaVI9Bbnb5mavDEJSBGVds3NcghxrPPxYVKbpr6lcsorkeOQSn1Z%2ByglFtbiRBwHjlnw2CJrEyy1I7qE5N0H4vRSAIiacCVOE5bro5y2iPGEszQIerlsoxwyctVvp72dS5r3tQ7FeIvXHHZ2%2B5%2BiLpPSWj6j57AeWh2Xo%2BxFjgwj2ehWudc3Q6xIg3bvxghGJkx2zHeVlmxgRo%2FFC7eGGBfklYpByy9MDflI8Mcdqt5XRIOzFlAkRe1acwqekH3SBPPqi8a8wxAPQnIdKsdxg%3D%3D&X-Amz-Signature=fa67c8673e2af7f8cfdf571a8a9e1375e71c93944ba74157271b5bf2794b57a0&X-Amz-SignedHeaders=host&response-content-disposition=inline",
          alt: "خرید اکانت D-ID",
          width: 1200,
          height: 800,
        }}
        features={[
          { text: "سادگی و سرعت" },
          { text: "کیفیت بالا" },
          { text: "کاربردهای خلاقانه" },
        ]}
        layout="default"
        theme={{
          headingColor: "text-gray-50",
          subheadingColor: "text-gray-500",
          descriptionColor: "text-gray-300",
          backgroundColor: "bg-indigo-700",
                    featuresColor:"text-gray-600"

        }}
      />

      <StepsSection
        heading="مراحل خرید D-ID"
        description="خرید اشتراک D-ID با ارزی پلاس ساده و شفاف است."
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
        heading="مزایای خرید D-ID با ارزی پلاس"
        description="رابط کاربری آسان، سرعت بالا و پشتیبانی حرفه‌ای تنها بخشی از مزایای ماست."
        buttonText="ثبت سفارش D-ID"
        buttonLink="/d-id"
        items={whyUsItems}
         theme={themesWhyus.default}
      />

      <HeroSplitSection
        heading="ارزی پلاس، همراه شما در خرید هوش مصنوعی"
        subHeading="امنیت، سرعت و پشتیبانی حرفه‌ای"
        description="با ارزی پلاس می‌توانید اشتراک D-ID را به ساده‌ترین روش خریداری کنید و از امکانات آن بهره‌مند شوید."
        buttons={[
          {
            text: "ثبت سفارش D-ID",
            href: "/d-id",
            variant: "green",
            icon: <FaShieldAlt />,
          },
        ]}
        imageSrc="/assets/images/d-id-2.webp"
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
        description="پرسش‌های پرتکرار درباره D-ID"
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
        heading="همین حالا اشتراک D-ID خود را خریداری کنید!"
        description="با ارزی پلاس، به راحتی به هوش مصنوعی D-ID دسترسی پیدا کنید و ویدیوهای حرفه‌ای بسازید."
        button={{
          text: "ثبت سفارش D-ID",
          href: "/d-id",
          variant: "ghost",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.success}
        height={50}
      />
    </div>
  );
};

export default DIDPage;
