// React Icons imports
import React from "react";
import {
  FaPaypal,
  FaUniversity,
  FaGlobe,
  FaRobot,
  FaGraduationCap,
  FaServer,
  FaSchool,
  FaPassport,
  FaUserCheck,
  FaSimCard,
  FaIdCard,
  FaUserPlus,
  FaMoneyBillWave,
  FaCashRegister,
  FaBrain,
  FaStar,
  FaImage,
  FaBook,
  FaClipboardList,
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
              href: "/Opening-a-PayPal-account",
              icon: FaUserPlus,
            },
            {
              name: "شارژ حساب پی پال",
              href: "/charge-paypal-account",
              icon: FaMoneyBillWave,
            },
            {
              name: "نقد حساب پی پال",
              href: "/cashing-out-PayPal-balance",
              icon: FaCashRegister,
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
              href: "/charge-wise-account",
              icon: FaMoneyBillWave,
            },
            {
              name: "نقد حساب وایز",
              href: "/cashing-out-wise-account",
              icon: FaCashRegister,
            },
          ],
        },
        // {
        //   name: "خدمات حساب پایر",
        //   icon: FaCreditCard,
        //   childrens: [
        //     {
        //       name: "افتتاح حساب پایر",
        //       href: "/opening-a-payeer-account",
        //       icon: FaUserPlus,
        //     },
        //     {
        //       name: "شارژ حساب پایر",
        //       href: "/charge-payeer-account",
        //       icon: FaMoneyBillWave,
        //     },
        //     {
        //       name: "نقد حساب پایر",
        //       href: "/cashing-out-Payer-balance",
        //       icon: FaCashRegister,
        //     },
        //   ],
        // },
        // {
        //   name: "خدمات حساب پرفکت مانی",
        //   icon: FaDollarSign,
        //   childrens: [
        //     {
        //       name: "افتتاح حساب پرفکت مانی",
        //       href: "/opening-a-perfect-money-account",
        //       icon: FaUserPlus,
        //     },
        //     {
        //       name: "شارژ حساب پرفکت مانی",
        //       href: "/charge-perfect-Money-account",
        //       icon: FaMoneyBillWave,
        //     },
        //     {
        //       name: "نقد حساب پرفکت مانی",
        //       href: "/cashing-out-PerfectMoney-balance",
        //       icon: FaCashRegister,
        //     },
        //   ],
        // },
        // {
        //   name: "خدمات حساب وب مانی",
        //   icon: FaGlobe,
        //   childrens: [
        //     {
        //       name: "افتتاح حساب وب مانی",
        //       href: "/opening-a-weMoney-account",
        //       icon: FaUserPlus,
        //     },
        //     {
        //       name: "شارژ حساب وب مانی",
        //       href: "/charge-a-weMoney-account",
        //       icon: FaMoneyBillWave,
        //     },
        //     {
        //       name: "نقد حساب وب مانی",
        //       href: "/weMoney-cash-out",
        //       icon: FaCashRegister,
        //     },
        //   ],
        // },
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
              name: "اکانت chatgpt plus",
              href: "/buy-chatgpt-plus",
              icon: MdChatBubble,
            },
            {
              name: "خرید اکانت Claude AI",
              href: "/buy-Claude",
              icon: FaBrain,
            },
            {
              name: "خرید اکانت Midjourney",
              href: "/buy-Midjourney",
              icon: FaStar,
            },
            {
              name: "خرید اکانت D-ID",
              href: "/buy-D-ID",
              icon: FaIdCard,
            },
            {
              name: "خرید اکانت DALL-E",
              href: "/buy-DALL-E",
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
              href: "/toeflPayment",
              icon: FaBook,
            },
            {
              name: "آزمون زبان آیلتس",
              href: "/IeltsPayment",
              icon: FaBook,
            },
            {
              name: "آزمون زبان دولینگو",
              href: "/duolingoPayment",
              icon: FaBook,
            },
            {
              name: "آزمون دانشجویی GRE",
              href: "/grePayment",
              icon: FaBook,
            },
            {
              name: "آزمون پرومتریک",
              href: "/prometricPayment",
              icon: FaClipboardList,
            },
          ],
        },
        // {
        //   name: "خرید از سایت‌ها و سایر",
        //   icon: FaShoppingCart,
        //   childrens: [
        //     {
        //       name: "خرید از ای‌بی (ebay)",
        //       href: "/buy-from-ebay",
        //       icon: FaCartArrowDown,
        //     },
        //     {
        //       name: "خرید از علی‌بابا",
        //       href: "/buy-from-alibaba",
        //       icon: FaStore,
        //     },
        //     {
        //       name: "خرید از شِاین (shein)",
        //       href: "/buy-from-shein",
        //       icon: FaShoppingBag,
        //     },
        //   ],
        // },
        {
          name: "هاستینگ و دامنه",
          icon: FaServer,
          childrens: [
            {
              name: "هاستینگر (Hostinger)",
              href: "/HostingerHostingPayment",
              icon: FaDatabase,
            },
            {
              name: "هتزنر (hetzner)",
              href: "/HetznerInvoicePayment",
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
              href: "/Paying-tuition-fees-at-a-foreign-university",
              icon: FaFileInvoice,
            },
            {
              name: "دیپازیت فی",
              href: "/depositFeePayment",
              icon: FaCoins,
            },
            {
              name: "اپلیکیشن فی",
              href: "/ApplicationFeePayment",
              icon: FaFileContract,
            },
            {
              name: "پرداخت هزینه uni-assist",
              href: "/UniAssistPayment",
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
              href: "/Paying-for-the-American-Embassy",
              icon: FaFlag,
            },
            {
              name: "سفارت انگلیس",
              href: "/Paying-for-the-england-Embassy",
              icon: FaFlag,
            },
            {
              name: "سفارت استرالیا",
              href: "/Paying-for-the-Australia-Embassy",
              icon: FaFlag,
            },
            {
              name: "پرداخت booking.com",
              href: "/buy-booking",
              icon: FaCalendarAlt,
            },
            {
              name: "پرداخت airbnb",
              href: "/buy-Airbnb",
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
