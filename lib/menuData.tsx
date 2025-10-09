// React Icons imports
import React from "react";
import {
  FaPaypal,
  FaCreditCard,
  FaUniversity,
  FaDollarSign,
  FaGlobe,
  FaRobot,
  FaGraduationCap,
  FaShoppingCart,
  FaServer,
  FaSchool,
  FaPassport,
  FaUserCheck,
  FaSimCard,
  FaIdCard,
  FaUserPlus,
  FaMoneyBillWave,
  FaCashRegister,
  FaShoppingBag,
  FaBrain,
  FaStar,
  FaImage,
  FaBook,
  FaClipboardList,
  FaCartArrowDown,
  FaStore,
  FaDatabase,
  FaFileInvoice,
  FaCoins,
  FaFileContract,
  FaFlag,
  FaCalendarAlt,
  FaHome,
  FaBriefcase,
  FaBolt,
  FaMapMarkerAlt,
  FaMobileAlt,
  FaCloud,
  FaInfoCircle,
  FaPhoneAlt,
  FaQuestionCircle,
  FaGavel,
} from "react-icons/fa";
import { MdVerifiedUser, MdChatBubble } from "react-icons/md";
import { MenuItems } from "@/types/menu";
import { IconType } from "react-icons/lib";

// Icon component helper
export const IconComponent = ({
  icon: Icon,
  className = "",
}: {
  icon: IconType;
  className?: string;
}) => <Icon className={className} />;

// Menu with React Icons
export const menuItems: MenuItems = [
  {
    title: "خدمات بانکی بین المللی",
    childrens: {
      dropdowns: [
        {
          name: "خدمات پی پال",
          icon: FaPaypal,
          childrens: [
            {
              name: "افتتاح حساب پی پال",
              href: "/opening-a-payPal-account",
              icon: FaUserPlus,
            },
            {
              name: "شارژ حساب پی پال",
              href: "/charge-a-payPal-account",
              icon: FaMoneyBillWave,
            },
            {
              name: "نقد حساب پی پال",
              href: "/paypal-cash-out",
              icon: FaCashRegister,
            },
            {
              name: "خرید با پی پال",
              href: "/paypal-buy",
              icon: FaShoppingBag,
            },
          ],
        },
        {
          name: "خدمات حساب وایز",
          icon: FaUniversity,
          childrens: [
            {
              name: "افتتاح حساب وایز",
              href: "/opening-a-wise-account",
              icon: FaUserPlus,
            },
            {
              name: "شارژ حساب وایز",
              href: "/charge-a-wise-account",
              icon: FaMoneyBillWave,
            },
            {
              name: "نقد حساب وایز",
              href: "/wise-cash-out",
              icon: FaCashRegister,
            },
          ],
        },
        {
          name: "خدمات حساب پایر",
          icon: FaCreditCard,
          childrens: [
            {
              name: "افتتاح حساب پایر",
              href: "/opening-a-payoneer-account",
              icon: FaUserPlus,
            },
            {
              name: "شارژ حساب پایر",
              href: "/charge-a-payoneer-account",
              icon: FaMoneyBillWave,
            },
            {
              name: "نقد حساب پایر",
              href: "/payoneer-cash-out",
              icon: FaCashRegister,
            },
          ],
        },
        {
          name: "خدمات حساب پرفکت مانی",
          icon: FaDollarSign,
          childrens: [
            {
              name: "افتتاح حساب پرفکت مانی",
              href: "/opening-a-perfectMoney-account",
              icon: FaUserPlus,
            },
            {
              name: "شارژ حساب پرفکت مانی",
              href: "/charge-a-perfectMoney-account",
              icon: FaMoneyBillWave,
            },
            {
              name: "نقد حساب پرفکت مانی",
              href: "/perfectMoney-cash-out",
              icon: FaCashRegister,
            },
          ],
        },
        {
          name: "خدمات حساب وب مانی",
          icon: FaGlobe,
          childrens: [
            {
              name: "افتتاح حساب وب مانی",
              href: "/opening-a-weMoney-account",
              icon: FaUserPlus,
            },
            {
              name: "شارژ حساب وب مانی",
              href: "/charge-a-weMoney-account",
              icon: FaMoneyBillWave,
            },
            {
              name: "نقد حساب وب مانی",
              href: "/weMoney-cash-out",
              icon: FaCashRegister,
            },
          ],
        },
      ],
    },
  },
  {
    title: "خدمات پرداخت بین المللی",
    childrens: {
      dropdowns: [
        {
          name: "اکانت هوش مصنوعی",
          icon: FaRobot,
          childrens: [
            {
              name: "خرید اکانت chatgpt",
              href: "/buy-chatgpt-account",
              icon: MdChatBubble,
            },
            {
              name: "خرید اکانت Claude AI",
              href: "/buy-claude-account",
              icon: FaBrain,
            },
            {
              name: "خرید اکانت Midjourney",
              href: "/buy-midjourney-account",
              icon: FaStar,
            },
            {
              name: "خرید اکانت D-ID",
              href: "/buy-d-id-account",
              icon: FaIdCard,
            },
            {
              name: "خرید اکانت dall-e",
              href: "/buy-dall-e-account",
              icon: FaImage,
            },
          ],
        },
        {
          name: "آزمون بین‌المللی",
          icon: FaGraduationCap,
          childrens: [
            {
              name: "آزمون زبان تافل",
              href: "/toefl-exam",
              icon: FaBook,
            },
            {
              name: "آزمون زبان آیلتس",
              href: "/ielts-exam",
              icon: FaBook,
            },
            {
              name: "آزمون زبان دولینگو",
              href: "/duolingo-exam",
              icon: FaBook,
            },
            {
              name: "آزمون دانشجویی GRE",
              href: "/gre-exam",
              icon: FaBook,
            },
            {
              name: "آزمون پرومتریک",
              href: "/prometric-exam",
              icon: FaClipboardList,
            },
          ],
        },
        {
          name: "خرید از سایت‌ها و سایر",
          icon: FaShoppingCart,
          childrens: [
            {
              name: "خرید از ای‌بی (ebay)",
              href: "/buy-from-ebay",
              icon: FaCartArrowDown,
            },
            {
              name: "خرید از علی‌بابا",
              href: "/buy-from-alibaba",
              icon: FaStore,
            },
            {
              name: "خرید از شِاین (shein)",
              href: "/buy-from-shein",
              icon: FaShoppingBag,
            },
          ],
        },
        {
          name: "هاستینگ و دامنه",
          icon: FaServer,
          childrens: [
            {
              name: "هاستینگر (Hostinger)",
              href: "/hostinger-payment",
              icon: FaDatabase,
            },
            {
              name: "هتزنر (hetzner)",
              href: "/hetzner-payment",
              icon: FaCloud,
            },
            {
              name: "خرید دامنه از جوکر",
              href: "/joker-domain-purchase",
              icon: FaGlobe,
            },
          ],
        },
        {
          name: "پرداخت‌های دانشجویی",
          icon: FaSchool,
          childrens: [
            {
              name: "شهریه دانشگاه خارجی",
              href: "/foreign-university-tuition",
              icon: FaFileInvoice,
            },
            {
              name: "دیپازیت فی",
              href: "/deposit-fee-payment",
              icon: FaCoins,
            },
            {
              name: "اپلیکیشن فی",
              href: "/application-fee-payment",
              icon: FaFileContract,
            },
            {
              name: "پرداخت هزینه uni-assist",
              href: "/uni-assist-payment",
              icon: FaGraduationCap,
            },
          ],
        },
        {
          name: "سفارت / ویزا / هتل",
          icon: FaPassport,
          childrens: [
            {
              name: "سفارت آمریکا",
              href: "/us-embassy-payment",
              icon: FaFlag,
            },
            {
              name: "سفارت انگلیس",
              href: "/uk-embassy-payment",
              icon: FaFlag,
            },
            {
              name: "سفارت استرالیا",
              href: "/australia-embassy-payment",
              icon: FaFlag,
            },
            {
              name: "پرداخت booking.com",
              href: "/booking-com-payment",
              icon: FaCalendarAlt,
            },
            {
              name: "پرداخت airbnb",
              href: "/airbnb-payment",
              icon: FaHome,
            },
          ],
        },
      ],
    },
  },
  {
    title: "خدمات احراز هویت بین المللی",
    childrens: {
      dropdowns: [
        {
          name: "وریفای و ثبت نام سایت های فریلنسری",
          icon: FaUserCheck,
          childrens: [
            {
              name: "افتتاح حساب آپورک",
              href: "/UpWork-account",
              icon: FaBriefcase,
            },
            {
              name: "افتتاح حساب فریلنسر",
              href: "/freeLancer-account",
              icon: FaBriefcase,
            },
            {
              name: "افتتاح حساب فایور",
              href: "/fiver-account",
              icon: FaBriefcase,
            },
          ],
        },
        {
          name: "سیم کارت های فیزیکی",
          icon: FaSimCard,
          childrens: [
            {
              name: "خرید سیم کارت مالزی",
              href: "/buy-malasian-sim",
              icon: FaMobileAlt,
            },
            {
              name: "خرید سیم کارت انگلیس",
              href: "/buy-english-sim",
              icon: FaMobileAlt,
            },
            {
              name: "خرید سیم کارت استونی",
              href: "/buy-stony-sim",
              icon: FaMobileAlt,
            },
            {
              name: "خرید سیم کارت آلمان",
              href: "/buy-german-sim",
              icon: FaMobileAlt,
            },
            {
              name: "شارژ سیم کارت بین الملل",
              href: "/charge-sim",
              icon: FaBolt,
            },
          ],
        },
        {
          name: "وریفای حساب های خارجی",
          icon: MdVerifiedUser,
          childrens: [
            {
              name: "مدارک تایید ادرس -قبض-پرینت حساب بانکی",
              href: "/adrees-bill",
              icon: FaMapMarkerAlt,
            },
            {
              name: "مدارک فیزیکی تایید هویت بین الملل",
              href: "/verfication-carts",
              icon: FaIdCard,
            },
          ],
        },
      ],
    },
  },
  {
    title: "درباره ما",
    childrens: {
      dropdowns: [
        {
          name: "درباره ما",
          icon: FaInfoCircle,
          childrens: [
            {
              name: "درباره ما",
              href: "/about-us",
              icon: FaInfoCircle,
            },
            {
              name: "تماس با ما",
              href: "/contact-us",
              icon: FaPhoneAlt,
            },
            {
              name: "سوالات متداول",
              href: "/faq",
              icon: FaQuestionCircle,
            },
            {
              name: "شرایط و قوانین",
              href: "/terms-and-conditions",
              icon: FaGavel,
            },
          ],
        },
      ],
    },
  },
] as const;
