"use client";
import React, { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { showToast } from "@/utilities/toast";
import {
  FaUsers,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaUser,
  FaChild,
  FaIdCard,
  FaMapMarkerAlt,
  FaPhone,
  FaCreditCard,
  FaMoneyBillWave,
  FaReceipt,
  FaHeart,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
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

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

const HozoriAdminList = () => {
  const { user: currentUser, isLoggedIn } = useCurrentUser();
  const [reservations, setReservations] = useState<HozoriReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
  });

  // Filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal states
  const [selectedReservation, setSelectedReservation] =
    useState<HozoriReservation | null>(null);
  const [showReservationDetails, setShowReservationDetails] = useState(false);
  const [showEditReservation, setShowEditReservation] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    status: "",
    adminNotes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch hozori reservations for admin
  const fetchReservations = async () => {
    if (!isLoggedIn) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        admin: "true", // Flag to fetch all reservations
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
      });

      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/hozori?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("خطا در دریافت اطلاعات رزروها");
      }

      const data = await response.json();
      setReservations(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای نامشخص");
    } finally {
      setLoading(false);
    }
  };

  // Update reservation status
  const updateReservationStatus = async (
    id: string,
    status: string,
    adminNotes?: string
  ) => {
    setSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/hozori", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status,
          adminNotes,
          admin: true, // Flag for admin update
        }),
      });

      if (!response.ok) {
        throw new Error("خطا در به‌روزرسانی رزرو");
      }

      showToast.success("وضعیت رزرو با موفقیت به‌روزرسانی شد");
      fetchReservations();
      setShowEditReservation(false);
    } catch (err) {
      showToast.error(
        err instanceof Error ? err.message : "خطا در به‌روزرسانی"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Delete reservation
  const deleteReservation = async (id: string) => {
    setSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/hozori?id=${id}&admin=true`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("خطا در حذف رزرو");
      }

      showToast.success("رزرو با موفقیت حذف شد");
      fetchReservations();
      setShowDeleteConfirm(false);
    } catch (err) {
      showToast.error(err instanceof Error ? err.message : "خطا در حذف");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    fetchReservations();
  };

  // Handle status filter change
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  // Open edit modal
  const openEditModal = (reservation: HozoriReservation) => {
    setSelectedReservation(reservation);
    setEditForm({
      status: reservation.status,
      adminNotes: "",
    });
    setShowEditReservation(true);
  };

  // Open delete confirmation
  const openDeleteConfirm = (reservation: HozoriReservation) => {
    setSelectedReservation(reservation);
    setShowDeleteConfirm(true);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR");
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        label: "در انتظار",
        color: "bg-yellow-100 text-yellow-800",
        icon: FaHourglassHalf,
      },
      confirmed: {
        label: "تأیید شده",
        color: "bg-green-100 text-green-800",
        icon: FaCheckCircle,
      },
      completed: {
        label: "تکمیل شده",
        color: "bg-blue-100 text-blue-800",
        icon: FaCheck,
      },
      cancelled: {
        label: "لغو شده",
        color: "bg-red-100 text-red-800",
        icon: FaTimesCircle,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  // Get payment type badge
  const getPaymentTypeBadge = (paymentType: string) => {
    const paymentConfig = {
      wallet: { label: "کیف پول", color: "bg-purple-100 text-purple-800" },
      direct: { label: "پرداخت مستقیم", color: "bg-blue-100 text-blue-800" },
      card: { label: "کارت", color: "bg-green-100 text-green-800" },
    };

    const config =
      paymentConfig[paymentType as keyof typeof paymentConfig] ||
      paymentConfig.direct;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  useEffect(() => {
    fetchReservations();
  }, [currentPage, pageSize, statusFilter, isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-gray-600">برای مشاهده این صفحه باید وارد شوید</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#0A1D37] mb-2">
              مدیریت رزروهای حضوری
            </h2>
            <p className="text-gray-600">
              مجموع {pagination.totalCount} رزرو ثبت شده
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchReservations}
              className="px-4 py-2 bg-[#4DBFF0] text-white rounded-lg hover:bg-[#4DBFF0]/90 transition-colors"
            >
              بروزرسانی
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="جستجو بر اساس نام، نام خانوادگی یا شماره تلفن"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBFF0] focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBFF0] focus:border-transparent"
          >
            <option value="">همه وضعیت‌ها</option>
            <option value="pending">در انتظار</option>
            <option value="confirmed">تأیید شده</option>
            <option value="completed">تکمیل شده</option>
            <option value="cancelled">لغو شده</option>
          </select>

          {/* Page Size */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBFF0] focus:border-transparent"
          >
            <option value={10}>10 رزرو در صفحه</option>
            <option value={25}>25 رزرو در صفحه</option>
            <option value={50}>50 رزرو در صفحه</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="mt-4">
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-[#0A1D37] text-white rounded-lg hover:bg-[#0A1D37]/90 transition-colors"
          >
            جستجو
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4DBFF0]"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Reservations Table */}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    اطلاعات متقاضی
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاریخ و زمان
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    خانواده
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    پرداخت
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    وضعیت
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reservations.map((reservation) => (
                  <tr key={reservation._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] flex items-center justify-center">
                            <FaUser className="text-white text-sm" />
                          </div>
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">
                            {reservation.name} {reservation.lastname}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaPhone className="w-3 h-3 mr-1" />
                            {reservation.phoneNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-y-1 flex-col">
                        <div className="flex items-center">
                          <FaCalendarAlt className="w-3 h-3 mr-1 text-gray-400" />
                          {formatDate(reservation.Date)}
                        </div>
                        <div className="flex items-center">
                          <FaClock className="w-3 h-3 mr-1 text-gray-400" />
                          {reservation.time}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <FaHeart className="w-3 h-3 mr-1 text-gray-400" />
                          {reservation.maridgeStatus === "married"
                            ? "متأهل"
                            : "مجرد"}
                        </div>
                        <div className="flex items-center">
                          <FaChild className="w-3 h-3 mr-1 text-gray-400" />
                          {reservation.childrensCount} فرزند
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {getPaymentTypeBadge(reservation.paymentType)}
                        <div className="text-xs text-gray-500">
                          {formatDate(reservation.paymentDate)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(reservation.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2 space-x-reverse">
                        <button
                          onClick={() => {
                            setSelectedReservation(reservation);
                            setShowReservationDetails(true);
                          }}
                          className="text-[#4DBFF0] hover:text-[#4DBFF0]/80 p-2 rounded"
                          title="مشاهده جزئیات"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => openEditModal(reservation)}
                          className="text-[#0A1D37] hover:text-[#0A1D37]/80 p-2 rounded"
                          title="ویرایش"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(reservation)}
                          className="text-red-600 hover:text-red-800 p-2 rounded"
                          title="حذف"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  قبلی
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="mr-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  بعدی
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    نمایش{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * pageSize + 1}
                    </span>{" "}
                    تا{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * pageSize, pagination.totalCount)}
                    </span>{" "}
                    از{" "}
                    <span className="font-medium">{pagination.totalCount}</span>{" "}
                    رزرو
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      قبلی
                    </button>
                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1
                    )
                      .slice(
                        Math.max(0, currentPage - 3),
                        Math.min(pagination.totalPages, currentPage + 2)
                      )
                      .map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === currentPage
                              ? "z-10 bg-[#4DBFF0] border-[#4DBFF0] text-white"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      بعدی
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* No Data Message */}
      {!loading && !error && reservations.length === 0 && (
        <div className="text-center py-12">
          <FaUsers className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            رزروی یافت نشد
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter
              ? "با فیلترهای اعمال شده، رزروی یافت نشد"
              : "هنوز هیچ رزروی ثبت نشده است"}
          </p>
        </div>
      )}

      {/* Reservation Details Modal */}
      {showReservationDetails && selectedReservation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#0A1D37]">جزئیات رزرو</h3>
              <button
                onClick={() => setShowReservationDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FaUser className="w-4 h-4 mr-2" />
                  اطلاعات شخصی
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">نام:</span>
                    <span className="font-medium mr-2">
                      {selectedReservation.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">نام خانوادگی:</span>
                    <span className="font-medium mr-2">
                      {selectedReservation.lastname}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">شماره تلفن:</span>
                    <span className="font-medium mr-2">
                      {selectedReservation.phoneNumber}
                    </span>
                  </div>
                </div>
              </div>

              {/* Family Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FaHeart className="w-4 h-4 mr-2" />
                  اطلاعات خانوادگی
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">وضعیت تأهل:</span>
                    <span className="font-medium mr-2">
                      {selectedReservation.maridgeStatus === "married"
                        ? "متأهل"
                        : "مجرد"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">تعداد فرزندان:</span>
                    <span className="font-medium mr-2">
                      {selectedReservation.childrensCount} نفر
                    </span>
                  </div>
                </div>
              </div>

              {/* Appointment Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FaCalendarAlt className="w-4 h-4 mr-2" />
                  اطلاعات نوبت
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">تاریخ:</span>
                    <span className="font-medium mr-2">
                      {formatDate(selectedReservation.Date)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">زمان:</span>
                    <span className="font-medium mr-2">
                      {selectedReservation.time}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FaMoneyBillWave className="w-4 h-4 mr-2" />
                  اطلاعات پرداخت
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">روش پرداخت:</span>
                    {getPaymentTypeBadge(selectedReservation.paymentType)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">تاریخ پرداخت:</span>
                    <span className="font-medium">
                      {formatDate(selectedReservation.paymentDate)}
                    </span>
                  </div>
                  {selectedReservation.paymentImage && (
                    <div>
                      <span className="text-gray-600">رسید پرداخت:</span>
                      <a
                        href={selectedReservation.paymentImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        مشاهده رسید
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">وضعیت رزرو</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>{getStatusBadge(selectedReservation.status)}</div>
                    <div className="text-sm text-gray-600">
                      ثبت شده در: {formatDate(selectedReservation.createdAt)}
                    </div>
                  </div>
                  {(selectedReservation as HozoriReservation).adminNotes && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-blue-900 mb-1">
                        یادداشت مدیر:
                      </div>
                      <div className="text-sm text-blue-800">
                        {(selectedReservation as HozoriReservation).adminNotes}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowReservationDetails(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                بستن
              </button>
              <button
                onClick={() => {
                  setShowReservationDetails(false);
                  openEditModal(selectedReservation);
                }}
                className="px-4 py-2 bg-[#4DBFF0] text-white rounded-lg hover:bg-[#4DBFF0]/90 transition-colors"
              >
                ویرایش
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Reservation Modal */}
      {showEditReservation && selectedReservation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#0A1D37]">ویرایش رزرو</h3>
              <button
                onClick={() => setShowEditReservation(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وضعیت رزرو
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBFF0] focus:border-transparent"
                >
                  <option value="pending">در انتظار</option>
                  <option value="confirmed">تأیید شده</option>
                  <option value="completed">تکمیل شده</option>
                  <option value="cancelled">لغو شده</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  یادداشت مدیر
                </label>
                <textarea
                  value={editForm.adminNotes}
                  onChange={(e) =>
                    setEditForm({ ...editForm, adminNotes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBFF0] focus:border-transparent"
                  placeholder="یادداشت اختیاری مدیر..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditReservation(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={() =>
                  updateReservationStatus(
                    selectedReservation._id,
                    editForm.status,
                    editForm.adminNotes
                  )
                }
                disabled={submitting}
                className="px-4 py-2 bg-[#4DBFF0] text-white rounded-lg hover:bg-[#4DBFF0]/90 transition-colors disabled:opacity-50"
              >
                {submitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedReservation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-red-600">حذف رزرو</h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                آیا از حذف رزرو{" "}
                <span className="font-bold">
                  {selectedReservation.name} {selectedReservation.lastname}
                </span>{" "}
                اطمینان دارید؟
              </p>
              <p className="text-red-600 text-sm">
                این عمل قابل بازگشت نیست و تمام اطلاعات رزرو حذف خواهد شد.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={() => deleteReservation(selectedReservation._id)}
                disabled={submitting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {submitting ? "در حال حذف..." : "حذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HozoriAdminList;
