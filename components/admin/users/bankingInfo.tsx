"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FaSearch,
  FaCheck,
  FaTimes,
  FaEye,
  FaFilter,
  FaUniversity,
  FaUser,
} from "react-icons/fa";
import { showToast } from "@/utilities/toast";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface BankingInfo {
  _id: string;
  bankName: string;
  cardNumber: string;
  shebaNumber: string;
  accountHolderName: string;
  status: "accepted" | "rejected" | "pending_verification";
  rejectionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserBankingData {
  _id: string;
  bankingInfo: BankingInfo[];
  nationalCredentials?: {
    firstName?: string;
    lastName?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const BankingInfoAdmin = () => {
  const { isLoggedIn } = useCurrentUser();
  const [users, setUsers] = useState<UserBankingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Modal states
  const [selectedBankingInfo, setSelectedBankingInfo] = useState<{
    user: UserBankingData;
    bankingInfo: BankingInfo;
  } | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<"accepted" | "rejected">(
    "accepted"
  );
  const [rejectionNotes, setRejectionNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch banking data
  const fetchBankingData = async () => {
    if (!isLoggedIn) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        ...(searchTerm && { search: searchTerm }),
      });

      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/users/banckingifo?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("خطا در دریافت اطلاعات بانکی");
      }

      const data = await response.json();
      setUsers(data.bankingData);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای نامشخص");
    } finally {
      setLoading(false);
    }
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedBankingInfo) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/users/banckingifo", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedBankingInfo.user._id,
          bankingInfoId: selectedBankingInfo.bankingInfo._id,
          status: reviewStatus,
          rejectionNotes: reviewStatus === "rejected" ? rejectionNotes : "",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در به‌روزرسانی وضعیت");
      }

      showToast.success(
        reviewStatus === "accepted"
          ? "اطلاعات بانکی تایید شد"
          : "اطلاعات بانکی رد شد"
      );

      setShowReviewModal(false);
      setSelectedBankingInfo(null);
      setRejectionNotes("");
      await fetchBankingData();
    } catch (err) {
      showToast.error(
        err instanceof Error ? err.message : "خطا در به‌روزرسانی"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Effects
  useEffect(() => {
    if (isLoggedIn) {
      fetchBankingData();
    }
  }, [isLoggedIn, currentPage, searchTerm]);

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "text-green-700 bg-green-100 border-green-300";
      case "rejected":
        return "text-red-700 bg-red-100 border-red-300";
      case "pending_verification":
        return "text-yellow-700 bg-yellow-100 border-yellow-300";
      default:
        return "text-gray-700 bg-gray-100 border-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "accepted":
        return "تایید شده";
      case "rejected":
        return "رد شده";
      case "pending_verification":
        return "در انتظار بررسی";
      default:
        return "نامشخص";
    }
  };

  const formatCardNumber = (cardNumber: string) => {
    return cardNumber.replace(/(\d{4})(?=\d)/g, "$1-");
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "تاریخ نامشخص";
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "تاریخ نامشخص";
    }
  };

  const getUserName = (user: UserBankingData) => {
    const { firstName, lastName } = user.nationalCredentials || {};
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    return "نام نامشخص";
  };

  const openDetailsModal = (
    user: UserBankingData,
    bankingInfo: BankingInfo
  ) => {
    setSelectedBankingInfo({ user, bankingInfo });
    setShowDetailsModal(true);
  };

  const openReviewModal = (user: UserBankingData, bankingInfo: BankingInfo) => {
    setSelectedBankingInfo({ user, bankingInfo });
    setReviewStatus("accepted");
    setRejectionNotes("");
    setShowReviewModal(true);
  };

  // if (
  //   !currentUser?.roles.includes("admin") &&
  //   !currentUser?.roles.includes("super_admin")
  // ) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-bold text-gray-900 mb-2">
  //           دسترسی غیر مجاز
  //         </h2>
  //         <p className="text-gray-600">شما به این بخش دسترسی ندارید</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm  rounded-2xl p-2 mb-6">
          <div className="flex  flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0A1D37]" />
                <input
                  type="text"
                  placeholder="جستجو بر اساس نام، شماره کارت یا شبا..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-12 pl-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] transition-all"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {" "}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] transition-all"
              >
                <option value="">همه وضعیت‌ها</option>
                <option value="pending_verification">در انتظار بررسی</option>
                <option value="accepted">تایید شده</option>
                <option value="rejected">رد شده</option>
              </select>
              <button
                onClick={() => fetchBankingData()}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white rounded-xl hover:shadow-lg transition-all"
              >
                <FaFilter />
                اعمال فیلتر
              </button>
            </div>
          </div>
        </div>

        {/* Banking Data Table */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => fetchBankingData()}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              تلاش مجدد
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <FaUniversity className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">هیچ اطلاعات بانکی یافت نشد</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      کاربر
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      بانک
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      شماره کارت
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      وضعیت
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تاریخ ثبت
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) =>
                    user.bankingInfo.map((bankInfo) => (
                      <tr
                        key={`${user._id}-${bankInfo._id}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaUser className="text-gray-400 ml-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {getUserName(user)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {bankInfo.bankName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {bankInfo.accountHolderName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono text-gray-900">
                            {formatCardNumber(bankInfo.cardNumber)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {bankInfo.shebaNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                              bankInfo.status
                            )}`}
                          >
                            {getStatusText(bankInfo.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openDetailsModal(user, bankInfo)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <FaEye />
                            </button>
                            {bankInfo.status && (
                              <>
                                <button
                                  onClick={() =>
                                    openReviewModal(user, bankInfo)
                                  }
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <FaCheck />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  صفحه {pagination.currentPage} از {pagination.totalPages}{" "}
                  (مجموع {pagination.totalUsers} مورد)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={!pagination.hasPreviousPage}
                    className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    قبلی
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(pagination.totalPages, prev + 1)
                      )
                    }
                    disabled={!pagination.hasNextPage}
                    className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    بعدی
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal &&
        selectedBankingInfo &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            dir="rtl"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 border-b border-gray-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] rounded-full flex items-center justify-center">
                    <FaUniversity className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#0A1D37]">
                      جزئیات اطلاعات بانکی
                    </h2>
                    <p className="text-sm text-gray-600">
                      مشاهده کامل اطلاعات بانکی کاربر
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* User Info Card */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <FaUser className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-blue-800">
                        {getUserName(selectedBankingInfo.user)}
                      </h3>
                      <p className="text-sm text-blue-600">
                        شناسه کاربر: {selectedBankingInfo.user._id.slice(-8)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Banking Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4">
                    <label className="text-sm font-medium text-[#0A1D37] flex items-center gap-2">
                      <FaUniversity className="text-xs" />
                      نام بانک
                    </label>
                    <div className="text-[#0A1D37] font-semibold mt-1">
                      {selectedBankingInfo.bankingInfo.bankName}
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4">
                    <label className="text-sm font-medium text-[#0A1D37] flex items-center gap-2">
                      <FaUser className="text-xs" />
                      نام صاحب حساب
                    </label>
                    <div className="text-[#0A1D37] font-semibold mt-1">
                      {selectedBankingInfo.bankingInfo.accountHolderName}
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4">
                    <label className="text-sm font-medium text-[#0A1D37]">
                      شماره کارت
                    </label>
                    <div className="text-[#0A1D37] font-mono font-semibold mt-1">
                      {formatCardNumber(
                        selectedBankingInfo.bankingInfo.cardNumber
                      )}
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4">
                    <label className="text-sm font-medium text-[#0A1D37]">
                      شماره شبا
                    </label>
                    <div className="text-[#0A1D37] font-mono font-semibold mt-1">
                      {selectedBankingInfo.bankingInfo.shebaNumber}
                    </div>
                  </div>
                </div>

                {/* Status Card */}
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4">
                  <label className="text-sm font-medium text-[#0A1D37] mb-3 block">
                    وضعیت اطلاعات
                  </label>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        selectedBankingInfo.bankingInfo.status
                      )}`}
                    >
                      {getStatusText(selectedBankingInfo.bankingInfo.status)}
                    </span>
                    <span className="text-sm text-gray-600">
                      ثبت شده در:{" "}
                      {formatDateTime(selectedBankingInfo.user.createdAt)}
                    </span>
                  </div>
                </div>

                {selectedBankingInfo.bankingInfo.rejectionNotes && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <label className="text-sm font-medium text-red-700 flex items-center gap-2 mb-2">
                      <FaTimes className="text-xs" />
                      دلیل رد اطلاعات
                    </label>
                    <div className="bg-white/80 border border-red-200/50 rounded-lg p-3 text-red-800">
                      {selectedBankingInfo.bankingInfo.rejectionNotes}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200/50 flex justify-end gap-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                >
                  <FaTimes className="text-sm" />
                  بستن
                </button>
                {selectedBankingInfo.bankingInfo.status ===
                  "pending_verification" && (
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      openReviewModal(
                        selectedBankingInfo.user,
                        selectedBankingInfo.bankingInfo
                      );
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white rounded-xl hover:shadow-lg transition-all"
                  >
                    <FaCheck className="text-sm" />
                    بررسی و تایید
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Review Modal */}
      {showReviewModal &&
        selectedBankingInfo &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            dir="rtl"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl max-w-xl w-full shadow-2xl">
              <div className="p-6 border-b border-gray-200/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <FaCheck className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#0A1D37]">
                      بررسی اطلاعات بانکی
                    </h2>
                    <p className="text-sm text-gray-600">
                      تایید یا رد اطلاعات بانکی کاربر
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <FaUser className="text-blue-600" />
                    <span className="font-medium text-blue-800">
                      اطلاعات کاربر
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-blue-600 font-medium">کاربر:</span>{" "}
                      <span className="text-blue-900">
                        {selectedBankingInfo.bankingInfo.accountHolderName}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600 font-medium">بانک:</span>{" "}
                      <span className="text-blue-900">
                        {selectedBankingInfo.bankingInfo.bankName}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600 font-medium">کارت:</span>{" "}
                      <span className="text-blue-900 font-mono">
                        {formatCardNumber(
                          selectedBankingInfo.bankingInfo.cardNumber
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-600 font-medium">شبا:</span>{" "}
                      <span className="text-blue-900 font-mono">
                        {selectedBankingInfo.bankingInfo.shebaNumber}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4">
                  <label className="block text-sm font-medium text-[#0A1D37] mb-4">
                    تصمیم نهایی
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        reviewStatus === "accepted"
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-green-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="reviewStatus"
                        value="accepted"
                        checked={reviewStatus === "accepted"}
                        onChange={(e) =>
                          setReviewStatus(
                            e.target.value as "accepted" | "rejected"
                          )
                        }
                        className="hidden"
                      />
                      <FaCheck
                        className={
                          reviewStatus === "accepted"
                            ? "text-green-600"
                            : "text-gray-400"
                        }
                      />
                      <span className="font-medium">تایید</span>
                    </label>
                    <label
                      className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        reviewStatus === "rejected"
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-red-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="reviewStatus"
                        value="rejected"
                        checked={reviewStatus === "rejected"}
                        onChange={(e) =>
                          setReviewStatus(
                            e.target.value as "accepted" | "rejected"
                          )
                        }
                        className="hidden"
                      />
                      <FaTimes
                        className={
                          reviewStatus === "rejected"
                            ? "text-red-600"
                            : "text-gray-400"
                        }
                      />
                      <span className="font-medium">رد</span>
                    </label>
                  </div>
                </div>

                {reviewStatus === "rejected" && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <label className="flex items-center gap-2 text-sm font-medium text-red-700 mb-3">
                      <FaTimes className="text-xs" />
                      دلیل رد اطلاعات *
                    </label>
                    <textarea
                      value={rejectionNotes}
                      onChange={(e) => setRejectionNotes(e.target.value)}
                      className="w-full px-4 py-3 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white transition-all"
                      rows={4}
                      placeholder="لطفاً دلیل رد اطلاعات بانکی را به صورت واضح و مفصل توضیح دهید..."
                      required
                    />
                    <p className="text-xs text-red-600 mt-2">
                      این توضیحات برای کاربر ارسال خواهد شد
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200/50 flex justify-end gap-3">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                >
                  <FaTimes className="text-sm" />
                  انصراف
                </button>
                <button
                  onClick={handleStatusUpdate}
                  disabled={
                    submitting ||
                    (reviewStatus === "rejected" && !rejectionNotes.trim())
                  }
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    reviewStatus === "accepted"
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg"
                      : "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-lg"
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      در حال پردازش...
                    </>
                  ) : (
                    <>
                      {reviewStatus === "accepted" ? (
                        <FaCheck className="text-sm" />
                      ) : (
                        <FaTimes className="text-sm" />
                      )}
                      {reviewStatus === "accepted"
                        ? "تایید اطلاعات"
                        : "رد اطلاعات"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default BankingInfoAdmin;
