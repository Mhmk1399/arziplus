"use client";
import React, { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  FaTicketAlt,
  FaEye,
  FaEdit,
  FaSave,
  FaPlus,
  FaClock,
  FaCheck,
  FaTimes,
  FaUser,
  FaChild,
  FaHeart,
  
  FaIdCard,
  FaExclamationTriangle,
  FaCheckCircle,
  FaCreditCard,
  FaMoneyBillWave,
  FaReceipt,
} from "react-icons/fa";
import { showToast } from "@/utilities/toast";

interface LotteryRegistration {
  _id: string;
  status: "pending" | "in_review" | "approved" | "rejected" | "completed";
  rejectionReason?: string;
  adminNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: {
    _id: string;
    nationalCredentials?: {
      firstName?: string;
      lastName?: string;
    };
  };
  famillyInformations: Array<{
    maridgeState: boolean;
    numberOfChildren: number;
    towPeopleRegistration: boolean;
  }>;
  // Payment information
  paymentMethod?: "card" | "direct" | "wallet";
  paymentAmount?: number;
  paymentDate?: string;
  receiptUrl?: string;
  authority?: string;
  refId?: string;
  isPaid?: boolean;
  registererInformations: Array<{
    initialInformations: {
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
    };
    residanceInformation: Array<{
      residanceCountry: string;
      residanceCity: string;
      residanseState: string;
      postalCode: string;
      residanseAdress: string;
    }>;
    contactInformations: Array<{
      activePhoneNumber: string;
      secondaryPhoneNumber: string;
      email: string;
      password: string;
    }>;
    otherInformations: Array<{
      persianName: string;
      persianLastName: string;
      lastDegree: string;
      partnerCitizenShip: string;
      imageUrl: string;
    }>;
  }>;
  registererPartnerInformations: Array<{
    initialInformations: {
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
    };
    otherInformations: Array<{
      persianName: string;
      persianLastName: string;
      lastDegree: string;
      partnerCitizenShip: string;
      imageUrl: string;
    }>;
  }>;
  registererChildformations: Array<{
    initialInformations: {
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
    };
    otherInformations: Array<{
      persianName: string;
      persianLastName: string;
      lastDegree: string;
      partnerCitizenShip: string;
      imageUrl: string;
    }>;
  }>;
}

interface LotteryStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
}

const CustomerLotteryList = () => {
  const { user: currentUser, isLoggedIn } = useCurrentUser();
  const [lotteries, setLotteries] = useState<LotteryRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLottery, setSelectedLottery] =
    useState<LotteryRegistration | null>(null);
  const [showLotteryDetails, setShowLotteryDetails] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<LotteryRegistration | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [stats, setStats] = useState<LotteryStats>({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
  });

  // Fetch user's lottery registrations
  const fetchLotteries = async () => {
    if (!isLoggedIn || !currentUser) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/lottery?userId=${currentUser.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("خطا در دریافت اطلاعات ثبت‌نام‌ها");
      }

      const data = await response.json();
      setLotteries(data.data || []);

      // Calculate stats
      const userLotteries = data.data || [];
      setStats({
        totalRequests: userLotteries.length,
        pendingRequests: userLotteries.filter(
          (l: LotteryRegistration) => l.status === "pending"
        ).length,
        approvedRequests: userLotteries.filter(
          (l: LotteryRegistration) =>
            l.status === "approved" || l.status === "completed"
        ).length,
        rejectedRequests: userLotteries.filter(
          (l: LotteryRegistration) => l.status === "rejected"
        ).length,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای نامشخص");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchLotteries();
    }
  }, [isLoggedIn, currentUser]);

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-orange-700 bg-orange-100 border-orange-300";
      case "in_review":
        return "text-blue-700 bg-blue-100 border-blue-300";
      case "approved":
        return "text-green-700 bg-green-100 border-green-300";
      case "rejected":
        return "text-red-700 bg-red-100 border-red-300";
      case "completed":
        return "text-purple-700 bg-purple-100 border-purple-300";
      default:
        return "text-gray-700 bg-gray-100 border-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "در انتظار بررسی";
      case "in_review":
        return "در حال بررسی";
      case "approved":
        return "تایید شده";
      case "rejected":
        return "رد شده";
      case "completed":
        return "تکمیل شده";
      default:
        return "نامشخص";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <FaClock className="text-sm" />;
      case "in_review":
        return <FaClock className="text-sm" />;
      case "approved":
      case "completed":
        return <FaCheck className="text-sm" />;
      case "rejected":
        return <FaTimes className="text-sm" />;
      default:
        return <FaClock className="text-sm" />;
    }
  };

  const openLotteryDetails = (lottery: LotteryRegistration) => {
    setSelectedLottery(lottery);
    setShowLotteryDetails(true);
    setIsEditMode(false);
  };

  const startEdit = (lottery: LotteryRegistration) => {
    setEditData({ ...lottery });
    setIsEditMode(true);
  };

  const cancelEdit = () => {
    setEditData(null);
    setIsEditMode(false);
  };

  const saveEdit = async () => {
    if (!editData || !currentUser) {
      showToast.error("خطا در ذخیره اطلاعات");
      return;
    }

    setIsUpdating(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/lottery", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: editData._id,
          famillyInformations: editData.famillyInformations,
          registererInformations: editData.registererInformations,
          registererPartnerInformations: editData.registererPartnerInformations,
          registererChildformations: editData.registererChildformations,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "خطا در به‌روزرسانی اطلاعات");
      }

      showToast.success("اطلاعات با موفقیت به‌روزرسانی شد");
      setSelectedLottery(result.data);
      setIsEditMode(false);
      await fetchLotteries(); // Refresh the list
    } catch (error) {
      console.log("Update error:", error);
      showToast.error(
        error instanceof Error ? error.message : "خطا در به‌روزرسانی"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8" dir="rtl">
      {/* Stats Cards - Improved Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-blue-600 text-xs sm:text-sm font-medium">
                کل درخواست‌ها
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-900">
                {stats.totalRequests}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <FaTicketAlt className="text-blue-500 text-xl sm:text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-orange-600 text-xs sm:text-sm font-medium">
                در انتظار
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-orange-900">
                {stats.pendingRequests}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
              <FaClock className="text-orange-500 text-xl sm:text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-green-600 text-xs sm:text-sm font-medium">
                تایید شده
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-green-900">
                {stats.approvedRequests}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <FaCheckCircle className="text-green-500 text-xl sm:text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-red-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-red-600 text-xs sm:text-sm font-medium">
                رد شده
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-red-900">
                {stats.rejectedRequests}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
              <FaTimes className="text-red-500 text-xl sm:text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Lottery Registrations List */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0A1D37]/20 border-t-[#0A1D37] mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            در حال بارگذاری اطلاعات...
          </p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8 sm:p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <FaExclamationTriangle className="text-3xl text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-red-700">خطا در بارگذاری</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => fetchLotteries()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            تلاش مجدد
          </button>
        </div>
      ) : lotteries.length === 0 ? (
        <div className=" rounded-2xl  p-8 sm:p-16 text-center space-y-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-[#0A1D37]/10 to-[#4DBFF0]/10 rounded-full flex items-center justify-center mx-auto">
            <FaTicketAlt className="text-4xl sm:text-5xl text-gray-400" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0A1D37]">
              هنوز ثبت‌نامی ندارید
            </h3>
            <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              برای شرکت در قرعه‌کشی گرین کارت آمریکا، اولین ثبت‌نام خود را انجام
              دهید
            </p>
          </div>
          <a
            href="/lottery/form"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
          >
            <FaPlus className="text-lg" />
            شروع ثبت‌نام
          </a>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-5">
          {lotteries.map((lottery) => (
            <div
              key={lottery._id}
              className="group bg-white rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
            >
              <div className="bg-gradient-to-r from-[#0A1D37]/5 to-[#4DBFF0]/5 px-5 sm:px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="text-xs sm:text-lg font-bold text-[#0A1D37] group-hover:text-[#4DBFF0] transition-colors">
                        ثبت نام لاتاری گرین کارت
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(lottery.submittedAt).toLocaleDateString(
                          "fa-IR"
                        )}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-nowrap text-xs sm:text-sm font-semibold ${getStatusColor(
                      lottery.status
                    )}`}
                  >
                    {getStatusIcon(lottery.status)}
                    {getStatusText(lottery.status)}
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <FaHeart
                      className={`text-lg flex-shrink-0 ${
                        lottery.famillyInformations[0]?.maridgeState
                          ? "text-pink-500"
                          : "text-gray-400"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">وضعیت تأهل</p>
                      <p className="font-semibold text-[#0A1D37] text-sm">
                        {lottery.famillyInformations[0]?.maridgeState
                          ? "متأهل"
                          : "مجرد"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <FaChild className="text-blue-500 text-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">
                        تعداد فرزندان
                      </p>
                      <p className="font-semibold text-[#0A1D37] text-sm">
                        {lottery.famillyInformations[0]?.numberOfChildren || 0}{" "}
                        نفر
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <FaUser className="text-[#4DBFF0] text-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">
                        ثبت نام دو نفره
                      </p>
                      <p className="font-semibold text-[#0A1D37] text-sm">
                        {lottery.famillyInformations[0]?.towPeopleRegistration
                          ? "بله"
                          : "خیر"}
                      </p>
                    </div>
                  </div>
                </div>

                {lottery.status === "rejected" && lottery.rejectionReason && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl mb-4">
                    <div className="flex items-start gap-3">
                      <FaExclamationTriangle className="text-red-500 text-lg flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-bold text-red-900 text-sm mb-2">
                          دلیل رد
                        </p>
                        <p className="text-red-700 text-sm leading-relaxed">
                          {lottery.rejectionReason}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {lottery.adminNotes && (
                  <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl mb-4">
                    <div className="flex items-start gap-3">
                      <FaIdCard className="text-blue-500 text-lg flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-bold text-blue-900 text-sm mb-2">
                          یادداشت مدیر
                        </p>
                        <p className="text-blue-700 text-sm leading-relaxed">
                          {lottery.adminNotes}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => openLotteryDetails(lottery)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white font-bold rounded-xl hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 text-sm"
                  >
                    <FaEye className="text-base" />
                    مشاهده جزئیات
                  </button>
                  <button
                    onClick={() => {
                      openLotteryDetails(lottery);
                      startEdit(lottery);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 text-sm"
                  >
                    <FaEdit className="text-base" />
                    ویرایش
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lottery Details Modal - Enhanced */}
      {showLotteryDetails && selectedLottery && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl border-2 border-[#0A1D37]/20 animate-in zoom-in duration-300">
            {/* Modal Header - Fixed */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-5 sm:p-6 lg:p-8 border-b bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                  <FaTicketAlt className="text-white text-lg sm:text-xl" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0A1D37]">
                    {isEditMode
                      ? "ویرایش ثبت‌نام لاتاری"
                      : "جزئیات ثبت‌نام لاتاری"}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                    کد پیگیری: {selectedLottery._id.slice(-8)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Edit Mode Controls */}
                <>
                  {isEditMode ? (
                    <>
                      <button
                        onClick={saveEdit}
                        disabled={isUpdating}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 text-sm"
                      >
                        <FaSave className="text-sm" />
                        {isUpdating ? "در حال ذخیره..." : "ذخیره"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={isUpdating}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 text-sm"
                      >
                        <FaTimes className="text-sm" />
                        انصراف
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEdit(selectedLottery)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#0A1D37] text-white rounded-lg hover:bg-[#0A1D37]/90 transition-colors text-sm"
                    >
                      <FaEdit className="text-sm" />
                      ویرایش
                    </button>
                  )}
                </>
                <button
                  onClick={() => {
                    setShowLotteryDetails(false);
                    setIsEditMode(false);
                    setEditData(null);
                  }}
                  className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-red-50 rounded-xl transition-colors text-gray-500 hover:text-red-600 border border-transparent hover:border-red-200"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-5 sm:p-6 mb-12 lg:p-8 space-y-5 sm:space-y-6 overflow-y-auto max-h-[calc(95vh-180px)] custom-scrollbar">
              {/* Status Section */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 border-2 border-gray-200">
                <h3 className="text-base sm:text-lg font-bold text-[#0A1D37] mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#0A1D37] rounded-full animate-pulse"></div>
                  وضعیت درخواست
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">
                      وضعیت فعلی
                    </p>
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-bold rounded-full border ${getStatusColor(
                        selectedLottery.status
                      )}`}
                    >
                      {getStatusIcon(selectedLottery.status)}
                      {getStatusText(selectedLottery.status)}
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">
                      تاریخ ثبت‌نام
                    </p>
                    <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                      {new Date(selectedLottery.submittedAt).toLocaleDateString(
                        "fa-IR"
                      )}
                    </p>
                  </div>
                  {selectedLottery.reviewedAt && (
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <p className="text-xs sm:text-sm text-gray-600 mb-2">
                        تاریخ بررسی
                      </p>
                      <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                        {new Date(
                          selectedLottery.reviewedAt
                        ).toLocaleDateString("fa-IR")}
                      </p>
                    </div>
                  )}
                </div>

                {selectedLottery.rejectionReason && (
                  <div className="mt-4 p-4 bg-red-50 border-r-4 border-red-500 rounded-lg">
                    <p className="text-xs sm:text-sm text-red-700 font-semibold mb-1">
                      دلیل رد:
                    </p>
                    <p className="text-sm sm:text-base text-red-600 leading-relaxed">
                      {selectedLottery.rejectionReason}
                    </p>
                  </div>
                )}

                {selectedLottery.adminNotes && (
                  <div className="mt-4 p-4 bg-blue-50 border-r-4 border-blue-500 rounded-lg">
                    <p className="text-xs sm:text-sm text-blue-700 font-semibold mb-1">
                      یادداشت مدیر:
                    </p>
                    <p className="text-sm sm:text-base text-blue-600 leading-relaxed">
                      {selectedLottery.adminNotes}
                    </p>
                  </div>
                )}
              </div>

              {/* Payment Information */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 border-2 border-green-200">
                <h3 className="text-base sm:text-lg font-bold text-[#0A1D37] mb-4 flex items-center gap-2">
                  <FaCreditCard className="text-green-500 text-xl" />
                  اطلاعات پرداخت
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-green-200">
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">
                      وضعیت پرداخت
                    </p>
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-bold rounded-full border ${
                        selectedLottery.isPaid
                          ? "text-green-700 bg-green-100 border-green-300"
                          : "text-red-700 bg-red-100 border-red-300"
                      }`}
                    >
                      {selectedLottery.isPaid ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                      {selectedLottery.isPaid ? "پرداخت شده" : "پرداخت نشده"}
                    </span>
                  </div>

                  {selectedLottery.paymentMethod && (
                    <div className="bg-white p-4 rounded-xl border border-green-200">
                      <p className="text-xs sm:text-sm text-gray-600 mb-2">
                        روش پرداخت
                      </p>
                      <div className="flex items-center gap-2">
                        {selectedLottery.paymentMethod === "card" ? (
                          <FaCreditCard className="text-blue-500 text-lg" />
                        ) : selectedLottery.paymentMethod === "wallet" ? (
                          <FaMoneyBillWave className="text-purple-500 text-lg" />
                        ) : (
                          <FaMoneyBillWave className="text-green-500 text-lg" />
                        )}
                        <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                          {selectedLottery.paymentMethod === "card"
                            ? "کارت به کارت"
                            : selectedLottery.paymentMethod === "wallet"
                            ? "پرداخت از کیف پول"
                            : "پرداخت مستقیم (زرین‌پال)"}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedLottery.paymentAmount && (
                    <div className="bg-white p-4 rounded-xl border border-green-200">
                      <p className="text-xs sm:text-sm text-gray-600 mb-2">
                        مبلغ پرداخت
                      </p>
                      <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                        {selectedLottery.paymentAmount.toLocaleString("fa-IR")}{" "}
                        تومان
                      </p>
                    </div>
                  )}

                  {selectedLottery.paymentDate && (
                    <div className="bg-white p-4 rounded-xl border border-green-200">
                      <p className="text-xs sm:text-sm text-gray-600 mb-2">
                        تاریخ پرداخت
                      </p>
                      <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                        {new Date(
                          selectedLottery.paymentDate
                        ).toLocaleDateString("fa-IR")}
                      </p>
                    </div>
                  )}

                  {selectedLottery.authority && (
                    <div className="bg-white p-4 rounded-xl border border-green-200">
                      <p className="text-xs sm:text-sm text-gray-600 mb-2">
                        شناسه پرداخت
                      </p>
                      <p className="text-sm sm:text-base font-bold text-[#0A1D37] font-mono break-all">
                        {selectedLottery.authority}
                      </p>
                    </div>
                  )}

                  {selectedLottery.refId && (
                    <div className="bg-white p-4 rounded-xl border border-green-200">
                      <p className="text-xs sm:text-sm text-gray-600 mb-2">
                        شماره پیگیری
                      </p>
                      <p className="text-sm sm:text-base font-bold text-[#0A1D37] font-mono break-all">
                        {selectedLottery.refId}
                      </p>
                    </div>
                  )}
                </div>

                {/* Payment Receipt Image */}
                {selectedLottery.receiptUrl && (
                  <div className="mt-4">
                    <p className="text-sm sm:text-base text-gray-700 mb-3 flex items-center gap-2 font-semibold">
                      <FaReceipt className="text-blue-500 text-lg" />
                      رسید پرداخت
                    </p>
                    <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
                      <img
                        src={selectedLottery.receiptUrl}
                        alt="رسید پرداخت"
                        className="max-w-full h-auto max-h-64 sm:max-h-80 rounded-lg border-2 border-gray-200 cursor-pointer hover:opacity-90 transition-opacity shadow-md"
                        onClick={() =>
                          window.open(selectedLottery.receiptUrl, "_blank")
                        }
                        onError={(e) => {
                          console.log(
                            "Error loading receipt image:",
                            selectedLottery.receiptUrl
                          );
                          (e.target as HTMLImageElement).style.display = "none";
                          const errorDiv = document.createElement("div");
                          errorDiv.innerHTML =
                            '<p class="text-red-500 text-sm">خطا در بارگذاری تصویر</p>';
                          (
                            e.target as HTMLImageElement
                          ).parentNode?.appendChild(errorDiv);
                        }}
                        onLoad={() =>
                          console.log("Receipt image loaded successfully")
                        }
                      />
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-xs sm:text-sm text-gray-500">
                          کلیک کنید برای مشاهده تمام صفحه
                        </p>
                        <button
                          onClick={() =>
                            window.open(selectedLottery.receiptUrl, "_blank")
                          }
                          className="text-xs sm:text-sm text-[#0A1D37] hover:text-[#0A1D37]/80 font-semibold bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg transition-colors"
                        >
                          مشاهده اصل تصویر
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Family Information */}
              <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 border-2 border-pink-200">
                <h3 className="text-base sm:text-lg font-bold text-[#0A1D37] mb-4 flex items-center gap-2">
                  <FaHeart className="text-pink-500 text-xl" />
                  اطلاعات خانوادگی
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-pink-200">
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">
                      وضعیت تأهل
                    </p>
                    {isEditMode && editData ? (
                      <div className="flex gap-2">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="maritalStatus"
                            checked={
                              editData.famillyInformations[0]?.maridgeState ===
                              true
                            }
                            onChange={() => {
                              const newEditData = { ...editData };
                              newEditData.famillyInformations[0].maridgeState =
                                true;
                              setEditData(newEditData);
                            }}
                            className="text-[#0A1D37] focus:ring-[#0A1D37] text-sm"
                          />
                          <span className="text-sm">متأهل</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="maritalStatus"
                            checked={
                              editData.famillyInformations[0]?.maridgeState ===
                              false
                            }
                            onChange={() => {
                              const newEditData = { ...editData };
                              newEditData.famillyInformations[0].maridgeState =
                                false;
                              setEditData(newEditData);
                            }}
                            className="text-[#0A1D37] focus:ring-[#0A1D37] text-sm"
                          />
                          <span className="text-sm">مجرد</span>
                        </label>
                      </div>
                    ) : (
                      <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                        {selectedLottery.famillyInformations[0]?.maridgeState
                          ? "متأهل"
                          : "مجرد"}
                      </p>
                    )}
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-pink-200">
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">
                      تعداد فرزندان
                    </p>
                    {isEditMode && editData ? (
                      <select
                        value={
                          editData.famillyInformations[0]?.numberOfChildren || 0
                        }
                        onChange={(e) => {
                          const newEditData = { ...editData };
                          newEditData.famillyInformations[0].numberOfChildren =
                            parseInt(e.target.value);
                          setEditData(newEditData);
                        }}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                      >
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                        {selectedLottery.famillyInformations[0]
                          ?.numberOfChildren || 0}
                      </p>
                    )}
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-pink-200">
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">
                      ثبت نام دو نفره
                    </p>
                    <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                      {selectedLottery.famillyInformations[0]
                        ?.towPeopleRegistration
                        ? "بله"
                        : "خیر"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Registerer Information */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 border-2 border-blue-200">
                <h3 className="text-base sm:text-lg font-bold text-[#0A1D37] mb-4 flex items-center gap-2">
                  <FaUser className="text-blue-500 text-xl" />
                  اطلاعات ثبت کننده
                </h3>
                {selectedLottery.registererInformations[0] && (
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">اطلاعات اولیه</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-blue-200">
                          <p className="text-xs sm:text-sm text-gray-600 mb-2">نام</p>
                          {isEditMode && editData ? (
                            <input
                              type="text"
                              value={editData.registererInformations[0]?.initialInformations?.firstName || ''}
                              onChange={(e) => {
                                const newEditData = { ...editData };
                                if (newEditData.registererInformations[0]?.initialInformations) {
                                  newEditData.registererInformations[0].initialInformations.firstName = e.target.value;
                                  setEditData(newEditData);
                                }
                              }}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                            />
                          ) : (
                            <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                              {selectedLottery.registererInformations[0].initialInformations.firstName}
                            </p>
                          )}
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-blue-200">
                          <p className="text-xs sm:text-sm text-gray-600 mb-2">نام خانوادگی</p>
                          {isEditMode && editData ? (
                            <input
                              type="text"
                              value={editData.registererInformations[0]?.initialInformations?.lastName || ''}
                              onChange={(e) => {
                                const newEditData = { ...editData };
                                if (newEditData.registererInformations[0]?.initialInformations) {
                                  newEditData.registererInformations[0].initialInformations.lastName = e.target.value;
                                  setEditData(newEditData);
                                }
                              }}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                            />
                          ) : (
                            <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                              {selectedLottery.registererInformations[0].initialInformations.lastName}
                            </p>
                          )}
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-blue-200">
                          <p className="text-xs sm:text-sm text-gray-600 mb-2">جنسیت</p>
                          {isEditMode && editData ? (
                            <select
                              value={editData.registererInformations[0]?.initialInformations?.gender || 'male'}
                              onChange={(e) => {
                                const newEditData = { ...editData };
                                if (newEditData.registererInformations[0]?.initialInformations) {
                                  newEditData.registererInformations[0].initialInformations.gender = e.target.value;
                                  setEditData(newEditData);
                                }
                              }}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                            >
                              <option value="male">مرد</option>
                              <option value="female">زن</option>
                            </select>
                          ) : (
                            <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                              {selectedLottery.registererInformations[0].initialInformations.gender === 'male' ? 'مرد' : 'زن'}
                            </p>
                          )}
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-blue-200">
                          <p className="text-xs sm:text-sm text-gray-600 mb-2">تاریخ تولد</p>
                          {isEditMode && editData ? (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="سال"
                                value={editData.registererInformations[0]?.initialInformations?.birthDate?.year || ''}
                                onChange={(e) => {
                                  const newEditData = { ...editData };
                                  if (newEditData.registererInformations[0]?.initialInformations?.birthDate) {
                                    newEditData.registererInformations[0].initialInformations.birthDate.year = e.target.value;
                                    setEditData(newEditData);
                                  }
                                }}
                                className="flex-1 p-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#0A1D37]"
                              />
                              <input
                                type="text"
                                placeholder="ماه"
                                value={editData.registererInformations[0]?.initialInformations?.birthDate?.month || ''}
                                onChange={(e) => {
                                  const newEditData = { ...editData };
                                  if (newEditData.registererInformations[0]?.initialInformations?.birthDate) {
                                    newEditData.registererInformations[0].initialInformations.birthDate.month = e.target.value;
                                    setEditData(newEditData);
                                  }
                                }}
                                className="flex-1 p-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#0A1D37]"
                              />
                              <input
                                type="text"
                                placeholder="روز"
                                value={editData.registererInformations[0]?.initialInformations?.birthDate?.day || ''}
                                onChange={(e) => {
                                  const newEditData = { ...editData };
                                  if (newEditData.registererInformations[0]?.initialInformations?.birthDate) {
                                    newEditData.registererInformations[0].initialInformations.birthDate.day = e.target.value;
                                    setEditData(newEditData);
                                  }
                                }}
                                className="flex-1 p-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#0A1D37]"
                              />
                            </div>
                          ) : (
                            <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                              {selectedLottery.registererInformations[0].initialInformations.birthDate.year}/
                              {selectedLottery.registererInformations[0].initialInformations.birthDate.month}/
                              {selectedLottery.registererInformations[0].initialInformations.birthDate.day}
                            </p>
                          )}
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-blue-200">
                          <p className="text-xs sm:text-sm text-gray-600 mb-2">کشور</p>
                          {isEditMode && editData ? (
                            <input
                              type="text"
                              value={editData.registererInformations[0]?.initialInformations?.country || ''}
                              onChange={(e) => {
                                const newEditData = { ...editData };
                                if (newEditData.registererInformations[0]?.initialInformations) {
                                  newEditData.registererInformations[0].initialInformations.country = e.target.value;
                                  setEditData(newEditData);
                                }
                              }}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                            />
                          ) : (
                            <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                              {selectedLottery.registererInformations[0].initialInformations.country}
                            </p>
                          )}
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-blue-200">
                          <p className="text-xs sm:text-sm text-gray-600 mb-2">شهر</p>
                          {isEditMode && editData ? (
                            <input
                              type="text"
                              value={editData.registererInformations[0]?.initialInformations?.city || ''}
                              onChange={(e) => {
                                const newEditData = { ...editData };
                                if (newEditData.registererInformations[0]?.initialInformations) {
                                  newEditData.registererInformations[0].initialInformations.city = e.target.value;
                                  setEditData(newEditData);
                                }
                              }}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                            />
                          ) : (
                            <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                              {selectedLottery.registererInformations[0].initialInformations.city}
                            </p>
                          )}
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-blue-200">
                          <p className="text-xs sm:text-sm text-gray-600 mb-2">کشور شهروندی</p>
                          {isEditMode && editData ? (
                            <input
                              type="text"
                              value={editData.registererInformations[0]?.initialInformations?.citizenshipCountry || ''}
                              onChange={(e) => {
                                const newEditData = { ...editData };
                                if (newEditData.registererInformations[0]?.initialInformations) {
                                  newEditData.registererInformations[0].initialInformations.citizenshipCountry = e.target.value;
                                  setEditData(newEditData);
                                }
                              }}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                            />
                          ) : (
                            <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                              {selectedLottery.registererInformations[0].initialInformations.citizenshipCountry}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Residence Information */}
                    {selectedLottery.registererInformations[0].residanceInformation?.[0] && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">اطلاعات محل سکونت</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="bg-white p-4 rounded-xl border border-blue-200">
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">کشور سکونت</p>
                            {isEditMode && editData ? (
                              <input
                                type="text"
                                value={editData.registererInformations[0]?.residanceInformation?.[0]?.residanceCountry || ''}
                                onChange={(e) => {
                                  const newEditData = { ...editData };
                                  if (newEditData.registererInformations[0]?.residanceInformation?.[0]) {
                                    newEditData.registererInformations[0].residanceInformation[0].residanceCountry = e.target.value;
                                    setEditData(newEditData);
                                  }
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                              />
                            ) : (
                              <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                                {selectedLottery.registererInformations[0].residanceInformation[0].residanceCountry}
                              </p>
                            )}
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-blue-200">
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">شهر سکونت</p>
                            {isEditMode && editData ? (
                              <input
                                type="text"
                                value={editData.registererInformations[0]?.residanceInformation?.[0]?.residanceCity || ''}
                                onChange={(e) => {
                                  const newEditData = { ...editData };
                                  if (newEditData.registererInformations[0]?.residanceInformation?.[0]) {
                                    newEditData.registererInformations[0].residanceInformation[0].residanceCity = e.target.value;
                                    setEditData(newEditData);
                                  }
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                              />
                            ) : (
                              <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                                {selectedLottery.registererInformations[0].residanceInformation[0].residanceCity}
                              </p>
                            )}
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-blue-200">
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">استان</p>
                            {isEditMode && editData ? (
                              <input
                                type="text"
                                value={editData.registererInformations[0]?.residanceInformation?.[0]?.residanseState || ''}
                                onChange={(e) => {
                                  const newEditData = { ...editData };
                                  if (newEditData.registererInformations[0]?.residanceInformation?.[0]) {
                                    newEditData.registererInformations[0].residanceInformation[0].residanseState = e.target.value;
                                    setEditData(newEditData);
                                  }
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                              />
                            ) : (
                              <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                                {selectedLottery.registererInformations[0].residanceInformation[0].residanseState}
                              </p>
                            )}
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-blue-200">
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">کد پستی</p>
                            {isEditMode && editData ? (
                              <input
                                type="text"
                                value={editData.registererInformations[0]?.residanceInformation?.[0]?.postalCode || ''}
                                onChange={(e) => {
                                  const newEditData = { ...editData };
                                  if (newEditData.registererInformations[0]?.residanceInformation?.[0]) {
                                    newEditData.registererInformations[0].residanceInformation[0].postalCode = e.target.value;
                                    setEditData(newEditData);
                                  }
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                              />
                            ) : (
                              <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                                {selectedLottery.registererInformations[0].residanceInformation[0].postalCode}
                              </p>
                            )}
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-blue-200 sm:col-span-2">
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">آدرس</p>
                            {isEditMode && editData ? (
                              <textarea
                                value={editData.registererInformations[0]?.residanceInformation?.[0]?.residanseAdress || ''}
                                onChange={(e) => {
                                  const newEditData = { ...editData };
                                  if (newEditData.registererInformations[0]?.residanceInformation?.[0]) {
                                    newEditData.registererInformations[0].residanceInformation[0].residanseAdress = e.target.value;
                                    setEditData(newEditData);
                                  }
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm resize-none"
                                rows={2}
                              />
                            ) : (
                              <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                                {selectedLottery.registererInformations[0].residanceInformation[0].residanseAdress}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Contact Information */}
                    {selectedLottery.registererInformations[0].contactInformations?.[0] && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">اطلاعات تماس</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="bg-white p-4 rounded-xl border border-blue-200">
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">شماره تلفن اصلی</p>
                            {isEditMode && editData ? (
                              <input
                                type="text"
                                value={editData.registererInformations[0]?.contactInformations?.[0]?.activePhoneNumber || ''}
                                onChange={(e) => {
                                  const newEditData = { ...editData };
                                  if (newEditData.registererInformations[0]?.contactInformations?.[0]) {
                                    newEditData.registererInformations[0].contactInformations[0].activePhoneNumber = e.target.value;
                                    setEditData(newEditData);
                                  }
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                              />
                            ) : (
                              <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                                {selectedLottery.registererInformations[0].contactInformations[0].activePhoneNumber}
                              </p>
                            )}
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-blue-200">
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">شماره تلفن ثانویه</p>
                            {isEditMode && editData ? (
                              <input
                                type="text"
                                value={editData.registererInformations[0]?.contactInformations?.[0]?.secondaryPhoneNumber || ''}
                                onChange={(e) => {
                                  const newEditData = { ...editData };
                                  if (newEditData.registererInformations[0]?.contactInformations?.[0]) {
                                    newEditData.registererInformations[0].contactInformations[0].secondaryPhoneNumber = e.target.value;
                                    setEditData(newEditData);
                                  }
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                              />
                            ) : (
                              <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                                {selectedLottery.registererInformations[0].contactInformations[0].secondaryPhoneNumber}
                              </p>
                            )}
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-blue-200">
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">ایمیل</p>
                            {isEditMode && editData ? (
                              <input
                                type="email"
                                value={editData.registererInformations[0]?.contactInformations?.[0]?.email || ''}
                                onChange={(e) => {
                                  const newEditData = { ...editData };
                                  if (newEditData.registererInformations[0]?.contactInformations?.[0]) {
                                    newEditData.registererInformations[0].contactInformations[0].email = e.target.value;
                                    setEditData(newEditData);
                                  }
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                              />
                            ) : (
                              <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                                {selectedLottery.registererInformations[0].contactInformations[0].email}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Other Information */}
                    {selectedLottery.registererInformations[0].otherInformations?.[0] && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">سایر اطلاعات</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="bg-white p-4 rounded-xl border border-blue-200">
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">نام فارسی</p>
                            {isEditMode && editData ? (
                              <input
                                type="text"
                                value={editData.registererInformations[0]?.otherInformations?.[0]?.persianName || ''}
                                onChange={(e) => {
                                  const newEditData = { ...editData };
                                  if (newEditData.registererInformations[0]?.otherInformations?.[0]) {
                                    newEditData.registererInformations[0].otherInformations[0].persianName = e.target.value;
                                    setEditData(newEditData);
                                  }
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                              />
                            ) : (
                              <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                                {selectedLottery.registererInformations[0].otherInformations[0].persianName}
                              </p>
                            )}
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-blue-200">
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">نام خانوادگی فارسی</p>
                            {isEditMode && editData ? (
                              <input
                                type="text"
                                value={editData.registererInformations[0]?.otherInformations?.[0]?.persianLastName || ''}
                                onChange={(e) => {
                                  const newEditData = { ...editData };
                                  if (newEditData.registererInformations[0]?.otherInformations?.[0]) {
                                    newEditData.registererInformations[0].otherInformations[0].persianLastName = e.target.value;
                                    setEditData(newEditData);
                                  }
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                              />
                            ) : (
                              <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                                {selectedLottery.registererInformations[0].otherInformations[0].persianLastName}
                              </p>
                            )}
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-blue-200">
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">آخرین مدرک تحصیلی</p>
                            {isEditMode && editData ? (
                              <select
                                value={editData.registererInformations[0]?.otherInformations?.[0]?.lastDegree || ''}
                                onChange={(e) => {
                                  const newEditData = { ...editData };
                                  if (newEditData.registererInformations[0]?.otherInformations?.[0]) {
                                    newEditData.registererInformations[0].otherInformations[0].lastDegree = e.target.value;
                                    setEditData(newEditData);
                                  }
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                              >
                                <option value="">انتخاب کنید</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                                  <option key={grade} value={grade.toString()}>
                                    {grade === 12 ? 'دیپلم' : grade === 11 ? 'یازدهم' : `${grade}`}
                                  </option>
                                ))}
                                <option value="فوق دیپلم">فوق دیپلم</option>
                                <option value="لیسانس">لیسانس</option>
                                <option value="فوق لیسانس">فوق لیسانس</option>
                                <option value="دکترا">دکترا</option>
                              </select>
                            ) : (
                              <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                                {selectedLottery.registererInformations[0].otherInformations[0].lastDegree}
                              </p>
                            )}
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-blue-200">
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">وضعیت شهروندی همسر</p>
                            {isEditMode && editData ? (
                              <select
                                value={editData.registererInformations[0]?.otherInformations?.[0]?.partnerCitizenShip || ''}
                                onChange={(e) => {
                                  const newEditData = { ...editData };
                                  if (newEditData.registererInformations[0]?.otherInformations?.[0]) {
                                    newEditData.registererInformations[0].otherInformations[0].partnerCitizenShip = e.target.value;
                                    setEditData(newEditData);
                                  }
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                              >
                                <option value="">انتخاب کنید</option>
                                <option value="my spouse is not a resident of america">همسر من ساکن آمریکا نیست</option>
                                <option value="my spouse live in america">همسر من در آمریکا زندگی می‌کند</option>
                              </select>
                            ) : (
                              <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                                {selectedLottery.registererInformations[0].otherInformations[0].partnerCitizenShip === 'my spouse is not a resident of america' 
                                  ? 'همسر من ساکن آمریکا نیست'
                                  : selectedLottery.registererInformations[0].otherInformations[0].partnerCitizenShip === 'my spouse live in america'
                                  ? 'همسر من در آمریکا زندگی می‌کند'
                                  : selectedLottery.registererInformations[0].otherInformations[0].partnerCitizenShip}
                              </p>
                            )}
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-blue-200">
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">تصویر</p>
                            {selectedLottery.registererInformations[0].otherInformations[0]?.imageUrl ? (
                              <img
                                src={selectedLottery.registererInformations[0].otherInformations[0].imageUrl}
                                alt="تصویر ثبت کننده"
                                className="w-16 h-16 object-cover rounded-lg border cursor-pointer"
                                onClick={() =>
                                  window.open(
                                    selectedLottery.registererInformations[0].otherInformations[0].imageUrl,
                                    "_blank"
                                  )
                                }
                              />
                            ) : (
                              <p className="text-sm text-gray-400">بدون تصویر</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Partner Information */}
              {selectedLottery.famillyInformations[0]?.maridgeState &&
                selectedLottery.registererPartnerInformations[0] && (
                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 border-2 border-pink-200">
                    <h3 className="text-base sm:text-lg font-bold text-[#0A1D37] mb-4 flex items-center gap-2">
                      <FaIdCard className="text-pink-500 text-xl" />
                      اطلاعات همسر
                    </h3>
                    <div className="space-y-6">
                      {/* Basic Information */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">اطلاعات اولیه</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="bg-white p-4 rounded-xl border border-pink-200">
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">نام</p>
                            {isEditMode && editData ? (
                              <input
                                type="text"
                                value={editData.registererPartnerInformations[0]?.initialInformations?.firstName || ''}
                                onChange={(e) => {
                                  const newEditData = { ...editData };
                                  if (newEditData.registererPartnerInformations[0]?.initialInformations) {
                                    newEditData.registererPartnerInformations[0].initialInformations.firstName = e.target.value;
                                    setEditData(newEditData);
                                  }
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                              />
                            ) : (
                              <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                                {selectedLottery.registererPartnerInformations[0].initialInformations.firstName}
                              </p>
                            )}
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-pink-200">
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">نام خانوادگی</p>
                            {isEditMode && editData ? (
                              <input
                                type="text"
                                value={editData.registererPartnerInformations[0]?.initialInformations?.lastName || ''}
                                onChange={(e) => {
                                  const newEditData = { ...editData };
                                  if (newEditData.registererPartnerInformations[0]?.initialInformations) {
                                    newEditData.registererPartnerInformations[0].initialInformations.lastName = e.target.value;
                                    setEditData(newEditData);
                                  }
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                              />
                            ) : (
                              <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                                {selectedLottery.registererPartnerInformations[0].initialInformations.lastName}
                              </p>
                            )}
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-pink-200">
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">جنسیت</p>
                            {isEditMode && editData ? (
                              <select
                                value={editData.registererPartnerInformations[0]?.initialInformations?.gender || 'male'}
                                onChange={(e) => {
                                  const newEditData = { ...editData };
                                  if (newEditData.registererPartnerInformations[0]?.initialInformations) {
                                    newEditData.registererPartnerInformations[0].initialInformations.gender = e.target.value;
                                    setEditData(newEditData);
                                  }
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                              >
                                <option value="male">مرد</option>
                                <option value="female">زن</option>
                              </select>
                            ) : (
                              <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                                {selectedLottery.registererPartnerInformations[0].initialInformations.gender === 'male' ? 'مرد' : 'زن'}
                              </p>
                            )}
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-pink-200">
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">تاریخ تولد</p>
                            {isEditMode && editData ? (
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="سال"
                                  value={editData.registererPartnerInformations[0]?.initialInformations?.birthDate?.year || ''}
                                  onChange={(e) => {
                                    const newEditData = { ...editData };
                                    if (newEditData.registererPartnerInformations[0]?.initialInformations?.birthDate) {
                                      newEditData.registererPartnerInformations[0].initialInformations.birthDate.year = e.target.value;
                                      setEditData(newEditData);
                                    }
                                  }}
                                  className="flex-1 p-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#0A1D37]"
                                />
                                <input
                                  type="text"
                                  placeholder="ماه"
                                  value={editData.registererPartnerInformations[0]?.initialInformations?.birthDate?.month || ''}
                                  onChange={(e) => {
                                    const newEditData = { ...editData };
                                    if (newEditData.registererPartnerInformations[0]?.initialInformations?.birthDate) {
                                      newEditData.registererPartnerInformations[0].initialInformations.birthDate.month = e.target.value;
                                      setEditData(newEditData);
                                    }
                                  }}
                                  className="flex-1 p-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#0A1D37]"
                                />
                                <input
                                  type="text"
                                  placeholder="روز"
                                  value={editData.registererPartnerInformations[0]?.initialInformations?.birthDate?.day || ''}
                                  onChange={(e) => {
                                    const newEditData = { ...editData };
                                    if (newEditData.registererPartnerInformations[0]?.initialInformations?.birthDate) {
                                      newEditData.registererPartnerInformations[0].initialInformations.birthDate.day = e.target.value;
                                      setEditData(newEditData);
                                    }
                                  }}
                                  className="flex-1 p-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#0A1D37]"
                                />
                              </div>
                            ) : (
                              <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                                {selectedLottery.registererPartnerInformations[0].initialInformations.birthDate.year}/
                                {selectedLottery.registererPartnerInformations[0].initialInformations.birthDate.month}/
                                {selectedLottery.registererPartnerInformations[0].initialInformations.birthDate.day}
                              </p>
                            )}
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-pink-200">
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">کشور</p>
                            {isEditMode && editData ? (
                              <input
                                type="text"
                                value={editData.registererPartnerInformations[0]?.initialInformations?.country || ''}
                                onChange={(e) => {
                                  const newEditData = { ...editData };
                                  if (newEditData.registererPartnerInformations[0]?.initialInformations) {
                                    newEditData.registererPartnerInformations[0].initialInformations.country = e.target.value;
                                    setEditData(newEditData);
                                  }
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                              />
                            ) : (
                              <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                                {selectedLottery.registererPartnerInformations[0].initialInformations.country}
                              </p>
                            )}
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-pink-200">
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">شهر</p>
                            {isEditMode && editData ? (
                              <input
                                type="text"
                                value={editData.registererPartnerInformations[0]?.initialInformations?.city || ''}
                                onChange={(e) => {
                                  const newEditData = { ...editData };
                                  if (newEditData.registererPartnerInformations[0]?.initialInformations) {
                                    newEditData.registererPartnerInformations[0].initialInformations.city = e.target.value;
                                    setEditData(newEditData);
                                  }
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                              />
                            ) : (
                              <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                                {selectedLottery.registererPartnerInformations[0].initialInformations.city}
                              </p>
                            )}
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-pink-200">
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">کشور شهروندی</p>
                            {isEditMode && editData ? (
                              <input
                                type="text"
                                value={editData.registererPartnerInformations[0]?.initialInformations?.citizenshipCountry || ''}
                                onChange={(e) => {
                                  const newEditData = { ...editData };
                                  if (newEditData.registererPartnerInformations[0]?.initialInformations) {
                                    newEditData.registererPartnerInformations[0].initialInformations.citizenshipCountry = e.target.value;
                                    setEditData(newEditData);
                                  }
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                              />
                            ) : (
                              <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                                {selectedLottery.registererPartnerInformations[0].initialInformations.citizenshipCountry}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Other Information */}
                      {selectedLottery.registererPartnerInformations[0].otherInformations?.[0] && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">سایر اطلاعات</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-xl border border-pink-200">
                              <p className="text-xs sm:text-sm text-gray-600 mb-2">نام فارسی</p>
                              {isEditMode && editData ? (
                                <input
                                  type="text"
                                  value={editData.registererPartnerInformations[0]?.otherInformations?.[0]?.persianName || ''}
                                  onChange={(e) => {
                                    const newEditData = { ...editData };
                                    if (newEditData.registererPartnerInformations[0]?.otherInformations?.[0]) {
                                      newEditData.registererPartnerInformations[0].otherInformations[0].persianName = e.target.value;
                                      setEditData(newEditData);
                                    }
                                  }}
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                                />
                              ) : (
                                <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                                  {selectedLottery.registererPartnerInformations[0].otherInformations[0].persianName}
                                </p>
                              )}
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-pink-200">
                              <p className="text-xs sm:text-sm text-gray-600 mb-2">نام خانوادگی فارسی</p>
                              {isEditMode && editData ? (
                                <input
                                  type="text"
                                  value={editData.registererPartnerInformations[0]?.otherInformations?.[0]?.persianLastName || ''}
                                  onChange={(e) => {
                                    const newEditData = { ...editData };
                                    if (newEditData.registererPartnerInformations[0]?.otherInformations?.[0]) {
                                      newEditData.registererPartnerInformations[0].otherInformations[0].persianLastName = e.target.value;
                                      setEditData(newEditData);
                                    }
                                  }}
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                                />
                              ) : (
                                <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                                  {selectedLottery.registererPartnerInformations[0].otherInformations[0].persianLastName}
                                </p>
                              )}
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-pink-200">
                              <p className="text-xs sm:text-sm text-gray-600 mb-2">آخرین مدرک تحصیلی</p>
                              {isEditMode && editData ? (
                                <select
                                  value={editData.registererPartnerInformations[0]?.otherInformations?.[0]?.lastDegree || ''}
                                  onChange={(e) => {
                                    const newEditData = { ...editData };
                                    if (newEditData.registererPartnerInformations[0]?.otherInformations?.[0]) {
                                      newEditData.registererPartnerInformations[0].otherInformations[0].lastDegree = e.target.value;
                                      setEditData(newEditData);
                                    }
                                  }}
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                                >
                                  <option value="">انتخاب کنید</option>
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                                    <option key={grade} value={grade.toString()}>
                                      {grade === 12 ? 'دیپلم' : grade === 11 ? 'یازدهم' : `${grade}`}
                                    </option>
                                  ))}
                                  <option value="فوق دیپلم">فوق دیپلم</option>
                                  <option value="لیسانس">لیسانس</option>
                                  <option value="فوق لیسانس">فوق لیسانس</option>
                                  <option value="دکترا">دکترا</option>
                                </select>
                              ) : (
                                <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                                  {selectedLottery.registererPartnerInformations[0].otherInformations[0].lastDegree}
                                </p>
                              )}
                            </div>
                            <div className="bg-white p-4 rounded-xl border border-pink-200">
                              <p className="text-xs sm:text-sm text-gray-600 mb-2">تصویر</p>
                              {selectedLottery.registererPartnerInformations[0].otherInformations[0]?.imageUrl ? (
                                <img
                                  src={selectedLottery.registererPartnerInformations[0].otherInformations[0].imageUrl}
                                  alt="تصویر همسر"
                                  className="w-16 h-16 object-cover rounded-lg border cursor-pointer"
                                  onClick={() =>
                                    window.open(
                                      selectedLottery.registererPartnerInformations[0].otherInformations[0].imageUrl,
                                      "_blank"
                                    )
                                  }
                                />
                              ) : (
                                <p className="text-sm text-gray-400">بدون تصویر</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* Children Information */}
              {selectedLottery.famillyInformations[0]?.numberOfChildren > 0 &&
                selectedLottery.registererChildformations.length > 0 && (
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 border-2 border-yellow-200">
                    <h3 className="text-base sm:text-lg font-bold text-[#0A1D37] mb-4 flex items-center gap-2">
                      <FaChild className="text-yellow-500 text-xl" />
                      اطلاعات فرزندان
                    </h3>
                    {selectedLottery.registererChildformations.map(
                      (child, index) => (
                        <div
                          key={index}
                          className="mb-6 last:mb-0 pb-6 last:pb-0 border-b last:border-b-0"
                        >
                          <h4 className="text-sm font-semibold text-gray-700 mb-4">
                            فرزند {index + 1}
                          </h4>
                          <div className="space-y-4">
                            {/* Basic Information */}
                            <div>
                              <h5 className="text-xs font-semibold text-gray-600 mb-2">اطلاعات اولیه</h5>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="bg-white p-4 rounded-xl border border-yellow-200">
                                  <p className="text-xs sm:text-sm text-gray-600 mb-2">نام</p>
                                  {isEditMode && editData ? (
                                    <input
                                      type="text"
                                      value={editData.registererChildformations[index]?.initialInformations?.firstName || ''}
                                      onChange={(e) => {
                                        const newEditData = { ...editData };
                                        if (newEditData.registererChildformations[index]?.initialInformations) {
                                          newEditData.registererChildformations[index].initialInformations.firstName = e.target.value;
                                          setEditData(newEditData);
                                        }
                                      }}
                                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                                    />
                                  ) : (
                                    <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                                      {child.initialInformations.firstName}
                                    </p>
                                  )}
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-yellow-200">
                                  <p className="text-xs sm:text-sm text-gray-600 mb-2">نام خانوادگی</p>
                                  {isEditMode && editData ? (
                                    <input
                                      type="text"
                                      value={editData.registererChildformations[index]?.initialInformations?.lastName || ''}
                                      onChange={(e) => {
                                        const newEditData = { ...editData };
                                        if (newEditData.registererChildformations[index]?.initialInformations) {
                                          newEditData.registererChildformations[index].initialInformations.lastName = e.target.value;
                                          setEditData(newEditData);
                                        }
                                      }}
                                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                                    />
                                  ) : (
                                    <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                                      {child.initialInformations.lastName}
                                    </p>
                                  )}
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-yellow-200">
                                  <p className="text-xs sm:text-sm text-gray-600 mb-2">جنسیت</p>
                                  {isEditMode && editData ? (
                                    <select
                                      value={editData.registererChildformations[index]?.initialInformations?.gender || 'male'}
                                      onChange={(e) => {
                                        const newEditData = { ...editData };
                                        if (newEditData.registererChildformations[index]?.initialInformations) {
                                          newEditData.registererChildformations[index].initialInformations.gender = e.target.value;
                                          setEditData(newEditData);
                                        }
                                      }}
                                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                                    >
                                      <option value="male">پسر</option>
                                      <option value="female">دختر</option>
                                    </select>
                                  ) : (
                                    <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                                      {child.initialInformations.gender === 'male' ? 'پسر' : 'دختر'}
                                    </p>
                                  )}
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-yellow-200">
                                  <p className="text-xs sm:text-sm text-gray-600 mb-2">تاریخ تولد</p>
                                  {isEditMode && editData ? (
                                    <div className="flex gap-2">
                                      <input
                                        type="text"
                                        placeholder="سال"
                                        value={editData.registererChildformations[index]?.initialInformations?.birthDate?.year || ''}
                                        onChange={(e) => {
                                          const newEditData = { ...editData };
                                          if (newEditData.registererChildformations[index]?.initialInformations?.birthDate) {
                                            newEditData.registererChildformations[index].initialInformations.birthDate.year = e.target.value;
                                            setEditData(newEditData);
                                          }
                                        }}
                                        className="flex-1 p-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#0A1D37]"
                                      />
                                      <input
                                        type="text"
                                        placeholder="ماه"
                                        value={editData.registererChildformations[index]?.initialInformations?.birthDate?.month || ''}
                                        onChange={(e) => {
                                          const newEditData = { ...editData };
                                          if (newEditData.registererChildformations[index]?.initialInformations?.birthDate) {
                                            newEditData.registererChildformations[index].initialInformations.birthDate.month = e.target.value;
                                            setEditData(newEditData);
                                          }
                                        }}
                                        className="flex-1 p-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#0A1D37]"
                                      />
                                      <input
                                        type="text"
                                        placeholder="روز"
                                        value={editData.registererChildformations[index]?.initialInformations?.birthDate?.day || ''}
                                        onChange={(e) => {
                                          const newEditData = { ...editData };
                                          if (newEditData.registererChildformations[index]?.initialInformations?.birthDate) {
                                            newEditData.registererChildformations[index].initialInformations.birthDate.day = e.target.value;
                                            setEditData(newEditData);
                                          }
                                        }}
                                        className="flex-1 p-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-[#0A1D37]"
                                      />
                                    </div>
                                  ) : (
                                    <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                                      {child.initialInformations.birthDate.year}/
                                      {child.initialInformations.birthDate.month}/
                                      {child.initialInformations.birthDate.day}
                                    </p>
                                  )}
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-yellow-200">
                                  <p className="text-xs sm:text-sm text-gray-600 mb-2">کشور</p>
                                  {isEditMode && editData ? (
                                    <input
                                      type="text"
                                      value={editData.registererChildformations[index]?.initialInformations?.country || ''}
                                      onChange={(e) => {
                                        const newEditData = { ...editData };
                                        if (newEditData.registererChildformations[index]?.initialInformations) {
                                          newEditData.registererChildformations[index].initialInformations.country = e.target.value;
                                          setEditData(newEditData);
                                        }
                                      }}
                                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                                    />
                                  ) : (
                                    <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                                      {child.initialInformations.country}
                                    </p>
                                  )}
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-yellow-200">
                                  <p className="text-xs sm:text-sm text-gray-600 mb-2">شهر</p>
                                  {isEditMode && editData ? (
                                    <input
                                      type="text"
                                      value={editData.registererChildformations[index]?.initialInformations?.city || ''}
                                      onChange={(e) => {
                                        const newEditData = { ...editData };
                                        if (newEditData.registererChildformations[index]?.initialInformations) {
                                          newEditData.registererChildformations[index].initialInformations.city = e.target.value;
                                          setEditData(newEditData);
                                        }
                                      }}
                                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                                    />
                                  ) : (
                                    <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                                      {child.initialInformations.city}
                                    </p>
                                  )}
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-yellow-200">
                                  <p className="text-xs sm:text-sm text-gray-600 mb-2">وضعیت شهروندی</p>
                                  {isEditMode && editData ? (
                                    <select
                                      value={editData.registererChildformations[index]?.initialInformations?.citizenshipCountry || 'child_not_american'}
                                      onChange={(e) => {
                                        const newEditData = { ...editData };
                                        if (newEditData.registererChildformations[index]?.initialInformations) {
                                          newEditData.registererChildformations[index].initialInformations.citizenshipCountry = e.target.value;
                                          setEditData(newEditData);
                                        }
                                      }}
                                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] text-sm"
                                    >
                                      <option value="child_not_american">فرزند آمریکایی نیست</option>
                                      <option value="child_american">فرزند آمریکایی است</option>
                                    </select>
                                  ) : (
                                    <p className="text-sm sm:text-base font-bold text-[#0A1D37]">
                                      {child.initialInformations.citizenshipCountry === 'child_not_american' 
                                        ? 'فرزند آمریکایی نیست' 
                                        : child.initialInformations.citizenshipCountry}
                                    </p>
                                  )}
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-yellow-200">
                                  <p className="text-xs sm:text-sm text-gray-600 mb-2">تصویر</p>
                                  {child.otherInformations[0]?.imageUrl ? (
                                    <img
                                      src={child.otherInformations[0].imageUrl}
                                      alt={`تصویر فرزند ${index + 1}`}
                                      className="w-16 h-16 object-cover rounded-lg border cursor-pointer"
                                      onClick={() =>
                                        window.open(
                                          child.otherInformations[0].imageUrl,
                                          "_blank"
                                        )
                                      }
                                    />
                                  ) : (
                                    <p className="text-sm text-gray-400">بدون تصویر</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerLotteryList;
