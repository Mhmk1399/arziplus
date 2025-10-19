import HeroSection from "../global/heroSection";
import { FaExplosion } from "react-icons/fa6";
import {
  ctaThemes,
  faqThemes,
  textBoxThemes,
  textBoxTypography,
  themesWhyus,
} from "@/lib/theme";
import {
  FaEnvelope,
  FaRocket,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaHeadset,
  FaUserTie,
  FaGlobe,
} from "react-icons/fa";
import FAQSection from "../global/faqSection";
import CTABanner from "../global/ctaBanner";
import TextBox from "../global/textBox";
import WhyUsSection from "../global/whyUs";

const ContactPage = () => {


  const whyChooseUs = [
    {
      id: 1,
      icon: <FaClock size={32} />,
      iconColor: "bg-emerald-700",
      title: "پاسخگویی سریع و دقیق",
      description: "پاسخگویی سریع و دقیق در تمام روزهای هفته",
    },
    {
      id: 2,
      icon: <FaUserTie size={32} />,
      iconColor: "bg-blue-700",
      title: "مشاوره تخصصی",
      description: "مشاوره تخصصی قبل از ثبت سفارش",
    },
    {
      id: 3,
      icon: <FaGlobe size={32} />,
      iconColor: "bg-purple-700",
      title: "راهنمایی کامل",
      description: "راهنمایی در افتتاح حسابها و پرداختهای بینالمللی",
    },
    {
      id: 4,
      icon: <FaHeadset size={32} />,
      iconColor: "bg-orange-700",
      title: "پشتیبانی چندکاناله",
      description: "پشتیبانی از طریق ایمیل، تلفن و شبکههای اجتماعی",
    },
  ];


  const contactFaq = [
    {
      id: "1",
      question: "چگونه با ارزی پلاس تماس بگیرم؟",
      answer:
        "از طریق تلفن ۰۲۱ – ۹۱۰۰ XXX، تلگرام، واتساپ یا ایمیل support@arziPlus.com در ساعات اداری تماس بگیرید.",
      category: "روشهای تماس",
    },
    {
      id: "2",
      question: "آدرس دفتر ارزی پلاس کجاست؟",
      answer:
        "دفتر مرکزی: تهران، خیابان ولیعصر، بالاتر از پارک ملت، ساختمان تجارت بینالملل، طبقه سوم",
      category: "آدرس",
    },
    {
      id: "3",
      question: "ساعات کاری پشتیبانی چیست؟",
      answer:
        "شنبه تا پنجشنبه از ۹ صبح تا ۶ عصر. جمعه و تعطیلات رسمی فقط پشتیبانی آنلاین.",
      category: "ساعات کاری",
    },
    {
      id: "4",
      question: "چه خدماتی از طریق تماس ارائه میشود؟",
      answer:
        "مشاوره تخصصی، راهنمایی افتتاح حساب، پرداختهای بینالمللی، ثبت شرکت و تمام خدمات ارزی.",
      category: "خدمات",
    },
    {
      id: "5",
      question: "آیا پشتیبانی رایگان است؟",
      answer: "بله، تمام مشاوره و پشتیبانی ارزی پلاس کاملاً رایگان است.",
      category: "هزینه",
    },
  ];

  return (
    <div>
      <HeroSection
        heading="تماس با ارزی پلاس"
        subheading="همیشه در دسترس شما هستیم"
        description="در ارزی پلاس، ارتباط با شما فقط یک گزینه نیست، بلکه بخشی از تعهد ماست.
تیم پشتیبانی ما همیشه آماده پاسخگویی به پرسشها، درخواستها و راهنمایی در خصوص خدمات بینالمللی است — از پرداخت هزینه آزمونها گرفته تا افتتاح حساب بانکی خارجی یا ثبت شرکت در کشورهای معتبر.

اگر برای استفاده از خدمات ارزی نیاز به مشاوره دارید یا در هر مرحلهای با سوالی مواجه شدید، با خیال راحت از یکی از روشهای زیر با ما در ارتباط باشید:"
        buttons={[
          {
            text: "شروع",
            href: "/",
            variant: "secondary",
            icon: <FaExplosion />,
          },
        ]}
        media={{
          type: "image",
          src: "https://arziplus.storage.c2.liara.space/images/pages/53-min.png",
          alt: "ارتباط با ارزی پلاس",
          width: 1200,
          height: 800,
        }}
        layout="default"
        theme={{
          headingColor: "text-gray-50",
          subheadingColor: "text-gray-700",
          descriptionColor: "text-gray-200",
          backgroundColor: "#0A1D37",
          bgSubHeadingColor: "#FF7A00",
        }}
      />

      <WhyUsSection
        heading="💬 چرا کاربران ارزی پلاس ما را انتخاب میکنند؟"
        description="مزایای منحصربهفرد پشتیبانی ارزی پلاس که ما را از سایرین متمایز میکند."
        buttonText="درخواست مشاوره"
        buttonLink="/"
        items={whyChooseUs}
        buttonColor="#0A1D37 hover:bg-indigo-800 text-white"
        theme={themesWhyus.default}
      />

      <div className="grid md:grid-cols-3 gap-8 p-8">
        <div className="text-center">
          <FaPhone className="mx-auto mb-4 text-4xl text-[#FF7A00]" />
          <h3 className="text-lg font-semibold">تماس تلفنی</h3>
          <p className="text-[#A0A0A0]">021-12345678</p>
        </div>
        <div className="text-center">
          <FaEnvelope className="mx-auto mb-4 text-4xl text-[#FF7A00]" />
          <h3 className="text-lg font-semibold">ایمیل</h3>
          <p className="text-[#A0A0A0]">support@arzplus.com</p>
        </div>
        <div className="text-center">
          <FaMapMarkerAlt className="mx-auto mb-4 text-4xl text-[#FF7A00]" />
          <h3 className="text-lg font-semibold">آدرس</h3>
          <p className="text-[#A0A0A0]">تهران، خیابان ولیعصر، پلاک 123</p>
        </div>
      </div>

      <TextBox
        heading="💚 پیام اطمینان"
        content="ارزی پلاس همیشه کنار شماست تا مسیر پرداختهای بینالمللی، آسان، شفاف و مطمئن باشد.
ما فقط یک وبسایت نیستیم — بلکه همراه مطمئن شما در مسیر جهانی شدن هستیم 🌍"
        height={200}
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

      <FAQSection
        heading="سوالات متداول تماس با ارزی پلاس"
        description="پاسخ به سوالات رایج درباره نحوه ارتباط و دریافت خدمات."
        faqItems={contactFaq}
        buttons={[
          {
            text: "سوالات بیشتر",
            href: "/",
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
        heading="آماده همکاری با ارزی پلاس هستید؟"
        description="با ما تماس بگیرید و خدمات سفارشی را دریافت کنید.     ."
        button={{
          text: "تماس بگیرید",
          href: "/contact",
          variant: "ghost",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.primary}
        height={50}
      />
    </div>
  );
};

export default ContactPage;
