"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaCheck, FaTimes, FaEye, FaFilter, FaUniversity, FaUser } from "react-icons/fa";
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
  const { user: currentUser, isLoggedIn } = useCurrentUser();
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
  const [reviewStatus, setReviewStatus] = useState<"accepted" | "rejected">("accepted");
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
        reviewStatus === "accepted" ? "اطلاعات بانکی تایید شد" : "اطلاعات بانکی رد شد"
      );
      
      setShowReviewModal(false);
      setSelectedBankingInfo(null);
      setRejectionNotes("");
      await fetchBankingData();
    } catch (err) {
      showToast.error(err instanceof Error ? err.message : "خطا در به‌روزرسانی");
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
      case "accepted": return "text-green-700 bg-green-100 border-green-300";
      case "rejected": return "text-red-700 bg-red-100 border-red-300";
      case "pending_verification": return "text-yellow-700 bg-yellow-100 border-yellow-300";
      default: return "text-gray-700 bg-gray-100 border-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "accepted": return "تایید شده";
      case "rejected": return "رد شده";
      case "pending_verification": return "در انتظار بررسی";
      default: return "نامشخص";
    }
  };

  const formatCardNumber = (cardNumber: string) => {
    return cardNumber.replace(/(\d{4})(?=\d)/g, "$1-");
  };

  const getUserName = (user: UserBankingData) => {
    const { firstName, lastName } = user.nationalCredentials || {};
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    return "نام نامشخص";
  };

  const openDetailsModal = (user: UserBankingData, bankingInfo: BankingInfo) => {
    setSelectedBankingInfo({ user, bankingInfo });
    setShowDetailsModal(true);
  };

  const openReviewModal = (user: UserBankingData, bankingInfo: BankingInfo) => {
    setSelectedBankingInfo({ user, bankingInfo });
    setReviewStatus("accepted");
    setRejectionNotes("");
    setShowReviewModal(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">ورود به سیستم لازم است</h2>
          <p className="text-gray-600">لطفاً وارد حساب کاربری خود شوید</p>
        </div>
      </div>
    );
  }

  if (!currentUser?.roles.includes("admin") && !currentUser?.roles.includes("super_admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">دسترسی غیر مجاز</h2>
          <p className="text-gray-600">شما به این بخش دسترسی ندارید</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FaUniversity className="text-3xl text-indigo-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">مدیریت اطلاعات بانکی</h1>
              <p className="text-gray-600">بررسی و تایید اطلاعات بانکی کاربران</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "کل درخواست‌ها", value: pagination.totalUsers, color: "blue" },
              { 
                label: "در انتظار بررسی", 
                value: users.reduce((acc, user) => 
                  acc + user.bankingInfo.filter(b => b.status === "pending_verification").length, 0
                ), 
                color: "yellow" 
              },
              { 
                label: "تایید شده", 
                value: users.reduce((acc, user) => 
                  acc + user.bankingInfo.filter(b => b.status === "accepted").length, 0
                ), 
                color: "green" 
              },
              { 
                label: "رد شده", 
                value: users.reduce((acc, user) => 
                  acc + user.bankingInfo.filter(b => b.status === "rejected").length, 0
                ), 
                color: "red" 
              },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center">
                  <div className={`text-2xl font-bold text-${stat.color}-600`}>
                    {stat.value}
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="جستجو بر اساس نام، شماره کارت یا شبا..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">همه وضعیت‌ها</option>
              <option value="pending_verification">در انتظار بررسی</option>
              <option value="accepted">تایید شده</option>
              <option value="rejected">رد شده</option>
            </select>

            <button
              onClick={() => fetchBankingData()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FaFilter className="inline ml-2" />
              اعمال فیلتر
            </button>
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
                      <tr key={`${user._id}-${bankInfo._id}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaUser className="text-gray-400 ml-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {getUserName(user)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user._id.slice(-8)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{bankInfo.bankName}</div>
                          <div className="text-sm text-gray-500">{bankInfo.accountHolderName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono text-gray-900">
                            {formatCardNumber(bankInfo.cardNumber)}
                          </div>
                          <div className="text-sm text-gray-500">{bankInfo.shebaNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(bankInfo.status)}`}>
                            {getStatusText(bankInfo.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(bankInfo.createdAt).toLocaleDateString('fa-IR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openDetailsModal(user, bankInfo)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <FaEye />
                            </button>
                            {bankInfo.status === "pending_verification" && (
                              <>
                                <button
                                  onClick={() => openReviewModal(user, bankInfo)}
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
                  صفحه {pagination.currentPage} از {pagination.totalPages} (مجموع {pagination.totalUsers} مورد)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={!pagination.hasPreviousPage}
                    className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    قبلی
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
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
      {showDetailsModal && selectedBankingInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">جزئیات اطلاعات بانکی</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">نام کاربر</label>
                  <div className="text-gray-900 mt-1">{getUserName(selectedBankingInfo.user)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">نام بانک</label>
                  <div className="text-gray-900 mt-1">{selectedBankingInfo.bankingInfo.bankName}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">نام صاحب حساب</label>
                  <div className="text-gray-900 mt-1">{selectedBankingInfo.bankingInfo.accountHolderName}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">شماره کارت</label>
                  <div className="text-gray-900 mt-1 font-mono">{formatCardNumber(selectedBankingInfo.bankingInfo.cardNumber)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">شماره شبا</label>
                  <div className="text-gray-900 mt-1 font-mono">{selectedBankingInfo.bankingInfo.shebaNumber}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">وضعیت</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedBankingInfo.bankingInfo.status)}`}>
                      {getStatusText(selectedBankingInfo.bankingInfo.status)}
                    </span>
                  </div>
                </div>
              </div>

              {selectedBankingInfo.bankingInfo.rejectionNotes && (
                <div>
                  <label className="text-sm font-medium text-red-600">دلیل رد</label>
                  <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {selectedBankingInfo.bankingInfo.rejectionNotes}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                بستن
              </button>
              {selectedBankingInfo.bankingInfo.status === "pending_verification" && (
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    openReviewModal(selectedBankingInfo.user, selectedBankingInfo.bankingInfo);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  بررسی و تایید
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedBankingInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">بررسی اطلاعات بانکی</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">کاربر: {getUserName(selectedBankingInfo.user)}</div>
                <div className="text-sm text-gray-600">بانک: {selectedBankingInfo.bankingInfo.bankName}</div>
                <div className="text-sm text-gray-600">کارت: {formatCardNumber(selectedBankingInfo.bankingInfo.cardNumber)}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">تصمیم</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="reviewStatus"
                      value="accepted"
                      checked={reviewStatus === "accepted"}
                      onChange={(e) => setReviewStatus(e.target.value as "accepted" | "rejected")}
                      className="ml-2"
                    />
                    <span className="text-green-700">تایید</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="reviewStatus"
                      value="rejected"
                      checked={reviewStatus === "rejected"}
                      onChange={(e) => setReviewStatus(e.target.value as "accepted" | "rejected")}
                      className="ml-2"
                    />
                    <span className="text-red-700">رد</span>
                  </label>
                </div>
              </div>

              {reviewStatus === "rejected" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">دلیل رد</label>
                  <textarea
                    value={rejectionNotes}
                    onChange={(e) => setRejectionNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={3}
                    placeholder="لطفاً دلیل رد اطلاعات بانکی را توضیح دهید..."
                  />
                </div>
              )}
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                انصراف
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={submitting || (reviewStatus === "rejected" && !rejectionNotes.trim())}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "در حال پردازش..." : "تایید"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankingInfoAdmin;
