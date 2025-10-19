"use client";

import React, { useState, useEffect } from "react";
import { showToast } from "@/utilities/toast";
import {
  FiSearch,
  FiDownload,
  FiEye,
  FiEdit3,
  FiCheck,
  FiX,
  FiClock,
} from "react-icons/fi";

interface banckinfo {
  cardNumber: string;
  accountHolderName: string;
  bankName: string;
  shebaNumber: string;
}

interface WithdrawRequest {
  _id: string;
  user: {
    _id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    phone: string;
    contactInfo?: string;
    bankingInfo?: banckinfo[];
  };
  amount: number;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  processedBy?: {
    _id: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  totalAmount: number;
  pendingAmount: number;
}

const WithdrawRequestsList: React.FC = () => {
  const [withdrawRequests, setWithdrawRequests] = useState<WithdrawRequest[]>(
    []
  );
  const [filteredRequests, setFilteredRequests] = useState<WithdrawRequest[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [showEditRequest, setShowEditRequest] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<WithdrawRequest | null>(null);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalAmount: 0,
    pendingAmount: 0,
  });
  const [editForm, setEditForm] = useState({
    status: "" as "pending" | "approved" | "rejected",
    rejectionReason: "",
  });

  // Fetch all withdraw requests
  const fetchWithdrawRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/admin/withdraws", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch withdraw requests");
      }

      const data = await response.json();
      setWithdrawRequests(data.withdrawRequests || []);
      setFilteredRequests(data.withdrawRequests || []);
      setStats(
        data.stats || {
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          totalAmount: 0,
          pendingAmount: 0,
        }
      );
    } catch (error) {
      console.log("Error fetching withdraw requests:", error);
      showToast.error("خطا در دریافت درخواست‌های برداشت");
    } finally {
      setLoading(false);
    }
  };

  // Filter requests based on search and filters
  useEffect(() => {
    let filtered = withdrawRequests;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.user.username
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          request.user.phone.includes(searchTerm) ||
          (request.user.firstName &&
            request.user.firstName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (request.user.lastName &&
            request.user.lastName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((request) => request.status === statusFilter);
    }

    setFilteredRequests(filtered);
  }, [searchTerm, statusFilter, withdrawRequests]);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get status text
  const getStatusText = (status: string): string => {
    switch (status) {
      case "approved":
        return "تایید شده";
      case "rejected":
        return "رد شده";
      case "pending":
        return "در انتظار";
      default:
        return "نامشخص";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string): React.ReactNode => {
    switch (status) {
      case "approved":
        return <FiCheck className="text-green-600" />;
      case "rejected":
        return <FiX className="text-red-600" />;
      case "pending":
        return <FiClock className="text-yellow-600" />;
      default:
        return <FiClock className="text-gray-600" />;
    }
  };

  // Open request details modal
  const openRequestDetails = (request: WithdrawRequest) => {
    setSelectedRequest(request);
    setShowRequestDetails(true);
  };

  // Open edit request modal
  const openEditRequest = (request: WithdrawRequest) => {
    setSelectedRequest(request);
    setEditForm({
      status: request.status,
      rejectionReason: request.rejectionReason || "",
    });
    setShowEditRequest(true);
  };

  // Update withdraw request
  const handleUpdateRequest = async () => {
    if (!selectedRequest) return;

    // Validation
    if (editForm.status === "rejected" && !editForm.rejectionReason.trim()) {
      showToast.error("لطفاً دلیل رد درخواست را وارد کنید");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        `/api/admin/withdraws/${selectedRequest._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update withdraw request"
        );
      }

      showToast.success("درخواست برداشت با موفقیت بروزرسانی شد");
      setShowEditRequest(false);
      fetchWithdrawRequests();
    } catch (error) {
      console.log("Error updating withdraw request:", error);
      showToast.error(
        error instanceof Error
          ? error.message
          : "خطا در بروزرسانی درخواست برداشت"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Quick approve/reject actions
  const handleQuickAction = async (
    requestId: string,
    action: "approved" | "rejected",
    rejectionReason?: string
  ) => {
    try {
      const token = localStorage.getItem("authToken");
      const body: { rejectionReason?: string; status: string } = {
        status: action,
      };

      if (action === "rejected" && rejectionReason) {
        body.rejectionReason = rejectionReason;
      }

      const response = await fetch(`/api/admin/withdraws/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update withdraw request"
        );
      }

      showToast.success(
        `درخواست برداشت ${action === "approved" ? "تایید" : "رد"} شد`
      );
      fetchWithdrawRequests();
    } catch (error) {
      console.log("Error updating withdraw request:", error);
      showToast.error("خطا در بروزرسانی درخواست برداشت");
    }
  };

  // Export requests data
  const exportRequests = () => {
    const csvContent = [
      [
        "نام کاربری",
        "نام",
        "شماره تلفن",
        "مبلغ",
        "وضعیت",
        "تاریخ درخواست",
      ].join(","),
      ...filteredRequests.map((request) =>
        [
          request.user.username,
          `${request.user.firstName || ""} ${
            request.user.lastName || ""
          }`.trim(),
          request.user.phone,
          request.amount,
          getStatusText(request.status),
          new Date(request.createdAt).toLocaleDateString("fa-IR"),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "withdraw-requests.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchWithdrawRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7A00]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 my-32">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1D37] flex items-center gap-3">
            <span className="w-3 h-3 bg-[#FF7A00] rounded-full"></span>
            مدیریت درخواست‌های برداشت
          </h1>
          <p className="text-gray-600 mt-1">
            مشاهده و مدیریت تمام درخواست‌های برداشت کاربران
          </p>
        </div>
        <button
          onClick={exportRequests}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF7A00] text-white rounded-lg hover:bg-[#FF7A00]/90 transition-colors"
        >
          <FiDownload />
          خروجی CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#0A1D37]/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">کل درخواست‌ها</p>
              <p className="text-2xl font-bold text-[#0A1D37]">
                {stats.total.toLocaleString("fa-IR")}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#0A1D37]/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">در انتظار</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pending.toLocaleString("fa-IR")}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#0A1D37]/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">تایید شده</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.approved.toLocaleString("fa-IR")}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#0A1D37]/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">رد شده</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.rejected.toLocaleString("fa-IR")}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#0A1D37]/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">مبلغ تایید شده</p>
              <p className="text-lg font-bold text-green-600">
                {formatCurrency(stats.totalAmount)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#0A1D37]/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">مبلغ در انتظار</p>
              <p className="text-lg font-bold text-yellow-600">
                {formatCurrency(stats.pendingAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-[#0A1D37]/10">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="جستجو بر اساس نام کاربری، نام، یا شماره تلفن..."
                className="w-full pr-10 pl-3 py-2 border border-[#0A1D37]/20 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-[#0A1D37]/20 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-colors"
            >
              <option value="">همه وضعیت‌ها</option>
              <option value="pending">در انتظار</option>
              <option value="approved">تایید شده</option>
              <option value="rejected">رد شده</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-[#0A1D37]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  کاربر
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  مبلغ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  وضعیت
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاریخ درخواست
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.user.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {`${request.user.firstName || ""} ${
                            request.user.lastName || ""
                          }`.trim() || "نام تعریف نشده"}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          {request.user.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-[#0A1D37]">
                      {formatCurrency(request.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {getStatusIcon(request.status)}
                      {getStatusText(request.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span>
                        {new Date(request.createdAt).toLocaleDateString(
                          "fa-IR"
                        )}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(request.createdAt).toLocaleTimeString(
                          "fa-IR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex gap-1">
                      <button
                        onClick={() => openRequestDetails(request)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="مشاهده جزئیات"
                      >
                        <FiEye />
                      </button>
                      <button
                        onClick={() => openEditRequest(request)}
                        className="p-2 text-[#FF7A00] hover:bg-orange-50 rounded-lg transition-colors"
                        title="ویرایش"
                      >
                        <FiEdit3 />
                      </button>
                      {request.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleQuickAction(request._id, "approved")
                            }
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="تایید سریع"
                          >
                            <FiCheck />
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt("دلیل رد درخواست:");
                              if (reason) {
                                handleQuickAction(
                                  request._id,
                                  "rejected",
                                  reason
                                );
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="رد سریع"
                          >
                            <FiX />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            هیچ درخواست برداشتی یافت نشد
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {showRequestDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full h-[90vh] overflow-y-auto shadow-2xl border border-[#0A1D37]/10">
            <div className="p-4 sm:p-6 border-b border-[#0A1D37]/10">
              <h2 className="text-xl font-bold text-[#0A1D37] flex items-center gap-3">
                <span className="w-3 h-3 bg-[#FF7A00] rounded-full"></span>
                جزئیات درخواست برداشت - {selectedRequest.user.username}
              </h2>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              {/* Request Info */}
              <div className="bg-gray-50 rounded-xl p-4 border border-[#0A1D37]/10">
                <h3 className="text-base sm:text-lg font-semibold text-[#0A1D37] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#FF7A00] rounded-full"></span>
                  اطلاعات درخواست
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-600">
                      مبلغ درخواست
                    </label>
                    <div className="text-sm sm:text-base text-[#0A1D37] mt-1 bg-white px-3 py-2 rounded-lg border border-[#0A1D37]/10 font-semibold">
                      {formatCurrency(selectedRequest.amount)}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-600">
                      وضعیت
                    </label>
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          selectedRequest.status
                        )}`}
                      >
                        {getStatusIcon(selectedRequest.status)}
                        {getStatusText(selectedRequest.status)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-600">
                      تاریخ درخواست
                    </label>
                    <div className="text-sm sm:text-base text-[#0A1D37] mt-1 bg-white px-3 py-2 rounded-lg border border-[#0A1D37]/10">
                      {new Date(selectedRequest.createdAt).toLocaleDateString(
                        "fa-IR"
                      )}{" "}
                      -{" "}
                      {new Date(selectedRequest.createdAt).toLocaleTimeString(
                        "fa-IR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </div>
                  </div>
                </div>

                {selectedRequest.processedAt && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-600">
                        تاریخ بررسی
                      </label>
                      <div className="text-sm sm:text-base text-[#0A1D37] mt-1 bg-white px-3 py-2 rounded-lg border border-[#0A1D37]/10">
                        {new Date(
                          selectedRequest.processedAt
                        ).toLocaleDateString("fa-IR")}{" "}
                        -{" "}
                        {new Date(
                          selectedRequest.processedAt
                        ).toLocaleTimeString("fa-IR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    {selectedRequest.processedBy && (
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-600">
                          بررسی شده توسط
                        </label>
                        <div className="text-sm sm:text-base text-[#0A1D37] mt-1 bg-white px-3 py-2 rounded-lg border border-[#0A1D37]/10">
                          {selectedRequest.processedBy.firstName &&
                          selectedRequest.processedBy.lastName
                            ? `${selectedRequest.processedBy.firstName} ${selectedRequest.processedBy.lastName}`
                            : selectedRequest.processedBy.username}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedRequest.rejectionReason && (
                  <div className="mt-4">
                    <label className="text-xs sm:text-sm font-medium text-gray-600">
                      دلیل رد درخواست
                    </label>
                    <div className="text-sm text-red-700 mt-1 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                      {selectedRequest.rejectionReason}
                    </div>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="bg-gray-50 rounded-xl p-4 border border-[#0A1D37]/10">
                <h3 className="text-base sm:text-lg font-semibold text-[#0A1D37] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#FF7A00] rounded-full"></span>
                  اطلاعات کاربر
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-600">
                      نام کاربری
                    </label>
                    <div className="text-sm sm:text-base text-[#0A1D37] mt-1 bg-white px-3 py-2 rounded-lg border border-[#0A1D37]/10">
                      {selectedRequest.user.username}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-600">
                      نام کامل
                    </label>
                    <div className="text-sm sm:text-base text-[#0A1D37] mt-1 bg-white px-3 py-2 rounded-lg border border-[#0A1D37]/10">
                      {`${selectedRequest.user.firstName || ""} ${
                        selectedRequest.user.lastName || ""
                      }`.trim() || "تعریف نشده"}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-600">
                      شماره تلفن
                    </label>
                    <div className="text-sm sm:text-base text-[#0A1D37] mt-1 bg-white px-3 py-2 rounded-lg border border-[#0A1D37]/10 font-mono">
                      {selectedRequest.user.phone}
                    </div>
                  </div>
                </div>
              </div>

              {/* Banking Info */}
              {selectedRequest.user.bankingInfo &&
                selectedRequest.user.bankingInfo.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-[#0A1D37]/10">
                    <h3 className="text-base sm:text-lg font-semibold text-[#0A1D37] mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#FF7A00] rounded-full"></span>
                      اطلاعات بانکی
                    </h3>
                    <div className="space-y-3">
                      {selectedRequest.user.bankingInfo.map(
                        (bank: banckinfo, index: number) => (
                          <div
                            key={index}
                            className="bg-white p-3 sm:p-4 rounded-lg border"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs font-medium text-gray-600">
                                  نام بانک
                                </label>
                                <div className="text-sm text-gray-900 mt-1 bg-gray-50 px-2 py-1 rounded">
                                  {bank.bankName || "تعریف نشده"}
                                </div>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-gray-600">
                                  نام صاحب حساب
                                </label>
                                <div className="text-sm text-gray-900 mt-1 bg-gray-50 px-2 py-1 rounded">
                                  {bank.accountHolderName || "تعریف نشده"}
                                </div>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-gray-600">
                                  شماره کارت
                                </label>
                                <div className="text-sm text-gray-900 mt-1 font-mono bg-gray-50 px-2 py-1 rounded">
                                  {bank.cardNumber || "تعریف نشده"}
                                </div>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-gray-600">
                                  شماره شبا
                                </label>
                                <div className="text-sm text-gray-900 mt-1 font-mono bg-gray-50 px-2 py-1 rounded">
                                  {bank.shebaNumber || "تعریف نشده"}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-[#0A1D37]/10 bg-gray-50 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setShowRequestDetails(false)}
                className="w-full sm:w-auto px-4 py-2 text-[#0A1D37] border border-[#0A1D37]/20 rounded-lg hover:bg-gray-100 transition-colors"
              >
                بستن
              </button>
              <button
                onClick={() => {
                  setShowRequestDetails(false);
                  openEditRequest(selectedRequest);
                }}
                className="w-full sm:w-auto px-4 py-2 bg-[#FF7A00] text-white rounded-lg hover:bg-[#FF7A00]/90 transition-colors"
              >
                ویرایش
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Request Modal */}
      {showEditRequest && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-[#0A1D37]/10">
            <div className="p-4 sm:p-6 border-b border-[#0A1D37]/10">
              <h2 className="text-xl font-bold text-[#0A1D37] flex items-center gap-3">
                <span className="w-3 h-3 bg-[#FF7A00] rounded-full"></span>
                ویرایش درخواست برداشت - {selectedRequest.user.username}
              </h2>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              {/* Request Summary */}
              <div className="bg-gray-50 rounded-xl p-4 border border-[#0A1D37]/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">مبلغ درخواست:</p>
                    <p className="text-lg font-bold text-[#0A1D37]">
                      {formatCurrency(selectedRequest.amount)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">تاریخ درخواست:</p>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedRequest.createdAt).toLocaleDateString(
                        "fa-IR"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Selection */}
              <div className="bg-gray-50 rounded-xl p-4 border border-[#0A1D37]/10">
                <h3 className="text-base sm:text-lg font-semibold text-[#0A1D37] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#FF7A00] rounded-full"></span>
                  تغییر وضعیت
                </h3>
                <div>
                  <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                    وضعیت جدید
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        status: e.target.value as
                          | "pending"
                          | "approved"
                          | "rejected",
                      }))
                    }
                    className="w-full px-3 py-2 border border-[#0A1D37]/20 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] transition-colors"
                  >
                    <option value="pending">در انتظار</option>
                    <option value="approved">تایید شده</option>
                    <option value="rejected">رد شده</option>
                  </select>
                </div>

                {editForm.status === "rejected" && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                      دلیل رد درخواست *
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
                      placeholder="لطفاً دلیل رد درخواست را وارد کنید..."
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-[#0A1D37]/10 flex justify-end gap-3">
              <button
                onClick={() => setShowEditRequest(false)}
                className="px-4 py-2 text-[#0A1D37] border border-[#0A1D37]/20 rounded-lg hover:bg-gray-50 transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={handleUpdateRequest}
                disabled={
                  submitting ||
                  (editForm.status === "rejected" &&
                    !editForm.rejectionReason.trim())
                }
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

export default WithdrawRequestsList;
