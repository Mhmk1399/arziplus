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

const BookingPaymentPage = () => {
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
      description: "پرداخت هزینه Booking.com را انتخاب کن.",
      icon: <FaCoins />,
    },
    {
      id: "payment",
      title: "پرداخت معادل ریالی",
      description:
        "معادل ریالی هزینه رزرو هتل را پرداخت کن و سفارشت نهایی شود.",
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
      description: "پرداخت رزرو هتل شما در کوتاه‌ترین زمان انجام می‌شود.",
    },
    {
      id: 2,
      icon: <FaLock size={32} />,
      iconColor: "bg-indigo-700",
      title: "امنیت بالا",
      description:
        "تمامی تراکنش‌ها با امنیت کامل و از طریق حساب مطمئن انجام می‌شود.",
    },
    {
      id: 3,
      icon: <FaPercent size={32} />,
      iconColor: "bg-indigo-700",
      title: "قیمت مناسب",
      description: "بهترین نرخ و کمترین کارمزد برای پرداخت‌های Booking.com.",
    },
    {
      id: 4,
      icon: <FaHeadset size={32} />,
      iconColor: "bg-indigo-700",
      title: "پشتیبانی حرفه‌ای",
      description: "کارشناسان ما در تمام مراحل همراه شما هستند.",
    },
  ];

  const faqItems = [
    {
      id: "1",
      question: "چگونه می‌توان هزینه رزرو هتل در Booking.com را پرداخت کرد؟",
      answer:
        "برای کاربران ایرانی که دسترسی به کارت‌های بین‌المللی ندارند، صرافی‌های آنلاین مانند ارزی پلاس امکان پرداخت مستقیم به Booking.com را فراهم می‌کنند.",
      category: "پرداخت",
    },
    {
      id: "2",
      question: "آیا استفاده از صرافی‌های آنلاین ایمن است؟",
      answer:
        "بله، صرافی‌های معتبر مانند ارزی پلاس با رعایت استانداردهای امنیتی و رمزنگاری، از اطلاعات مالی شما محافظت می‌کنند.",
      category: "پرداخت",
    },
    {
      id: "3",
      question: "چه مدارکی برای پرداخت نیاز است؟",
      answer:
        "اطلاعات رزرو هتل، اطلاعات کارت بانکی و اطلاعات حساب Booking.com یا ایمیل مرتبط با رزرو.",
      category: "پرداخت",
    },
    {
      id: "4",
      question: "مزایای استفاده از صرافی‌های آنلاین چیست؟",
      answer:
        "سهولت پرداخت، سرعت بالا، امنیت و پشتیبانی تخصصی از مهم‌ترین مزایا هستند.",
      category: "پرداخت",
    },
    {
      id: "5",
      question: "آیا کارمزد برای پرداخت وجود دارد؟",
      answer:
        "بله، کارمزد بسته به نوع ارز و مبلغ پرداخت متفاوت است؛ قبل از پرداخت کارمزد را بررسی کنید.",
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
        heading="پرداخت هزینه Booking.com"
        subheading="با چند کلیک، هتل دلخواهت را رزرو کن!"
        description="با ارزی پلاس، رزرو هتل و پرداخت هزینه Booking.com سریع، امن و آسان است."
        buttons={[
          {
            text: "رزرو هتل",
            href: "/booking-payment",
            variant: "secondary",
            icon: <FaRocket />,
          },
        ]}
        media={{
          type: "image",
          src: "https://arziplus.s3.eu-north-1.amazonaws.com/Desktop/34-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQUSCHXCII%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T105547Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiSDBGAiEAggPRzhQuf4NgI1r0b9Hh%2BOvHsp8v1HjPhrNiv5ZOFCYCIQCwNh8AiHck%2BQKdT2GW1QBK11yF%2BYLsTaGR8dGW%2BzgyDirWAggsEAAaDDMxMTM3NjEyMDIyNSIM9qfZkt6Q7QUU0V0nKrMCZ0KhzQrqCcsH%2FoKkpF%2F1HDbrW45sBeH9o1H%2BmEI%2Ba17IxIl0EZE1%2F3ngHE5TVI7zvHUeH27TBb060edYIW2%2BtCvZLNZxNR8cKRQt6OQoSuF7QfNZArkXet7RR16tmOks5NrK5EERON71CJ3nNuPqfnDqsIjvSQAhIphOAtgqVI6CRbMPEOzy6IdbZEdYSTFiw3hMb8wcVaqntNFln0wXi0BTGsm9wQcMtsIpz0lU9bdSIUKyVado%2B7SG%2Fk1X5kdzdzlHeIjcLcilTaFWSXmxmOoTAmTjdu%2FlMud2X%2FuXq93Tdl6fS3eiTW69JvElcIDAWIuRVdGtUgrqnSBPBkG6oXn3gz7y4ce1YSFFTEAjNvbovnntQVBlMNdO7QRyeXf8bGaB5M8W7NaBqx1OUlTfUPv2zTCS8q3HBjqsAtwRrz1nkU3ZLhs7UWAL2eYgsUcu2GvvH7x11e%2Bih%2Fb4mIAfl3UrnDpjfIKyUIv7mJ5Nbnqo7kpjp9e1vWlhkLVHs1lEa1FE%2Bn4G48SaztXjyER9tOCUxIwQ9WmCtSKRe1i6phGLU%2FlPtpy3GK%2BgdZJE2rFhLHfilyhue0x71ELioAX3itP6lKOCaGasjQykhies%2FCjxGw0i2Mkxh1FeyOfexfQ462xxJN2mFSuXOX9WTzj26RmEBAM2kr%2FfmuVJS290O6wkk50uI0vl3iWlVsUdPAk8MyCjux1PfMIHUppa9cxGHllWyw5EnZRqUw5r4HnEiChLdgP%2FqCndBoYFr%2BAG80ESYjQfPbUzmPHnmJk1QHFxZPvWM1lqGdP8XdfTvvUhkbpmEDPBWigm5w%3D%3D&X-Amz-Signature=ed302765b324c65607fe310b9d50bd86de6fc85e541d902f3b77c43e904cb864&X-Amz-SignedHeaders=host&response-content-disposition=inline",
          alt: "پرداخت هزینه Booking.com",
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
        heading="مراحل پرداخت"
        description="رزرو هتل در Booking.com فقط با چند کلیک ساده"
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
        buttonText="رزرو هتل"
        buttonLink="/booking-payment"
        items={whyUsItems}
        buttonColor="bg-indigo-800 hover:bg-indigo-900 text-white"
        theme={themesWhyus.dark}
      />

      <HeroSplitSection
        heading="ارزی پلاس، همراه امن پرداخت‌های بین‌المللی شما"
        subHeading="سریع، امن و مطمئن"
        description="پرداخت هزینه رزرو هتل در Booking.com را بدون دردسر و با چند کلیک انجام دهید."
        buttons={[
          {
            text: "رزرو هتل",
            href: "/booking-payment",
            variant: "green",
            icon: <FaShieldAlt />,
          },
        ]}
        imageSrc="/assets/images/booking-2.webp"
        imageAlt="پرداخت هزینه Booking.com"
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
        description="پاسخ به متداول‌ترین سوالات درباره پرداخت هزینه‌های Booking.com"
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
        heading="همین حالا رزرو هتل خود را انجام بده!"
        description="با ارزی پلاس، پرداخت هزینه Booking.com سریع، امن و آسان است."
        button={{
          text: "رزرو هتل",
          href: "/booking-payment",
          variant: "ghost",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.success}
        height={50}
      />
    </div>
  );
};

export default BookingPaymentPage;
