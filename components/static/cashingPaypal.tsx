import { Metadata } from "next";
 
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
  FaCoins,
  FaPercent,
  FaMedal,
  FaEnvelope,
} from "react-icons/fa6";
import { FaShieldAlt } from "react-icons/fa";
import HeroSection from "../global/heroSection";
import StepsSection from "../global/stepsSection";
import WhyUsSection from "../global/whyUs";
import HeroSplitSection from "../global/heroSplitSection";
import FAQSection from "../global/faqSection";
import CTABanner from "../global/ctaBanner";

export const metadata: Metadata = {
  title: "نقد کردن موجودی پی‌پال در ایران | ارزی پلاس",
  description:
    "با ارزی پلاس، موجودی پی‌پال خود را سریع و امن در ایران نقد کنید. تسویه در کمتر از ۲۴ ساعت، کارمزد پایین و پشتیبانی ۲۴ ساعته.",
  keywords: [
    "نقد کردن پی‌پال",
    "برداشت پی‌پال در ایران",
    "پی‌پال ارزی پلاس",
    "تبدیل موجودی پی‌پال",
    "حساب پی‌پال ایرانی",
  ],
  openGraph: {
    title: "نقد کردن موجودی پی‌پال در ایران | ارزی پلاس",
    description:
      "تسویه سریع و امن موجودی پی‌پال در ایران با ارزی پلاس. کارمزد پایین و پشتیبانی ۲۴ ساعته برای فریلنسرها و فروشندگان آنلاین.",
    url: "https://arziplus.com/cashing-paypal",
    type: "website",
    images: [
      {
        url: "https://arziplus.com/assets/images/cash-paypal.webp",
        width: 1200,
        height: 630,
        alt: "نقد کردن موجودی پی‌پال",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "نقد کردن موجودی پی‌پال در ایران | ارزی پلاس",
    description:
      "موجودی پی‌پال خود را با ارزی پلاس نقد کنید. تسویه سریع، کارمزد پایین و پشتیبانی ۲۴ ساعته.",
    images: ["https://arziplus.com/assets/images/cash-paypal.webp"],
  },
  alternates: {
    canonical: "https://arziplus.com/cashing-paypal",
  },
};

const CashingPaypal = () => {
  const cashingSteps = [
    {
      id: "fastPayment",
      title: "تسویه سریع در کمتر از ۲۴ ساعت کاری",
      description:
        "با ارزی پلاس، موجودی پی‌پال شما در کوتاه‌ترین زمان به ریال منتقل می‌شود.",
      icon: <FaClock />,
      isActive: true,
    },
    {
      id: "competitiveFees",
      title: "کارمزد رقابتی و نرخ تبدیل شفاف",
      description:
        "نرخ تبدیل و کارمزد کاملاً شفاف برای همه کاربران ارائه می‌شود.",
      icon: <FaPercent />,
    },
    {
      id: "multiCurrency",
      title: "امکان نقد موجودی دلاری، یورویی و سایر ارزها",
      description:
        " تمام ارزهای اصلی قابل نقد شدن هستند و مبلغ ریالی به حساب شما منتقل می‌شوند.",
      icon: <FaDollarSign />,
      isActive: true,
    },
    {
      id: "fullSupport",
      title: "پشتیبانی ۲۴ ساعته",
      description: "تیم پشتیبانی ارزی پلاس همیشه آماده پاسخگویی است.",
      icon: <FaHeadset />,
    },
    {
      id: "securePayment",
      title: "بدون ریسک مسدود شدن حساب",
      description:
        "تمامی تراکنش‌ها با امنیت بالا انجام می‌شود و حساب شما در امان است.",
      icon: <FaLock />,
      isActive: true,
    },
  ];
  const cashingUseCases = [
    {
      id: 1,
      icon: <FaDollarSign size={32} />,
      iconColor: "bg-blue-900",
      title: "دریافت درآمد فریلنسری",
      description:
        "برداشت درآمد از Upwork، Fiverr، Freelancer و سایر پلتفرم‌های خارجی.",
    },
    {
      id: 2,
      icon: <FaCoins size={32} />,
      iconColor: "bg-blue-900",
      title: "تسویه فروشگاه‌های بین‌المللی",
      description: "نقد کردن درآمد فروش در eBay، Etsy و دیگر فروشگاه‌ها.",
    },
    {
      id: 3,
      icon: <FaRocket size={32} />,
      iconColor: "bg-blue-900",
      title: "پرداخت مشتریان خارجی",
      description:
        "دریافت و نقد کردن پرداخت‌های مشتریان خارج از ایران با امنیت کامل.",
    },
    {
      id: 4,
      icon: <FaMedal size={32} />,
      iconColor: "bg-blue-900",
      title: "تبدیل درآمد دلاری به ریال",
      description: "تبدیل سریع و مطمئن درآمد دلاری با بهترین نرخ بازار.",
    },
  ];
  const cashingFaq = [
    {
      id: "1",
      question: "آیا امکان نقد کردن پی‌پال محدودشده وجود دارد؟",
      answer: "خیر، ابتدا باید محدودیت حساب رفع شود.",
      category: "نقد کردن پی‌پال",
    },
    {
      id: "2",
      question: "آیا می‌توان بخشی از موجودی را نقد کرد؟",
      answer: "بله، نقد کردن هر مبلغی امکان‌پذیر است.",
      category: "نقد کردن پی‌پال",
    },
    {
      id: "3",
      question: "آیا کارمزد ثابت وجود دارد؟",
      answer: "خیر، کارمزد بسته به مبلغ و نوع تراکنش محاسبه می‌شود.",
      category: "نقد کردن پی‌پال",
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
        heading="تسویه سریع و امن موجودی پی‌پال در ایران با ارزی پلاس"
        subheading="نقد کردن موجودی پی‌پال"
        description="پی‌پال (PayPal) یکی از محبوب‌ترین سیستم‌های پرداخت بین‌المللی است که بسیاری از فریلنسرها، فروشندگان آنلاین و صاحبان کسب‌وکارهای بین‌المللی از آن برای دریافت درآمد استفاده می‌کنند. اما کاربران ایرانی به دلیل محدودیت‌های بانکی، امکان برداشت مستقیم از پی‌پال را ندارند.
با خدمات ارزی پلاس، می‌توانید موجودی پی‌پال خود را در کوتاه‌ترین زمان به ریال یا ارزهای دیگر تبدیل کنید، با بهترین نرخ و بدون ریسک مسدود شدن حساب."
        buttons={[
          {
            text: "ثبت درخواست نقد کردن پی‌پال",
            href: "/cashing-paypal",
            variant: "secondary",
            icon: <FaRocket />,
          },
        ]}
        media={{
          type: "image",
          src: "https://arziplus.s3.eu-north-1.amazonaws.com/Desktop/16-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQ5EELYY2J%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T095202Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRjBEAiByDo%2Br8MnXopjescgmieb9NBtPIPMq1BRLBn6YkJhjzgIgUbhr%2BAeHkW3Ra9RpWLR1h9KL%2BasevF92M9VrYIPHArgq1gIIKxAAGgwzMTEzNzYxMjAyMjUiDFGVAq9zVaxAgy2bEyqzAmncKDbdw69dT8tVE9jDgPaHfW2ayuLlsJ4mQp77mk74w8Fzxws0pIiFNSrB6qBV7sYtlxI3TkarD5IG2OPXubiAjeR6lDi6I4Xq0wSRlJ64lz%2BfFhwQv5kIGg%2FI%2FFjhqvkFrYWmqiRrm7ZbRH4yWXYcs5Jiu9lGs2lCKzATEIUT6ia1BQAOPHJS7t0FwGumm61HMqe9sZBMPbJPVN4w90QveZ9vDwFLBNv2FgIKpWsdovrSELeqbRGwR6h1priqzMGFq1P8s64%2Fl8ucp6f9mgJa%2FrT7MXgEkahsV%2Bc54UoHw7glFkBxJLCIfNXGLKiyrXaaiGXfvUCa8XqsipdS6G5FDWOyb0nuQ3lyAhhLYoQMIGZv3Edm1BaPQY%2B0kgsUN4MzDA2ktQVWvZxEPDWwH93xOGQwkvKtxwY6rgLbxHcmWh8w5PYbTIFEnmldYC2G7PlytUMhR5gBZRyY3O%2B%2BM20kfPVF%2FSR8m0nhZFy4eZAJzVDZKQHTpPE2ptPznODMqzizUha8RSrkmiDVD09H%2BOtMUYsnHaMx5hN8%2FVRi7nI4sOGZLCT12G7gwDcxhRaf%2Bn27RI1EcWXTmugnYUoFBSVm%2F1ugRfn06UO9BqV%2B5nB5jDrWfUJuf2D2TKFrsdxL%2FeRzYyu1ChYJ9PcKPu0c0lW3P4Meul5potNG9G8WBa4JRdvUAvkiwUreAvYzAoghOveZTGilHdz0gxhWQOyVF%2FOdHeMrfuqPmwaDqGlDnJvqb6B4maWgeEGgxx%2FKBkMTpxrEdoKr%2FGwzC7Zg4uEggGzkp3CMza10iHcyVVvDgzfHwe0igBaatCNudw%3D%3D&X-Amz-Signature=333705f2c51177d87dc72489633c1be6d3e55a96b0f069e4e59d4a7eeb15eb89&X-Amz-SignedHeaders=host&response-content-disposition=inline",
          alt: "نقد کردن موجودی پی‌پال",
          width: 1200,
          height: 800,
        }}
        layout="default"
        theme={{
          headingColor: "text-gray-50",
          subheadingColor: "text-gray-700",
          descriptionColor: "text-gray-200",
          backgroundColor: "bg-blue-600",
        }}
      />

      <StepsSection
        heading="مزایای نقد کردن پی‌پال با ارزی پلاس"
        description="با ارزی پلاس، تسویه سریع، کارمزد شفاف و امنیت کامل را تجربه کنید:"
        steps={cashingSteps}
        theme={stepThemes.minimal}
        layout="vertical"
        boxShape="rounded"
        boxSize="sm"
        showNumbers={true}
        animated={true}
        showIcons={true}
      />

      <WhyUsSection
        heading="کاربردهای نقد کردن پی‌پال"
        description="دریافت درآمد از فریلنسری، فروشگاه‌ها و مشتریان خارجی:"
        buttonText="ثبت درخواست نقد کردن"
        buttonLink="/cashing-paypal"
        items={cashingUseCases}
        buttonColor="bg-blue-800 hover:bg-blue-900 text-white"
        theme={themesWhyus.dark}
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
        heading="سؤالات متداول"
        description="پرسش‌های پرتکرار درباره نقد کردن موجودی پی‌پال"
        svgIcon={faqIcons.info}
        faqItems={cashingFaq}
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
        heading="همین حالا موجودی پی‌پال خود را با ارزی پلاس نقد کنید!"
        description="با ارزی پلاس، درآمدتان سریع و مطمئن دریافت می‌شود."
        button={{
          text: "ثبت درخواست نقد کردن پی‌پال",
          href: "/cashing-paypal",
          variant: "primary",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.light}
        height={50}
      />
    </div>
  );
};

export default CashingPaypal;
