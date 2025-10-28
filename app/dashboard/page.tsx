"use client";
import React, { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FaUsers,
  FaServicestack,
  FaClipboardList,
  FaIdCard,
  FaCog,
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaHome,
  FaSignOutAlt,
  FaWallet,
  FaMoneyBillWave,
  FaChevronRight,
  FaTicketAlt,
  FaHeadset,
  FaChevronDown,
  FaUniversity,
} from "react-icons/fa";
import { showToast } from "@/utilities/toast";

// Import wrappers
import UsersList from "@/components/admin/users/usersList";
import NationalCredentialAdmin from "@/components/admin/users/nationalCredintial";
import BankingInfoAdmin from "@/components/admin/users/bankingInfo";
import AdminServiceWrapper from "@/components/admin/services&orders/adminserviceWrapper";
import ServiceWrapper from "@/components/customerAdmins/ordersandservices/serviceWrapper";
import CredentialWrapper from "@/components/customerAdmins/credintials/credintialWrapper";
import WalletWrapper from "@/components/customerAdmins/wallet/walletWrapper";
import PaymentWrapper from "@/components/admin/payments/paymentWrapper";
import CustomerLotteryWrapper from "@/components/customerAdmins/lottery/lotteryWrapper";
import AdminTicketsWrapper from "@/components/admin/tickets/ticketsWrapper";
import TicketsWrapper from "@/components/customerAdmins/tickets/ticketsWrapper";
import Link from "next/link";
import Image from "next/image";
import { FaList } from "react-icons/fa";
import LotteryAdminList from "@/components/admin/lottery/lotteryList";
import { FaCalendarCheck } from "react-icons/fa";
import HozoriAdminList from "@/components/admin/hozori/hozoriList";
import WalletsList from "@/components/admin/payments/walletsList";
import WithdrawRequestsList from "@/components/admin/payments/outcomes";
import AdminRequestsTable from "@/components/admin/services&orders/AdminRequestsTable";
import ServiceManager from "@/components/admin/services&orders/serviceBuilder/ServiceManager";
import { FaChartBar } from "react-icons/fa";
import BankingInfo from "@/components/customerAdmins/credintials/banckinginfo";
import NationalCredentials from "@/components/customerAdmins/credintials/natinals";
import ContactInfo from "@/components/customerAdmins/credintials/phonrnumber";
import Security from "@/components/customerAdmins/credintials/security";
import { FaShieldAlt, FaPhone } from "react-icons/fa";
import CredentialsWithProgress from "@/components/customerAdmins/credintials/CredentialsWithProgress";
import CustomerHozoriList from "@/components/customerAdmins/hozori/hozoriList";
import CustomerLotteryList from "@/components/customerAdmins/lottery/lotteryList";
import CustomerRequestsTable from "@/components/customerAdmins/ordersandservices/orderHistory";
import TermsPage from "@/components/static/TermsPage";
import { FaShoppingCart, FaHistory, FaFileContract } from "react-icons/fa";
import ServicesPage from "../services/page";
import { FaArrowDown } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ComponentType;
  description: string;
  badge?: number;
  children?: MenuItem[];
}

 

interface BankingInfoData {
  _id?: string;
  bankName: string;
  cardNumber: string;
  shebaNumber: string;
  accountHolderName: string;
  status?: "accepted" | "rejected" | "pending_verification";
  rejectionNotes?: string;
}

interface NationalCredentialsData {
  firstName: string;
  lastName: string;
  nationalNumber: string;
  nationalCardImageUrl: string;
  verificationImageUrl: string;
  status?: "accepted" | "rejected" | "pending_verification";
  rejectionNotes?: string;
}

interface ContactInfoData {
  homePhone: string;
  mobilePhone: string;
  email: string;
  address: string;
  postalCode: string;
  status?: "accepted" | "rejected" | "pending_verification";
  rejectionNotes?: string;
}

interface SecurityData {
  username: string;
  status: "active" | "suspended" | "banned" | "pending_verification";
  roles: ("user" | "admin" | "super_admin" | "moderator" | "support")[];
}

interface VerificationStatus {
  email: {
    isVerified: boolean;
    verifiedAt?: Date;
  };
  phone: {
    isVerified: boolean;
    verifiedAt?: Date;
    verificationCode?: string;
    verificationCodeExpires?: Date;
  };
  identity: {
    status: "not_submitted" | "pending" | "approved" | "rejected";
    submittedAt?: Date;
    reviewedAt?: Date;
    reviewedBy?: string;
    rejectionReason?: string;
  };
}

interface UserData {
  security?: SecurityData;
  nationalCredentials?: NationalCredentialsData;
  contactInfo?: ContactInfoData;
  bankingInfo?: BankingInfoData[];
  verificationStatus?: VerificationStatus;
}

interface UserApiResponse {
  user: {
    username: string;
    status: "active" | "suspended" | "banned" | "pending_verification";
    roles: ("user" | "admin" | "super_admin" | "moderator" | "support")[];
    nationalCredentials?: NationalCredentialsData;
    contactInfo?: ContactInfoData;
    bankingInfo?: BankingInfoData[];
    verifications?: VerificationStatus;
  };
}

interface UserValidationWrapperProps {
  initialData?: UserData;
  onSave?: (
    section: string,
    data:
      | BankingInfoData
      | NationalCredentialsData
      | ContactInfoData
      | SecurityData
  ) => void;
}

const Dashboard: React.FC = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const {
    user: currentUser,
    isLoggedIn,
    loading: userLoading,
  } = useCurrentUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load user data from API
  const loadUserData = async (): Promise<void> => {
 
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      // Load current user data
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result: UserApiResponse = await response.json();
        setUserData({
          security: {
            username: result.user.username,
            status: result.user.status,
            roles: result.user.roles,
          },
          nationalCredentials: result.user.nationalCredentials || undefined,
          contactInfo: result.user.contactInfo || undefined,
          bankingInfo: result.user.bankingInfo || [], // Keep as array for proper checking
          verificationStatus: result.user.verifications || undefined,
        });
      }
    } catch (error) {
      console.log("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  // Get menu items based on user role
  const menuItems = React.useMemo(() => {
    if (!currentUser || !userData) return [];

    const isAdmin =
      currentUser.roles.includes("admin") ||
      currentUser.roles.includes("super_admin");

    if (isAdmin) {
      return [
        {
          id: "users",
          label: "مدیریت کاربران",
          icon: <FaUsers className="text-lg" />,
          component: UsersList,
          description: "مدیریت کاربران و احراز هویت",
          children: [
            {
              id: "users",
              label: "مدیریت کاربران",
              icon: <FaUsers className="text-lg" />,
              component: UsersList,
              description: "مشاهده و مدیریت کاربران",
            },
            {
              id: "credentials",
              label: "احراز هویت",
              icon: <FaIdCard className="text-lg" />,
              component: NationalCredentialAdmin,
              description: "بررسی مدارک هویتی",
            },
            {
              id: "banking",
              label: "اطلاعات بانکی",
              icon: <FaUniversity className="text-lg" />,
              component: BankingInfoAdmin,
              description: "بررسی اطلاعات بانکی",
            },
          ],
        },
        {
          id: "list",
          label: "مدیریت لاتاری",
          icon: <FaTicketAlt className="text-lg" />,
          component: LotteryAdminList,
          description: "مدیریت ثبت نام های قرعه کشی گرین کارت",
          children: [
            {
              id: "list",
              label: "لیست ثبت نام ها",
              icon: <FaList className="text-lg" />,
              component: LotteryAdminList,
              description: "مشاهده و مدیریت تمام ثبت نام های لاتاری",
            },
            {
              id: "hozori",
              label: "رزروهای حضوری",
              icon: <FaCalendarCheck className="text-lg" />,
              component: HozoriAdminList,
              description: "مشاهده و مدیریت تمام رزروهای حضوری",
            },
          ],
        },
        {
          id: "tickets",
          label: "مدیریت تیکت ها",
          icon: <FaHeadset className="text-lg" />,
          component: AdminTicketsWrapper,
          description: "مدیریت تیکت های پشتیبانی و پاسخ به کاربران",
        },
        {
          id: "wallets",
          label: "مدیریت پرداخت ها",
          icon: <FaMoneyBillWave className="text-lg" />,
          component: PaymentWrapper,
          description: "مدیریت کیف پول ها و درخواست های برداشت",
          children: [
            {
              id: "walletss" as const,
              label: "مدیریت کیف پول‌ها",
              icon: <FaWallet className="text-lg" />,
              component: WalletsList,
              description: "مدیریت تمام کیف پول ها",
            },
            {
              id: "withdraws" as const,
              label: "درخواست‌های برداشت",
              icon: <FaMoneyBillWave className="text-lg" />,
              component: WithdrawRequestsList,
              description: "مدیریت تمام درخواست های برداشت",
            },
          ],
        },
        {
          id: "requests",
          label: "مدیریت سرویس ها",
          icon: <FaServicestack className="text-lg" />,
          component: AdminServiceWrapper,
          description: "مدیریت سرویس ها و درخواست ها",
          children: [
            {
              id: "requests",
              label: "مدیریت درخواست ها",
              icon: <FaClipboardList className="text-lg" />,
              description: "مشاهده و مدیریت درخواست های سرویس",
              component: AdminRequestsTable,
            },
            {
              id: "services",
              label: "مدیریت سرویس ها",
              icon: <FaServicestack className="text-lg" />,
              description: "مدیریت و ویرایش سرویس ها",
              component: ServiceManager,
            },
            {
              id: "analytics",
              label: "آنالیز و گزارشات",
              icon: <FaChartBar className="text-lg" />,
              description: "آمار و گزارشات سرویس ها",
              component: () => (
                <div className="p-8 text-center">
                  <FaChartBar className="text-6xl text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    آنالیز و گزارشات
                  </h3>
                  <p className="text-gray-500">این بخش در حال توسعه است</p>
                </div>
              ),
            },
          ],
        },
      ];
    }

    return [
      {
        id: "security",
        label: "خدمات و سفارشات",
        icon: <FaClipboardList className="text-lg" />,
        component: ServiceWrapper,
        description: "مشاهده خدمات و سفارشات",
        children: [
          {
            id: "services",
            label: "خدمات",
            icon: <FaShoppingCart className="text-lg sm:text-xl" />,
            description: "مشاهده و سفارش خدمات",
            component: ServicesPage,
          },
          {
            id: "orders",
            label: "سفارشات من",
            icon: <FaHistory className="text-lg sm:text-xl" />,
            description: "تاریخچه و وضعیت سفارشات",
            component: CustomerRequestsTable,
          },
          {
            id: "terms",
            label: "قوانین و شرایط",
            icon: <FaFileContract className="text-lg sm:text-xl" />,
            description: "شرایط استفاده از خدمات",
            component: TermsPage,
          },
        ],
      },
      {
        id: "lottery",
        label: "ثبت نام های لاتاری",
        icon: <FaTicketAlt className="text-lg" />,
        component: CustomerLotteryWrapper,
        description: "مدیریت ثبت نام های قرعه کشی گرین کارت",
        children: [
          {
            id: "list",
            label: "ثبت نام های من",
            icon: <FaList className="text-lg" />,
            component: CustomerLotteryList,
            description: "مشاهده تمام ثبت نام های لاتاری  ",
          },
          {
            id: "hozori",
            label: "رزروهای حضوری",
            icon: <FaCalendarCheck className="text-lg" />,
            component: CustomerHozoriList,
            description: "مشاهده تمام رزروهای حضوری شما",
          },
        ],
      },
      {
        id: "tickets",
        label: "پشتیبانی",
        icon: <FaHeadset className="text-lg" />,
        component: TicketsWrapper,
        description: "ایجاد تیکت و دریافت پشتیبانی",
      },
      {
        id: "wallet",
        label: "کیف پول",
        icon: <FaWallet className="text-lg" />,
        component: WalletWrapper,
        description: "مدیریت موجودی و تراکنشها",
        children: [
          {
            id: "wallet-dashboard",
            label: "داشبورد کیف پول",
            icon: <FaWallet className="text-lg" />,
            component: () => <WalletWrapper initialTab="dashboard" />,
            description: "نمای کلی و موجودی",
          },
          {
            id: "wallet-incomes",
            label: "تاریخچه واریزیها",
            icon: <FaArrowUp className="text-lg" />,
            component: () => <WalletWrapper initialTab="incomes" />,
            description: "تاریخچه پرداخت ها",
          },
          {
            id: "wallet-withdraws",
            label: "درخواست برداشت",
            icon: <FaArrowDown className="text-lg" />,
            component: () => <WalletWrapper initialTab="withdraws" />,
            description: "تاریخچه برداشتها",
          },
        ],
      },
      {
        id: "credentials",
        label: "احراز هویت",
        icon: <FaIdCard className="text-lg" />,
        component: CredentialWrapper,
        description: "مدارک و احراز هویت",
        children: [
          {
            id: "securities",
            label: "امنیت و دسترسی",
            icon: <FaShieldAlt className="text-lg sm:text-xl" />,
            component: () => (
              <CredentialsWithProgress currentStep="security">
                <Security initialData={userData?.security} />
              </CredentialsWithProgress>
            ),
            description: "نام کاربری، رمز عبور و تنظیمات امنیتی",
          },
          {
            id: "nationalCredentials",
            label: "مدارک هویتی",
            icon: <FaIdCard className="text-lg sm:text-xl" />,
            component: () => (
              <CredentialsWithProgress currentStep="national">
                <NationalCredentials
                  initialData={userData?.nationalCredentials}
                />
              </CredentialsWithProgress>
            ),
            description: "کارت ملی، احراز هویت و مدارک شخصی",
          },
          {
            id: "contactInfo",
            label: "اطلاعات تماس",
            icon: <FaPhone className="text-lg sm:text-xl" />,
            component: () => (
              <CredentialsWithProgress currentStep="contact">
                <ContactInfo initialData={userData?.contactInfo} />
              </CredentialsWithProgress>
            ),
            description: "شماره تماس، ایمیل و آدرس",
          },
          {
            id: "bankingInfo",
            label: "اطلاعات بانکی",
            icon: <FaUniversity className="text-lg sm:text-xl" />,
            component: () => (
              <CredentialsWithProgress currentStep="banking">
                <BankingInfo initialData={userData?.bankingInfo?.[0]} />
              </CredentialsWithProgress>
            ),
            description: "حساب بانکی برای دریافت درآمد",
          },
        ],
      },
    ];
  }, [currentUser, userData]);

  // Handle URL hash changes for navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash && currentUser) {
        // Find if hash matches any menu item or child
        for (const item of menuItems) {
          if (item.id === hash) {
            setSelectedMenuItem(hash);
            setExpandedMenus([]);
            return;
          }
          if (item.children) {
            const child = item.children.find((c) => c.id === hash);
            if (child) {
              setSelectedMenuItem(hash);
              setExpandedMenus([item.id]);
              return;
            }
          }
        }
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [currentUser]);

  // Check authentication and redirect if needed
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log("Dashboard auth check:", {
      isLoggedIn,
      currentUser,
      userLoading,
      hasToken: !!token,
      tokenPreview: token?.substring(0, 20) + "...",
    });

    // Wait for user loading to complete
    if (userLoading) {
      console.log("Still loading user data...");
      return;
    }

    if (!isLoggedIn || !currentUser) {
      console.log("Not logged in, redirecting to auth");
      router.push("/auth/sms");
      return;
    }

    console.log("User is logged in:", currentUser);
    setLoading(false);

    // Check for URL hash or parameters
    const hash = window.location.hash.substring(1);
    const tabParam = searchParams.get("tab");
    const targetTab = hash || tabParam;

    // Set menu item based on URL hash/parameter or user role
    if (targetTab) {
      let found = false;

      // Check if targetTab exists in menu items or children
      for (const item of menuItems) {
        if (item.id === targetTab) {
          setSelectedMenuItem(targetTab);
          setExpandedMenus([]);
          found = true;
          break;
        }
        if (item.children) {
          const child = item.children.find((c) => c.id === targetTab);
          if (child) {
            setSelectedMenuItem(targetTab);
            setExpandedMenus([item.id]);
            found = true;
            break;
          }
        }
      }

      if (found) {
        if (!hash && tabParam) {
          window.location.hash = targetTab;
        }
      } else {
        // Invalid tab, set default
        const isAdmin =
          currentUser.roles.includes("admin") ||
          currentUser.roles.includes("super_admin");
        const defaultTab = isAdmin ? "users" : "services";
        setSelectedMenuItem(defaultTab);
        window.location.hash = defaultTab;
      }
    } else {
      // No tab parameter, set default based on role
      const isAdmin =
        currentUser.roles.includes("admin") ||
        currentUser.roles.includes("super_admin");
      const defaultTab = isAdmin ? "users" : "services";
      setSelectedMenuItem(defaultTab);
      window.location.hash = defaultTab;
    }
  }, [isLoggedIn, currentUser, userLoading, router, searchParams]);

  // Handle responsive sidebar - close on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Admin menu items
  // const adminMenuItems: MenuItem[] = [
  //   {
  //     id: "users",
  //     label: "مدیریت کاربران",
  //     icon: <FaUsers className="text-lg" />,
  //     component: UsersList,
  //     description: "مدیریت کاربران و احراز هویت",
  //     children: [
  //       {
  //         id: "users",
  //         label: "مدیریت کاربران",
  //         icon: <FaUsers className="text-lg" />,
  //         component: UsersList,
  //         description: "مشاهده و مدیریت کاربران",
  //       },
  //       {
  //         id: "credentials",
  //         label: "احراز هویت",
  //         icon: <FaIdCard className="text-lg" />,
  //         component: NationalCredentialAdmin,
  //         description: "بررسی مدارک هویتی",
  //       },
  //       {
  //         id: "banking",
  //         label: "اطلاعات بانکی",
  //         icon: <FaUniversity className="text-lg" />,
  //         component: BankingInfoAdmin,
  //         description: "بررسی اطلاعات بانکی",
  //       },
  //     ],
  //   },
  //   {
  //     id: "list",
  //     label: "مدیریت لاتاری",
  //     icon: <FaTicketAlt className="text-lg" />,
  //     component: LotteryAdminList,
  //     description: "مدیریت ثبت‌نام‌های قرعه‌کشی گرین کارت",
  //     children: [
  //       {
  //         id: "list",
  //         label: "لیست ثبت‌ نام‌ها",
  //         icon: <FaList className="text-lg" />,
  //         component: LotteryAdminList,
  //         description: "مشاهده و مدیریت تمام ثبت‌نام‌های لاتاری",
  //       },
  //       {
  //         id: "hozori",
  //         label: "رزروهای حضوری",
  //         icon: <FaCalendarCheck className="text-lg" />,
  //         component: HozoriAdminList,
  //         description: "مشاهده و مدیریت تمام رزروهای حضوری",
  //       },
  //     ],
  //   },
  //   {
  //     id: "tickets",
  //     label: "مدیریت تیکت‌ها",
  //     icon: <FaHeadset className="text-lg" />,
  //     component: AdminTicketsWrapper,
  //     description: "مدیریت تیکت‌های پشتیبانی و پاسخ به کاربران",
  //   },
  //   {
  //     id: "wallets",
  //     label: "مدیریت پرداخت‌ها",
  //     icon: <FaMoneyBillWave className="text-lg" />,
  //     component: PaymentWrapper,
  //     description: "مدیریت کیف پول‌ها و درخواست‌های برداشت",
  //     children: [
  //       {
  //         id: "wallets" as const,
  //         label: "مدیریت کیف پول‌ها",
  //         icon: <FaWallet className="text-lg" />,
  //         component: WalletsList,
  //         description: "مدیریت تمام کیف پول ها",
  //       },
  //       {
  //         id: "withdraws" as const,
  //         label: "درخواست‌های برداشت",
  //         icon: <FaMoneyBillWave className="text-lg" />,
  //         component: WithdrawRequestsList,
  //         description: "مدیریت تمام درخواست های برداشت",
  //       },
  //     ],
  //   },
  //   {
  //     id: "requests",
  //     label: "مدیریت سرویس‌ها",
  //     icon: <FaServicestack className="text-lg" />,
  //     component: AdminServiceWrapper,
  //     description: "مدیریت سرویس‌ها و درخواست‌ها",
  //     children: [
  //       {
  //         id: "requests" as const,
  //         label: "مدیریت درخواست‌ها",
  //         icon: <FaClipboardList className="text-lg" />,
  //         description: "مشاهده و مدیریت درخواست‌های سرویس",
  //         component: AdminRequestsTable,
  //       },
  //       {
  //         id: "services" as const,
  //         label: "مدیریت سرویس‌ها",
  //         icon: <FaServicestack className="text-lg" />,
  //         description: "مدیریت و ویرایش سرویس‌ها",
  //         component: ServiceManager,
  //       },
  //       {
  //         id: "analytics" as const,
  //         label: "آنالیز و گزارشات",
  //         icon: <FaChartBar className="text-lg" />,
  //         description: "آمار و گزارشات سرویس‌ها",
  //         component: () => (
  //           <div className="p-8 text-center">
  //             <FaChartBar className="text-6xl text-gray-400 mx-auto mb-4" />
  //             <h3 className="text-xl font-bold text-gray-700 mb-2">
  //               آنالیز و گزارشات
  //             </h3>
  //             <p className="text-gray-500">این بخش در حال توسعه است</p>
  //           </div>
  //         ),
  //       },
  //     ],
  //   },
  // ];

  // Customer menu items
  // const customerMenuItems: MenuItem[] = [
  //   {
  //     id: "security",
  //     label: "خدمات و سفارشات",
  //     icon: <FaClipboardList className="text-lg" />,
  //     component: ServiceWrapper,
  //     description: "مشاهده خدمات و سفارشات",
  //     children: [
  //       {
  //         id: "services" as const,
  //         label: "خدمات",
  //         icon: <FaShoppingCart className="text-lg sm:text-xl" />,
  //         description: "مشاهده و سفارش خدمات",
  //         component: ServicesPage,
  //       },
  //       {
  //         id: "orders" as const,
  //         label: "سفارشات من",
  //         icon: <FaHistory className="text-lg sm:text-xl" />,
  //         description: "تاریخچه و وضعیت سفارشات",
  //         component: CustomerRequestsTable,
  //       },
  //       {
  //         id: "terms" as const,
  //         label: "قوانین و شرایط",
  //         icon: <FaFileContract className="text-lg sm:text-xl" />,
  //         description: "شرایط استفاده از خدمات",
  //         component: TermsPage,
  //       },
  //     ],
  //   },
  //   {
  //     id: "lottery",
  //     label: "ثبت‌نام‌های لاتاری",
  //     icon: <FaTicketAlt className="text-lg" />,
  //     component: CustomerLotteryWrapper,
  //     description: "مدیریت ثبت‌نام‌های قرعه‌کشی گرین کارت",
  //     children: [
  //       {
  //         id: "list",
  //         label: "ثبت‌نام‌های من",
  //         icon: <FaList className="text-lg" />,
  //         component: CustomerLotteryList,
  //         description: "مشاهده تمام ثبت‌نام‌های لاتاری  ",
  //       },
  //       {
  //         id: "hozori",
  //         label: "رزروهای حضوری",
  //         icon: <FaCalendarCheck className="text-lg" />,
  //         component: CustomerHozoriList,
  //         description: "مشاهده تمام رزروهای حضوری شما",
  //       },
  //     ],
  //   },
  //   {
  //     id: "tickets",
  //     label: "پشتیبانی",
  //     icon: <FaHeadset className="text-lg" />,
  //     component: TicketsWrapper,
  //     description: "ایجاد تیکت و دریافت پشتیبانی",
  //   },
  //   {
  //     id: "wallet",
  //     label: "کیف پول",
  //     icon: <FaWallet className="text-lg" />,
  //     component: WalletWrapper,
  //     description: "مدیریت موجودی و تراکنش‌ها",
  //     children: [
  //       {
  //         id: "wallet-dashboard",
  //         label: "داشبورد کیف پول",
  //         icon: <FaWallet className="text-lg" />,
  //         component: () => <WalletWrapper initialTab="dashboard" />,
  //         description: "نمای کلی و موجودی",
  //       },
  //       {
  //         id: "wallet-incomes",
  //         label: "تاریخچه واریزیها",
  //         icon: <FaArrowUp className="text-lg" />,
  //         component: () => <WalletWrapper initialTab="incomes" />,
  //         description: "تاریخچه پرداخت ها",
  //       },
  //       {
  //         id: "wallet-withdraws",
  //         label: "درخواست برداشت",
  //         icon: <FaArrowDown className="text-lg" />,
  //         component: () => <WalletWrapper initialTab="withdraws" />,
  //         description: "تاریخچه برداشتها",
  //       },
  //     ],
  //   },
  //   {
  //     id: "credentials",
  //     label: "احراز هویت",
  //     icon: <FaIdCard className="text-lg" />,
  //     component: CredentialWrapper,
  //     description: "مدارک و احراز هویت",
  //     children: [
  //       {
  //         id: "securities",
  //         label: "امنیت و دسترسی",
  //         icon: <FaShieldAlt className="text-lg sm:text-xl" />,
  //         component: () => (
  //           <Security
  //             initialData={{
  //               username: userData?.username,
  //               status: userData?.status,
  //               roles: userData?.roles,
  //               profile: userData?.profile,
  //             }}
  //           />
  //         ),
  //         description: "نام کاربری، رمز عبور و تنظیمات امنیتی",
  //       },
  //       {
  //         id: "nationalCredentials",
  //         label: "مدارک هویتی",
  //         icon: <FaIdCard className="text-lg sm:text-xl" />,
  //         component: () => (
  //           <NationalCredentials initialData={userData?.nationalCredentials} />
  //         ),
  //         description: "کارت ملی، احراز هویت و مدارک شخصی",
  //       },
  //       {
  //         id: "contactInfo",
  //         label: "اطلاعات تماس",
  //         icon: <FaPhone className="text-lg sm:text-xl" />,
  //         component: () => <ContactInfo initialData={userData?.contactInfo} />,
  //         description: "شماره تماس، ایمیل و آدرس",
  //       },
  //       {
  //         id: "bankingInfo",
  //         label: "اطلاعات بانکی",
  //         icon: <FaUniversity className="text-lg sm:text-xl" />,
  //         component: () => (
  //           <BankingInfo initialData={userData?.bankingInfo?.[0]} />
  //         ),
  //         description: "حساب بانکی برای دریافت درآمد",
  //       },
  //     ],
  //   },
  // ];

  const findMenuItem = (id: string): MenuItem | undefined => {
    for (const item of menuItems) {
      if (item.id === id) return item;
      if (item.children) {
        const child = item.children.find((c) => c.id === id);
        if (child) return child;
      }
    }
    return undefined;
  };

  const activeMenuItem = findMenuItem(selectedMenuItem);
  const ActiveComponent =
    activeMenuItem?.component || (() => <div>صفحه پیدا نشد</div>);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    showToast.success("با موفقیت خارج شدید");
    router.push("/auth/sms");
  };

  const getUserRole = () => {
    if (!currentUser) return "";
    if (currentUser.roles.includes("super_admin")) return "مدیر ارشد";
    if (currentUser.roles.includes("admin")) return "مدیر";
    return "کاربر";
  };

  const getUserName = () => {
    if (!currentUser) return "";
    return currentUser.firstName && currentUser.lastName
      ? `${currentUser.firstName} ${currentUser.lastName}`
      : currentUser.firstName || "کاربر";
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (userLoading || loading) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] rounded-2xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
            <FaCog className="text-white text-3xl animate-spin" />
          </div>
          <p className="text-[#0A1D37] font-bold text-lg">در حال بارگذاری...</p>
          <p className="text-gray-500 text-sm">لطفاً صبر کنید</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen " dir="rtl">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed right-0 top-0 h-full w-80 bg-white/95 backdrop-blur-xl border-l border-gray-200/50 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-[#0A1D37]/5 to-[#4DBFF0]/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                {" "}
                <div className="flex items-center cursor-pointer">
                  <Image
                    src="/assets/images/loggo.png"
                    width={70}
                    height={70}
                    alt="logo"
                    priority
                    className="transition-all duration-300"
                  />
                </div>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-[#0A1D37] mb-1">
                  ارزی پلاس
                </h1>
                <p className="text-sm text-gray-600 font-medium">پنل مدیریت</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <FaTimes className="text-gray-500 text-lg" />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-200/50 bg-gradient-to-b from-transparent to-gray-50/30">
          <div className="flex items-center gap-4  ">
            {currentUser.profile?.avatar ? (
              <img
                src={currentUser.profile.avatar}
                alt="Avatar"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#4DBFF0]"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = "none";
                  const fallback = img.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className="w-12 h-12 rounded-full bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] flex items-center justify-center text-white font-bold"
              style={{ display: currentUser.profile?.avatar ? "none" : "flex" }}
            >
              {getUserName().charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#0A1D37] text-sm mb-1 truncate">
                {getUserName()} - {getUserRole()}
              </p>
              {currentUser.phone && (
                <p className="text-xs text-gray-600">{currentUser.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 flex-1 overflow-y-auto max-h-[calc(100vh-330px)]">
          <div className="space-y-1.5">
            {menuItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (item.children) {
                      setExpandedMenus((prev) =>
                        prev.includes(item.id) ? [] : [item.id]
                      );
                    } else {
                      setSelectedMenuItem(item.id);
                      window.location.hash = item.id;
                      if (window.innerWidth < 1024) {
                        setSidebarOpen(false);
                      }
                    }
                  }}
                  className={`w-full flex items-center gap-2 p-2.5 rounded-lg transition-all duration-200 group ${
                    selectedMenuItem === item.id ||
                    (item.children &&
                      item.children.some((c) => c.id === selectedMenuItem))
                      ? "bg-[#0A1D37]/10 border border-[#0A1D37]/20 text-[#0A1D37]"
                      : "hover:bg-gray-50 text-gray-700 hover:text-[#0A1D37] border border-transparent"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 p-1.5 rounded-lg ${
                      selectedMenuItem === item.id ||
                      (item.children &&
                        item.children.some((c) => c.id === selectedMenuItem))
                        ? "text-[#0A1D37] bg-white/70"
                        : "text-gray-500 group-hover:text-[#0A1D37]"
                    } transition-all duration-200`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 text-right min-w-0">
                    <p
                      className={`font-semibold text-sm truncate ${
                        selectedMenuItem === item.id ||
                        (item.children &&
                          item.children.some((c) => c.id === selectedMenuItem))
                          ? "text-[#0A1D37]"
                          : "text-gray-700 group-hover:text-[#0A1D37]"
                      }`}
                    >
                      {item.label}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {item.children ? (
                      <FaChevronDown
                        className={`text-xs transition-all duration-200 ${
                          expandedMenus.includes(item.id)
                            ? "rotate-180 text-[#0A1D37]"
                            : "text-gray-400 group-hover:text-[#0A1D37]"
                        }`}
                      />
                    ) : (
                      <FaChevronLeft
                        className={`text-xs transition-all duration-200 ${
                          selectedMenuItem === item.id
                            ? "rotate-90 text-[#0A1D37]"
                            : "text-gray-400 group-hover:text-[#0A1D37]"
                        }`}
                      />
                    )}
                  </div>
                </button>

                {item.children && (
                  <div
                    className={`mr-6 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                      expandedMenus.includes(item.id)
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => {
                          setSelectedMenuItem(child.id);
                          window.location.hash = child.id;
                          if (window.innerWidth < 1024) {
                            setSidebarOpen(false);
                          }
                        }}
                        className={`w-full flex items-center gap-2 p-2 rounded-lg transition-all duration-200 group ${
                          selectedMenuItem === child.id
                            ? "bg-[#0A1D37]/10 border border-[#0A1D37]/20 text-[#0A1D37]"
                            : "hover:bg-gray-50 text-gray-600 hover:text-[#0A1D37] border border-transparent"
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 p-1 rounded-md text-sm ${
                            selectedMenuItem === child.id
                              ? "text-[#0A1D37] bg-white/70"
                              : "text-gray-500 group-hover:text-[#0A1D37]"
                          } transition-all duration-200`}
                        >
                          {child.icon}
                        </div>
                        <div className="flex-1 text-right min-w-0">
                          <p
                            className={`font-medium text-xs truncate ${
                              selectedMenuItem === child.id
                                ? "text-[#0A1D37]"
                                : "text-gray-700 group-hover:text-[#0A1D37]"
                            }`}
                          >
                            {child.label}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200/50 bg-gradient-to-t from-white to-transparent backdrop-blur-sm">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-600 hover:bg-red-50 hover:shadow-lg transition-all duration-300 group hover:scale-[1.02] active:scale-95 border-2 border-transparent hover:border-red-100"
          >
            <div className="p-2.5 bg-red-100 rounded-xl group-hover:bg-red-200 transition-all duration-300 shadow-sm">
              <FaSignOutAlt className="text-lg" />
            </div>
            <span className="font-bold text-base">خروج از حساب</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ease-in-out ${
          sidebarOpen ? "lg:mr-80" : "lg:mr-0"
        }`}
      >
        {/* Header */}
        <header className="bg-white/90  backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center justify-between p-4 lg:p-6 gap-4">
            <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
              {/* Toggle Button */}
              <button
                onClick={toggleSidebar}
                className="p-3 hover:bg-gradient-to-r hover:from-[#0A1D37]/10 hover:to-[#4DBFF0]/10 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 group border-2 border-transparent hover:border-[#0A1D37]/20 shadow-sm hover:shadow-md"
                title={sidebarOpen ? "بستن منو" : "باز کردن منو"}
              >
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <FaBars
                    className={`text-[#0A1D37] text-lg group-hover:text-[#0A1D37] transition-all duration-300 absolute ${
                      sidebarOpen
                        ? "opacity-0 rotate-90"
                        : "opacity-100 rotate-0"
                    }`}
                  />
                  <FaChevronRight
                    className={`text-[#0A1D37] text-lg transition-all duration-300 absolute ${
                      sidebarOpen
                        ? "opacity-100 rotate-0"
                        : "opacity-0 -rotate-90"
                    }`}
                  />
                </div>
              </button>

              <div className="min-w-0 flex-1">
                <h1 className="font-bold text-[#0A1D37] text-lg lg:text-xl mb-1 truncate">
                  {activeMenuItem?.label || "داشبورد"}
                </h1>
                <p className="text-xs lg:text-sm text-gray-600 truncate">
                  {activeMenuItem?.description || "خوش آمدید به پنل مدیریت"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] rounded-xl text-white font-bold text-sm hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <FaHome className="text-base" />
                <span className="hidden sm:inline">صفحه اصلی</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30">
          <div className="">
            {selectedMenuItem === "wallet" ? (
              <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                  <div className="bg-white rounded-2xl  p-6">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#0A1D37]/10 to-[#4DBFF0]/10 rounded-xl flex items-center justify-center">
                        <FaWallet className="text-[#0A1D37] text-xl" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-[#0A1D37]">
                          کیف پول من
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                          مدیریت موجودی و تراکنش‌های مالی
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <WalletWrapper
                  initialTab={
                    (searchParams.get("walletTab") as
                      | "dashboard"
                      | "incomes"
                      | "withdraws"
                      | "add-funds"
                      | undefined) || "dashboard"
                  }
                  className=""
                />
              </div>
            ) : (
              <div className="   mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <ActiveComponent />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
