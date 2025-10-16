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
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaFileInvoice,
  FaEraser,
  FaSearch,
} from "react-icons/fa";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { showToast } from "@/utilities/toast";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

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

  const { isLoggedIn, loading: userLoading } = useCurrentUser();

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
  }, [isLoggedIn, userLoading]);

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
    fetchTransactions(1);
  };

  // Get status color and icon
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "verified":
        return {
          color: "text-green-700 bg-green-100 border-green-200",
          icon: <FaCheckCircle className="text-sm" />,
          text: "تایید شده",
        };
      case "pending":
        return {
          color: "text-yellow-700 bg-yellow-100 border-yellow-200",
          icon: <FaClock className="text-sm" />,
          text: "در انتظار",
        };
      case "rejected":
        return {
          color: "text-red-700 bg-red-100 border-red-200",
          icon: <FaTimesCircle className="text-sm" />,
          text: "رد شده",
        };
      default:
        return {
          color: "text-gray-700 bg-gray-100 border-gray-200",
          icon: <FaEye className="text-sm" />,
          text: "نامشخص",
        };
    }
  };

  // Get type display
  const getTypeDisplay = (type: string) => {
    return type === "income"
      ? {
          color: "text-green-600",
          bgColor: "bg-green-50",
          icon: <FaArrowUp className="text-sm sm:text-base" />,
          text: "واریز",
          prefix: "+",
        }
      : {
          color: "text-red-600",
          bgColor: "bg-red-50",
          icon: <FaArrowDown className="text-sm sm:text-base" />,
          text: "برداشت",
          prefix: "-",
        };
  };

  if (userLoading) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center p-4"
        dir="rtl"
      >
        <div className="text-center">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] rounded-2xl animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaRedo className="animate-spin text-2xl sm:text-3xl text-white" />
            </div>
          </div>
          <p className="text-base sm:text-lg font-medium text-gray-700">
            در حال بارگذاری...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-3 sm:p-4 lg:p-6"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0A1D37] flex items-center gap-2 sm:gap-3 mb-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#FF7A00]/20 to-[#4DBFF0]/20 rounded-xl flex items-center justify-center">
                  <FaHistory className="text-[#FF7A00] text-lg sm:text-xl" />
                </div>
                <span>تاریخچه تراکنش‌ها</span>
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 mr-12 sm:mr-14">
                مشاهده کامل واریزها و برداشت‌های کیف پول
              </p>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 hover:scale-105 ${
                showFilters
                  ? "bg-gray-600 text-white"
                  : "bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] text-white shadow-md"
              }`}
            >
              <FaFilter className="text-sm sm:text-base" />
              <span>{showFilters ? "بستن فیلترها" : "فیلترها"}</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100/50 border-2 border-green-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md">
                  <FaArrowUp className="text-white text-base sm:text-lg lg:text-xl" />
                </div>
                <div className="text-right">
                  <p className="text-lg sm:text-xl lg:text-2xl text-green-700 font-bold">
                    {summary.totalIncome.toLocaleString("fa-IR")}
                  </p>
                  <p className="text-xs sm:text-sm text-green-600">تومان</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm lg:text-base text-green-700 font-semibold">
                کل واریزها
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100/50 border-2 border-red-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md">
                  <FaArrowDown className="text-white text-base sm:text-lg lg:text-xl" />
                </div>
                <div className="text-right">
                  <p className="text-lg sm:text-xl lg:text-2xl text-red-700 font-bold">
                    {summary.totalOutcome.toLocaleString("fa-IR")}
                  </p>
                  <p className="text-xs sm:text-sm text-red-600">تومان</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm lg:text-base text-red-700 font-semibold">
                کل برداشت‌ها
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 border-2 border-yellow-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md">
                  <FaClock className="text-white text-base sm:text-lg lg:text-xl" />
                </div>
                <div className="text-right">
                  <p className="text-lg sm:text-xl lg:text-2xl text-yellow-700 font-bold">
                    {summary.pendingIncome.toLocaleString("fa-IR")}
                  </p>
                  <p className="text-xs sm:text-sm text-yellow-600">تومان</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm lg:text-base text-yellow-700 font-semibold">
                در انتظار واریز
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md">
                  <FaClock className="text-white text-base sm:text-lg lg:text-xl" />
                </div>
                <div className="text-right">
                  <p className="text-lg sm:text-xl lg:text-2xl text-blue-700 font-bold">
                    {summary.pendingOutcome.toLocaleString("fa-IR")}
                  </p>
                  <p className="text-xs sm:text-sm text-blue-600">تومان</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm lg:text-base text-blue-700 font-semibold">
                در انتظار برداشت
              </p>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white border-2 border-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-[#FF7A00]/20 to-[#4DBFF0]/20 rounded-xl flex items-center justify-center">
                <FaSearch className="text-[#FF7A00]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0A1D37]">
                فیلتر پیشرفته تراکنش‌ها
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#0A1D37] mb-2">
                  نوع تراکنش
                </label>
                <select
                  value={filters.type}
                  onChange={(e) =>
                    setFilters({ ...filters, type: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF7A00]/30 focus:border-[#FF7A00] transition-all text-sm sm:text-base"
                >
                  <option value="all">همه</option>
                  <option value="income">واریز</option>
                  <option value="outcome">برداشت</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#0A1D37] mb-2">
                  وضعیت
                </label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF7A00]/30 focus:border-[#FF7A00] transition-all text-sm sm:text-base"
                >
                  <option value="">همه</option>
                  <option value="pending">در انتظار</option>
                  <option value="verified">تایید شده</option>
                  <option value="rejected">رد شده</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#0A1D37] mb-2">
                  از تاریخ
                </label>
                <DatePicker
                  value={filters.startDate}
                  onChange={(date: DateObject | null) => {
                    if (date) {
                      const gregorianDate = new Date(
                        date.year,
                        date.month.number - 1,
                        date.day
                      );
                      setFilters({
                        ...filters,
                        startDate: gregorianDate.toISOString().split("T")[0],
                      });
                    }
                  }}
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-right"
                  inputClass="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF7A00]/30 focus:border-[#FF7A00] transition-all text-sm sm:text-base"
                  placeholder="انتخاب تاریخ"
                  containerClassName="w-full"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#0A1D37] mb-2">
                  تا تاریخ
                </label>
                <DatePicker
                  value={filters.endDate}
                  onChange={(date: DateObject | null) => {
                    if (date) {
                      const gregorianDate = new Date(
                        date.year,
                        date.month.number - 1,
                        date.day
                      );
                      setFilters({
                        ...filters,
                        endDate: gregorianDate.toISOString().split("T")[0],
                      });
                    }
                  }}
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-right"
                  inputClass="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF7A00]/30 focus:border-[#FF7A00] transition-all text-sm sm:text-base"
                  placeholder="انتخاب تاریخ"
                  containerClassName="w-full"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-[#0A1D37] mb-2">
                  برچسب
                </label>
                <div className="relative">
                  <FaTags className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={filters.tag}
                    onChange={(e) =>
                      setFilters({ ...filters, tag: e.target.value })
                    }
                    placeholder="جستجو در برچسب‌ها"
                    className="w-full pr-10 sm:pr-12 pl-3 sm:pl-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF7A00]/30 focus:border-[#FF7A00] transition-all text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={handleApplyFilters}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] text-white rounded-xl font-bold hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              >
                <FaSearch />
                <span>اعمال فیلترها</span>
              </button>
              <button
                onClick={handleClearFilters}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              >
                <FaEraser />
                <span>پاک کردن فیلترها</span>
              </button>
            </div>
          </div>
        )}

        {/* Transactions Table/Cards */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-gray-100 overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 lg:py-24">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] rounded-2xl animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaRedo className="animate-spin text-2xl sm:text-3xl text-white" />
                </div>
              </div>
              <p className="text-base sm:text-lg font-medium text-gray-700 mb-2">
                در حال بارگذاری تراکنش‌ها...
              </p>
              <p className="text-xs sm:text-sm text-gray-500">لطفاً صبر کنید</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-16 sm:py-20 lg:py-24 px-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaHistory className="text-4xl sm:text-5xl text-gray-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0A1D37] mb-3">
                هیچ تراکنشی یافت نشد
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mb-6">
                تاکنون تراکنشی ثبت نشده است
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-right text-sm font-bold text-[#0A1D37]">
                        نوع
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-[#0A1D37]">
                        مبلغ
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-[#0A1D37]">
                        توضیحات
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-[#0A1D37]">
                        برچسب
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-[#0A1D37]">
                        تاریخ
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-[#0A1D37]">
                        وضعیت
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transactions.map((transaction) => {
                      const typeDisplay = getTypeDisplay(transaction.type);
                      const statusDisplay = getStatusDisplay(
                        transaction.status
                      );

                      return (
                        <tr
                          key={transaction._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div
                              className={`flex items-center gap-2 ${typeDisplay.color}`}
                            >
                              <div
                                className={`w-8 h-8 ${typeDisplay.bgColor} rounded-lg flex items-center justify-center`}
                              >
                                {typeDisplay.icon}
                              </div>
                              <span className="font-bold">
                                {typeDisplay.text}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`font-bold ${typeDisplay.color}`}>
                              {typeDisplay.prefix}
                              {transaction.amount.toLocaleString("fa-IR")} تومان
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-900 text-sm">
                              {transaction.description || "-"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200">
                              <FaTags className="text-xs" />
                              {transaction.tag || "-"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <FaCalendarAlt className="text-sm" />
                              <span className="text-sm font-medium">
                                {new Date(transaction.date).toLocaleDateString(
                                  "fa-IR"
                                )}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold border ${statusDisplay.color}`}
                            >
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

              {/* Mobile Card View */}
              <div className="lg:hidden divide-y divide-gray-100">
                {transactions.map((transaction) => {
                  const typeDisplay = getTypeDisplay(transaction.type);
                  const statusDisplay = getStatusDisplay(transaction.status);

                  return (
                    <div
                      key={transaction._id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 ${typeDisplay.bgColor} rounded-xl flex items-center justify-center`}
                          >
                            {typeDisplay.icon}
                          </div>
                          <div>
                            <p
                              className={`font-bold text-sm ${typeDisplay.color}`}
                            >
                              {typeDisplay.text}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {transaction.tag || "بدون برچسب"}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${statusDisplay.color}`}
                        >
                          {statusDisplay.icon}
                          {statusDisplay.text}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">مبلغ:</span>
                          <span
                            className={`font-bold text-sm ${typeDisplay.color}`}
                          >
                            {typeDisplay.prefix}
                            {transaction.amount.toLocaleString("fa-IR")} تومان
                          </span>
                        </div>

                        {transaction.description && (
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-xs text-gray-600 flex-shrink-0">
                              توضیحات:
                            </span>
                            <span className="text-xs text-gray-900 text-left">
                              {transaction.description}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <FaCalendarAlt className="text-xs" />
                            <span className="text-xs">
                              {new Date(transaction.date).toLocaleDateString(
                                "fa-IR"
                              )}
                            </span>
                          </div>
                          <FaFileInvoice className="text-gray-400 text-sm" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 sm:mt-8">
            <button
              onClick={() => fetchTransactions(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm sm:text-base"
            >
              <FaChevronRight className="text-sm" />
              <span>قبلی</span>
            </button>

            <div className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] text-white rounded-xl font-bold shadow-md text-sm sm:text-base">
              <span>
                صفحه {pagination.page} از {pagination.pages}
              </span>
            </div>

            <button
              onClick={() => fetchTransactions(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm sm:text-base"
            >
              <span>بعدی</span>
              <FaChevronLeft className="text-sm" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomesHistory;
