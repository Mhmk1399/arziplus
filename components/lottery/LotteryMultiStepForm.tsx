"use client";
import React, { useState, useEffect } from "react";
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
  password: string;
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
  const { user: currentUser } = useCurrentUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [showCardPaymentModal, setShowCardPaymentModal] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const lotteryFee = 600000; // 600,000 tomans
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
            password: "",
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
        setWalletBalance(data.balance || 0);
      }
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  };

  // Fetch wallet balance when user loads
  useEffect(() => {
    if (currentUser) {
      fetchWalletBalance();
    }
  }, [currentUser]);

  const handleSubmit = async () => {
    if (!currentUser?.id) {
      showToast.error("لطفاً ابتدا وارد حساب کاربری خود شوید");
      return;
    }

    // Show payment method selection
    setShowPaymentSelector(true);
  };

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

      showToast.success(
        `ثبت‌نام در قرعه‌کشی با موفقیت انجام شد. مبلغ ${lotteryFee.toLocaleString()} تومان از کیف پول کسر گردید.`
      );

      // Update wallet balance
      setWalletBalance((prev) => prev - lotteryFee);
    } catch (error) {
      console.error("Wallet payment error:", error);
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

      // Prepare payment data
      const paymentData = {
        amount: lotteryFee,
        description: `ثبت‌نام در قرعه‌کشی`,
        orderId: `LOTTERY-${Date.now()}`,
        currency: "IRT",
        metadata: {
          mobile: currentUser!.phone,
          order_id: `LOTTERY-${Date.now()}`,
          lotteryData: JSON.stringify(formData),
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
      console.error("Payment request error:", error);
      showToast.error("خطا در اتصال به سرور");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle card payment
  const handleCardPayment = () => {
    setShowCardPaymentModal(true);
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
    setFormData((prev) => ({
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
    }));
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

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وضعیت تأهل
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="maritalStatus"
                  checked={
                    formData.famillyInformations[0]?.maridgeState === true
                  }
                  onChange={() => updateFamilyInfo("maridgeState", true)}
                  className="text-[#FF7A00] focus:ring-[#FF7A00]"
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
                />
                <span>مجرد</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تعداد فرزندان
            </label>
            <select
              value={formData.famillyInformations[0]?.numberOfChildren || 0}
              onChange={(e) =>
                updateFamilyInfo("numberOfChildren", parseInt(e.target.value))
              }
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  {num} فرزند
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={
                  formData.famillyInformations[0]?.towPeopleRegistration ||
                  false
                }
                onChange={(e) =>
                  updateFamilyInfo("towPeopleRegistration", e.target.checked)
                }
                className="text-[#FF7A00] focus:ring-[#FF7A00] rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                ثبت‌نام دو نفره (همراه همسر)
              </span>
            </label>
          </div>
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

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="نام"
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
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
          />
          <input
            type="text"
            placeholder="نام خانوادگی"
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
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
          />
          <select
            value={
              formData.registererInformations[0]?.initialInformations.gender ||
              ""
            }
            onChange={(e) =>
              updateRegistererInfo(
                "initialInformations",
                "gender",
                e.target.value
              )
            }
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
          >
            <option value="">جنسیت</option>
            <option value="male">مرد</option>
            <option value="female">زن</option>
          </select>
          <PersianDatePicker
            value={
              formData.registererInformations[0]?.initialInformations.birthDate
            }
            onChange={(date: { year: string; month: string; day: string }) =>
              updateRegistererInfo("initialInformations", "birthDate", date)
            }
          />
          <input
            type="text"
            placeholder="کشور"
            value={
              formData.registererInformations[0]?.initialInformations.country ||
              ""
            }
            onChange={(e) =>
              updateRegistererInfo(
                "initialInformations",
                "country",
                e.target.value
              )
            }
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
          />
          <input
            type="text"
            placeholder="شهر"
            value={
              formData.registererInformations[0]?.initialInformations.city || ""
            }
            onChange={(e) =>
              updateRegistererInfo(
                "initialInformations",
                "city",
                e.target.value
              )
            }
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
          />
          <input
            type="text"
            placeholder="کشور شهروندی"
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
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all md:col-span-2"
          />
        </div>
      </div>

      {/* Contact Informations */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-gray-200">
        <h3 className="text-lg font-bold text-[#0A1D37] mb-4 flex items-center gap-3">
          <FaPhone className="text-[#4DBFF0]" />
          اطلاعات تماس
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="شماره تلفن اصلی"
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
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
          />
          <input
            type="text"
            placeholder="شماره تلفن ثانویه"
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
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
          />
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
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
          />
          <input
            type="password"
            placeholder="رمز عبور"
            value={
              formData.registererInformations[0]?.contactInformations[0]
                ?.password || ""
            }
            onChange={(e) =>
              updateRegistererInfo(
                "contactInformations",
                "password",
                e.target.value
              )
            }
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
          />
        </div>
      </div>

      {/* Residence Information */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-gray-200">
        <h3 className="text-lg font-bold text-[#0A1D37] mb-4 flex items-center gap-3">
          <FaMapMarkerAlt className="text-purple-500" />
          اطلاعات محل سکونت
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
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
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
          />
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
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
          />
          <input
            type="text"
            placeholder="ایالت سکونت"
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
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
          />
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
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
          />
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
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all md:col-span-2"
          />
        </div>
      </div>

      {/* Other Informations */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl border border-gray-200">
        <h3 className="text-lg font-bold text-[#0A1D37] mb-4 flex items-center gap-3">
          <FaGlobe className="text-orange-500" />
          سایر اطلاعات
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
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
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
          />
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
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
          />
          <input
            type="text"
            placeholder="آخرین مدرک تحصیلی"
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
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
          />
          <input
            type="text"
            placeholder="شهروندی همسر"
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
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
          />
          <input
            type="text"
            placeholder="آدرس تصویر"
            value={
              formData.registererInformations[0]?.otherInformations[0]
                ?.imageUrl || ""
            }
            onChange={(e) =>
              updateRegistererInfo(
                "otherInformations",
                "imageUrl",
                e.target.value
              )
            }
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all md:col-span-2"
          />
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

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="نام همسر"
              value={
                formData.registererPartnerInformations[0]?.initialInformations
                  .firstName || ""
              }
              onChange={(e) => updatePartnerInfo("firstName", e.target.value)}
              className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
            />
            <input
              type="text"
              placeholder="نام خانوادگی همسر"
              value={
                formData.registererPartnerInformations[0]?.initialInformations
                  .lastName || ""
              }
              onChange={(e) => updatePartnerInfo("lastName", e.target.value)}
              className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
            />
            <select
              value={
                formData.registererPartnerInformations[0]?.initialInformations
                  .gender || ""
              }
              onChange={(e) => updatePartnerInfo("gender", e.target.value)}
              className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
            >
              <option value="">جنسیت</option>
              <option value="male">مرد</option>
              <option value="female">زن</option>
            </select>
            <PersianDatePicker
              value={
                formData.registererPartnerInformations[0]?.initialInformations
                  .birthDate
              }
              onChange={(date: { year: string; month: string; day: string }) =>
                updatePartnerInfo("birthDate", date)
              }
            />
            <input
              type="text"
              placeholder="کشور"
              value={
                formData.registererPartnerInformations[0]?.initialInformations
                  .country || ""
              }
              onChange={(e) => updatePartnerInfo("country", e.target.value)}
              className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
            />
            <input
              type="text"
              placeholder="شهر"
              value={
                formData.registererPartnerInformations[0]?.initialInformations
                  .city || ""
              }
              onChange={(e) => updatePartnerInfo("city", e.target.value)}
              className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
            />
            <input
              type="text"
              placeholder="کشور شهروندی"
              value={
                formData.registererPartnerInformations[0]?.initialInformations
                  .citizenshipCountry || ""
              }
              onChange={(e) =>
                updatePartnerInfo("citizenshipCountry", e.target.value)
              }
              className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all md:col-span-2"
            />
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
              <input
                type="text"
                placeholder={`نام فرزند ${index + 1}`}
                value={child.initialInformations.firstName || ""}
                onChange={(e) =>
                  updateChildInfo(index, "firstName", e.target.value)
                }
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
              />
              <input
                type="text"
                placeholder={`نام خانوادگی فرزند ${index + 1}`}
                value={child.initialInformations.lastName || ""}
                onChange={(e) =>
                  updateChildInfo(index, "lastName", e.target.value)
                }
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
              />
              <select
                value={child.initialInformations.gender || ""}
                onChange={(e) =>
                  updateChildInfo(index, "gender", e.target.value)
                }
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
              >
                <option value="">جنسیت</option>
                <option value="male">پسر</option>
                <option value="female">دختر</option>
              </select>
              <PersianDatePicker
                value={child.initialInformations.birthDate}
                onChange={(date: {
                  year: string;
                  month: string;
                  day: string;
                }) => updateChildInfo(index, "birthDate", date)}
              />
              <input
                type="text"
                placeholder="کشور"
                value={child.initialInformations.country || ""}
                onChange={(e) =>
                  updateChildInfo(index, "country", e.target.value)
                }
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
              />
              <input
                type="text"
                placeholder="شهر"
                value={child.initialInformations.city || ""}
                onChange={(e) => updateChildInfo(index, "city", e.target.value)}
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
              />
              <input
                type="text"
                placeholder="کشور شهروندی"
                value={child.initialInformations.citizenshipCountry || ""}
                onChange={(e) =>
                  updateChildInfo(index, "citizenshipCountry", e.target.value)
                }
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all md:col-span-2"
              />
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
      className="min-h-screen bg-gradient-to-br  from-gray-50 via-white to-blue-50 p-4"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto mt-28">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#0A1D37] mb-4">
            فرم ثبت‌نام قرعه‌کشی
          </h1>
          <p className="text-gray-600">
            لطفاً تمام اطلاعات مورد نیاز را با دقت تکمیل کنید
          </p>
        </div>

        {/* Steps Progress */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-200">
          <div className="flex justify-between items-center">
            {visibleSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${
                  index < visibleSteps.length - 1 ? "flex-1" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all duration-300 ${
                      currentStep >= index
                        ? "bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] text-white shadow-lg"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep > index ? (
                      <FaCheck className="text-sm" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-bold ${
                        currentStep >= index
                          ? "text-[#0A1D37]"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 max-w-[120px]">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < visibleSteps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-4 rounded-full transition-all duration-300 ${
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 min-h-[500px]">{renderStepContent()}</div>

          {/* Navigation */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  currentStep === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-500 text-white hover:bg-gray-600 hover:scale-105 active:scale-95"
                }`}
              >
                <FaArrowRight className="text-sm" />
                قبلی
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  مرحله {currentStep + 1} از {visibleSteps.length}
                </p>
              </div>

              {isLastStep ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] text-white hover:shadow-lg hover:scale-105 active:scale-95"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      در حال ارسال...
                    </>
                  ) : (
                    <>
                      <FaSave className="text-sm" />
                      ثبت نهایی
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() =>
                    setCurrentStep(
                      Math.min(visibleSteps.length - 1, currentStep + 1)
                    )
                  }
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  بعدی
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
              هزینه ثبت‌نام در قرعه‌کشی: <span className="font-bold text-[#FF7A00]">{lotteryFee.toLocaleString()} تومان</span>
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
                } else if (method === "card") {
                  handleCardPayment();
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
        }}
      />
    </div>
  );
};

export default LotteryMultiStepForm;
