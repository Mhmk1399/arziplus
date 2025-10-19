import HeroSection from "../global/heroSection";
import { FaExplosion } from "react-icons/fa6";
import StepsSection from "../global/stepsSection";
import {
  ctaThemes,
  faqThemes,
  stepThemes,
  textBoxThemes,
  textBoxTypography,
  themesWhyus,
} from "@/lib/theme";
import {
  FaHeadset,
  FaDollarSign,
  FaMoneyBillWave,
  FaRegClipboard,
  FaEnvelope,
  FaRocket,
  FaShieldAlt,
  FaGlobe,
} from "react-icons/fa";
import WhyUsSection from "../global/whyUs";
import FAQSection from "../global/faqSection";
import CTABanner from "../global/ctaBanner";
import TextBox from "../global/textBox";

const UpworkAccountCreation = () => {
  const longText = `با گسترش دورکاری و جذابیت درآمد دلاری، فعالیت در سایت‌هایی مانند Upwork برای فریلنسرهای ایرانی بسیار پرطرفدار شده است. اما به دلیل محدودیت‌های موجود، افتتاح حساب آپورک برای ساکنین ایران ساده نیست. ارزی پلاس با ارائه خدمات حرفه‌ای و مشاوره تخصصی، فرآیند ساخت اکانت آپورک را برای شما تسهیل کرده و شرایطی مطمئن برای فعالیت ارزی فراهم می‌کند. در سال 2025، با تغییرات جدید Terms of Service Upwork از سپتامبر، تمرکز بر احراز هویت دقیق‌تر و جلوگیری از circumvention افزایش یافته است ، که ارزی پلاس با وریفای از انگلیس، ریسک بستن حساب را به حداقل می‌رساند. این خدمات شامل ایجاد حساب با IP ثابت VPS انگلیس، ادغام با PayPal UK و مشاوره برای رعایت قوانین Upwork است، تا فریلنسرهای ایرانی بتوانند بدون نگرانی از تحریم‌ها، پروژه‌های دلاری را مدیریت کنند.`;

  const upworkSteps = [
    {
      id: "complete",
      title: "دریافت حساب و پشتیبانی",
      description:
        "حساب وریفای‌شده در 1-2 هفته تحویل می‌شود، همراه با مشاوره امنیتی و پشتیبانی مداوم.",
      icon: <FaRocket />,
    },
    {
      id: "paypal",
      title: "اتصال حساب PayPal UK",
      description:
        "حساب PayPal بیزینس انگلیس برای دریافت درآمد ایجاد و متصل می‌شود، با سیم‌کارت فیزیکی فعال.",
      icon: <FaMoneyBillWave />,
      isActive: true,
    },
    {
      id: "verify",
      title: "احراز هویت با اطلاعات انگلیس",
      description:
        "حساب با هویت واقعی، شماره انگلیس و آدرس پستی معتبر وریفای می‌شود، مطابق با الزامات Upwork برای ID دولتی و proof of address.",
      icon: <FaDollarSign />,
    },
    {
      id: "register",
      title: "ثبت نام و ارائه مدارک",
      description:
        "با ارزی پلاس ثبت نام کنید و مدارک پاسپورت معتبر، شماره تماس و آدرس پستی را ارائه دهید تا فرآیند شروع شود.",
      icon: <FaRegClipboard />,
      isActive: true,
    },
  ];

  const upworkWhyUs = [
    {
      id: 1,
      icon: <FaShieldAlt size={32} />,
      title: "هویت واقعی",
      description:
        "حساب شما در سایت آپورک با نام و مشخصات واقعی متقاضی ساخته می‌شود، که نه‌تنها امکان فعالیت در پروژه‌ها را برای شما فراهم می‌کند، بلکه می‌توانید از آن به‌عنوان رزومه حرفه‌ای در سایر پلتفرم‌ها نیز بهره ببرید. همچنین در صورت نیاز به احراز هویت مجدد این کار را بدون مشکل انجام خواهید داد.",
    },
    {
      id: 2,
      icon: <FaGlobe size={32} />,
      title: "شماره واقعی انگلیس",
      description:
        "حساب شما با شماره تماس واقعی از انگلیس تأیید می‌شود. این شماره علاوه بر تکمیل فرآیند احراز هویت، برای دریافت درآمدهای شما نیز قابل استفاده خواهد بود.",
    },
    {
      id: 3,
      icon: <FaEnvelope size={32} />,
      title: "مدرک تایید آدرس",
      description:
        "به دلیل قوانین سخت‌گیرانه برخی پلتفرم‌ها از جمله آپورک، محل سکونت شما به عنوان کشور انگلیس ثبت خواهد شد تا در صورت نیاز به احراز هویت مجدد، مشکلی نداشته باشید.",
    },
    {
      id: 4,
      icon: <FaMoneyBillWave size={32} />,
      title: "دریافت درآمد",
      description:
        "جهت دریافت درآمدهای خود از سایت فریلنسر، به یک حساب PayPal معتبر نیاز دارید. ارزی پلاس این سرویس را به همراه حساب فریلنسری نیز ارائه می‌دهد تا بتوانید بدون دغدغه، درآمد خود را نقد کنید.",
    },
    {
      id: 5,
      icon: <FaHeadset size={32} />,
      title: "پشتیبانی کامل",
      description:
        "پشتیبانی مداوم ارزی پلاس برای رعایت نکات امنیتی، جلوگیری از محدود شدن حساب و حل مشکلات، حتی پس از تحویل.",
    },
  ];

  const upworkFaq = [
    {
      id: "1",
      question: "حساب آپورک ما از کدام کشور وریفای میشود؟",
      answer:
        "در حال حاضر حساب فریلنسری آپورک ایجاد شده توسط ارزی پلاس تنها از کشور انگلیس وریفای می شوند. این روش با تغییرات 2025 Upwork برای verification با proof of address همخوانی دارد.",
      category: "کشور وریفای",
    },
    {
      id: "2",
      question: "آیا فرد ایرانی میتواند در سایت آپورک حساب داشته باشد؟",
      answer:
        "بله، کلیه حساب های ایجاد شده توسط ارزی پلاس به نام خود فرد و با مشخصات واقعی می باشد، و فقط آدرس محل سکونت فرد متقاضی انگلیس اعلام میشود. Upwork برای ایرانیان ممنوع است، اما با وریفای خارجی، فعالیت ممکن می‌شود.",
      category: "امکان حساب برای ایرانیان",
    },
    {
      id: "3",
      question: "شرای عضویت در سایت آپورک برای افراد ایرانی چیست؟",
      answer:
        "هموظنان ایرانی برای عضویت در سایت فریلنسر هیچ محدودیتی ندارند. فقط افراد ساکن ایران باید محل سکونت خود را کشوری غیر از ایران معرفی کنند، و از IP ثابت VPS انگلیس برای ورود استفاده نمایند.",
      category: "شرایط عضویت",
    },
    {
      id: "4",
      question: "برای ورود به حساب آپورک چه محدودیت هایی وجود دارد؟",
      answer:
        "شما برای ورود به حساب و جلوگیری از محدود شدن حساب کاربری حتما باید از آی پی ثابت(VPS) متعلق به کشور انگلیس استفاده کنید. Upwork IP را چک می‌کند و تغییرات جغرافیایی می‌تواند منجر به suspension شود.",
      category: "محدودیت‌های ورود",
    },
    {
      id: "5",
      question: "من پاسپورت ندارم، آیا میتوانم در سایت آپورک حساب داشته باشم؟",
      answer:
        "پاسخ ارزی پلاس به این سوال خیر میباشد. با توجه به قوانین سخت و اهراز هویت های چند مرحله ای سایت های فریلنسری ایجاد حساب با مدارک غیرواقعی امکان پذیر نمی باشد. Upwork government ID معتبر الزامی است.",
      category: "بدون پاسپورت",
    },
    {
      id: "6",
      question: "وریفای اکانت آپورک توسط ارزی پلاس چه مدت طول میکشد؟",
      answer:
        "اکانت آپورک ظرف 1 الی 2 هفته کاری توسط ارزی پلاس وریفای می شود و در اختیار کاربر قرار می گیرد. فرآیند شامل visual matching و phone confirmation است.",
      category: "زمان وریفای",
    },
    {
      id: "7",
      question: "پس از ایجاد حساب در سایت فریلنسر ما چه چیزی دریافت می کنیم؟",
      answer:
        "پس از ایجاد حساب شما در سایت فریلنسر توسط ارزی پلاس شما موارد زیر را از ما دریافت می کنید: اطلاعات ورود به حساب فریلنسر حساب پی‌پال بیزینسی انگلیس سیمکارت انگلیس که حساب فریلنسر و پی‌پل شما با آن ایجاد شده است مدارک تایید آدرس حساب شما که برای استفاده های بعدی نزد ارزی پلاس محفوظ می ماند پشتیبانی ارزی پلاس",
      category: "دریافتی‌ها",
    },
    {
      id: "8",
      question: "آیا امکان خرید اکانت وریفای شده آپورک وجود دارد؟",
      answer:
        "اگر منظور شما از خرید اکانت آپورک خرید حساب با هویت فرد دیگری است، پاسخ ارزی پلاس به شما خیر است. ارزی پلاس تنها با اطلاعات واقعی فرد متقاضی اقدام به ایجاد این حساب می نماید. Upwork حساب‌های shared یا fake را ban می‌کند.",
      category: "خرید اکانت آماده",
    },
  ];

  return (
    <div>
      <HeroSection
        heading="افتتاح حساب آپورک  ساخت حساب آپورک انگلیس از ایران"
        subheading="افتتاح حساب آپورک"
        description="ارزی پلاس با ارائه خدمات حرفه‌ای و مشاوره تخصصی، فرآیند ساخت اکانت آپورک را برای شما تسهیل کرده و شرایطی مطمئن برای فعالیت ارزی فراهم می‌کند. خدمات شامل حساب وریفای‌شده با PayPal UK و VPS انگلیس.با گسترش دورکاری و جذابیت درآمد دلاری، فعالیت در سایت‌هایی مانند Upwork برای فریلنسرهای ایرانی بسیار پرطرفدار شده است. اما به دلیل محدودیت‌های موجود، افتتاح حساب آپورک برای ساکنین ایران ساده نیست."
        buttons={[
          {
            text: "افتتاح حساب آپورک",
            href: "/services/opening-a-Upwork-account",
            variant: "secondary",
            icon: <FaExplosion />,
          },
        ]}
        media={{
          type: "image",
          src: "https://arziplus.storage.c2.liara.space/images/pages/48-min.png",
          alt: "افتتاح حساب آپورک با ارزی پلاس",
          width: 1200,
          height: 800,
        }}
        layout="default"
        theme={{
          headingColor: "text-gray-50",
          subheadingColor: "text-gray-500",
          descriptionColor: "text-gray-200",
          backgroundColor: "bg-indigo-700",
          bgSubHeadingColor: "bg-fuchsia-50",
        }}
      />

      <StepsSection
        heading="افتتاح حساب فریلنسر"
        description="ایجاد حساب در سایت فریلنسر افتتاح حساب آپورک در ایران ساخت حساب در Upwork فرآیند پیچیده‌ای ندارد، اما همان‌طور که می‌دانید، احراز هویت آپورک برای کاربران مقیم ایران به دلیل تحریم‌ها امکان‌پذیر نیست. و استفاده از آی‌پی ایران می‌تواند باعث بسته شدن حساب شود. در همین راستا، ارزی پلاس با فراهم‌سازی شرایط لازم، ایجاد حساب آپورک از کشور انگلستان را با اطلاعات واقعی و اختصاصی شما انجام می‌دهد تا بتوانید با اطمینان در این پلتفرم فعالیت کنید."
        steps={upworkSteps}
        theme={stepThemes.default}
        layout="vertical"
        boxShape="rounded"
        boxSize="sm"
        showNumbers={true}
        animated={true}
        interactive={false}
        showIcons={true}
      />

      <WhyUsSection
        heading="اکانت وریفای شده آپورک توسط ارزی پلاس چه ویژگی هایی دارند ؟"
        description="ساخت حساب وریفای‌شده Upwork با اطلاعات واقعی انگلستان، شامل سیم‌کارت فیزیکی، آدرس پستی معتبر، حساب پی‌پل و کد مالیاتی. تحویل سریع، امنیت بالا، پشتیبانی کامل و مشاوره تخصصی برای جلوگیری از محدود شدن حساب."
        buttonText="افتتاح حساب"
        buttonLink="/services/opening-a-Upwork-account"
        items={upworkWhyUs}
        theme={themesWhyus.default}
      />

      <TextBox
        heading="مدارک لازم جهت وریفای اکانت فریلنسری آپورک"
        content={longText}
        height={300}
        animate={false}
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
        heading="سوال پر تکرار"
        description="پاسخ به متداول‌ترین سوالاتی که در ذهن دارید درباره افتتاح حساب آپورک"
        faqItems={upworkFaq}
        buttons={[
          {
            text: "تماس با پشتیبانی",
            href: "/contact",
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
        heading="افتتاح حساب آپورک در ایران"
        description="ساخت حساب   Upwork ا ارزی پلاس امکان پذیر است.     ."
        button={{
          text: "افتتاح حساب آپورک",
          href: "/dashboard#services",
          variant: "ghost",
          icon: <FaRocket />,
        }}
        theme={ctaThemes.primary}
        height={50}
      />
    </div>
  );
};

export default UpworkAccountCreation;
