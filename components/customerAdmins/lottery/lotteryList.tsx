"use client";
import React, { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { showToast } from "@/utilities/toast";
import {
  FaTicketAlt,
  FaEye,
  FaPlus,
  FaClock,
  FaCheck,
  FaTimes,
  FaUser,
  FaChild,
  FaHeart,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaGlobe,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";

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
  const [selectedLottery, setSelectedLottery] = useState<LotteryRegistration | null>(null);
  const [showLotteryDetails, setShowLotteryDetails] = useState(false);
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
        pendingRequests: userLotteries.filter((l: LotteryRegistration) => l.status === "pending").length,
        approvedRequests: userLotteries.filter((l: LotteryRegistration) => l.status === "approved" || l.status === "completed").length,
        rejectedRequests: userLotteries.filter((l: LotteryRegistration) => l.status === "rejected").length,
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
        return <FaClock className="text-orange-500" />;
      case "in_review":
        return <FaClock className="text-blue-500" />;
      case "approved":
      case "completed":
        return <FaCheck className="text-green-500" />;
      case "rejected":
        return <FaTimes className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const openLotteryDetails = (lottery: LotteryRegistration) => {
    setSelectedLottery(lottery);
    setShowLotteryDetails(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ورود به سیستم لازم است
          </h2>
          <p className="text-gray-600">لطفاً وارد حساب کاربری خود شوید</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">کل درخواست‌ها</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalRequests}</p>
            </div>
            <FaTicketAlt className="text-blue-500 text-3xl" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">در انتظار بررسی</p>
              <p className="text-2xl font-bold text-orange-900">{stats.pendingRequests}</p>
            </div>
            <FaClock className="text-orange-500 text-3xl" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">تایید شده</p>
              <p className="text-2xl font-bold text-green-900">{stats.approvedRequests}</p>
            </div>
            <FaCheckCircle className="text-green-500 text-3xl" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-2xl border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">رد شده</p>
              <p className="text-2xl font-bold text-red-900">{stats.rejectedRequests}</p>
            </div>
            <FaTimes className="text-red-500 text-3xl" />
          </div>
        </div>
      </div>

      {/* Header with New Registration Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0A1D37] mb-2">
            ثبت‌نام‌های لاتاری شما
          </h2>
          <p className="text-gray-600">
            مشاهده وضعیت درخواست‌های ثبت‌نام در قرعه‌کشی گرین کارت
          </p>
        </div>
        <a
          href="/lottery/form"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          <FaPlus className="text-sm" />
          ثبت‌نام جدید
        </a>
      </div>

      {/* Lottery Registrations List */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7A00] mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <FaExclamationTriangle className="text-4xl text-red-400 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => fetchLotteries()}
            className="px-4 py-2 bg-[#FF7A00] text-white rounded-lg hover:bg-[#FF7A00]/90"
          >
            تلاش مجدد
          </button>
        </div>
      ) : lotteries.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <FaTicketAlt className="text-6xl text-gray-300 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-gray-700 mb-4">
            هنوز ثبت‌نامی ندارید
          </h3>
          <p className="text-gray-500 mb-6">
            برای شرکت در قرعه‌کشی گرین کارت آمریکا، اولین ثبت‌نام خود را انجام دهید
          </p>
          <a
            href="/lottery/form"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <FaPlus className="text-sm" />
            شروع ثبت‌نام
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {lotteries.map((lottery) => (
            <div
              key={lottery._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] rounded-full flex items-center justify-center">
                    <FaTicketAlt className="text-white text-lg" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-[#0A1D37]">
                        ثبت‌نام لاتاری گرین کارت
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(
                          lottery.status
                        )}`}
                      >
                        {getStatusIcon(lottery.status)}
                        {getStatusText(lottery.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400" />
                        <span>
                          ثبت‌نام: {new Date(lottery.submittedAt).toLocaleDateString("fa-IR")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {lottery.famillyInformations[0]?.maridgeState ? (
                          <FaHeart className="text-pink-500" />
                        ) : (
                          <FaUser className="text-gray-400" />
                        )}
                        <span>
                          {lottery.famillyInformations[0]?.maridgeState ? "متأهل" : "مجرد"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaChild className="text-blue-500" />
                        <span>
                          {lottery.famillyInformations[0]?.numberOfChildren || 0} فرزند
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openLotteryDetails(lottery)}
                    className="flex items-center gap-2 px-4 py-2 text-[#4DBFF0] hover:text-[#4DBFF0]/80 hover:bg-[#4DBFF0]/10 rounded-lg transition-all duration-300"
                  >
                    <FaEye className="text-sm" />
                    مشاهده جزئیات
                  </button>
                </div>
              </div>

              {/* Show rejection reason if rejected */}
              {lottery.status === "rejected" && lottery.rejectionReason && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FaExclamationTriangle className="text-red-500 text-sm" />
                    <span className="text-red-700 font-medium text-sm">دلیل رد:</span>
                  </div>
                  <p className="text-red-600 text-sm">{lottery.rejectionReason}</p>
                </div>
              )}

              {/* Show admin notes if available */}
              {lottery.adminNotes && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FaIdCard className="text-blue-500 text-sm" />
                    <span className="text-blue-700 font-medium text-sm">یادداشت مدیر:</span>
                  </div>
                  <p className="text-blue-600 text-sm">{lottery.adminNotes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lottery Details Modal */}
      {showLotteryDetails && selectedLottery && (
        <div className="fixed inset-0 h-screen overflow-hidden bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-screen overflow-hidden shadow-2xl border border-[#FF7A00]/20">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gray-50 border-[#FF7A00]/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#FF7A00] rounded-full flex items-center justify-center">
                  <FaTicketAlt className="text-white text-sm" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#0A1D37]">
                  جزئیات ثبت‌نام لاتاری
                </h2>
              </div>
              <button
                onClick={() => setShowLotteryDetails(false)}
                className="p-2 hover:bg-[#FF7A00]/10 rounded-lg transition-colors text-gray-500 hover:text-[#FF7A00]"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-[75vh]">
              {/* Status Info */}
              <div className="bg-gray-50 rounded-xl p-4 border border-[#0A1D37]/10">
                <h3 className="text-base sm:text-lg font-semibold text-[#0A1D37] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#FF7A00] rounded-full"></span>
                  وضعیت درخواست
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">وضعیت فعلی</p>
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(
                        selectedLottery.status
                      )}`}
                    >
                      {getStatusIcon(selectedLottery.status)}
                      {getStatusText(selectedLottery.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">تاریخ ثبت‌نام</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(selectedLottery.submittedAt).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                  {selectedLottery.reviewedAt && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">تاریخ بررسی</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(selectedLottery.reviewedAt).toLocaleDateString("fa-IR")}
                      </p>
                    </div>
                  )}
                </div>
                {selectedLottery.rejectionReason && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-1">دلیل رد</p>
                    <p className="text-sm font-medium text-red-600">
                      {selectedLottery.rejectionReason}
                    </p>
                  </div>
                )}
                {selectedLottery.adminNotes && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-1">یادداشت مدیر</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedLottery.adminNotes}
                    </p>
                  </div>
                )}
              </div>

              {/* Family Information */}
              <div className="bg-gray-50 rounded-xl p-4 border border-[#0A1D37]/10">
                <h3 className="text-base sm:text-lg font-semibold text-[#0A1D37] mb-3 flex items-center gap-2">
                  <FaHeart className="text-pink-500" />
                  اطلاعات خانوادگی
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">وضعیت تأهل</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedLottery.famillyInformations[0]?.maridgeState ? "متأهل" : "مجرد"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">تعداد فرزندان</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedLottery.famillyInformations[0]?.numberOfChildren || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">ثبت‌نام دو نفره</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedLottery.famillyInformations[0]?.towPeopleRegistration ? "بله" : "خیر"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Registerer Information */}
              <div className="bg-gray-50 rounded-xl p-4 border border-[#0A1D37]/10">
                <h3 className="text-base sm:text-lg font-semibold text-[#0A1D37] mb-3 flex items-center gap-2">
                  <FaUser className="text-blue-500" />
                  اطلاعات ثبت‌کننده
                </h3>
                {selectedLottery.registererInformations[0] && (
                  <div className="space-y-4">
                    {/* Basic Info */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">اطلاعات اولیه</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">نام</p>
                          <p className="text-sm font-medium">
                            {selectedLottery.registererInformations[0].initialInformations.firstName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">نام خانوادگی</p>
                          <p className="text-sm font-medium">
                            {selectedLottery.registererInformations[0].initialInformations.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">جنسیت</p>
                          <p className="text-sm font-medium">
                            {selectedLottery.registererInformations[0].initialInformations.gender === "male" ? "مرد" : "زن"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">تاریخ تولد</p>
                          <p className="text-sm font-medium">
                            {selectedLottery.registererInformations[0].initialInformations.birthDate.day}/
                            {selectedLottery.registererInformations[0].initialInformations.birthDate.month}/
                            {selectedLottery.registererInformations[0].initialInformations.birthDate.year}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">کشور</p>
                          <p className="text-sm font-medium">
                            {selectedLottery.registererInformations[0].initialInformations.country}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">شهر</p>
                          <p className="text-sm font-medium">
                            {selectedLottery.registererInformations[0].initialInformations.city}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FaPhone className="text-green-500 text-xs" />
                        اطلاعات تماس
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">تلفن اصلی</p>
                          <p className="text-sm font-medium">
                            {selectedLottery.registererInformations[0].contactInformations[0]?.activePhoneNumber}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">ایمیل</p>
                          <p className="text-sm font-medium">
                            {selectedLottery.registererInformations[0].contactInformations[0]?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Residence Info */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-red-500 text-xs" />
                        محل سکونت
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">کشور سکونت</p>
                          <p className="text-sm font-medium">
                            {selectedLottery.registererInformations[0].residanceInformation[0]?.residanceCountry}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">شهر سکونت</p>
                          <p className="text-sm font-medium">
                            {selectedLottery.registererInformations[0].residanceInformation[0]?.residanceCity}
                          </p>
                        </div>
                        <div className="sm:col-span-2">
                          <p className="text-xs text-gray-600 mb-1">آدرس</p>
                          <p className="text-sm font-medium">
                            {selectedLottery.registererInformations[0].residanceInformation[0]?.residanseAdress}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Partner Information */}
              {selectedLottery.registererPartnerInformations.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 border border-[#0A1D37]/10">
                  <h3 className="text-base sm:text-lg font-semibold text-[#0A1D37] mb-3 flex items-center gap-2">
                    <FaIdCard className="text-purple-500" />
                    اطلاعات همسر
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">نام</p>
                      <p className="text-sm font-medium">
                        {selectedLottery.registererPartnerInformations[0].initialInformations.firstName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">نام خانوادگی</p>
                      <p className="text-sm font-medium">
                        {selectedLottery.registererPartnerInformations[0].initialInformations.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">جنسیت</p>
                      <p className="text-sm font-medium">
                        {selectedLottery.registererPartnerInformations[0].initialInformations.gender === "male" ? "مرد" : "زن"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Children Information */}
              {selectedLottery.registererChildformations.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 border border-[#0A1D37]/10">
                  <h3 className="text-base sm:text-lg font-semibold text-[#0A1D37] mb-3 flex items-center gap-2">
                    <FaChild className="text-yellow-500" />
                    اطلاعات فرزندان
                  </h3>
                  <div className="space-y-4">
                    {selectedLottery.registererChildformations.map((child, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">فرزند {index + 1}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">نام</p>
                            <p className="text-sm font-medium">{child.initialInformations.firstName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">نام خانوادگی</p>
                            <p className="text-sm font-medium">{child.initialInformations.lastName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">جنسیت</p>
                            <p className="text-sm font-medium">
                              {child.initialInformations.gender === "male" ? "پسر" : "دختر"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-[#0A1D37]/10 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowLotteryDetails(false)}
                className="px-4 py-2 text-[#0A1D37] border border-[#0A1D37]/20 rounded-lg hover:bg-gray-100 transition-colors"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerLotteryList;