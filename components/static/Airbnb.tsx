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

const AirbnbPaymentPage = () => {
  const steps = [
    {
      id: "register",
      title: "ثبت نام در ارزی پلاس",
      description: "با چند کلیک ساده حساب کاربری بساز و آماده پرداخت شو.",
      icon: <FaDollarSign />,
      isActive: true,
    },
    {
      id: "selectService",
      title: "انتخاب خدمت مورد نظر",
      description: "پرداخت هزینه Airbnb را انتخاب کن.",
      icon: <FaCoins />,
    },
    {
      id: "payment",
      title: "پرداخت معادل ریالی",
      description:
        "معادل ریالی هزینه رزرو اقامتگاه را پرداخت کن و سفارشت نهایی شود.",
      icon: <FaPercent />,
      isActive: true,
    },
  ];

  const whyUsItems = [
    {
      id: 1,
      icon: <FaClock size={32} />,
      iconColor: "bg-indigo-700",
      title: "پرداخت سریع",
      description: "پرداخت رزرو اقامتگاه شما در کوتاه‌ترین زمان انجام می‌شود.",
    },
    {
      id: 2,
      icon: <FaLock size={32} />,
      iconColor: "bg-indigo-700",
      title: "امنیت بالا",
      description: "تمامی تراکنش‌ها از طریق حساب امن و مطمئن انجام می‌شود.",
    },
    {
      id: 3,
      icon: <FaPercent size={32} />,
      iconColor: "bg-indigo-700",
      title: "بدون کارمزد و قیمت مناسب",
      description: "بهترین نرخ و کمترین کارمزد برای پرداخت‌های Airbnb.",
    },
    {
      id: 4,
      icon: <FaHeadset size={32} />,
      iconColor: "bg-indigo-700",
      title: "پشتیبانی تخصصی",
      description: "کارشناسان ما تمام مراحل رزرو و پرداخت را راهنمایی می‌کنند.",
    },
  ];

  const faqItems = [
    {
      id: "1",
      question:
        "چگونه می‌توان با وجود محدودیت‌های بانکی، هزینه رزرو Airbnb را پرداخت کرد؟",
      answer:
        "صرافی‌های آنلاین معتبر مانند ارزی پلاس امکان پرداخت مستقیم به Airbnb را فراهم می‌کنند و محدودیت‌های بین‌المللی را دور می‌زنند.",
      category: "پرداخت",
    },
    {
      id: "2",
      question: "آیا استفاده از صرافی‌های آنلاین ایمن است؟",
      answer:
        "بله، صرافی‌های معتبر با استفاده از سیستم‌های امنیتی پیشرفته، اطلاعات مالی شما را محافظت می‌کنند.",
      category: "پرداخت",
    },
    {
      id: "3",
      question: "چه مدارکی برای پرداخت نیاز است؟",
      answer:
        "اطلاعات کامل رزرو در Airbnb، اطلاعات کارت بانکی و ایمیل یا حساب Airbnb مرتبط با رزرو.",
      category: "پرداخت",
    },
    {
      id: "4",
      question: "مزایای استفاده از صرافی‌های آنلاین چیست؟",
      answer:
        "سهولت پرداخت، سرعت بالا، امنیت و پشتیبانی حرفه‌ای از مهم‌ترین مزایا هستند.",
      category: "پرداخت",
    },
    {
      id: "5",
      question: "به چه نکاتی هنگام انتخاب صرافی توجه کنیم؟",
      answer:
        "اعتبار صرافی، کارمزد، نرخ ارز و سرعت انجام تراکنش نکات مهم هستند.",
      category: "پرداخت",
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
        heading="پرداخت هزینه Airbnb با ارزی پلاس در ایران"
        subheading="رزرو آسان و سریع اقامتگاه با Airbnb"
        description="Airbnb با به‌روزرسانی‌های سیاست‌های پرداخت در ژوئن (برای کاربران جدید فوری و قدیمی از سپتامبر)، پلتفرمی برتر برای رزرو اقامتگاه‌های جهانی است، اما تحریم‌های بین‌المللی پرداخت را برای ایرانیان چالش‌برانگیز می‌کند – کارت‌های محلی رد می‌شوند و محدودیت‌های ریسک اعمال می‌گردد. ارزی پلاس (ArziPlus.com) این مشکل را حل می‌کند و پرداخت هزینه Airbnb را بدون کارت اعتباری خارجی، با روش‌های داخلی امن، در عرض چند دقیقه انجام می‌دهد."
        buttons={[
          {
            text: "رزرو اقامتگاه",
            href: "/airbnb-payment",
            variant: "secondary",
            icon: <FaRocket />,
          },
        ]}
        media={{
          type: "image",
          src: "https://arziPlus.s3.eu-north-1.amazonaws.com/Desktop/35-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQ2WW34VA6%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T105625Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiSDBGAiEA7IHnT%2F1lv284EuhvVQZf4yF6WllV3ac0tT6isUZzK4MCIQCCEnm0oPDQXnvJobLQKB5rZiTvXWlyzfR71i%2FaGGdjLCrWAggsEAAaDDMxMTM3NjEyMDIyNSIML8PqESTt448c%2FdkDKrMC1ZBEvL3AlHlth9hXk1luJm8F%2BVf%2F6hkKeCGWY8jAXEJXx9%2BRiYChU2OlWsEzyJxMGRH1fCG%2FMEDVo1sqh98VOshPFDILQhJb43YKnVZSNETAq7oXkEecuYm0vVGkDFZzlF7VKOYvIVaXiANA86JxxU7Kpo4dLR20tvr2ls6yVb1iVHfCjhzekOvQ9S561H3lFuj3TZT1LmXd1XrH%2Bd%2BCBmR8EzX8cHTdRN6a3Fsz%2F7nxKb%2F7P2XNbT4WB60QQd516QCOospxcxvXyuCQgMz9YNo3LyZ71UGhDuLQkXLVdK5Gq1T7o5eYsGw6I4Wl7uKuBcJ6QaWKCH0LCsxhbG85LuILYpjQIh%2FmD7wiGgKK%2Fkxcpva5BmmG4Esuo848GgcsNCdymjz5Yd3Wn4qqSMmG104pSzCS8q3HBjqsAq9LaYV40ZQO%2BoZQl%2BOiysodYk5m7OPRqU5%2F3%2FujzNe14tF3dNop9030445vkhQWI%2F5P47EnohyjcHfbUyfnrX5FHBpR%2BLwwdAnEsiiz4WTOGJ%2FNPxJv4vUjB70X04K1fk0M%2F4hAuVCIUengmyay2NOiv7WqoVdTBWCk21KmArTqJRVqHnQv9H7NrDXh2ZSIHMt1ebRVGU3XiGGlJ4goCg72e%2Fb%2FG0wtJbBIblaXI3mzZrhUrI3Nlh63ets8cF8uKg%2FJ13chbLyBlIPb5wNXk%2Bpj4mKW9h%2Bsp0046aXEg1QVg%2BfTMrvMp%2BSB7e%2BKJmKysYJDAqYq4ZVWrvs5NnUBY6pexn4Kgp327Lo6Ky7FJpF5oo%2BEAC32Kkq8ONuQ8rvx2Z0kv%2B4SaT63WR5ngA%3D%3D&X-Amz-Signature=26f1e74065647fc5fcd6480423fcdc0972b2cc76504389d779dccaaddf0ce520&X-Amz-SignedHeaders=host&response-content-disposition=inline",
          alt: "پرداخت هزینه Airbnb",
          width: 1200,
          height: 800,
        }}
        layout="default"
        theme={{
          headingColor: "text-gray-50",
          subheadingColor: "text-gray-500",
          descriptionColor: "text-gray-300",
          backgroundColor: "bg-red-600",
        }}
      />

      <StepsSection
        heading="مراحل پرداخت"
        description="رزرو اقامتگاه در Airbnb فقط با چند کلیک ساده"
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
        heading="مزایای پرداخت با ارزی پلاس"
        description="سرعت، امنیت، قیمت مناسب و پشتیبانی حرفه‌ای"
        buttonText="رزرو اقامتگاه"
        buttonLink="/airbnb-payment"
        items={whyUsItems}
        buttonColor="bg-red-700 hover:bg-red-800 text-white"
        theme={themesWhyus.dark}
      />

      <HeroSplitSection
        heading="ارزی پلاس، همراه امن پرداخت‌های بین‌المللی شما"
        subHeading="سریع، امن و مطمئن"
        description="پرداخت هزینه رزرو اقامتگاه در Airbnb را بدون دردسر و با چند کلیک انجام دهید."
        buttons={[
          {
            text: "رزرو اقامتگاه",
            href: "/airbnb-payment",
            variant: "green",
            icon: <FaShieldAlt />,
          },
        ]}
        imageSrc="/assets/images/airbnb-2.webp"
        imageAlt="پرداخت هزینه Airbnb"
        theme={splitSectionThemes.dark}
        layout="image-left"
        imageWidth="1/2"
        features={[
          {
            id: 1,
            title: "پرداخت امن و سریع",
            description: "تمامی تراکنش‌ها با امنیت کامل انجام می‌شوند.",
            icon: <FaLock />,
          },
          {
            id: 2,
            title: "پشتیبانی تخصصی",
            description: "کارشناسان ما تمام سوالات شما را پاسخ می‌دهند.",
            icon: <FaHeadset />,
          },
          {
            id: 3,
            title: "کارمزد شفاف",
            description: "قبل از پرداخت، میزان کارمزد مشخص و شفاف است.",
            icon: <FaPercent />,
          },
        ]}
      />

      <FAQSection
        heading="سوالات متداول"
        description="پاسخ به متداول‌ترین سوالات درباره پرداخت هزینه‌های Airbnb"
        svgIcon={faqIcons.info}
        faqItems={faqItems}
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
        searchable={false}
        animate={true}
      />

      <CTABanner
        heading="همین حالا رزرو اقامتگاه خود را انجام بده!"
        description="با ارزی پلاس، پرداخت هزینه Airbnb سریع، امن و آسان است."
        button={{
          text: "رزرو اقامتگاه",
          href: "/airbnb-payment",
          variant: "ghost",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.success}
        height={50}
      />
    </div>
  );
};

export default AirbnbPaymentPage;
