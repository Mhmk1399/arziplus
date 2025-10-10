import HeroSection from "../global/heroSection";
import { FaExplosion } from "react-icons/fa6";
import { ctaThemes, faqThemes } from "@/lib/theme";
import { FaEnvelope, FaRocket, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import FAQSection from "../global/faqSection";
import CTABanner from "../global/ctaBanner";

const ContactPage = () => {
  const contactFaq = [
    {
      id: "1",
      question: "چگونه با ارزی پلاس تماس بگیرم؟",
      answer:
        "از طریق چت آنلاین، ایمیل support@arzplus.com یا تلفن 021-12345678 در ساعات اداری تماس بگیرید.",
      category: "روش‌های تماس",
    },
    {
      id: "2",
      question: "آدرس ارزی پلاس کجاست؟",
      answer:
        "دفتر مرکزی: تهران، خیابان ولیعصر، پلاک 123. برای خدمات آنلاین، سایت ما در دسترس است.",
      category: "آدرس",
    },
    {
      id: "3",
      question: "ساعات کاری پشتیبانی؟",
      answer:
        "پشتیبانی 24/7 از طریق چت، و تلفنی از 9 صبح تا 6 عصر به وقت تهران.",
      category: "ساعات کاری",
    },
  ];

  return (
    <div>
      <HeroSection
        heading="ارتباط با ارزی پلاس"
        subheading="سوالی دارید؟ با ما در ارتباط باشید"
        description="ارزی پلاس همیشه آماده کمک به شماست. از چت آنلاین تا تماس تلفنی، تیم ما برای حل مشکلات پرداخت ارزی و خدمات بین‌المللی در کنار شماست."
        buttons={[
          {
            text: "شروع چت",
            href: "/chat",
            variant: "primary",
            icon: <FaExplosion />,
          },
        ]}
        media={{
          type: "image",
          src: "/assets/images/contact-us.webp",
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

      <FAQSection
        heading="سوالات رایج تماس"
        description="پاسخ به سوالات متداول قبل از تماس."
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

      <div className="grid md:grid-cols-3 gap-8 p-8 bg-gray-50">
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

      <CTABanner
        heading="آماده همکاری هستید؟"
        description="با ارزی پلاس تماس بگیرید و خدمات سفارشی را دریافت کنید."
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
