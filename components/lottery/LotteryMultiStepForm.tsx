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
  const { user: currentUser } = useCurrentUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [showCardPaymentModal, setShowCardPaymentModal] = useState(false);
  const [showFileUploader, setShowFileUploader] = useState(false);
  const [showPhotoInfoModal, setShowPhotoInfoModal] = useState(false);
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
      console.log("Error fetching wallet balance:", error);
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
      console.log("Payment request error:", error);
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
            className="p-3 border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
          />
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
            className="p-3 border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
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
            className="p-3  border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] outline-none transition-all"
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
            className="p-3 border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
          />
          <input
            type="text"
            placeholder="شهر (حتما انگلیسی وارد نمایید)"
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
            className="p-3 border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
          />
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
            className="p-3 border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all md:col-span-2"
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
            className="p-3 border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
          />
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
            className="p-3 border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
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
            className="p-3 border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
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
            className="p-3 border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
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
            className="p-3 border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
          />
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
            className="p-3 border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
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
            className="p-3 border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
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
            className="p-3 border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all md:col-span-2"
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
            className="p-3 border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
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
            className="p-3 border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
          />
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
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all outline-none"
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
            className="p-3 outline-none border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-all"
          >
            <option value="">انتخاب کنید...</option>
            <option value="my spouse is not a resident of america">
              همسر متقاضی، مقیم یا شهروند ایالات متحده نمی‌باشد.
            </option>
            <option value="my spouse live in america">
              همسر متقاضی، مقیم یا شهروند ایالات متحده می‌باشد.
            </option>
          </select>
          <div className="md:col-span-2">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h4 className="text-lg font-bold text-[#0A1D37] mb-3 flex items-center gap-2">
                📸 شرایط الزامی عکس لاتاری شما
              </h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• باید زاویه مستقیم به دوربین داشته باشید.</p>
                <p>• عکس به شکل مربع و طول 600 پیکسل تا 1200 پیکسل مورد قبول است.</p>
                <p>• زمینه عکس باید سفید یا مایل به سفید باشد.</p>
                <p>• عکس باید رنگی باشد و عکس سیاه و سفید مردود است.</p>
                <p>• عکس لاتاری باید بدون عینک و سمعک باشد.</p>
                <p>• موی شما نباید روی صورت شما را بپوشاند.</p>
                <p>• نیازی به معلوم بودن گوش ها نیست.</p>
                <p>• عکس با حجاب هم برای مسلمانان و سایر ادیانی که حجاب در آنها تعریف شده است ممانعتی ندارد.</p>
                <p>• گردی صورت باید کاملا واضح باشد و با چیزی پوشانده نشود.</p>
                <p>• نیازی به چاپ عکس ندارید، عکس باید به صورت فایل دیجیتال به شما تحویل داده شود.</p>
                <p>• عکس باید مربوط به شش ماه گذشته باشد. نباید سن عکس بیش از 6 ماه باشد.</p>
                <p>• از عکسی که سال گذشته استفاده کردید نباید مجدد استفاده کنید.</p>
              </div>
              <button
                onClick={() => setShowPhotoInfoModal(true)}
                className="mt-3 px-4 py-2 bg-[#4DBFF0] text-white rounded-lg hover:bg-[#4DBFF0]/80 transition-colors text-sm font-medium"
              >
                اطلاعات بیشتر
              </button>
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تصویر شخصی
            </label>
            <div className="space-y-3">
              {/* Image Preview */}
              {formData.registererInformations[0]?.otherInformations[0]
                ?.imageUrl && (
                <div className="relative w-32 h-32 mx-auto">
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
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Upload Button */}
              <button
                type="button"
                onClick={() => setShowFileUploader(true)}
                className="w-full p-3 border-2 border-dashed border-[#4DBFF0] bg-[#4DBFF0]/5 rounded-xl hover:bg-[#4DBFF0]/10 transition-all duration-300 flex items-center justify-center gap-2 text-[#4DBFF0] font-medium"
              >
                <svg
                  className="w-5 h-5"
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
                        ? "bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white shadow-lg"
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
        <div className="bg-white mb-4 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 h-fit ">{renderStepContent()}</div>
        </div>

        {/* Important Information Box */}
        <div className="bg-gradient-to-r h-80 overflow-auto from-red-50 to-orange-50 rounded-2xl shadow-lg border border-red-200 p-6 mb-8">
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
                    در صورت نیاز، راهنمایی و پشتیبانی تلفنی یا پیامکی برای تکمیل
                    صحیح اطلاعات ارائه می‌شود.
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
                    اعلام نتایج لاتاری از طریق پیامک و ایمیل توسط تیم ارزی پلاس
                    انجام می‌گیرد.
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
                    ارزش افزوده خدمات ماست؛ با انتخاب ما یک ثبت‌نام اصولی و بدون
                    خطا خواهید داشت.
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
                    حدود یک ماه پیش از آغاز رسمی برنامه، کارشناسان ارزی پلاس با
                    شما تماس گرفته و ثبت‌نام نهایی در مرکز کنسولی کنتاکی آمریکا
                    انجام خواهد شد.
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
                    تنها شرط ثبت‌نام، داشتن مدرک دیپلم دبیرستان یا حداقل دو سال
                    سابقه کار در پنج سال گذشته است. هیچ محدودیتی از نظر سن یا مدرک
                    زبان وجود ندارد.
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

        {/* Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
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
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  موافقت و ثبت نام
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

      {/* File Uploader Modal */}
      <FileUploaderModal
        isOpen={showFileUploader}
        onClose={() => setShowFileUploader(false)}
        onFileUploaded={(fileUrl: string) => {
          updateRegistererInfo("otherInformations", "imageUrl", fileUrl);
          setShowFileUploader(false);
        }}
        title="آپلود تصویر شخصی"
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
            <div className="p-6">
              {modalContents.step2.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LotteryMultiStepForm;
