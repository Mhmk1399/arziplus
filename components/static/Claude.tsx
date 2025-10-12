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

const ClaudeAIPage = () => {
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
      title: "انتخاب اشتراک Claude AI",
      description: "وارد بخش ثبت سفارش شوید و اشتراک Claude AI را انتخاب کنید.",
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
      title: "سرعت بالا",
      description:
        "پرداخت و فعال‌سازی اشتراک Claude AI در کوتاه‌ترین زمان ممکن انجام می‌شود.",
    },
    {
      id: 2,
      icon: <FaLock size={32} />,
      iconColor: "bg-indigo-700",
      title: "امنیت کامل",
      description:
        "تمامی تراکنش‌ها با امنیت کامل انجام می‌شوند و حساب شما محفوظ است.",
    },
    {
      id: 3,
      icon: <FaPercent size={32} />,
      iconColor: "bg-indigo-700",
      title: "کارمزد منصفانه",
      description: "کارمزد و نرخ پرداخت کاملاً شفاف و بدون واسطه است.",
    },
    {
      id: 4,
      icon: <FaHeadset size={32} />,
      iconColor: "bg-indigo-700",
      title: "پشتیبانی حرفه‌ای",
      description:
        "کارشناسان ما در تمام مراحل خرید و فعال‌سازی همراه شما هستند.",
    },
  ];

  const faqItems = [
    {
      id: "1",
      question: "آیا خرید اشتراک Claude برای کاربران ایرانی امکان‌پذیر است؟",
      answer:
        "خرید مستقیم ممکن است با محدودیت همراه باشد، اما با کارت‌های مجازی، واسطه‌ها یا کمک دوستان خارج از کشور می‌توانید اشتراک را فعال کنید.",
      category: "خرید",
    },
    {
      id: "2",
      question: "چه محدودیت‌هایی در نسخه رایگان Claude وجود دارد؟",
      answer:
        "نسخه رایگان محدودیت‌هایی در تعداد درخواست‌ها، طول پاسخ و دسترسی به ویژگی‌ها دارد.",
      category: "نسخه رایگان",
    },
    {
      id: "3",
      question: "چه ویژگی‌های خاصی در اشتراک‌های مختلف Claude وجود دارد؟",
      answer:
        "اشتراک‌های پرمیوم امکان دسترسی به مدل‌های پیشرفته‌تر، سرعت بیشتر و قابلیت‌های شخصی‌سازی را فراهم می‌کنند.",
      category: "ویژگی‌ها",
    },
    {
      id: "4",
      question: "آیا می‌توان از Claude برای اهداف تجاری استفاده کرد؟",
      answer:
        "بله، استفاده شخصی و تجاری امکان‌پذیر است، اما برای کاربرد گسترده بهتر است از اشتراک پرمیوم استفاده کنید.",
      category: "کاربرد",
    },
    {
      id: "5",
      question: "آیا استفاده از Claude در ایران قانونی است؟",
      answer:
        "برای استفاده شخصی و آموزشی مشکلی ندارد، اما استفاده تجاری گسترده ممکن است نیازمند مجوز باشد.",
      category: "قانونی بودن",
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
        heading="خرید اکانت Claude AI — هوش مصنوعی همه‌کاره"
        subheading="پیچیده‌ترین کارها را به سادگی انجام دهید"
        description="Claude AI یک دستیار هوشمند است که به شما امکان می‌دهد سوالات علمی، برنامه‌نویسی و محتوایی خود را سریع و دقیق پاسخ دهید."
        buttons={[
          {
            text: "ثبت سفارش Claude AI",
            href: "/claude-ai",
            variant: "secondary",
            icon: <FaRocket />,
          },
        ]}
        media={{
          type: "image",
          src: "https://arziplus.s3.eu-north-1.amazonaws.com/Desktop/22-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQ4ERZTHGL%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T104751Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRjBEAiA5IJnghFybjsRigiHdBwD173iHQ%2Bk3SgSjsy1GJp1yYAIgXSeD22TMxfJ9i4EiKhOkp334ZdMfPj8%2Fb7QoXINSkFYq1gIILBAAGgwzMTEzNzYxMjAyMjUiDMzbd7ibgTHpOlXByCqzAiIM8UWMksjkHEbG9SV0%2Bp8fBNE1Ktzsk3mI49UwFalJ995nRuQG7WB%2BTkVkfHFcUxHRL6OVYtOkjut2%2BuxZdPVF8bZhd1fn5bN4lXt54CtwwFIylhdbbM7qIEtL1t7ZoRnOCOtvn6OZekSMHZxzwBSGJnjvVFifphIGkPaUTtu0ipMl8s8AHAt%2B4JWCYL2GQEUI%2BzNnVN3rI4xmbjhdlm4dXEkxab95Hwhjfqwuo%2FfQ0k1HXEejKMDUOYkuA%2F3NULbNHeIUqvi3NbSfNxO4X1z6m%2BsuX%2BFnJZbls5c3xQyszw4RlQtXOoWGVBXHE09IjROSuCUgZYcBEt5TYq9n0WasEZhWxC8%2FOS51L72FcAlXbOR5KKwjD9zPe%2BjAVhPTkiiCpU%2BTOKYY77rHLv%2F3qTDM%2FH4wkvKtxwY6rgK7qpkHam%2BonVN75l6TZaRtkeazIxkMKufE3XUYSP1%2BmG0Hm2NuVd%2FYfIYXYTVvy0PBN0cTZP2gVdGaH4rn13prQsBXI29MBvNgE%2BKsoXFwsqirxFZ7KRMLaeDFcelV3x1WxojS8Hk9h%2BWbpJKlgrJgLoUxuWhCVcIsxbKhVbIXAOUzV6hVLVLBH4KuL3uIzisI9rmGk%2B1x%2BofKKvn5KnHnQ7m1wF7L6uLoeK83uly%2F2qlZ7ICU0CrBZDNUXzv2jCy58zBWl3tI48XMKrEQ0vFXEy1OqeJNn4Fv6XjdpgkELDXSRumEjtLnKLURH1%2FNi27FMgUEckC6%2F06NE%2FveSqmkcIDX8ZHUzKob94qHHk5pmp7mp5IKOeZ23l7GANpIvuqs%2BzG40jqBc0rDDB5kRA%3D%3D&X-Amz-Signature=6e85436b6a7eedafac0d2173c233800bacd9da5203d6f879efef6a98b85ba8e2&X-Amz-SignedHeaders=host&response-content-disposition=inline",
          alt: "خرید اکانت Claude AI",
          width: 1200,
          height: 800,
        }}
        layout="default"
        theme={{
          headingColor: "text-gray-50",
          subheadingColor: "text-gray-500",
          descriptionColor: "text-gray-300",
          backgroundColor: "bg-indigo-700",
        }}
      />

      <StepsSection
        heading="مراحل خرید Claude AI"
        description="خرید اشتراک Claude AI ساده و شفاف است."
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
        heading="مزایای خرید Claude AI با ارزی پلاس"
        description="سرعت، امنیت و پشتیبانی حرفه‌ای تنها بخشی از مزایای ماست."
        buttonText="ثبت سفارش Claude AI"
        buttonLink="/claude-ai"
        items={whyUsItems}
        buttonColor="bg-indigo-800 hover:bg-indigo-900 text-white"
        theme={themesWhyus.dark}
      />

      <HeroSplitSection
        heading="ارزی پلاس، همراه شما در خرید هوش مصنوعی"
        subHeading="امنیت، سرعت و پشتیبانی حرفه‌ای"
        description="با ارزی پلاس می‌توانید اشتراک Claude AI را به ساده‌ترین روش خریداری کنید و بدون دغدغه از امکانات پیشرفته بهره‌مند شوید."
        buttons={[
          {
            text: "ثبت سفارش Claude AI",
            href: "/claude-ai",
            variant: "green",
            icon: <FaShieldAlt />,
          },
        ]}
        imageSrc="/assets/images/claude-ai-2.webp"
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
        description="پرسش‌های پرتکرار درباره Claude AI"
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
        heading="همین حالا اشتراک Claude AI خود را خریداری کنید!"
        description="با ارزی پلاس، به راحتی به دستیار هوشمند Claude AI دسترسی پیدا کنید."
        button={{
          text: "ثبت سفارش Claude AI",
          href: "/claude-ai",
          variant: "ghost",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.success}
        height={50}
      />
    </div>
  );
};

export default ClaudeAIPage;
