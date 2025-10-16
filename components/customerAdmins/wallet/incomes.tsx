"use client";

import React, { useState, useEffect } from "react";
import {
  FaHistory,
  FaFilter,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaTags,
  FaRedo,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEye
} from "react-icons/fa";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { showToast } from "@/utilities/toast";

interface Transaction {
  _id: string;
  amount: number;
  tag: string;
  description: string;
  date: string;
  status: "pending" | "verified" | "rejected";
  type: "income" | "outcome";
  verifiedAt?: string;
  verifiedBy?: string;
}

interface TransactionSummary {
  totalIncome: number;
  totalOutcome: number;
  pendingIncome: number;
  pendingOutcome: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const IncomesHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<TransactionSummary>({
    totalIncome: 0,
    totalOutcome: 0,
    pendingIncome: 0,
    pendingOutcome: 0,
  });
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Filter states
  const [filters, setFilters] = useState({
    type: "all", // "all", "income", "outcome"
    status: "", // "", "pending", "verified", "rejected"
    startDate: "",
    endDate: "",
    tag: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const {  isLoggedIn, loading: userLoading } = useCurrentUser();

  // Fetch transactions
  const fetchTransactions = async (page = 1) => {
    if (!isLoggedIn || userLoading) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const params = new URLSearchParams({
        page: page.toString(),
        limit: filters.type === "all" ? "10" : "10",
        ...(filters.type !== "all" && { type: filters.type }),
        ...(filters.status && { status: filters.status }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.tag && { tag: filters.tag }),
      });

      const response = await fetch(`/api/wallet/history?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setTransactions(data.transactions);
        setPagination(data.pagination);
        setSummary(data.summary);
      } else {
        showToast.error("خطا در دریافت تاریخچه تراکنش‌ها");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      showToast.error("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && !userLoading) {
      fetchTransactions();
    }
  }, [isLoggedIn, userLoading, filters]);

  // Apply filters
  const handleApplyFilters = () => {
    fetchTransactions(1);
    setShowFilters(false);
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilters({
      type: "all",
      status: "",
      startDate: "",
      endDate: "",
      tag: "",
    });
    setShowFilters(false);
  };

  // Get status color and icon
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "verified":
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

  // Get type display
  const getTypeDisplay = (type: string) => {
    return type === "income"
      ? {
          color: "text-green-600",
          icon: <FaArrowUp />,
          text: "واریز",
          prefix: "+",
        }
      : {
          color: "text-red-600",
          icon: <FaArrowDown />,
          text: "برداشت",
          prefix: "-",
        };
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
            <FaHistory className="text-[#FF7A00]" />
            تاریخچه تراکنش‌ها
          </h2>
          <p className="text-gray-600 mt-1">مشاهده کامل واریزها و برداشت‌های کیف پول</p>
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <FaArrowUp className="text-green-500 text-xl" />
            <div className="text-right">
              <p className="text-green-600 font-bold">{summary.totalIncome.toLocaleString()}</p>
              <p className="text-sm text-green-600">کل واریزها</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <FaArrowDown className="text-red-500 text-xl" />
            <div className="text-right">
              <p className="text-red-600 font-bold">{summary.totalOutcome.toLocaleString()}</p>
              <p className="text-sm text-red-600">کل برداشت‌ها</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <FaClock className="text-yellow-500 text-xl" />
            <div className="text-right">
              <p className="text-yellow-600 font-bold">{summary.pendingIncome.toLocaleString()}</p>
              <p className="text-sm text-yellow-600">در انتظار واریز</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <FaClock className="text-blue-500 text-xl" />
            <div className="text-right">
              <p className="text-blue-600 font-bold">{summary.pendingOutcome.toLocaleString()}</p>
              <p className="text-sm text-blue-600">در انتظار برداشت</p>
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
                نوع تراکنش
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent"
              >
                <option value="all">همه</option>
                <option value="income">واریز</option>
                <option value="outcome">برداشت</option>
              </select>
            </div>

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
                <option value="verified">تایید شده</option>
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
                برچسب
              </label>
              <input
                type="text"
                value={filters.tag}
                onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
                placeholder="جستجو در برچسب‌ها"
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

      {/* Transactions Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FaRedo className="animate-spin text-2xl text-[#FF7A00] mr-2" />
            <span>در حال بارگذاری...</span>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <FaHistory className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">هیچ تراکنشی یافت نشد</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">نوع</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">مبلغ</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">توضیحات</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">برچسب</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">تاریخ</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((transaction) => {
                  const typeDisplay = getTypeDisplay(transaction.type);
                  const statusDisplay = getStatusDisplay(transaction.status);

                  return (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className={`flex items-center gap-2 ${typeDisplay.color}`}>
                          {typeDisplay.icon}
                          <span className="font-medium">{typeDisplay.text}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-bold ${typeDisplay.color}`}>
                          {typeDisplay.prefix}{transaction.amount.toLocaleString()} تومان
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-900">{transaction.description || "-"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          <FaTags />
                          {transaction.tag || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt className="text-xs" />
                          {new Date(transaction.date).toLocaleDateString("fa-IR")}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusDisplay.color}`}>
                          {statusDisplay.icon}
                          {statusDisplay.text}
                        </span>
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
              onClick={() => fetchTransactions(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              قبلی
            </button>
            
            <span className="px-4 py-2 bg-[#FF7A00] text-white rounded-md">
              {pagination.page} از {pagination.pages}
            </span>
            
            <button
              onClick={() => fetchTransactions(pagination.page + 1)}
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

export default IncomesHistory;
