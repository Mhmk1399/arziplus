import React from "react";
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
  FaExchangeAlt,
  FaGlobe,
  FaHeadset,
  FaLock,
  FaShieldAlt,
  FaDollarSign,
  FaPeopleArrows,
  FaShoppingCart,
  FaUniversity,
  FaEnvelope,
  FaRocket,
} from "react-icons/fa";
import HeroSplitSection from "../global/heroSplitSection";
import WhyUsSection from "../global/whyUs";
import FAQSection from "../global/faqSection";
import CTABanner from "../global/ctaBanner";
import SmoothTimeline from "../global/scrollTimeline";
import ServicesGrid from "../global/ServicesGrid";
import { FaSimCard } from "react-icons/fa6";
import { FaPaypal } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import { FaAddressBook } from "react-icons/fa6";
import { MdOutlineSupportAgent } from "react-icons/md";

interface TimelineStep {
  id: number;
  title: string;
  desc: string;
}

const PaypalOpening = () => {
  const registrationSteps = [
    {
      id: "fastRegistration",
      title: "افتتاح سریع",
      description:
        "افتتاح حساب پی‌پال در کوتاه‌ترین زمان ممکن (5 تا 7 روز کاری)         بدون هیچ دردسری.",
      icon: <FaClock />,
      isActive: true,
    },
    {
      id: "sim",
      title: "سیم کارت فیزیکی خارجی",
      description:
        "به همراه افتتاح حساب پی پال وریفای شده یک سیم کارت فیزیکی بین المللی نیز به شما داده میشود که داخل ایران آنتن دهی و دریافت پیامک دارد",
      icon: <FaSimCard />,
      isActive: true,
    },
    {
      id: "fullVerification",
      title: "وریفای کامل",
      description:
        "حساب پی‌پال شما با مدارک شخصی مشتری (پاسپورت ایرانی) و مدارک اقامتی معتبر وریفای کامل می‌شود تا بدون محدودیت استفاده کنید.",
      icon: <FaShieldAlt />,
    },
    {
      id: "internationalCards",
      title: "اتصال به کارت‌های بین‌المللی",
      description:
        "امکان اتصال حساب به کارت‌های Visa و MasterCard برای مدیریت آسان پرداخت‌ها.",
      icon: <FaGlobe />,
      isActive: true,
    },
    {
      id: "safeTransactions",
      title: "ارسال و دریافت پول",
      description:
        "ارسال و دریافت وجه از سراسر دنیا به‌صورت امن و بدون ریسک مسدود شدن.",
      icon: <FaExchangeAlt />,
    },
    {
      id: "support247",
      title: "پشتیبانی ۲۴/۷",
      description:
        "پشتیبانی اختصاصی شبانه‌روزی برای رفع مشکلات احتمالی و راهنمایی کامل شما.",
      icon: <FaHeadset />,
      isActive: true,
    },
    {
      id: "secureAccess",
      title: "آموزش دسترسی امن از ایران",
      description:
        "آموزش کامل دسترسی از ایران به وسیله VPS  های مطمئن و ارائه خدمات آن",
      icon: <FaLock />,
    },
  ];
  const defaultSteps: TimelineStep[] = [
    { id: 1, title: " افتتاح حساب کاربری در وبسایت", desc: "" },
    { id: 2, title: "احراز حویت حساب کاربری", desc: "" },
    { id: 3, title: "ثبت درخواست افتتاح پی پال", desc: "" },
    { id: 4, title: "حساب شما آمادست", desc: "" },
  ];
  const itemsWhyus = [
    {
      id: 1,
      icon: <FaShoppingCart size={32} />,
      iconColor: "bg-blue-500",
      title: "خرید از فروشگاه‌های بین‌المللی",
      description:
        "با افتتاح حساب پی‌پال می‌توانید از وب‌سایت‌های مطرح دنیا مانند Amazon، eBay و AliExpress به‌صورت مستقیم خرید کنید.",
    },
    {
      id: 2,
      icon: <FaUniversity size={32} />,
      iconColor: "bg-blue-500",
      title: "پرداخت آزمون‌های بین‌المللی",
      description:
        "امکان پرداخت آسان هزینه آزمون‌هایی مثل IELTS، TOEFL، GRE و بسیاری دیگر با استفاده از حساب پی‌پال.",
    },
    {
      id: 3,
      icon: <FaDollarSign size={32} />,
      iconColor: "bg-blue-500",
      title: "دریافت درآمد ارزی",
      description:
        "به راحتی درآمد خود را از وب‌سایت‌های فریلنسری بین‌المللی مانند Upwork، Fiverr و Freelancer به حساب پی‌پال منتقل کنید.",
    },
    {
      id: 4,
      icon: <FaPeopleArrows size={32} />,
      iconColor: "bg-blue-500",
      title: "انتقال وجه به خانواده یا دوستان",
      description:
        "ارسال وجه به خانواده یا دوستان در خارج از کشور تنها با چند کلیک و در سریع‌ترین زمان ممکن.",
    },
    {
      id: 5,
      icon: <FaGlobe size={32} />,
      iconColor: "bg-blue-500",
      title: "خرید اشتراک سرویس‌های آنلاین",
      description:
        "پرداخت و خرید اشتراک سرویس‌هایی مثل Netflix، Adobe، ChatGPT، MQL5 و بسیاری از پلتفرم‌های آنلاین با پی‌پال.",
    },
  ];

  const faqData = [
    {
      id: "1",
      question: "آیا حساب پی‌پال افتتاح‌شده توسط ارزی پلاس محدودیت دارد؟",
      answer:
        "خیر، تمام حساب‌ها به‌صورت کامل وریفای شده و بدون هیچ محدودیتی ارائه می‌شوند و قابل استفاده برای خرید، فروش و دریافت وجه هستند.",
      category: "حساب پی‌پال",
    },
    {
      id: "2",
      question: "آیا امکان برداشت موجودی حساب پی‌پال وجود دارد؟",
      answer:
        "بله، ارزی پلاس خدمات نقد کردن موجودی پی‌پال را ارائه می‌دهد و شما می‌توانید موجودی خود را به‌صورت ریالی دریافت کنید.",
      category: "برداشت و نقد کردن",
    },
    {
      id: "3",
      question: "آیا می‌توانم با آی‌پی ایران وارد حساب شوم؟",
      answer: "خیر، حتما باید با VPS های امنی که شرکت در اختیار شما میدهد یا پیشنهاد میدهد، استفاده نمایید. به محض وارد شدن با آی پی ایران، حسابتان بسته میشود.",
       category: "ورود و امنیت",
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
      {" "}
      <HeroSection
        heading="افتتاح حساب پی‌پال بین‌المللی و وریفای‌شده در ایران با ارزی پلاس"
        subheading="100 درصد وریفای شده"
        description="پی‌پال (PayPal) محبوب‌ترین و امن‌ترین سیستم پرداخت بین‌المللی است که میلیون‌ها کاربر در سراسر جهان برای خرید اینترنتی، انتقال وجه، دریافت درآمد ارزی و پرداخت‌های آنلاین از آن استفاده می‌کنند. با وجود محدودیت‌های ایجاد شده برای کاربران ایرانی، ارزی پلاس راهکاری سریع و مطمئن ارائه می‌دهد تا بدون نیاز به سفر یا داشتن اقامت خارجی، یک حساب پی‌پال وریفای‌شده و ۱۰۰٪ امن افتتاح کنید و از تمامی امکانات آن، مانند خرید از سایت‌های خارجی و دریافت پول از مشتریان بین‌المللی، بهره‌مند شوید."
        buttons={[
          {
            text: "شروع کنید",
            href: "/register",
            variant: "secondary",
            icon: <FaExplosion />,
          },
        ]}
        media={{
          type: "image",
          src: "https://arziPlus.s3.eu-north-1.amazonaws.com/Desktop/12-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQWGHQVYIL%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T094814Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiSDBGAiEAt4%2BB6h6GLjcmRH9br6l7jiS42KQneka9Mh8ontMH%2FzQCIQC2VEgrU192t8neq6ohop98IduPA61%2FcKBk%2Bvwigi4x7CrWAggrEAAaDDMxMTM3NjEyMDIyNSIMMxsuTD1EWJIXQR%2FPKrMCL96aFf1S4lL78CmOIrRZa4U%2BLljYiZ%2FJBHHBuqgGP4dvmPvPhQwFqNXzhCePERfktzTNuIXqEhlrjFJbH6fRjDkYSFLTZg62UzGqLb6jKJZkyHvzxvTAxzYx9RJ0H8CoX%2BAfZ7ZXj7scLbWG1oBvMznFNZUIxR%2BjamDIZLoFjzhganE8XlZ9ywoKVEIFNDZJY2H0QUNRw3N%2FyrU04USmjaZM3EjW%2F9LUBV%2FbL4Yo9nxfmZAMA0Jgui1tmKT2h13YlCZ25EbBd8FYkfPazEGTHVOeRuYJXjTHHO%2BcZm94RSxd31%2BIlNCQ19XEkqL8dwgmzhlybWv9a83Th6a0lqu%2FuXmarEm0Hom6u8e0JghkKIVCJDGqWvQskk%2FCF6iUbfePqMDwxA5xsle4IHJ8rCMBeZ74cjCS8q3HBjqsAgwoSsgy5rsUiQ8JWwNpAKJQ0vFgKcbzP4%2BdQUJPy52TL6rhhD17GQyjK8BKPIdQ6e%2FDm9EkVmZwRCjQXJbNABgQzYoipUFUkBq%2FEQ72THqg7EbH4xi6%2Bfw%2FRFHToqoGd%2FN%2B8z3%2BWceexBjsAD6Hx29YbS0KtdWOdsAKxFjCQEBtA9hJ%2FROdBQoOZse4itNmEIXZ%2BxEtai1IgA1H5b2HoGR7X6v2HxZetorMwln%2F4XvKp2%2BND7UapMRYEaj8JQ08iCoKWjG6SgcldNoEs1kygHziqqhU97kBTaL7%2BD2U%2B8uzV6cXyC9m8m06NLy0hSpaofux%2Bevgf9DtvX6pa%2BMFfGffnbntpZxCyYPIXiLJwIq8aW2t4GFS6qk7l2pfPdimn7iYPoGzMm83wAeZFw%3D%3D&X-Amz-Signature=d26cbd9f66e75ce867e14970b60961f555951883c89f987db2c6209ee7171784&X-Amz-SignedHeaders=host&response-content-disposition=inline",
          alt: "صرافی آنلاین پیشرفته",
          width: 1200,
          height: 400,
        }}
      />
      <StepsSection
        heading="مزایای افتتاح حساب پی پال"
        description="با توجه به پراکندگی گسترده حساب‌های پی‌پال در سطح جهان و توانایی پشتیبانی از ارزهای متنوع، ایجاد یک حساب پی‌پال می‌تواند انتقالات مالی را برای صاحب حساب به سادگی تسهیل کند. از جمله مزایای بارز در افتتاح حساب پی‌پال می‌توان به امکانات زیر اشاره نمود:"
        steps={registrationSteps}
        theme={stepThemes.colorful}
        layout="vertical"
        boxShape="rounded"
        boxSize="sm"
        showNumbers={true}
        animated={true}
        interactive={true}
        showIcons={true}
       />
      <WhyUsSection
        heading="کاربردهای حساب پی‌پال"
        description="با افتتاح حساب پی‌پال از طریق ارزی پلاس، می‌توانید به امکانات گسترده‌ای دسترسی داشته باشید:"
        buttonText="افتتاح حساب پی‌پال"
        buttonLink="/paypal-account"
        items={itemsWhyus}
        buttonColor="bg-blue-500 hover:bg-blue-700 text-white"
        theme={themesWhyus.default}
      />
      <SmoothTimeline
        title="مراحل ساخت حساب پی پال"
        subtitle="با طی کردن مراحل زیر به راحتی حساب خود را افتتاح کنید"
        steps={defaultSteps}
        compact={false}
      />
      <ServicesGrid

         services={[
          {
            name: "حساب پی پال وریفای شده",
            description:
              "دریافت حساب پی پال کامل همراه با سیم کارت مخصوص برای احراز هویت",
            icon: <FaPaypal />,
          },

          {
            name: "سیم کارت فیزیکی بین المللی",
            description:
              "استفاده امن از حساب پی پال به صورت امانتی با ضمانت کامل",
            icon: <FaSimCard />,
          },
          {
            name: "آموزش کار با پی پال",
            description:
              "سرور مجازی اختصاصی برای دسترسی امن به خدمات بین‌المللی",
            icon: <FaUserEdit />,
          },
          {
            name: "مدارک تایید آدرس",
            description:
              "دریافت حساب پی پال کامل همراه با سیم کارت مخصوص برای احراز هویت",
            icon: <FaAddressBook />,
          },
          {
            name: "پشتیبانی ارزی پلاس",
            description:
              "استفاده امن از حساب پی پال به صورت امانتی با ضمانت کامل",
            icon: <MdOutlineSupportAgent  />,
          },
        ]}
        title="افتتاح حساب پی پال شامل چه مواردی میشود"
      />
      <HeroSplitSection
        heading="چرا ارزی پلاس؟"
        subHeading="امنیت و اطمینان در افتتاح حساب پی‌پال"
        description="در ارزی پلاس، تمام مراحل افتتاح و وریفای حساب پی‌پال توسط تیمی حرفه‌ای و متخصص در حوزه پرداخت‌های بین‌المللی انجام می‌شود. ما علاوه بر افتتاح حساب، مشاوره امنیتی ارائه می‌کنیم تا از حساب خود بدون ریسک مسدود شدن استفاده کنید. هدف ما این است که کاربران ایرانی بتوانند به‌راحتی و با خیالی آسوده به خدمات مالی جهانی دسترسی پیدا کنند."
        buttons={[
          {
            text: "افتتاح حساب پی‌پال با ارزی پلاس",
            href: "/paypal-account",
            variant: "primary",
            icon: <FaShieldAlt />,
          },
        ]}
        imageSrc="/assets/images/whypaypal.png"
        imageAlt="خرید با پی‌پال"
        theme={splitSectionThemes.blue}
        layout="image-left"
        imageWidth="1/2"
      />
      <FAQSection
        heading="سوالات متداول"
        description="پاسخ سوالات رایج درباره خدمات ارزی پلاس را در اینجا بیابید"
        svgIcon={faqIcons.info}
        faqItems={faqData}
        buttons={[
          {
            text: "ارسال سوال",
            href: "/support",
            variant: "outline",
            icon: <FaEnvelope />,
          },
        ]}
        theme={faqThemes.minimal}
        layout="default"
        showCategories={true}
        searchable={true}
        animate={true}
      />
      <CTABanner
        heading="همین حالا حساب پی‌پال خود را افتتاح کنید!"
        description="با ارزی پلاس، به دنیای پرداخت‌های بین‌المللی متصل شوید و بدون محدودیت از خدمات پی‌پال استفاده کنید."
        button={{
          text: "ثبت درخواست افتتاح حساب پی‌پال",
          href: "/register",
          variant: "primary",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.primary}
        height={50}
      />
    </div>
  );
};

export default PaypalOpening;
