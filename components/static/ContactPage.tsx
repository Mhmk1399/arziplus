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
  FaTelegram,
  FaWhatsapp,
  FaClock,
  FaHeadset,
  FaUserTie,
  FaGlobe,
  FaShieldAlt,
} from "react-icons/fa";
import FAQSection from "../global/faqSection";
import CTABanner from "../global/ctaBanner";
import TextBox from "../global/textBox";
import WhyUsSection from "../global/whyUs";

const ContactPage = () => {
  const contactMethods = [
    {
      id: 1,
      icon: <FaPhone size={32} />,
      iconColor: "bg-emerald-700",
      title: "پشتیبانی تلفنی",
      description: "۰۲۱ – ۹۱۰۰ XXX (شنبه تا پنجشنبه، ۹ صبح تا ۶ عصر)",
    },
    {
      id: 2,
      icon: <FaTelegram size={32} />,
      iconColor: "bg-blue-700",
      title: "پشتیبانی تلگرام و واتساپ",
      description: "لینک تماس مستقیم پشتیبانی آنلاین",
    },
    {
      id: 3,
      icon: <FaEnvelope size={32} />,
      iconColor: "bg-purple-700",
      title: "پست الکترونیکی",
      description: "support@arziplus.com",
    },
    {
      id: 4,
      icon: <FaMapMarkerAlt size={32} />,
      iconColor: "bg-orange-700",
      title: "آدرس دفتر مرکزی",
      description:
        "تهران، خیابان ولیعصر، بالاتر از پارک ملت، ساختمان تجارت بینالملل، طبقه سوم",
    },
  ];

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

  const workingHours = [
    {
      id: 1,
      icon: <FaClock size={32} />,
      iconColor: "bg-emerald-700",
      title: "شنبه تا پنجشنبه",
      description: "۹ صبح تا ۶ عصر",
    },
    {
      id: 2,
      icon: <FaGlobe size={32} />,
      iconColor: "bg-blue-700",
      title: "جمعه و تعطیلات رسمی",
      description: "پشتیبانی فقط آنلاین",
    },
  ];

  const contactFaq = [
    {
      id: "1",
      question: "چگونه با ارزی پلاس تماس بگیرم؟",
      answer:
        "از طریق تلفن ۰۲۱ – ۹۱۰۰ XXX، تلگرام، واتساپ یا ایمیل support@arziplus.com در ساعات اداری تماس بگیرید.",
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
        subheading="همیشه در دسترس شما هستیم 🌍"
        description="در ارزی پلاس، ارتباط با شما فقط یک گزینه نیست، بلکه بخشی از تعهد ماست.
تیم پشتیبانی ما همیشه آماده پاسخگویی به پرسشها، درخواستها و راهنمایی در خصوص خدمات بینالمللی است — از پرداخت هزینه آزمونها گرفته تا افتتاح حساب بانکی خارجی یا ثبت شرکت در کشورهای معتبر.

اگر برای استفاده از خدمات ارزی نیاز به مشاوره دارید یا در هر مرحلهای با سوالی مواجه شدید، با خیال راحت از یکی از روشهای زیر با ما در ارتباط باشید:"
        buttons={[
          {
            text: "شروع",
            href: "/chat",
            variant: "primary",
            icon: <FaExplosion />,
          },
        ]}
        media={{
          type: "image",
          src: "https://arziplus.s3.eu-north-1.amazonaws.com/Desktop/53-min.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUQ73WRGQ4T67A6JS%2F20251012%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20251012T110613Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCmV1LW5vcnRoLTEiRzBFAiEAkvYH%2BmhAwfPH1TelSJueYbwHgp2aquFhruhP%2Bqmu7zkCIGt1Jhm1R1Zm%2FDqhZs8KbOLRTzAQE4J8uNuyHPyI7FsKKtYCCCwQABoMMzExMzc2MTIwMjI1Igwg%2Fu3e6zq2qeFFmF4qswIYuQuEXhoBRN%2FOgvmZCGczqnjNiClyns9RuhaLhQXn7oaA7%2F3k9DGl5NgQl90Ee3F7I0ho3372RGLAOxcYO6JA0hC76J8DuCr%2F3S343rm%2Fh03MFY8T6L6yh%2F6BhXAAD4x5ENiC4uPXJPNWVoB8lGbvnAyTB1oTh%2Bt47f0w%2Ba3C0E4wFsflJj2VzIeUsYDEu%2Bf6Jgc8I8252lN3cKpiX5cXqqbfKz06Ga%2FDCzmYHjuxesqC%2BLJxgUj9%2BLUFgOPzAFNzLOF9%2F3XPH4sXqznW9v26koziAWAIjgYK8Qyk%2F3J3WcsMjCfM6ezXPJzG6lbzoTjK0MWSeJg1EpneoOwkEZ7AOVIKK9gcIiwfX2NLrDvTCjtLB3g00eP%2B3qbR3EH61Wnq%2F43PzuBeJBe11QU1YBUcoVRlMJLyrccGOq0CyNWPUNsn88dxEonjuYdU8%2BcP8CLd2o%2BizdtVyWQZWnrspMEV%2FyhXriTKtMYHofxlCAEzpS2q55WV5sGWlLrZx9Ob8PRBvzzLX64Jak3jVXkt%2FzAxC3FVtI5rGSXPHJVk1IAnD9o3vfrsG0zGbPS3eGEAnXGofXECWNVMOuTZEPk1DAKSLyPKzpYoGyN8wBfH94Py5lS4%2FfSlVaRxT6p1ywoZFSvUaAyWULg6FWb7B5bPE6ma7h3nq31pAb%2B7ztCPnezmKNVjx0rebxqjlxFdQxIWQMfu3SDyRq%2FyUuOrbLLgqFydIiyNCkWp7vwaLBWHPOtqFTsGZ6El1dTv628bMBfbN9n8joW08RX2aSnT4VlsRjhACITEx%2FKbD5dvDWwGgExUN3aUVtAU4LnpWA%3D%3D&X-Amz-Signature=298995cbee57fe814f28fa799fe1fb9964e84a8d8e6b7142ed234572fcc64fc0&X-Amz-SignedHeaders=host&response-content-disposition=inline",
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
        buttonLink="/consultation"
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
            href: "/faq",
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
        description="با ما تماس بگیرید و خدمات سفارشی را دریافت کنید. ارزی پلاس، شریک قابل اعتماد شما در پرداختهای جهانی."
        button={{
          text: "تماس بگیرید",
          href: "/chat",
          variant: "primary",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.primary}
        height={50}
      />
    </div>
  );
};

export default ContactPage;
