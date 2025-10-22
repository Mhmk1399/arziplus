"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { showToast } from "@/utilities/toast";
import { estedadBold } from "@/next-persian-fonts/estedad";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import ServiceRenderer from "@/components/customerAdmins/ordersandservices/ServiceRenderer";
import {
  FaFilter,
  FaPlus,
  FaEye,
  FaEdit,
  FaReply,
  FaTimes,
  FaCalendar,
  FaUser,
  FaMoneyBillWave,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationTriangle,
  FaClock,
} from "react-icons/fa";
import Link from "next/link";

interface ServiceField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  description?: string;
  options?: Array<{ key: string; value: string }>;
  showIf?: { field: string; value: string };
}

// Type for form field values (consistent with ServiceRenderer)
type FormFieldValue = string | number | boolean | string[] | null | undefined;

interface RequestData {
  data: Record<string, FormFieldValue>;
}

interface Request {
  _id: string;
  requestNumber: string;
  service: {
    _id: string;
    title: string;
    icon?: string;
    fee: number;
    fields?: ServiceField[];
  };
  data: Record<string, FormFieldValue>; // User submitted form data
  status: string;
  priority: string;
  paymentAmount: number;
  isPaid: boolean;
  createdAt: string;
  assignedTo?: {
    nationalCredentials: {
      firstName?: string;
      lastName?: string;
    };
  };
  rejectedReason?: string;
  rejectionHistory?: Array<{
    reason: string;
    rejectedBy: string;
    rejectedAt: string;
  }>;
  adminNotes: Array<{
    note: string;
    addedBy: {
      nationalCredentials: {
        firstName?: string;
        lastName?: string;
      };
    };
    addedAt: string;
    isVisibleToCustomer: boolean;
  }>;
  estimatedCompletionDate?: string;
  actualCompletionDate?: string;
}

interface CustomerRequestsTableProps {
  className?: string;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  in_progress: "bg-blue-100 text-blue-800 border-blue-300",
  completed: "bg-green-100 text-green-800 border-green-300",
  rejected: "bg-red-100 text-red-800 border-red-300",
  cancelled: "bg-gray-100 text-gray-800 border-gray-300",
  requires_info: "bg-purple-100 text-purple-800 border-purple-300",
};

const statusLabels = {
  pending: "در انتظار بررسی",
  in_progress: "در حال انجام",
  completed: "تکمیل شده",
  rejected: "رد شده",
  cancelled: "لغو شده",
  requires_info: "نیاز به اطلاعات",
};

const statusDescriptions = {
  pending: "درخواست شما در انتظار بررسی توسط کارشناسان ما است",
  in_progress: "درخواست شما در حال پردازش و انجام است",
  completed: "درخواست شما با موفقیت تکمیل شده است",
  rejected: "متأسفانه درخواست شما رد شده است",
  cancelled: "درخواست شما لغو شده است",
  requires_info: "برای ادامه پردازش نیاز به اطلاعات بیشتری داریم",
};

export default function CustomerRequestsTable({
  className = "",
}: CustomerRequestsTableProps) {
  const { isLoggedIn } = useCurrentUser();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showServiceRenderer, setShowServiceRenderer] = useState(false);
  const [customerResponse, setCustomerResponse] = useState("");
  const [submittingResponse, setSubmittingResponse] = useState(false);

  const fetchRequests = async () => {
    if (!isLoggedIn) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });

      if (statusFilter) params.append("status", statusFilter);

      const response = await fetch(`/api/customer/requests?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setRequests(data.data);
        setTotalPages(data.pagination.pages);
        setTotal(data.pagination.total);
      } else {
        showToast.error(data.error || "خطا در دریافت درخواست‌ها");
      }
    } catch (error) {
      console.log("Error fetching requests:", error);
      showToast.error("خطا در دریافت درخواست‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchRequests();
    }
  }, [currentPage, statusFilter, isLoggedIn]);

  const handleSubmitResponse = async () => {
    if (!selectedRequest || !customerResponse.trim()) {
      showToast.error("لطفاً پاسخ خود را وارد کنید");
      return;
    }

    setSubmittingResponse(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/customer/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          requestId: selectedRequest._id,
          response: customerResponse,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showToast.success(data.message);
        setShowResponseModal(false);
        setCustomerResponse("");
        fetchRequests();
      } else {
        showToast.error(data.error || "خطا در ارسال پاسخ");
      }
    } catch (error) {
      console.log("Response error:", error);
      showToast.error("خطا در ارسال پاسخ");
    } finally {
      setSubmittingResponse(false);
    }
  };

  const openDetailModal = (request: Request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const openResponseModal = (request: Request) => {
    setSelectedRequest(request);
    setCustomerResponse("");
    setShowResponseModal(true);
  };

  const openUpdateModal = (request: Request) => {
    setSelectedRequest(request);
    setShowServiceRenderer(true);
  };

  const handleRequestUpdate = async (requestData: RequestData) => {
    if (!selectedRequest) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `/api/service-requests/${selectedRequest._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: requestData.data,
            // Reset status to pending when updated
            status: "pending",
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        showToast.success("درخواست با موفقیت به‌روزرسانی شد");
        setShowServiceRenderer(false);
        setSelectedRequest(null);
        fetchRequests();
      } else {
        showToast.error(data.error || "خطا در به‌روزرسانی درخواست");
      }
    } catch (error) {
      console.log("Update error:", error);
      showToast.error("خطا در به‌روزرسانی درخواست");
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const getAssignedToName = (assignedTo?: Request["assignedTo"]) => {
    if (!assignedTo) return "تعیین نشده";
    const { firstName, lastName } = assignedTo.nationalCredentials;
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    return "کارشناس";
  };

  

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 ${className}`}
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1
                className={`text-xl lg:text-3xl   ${estedadBold.className} text-[#0A1D37]`}
              >
                درخواست‌های من
              </h1>
              <p className="text-xs sm:text-base text-gray-600">
                مدیریت و پیگیری درخواست‌های شما
              </p>
            </div>

            {/* New Request Button - Desktop */}
            <Link
              href="/services"
              className="hidden sm:inline-flex items-center gap-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-gradient-to-r from-[#4DBFF0] to-[#0A1D37] text-white rounded-xl lg:rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 font-bold text-sm lg:text-base whitespace-nowrap"
            >
              <FaPlus className="text-sm" />
              <span>درخواست جدید</span>
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-3 pr-10 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4DBFF0]/30 focus:border-[#4DBFF0] focus:outline-none text-sm sm:text-base appearance-none cursor-pointer hover:border-[#4DBFF0]/50 transition-colors"
              >
                <option value="">همه وضعیت‌ها</option>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
            </div>

            <div className="flex items-center gap-2 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-[#4DBFF0]/10 to-[#0A1D37]/10 rounded-xl border border-[#4DBFF0]/20">
              <span className="text-sm sm:text-base font-bold text-[#0A1D37]">
                مجموع:
              </span>
              <span className="text-sm sm:text-base font-bold text-[#0A1D37]">
                {total} درخواست
              </span>
            </div>
          </div>
        </div>

        {/* Requests Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 lg:py-24">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-[#4DBFF0] to-[#0A1D37] rounded-2xl animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaSpinner className="animate-spin text-2xl sm:text-3xl text-white" />
              </div>
            </div>
            <p className="text-base sm:text-lg font-medium text-gray-700 mb-2">
              در حال بارگذاری...
            </p>
            <p className="text-xs sm:text-sm text-gray-500">لطفاً صبر کنید</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 sm:py-16 lg:py-20 px-4">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0A1D37] mb-3 sm:mb-4">
              {statusFilter
                ? "درخواستی با این فیلتر یافت نشد"
                : "هنوز درخواستی ثبت نکرده‌اید"}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              {statusFilter
                ? "لطفاً فیلتر دیگری را امتحان کنید"
                : "از طریق دکمه زیر اولین درخواست خود را ثبت کنید"}
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 sm:py-4 bg-gradient-to-r from-[#4DBFF0] to-[#0A1D37] text-white rounded-xl sm:rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 font-bold text-sm sm:text-base"
            >
              <FaPlus className="text-sm" />
              <span>ثبت درخواست جدید</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {requests.map((request) => (
                <div
                  key={request._id}
                  className="bg-white rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300   flex flex-col"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#4DBFF0]/10 to-[#0A1D37]/10 px-4 sm:px-5 lg:px-6 py-4 sm:py-5 border-b border-gray-100">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        {request.service.icon && (
                          <span className="text-xl sm:text-2xl flex-shrink-0">
                            {request.service.icon}
                          </span>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-[#0A1D37] text-sm sm:text-base truncate">
                            {request.service.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 font-mono">
                            {request.requestNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold border ${
                        statusColors[
                          request.status as keyof typeof statusColors
                        ]
                      }`}
                    >
                      {
                        statusLabels[
                          request.status as keyof typeof statusLabels
                        ]
                      }
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 lg:p-6 flex-1 flex flex-col">
                    <div className="space-y-3 sm:space-y-4 flex-1">
                      <div className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {
                          statusDescriptions[
                            request.status as keyof typeof statusDescriptions
                          ]
                        }
                      </div>

                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaMoneyBillWave className="text-sm sm:text-base text-[#0A1D37]" />
                            <span className="text-xs sm:text-sm">مبلغ:</span>
                          </div>
                          <span className="font-bold text-[#0A1D37] text-sm sm:text-base">
                            {request.paymentAmount?.toLocaleString("fa-IR")}{" "}
                            تومان
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaCalendar className="text-sm sm:text-base text-[#4DBFF0]" />
                            <span className="text-xs sm:text-sm">
                              تاریخ ثبت:
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm text-[#0A1D37] font-medium">
                            {formatDate(request.createdAt)}
                          </span>
                        </div>

                        {request.assignedTo && (
                          <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 text-gray-600">
                              <FaUser className="text-sm sm:text-base text-green-600" />
                              <span className="text-xs sm:text-sm">
                                کارشناس:
                              </span>
                            </div>
                            <span className="text-xs sm:text-sm text-[#0A1D37] font-medium">
                              {getAssignedToName(request.assignedTo)}
                            </span>
                          </div>
                        )}

                        {request.estimatedCompletionDate && (
                          <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2 text-blue-700">
                              <FaClock className="text-sm sm:text-base" />
                              <span className="text-xs sm:text-sm font-medium">
                                تحویل:
                              </span>
                            </div>
                            <span className="text-xs sm:text-sm text-blue-700 font-bold">
                              {formatDate(request.estimatedCompletionDate)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Rejection History */}
                    {request.status === "rejected" && (
                      <div className="mt-4 p-3 sm:p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                        <div className="flex items-center gap-2 text-red-800 mb-2 sm:mb-3">
                          <FaExclamationTriangle className="text-sm flex-shrink-0" />
                          <div className="text-xs sm:text-sm font-bold">
                            دلیل رد درخواست:
                          </div>
                        </div>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {request.rejectedReason && (
                            <div className="p-2.5 sm:p-3 bg-red-100 border border-red-300 rounded-lg text-xs sm:text-sm text-red-700 leading-relaxed">
                              {request.rejectedReason}
                            </div>
                          )}

                          {request.adminNotes
                            .filter(
                              (note) =>
                                note.isVisibleToCustomer &&
                                note.note.includes("رد")
                            )
                            .slice(-2)
                            .map((note, index) => (
                              <div
                                key={index}
                                className="p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg"
                              >
                                <div className="text-xs text-red-500 mb-1">
                                  {formatDate(note.addedAt)}
                                </div>
                                <div className="text-xs sm:text-sm text-red-600">
                                  {note.note}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Admin Notes */}
                    {request.adminNotes.filter((n) => n.isVisibleToCustomer)
                      .length > 0 &&
                      request.status !== "rejected" && (
                        <div className="mt-4 p-3 sm:p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                          <div className="text-xs sm:text-sm font-bold text-blue-800 mb-2 sm:mb-3">
                            💬 پیام‌های کارشناس:
                          </div>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {request.adminNotes
                              .filter((n) => n.isVisibleToCustomer)
                              .slice(-2)
                              .map((note, index) => (
                                <div
                                  key={index}
                                  className="text-xs sm:text-sm text-blue-700 p-2.5 bg-blue-100 rounded-lg leading-relaxed"
                                >
                                  {note.note}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Actions */}
                  <div className="px-4 sm:px-5 lg:px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => openDetailModal(request)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm bg-white border-2 border-gray-200 text-[#0A1D37] rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium"
                    >
                      <FaEye className="text-xs sm:text-sm" />
                      <span>جزئیات</span>
                    </button>

                    {request.status === "rejected" && (
                      <>
                        <button
                          onClick={() => openUpdateModal(request)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm bg-green-600 text-white rounded-xl hover:bg-green-700 hover:shadow-lg transition-all font-bold"
                        >
                          <FaEdit className="text-xs sm:text-sm" />
                          <span>ویرایش</span>
                        </button>
                        <button
                          onClick={() => openResponseModal(request)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm bg-gradient-to-r from-[#4DBFF0] to-[#0A1D37] text-white rounded-xl hover:shadow-lg transition-all font-bold"
                        >
                          <FaReply className="text-xs sm:text-sm" />
                          <span>پاسخ</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all font-medium text-sm sm:text-base"
                >
                  <FaChevronRight className="text-sm" />
                  <span>قبلی</span>
                </button>

                <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#4DBFF0]/10 to-[#0A1D37]/10 rounded-xl border border-[#4DBFF0]/20">
                  <span className="text-sm sm:text-base font-bold text-[#0A1D37]">
                    صفحه {currentPage} از {totalPages}
                  </span>
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all font-medium text-sm sm:text-base"
                >
                  <span>بعدی</span>
                  <FaChevronLeft className="text-sm" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal &&
        selectedRequest &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            dir="rtl"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-gradient-to-r from-[#4DBFF0]/10 to-[#0A1D37]/10 p-4 sm:p-6 border-b border-gray-100 backdrop-blur-sm z-10">
                <div className="flex items-center justify-between">
                  <h2
                    className={`text-lg sm:text-xl lg:text-2xl ${estedadBold.className} text-[#0A1D37]`}
                  >
                    جزئیات درخواست {selectedRequest.requestNumber}
                  </h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <FaTimes className="text-xl text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <label className="text-xs sm:text-sm font-medium text-gray-600 mb-2 block">
                      سرویس
                    </label>
                    <div className="text-sm sm:text-base text-[#0A1D37] font-bold">
                      {selectedRequest.service.title}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <label className="text-xs sm:text-sm font-medium text-gray-600 mb-2 block">
                      وضعیت
                    </label>
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold border ${
                        statusColors[
                          selectedRequest.status as keyof typeof statusColors
                        ]
                      }`}
                    >
                      {
                        statusLabels[
                          selectedRequest.status as keyof typeof statusLabels
                        ]
                      }
                    </span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <label className="text-xs sm:text-sm font-medium text-gray-600 mb-2 block">
                      مبلغ
                    </label>
                    <div className="text-sm sm:text-base text-[#0A1D37] font-bold">
                      {selectedRequest.paymentAmount?.toLocaleString("fa-IR")}{" "}
                      تومان
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <label className="text-xs sm:text-sm font-medium text-gray-600 mb-2 block">
                      تاریخ ثبت
                    </label>
                    <div className="text-sm sm:text-base text-[#0A1D37] font-medium">
                      {formatDate(selectedRequest.createdAt)}
                    </div>
                  </div>
                </div>

                {selectedRequest.rejectedReason && (
                  <div className="p-4 sm:p-5 bg-red-50 border-2 border-red-200 rounded-xl sm:rounded-2xl">
                    <label className="text-sm sm:text-base font-bold text-red-800 mb-2 sm:mb-3   flex items-center gap-2">
                      <FaExclamationTriangle />
                      دلیل رد
                    </label>
                    <div className="text-sm sm:text-base text-red-700 leading-relaxed">
                      {selectedRequest.rejectedReason}
                    </div>
                  </div>
                )}

                {selectedRequest.adminNotes.filter((n) => n.isVisibleToCustomer)
                  .length > 0 && (
                  <div className="p-4 sm:p-5 bg-blue-50 border-2 border-blue-200 rounded-xl sm:rounded-2xl">
                    <label className="text-sm sm:text-base font-bold text-blue-800 mb-3 sm:mb-4 block">
                      💬 پیام‌های کارشناس
                    </label>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {selectedRequest.adminNotes
                        .filter((n) => n.isVisibleToCustomer)
                        .map((note, index) => (
                          <div
                            key={index}
                            className="p-3 sm:p-4 bg-white border border-blue-200 rounded-xl"
                          >
                            <div className="text-sm sm:text-base text-blue-700 leading-relaxed mb-2">
                              {note.note}
                            </div>
                            <div className="text-xs text-blue-600">
                              {formatDate(note.addedAt)}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 p-4 sm:p-6 border-t border-gray-100 bg-white/95 backdrop-blur-sm flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-[#4DBFF0] to-[#0A1D37] text-white rounded-xl sm:rounded-2xl hover:shadow-xl transition-all font-bold text-sm sm:text-base"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Response Modal */}
      {showResponseModal &&
        selectedRequest &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            dir="rtl"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full shadow-2xl">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2
                    className={`text-lg sm:text-xl ${estedadBold.className} text-[#0A1D37]`}
                  >
                    پاسخ به رد درخواست
                  </h2>
                  <button
                    onClick={() => setShowResponseModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <FaTimes className="text-xl text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 lg:p-8">
                {selectedRequest.rejectedReason && (
                  <div className="mb-4 sm:mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                    <div className="text-sm font-bold text-red-800 mb-2 flex items-center gap-2">
                      <FaExclamationTriangle />
                      دلیل رد:
                    </div>
                    <div className="text-sm text-red-700 leading-relaxed">
                      {selectedRequest.rejectedReason}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm sm:text-base font-bold text-[#0A1D37] mb-3">
                    پاسخ شما
                  </label>
                  <textarea
                    value={customerResponse}
                    onChange={(e) => setCustomerResponse(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4DBFF0]/30 focus:border-[#4DBFF0] focus:outline-none text-sm sm:text-base resize-none"
                    rows={5}
                    placeholder="توضیحات و پاسخ خود را در مورد دلیل رد وارد کنید..."
                  />
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-end">
                <button
                  onClick={() => setShowResponseModal(false)}
                  className="w-full sm:w-auto px-5 py-3 text-[#0A1D37] border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium"
                >
                  لغو
                </button>
                <button
                  onClick={handleSubmitResponse}
                  disabled={submittingResponse || !customerResponse.trim()}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-[#4DBFF0] to-[#0A1D37] text-white rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center justify-center gap-2"
                >
                  {submittingResponse ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>در حال ارسال...</span>
                    </>
                  ) : (
                    <>
                      <FaReply />
                      <span>ارسال پاسخ</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Service Renderer Modal for Updating Request */}
      {showServiceRenderer &&
        selectedRequest &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            dir="rtl"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-gradient-to-r from-[#4DBFF0]/10 to-[#0A1D37]/10 p-4 sm:p-6 border-b border-gray-100 backdrop-blur-sm z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2
                      className={`text-lg sm:text-xl lg:text-2xl ${estedadBold.className} text-[#0A1D37]`}
                    >
                      ویرایش درخواست {selectedRequest.requestNumber}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      سرویس: {selectedRequest.service.title}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowServiceRenderer(false);
                      setSelectedRequest(null);
                    }}
                    className="p-2 hover:bg-white/50 rounded-xl transition-colors"
                  >
                    <FaTimes className="text-xl sm:text-2xl text-gray-600" />
                  </button>
                </div>

                {/* Show rejection reason */}
                {selectedRequest.rejectedReason && (
                  <div className="p-3 sm:p-4 bg-red-50 border-2 border-red-200 rounded-xl mb-3">
                    <div className="text-xs sm:text-sm font-bold text-red-800 mb-2 flex items-center gap-2">
                      <FaExclamationTriangle />
                      دلیل رد قبلی:
                    </div>
                    <div className="text-xs sm:text-sm text-red-700 leading-relaxed">
                      {selectedRequest.rejectedReason}
                    </div>
                  </div>
                )}

                <div className="p-3 sm:p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                  <div className="text-xs sm:text-sm text-blue-700 leading-relaxed">
                    ℹ️ لطفاً اطلاعات درخواست خود را با توجه به دلیل رد مجدداً
                    تکمیل کنید. پس از ثبت، وضعیت درخواست به در انتظار بررسی
                    تغییر خواهد کرد.
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 lg:p-8">
                <ServiceRenderer
                  serviceId={selectedRequest.service._id}
                  onRequestSubmit={handleRequestUpdate}
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
