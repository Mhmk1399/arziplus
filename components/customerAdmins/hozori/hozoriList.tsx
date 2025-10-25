"use client";
import React, { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  FaCalendarCheck,
  FaUser,
  FaClock,
  FaCheck,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaExclamationTriangle,
  FaIdCard,
  FaPlus,
  FaPhone,
  FaChild,
  FaHeart,
  FaMoneyBillWave,
  FaReceipt,
  FaCalendarAlt,
   FaEye,
} from "react-icons/fa";

interface HozoriReservation {
  _id: string;
  name: string;
  lastname: string;
  phoneNumber: string;
  childrensCount: number;
  maridgeStatus: "single" | "married";
  Date: string;
  time: string;
  paymentType: "wallet" | "direct" | "card";
  paymentDate: string;
  paymentImage: string;
  userId: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface HozoriStats {
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  completedReservations: number;
  cancelledReservations: number;
}

const CustomerHozoriList = () => {
  const { user: currentUser, isLoggedIn } = useCurrentUser();
  const [reservations, setReservations] = useState<HozoriReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<HozoriReservation | null>(null);
  const [showReservationDetails, setShowReservationDetails] = useState(false);
  const [stats, setStats] = useState<HozoriStats>({
    totalReservations: 0,
    pendingReservations: 0,
    confirmedReservations: 0,
    completedReservations: 0,
    cancelledReservations: 0,
  });

  // Fetch user's hozori reservations
  const fetchReservations = async () => {
    if (!isLoggedIn || !currentUser) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/hozori?userId=${currentUser.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("خطا در دریافت اطلاعات رزروها");
      }

      const data = await response.json();
      setReservations(data.data || []);

      // Calculate stats
      const userReservations = data.data || [];
      setStats({
        totalReservations: userReservations.length,
        pendingReservations: userReservations.filter(
          (r: HozoriReservation) => r.status === "pending"
        ).length,
        confirmedReservations: userReservations.filter(
          (r: HozoriReservation) => r.status === "confirmed"
        ).length,
        completedReservations: userReservations.filter(
          (r: HozoriReservation) => r.status === "completed"
        ).length,
        cancelledReservations: userReservations.filter(
          (r: HozoriReservation) => r.status === "cancelled"
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
      fetchReservations();
    }
  }, [isLoggedIn, currentUser]);

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-orange-700 bg-orange-100 border-orange-300";
      case "confirmed":
        return "text-blue-700 bg-blue-100 border-blue-300";
      case "completed":
        return "text-green-700 bg-green-100 border-green-300";
      case "cancelled":
        return "text-red-700 bg-red-100 border-red-300";
      default:
        return "text-gray-700 bg-gray-100 border-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "در انتظار تایید";
      case "confirmed":
        return "تایید شده";
      case "completed":
        return "تکمیل شده";
      case "cancelled":
        return "لغو شده";
      default:
        return "نامشخص";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <FaHourglassHalf className="text-sm" />;
      case "confirmed":
        return <FaCheckCircle className="text-sm" />;
      case "completed":
        return <FaCheck className="text-sm" />;
      case "cancelled":
        return <FaTimesCircle className="text-sm" />;
      default:
        return <FaClock className="text-sm" />;
    }
  };

  const getPaymentTypeBadge = (paymentType: string) => {
    const paymentConfig = {
      wallet: { label: "کیف پول", color: "bg-purple-100 text-purple-800" },
      direct: { label: "پرداخت مستقیم", color: "bg-blue-100 text-blue-800" },
      card: { label: "کارت", color: "bg-green-100 text-green-800" },
    };

    const config = paymentConfig[paymentType as keyof typeof paymentConfig] || paymentConfig.direct;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR");
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const openReservationDetails = (reservation: HozoriReservation) => {
    setSelectedReservation(reservation);
    setShowReservationDetails(true);
  };
 

  return (
    <div className="space-y-6 sm:space-y-8" dir="rtl">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-blue-600 text-xs sm:text-sm font-medium">
                کل رزروها
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-900">
                {stats.totalReservations}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <FaCalendarCheck className="text-blue-500 text-xl sm:text-2xl" />
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
                {stats.pendingReservations}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
              <FaHourglassHalf className="text-orange-500 text-xl sm:text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-blue-600 text-xs sm:text-sm font-medium">
                تایید شده
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-900">
                {stats.confirmedReservations}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <FaCheckCircle className="text-blue-500 text-xl sm:text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-green-600 text-xs sm:text-sm font-medium">
                تکمیل شده
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-green-900">
                {stats.completedReservations}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <FaCheck className="text-green-500 text-xl sm:text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-red-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-red-600 text-xs sm:text-sm font-medium">
                لغو شده
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-red-900">
                {stats.cancelledReservations}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
              <FaTimesCircle className="text-red-500 text-xl sm:text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Hozori Reservations List */}
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
            onClick={() => fetchReservations()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            تلاش مجدد
          </button>
        </div>
      ) : reservations.length === 0 ? (
        <div className="rounded-2xl p-8 sm:p-16 text-center space-y-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-[#0A1D37]/10 to-[#4DBFF0]/10 rounded-full flex items-center justify-center mx-auto">
            <FaCalendarCheck className="text-4xl sm:text-5xl text-gray-400" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0A1D37]">
              هنوز رزروی ندارید
            </h3>
            <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              برای رزرو وقت حضوری، اولین رزرو خود را انجام دهید
            </p>
          </div>
          <a
            href="/lottery/form/present"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
          >
            <FaPlus className="text-lg" />
            رزرو وقت حضوری
          </a>
        </div>
      ) : (
        <div className="space-y-5 sm:space-y-6">
          {reservations.map((reservation) => (
            <div
              key={reservation._id}
              className="group bg-white rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
            >
              <div className="bg-gradient-to-r from-[#0A1D37]/5 to-[#4DBFF0]/5 px-5 sm:px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                      <FaCalendarCheck className="text-white text-xl sm:text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#0A1D37] group-hover:text-[#4DBFF0] transition-colors">
                        {reservation.name} {reservation.lastname}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        رزرو شده: {formatDate(reservation.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className={`inline-flex items-center gap-1.5  px-3 py-1.5 rounded-full border text-nowrap text-xs sm:text-sm font-semibold ${getStatusColor(reservation.status)}`}>
                    {getStatusIcon(reservation.status)}
                    {getStatusText(reservation.status)}
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <FaCalendarAlt className="text-[#4DBFF0] text-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">تاریخ</p>
                      <p className="font-semibold text-[#0A1D37] text-sm truncate">
                        {formatDate(reservation.Date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <FaClock className="text-[#4DBFF0] text-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">زمان</p>
                      <p className="font-semibold text-[#0A1D37] text-sm truncate">
                        {formatTime(reservation.time)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <FaPhone className="text-[#4DBFF0] text-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">تلفن</p>
                      <p className="font-semibold text-[#0A1D37] text-sm truncate">
                        {reservation.phoneNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <FaHeart className="text-[#4DBFF0] text-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">وضعیت تأهل</p>
                      <p className="font-semibold text-[#0A1D37] text-sm">
                        {reservation.maridgeStatus === "married" ? "متأهل" : "مجرد"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <FaChild className="text-[#4DBFF0] text-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">تعداد فرزندان</p>
                      <p className="font-semibold text-[#0A1D37] text-sm">
                        {reservation.childrensCount} نفر
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <FaMoneyBillWave className="text-[#4DBFF0] text-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-0.5">نوع پرداخت</p>
                      {getPaymentTypeBadge(reservation.paymentType)}
                    </div>
                  </div>
                </div>

                {reservation.adminNotes && (
                  <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl mb-4">
                    <div className="flex items-start gap-3">
                      <FaIdCard className="text-blue-500 text-lg flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-bold text-blue-900 text-sm mb-2">یادداشت مدیر</p>
                        <p className="text-blue-800 text-xs max-w-sm whitespace-break-spaces leading-relaxed">{reservation.adminNotes}</p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => openReservationDetails(reservation)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white font-bold rounded-xl hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 text-sm"
                >
                  <FaEye className="text-base" />
                  مشاهده جزئیات کامل
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reservation Details Modal */}
      {showReservationDetails && selectedReservation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl border-2 border-[#0A1D37]/20 animate-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-5 sm:p-6 lg:p-8 border-b bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] rounded-xl flex items-center justify-center">
                  <FaCalendarCheck className="text-white text-xl sm:text-2xl" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0A1D37]">
                    جزئیات رزرو حضوری
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {selectedReservation.name} {selectedReservation.lastname}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowReservationDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-300"
              >
                <FaTimes className="text-xl text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 overflow-y-auto max-h-[calc(95vh-180px)]">
              {/* Personal Information */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 border-2 border-gray-200">
                <h3 className="text-lg font-bold text-[#0A1D37] mb-4 flex items-center gap-2">
                  <FaUser className="text-[#4DBFF0]" />
                  اطلاعات شخصی
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <span className="text-gray-600">نام:</span>
                    <p className="font-medium text-[#0A1D37]">{selectedReservation.name}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-gray-600">نام خانوادگی:</span>
                    <p className="font-medium text-[#0A1D37]">{selectedReservation.lastname}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-gray-600">شماره تلفن:</span>
                    <p className="font-medium text-[#0A1D37]">{selectedReservation.phoneNumber}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-gray-600">وضعیت تأهل:</span>
                    <p className="font-medium text-[#0A1D37]">
                      {selectedReservation.maridgeStatus === "married" ? "متأهل" : "مجرد"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-gray-600">تعداد فرزندان:</span>
                    <p className="font-medium text-[#0A1D37]">{selectedReservation.childrensCount} نفر</p>
                  </div>
                </div>
              </div>

              {/* Appointment Information */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 border-2 border-blue-200">
                <h3 className="text-lg font-bold text-[#0A1D37] mb-4 flex items-center gap-2">
                  <FaCalendarAlt className="text-[#4DBFF0]" />
                  اطلاعات نوبت
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <span className="text-gray-600">تاریخ مراجعه:</span>
                    <p className="font-medium text-[#0A1D37]">{formatDate(selectedReservation.Date)}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-gray-600">زمان مراجعه:</span>
                    <p className="font-medium text-[#0A1D37]">{formatTime(selectedReservation.time)}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-gray-600">وضعیت رزرو:</span>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(selectedReservation.status)}`}>
                      {getStatusIcon(selectedReservation.status)}
                      {getStatusText(selectedReservation.status)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 border-2 border-green-200">
                <h3 className="text-lg font-bold text-[#0A1D37] mb-4 flex items-center gap-2">
                  <FaMoneyBillWave className="text-[#4DBFF0]" />
                  اطلاعات پرداخت
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <span className="text-gray-600">روش پرداخت:</span>
                    <div>{getPaymentTypeBadge(selectedReservation.paymentType)}</div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-gray-600">تاریخ پرداخت:</span>
                    <p className="font-medium text-[#0A1D37]">{formatDate(selectedReservation.paymentDate)}</p>
                  </div>
                  {selectedReservation.paymentImage && (
                    <div className="space-y-2 sm:col-span-2">
                      <span className="text-gray-600">رسید پرداخت:</span>
                      <a
                        href={selectedReservation.paymentImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <FaReceipt />
                        مشاهده رسید
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Notes */}
              {selectedReservation.adminNotes && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 border-2 border-yellow-200">
                  <h3 className="text-lg font-bold text-[#0A1D37] mb-4 flex items-center gap-2">
                    <FaIdCard className="text-[#4DBFF0]" />
                    یادداشت مدیر
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{selectedReservation.adminNotes}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl mb-12 sm:rounded-2xl p-5 sm:p-6 border-2 border-gray-200">
                <h3 className="text-lg font-bold text-[#0A1D37] mb-4">تاریخچه</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <span className="text-gray-600">تاریخ ثبت:</span>
                    <p className="font-medium text-[#0A1D37]">{formatDate(selectedReservation.createdAt)}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-gray-600">آخرین بروزرسانی:</span>
                    <p className="font-medium text-[#0A1D37]">{formatDate(selectedReservation.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 p-5 sm:p-6 border-t bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200 flex justify-between items-center gap-4">
              <div className="text-xs sm:text-sm text-gray-600">
                ℹ️ تمام اطلاعات محرمانه و ایمن نگهداری می‌شود
              </div>
              <button
                onClick={() => setShowReservationDetails(false)}
                className="px-6 py-2.5 sm:px-8 sm:py-3 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 text-sm sm:text-base"
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

export default CustomerHozoriList;