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
  FaEdit,
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

  if (!isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center space-y-4 bg-white p-8 sm:p-12 rounded-2xl shadow-lg border border-gray-100 max-w-md">
          <div className="w-20 h-20 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] rounded-full flex items-center justify-center mx-auto">
            <FaUser className="text-white text-3xl" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0A1D37]">
            ورود به سیستم لازم است
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            لطفاً برای مشاهده رزروهای خود وارد حساب کاربری شوید
          </p>
          <a
            href="/auth/sms"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            ورود به سیستم
          </a>
        </div>
      </div>
    );
  }

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
            href="/lottery/form/hozori"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
          >
            <FaPlus className="text-lg" />
            رزرو وقت حضوری
          </a>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-5">
          {reservations.map((reservation) => (
            <div
              key={reservation._id}
              className="group bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-200 p-5 sm:p-6 hover:shadow-xl hover:border-[#0A1D37]/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
                {/* Left Section - Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FaCalendarCheck className="text-white text-xl sm:text-2xl" />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h3 className="text-lg sm:text-xl font-bold text-[#0A1D37] group-hover:text-[#4DBFF0] transition-colors duration-300">
                        {reservation.name} {reservation.lastname}
                      </h3>
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs sm:text-sm font-medium ${getStatusColor(reservation.status)}`}>
                        {getStatusIcon(reservation.status)}
                        {getStatusText(reservation.status)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-[#4DBFF0] flex-shrink-0" />
                        <span className="text-gray-600">تاریخ:</span>
                        <span className="font-medium text-[#0A1D37]">
                          {formatDate(reservation.Date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaClock className="text-[#4DBFF0] flex-shrink-0" />
                        <span className="text-gray-600">زمان:</span>
                        <span className="font-medium text-[#0A1D37]">
                          {formatTime(reservation.time)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaPhone className="text-[#4DBFF0] flex-shrink-0" />
                        <span className="text-gray-600">تلفن:</span>
                        <span className="font-medium text-[#0A1D37]">
                          {reservation.phoneNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaHeart className="text-[#4DBFF0] flex-shrink-0" />
                        <span className="text-gray-600">وضعیت تأهل:</span>
                        <span className="font-medium text-[#0A1D37]">
                          {reservation.maridgeStatus === "married" ? "متأهل" : "مجرد"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaChild className="text-[#4DBFF0] flex-shrink-0" />
                        <span className="text-gray-600">فرزندان:</span>
                        <span className="font-medium text-[#0A1D37]">
                          {reservation.childrensCount} نفر
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMoneyBillWave className="text-[#4DBFF0] flex-shrink-0" />
                        <span className="text-gray-600">پرداخت:</span>
                        {getPaymentTypeBadge(reservation.paymentType)}
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      رزرو شده در: {formatDate(reservation.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Right Section - Action */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openReservationDetails(reservation)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white font-medium rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 text-sm"
                  >
                    <FaEye className="text-sm" />
                    جزئیات
                  </button>
                </div>
              </div>

              {/* Admin Notes */}
              {reservation.adminNotes && (
                <div className="mt-5 p-4 bg-blue-50 border-r-4 border-blue-500 rounded-lg animate-in slide-in-from-top duration-300">
                  <div className="flex items-start gap-3">
                    <FaIdCard className="text-blue-500 text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-blue-900 text-sm mb-1">
                        یادداشت مدیر
                      </p>
                      <p className="text-blue-800 text-sm leading-relaxed">
                        {reservation.adminNotes}
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 border-2 border-gray-200">
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