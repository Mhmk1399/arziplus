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
  // Payment information
  paymentMethod?: "card" | "direct";
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
      yearOfBirth: string;
      monthOfBirth: string;
      dayOfBirth: string;
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
      yearOfBirth: string;
      monthOfBirth: string;
      dayOfBirth: string;
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
      yearOfBirth: string;
      monthOfBirth: string;
      dayOfBirth: string;
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

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const LotteryAdminList = () => {
  const { user: currentUser, isLoggedIn } = useCurrentUser();
  const [lotteries, setLotteries] = useState<LotteryRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  // Filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal states
  const [selectedLottery, setSelectedLottery] = useState<LotteryRegistration | null>(null);
  const [showLotteryDetails, setShowLotteryDetails] = useState(false);
  const [showEditLottery, setShowEditLottery] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    status: "",
    rejectionReason: "",
    adminNotes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch lottery registrations
  const fetchLotteries = async () => {
    if (!isLoggedIn) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
      });

      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/lottery?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("خطا در دریافت اطلاعات ثبت‌نام‌ها");
      }

      const data = await response.json();
      setLotteries(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای نامشخص");
    } finally {
      setLoading(false);
    }
  };

  // Delete lottery registration
  const handleDeleteLottery = async (lotteryId: string) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این ثبت‌نام را حذف کنید؟")) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/lottery?id=${lotteryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "خطا در حذف ثبت‌نام");
      }

      showToast.success("ثبت‌نام با موفقیت حذف شد");
      await fetchLotteries();
    } catch (err) {
      showToast.error(err instanceof Error ? err.message : "خطا در حذف ثبت‌نام");
    }
  };

  // Update lottery status
  const handleUpdateLottery = async () => {
    if (!selectedLottery) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/lottery", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedLottery._id,
          status: editForm.status,
          rejectionReason: editForm.rejectionReason,
          adminNotes: editForm.adminNotes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "خطا در به‌روزرسانی ثبت‌نام");
      }

      showToast.success("وضعیت ثبت‌نام با موفقیت به‌روزرسانی شد");
      setShowEditLottery(false);
      await fetchLotteries();
    } catch (err) {
      showToast.error(
        err instanceof Error ? err.message : "خطا در به‌روزرسانی"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Quick status updates
  const handleQuickStatusUpdate = async (
    lotteryId: string,
    newStatus: string,
    rejectionReason?: string
  ) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/lottery", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: lotteryId,
          status: newStatus,
          ...(rejectionReason && { rejectionReason }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "خطا در به‌روزرسانی وضعیت");
      }

      showToast.success("وضعیت با موفقیت به‌روزرسانی شد");
      await fetchLotteries();
    } catch (err) {
      showToast.error(
        err instanceof Error ? err.message : "خطا در به‌روزرسانی وضعیت"
      );
    }
  };

  // Effects
  useEffect(() => {
    if (isLoggedIn) {
      fetchLotteries();
    }
  }, [isLoggedIn, currentPage, pageSize, searchTerm, statusFilter]);

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

  const getRegistererName = (lottery: LotteryRegistration) => {
    const registerer = lottery.registererInformations[0];
    if (registerer?.initialInformations) {
      const { firstName, lastName } = registerer.initialInformations;
      return `${firstName || ""} ${lastName || ""}`.trim() || "نام نامشخص";
    }
    return "نام نامشخص";
  };

  const getRegistererEmail = (lottery: LotteryRegistration) => {
    const registerer = lottery.registererInformations[0];
    return registerer?.contactInformations[0]?.email || "ایمیل نامشخص";
  };

  const openLotteryDetails = (lottery: LotteryRegistration) => {
    setSelectedLottery(lottery);
    setShowLotteryDetails(true);
  };

  const openEditLottery = (lottery: LotteryRegistration) => {
    setSelectedLottery(lottery);
    setEditForm({
      status: lottery.status,
      rejectionReason: lottery.rejectionReason || "",
      adminNotes: lottery.adminNotes || "",
    });
    setShowEditLottery(true);
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

  if (
    !currentUser?.roles.includes("admin") &&
    !currentUser?.roles.includes("super_admin")
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            دسترسی غیر مجاز
          </h2>
          <p className="text-gray-600">شما به این بخش دسترسی ندارید</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" " dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaUsers className="text-3xl text-[#FF7A00]" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  مدیریت ثبت‌نام‌های لاتاری
                </h1>
                <p className="text-gray-600">
                  مشاهده و مدیریت درخواست‌های ثبت‌نام در قرعه‌کشی گرین کارت
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                جستجو
              </label>
              <div className="relative">
                <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="جستجو بر اساس نام، ایمیل یا کشور..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وضعیت
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00]"
              >
                <option value="">همه وضعیت‌ها</option>
                <option value="pending">در انتظار بررسی</option>
                <option value="in_review">در حال بررسی</option>
                <option value="approved">تایید شده</option>
                <option value="rejected">رد شده</option>
                <option value="completed">تکمیل شده</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تعداد نمایش
              </label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00]"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lottery Registrations Table */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7A00] mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => fetchLotteries()}
              className="mt-4 px-4 py-2 bg-[#FF7A00] text-white rounded-lg hover:bg-[#FF7A00]/90"
            >
              تلاش مجدد
            </button>
          </div>
        ) : lotteries.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <FaUsers className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">هیچ ثبت‌نامی یافت نشد</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      متقاضی
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      اطلاعات خانوادگی
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      وضعیت پرداخت
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      وضعیت
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تاریخ ثبت‌نام
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lotteries.map((lottery) => (
                    <tr key={lottery._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] flex items-center justify-center">
                              <FaUser className="text-white text-sm" />
                            </div>
                          </div>
                          <div className="mr-4">
                            <div className="text-sm font-medium text-gray-900">
                              {getRegistererName(lottery)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {getRegistererEmail(lottery)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center gap-2 mb-1">
                            {lottery.famillyInformations[0]?.maridgeState ? (
                              <FaHeart className="text-pink-500 text-xs" />
                            ) : (
                              <FaUser className="text-gray-400 text-xs" />
                            )}
                            <span>
                              {lottery.famillyInformations[0]?.maridgeState
                                ? "متأهل"
                                : "مجرد"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaChild className="text-blue-500 text-xs" />
                            <span>
                              {lottery.famillyInformations[0]?.numberOfChildren || 0} فرزند
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center gap-2 mb-1">
                            {lottery.isPaid ? (
                              <>
                                <FaCheck className="text-green-500 text-xs" />
                                <span className="text-green-700 font-medium">پرداخت شده</span>
                              </>
                            ) : (
                              <>
                                <FaTimes className="text-red-500 text-xs" />
                                <span className="text-red-700 font-medium">پرداخت نشده</span>
                              </>
                            )}
                          </div>
                          {lottery.paymentMethod && (
                            <div className="flex items-center gap-2">
                              {lottery.paymentMethod === "card" ? (
                                <FaCreditCard className="text-blue-500 text-xs" />
                              ) : (
                                <FaMoneyBillWave className="text-green-500 text-xs" />
                              )}
                              <span className="text-gray-600 text-xs">
                                {lottery.paymentMethod === "card" ? "کارت" : "زرین‌پال"}
                              </span>
                            </div>
                          )}
                          {lottery.paymentAmount && (
                            <div className="text-xs text-gray-500 mt-1">
                              {lottery.paymentAmount.toLocaleString("fa-IR")} تومان
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                            lottery.status
                          )}`}
                        >
                          {getStatusText(lottery.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(lottery.submittedAt).toLocaleDateString("fa-IR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openLotteryDetails(lottery)}
                            className="text-[#4DBFF0] hover:text-[#4DBFF0]/80 p-1 rounded"
                            title="مشاهده جزئیات"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => openEditLottery(lottery)}
                            className="text-[#FF7A00] hover:text-[#FF7A00]/80 p-1 rounded"
                            title="ویرایش"
                          >
                            <FaEdit />
                          </button>
                          {lottery.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleQuickStatusUpdate(lottery._id, "approved")
                                }
                                className="text-green-600 hover:text-green-800 p-1 rounded"
                                title="تایید"
                              >
                                <FaCheck />
                              </button>
                              <button
                                onClick={() => {
                                  const reason = prompt("دلیل رد:");
                                  if (reason) {
                                    handleQuickStatusUpdate(
                                      lottery._id,
                                      "rejected",
                                      reason
                                    );
                                  }
                                }}
                                className="text-red-600 hover:text-red-800 p-1 rounded"
                                title="رد"
                              >
                                <FaTimes />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteLottery(lottery._id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded"
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
            {pagination.pages > 1 && (
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  صفحه {pagination.page} از {pagination.pages} (مجموع{" "}
                  {pagination.total} ثبت‌نام)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={pagination.page === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    قبلی
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(pagination.pages, prev + 1)
                      )
                    }
                    disabled={pagination.page === pagination.pages}
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

      {/* Lottery Details Modal */}
      {showLotteryDetails && selectedLottery && (
        <div className="fixed inset-0 h-screen overflow-hidden bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-6xl max-h-screen overflow-hidden shadow-2xl border border-[#FF7A00]/20">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gray-50 border-[#FF7A00]/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#FF7A00] rounded-full flex items-center justify-center">
                  <FaUsers className="text-white text-sm" />
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
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(
                        selectedLottery.status
                      )}`}
                    >
                      {getStatusText(selectedLottery.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">تاریخ ثبت‌نام</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(selectedLottery.submittedAt).toLocaleDateString(
                        "fa-IR"
                      )}
                    </p>
                  </div>
                  {selectedLottery.reviewedAt && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">تاریخ بررسی</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(selectedLottery.reviewedAt).toLocaleDateString(
                          "fa-IR"
                        )}
                      </p>
                    </div>
                  )}
                  {selectedLottery.reviewedBy && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">بررسی شده توسط</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedLottery.reviewedBy.nationalCredentials?.firstName}{" "}
                        {selectedLottery.reviewedBy.nationalCredentials?.lastName}
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

              {/* Payment Information */}
              <div className="bg-gray-50 rounded-xl p-4 border border-[#0A1D37]/10">
                <h3 className="text-base sm:text-lg font-semibold text-[#0A1D37] mb-3 flex items-center gap-2">
                  <FaCreditCard className="text-green-500" />
                  اطلاعات پرداخت
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">وضعیت پرداخت</p>
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${
                        selectedLottery.isPaid
                          ? "text-green-700 bg-green-100 border-green-300"
                          : "text-red-700 bg-red-100 border-red-300"
                      }`}
                    >
                      {selectedLottery.isPaid ? "پرداخت شده" : "پرداخت نشده"}
                    </span>
                  </div>
                  {selectedLottery.paymentMethod && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">روش پرداخت</p>
                      <div className="flex items-center gap-2">
                        {selectedLottery.paymentMethod === "card" ? (
                          <FaCreditCard className="text-blue-500 text-sm" />
                        ) : (
                          <FaMoneyBillWave className="text-green-500 text-sm" />
                        )}
                        <p className="text-sm font-medium text-gray-900">
                          {selectedLottery.paymentMethod === "card" ? "کارت به کارت" : "پرداخت مستقیم (زرین‌پال)"}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedLottery.paymentAmount && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">مبلغ پرداخت</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedLottery.paymentAmount.toLocaleString("fa-IR")} تومان
                      </p>
                    </div>
                  )}
                  {selectedLottery.paymentDate && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">تاریخ پرداخت</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(selectedLottery.paymentDate).toLocaleDateString("fa-IR")}
                      </p>
                    </div>
                  )}
                  {selectedLottery.authority && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">شناسه پرداخت</p>
                      <p className="text-sm font-medium text-gray-900 font-mono">
                        {selectedLottery.authority}
                      </p>
                    </div>
                  )}
                  {selectedLottery.refId && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">شماره پیگیری</p>
                      <p className="text-sm font-medium text-gray-900 font-mono">
                        {selectedLottery.refId}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Payment Receipt Image */}
                {selectedLottery.receiptUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                      <FaReceipt className="text-blue-500" />
                      رسید پرداخت
                    </p>
                    <div className="bg-white rounded-lg border border-gray-200 p-3">
                      <img
                        src={selectedLottery.receiptUrl}
                        alt="رسید پرداخت"
                        className="max-w-full h-auto max-h-64 rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(selectedLottery.receiptUrl, '_blank')}
                        onError={(e) => {
                          console.error('Error loading receipt image:', selectedLottery.receiptUrl);
                          (e.target as HTMLImageElement).style.display = 'none';
                          const errorDiv = document.createElement('div');
                          errorDiv.innerHTML = '<p class="text-red-500 text-sm">خطا در بارگذاری تصویر</p>';
                          (e.target as HTMLImageElement).parentNode?.appendChild(errorDiv);
                        }}
                        onLoad={() => console.log('Receipt image loaded successfully')}
                      />
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs text-gray-500">کلیک کنید برای مشاهده تمام صفحه</p>
                        <button
                          onClick={() => window.open(selectedLottery.receiptUrl, '_blank')}
                          className="text-xs text-[#FF7A00] hover:text-[#FF7A00]/80 font-medium"
                        >
                          مشاهده اصل تصویر
                        </button>
                      </div>
                    </div>
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
                      {selectedLottery.famillyInformations[0]?.maridgeState
                        ? "متأهل"
                        : "مجرد"}
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
                      {selectedLottery.famillyInformations[0]?.towPeopleRegistration
                        ? "بله"
                        : "خیر"}
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
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        اطلاعات اولیه
                      </h4>
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
                            {selectedLottery.registererInformations[0].initialInformations.dayOfBirth}/
                            {selectedLottery.registererInformations[0].initialInformations.monthOfBirth}/
                            {selectedLottery.registererInformations[0].initialInformations.yearOfBirth}
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
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          فرزند {index + 1}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">نام</p>
                            <p className="text-sm font-medium">
                              {child.initialInformations.firstName}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">نام خانوادگی</p>
                            <p className="text-sm font-medium">
                              {child.initialInformations.lastName}
                            </p>
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
            <div className="p-4 sm:p-6 border-t border-[#0A1D37]/10 bg-gray-50 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setShowLotteryDetails(false)}
                className="w-full sm:w-auto px-4 py-2 text-[#0A1D37] border border-[#0A1D37]/20 rounded-lg hover:bg-gray-100 transition-colors"
              >
                بستن
              </button>
              <button
                onClick={() => {
                  setShowLotteryDetails(false);
                  openEditLottery(selectedLottery);
                }}
                className="w-full sm:w-auto px-4 py-2 bg-[#FF7A00] text-white rounded-lg hover:bg-[#FF7A00]/90 transition-colors"
              >
                ویرایش وضعیت
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Lottery Modal */}
      {showEditLottery && selectedLottery && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-[#0A1D37]/10">
            <div className="p-4 sm:p-6 border-b border-[#0A1D37]/10">
              <h2 className="text-xl font-bold text-[#0A1D37] flex items-center gap-3">
                <span className="w-3 h-3 bg-[#FF7A00] rounded-full"></span>
                ویرایش وضعیت ثبت‌نام
              </h2>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وضعیت
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-[#0A1D37]/20 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-colors"
                >
                  <option value="pending">در انتظار بررسی</option>
                  <option value="in_review">در حال بررسی</option>
                  <option value="approved">تایید شده</option>
                  <option value="rejected">رد شده</option>
                  <option value="completed">تکمیل شده</option>
                </select>
              </div>

              {editForm.status === "rejected" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    دلیل رد
                  </label>
                  <textarea
                    value={editForm.rejectionReason}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        rejectionReason: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-[#0A1D37]/20 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-colors resize-none"
                    rows={3}
                    placeholder="دلیل رد درخواست را وارد کنید..."
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  یادداشت مدیر
                </label>
                <textarea
                  value={editForm.adminNotes}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      adminNotes: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-[#0A1D37]/20 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-colors resize-none"
                  rows={3}
                  placeholder="یادداشت‌های مدیر..."
                />
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-[#0A1D37]/10 flex justify-end gap-3">
              <button
                onClick={() => setShowEditLottery(false)}
                className="px-4 py-2 text-[#0A1D37] border border-[#0A1D37]/20 rounded-lg hover:bg-gray-50 transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={handleUpdateLottery}
                disabled={submitting}
                className="px-4 py-2 bg-[#FF7A00] text-white rounded-lg hover:bg-[#FF7A00]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? "در حال بروزرسانی..." : "ذخیره تغییرات"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LotteryAdminList;