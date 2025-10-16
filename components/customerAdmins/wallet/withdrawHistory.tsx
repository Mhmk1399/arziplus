"use client";

import React, { useState, useEffect } from "react";
import {
  FaMoneyBillWave,
  FaFilter,
  FaCalendarAlt,
  FaRedo,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEye,
  FaDownload
} from "react-icons/fa";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { showToast } from "@/utilities/toast";

interface WithdrawRequest {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface WithdrawSummary {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalAmount: number;
  pendingAmount: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const WithdrawHistory: React.FC = () => {
  const [withdrawRequests, setWithdrawRequests] = useState<WithdrawRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<WithdrawSummary>({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    totalAmount: 0,
    pendingAmount: 0,
  });
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Filter states
  const [filters, setFilters] = useState({
    status: "", // "", "pending", "approved", "rejected"
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const { isLoggedIn, loading: userLoading } = useCurrentUser();

  // Fetch withdraw requests
  const fetchWithdrawRequests = async (page = 1) => {
    if (!isLoggedIn || userLoading) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(filters.status && { status: filters.status }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.minAmount && { minAmount: filters.minAmount }),
        ...(filters.maxAmount && { maxAmount: filters.maxAmount }),
      });

      const response = await fetch(`/api/wallet/withdraws?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setWithdrawRequests(data.withdrawRequests);
        setPagination(data.pagination);
        setSummary(data.summary);
      } else {
        showToast.error("خطا در دریافت درخواست‌های برداشت");
      }
    } catch (error) {
      console.error("Error fetching withdraw requests:", error);
      showToast.error("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && !userLoading) {
      fetchWithdrawRequests();
    }
  }, [isLoggedIn, userLoading, filters]);

  // Apply filters
  const handleApplyFilters = () => {
    fetchWithdrawRequests(1);
    setShowFilters(false);
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilters({
      status: "",
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
    });
    setShowFilters(false);
  };

  // Get status color and icon
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "approved":
        return {
          color: "text-green-600 bg-green-100",
          icon: <FaCheckCircle />,
          text: "تایید شده",
        };
      case "pending":
        return {
          color: "text-yellow-600 bg-yellow-100",
          icon: <FaClock />,
          text: "در انتظار",
        };
      case "rejected":
        return {
          color: "text-red-600 bg-red-100",
          icon: <FaTimesCircle />,
          text: "رد شده",
        };
      default:
        return {
          color: "text-gray-600 bg-gray-100",
          icon: <FaEye />,
          text: "نامشخص",
        };
    }
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <FaRedo className="animate-spin text-2xl text-[#FF7A00]" />
        <span className="mr-2">در حال بارگذاری...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#0A1D37] flex items-center gap-2">
            <FaMoneyBillWave className="text-[#FF7A00]" />
            درخواست‌های برداشت
          </h2>
          <p className="text-gray-600 mt-1">مشاهده و پیگیری درخواست‌های برداشت از کیف پول</p>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF7A00] text-white rounded-lg hover:bg-[#e56900] transition-colors"
        >
          <FaFilter />
          فیلترها
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <FaMoneyBillWave className="text-blue-500 text-xl" />
            <div className="text-right">
              <p className="text-blue-600 font-bold">{summary.totalRequests}</p>
              <p className="text-sm text-blue-600">کل درخواست‌ها</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <FaClock className="text-yellow-500 text-xl" />
            <div className="text-right">
              <p className="text-yellow-600 font-bold">{summary.pendingRequests}</p>
              <p className="text-sm text-yellow-600">در انتظار</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <FaCheckCircle className="text-green-500 text-xl" />
            <div className="text-right">
              <p className="text-green-600 font-bold">{summary.approvedRequests}</p>
              <p className="text-sm text-green-600">تایید شده</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <FaTimesCircle className="text-red-500 text-xl" />
            <div className="text-right">
              <p className="text-red-600 font-bold">{summary.rejectedRequests}</p>
              <p className="text-sm text-red-600">رد شده</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <FaDownload className="text-purple-500 text-xl" />
            <div className="text-right">
              <p className="text-purple-600 font-bold">{summary.totalAmount.toLocaleString()}</p>
              <p className="text-sm text-purple-600">کل مبلغ تایید شده</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <FaClock className="text-orange-500 text-xl" />
            <div className="text-right">
              <p className="text-orange-600 font-bold">{summary.pendingAmount.toLocaleString()}</p>
              <p className="text-sm text-orange-600">مبلغ در انتظار</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                وضعیت
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent"
              >
                <option value="">همه</option>
                <option value="pending">در انتظار</option>
                <option value="approved">تایید شده</option>
                <option value="rejected">رد شده</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                از تاریخ
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تا تاریخ
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                حداقل مبلغ
              </label>
              <input
                type="number"
                value={filters.minAmount}
                onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                حداکثر مبلغ
              </label>
              <input
                type="number"
                value={filters.maxAmount}
                onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-[#FF7A00] text-white rounded-md hover:bg-[#e56900] transition-colors"
            >
              اعمال فیلترها
            </button>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              پاک کردن فیلترها
            </button>
          </div>
        </div>
      )}

      {/* Withdraw Requests Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FaRedo className="animate-spin text-2xl text-[#FF7A00] mr-2" />
            <span>در حال بارگذاری...</span>
          </div>
        ) : withdrawRequests.length === 0 ? (
          <div className="text-center py-12">
            <FaMoneyBillWave className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">هیچ درخواست برداشتی یافت نشد</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">شناسه</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">مبلغ</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">تاریخ درخواست</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">وضعیت</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {withdrawRequests.map((request) => {
                  const statusDisplay = getStatusDisplay(request.status);

                  return (
                    <tr key={request._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-mono text-sm text-gray-600">
                          {request._id.slice(-8).toUpperCase()}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-gray-900">
                          {request.amount.toLocaleString()} تومان
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt className="text-xs" />
                          {new Date(request.createdAt).toLocaleDateString("fa-IR")}
                          <br />
                          <span className="text-xs text-gray-400">
                            {new Date(request.createdAt).toLocaleTimeString("fa-IR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${statusDisplay.color}`}>
                          {statusDisplay.icon}
                          {statusDisplay.text}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="text-[#FF7A00] hover:text-[#e56900] text-sm">
                            <FaEye />
                          </button>
                          {request.status === "pending" && (
                            <button className="text-red-500 hover:text-red-700 text-sm">
                              لغو
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchWithdrawRequests(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              قبلی
            </button>
            
            <span className="px-4 py-2 bg-[#FF7A00] text-white rounded-md">
              {pagination.page} از {pagination.pages}
            </span>
            
            <button
              onClick={() => fetchWithdrawRequests(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              بعدی
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawHistory;