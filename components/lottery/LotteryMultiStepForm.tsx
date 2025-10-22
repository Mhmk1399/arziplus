"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaUsers,
  FaChild,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaSave,
  FaIdCard,
  FaPhone,
  FaGlobe,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { showToast } from "@/utilities/toast";
import PersianDatePicker from "@/components/ui/PersianDatePicker";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import PaymentMethodSelector from "@/components/payment/PaymentMethodSelector";
import CardPaymentModal from "@/components/payment/CardPaymentModal";
import FileUploaderModal from "@/components/FileUploaderModal";
import { modalContents } from "@/components/static/lottery/modalContent";

// Types based on the lottery model
interface FamilyInformation {
  maridgeState: boolean;
  numberOfChildren: number;
  towPeopleRegistration: boolean;
}

interface InitialInformations {
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: {
    year: string;
    month: string;
    day: string;
  };
  country: string;
  city: string;
  citizenshipCountry: string;
}

interface ResidanceInformation {
  residanceCountry: string;
  residanceCity: string;
  residanseState: string;
  postalCode: string;
  residanseAdress: string;
}

interface ContactInformations {
  activePhoneNumber: string;
  secondaryPhoneNumber: string;
  email: string;
}

interface OtherInformations {
  persianName: string;
  persianLastName: string;
  lastDegree: string;
  partnerCitizenShip: string;
  imageUrl: string;
}

interface RegistererInformation {
  initialInformations: InitialInformations;
  residanceInformation: ResidanceInformation[];
  contactInformations: ContactInformations[];
  otherInformations: OtherInformations[];
}

interface PartnerInformation {
  initialInformations: InitialInformations;
  otherInformations: OtherInformations[];
}

interface ChildInformation {
  initialInformations: InitialInformations;
  otherInformations: OtherInformations[];
}

interface LotteryFormData {
  famillyInformations: FamilyInformation[];
  registererInformations: RegistererInformation[];
  registererPartnerInformations: PartnerInformation[];
  registererChildformations: ChildInformation[];
}

const LotteryMultiStepForm: React.FC = () => {
  const router = useRouter();
  const { user: currentUser, isLoggedIn, loading } = useCurrentUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [showCardPaymentModal, setShowCardPaymentModal] = useState(false);
  const [showFileUploader, setShowFileUploader] = useState(false);
  const [showPhotoInfoModal, setShowPhotoInfoModal] = useState(false);
  const [uploadContext, setUploadContext] = useState<
    { kind: "registerer" | "partner" } | { kind: "child"; index: number } | null
  >(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const [formData, setFormData] = useState<LotteryFormData>({
    famillyInformations: [
      {
        maridgeState: false,
        numberOfChildren: 0,
        towPeopleRegistration: false,
      },
    ],
    registererInformations: [
      {
        initialInformations: {
          firstName: "",
          lastName: "",
          gender: "",
          birthDate: {
            year: "",
            month: "",
            day: "",
          },
          country: "",
          city: "",
          citizenshipCountry: "",
        },
        residanceInformation: [
          {
            residanceCountry: "",
            residanceCity: "",
            residanseState: "",
            postalCode: "",
            residanseAdress: "",
          },
        ],
        contactInformations: [
          {
            activePhoneNumber: "",
            secondaryPhoneNumber: "",
            email: "",
          },
        ],
        otherInformations: [
          {
            persianName: "",
            persianLastName: "",
            lastDegree: "",
            partnerCitizenShip: "",
            imageUrl: "",
          },
        ],
      },
    ],
    registererPartnerInformations: [],
    registererChildformations: [],
  });

  const steps = [
    {
      id: 0,
      title: "اطلاعات خانوادگی",
      icon: <FaUsers className="text-xl" />,
      description: "وضعیت تأهل و اطلاعات کلی خانواده",
    },
    {
      id: 1,
      title: "اطلاعات ثبت‌کننده",
      icon: <FaUser className="text-xl" />,
      description: "اطلاعات  ثبت‌کننده",
    },
    {
      id: 2,
      title: "اطلاعات همسر",
      icon: <FaIdCard className="text-xl" />,
      description: "اطلاعات همسر ",
      conditional: () => formData.famillyInformations[0]?.maridgeState,
    },
    {
      id: 3,
      title: "اطلاعات فرزندان",
      icon: <FaChild className="text-xl" />,
      description: "اطلاعات فرزندان ",
      conditional: () => formData.famillyInformations[0]?.numberOfChildren > 0,
    },
  ];

  const getVisibleSteps = () => {
    return steps.filter((step) => !step.conditional || step.conditional());
  };

  // Validation functions
  const validateStep = (step: number): boolean => {
    const errors: { [key: string]: string } = {};

    switch (step) {
      case 0: // Family Information
        const family = formData.famillyInformations[0];
        if (family.maridgeState && family.towPeopleRegistration === undefined) {
          errors.towPeopleRegistration =
            "لطفاً مشخص کنید آیا ثبت‌نام دونفره می‌کنید یا خیر";
        }
        if (family.numberOfChildren < 0) {
          errors.numberOfChildren = "تعداد فرزندان نمی‌تواند منفی باشد";
        }
        break;

      case 1: // Registerer Information
        const registerer = formData.registererInformations[0];
        const initial = registerer.initialInformations;
        const residence = registerer.residanceInformation[0];
        const contact = registerer.contactInformations[0];
        const other = registerer.otherInformations[0];

        // Initial Information validation
        if (!initial.firstName.trim()) errors.firstName = "نام الزامی است";
        if (!initial.lastName.trim())
          errors.lastName = "نام خانوادگی الزامی است";
        if (!initial.gender) errors.gender = "جنسیت الزامی است";
        if (!initial.birthDate.year) errors.birthYear = "سال تولد الزامی است";
        if (!initial.birthDate.month) errors.birthMonth = "ماه تولد الزامی است";
        if (!initial.birthDate.day) errors.birthDay = "روز تولد الزامی است";
        if (!initial.country.trim()) errors.country = "کشور تولد الزامی است";
        if (!initial.city.trim()) errors.city = "شهر تولد الزامی است";
        if (!initial.citizenshipCountry.trim())
          errors.citizenshipCountry = "کشور تابعیت الزامی است";

        // Residence Information validation
        if (!residence.residanceCountry.trim())
          errors.residanceCountry = "کشور محل سکونت الزامی است";
        if (!residence.residanceCity.trim())
          errors.residanceCity = "شهر محل سکونت الزامی است";
        if (!residence.residanseState.trim())
          errors.residanseState = "استان/ایالت محل سکونت الزامی است";
        if (!residence.postalCode.trim())
          errors.postalCode = "کد پستی الزامی است";
        if (!residence.residanseAdress.trim())
          errors.residanseAdress = "آدرس کامل الزامی است";

        // Contact Information validation
        if (!contact.activePhoneNumber.trim())
          errors.activePhoneNumber = "شماره تلفن فعال الزامی است";
        if (!contact.email.trim()) errors.email = "آدرس ایمیل الزامی است";
        if (contact.email && !/\S+@\S+\.\S+/.test(contact.email)) {
          errors.email = "فرمت ایمیل صحیح نیست";
        }

        // Other Information validation
        if (!other.persianName.trim())
          errors.persianName = "نام فارسی الزامی است";
        if (!other.persianLastName.trim())
          errors.persianLastName = "نام خانوادگی فارسی الزامی است";
        if (!other.lastDegree.trim())
          errors.lastDegree = "آخرین مدرک تحصیلی الزامی است";
        if (!other.imageUrl.trim()) errors.imageUrl = "آپلود تصویر الزامی است";
        break;

      case 2: // Partner Information
        if (formData.famillyInformations[0]?.maridgeState) {
          if (formData.registererPartnerInformations.length === 0) {
            errors.partnerData = "اطلاعات همسر باید تکمیل شود";
            break;
          }

          const partner = formData.registererPartnerInformations[0];
          const partnerInitial = partner?.initialInformations;
          const partnerOther = partner?.otherInformations?.[0];

          if (!partnerInitial?.firstName?.trim())
            errors.partnerFirstName = "نام همسر الزامی است";
          if (!partnerInitial?.lastName?.trim())
            errors.partnerLastName = "نام خانوادگی همسر الزامی است";
          if (!partnerInitial?.gender)
            errors.partnerGender = "جنسیت همسر الزامی است";
          if (!partnerInitial?.birthDate?.year)
            errors.partnerBirthYear = "سال تولد همسر الزامی است";
          if (!partnerInitial?.birthDate?.month)
            errors.partnerBirthMonth = "ماه تولد همسر الزامی است";
          if (!partnerInitial?.birthDate?.day)
            errors.partnerBirthDay = "روز تولد همسر الزامی است";
          if (!partnerInitial?.country?.trim())
            errors.partnerCountry = "کشور تولد همسر الزامی است";
          if (!partnerInitial?.city?.trim())
            errors.partnerCity = "شهر تولد همسر الزامی است";
          if (!partnerInitial?.citizenshipCountry?.trim())
            errors.partnerCitizenshipCountry = "کشور تابعیت همسر الزامی است";

          if (!partnerOther?.persianName?.trim())
            errors.partnerPersianName = "نام فارسی همسر الزامی است";
          if (!partnerOther?.persianLastName?.trim())
            errors.partnerPersianLastName =
              "نام خانوادگی فارسی همسر الزامی است";
          if (!partnerOther?.lastDegree?.trim())
            errors.partnerLastDegree = "آخرین مدرک تحصیلی همسر الزامی است";
          if (!partnerOther?.imageUrl?.trim())
            errors.partnerImageUrl = "آپلود تصویر همسر الزامی است";
        }
        break;

      case 3: // Children Information
        if (formData.famillyInformations[0]?.numberOfChildren > 0) {
          formData.registererChildformations.forEach((child, index) => {
            const childInitial = child.initialInformations;
            const childOther = child.otherInformations?.[0];

            if (!childInitial.firstName.trim())
              errors[`childFirstName${index}`] = `نام فرزند ${
                index + 1
              } الزامی است`;
            if (!childInitial.lastName.trim())
              errors[`childLastName${index}`] = `نام خانوادگی فرزند ${
                index + 1
              } الزامی است`;
            if (!childInitial.gender)
              errors[`childGender${index}`] = `جنسیت فرزند ${
                index + 1
              } الزامی است`;
            if (!childInitial.birthDate.year)
              errors[`childBirthYear${index}`] = `سال تولد فرزند ${
                index + 1
              } الزامی است`;
            if (!childInitial.birthDate.month)
              errors[`childBirthMonth${index}`] = `ماه تولد فرزند ${
                index + 1
              } الزامی است`;
            if (!childInitial.birthDate.day)
              errors[`childBirthDay${index}`] = `روز تولد فرزند ${
                index + 1
              } الزامی است`;
            if (!childInitial.country.trim())
              errors[`childCountry${index}`] = `کشور تولد فرزند ${
                index + 1
              } الزامی است`;
            if (!childInitial.city.trim())
              errors[`childCity${index}`] = `شهر تولد فرزند ${
                index + 1
              } الزامی است`;
            if (!childInitial.citizenshipCountry.trim())
              errors[`childCitizenshipCountry${index}`] = `کشور تابعیت فرزند ${
                index + 1
              } الزامی است`;

            // Only validate image - Persian names and lastDegree not required for children
            if (childOther && !childOther.imageUrl?.trim())
              errors[`childImageUrl${index}`] = `آپلود تصویر فرزند ${
                index + 1
              } الزامی است`;
          });
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      const visibleSteps = getVisibleSteps();
      setCurrentStep(Math.min(visibleSteps.length - 1, currentStep + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      showToast.error("لطفاً تمامی فیلدهای الزامی را تکمیل کنید");
    }
  };

  // Helper function to render form fields with validation
  const renderFormField = (
    type: "text" | "select" | "email",
    label: string,
    value: string,
    onChange: (value: string) => void,
    errorKey: string,
    placeholder?: string,
    options?: { value: string; label: string }[],
    required: boolean = true,
    className?: string
  ) => (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === "select" ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full p-2 md:p-3 border rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] outline-none transition-all ${
            validationErrors[errorKey] ? "border-red-500" : "border-gray-300"
          }`}
          required={required}
        >
          <option value="">{placeholder || "انتخاب کنید"}</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full p-2 md:p-3 border outline-none rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all ${
            validationErrors[errorKey] ? "border-red-500" : "border-gray-300"
          }`}
          required={required}
        />
      )}
      {validationErrors[errorKey] && (
        <p className="text-red-500 text-xs mt-1">
          {validationErrors[errorKey]}
        </p>
      )}
    </div>
  );

  // Fetch wallet balance
  const fetchWalletBalance = async () => {
    if (!currentUser) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/wallet", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Access the correct property: data.stats.currentBalance or data.wallet.currentBalance
        setWalletBalance(data.stats?.currentBalance || data.wallet?.currentBalance || 0);
      }
    } catch (error) {
      console.log("Error fetching wallet balance:", error);
    }
  };

  // Fetch wallet balance when user loads
  useEffect(() => {
    if (currentUser) {
      fetchWalletBalance();
    }
  }, [currentUser]);

  // Authentication check - redirect if not logged in
  useEffect(() => {
    // Only check authentication after loading is complete
    if (!loading && !isLoggedIn) {
      showToast.error("برای دسترسی به این صفحه باید وارد حساب کاربری خود شوید");
      setTimeout(() => {
        router.push("/auth/sms");
      }, 2000);
    }
  }, [isLoggedIn, loading, router]);

  // Loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A1D37] mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بررسی احراز هویت</p>
        </div>
      </div>
    );
  }

  // Not logged in state - only show after loading is complete
  if (!loading && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            دسترسی محدود
          </h2>
          <p className="text-gray-600 mb-6">
            برای ثبت‌نام در قرعه‌کشی باید وارد حساب کاربری خود شوید
          </p>
          <button
            onClick={() => router.push("/auth/sms")}
            className="bg-[#0A1D37] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#0A1D37]/90 transition-colors"
          >
            ورود به حساب کاربری
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!currentUser?.id) {
      showToast.error("لطفاً ابتدا وارد حساب کاربری خود شوید");
      return;
    }

    // Validate all visible steps before submission
    const visibleSteps = getVisibleSteps();
    for (let i = 0; i < visibleSteps.length; i++) {
      if (!validateStep(visibleSteps[i].id)) {
        showToast.error(
          `لطفاً ابتدا اطلاعات مرحله "${visibleSteps[i].title}" را تکمیل کنید`
        );
        setCurrentStep(i);
        return;
      }
    }

    // Show payment method selection
    setShowPaymentSelector(true);
  };

  const lotteryFee =
    5000 + (formData.famillyInformations[0]?.numberOfChildren || 0) * 150000;

  // Handle wallet payment
  const handleWalletPayment = async () => {
    setIsSubmitting(true);
    try {
      // Check wallet balance
      if (walletBalance < lotteryFee) {
        showToast.error("موجودی کیف پول کافی نیست");
        // Redirect to wallet page
        window.location.href = "/dashboard?tab=wallet";
        return;
      }

      // Submit lottery registration with wallet payment
      await submitLotteryRegistration("wallet", lotteryFee);

      // Deduct from wallet after successful registration
      const token = localStorage.getItem("authToken");
      const walletResponse = await fetch("/api/wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "add_outcome",
          amount: lotteryFee,
          description: `ثبت‌نام در قرعه‌کشی`,
          tag: "lottery_payment",
        }),
      });

      if (!walletResponse.ok) {
        const errorData = await walletResponse.json();
        throw new Error(errorData.error || "خطا در کسر از کیف پول");
      }

      const orderId = `LOTTERY-WALLET-${Date.now()}`;

      showToast.success(
        `ثبت‌نام در قرعه‌کشی با موفقیت انجام شد. مبلغ ${lotteryFee.toLocaleString()} تومان از کیف پول کسر گردید.`
      );

      // Update wallet balance
      setWalletBalance((prev) => prev - lotteryFee);

      // Redirect to wallet success page
      setTimeout(() => {
        router.push(
          `/payment/wallet-success?orderId=${orderId}&amount=${lotteryFee}&type=lottery`
        );
      }, 1500);
    } catch (error) {
      console.log("Wallet payment error:", error);
      showToast.error("خطا در پرداخت از کیف پول");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle direct payment (ZarinPal)
  const handleDirectPayment = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      const orderId = `LOTTERY-${Date.now()}`;

      // Store lottery data in localStorage with orderId as key
      localStorage.setItem(`lottery_${orderId}`, JSON.stringify(formData));

      // Prepare payment data
      const paymentData = {
        amount: lotteryFee,
        description: `ثبت‌نام در قرعه‌کشی`,
        orderId,
        currency: "IRT",
        metadata: {
          mobile: currentUser!.phone,
          order_id: `LOTTERY-${Date.now()}`,
          customerName:
            currentUser!.firstName && currentUser!.lastName
              ? `${currentUser!.firstName} ${currentUser!.lastName}`
              : currentUser!.firstName || "کاربر",
          customerPhone: currentUser!.phone,
          type: "lottery_payment",
        },
      };

      // Call payment request API
      const response = await fetch("/api/payment/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showToast.success("درخواست پرداخت با موفقیت ایجاد شد");
        // Redirect to ZarinPal payment portal
        if (data.data.paymentUrl) {
          window.location.href = data.data.paymentUrl;
        }
      } else {
        showToast.error(data.error || "خطا در ایجاد درخواست پرداخت");
      }
    } catch (error) {
      console.log("Payment request error:", error);
      showToast.error("خطا در اتصال به سرور");
    } finally {
      setIsSubmitting(false);
    }
  };



  // Submit lottery registration after successful payment
  const submitLotteryRegistration = async (
    paymentMethod: string,
    amount: number,
    receiptUrl?: string
  ) => {
    const token = localStorage.getItem("authToken");

    const lotteryData = {
      ...formData,
      paymentMethod,
      paymentAmount: amount,
      isPaid: true,
      receiptUrl,
      // Add payment image for card payments (receiptUrl serves as patmentImage)
      patmentImage: paymentMethod === "card" ? receiptUrl : undefined,
      paymentDate: new Date(),
    };

    const response = await fetch("/api/lottery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(lotteryData),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "خطا در ثبت اطلاعات");
    }

    return result;
  };

  const updateFamilyInfo = (
    field: keyof FamilyInformation,
    value: boolean | number | string
  ) => {
    setFormData((prev) => ({
      ...prev,
      famillyInformations: [
        {
          ...prev.famillyInformations[0],
          [field]: value,
        },
      ],
    }));

    // Auto-adjust partner and children arrays based on family info
    if (field === "numberOfChildren") {
      const numberOfChildren = parseInt(value as string) || 0;
      setFormData((prev) => ({
        ...prev,
        registererChildformations: Array(numberOfChildren)
          .fill(null)
          .map(
            (_, index) =>
              prev.registererChildformations[index] || {
                initialInformations: {
                  firstName: "",
                  lastName: "",
                  gender: "",
                  birthDate: {
                    year: "",
                    month: "",
                    day: "",
                  },
                  country: "",
                  city: "",
                  citizenshipCountry: "",
                },
                otherInformations: [
                  {
                    persianName: "",
                    persianLastName: "",
                    lastDegree: "",
                    partnerCitizenShip: "",
                    imageUrl: "",
                  },
                ],
              }
          ),
      }));
    }

    if (field === "maridgeState" && value) {
      setFormData((prev) => ({
        ...prev,
        registererPartnerInformations: [
          prev.registererPartnerInformations[0] || {
            initialInformations: {
              firstName: "",
              lastName: "",
              gender: "",
              yearOfBirth: "",
              monthOfBirth: "",
              dayOfBirth: "",
              country: "",
              city: "",
              citizenshipCountry: "",
            },
            otherInformations: [
              {
                persianName: "",
                persianLastName: "",
                lastDegree: "",
                partnerCitizenShip: "",
                imageUrl: "",
              },
            ],
          },
        ],
      }));
    } else if (field === "maridgeState" && !value) {
      setFormData((prev) => ({
        ...prev,
        registererPartnerInformations: [],
      }));
    }
  };

  const updateRegistererInfo = (
    section: keyof RegistererInformation,
    field: string,
    value: string | { year: string; month: string; day: string }
  ) => {
    setFormData((prev) => ({
      ...prev,
      registererInformations: [
        {
          ...prev.registererInformations[0],
          [section]:
            section === "initialInformations"
              ? {
                  ...prev.registererInformations[0].initialInformations,
                  [field]: value,
                }
              : prev.registererInformations[0][section].map((item, index) =>
                  index === 0 ? { ...item, [field]: value } : item
                ),
        },
      ],
    }));
  };

  const updatePartnerInfo = (
    field: string,
    value: string | { year: string; month: string; day: string }
  ) => {
    setFormData((prev) => {
      // Initialize partner info if it doesn't exist
      if (prev.registererPartnerInformations.length === 0) {
        return {
          ...prev,
          registererPartnerInformations: [
            {
              initialInformations: {
                firstName: "",
                lastName: "",
                gender: "",
                birthDate: {
                  year: "",
                  month: "",
                  day: "",
                },
                country: "",
                city: "",
                citizenshipCountry: "",
                [field]: value,
              },
              otherInformations: [
                {
                  persianName: "",
                  persianLastName: "",
                  lastDegree: "",
                  partnerCitizenShip: "",
                  imageUrl: "",
                },
              ],
            },
          ],
        };
      }

      return {
        ...prev,
        registererPartnerInformations: [
          {
            ...prev.registererPartnerInformations[0],
            initialInformations: {
              ...prev.registererPartnerInformations[0].initialInformations,
              [field]: value,
            },
          },
        ],
      };
    });
  };

  const updatePartnerOtherInfo = (field: string, value: string) => {
    setFormData((prev) => {
      // Initialize partner info if it doesn't exist
      if (prev.registererPartnerInformations.length === 0) {
        return {
          ...prev,
          registererPartnerInformations: [
            {
              initialInformations: {
                firstName: "",
                lastName: "",
                gender: "",
                birthDate: {
                  year: "",
                  month: "",
                  day: "",
                },
                country: "",
                city: "",
                citizenshipCountry: "",
              },
              otherInformations: [
                {
                  persianName: "",
                  persianLastName: "",
                  lastDegree: "",
                  partnerCitizenShip: "",
                  imageUrl: "",
                  [field]: value,
                },
              ],
            },
          ],
        };
      }

      return {
        ...prev,
        registererPartnerInformations: [
          {
            ...prev.registererPartnerInformations[0],
            otherInformations: [
              {
                ...prev.registererPartnerInformations[0].otherInformations[0],
                [field]: value,
              },
            ],
          },
        ],
      };
    });
  };

  const updateChildOtherInfo = (
    childIndex: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => {
      // Ensure child entry exists
      const children = prev.registererChildformations.slice();
      if (!children[childIndex]) {
        children[childIndex] = {
          initialInformations: {
            firstName: "",
            lastName: "",
            gender: "",
            birthDate: { year: "", month: "", day: "" },
            country: "",
            city: "",
            citizenshipCountry: "",
          },
          otherInformations: [
            {
              persianName: "",
              persianLastName: "",
              lastDegree: "",
              partnerCitizenShip: "",
              imageUrl: "",
            },
          ],
        } as RegistererInformation;
      }

      const updatedChild = {
        ...children[childIndex],
        otherInformations: [
          {
            ...children[childIndex].otherInformations?.[0],
            [field]: value,
          },
        ],
      };

      children[childIndex] = updatedChild as RegistererInformation;

      return {
        ...prev,
        registererChildformations: children,
      };
    });
  };

  const updateChildInfo = (
    childIndex: number,
    field: string,
    value: string | { year: string; month: string; day: string }
  ) => {
    setFormData((prev) => ({
      ...prev,
      registererChildformations: prev.registererChildformations.map(
        (child, index) =>
          index === childIndex
            ? {
                ...child,
                initialInformations: {
                  ...child.initialInformations,
                  [field]: value,
                },
              }
            : child
      ),
    }));
  };

  const renderStepContent = () => {
    const visibleSteps = getVisibleSteps();
    const currentStepData = visibleSteps[currentStep];

    if (!currentStepData) return null;

    switch (currentStepData.id) {
      case 0:
        return renderFamilyInfoStep();
      case 1:
        return renderRegistererInfoStep();
      case 2:
        return renderPartnerInfoStep();
      case 3:
        return renderChildrenInfoStep();
      default:
        return null;
    }
  };

  const renderFamilyInfoStep = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#FF7A00]/10 to-[#4DBFF0]/10 p-6 rounded-2xl border border-gray-200">
        <h3 className="text-lg font-bold text-[#0A1D37] mb-4 flex items-center gap-3">
          <FaUsers className="text-[#FF7A00]" />
          اطلاعات خانوادگی
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وضعیت تأهل <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="maritalStatus"
                  checked={
                    formData.famillyInformations[0]?.maridgeState === true
                  }
                  onChange={() => updateFamilyInfo("maridgeState", true)}
                  className="text-[#FF7A00] focus:ring-[#FF7A00]"
                  required
                />
                <span>متأهل</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="maritalStatus"
                  checked={
                    formData.famillyInformations[0]?.maridgeState === false
                  }
                  onChange={() => updateFamilyInfo("maridgeState", false)}
                  className="text-[#FF7A00] focus:ring-[#FF7A00]"
                  required
                />
                <span>مجرد</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تعداد فرزندان <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.famillyInformations[0]?.numberOfChildren || 0}
              onChange={(e) =>
                updateFamilyInfo("numberOfChildren", parseInt(e.target.value))
              }
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
              required
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  {num} فرزند
                </option>
              ))}
            </select>
            {validationErrors.numberOfChildren && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.numberOfChildren}
              </p>
            )}
          </div>

          {formData.famillyInformations[0]?.maridgeState && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نحوه ثبت‌نام <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="registrationType"
                    checked={
                      formData.famillyInformations[0]?.towPeopleRegistration ===
                      true
                    }
                    onChange={() =>
                      updateFamilyInfo("towPeopleRegistration", true)
                    }
                    className="text-[#FF7A00] focus:ring-[#FF7A00]"
                    required
                  />
                  <span>ثبت‌نام دو نفره (همراه همسر)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="registrationType"
                    checked={
                      formData.famillyInformations[0]?.towPeopleRegistration ===
                      false
                    }
                    onChange={() =>
                      updateFamilyInfo("towPeopleRegistration", false)
                    }
                    className="text-[#FF7A00] focus:ring-[#FF7A00]"
                    required
                  />
                  <span>ثبت‌نام تک نفره</span>
                </label>
              </div>
              {validationErrors.towPeopleRegistration && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.towPeopleRegistration}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderRegistererInfoStep = () => (
    <div className="space-y-6">
      {/* Initial Informations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-gray-200">
        <h3 className="text-lg font-bold text-[#0A1D37] mb-4 flex items-center gap-3">
          <FaUser className="text-[#FF7A00]" />
          اطلاعات اولیه
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام :
              <span className="text-red-500"> (حتما انگلیسی وارد کنید) *</span>
            </label>
            <input
              type="text"
              placeholder="نام (حتما انگلیسی وارد نمایید)"
              value={
                formData.registererInformations[0]?.initialInformations
                  .firstName || ""
              }
              onChange={(e) =>
                updateRegistererInfo(
                  "initialInformations",
                  "firstName",
                  e.target.value
                )
              }
              className={`w-full p-2 md:p-3 border outline-none rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all ${
                validationErrors.firstName
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              required
            />
            {validationErrors.firstName && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.firstName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام خانوادگی :
              <span className="text-red-500"> (حتما انگلیسی وارد کنید) *</span>
            </label>
            <input
              type="text"
              placeholder="نام خانوادگی (حتما انگلیسی وارد نمایید)"
              value={
                formData.registererInformations[0]?.initialInformations
                  .lastName || ""
              }
              onChange={(e) =>
                updateRegistererInfo(
                  "initialInformations",
                  "lastName",
                  e.target.value
                )
              }
              className={`w-full p-2 md:p-3 border outline-none rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all ${
                validationErrors.lastName ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {validationErrors.lastName && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.lastName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              جنسیت <span className="text-red-500">*</span>
            </label>
            <select
              value={
                formData.registererInformations[0]?.initialInformations
                  .gender || ""
              }
              onChange={(e) =>
                updateRegistererInfo(
                  "initialInformations",
                  "gender",
                  e.target.value
                )
              }
              className={`w-full p-2 md:p-3 border rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] outline-none transition-all ${
                validationErrors.gender ? "border-red-500" : "border-gray-300"
              }`}
              required
            >
              <option value="">انتخاب کنید</option>
              <option value="male">مرد</option>
              <option value="female">زن</option>
            </select>
            {validationErrors.gender && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.gender}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              تاریخ تولد <span className="text-red-500">*</span>
            </label>
            <PersianDatePicker
              value={
                formData.registererInformations[0]?.initialInformations
                  .birthDate
              }
              onChange={(date: { year: string; month: string; day: string }) =>
                updateRegistererInfo("initialInformations", "birthDate", date)
              }
            />
            {(validationErrors.birthYear ||
              validationErrors.birthMonth ||
              validationErrors.birthDay) && (
              <p className="text-red-500 text-xs mt-1">تاریخ تولد الزامی است</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              کشور تولد <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="کشور تولد"
              value={
                formData.registererInformations[0]?.initialInformations
                  .country || ""
              }
              onChange={(e) =>
                updateRegistererInfo(
                  "initialInformations",
                  "country",
                  e.target.value
                )
              }
              className={`w-full p-2 md:p-3 border outline-none rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all ${
                validationErrors.country ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {validationErrors.country && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.country}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              شهر تولد :
              <span className="text-red-500"> (حتما انگلیسی وارد کنید) *</span>
            </label>
            <input
              type="text"
              placeholder="شهر تولد مثلا Tehran "
              value={
                formData.registererInformations[0]?.initialInformations.city ||
                ""
              }
              onChange={(e) =>
                updateRegistererInfo(
                  "initialInformations",
                  "city",
                  e.target.value
                )
              }
              className={`w-full p-2 md:p-3 border outline-none rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all ${
                validationErrors.city ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {validationErrors.city && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.city}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              کشور تابعیت <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="کشور تابعیت"
              value={
                formData.registererInformations[0]?.initialInformations
                  .citizenshipCountry || ""
              }
              onChange={(e) =>
                updateRegistererInfo(
                  "initialInformations",
                  "citizenshipCountry",
                  e.target.value
                )
              }
              className={`w-full p-2 md:p-3 border outline-none rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all ${
                validationErrors.citizenshipCountry
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              required
            />
            {validationErrors.citizenshipCountry && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.citizenshipCountry}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Contact Informations */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-gray-200">
        <h3 className="text-lg font-bold text-[#0A1D37] mb-4 flex items-center gap-3">
          <FaPhone className="text-[#4DBFF0]" />
          اطلاعات تماس
        </h3>

        <div className="grid md:grid-cols-2 items-center gap-4">
          <div className="w-full ">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              شماره موبایل فعال <span className="text-red-500"> *</span>
            </label>
            <input
              type="text"
              placeholder="شماره موبایل فعال "
              value={
                formData.registererInformations[0]?.contactInformations[0]
                  ?.activePhoneNumber || ""
              }
              onChange={(e) =>
                updateRegistererInfo(
                  "contactInformations",
                  "activePhoneNumber",
                  e.target.value
                )
              }
              className="p-3 border w-full outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
            />
          </div>
          <div>
            {" "}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              تکرار شماره موبایل فعال
              <span className="text-red-500"> *</span>
            </label>
            <input
              type="text"
              placeholder="تکرار شماره موبایل فعال"
              value={
                formData.registererInformations[0]?.contactInformations[0]
                  ?.secondaryPhoneNumber || ""
              }
              onChange={(e) =>
                updateRegistererInfo(
                  "contactInformations",
                  "secondaryPhoneNumber",
                  e.target.value
                )
              }
              className="p-3 w-full border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ایمیل
              <span className="text-red-500"> *</span>
            </label>{" "}
            <input
              type="email"
              placeholder="ایمیل"
              value={
                formData.registererInformations[0]?.contactInformations[0]
                  ?.email || ""
              }
              onChange={(e) =>
                updateRegistererInfo(
                  "contactInformations",
                  "email",
                  e.target.value
                )
              }
              className="p-3 w-full border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Residence Information */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-gray-200">
        <h3 className="text-lg font-bold text-[#0A1D37] mb-4 flex items-center gap-3">
          <FaMapMarkerAlt className="text-purple-500" />
          اطلاعات محل سکونت
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              کشور محل سکونت<span className="text-red-500"> *</span>
            </label>
            <input
              type="text"
              placeholder="کشور سکونت"
              value={
                formData.registererInformations[0]?.residanceInformation[0]
                  ?.residanceCountry || ""
              }
              onChange={(e) =>
                updateRegistererInfo(
                  "residanceInformation",
                  "residanceCountry",
                  e.target.value
                )
              }
              className="p-3 w-full border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              شهر محل سکونت<span className="text-red-500"> *</span>
            </label>
            <input
              type="text"
              placeholder="شهر سکونت"
              value={
                formData.registererInformations[0]?.residanceInformation[0]
                  ?.residanceCity || ""
              }
              onChange={(e) =>
                updateRegistererInfo(
                  "residanceInformation",
                  "residanceCity",
                  e.target.value
                )
              }
              className="p-3 w-full border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              استان سکونت<span className="text-red-500"> *</span>
            </label>
            <input
              type="text"
              placeholder="استان سکونت"
              value={
                formData.registererInformations[0]?.residanceInformation[0]
                  ?.residanseState || ""
              }
              onChange={(e) =>
                updateRegistererInfo(
                  "residanceInformation",
                  "residanseState",
                  e.target.value
                )
              }
              className="p-3 w-full border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              کد پستی محل سکونت<span className="text-red-500"> *</span>
            </label>
            <input
              type="text"
              placeholder="کد پستی"
              value={
                formData.registererInformations[0]?.residanceInformation[0]
                  ?.postalCode || ""
              }
              onChange={(e) =>
                updateRegistererInfo(
                  "residanceInformation",
                  "postalCode",
                  e.target.value
                )
              }
              className="p-3 w-full border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
            />
          </div>
          <div className="col-span-2">
            {" "}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              آدرس محل سکونت<span className="text-red-500"> *</span>
            </label>
            <input
              type="text"
              placeholder="آدرس سکونت"
              value={
                formData.registererInformations[0]?.residanceInformation[0]
                  ?.residanseAdress || ""
              }
              onChange={(e) =>
                updateRegistererInfo(
                  "residanceInformation",
                  "residanseAdress",
                  e.target.value
                )
              }
              className="p-3 w-full border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all md:col-span-2"
            />
          </div>
        </div>
      </div>

      {/* Other Informations */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 sm:p-6 rounded-2xl border border-gray-200">
        <h3 className="text-lg font-bold text-[#0A1D37] mb-4 flex items-center gap-3">
          <FaGlobe className="text-orange-500" />
          سایر اطلاعات
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام فارسی<span className="text-red-500"> *</span>
            </label>{" "}
            <input
              type="text"
              placeholder="نام فارسی"
              value={
                formData.registererInformations[0]?.otherInformations[0]
                  ?.persianName || ""
              }
              onChange={(e) =>
                updateRegistererInfo(
                  "otherInformations",
                  "persianName",
                  e.target.value
                )
              }
              className="p-3 w-full border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام خانوادگی فارسی<span className="text-red-500"> *</span>
            </label>
            <input
              type="text"
              placeholder="نام خانوادگی فارسی"
              value={
                formData.registererInformations[0]?.otherInformations[0]
                  ?.persianLastName || ""
              }
              onChange={(e) =>
                updateRegistererInfo(
                  "otherInformations",
                  "persianLastName",
                  e.target.value
                )
              }
              className="p-3 w-full border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              آخرین مدرک تحصیلی<span className="text-red-500"> *</span>
            </label>{" "}
            <select
              value={
                formData.registererInformations[0]?.otherInformations[0]
                  ?.lastDegree || ""
              }
              onChange={(e) =>
                updateRegistererInfo(
                  "otherInformations",
                  "lastDegree",
                  e.target.value
                )
              }
              className="p-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all outline-none"
            >
              <option value="">آخرین مدرک تحصیلی را انتخاب کنید...</option>
              <option value="1">پایین‌تر از دیپلم</option>
              <option value="2">دیپلم فنی حرفه ای یا کاردانش</option>
              <option value="3">دیپلم نظری</option>
              <option value="4">پیش دانشگاهی</option>
              <option value="5">دانشجوی کاردانی</option>
              <option value="6">مدرک کاردانی</option>
              <option value="7">دانشجوی کارشناسی</option>
              <option value="8">مدرک کارشناسی</option>
              <option value="9">دانشجوی کارشناسی ارشد</option>
              <option value="10">مدرک کارشناسی ارشد</option>
              <option value="11">دانشجوی دکتری</option>
              <option value="12">مدرک دکتری</option>
              <option value="13">بالاتر از دکترا</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              وضعیت تابغیت همسر<span className="text-red-500"> *</span>
            </label>
            <select
              value={
                formData.registererInformations[0]?.otherInformations[0]
                  ?.partnerCitizenShip || ""
              }
              onChange={(e) =>
                updateRegistererInfo(
                  "otherInformations",
                  "partnerCitizenShip",
                  e.target.value
                )
              }
              className="p-3 w-full outline-none border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
            >
              <option value="">انتخاب کنید...</option>
              <option value="my spouse is not a resident of america">
                همسر متقاضی، مقیم یا شهروند ایالات متحده نمی‌باشد.
              </option>
              <option value="my spouse live in america">
                همسر متقاضی، مقیم یا شهروند ایالات متحده می‌باشد.
              </option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 mb-4">
              <h4 className="text-base sm:text-lg font-bold text-[#0A1D37] mb-3 flex items-center gap-2">
                📸 شرایط الزامی عکس لاتاری شما
              </h4>
              <div className="space-y-2 text-xs sm:text-sm text-gray-700">
                <p>• باید زاویه مستقیم به دوربین داشته باشید.</p>
                <p>
                  • عکس به شکل مربع و طول 600 پیکسل تا 1200 پیکسل مورد قبول است.
                </p>
                <p>• زمینه عکس باید سفید یا مایل به سفید باشد.</p>
                <p>• عکس باید رنگی باشد و عکس سیاه و سفید مردود است.</p>
                <p>• عکس لاتاری باید بدون عینک و سمعک باشد.</p>
                <p>• موی شما نباید روی صورت شما را بپوشاند.</p>
                <p>• نیازی به معلوم بودن گوش ها نیست.</p>
                <p>
                  • عکس با حجاب هم برای مسلمانان و سایر ادیانی که حجاب در آنها
                  تعریف شده است ممانعتی ندارد.
                </p>
                <p>• گردی صورت باید کاملا واضح باشد و با چیزی پوشانده نشود.</p>
                <p>
                  • نیازی به چاپ عکس ندارید، عکس باید به صورت فایل دیجیتال به
                  شما تحویل داده شود.
                </p>
                <p>
                  • عکس باید مربوط به شش ماه گذشته باشد. نباید سن عکس بیش از 6
                  ماه باشد.
                </p>
                <p>
                  • از عکسی که سال گذشته استفاده کردید نباید مجدد استفاده کنید.
                </p>
              </div>
              <button
                onClick={() => setShowPhotoInfoModal(true)}
                className="mt-6 mx-auto px-6 sm:px-4  py-2 bg-[#0A1D37] text-white rounded-lg hover:bg-[#4DBFF0]/80 transition-colors text-xs sm:text-sm font-medium"
              >
                مشاهده شرایط عکس ارسالی
              </button>
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تصویر شخصی
            </label>
            <div className="space-y-3">
              {/* Image Preview */}
              {formData.registererInformations[0]?.otherInformations[0]
                ?.imageUrl && (
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto">
                  <img
                    src={
                      formData.registererInformations[0]?.otherInformations[0]
                        ?.imageUrl
                    }
                    alt="تصویر شخصی"
                    className="w-full h-full object-cover rounded-xl border-2 border-[#4DBFF0]/30"
                  />
                  <button
                    onClick={() =>
                      updateRegistererInfo("otherInformations", "imageUrl", "")
                    }
                    className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Upload Button */}
              <button
                type="button"
                onClick={() => {
                  setUploadContext({ kind: "registerer" });
                  setShowFileUploader(true);
                }}
                className="w-full p-3 border-2 border-dashed border-[#4DBFF0] bg-[#4DBFF0]/5 rounded-xl hover:bg-[#4DBFF0]/10 transition-all duration-300 flex items-center justify-center gap-2 text-[#4DBFF0] font-medium text-sm"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                {formData.registererInformations[0]?.otherInformations[0]
                  ?.imageUrl
                  ? "تغییر تصویر"
                  : "آپلود تصویر شخصی"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPartnerInfoStep = () => {
    if (!formData.famillyInformations[0]?.maridgeState) return null;

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-2xl border border-gray-200">
          <h3 className="text-lg font-bold text-[#0A1D37] mb-4 flex items-center gap-3">
            <FaIdCard className="text-pink-500" />
            اطلاعات همسر
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نام همسر :
                <span className="text-red-500">
                  {" "}
                  (حتما انگلیسی وارد کنید) *
                </span>
              </label>
              <input
                type="text"
                placeholder="نام همسر"
                value={
                  formData.registererPartnerInformations[0]?.initialInformations
                    .firstName || ""
                }
                onChange={(e) => updatePartnerInfo("firstName", e.target.value)}
                className={`w-full p-2 md:p-3 border rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all ${
                  validationErrors.partnerFirstName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                required
              />
              {validationErrors.partnerFirstName && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.partnerFirstName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نام خانوادگی همسر{" "}
                <span className="text-red-500">
                  {" "}
                  (حتما انگلیسی وارد کنید) *
                </span>
              </label>
              <input
                type="text"
                placeholder="نام خانوادگی همسر"
                value={
                  formData.registererPartnerInformations[0]?.initialInformations
                    .lastName || ""
                }
                onChange={(e) => updatePartnerInfo("lastName", e.target.value)}
                className={`w-full p-2 md:p-3 border rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all ${
                  validationErrors.partnerLastName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                required
              />
              {validationErrors.partnerLastName && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.partnerLastName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                جنسیت همسر <span className="text-red-500">*</span>
              </label>
              <select
                value={
                  formData.registererPartnerInformations[0]?.initialInformations
                    .gender || ""
                }
                onChange={(e) => updatePartnerInfo("gender", e.target.value)}
                className={`w-full p-2 md:p-3 border rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all ${
                  validationErrors.partnerGender
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                required
              >
                <option value="">انتخاب کنید</option>
                <option value="male">مرد</option>
                <option value="female">زن</option>
              </select>
              {validationErrors.partnerGender && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.partnerGender}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تاریخ تولد همسر <span className="text-red-500">*</span>
              </label>
              <PersianDatePicker
                value={
                  formData.registererPartnerInformations[0]?.initialInformations
                    .birthDate
                }
                onChange={(date: {
                  year: string;
                  month: string;
                  day: string;
                }) => updatePartnerInfo("birthDate", date)}
              />
              {(validationErrors.partnerBirthYear ||
                validationErrors.partnerBirthMonth ||
                validationErrors.partnerBirthDay) && (
                <p className="text-red-500 text-xs mt-1">
                  تاریخ تولد الزامی است
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                کشور تولد همسر <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="کشور تولد همسر"
                value={
                  formData.registererPartnerInformations[0]?.initialInformations
                    .country || ""
                }
                onChange={(e) => updatePartnerInfo("country", e.target.value)}
                className={`w-full p-2 md:p-3 border rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all ${
                  validationErrors.partnerCountry
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                required
              />
              {validationErrors.partnerCountry && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.partnerCountry}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                شهر تولد همسر :
                <span className="text-red-500">
                  {" "}
                  (حتما انگلیسی وارد کنید) *
                </span>
              </label>
              <input
                type="text"
                placeholder=" شهر تولد همسر مثلا Tehran"
                value={
                  formData.registererPartnerInformations[0]?.initialInformations
                    .city || ""
                }
                onChange={(e) => updatePartnerInfo("city", e.target.value)}
                className={`w-full p-2 md:p-3 border rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all ${
                  validationErrors.partnerCity
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                required
              />
              {validationErrors.partnerCity && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.partnerCity}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                کشور تابعیت همسر <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="کشور تابعیت همسر"
                value={
                  formData.registererPartnerInformations[0]?.initialInformations
                    .citizenshipCountry || ""
                }
                onChange={(e) =>
                  updatePartnerInfo("citizenshipCountry", e.target.value)
                }
                className={`w-full p-2 md:p-3 border rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all ${
                  validationErrors.partnerCitizenshipCountry
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                required
              />
              {validationErrors.partnerCitizenshipCountry && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.partnerCitizenshipCountry}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Partner Persian Information */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-2xl border border-gray-200">
          <h3 className="text-lg font-bold text-[#0A1D37] mb-4 flex items-center gap-3">
            <FaUser className="text-green-500" />
            اطلاعات فارسی همسر
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نام فارسی همسر <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="نام فارسی همسر"
                value={
                  formData.registererPartnerInformations[0]
                    ?.otherInformations[0]?.persianName || ""
                }
                onChange={(e) =>
                  updatePartnerOtherInfo("persianName", e.target.value)
                }
                className={`w-full p-2 md:p-3 border rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all ${
                  validationErrors.partnerPersianName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                required
              />
              {validationErrors.partnerPersianName && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.partnerPersianName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نام خانوادگی فارسی همسر <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="نام خانوادگی فارسی همسر"
                value={
                  formData.registererPartnerInformations[0]
                    ?.otherInformations[0]?.persianLastName || ""
                }
                onChange={(e) =>
                  updatePartnerOtherInfo("persianLastName", e.target.value)
                }
                className={`w-full p-2 md:p-3 border rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all ${
                  validationErrors.partnerPersianLastName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                required
              />
              {validationErrors.partnerPersianLastName && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.partnerPersianLastName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                آخرین مدرک تحصیلی همسر <span className="text-red-500">*</span>
              </label>
              <select
                value={
                  formData.registererPartnerInformations[0]
                    ?.otherInformations[0]?.lastDegree || ""
                }
                onChange={(e) =>
                  updatePartnerOtherInfo("lastDegree", e.target.value)
                }
                className={`w-full p-2 md:p-3 border rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all ${
                  validationErrors.partnerLastDegree
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                required
              >
                <option value="">آخرین مدرک تحصیلی را انتخاب کنید...</option>
                <option value="1">پایین‌تر از دیپلم</option>
                <option value="2">دیپلم فنی حرفه ای یا کاردانش</option>
                <option value="3">دیپلم نظری</option>
                <option value="4">پیش دانشگاهی</option>
                <option value="5">دانشجوی کاردانی</option>
                <option value="6">مدرک کاردانی</option>
                <option value="7">دانشجوی کارشناسی</option>
                <option value="8">مدرک کارشناسی</option>
                <option value="9">دانشجوی کارشناسی ارشد</option>
                <option value="10">مدرک کارشناسی ارشد</option>
                <option value="11">دانشجوی دکتری</option>
                <option value="12">مدرک دکتری</option>
                <option value="13">بالاتر از دکترا</option>
              </select>
              {validationErrors.partnerLastDegree && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.partnerLastDegree}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 mb-4">
                <h4 className="text-base sm:text-lg font-bold text-[#0A1D37] mb-3 flex items-center gap-2">
                  📸 شرایط الزامی عکس لاتاری همسر
                </h4>
                <div className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <p>• باید زاویه مستقیم به دوربین داشته باشید.</p>
                  <p>
                    • عکس به شکل مربع و طول 600 پیکسل تا 1200 پیکسل مورد قبول
                    است.
                  </p>
                  <p>• زمینه عکس باید سفید یا مایل به سفید باشد.</p>
                  <p>• عکس باید رنگی باشد و عکس سیاه و سفید مردود است.</p>
                  <p>• عکس لاتاری باید بدون عینک و سمعک باشد.</p>
                  <p>• موی شما نباید روی صورت شما را بپوشاند.</p>
                  <p>• نیازی به معلوم بودن گوش ها نیست.</p>
                  <p>
                    • عکس با حجاب هم برای مسلمانان و سایر ادیانی که حجاب در آنها
                    تعریف شده است ممانعتی ندارد.
                  </p>
                  <p>
                    • گردی صورت باید کاملا واضح باشد و با چیزی پوشانده نشود.
                  </p>
                  <p>
                    • نیازی به چاپ عکس ندارید، عکس باید به صورت فایل دیجیتال به
                    شما تحویل داده شود.
                  </p>
                  <p>
                    • عکس باید مربوط به شش ماه گذشته باشد. نباید سن عکس بیش از 6
                    ماه باشد.
                  </p>
                  <p>
                    • از عکسی که سال گذشته استفاده کردید نباید مجدد استفاده
                    کنید.
                  </p>
                </div>
                <button
                  onClick={() => setShowPhotoInfoModal(true)}
                  className="mt-6 mx-auto px-6 sm:px-4  py-2 bg-[#0A1D37] text-white rounded-lg hover:bg-[#4DBFF0]/80 transition-colors text-xs sm:text-sm font-medium"
                >
                  همسر مشاهده شرایط عکس ارسالی
                </button>
              </div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تصویر همسر
              </label>
              <div className="space-y-3">
                {/* Image Preview (partner) */}
                {formData.registererPartnerInformations[0]?.otherInformations[0]
                  ?.imageUrl && (
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto">
                    <img
                      src={
                        formData.registererPartnerInformations[0]
                          ?.otherInformations[0]?.imageUrl
                      }
                      alt="تصویر همسر"
                      className="w-full h-full object-cover rounded-xl border-2 border-[#4DBFF0]/30"
                    />
                    <button
                      onClick={() => updatePartnerOtherInfo("imageUrl", "")}
                      className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                )}

                {/* Upload Button */}
                <button
                  type="button"
                  onClick={() => {
                    setUploadContext({ kind: "partner" });
                    setShowFileUploader(true);
                  }}
                  className="w-full p-3 border-2 border-dashed border-[#4DBFF0] bg-[#4DBFF0]/5 rounded-xl hover:bg-[#4DBFF0]/10 transition-all duration-300 flex items-center justify-center gap-2 text-[#4DBFF0] font-medium text-sm"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  {formData.registererInformations[0]?.otherInformations[0]
                    ?.imageUrl
                    ? "تغییر تصویر"
                    : "آپلود تصویر شخصی"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderChildrenInfoStep = () => {
    if (formData.famillyInformations[0]?.numberOfChildren === 0) return null;

    return (
      <div className="space-y-6">
        {formData.registererChildformations.map((child, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border border-gray-200"
          >
            <h3 className="text-lg font-bold text-[#0A1D37] mb-4 flex items-center gap-3">
              <FaChild className="text-yellow-500" />
              اطلاعات فرزند {index + 1}
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نام فرزند {index + 1}{" "}
                  <span className="text-red-500">
                    {" "}
                    (حتما انگلیسی وارد کنید) *
                  </span>
                </label>
                <input
                  type="text"
                  placeholder={`نام فرزند ${index + 1}`}
                  value={child.initialInformations.firstName || ""}
                  onChange={(e) =>
                    updateChildInfo(index, "firstName", e.target.value)
                  }
                  className="p-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
                />
              </div>
              <div>
                {" "}
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نام خانوادگی فرزند {index + 1}{" "}
                  <span className="text-red-500">
                    {" "}
                    (حتما انگلیسی وارد کنید) *
                  </span>
                </label>
                <input
                  type="text"
                  placeholder={`نام خانوادگی فرزند ${index + 1}`}
                  value={child.initialInformations.lastName || ""}
                  onChange={(e) =>
                    updateChildInfo(index, "lastName", e.target.value)
                  }
                  className="p-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  جنسیت فرزند {index + 1}{" "}
                  <span className="text-red-500">*</span>
                </label>{" "}
                <select
                  value={child.initialInformations.gender || ""}
                  onChange={(e) =>
                    updateChildInfo(index, "gender", e.target.value)
                  }
                  className="p-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
                >
                  <option value="">جنسیت</option>
                  <option value="male">پسر</option>
                  <option value="female">دختر</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تاریخ تولد فرزند {index + 1}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <PersianDatePicker
                  value={child.initialInformations.birthDate}
                  onChange={(date: {
                    year: string;
                    month: string;
                    day: string;
                  }) => updateChildInfo(index, "birthDate", date)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  کشور محل تولد فرزند {index + 1}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="کشور"
                  value={child.initialInformations.country || ""}
                  onChange={(e) =>
                    updateChildInfo(index, "country", e.target.value)
                  }
                  className="p-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  شهر محل تولد فرزند {index + 1}{" "}
                  <span className="text-red-500">
                    * (حتما انگلیسی وارد کنید)
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="شهر"
                  value={child.initialInformations.city || ""}
                  onChange={(e) =>
                    updateChildInfo(index, "city", e.target.value)
                  }
                  className="p-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
                />
              </div>
              <div className="col-span-2">
                {" "}
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تابعیت فرزند {index + 1}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  value={child.initialInformations.citizenshipCountry || ""}
                  onChange={(e) =>
                    updateChildInfo(index, "citizenshipCountry", e.target.value)
                  }
                  className="p-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all md:col-span-2"
                >
                  <option value="">انتخاب کنید...</option>
                  <option value="child_not_american">
                    فرزند مقیم یا شهروند ایالات متحده نمی‌باشد.
                  </option>
                  <option value="child_american">
                    فرزند مقیم یا شهروند ایالات متحده می‌باشد.
                  </option>
                </select>
              </div>
              <div className="space-y-2 col-span-2">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 mb-4">
                  <h4 className="text-base sm:text-lg font-bold text-[#0A1D37] mb-3 flex items-center gap-2">
                    📸 شرایط الزامی عکس لاتاری فرزند
                  </h4>
                  <div className="space-y-2 text-xs sm:text-sm text-gray-700">
                    <p>• باید زاویه مستقیم به دوربین داشته باشید.</p>
                    <p>
                      • عکس به شکل مربع و طول 600 پیکسل تا 1200 پیکسل مورد قبول
                      است.
                    </p>
                    <p>• زمینه عکس باید سفید یا مایل به سفید باشد.</p>
                    <p>• عکس باید رنگی باشد و عکس سیاه و سفید مردود است.</p>
                    <p>• عکس لاتاری باید بدون عینک و سمعک باشد.</p>
                    <p>• موی شما نباید روی صورت شما را بپوشاند.</p>
                    <p>• نیازی به معلوم بودن گوش ها نیست.</p>
                    <p>
                      • عکس با حجاب هم برای مسلمانان و سایر ادیانی که حجاب در
                      آنها تعریف شده است ممانعتی ندارد.
                    </p>
                    <p>
                      • گردی صورت باید کاملا واضح باشد و با چیزی پوشانده نشود.
                    </p>
                    <p>
                      • نیازی به چاپ عکس ندارید، عکس باید به صورت فایل دیجیتال
                      به شما تحویل داده شود.
                    </p>
                    <p>
                      • عکس باید مربوط به شش ماه گذشته باشد. نباید سن عکس بیش از
                      6 ماه باشد.
                    </p>
                    <p>
                      • از عکسی که سال گذشته استفاده کردید نباید مجدد استفاده
                      کنید.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPhotoInfoModal(true)}
                    className="mt-6 mx-auto px-6 sm:px-4  py-2 bg-[#0A1D37] text-white rounded-lg hover:bg-[#4DBFF0]/80 transition-colors text-xs sm:text-sm font-medium"
                  >
                    مشاهده شرایط عکس ارسالی
                  </button>
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تصویر فرزند
                </label>
                {/* Child Image Preview */}
                {formData.registererChildformations[index]?.otherInformations[0]
                  ?.imageUrl && (
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto">
                    <img
                      src={
                        formData.registererChildformations[index]
                          ?.otherInformations[0]?.imageUrl
                      }
                      alt={`تصویر فرزند ${index + 1}`}
                      className="w-full h-full object-cover rounded-xl border-2 border-[#4DBFF0]/30"
                    />
                    <button
                      onClick={() =>
                        updateChildOtherInfo(index, "imageUrl", "")
                      }
                      className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                )}

                {/* Child Upload Button */}
                <button
                  type="button"
                  onClick={() => {
                    setUploadContext({ kind: "child", index });
                    setShowFileUploader(true);
                  }}
                  className="w-full p-3 border-2 border-dashed border-[#4DBFF0] bg-[#4DBFF0]/5 rounded-xl hover:bg-[#4DBFF0]/10 transition-all duration-300 flex items-center justify-center gap-2 text-[#4DBFF0] font-medium text-sm"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  {formData.registererChildformations[index]
                    ?.otherInformations[0]?.imageUrl
                    ? "تغییر تصویر فرزند"
                    : "آپلود تصویر فرزند"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const visibleSteps = getVisibleSteps();
  const isLastStep = currentStep === visibleSteps.length - 1;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-2 sm:p-4"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto mt-28 sm:mt-20 md:mt-28">
        {/* Header */}
        <div className="text-center my-8">
          <h1 className="md:text-3xl text-xl font-bold text-[#0A1D37] mb-4">
            فرم ثبت‌نام آنلاین لاتاری
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            لطفاً تمام اطلاعات مورد نیاز را با دقت تکمیل کنید
          </p>
        </div>

        {/* Steps Progress */}
        <div className="bg-white rounded-2xl p-3 sm:p-6 mb-6 sm:mb-8 shadow-lg border border-gray-200">
          <div className="flex justify-between items-center overflow-x-auto">
            {visibleSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center min-w-0 ${
                  index < visibleSteps.length - 1 ? "flex-1" : ""
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`w-8 h-8 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold transition-all duration-300 ${
                      currentStep >= index
                        ? "bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white shadow-lg"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep > index ? (
                      <FaCheck className="text-xs sm:text-sm" />
                    ) : (
                      <span className="text-xs sm:text-base">{step.icon}</span>
                    )}
                  </div>
                  <div className="text-right hidden sm:block">
                    <p
                      className={`text-xs sm:text-sm font-bold ${
                        currentStep >= index
                          ? "text-[#0A1D37]"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 max-w-[120px] truncate">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < visibleSteps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 sm:mx-4 rounded-full transition-all duration-300 ${
                      currentStep > index
                        ? "bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0]"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white mb-4 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 h-fit ">{renderStepContent()}</div>
        </div>

        {/* Important Information Box */}
        {currentStep === 0 && (
          <div className="bg-gradient-to-r h-80 overflow-auto from-gray-50 to-slate-50 rounded-2xl shadow-lg border border-red-200 p-6 mb-8">
            <div className="space-y-6">
              {/* Important Notice */}
              <div className="bg-red-100 border-r-4 border-red-500 p-4 rounded-lg">
                <h3 className="text-lg font-bold text-red-800 mb-2 flex items-center gap-2">
                  <span className="text-red-600">⚠️</span>
                  توجه مهم
                </h3>
                <p className="text-red-700 leading-relaxed">
                  پس از انجام پرداخت و تکمیل ثبت‌نام، امکان بازگشت وجه (اعم از
                  پرداخت آنلاین، کارت‌به‌کارت و سایر روش‌ها) وجود نخواهد داشت.
                  لطفاً پیش از پرداخت، تمامی اطلاعات را با دقت بررسی نمایید.
                </p>
              </div>

              {/* Services Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#0A1D37] mb-4 flex items-center gap-3">
                  <span className="text-[#FF7A00]">🎯</span>
                  خدمات قابل ارائه
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  با توجه به حساسیت بالای فرآیند درخواست ویزا، ارزی پلاس در ازای
                  پرداخت شما خدمات زیر را ارائه می‌دهد:
                </p>

                <div className="grid gap-3">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <span className="text-green-500 mt-1">✓</span>
                    <p className="text-gray-700">
                      ثبت‌نام دقیق متقاضی در برنامه قرعه‌کشی ویزای تنوع نژادی
                      آمریکا (DV Lottery) که در ایران با نام لاتاری گرین کارت
                      شناخته می‌شود، توسط کارشناسان ارزی پلاس انجام خواهد شد.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <span className="text-green-500 mt-1">✓</span>
                    <p className="text-gray-700">
                      در صورت نیاز، راهنمایی و پشتیبانی تلفنی یا پیامکی برای
                      تکمیل صحیح اطلاعات ارائه می‌شود.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <span className="text-green-500 mt-1">✓</span>
                    <p className="text-gray-700">
                      فرم‌های ثبت‌نام بررسی شده و در صورت وجود نقص یا اشتباه،
                      اصلاح یا راهنمایی لازم ارائه خواهد شد.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <span className="text-green-500 mt-1">✓</span>
                    <p className="text-gray-700">
                      اعلام نتایج لاتاری از طریق پیامک و ایمیل توسط تیم ارزی
                      پلاس انجام می‌گیرد.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <span className="text-green-500 mt-1">✓</span>
                    <p className="text-gray-700">
                      در صورت برنده شدن، با متقاضی تماس گرفته شده و توضیحات لازم
                      برای ادامه مراحل ارائه خواهد شد.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <span className="text-green-500 mt-1">✓</span>
                    <p className="text-gray-700">
                      تمامی اطلاعات ثبت‌نام و نتایج تا پایان دوره مالی مربوطه،
                      برای حفظ امنیت در سرورهای ارزی پلاس نگهداری می‌شود.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <span className="text-blue-500 mt-1">⭐</span>
                    <p className="text-gray-700 font-medium">
                      تجربه و تخصص ارزی پلاس در حوزه مهاجرت به آمریکا، مهم‌ترین
                      ارزش افزوده خدمات ماست؛ با انتخاب ما یک ثبت‌نام اصولی و
                      بدون خطا خواهید داشت.
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#0A1D37] mb-4 flex items-center gap-3">
                  <span className="text-[#4DBFF0]">⏰</span>
                  زمان‌بندی ارائه خدمات
                </h3>
                <div className="grid gap-3">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <span className="text-blue-500 mt-1">📅</span>
                    <p className="text-gray-700">
                      حدود یک ماه پیش از آغاز رسمی برنامه، کارشناسان ارزی پلاس
                      با شما تماس گرفته و ثبت‌نام نهایی در مرکز کنسولی کنتاکی
                      آمریکا انجام خواهد شد.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <span className="text-blue-500 mt-1">📊</span>
                    <p className="text-gray-700">
                      حدود شش ماه پس از ثبت‌نام، با اعلام نتایج رسمی، نتیجه توسط
                      تیم ارزی پلاس بررسی و به شما اطلاع داده می‌شود.
                    </p>
                  </div>
                </div>
              </div>

              {/* Requirements Section - Only show on first step */}
              {visibleSteps[currentStep]?.id === 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#0A1D37] mb-4 flex items-center gap-3">
                    <span className="text-[#FF7A00]">📋</span>
                    شرایط لازم برای شرکت در برنامه
                  </h3>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-green-800 leading-relaxed">
                      تنها شرط ثبت‌نام، داشتن مدرک دیپلم دبیرستان یا حداقل دو
                      سال سابقه کار در پنج سال گذشته است. هیچ محدودیتی از نظر سن
                      یا مدرک زبان وجود ندارد.
                    </p>
                  </div>
                </div>
              )}

              {/* Privacy Section */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#0A1D37] mb-4 flex items-center gap-3">
                  <span className="text-purple-500">🔒</span>
                  حریم خصوصی
                </h3>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-purple-800 leading-relaxed">
                    گروه ارزی پلاس متعهد است که اطلاعات شخصی متقاضیان را به‌صورت
                    محرمانه حفظ کرده و از هرگونه استفاده خارج از چارچوب برنامه
                    لاتاری گرین کارت آمریکا خودداری نماید.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="border-t border-gray-200 p-3 sm:p-6 bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
              <button
                onClick={() => {
                  setCurrentStep(Math.max(0, currentStep - 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                disabled={currentStep === 0}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 ${
                  currentStep === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-500 text-white hover:bg-gray-600 hover:scale-105 active:scale-95"
                }`}
              >
                <FaArrowRight className="text-sm" />
                <span className="text-sm sm:text-base">قبلی</span>
              </button>

              <div className="text-center order-first sm:order-none">
                <p className="text-sm text-gray-600">
                  مرحله {currentStep + 1} از {visibleSteps.length}
                </p>
              </div>

              {isLastStep ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-8 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] text-white hover:shadow-lg hover:scale-105 active:scale-95"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm sm:text-base">
                        در حال ارسال...
                      </span>
                    </>
                  ) : (
                    <>
                      <FaSave className="text-sm" />
                      <span className="text-sm sm:text-base">ثبت نهایی</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  <span className="text-sm sm:text-base">موافقت و ثبت نام</span>
                  <FaArrowLeft className="text-sm" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Selection Modal */}
      {showPaymentSelector && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full">
            <h3 className="text-xl font-bold text-[#0A1D37] mb-4 text-center">
              انتخاب روش پرداخت
            </h3>
            <p className="text-center text-gray-600 mb-6">
              هزینه ثبت‌نام در قرعه‌کشی:{" "}
              <span className="font-bold text-[#FF7A00]">
                {lotteryFee.toLocaleString()} تومان
              </span>
            </p>
            <PaymentMethodSelector
              amount={lotteryFee}
              walletBalance={walletBalance}
              onPaymentMethodSelect={(method) => {
                setShowPaymentSelector(false);
                if (method === "wallet") {
                  handleWalletPayment();
                } else if (method === "direct") {
                  handleDirectPayment();
                } 
              }}
              isWalletEnabled={walletBalance >= lotteryFee}
            />
            <button
              onClick={() => setShowPaymentSelector(false)}
              className="mt-4 w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              انصراف
            </button>
          </div>
        </div>
      )}

      {/* Card Payment Modal */}
      <CardPaymentModal
        isOpen={showCardPaymentModal}
        onClose={() => setShowCardPaymentModal(false)}
        amount={lotteryFee}
        serviceName="ثبت‌نام در قرعه‌کشی"
        onPaymentComplete={async (receiptUrl: string) => {
          await submitLotteryRegistration("card", lotteryFee, receiptUrl);
          setShowCardPaymentModal(false);
          showToast.success("ثبت‌نام در قرعه‌کشی با موفقیت انجام شد");

          // Redirect to dashboard after successful submission
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000); // Wait 2 seconds to show success message
        }}
      />

      {/* File Uploader Modal */}
      <FileUploaderModal
        isOpen={showFileUploader}
        onClose={() => {
          setShowFileUploader(false);
          setUploadContext(null);
        }}
        onFileUploaded={(fileUrl: string) => {
          if (uploadContext?.kind === "partner") {
            updatePartnerOtherInfo("imageUrl", fileUrl);
          } else if (uploadContext?.kind === "child") {
            updateChildOtherInfo(uploadContext.index, "imageUrl", fileUrl);
          } else {
            updateRegistererInfo("otherInformations", "imageUrl", fileUrl);
          }
          setShowFileUploader(false);
          setUploadContext(null);
        }}
        title={
          uploadContext?.kind === "partner"
            ? "آپلود تصویر همسر"
            : uploadContext?.kind === "child"
            ? "آپلود تصویر فرزند"
            : "آپلود تصویر شخصی"
        }
        acceptedTypes={[".jpg", ".jpeg", ".png", ".gif", ".webp"]}
        maxFileSize={5 * 1024 * 1024} // 5MB
      />

      {/* Photo Information Modal */}
      {showPhotoInfoModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto w-full">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#0A1D37]">
                {modalContents.step2.title}
              </h3>
              <button
                onClick={() => setShowPhotoInfoModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-6">{modalContents.step2.content}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LotteryMultiStepForm;
