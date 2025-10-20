"use client";

import React, { useState, useEffect } from "react";
import { showToast } from "@/utilities/toast";
import { FiSearch, FiDownload, FiEye, FiEdit3 } from "react-icons/fi";

interface WalletTransaction {
  _id?: string;
  amount: number;
  tag: string;
  description: string;
  date: Date;
  verifiedAt?: Date;
  status: "pending" | "verified" | "rejected";
  verifiedBy?: string;
}

interface Wallet {
  _id: string;
  userId: {
    _id: string;
    firstName?: string;
    lastName?: string;
    phone: string;
    username: string;
  };
  inComes: WalletTransaction[];
  outComes: WalletTransaction[];
  balance: Array<{
    amount: number;
    updatedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const WalletsList: React.FC = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [filteredWallets, setFilteredWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [balanceFilter, setBalanceFilter] = useState("");
  const [showWalletDetails, setShowWalletDetails] = useState(false);
  const [showEditWallet, setShowEditWallet] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [editForm, setEditForm] = useState({
    inComes: [] as WalletTransaction[],
    outComes: [] as WalletTransaction[],
    balance: 0,
  });

  // Fetch all wallets
  const fetchWallets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/admin/wallets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch wallets");
      }

      const data = await response.json();
      setWallets(data.wallets || []);
      setFilteredWallets(data.wallets || []);
    } catch (error) {
      console.log("Error fetching wallets:", error);
      showToast.error("خطا در دریافت کیف پول‌ها");
    } finally {
      setLoading(false);
    }
  };

  // Filter wallets based on search and filters
  useEffect(() => {
    let filtered = wallets;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (wallet) =>
          wallet.userId.username
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          wallet.userId.phone.includes(searchTerm) ||
          (wallet.userId.firstName &&
            wallet.userId.firstName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (wallet.userId.lastName &&
            wallet.userId.lastName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    // Balance filter
    if (balanceFilter) {
      filtered = filtered.filter((wallet) => {
        const currentBalance =
          wallet.balance.length > 0
            ? wallet.balance[wallet.balance.length - 1].amount
            : 0;
        switch (balanceFilter) {
          case "positive":
            return currentBalance > 0;
          case "zero":
            return currentBalance === 0;
          case "negative":
            return currentBalance < 0;
          default:
            return true;
        }
      });
    }

    setFilteredWallets(filtered);
  }, [searchTerm, balanceFilter, wallets]);

  // Get wallet balance
  const getWalletBalance = (wallet: Wallet): number => {
    return wallet.balance.length > 0
      ? wallet.balance[wallet.balance.length - 1].amount
      : 0;
  };

  // Get balance color
  const getBalanceColor = (balance: number): string => {
    if (balance > 0) return "text-green-600";
    if (balance < 0) return "text-red-600";
    return "text-gray-600";
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
  };

  // Get transaction status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "verified":
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
      case "verified":
        return "تایید شده";
      case "rejected":
        return "رد شده";
      case "pending":
        return "در انتظار";
      default:
        return "نامشخص";
    }
  };

  // Open wallet details modal
  const openWalletDetails = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setShowWalletDetails(true);
  };

  // Open edit wallet modal
  const openEditWallet = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setEditForm({
      inComes: [...wallet.inComes],
      outComes: [...wallet.outComes],
      balance: getWalletBalance(wallet),
    });
    setShowEditWallet(true);
  };

  // Update wallet
  const handleUpdateWallet = async () => {
    if (!selectedWallet) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("authToken");

      const response = await fetch(`/api/admin/wallets/${selectedWallet._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error("Failed to update wallet");
      }

      showToast.success("کیف پول با موفقیت بروزرسانی شد");
      setShowEditWallet(false);
      fetchWallets();
    } catch (error) {
      console.log("Error updating wallet:", error);
      showToast.error("خطا در بروزرسانی کیف پول");
    } finally {
      setSubmitting(false);
    }
  };

  // Add new transaction
  const addTransaction = (type: "income" | "outcome") => {
    const newTransaction: WalletTransaction = {
      amount: 0,
      tag: "",
      description: "",
      date: new Date(),
      status: "pending",
    };

    if (type === "income") {
      setEditForm((prev) => ({
        ...prev,
        inComes: [...prev.inComes, newTransaction],
      }));
    } else {
      setEditForm((prev) => ({
        ...prev,
        outComes: [...prev.outComes, newTransaction],
      }));
    }
  };

  // Remove transaction
  const removeTransaction = (type: "income" | "outcome", index: number) => {
    if (type === "income") {
      setEditForm((prev) => ({
        ...prev,
        inComes: prev.inComes.filter((_, i) => i !== index),
      }));
    } else {
      setEditForm((prev) => ({
        ...prev,
        outComes: prev.outComes.filter((_, i) => i !== index),
      }));
    }
  };

  // Update transaction
  const updateTransaction = (
    type: "income" | "outcome",
    index: number,
    field: string,
    value: number | string
  ) => {
    if (type === "income") {
      setEditForm((prev) => ({
        ...prev,
        inComes: prev.inComes.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      }));
    } else {
      setEditForm((prev) => ({
        ...prev,
        outComes: prev.outComes.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      }));
    }
  };

  // Export wallets data
  const exportWallets = () => {
    const csvContent = [
      ["نام کاربری", "نام", "شماره تلفن", "موجودی", "تاریخ ایجاد"].join(","),
      ...filteredWallets.map((wallet) =>
        [
          wallet.userId.username,
          `${wallet.userId.firstName || ""} ${
            wallet.userId.lastName || ""
          }`.trim(),
          wallet.userId.phone,
          getWalletBalance(wallet),
          new Date(wallet.createdAt).toLocaleDateString("fa-IR"),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "wallets.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A1D37]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1D37] flex items-center gap-3">
            <span className="w-3 h-3 bg-[#0A1D37] rounded-full"></span>
            مدیریت کیف پول‌ها
          </h1>
          <p className="text-gray-600 mt-1">
            مشاهده و مدیریت تمام کیف پول‌های کاربران
          </p>
        </div>
        <button
          onClick={exportWallets}
          className="flex items-center gap-2 px-4 py-2 bg-[#0A1D37] text-white rounded-lg hover:bg-[#0A1D37]/90 transition-colors"
        >
          <FiDownload />
          خروجی CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#0A1D37]/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">کل کیف پول‌ها</p>
              <p className="text-2xl font-bold text-[#0A1D37]">
                {wallets.length.toLocaleString("fa-IR")}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#0A1D37]/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">موجودی مثبت</p>
              <p className="text-2xl font-bold text-green-600">
                {wallets
                  .filter((w) => getWalletBalance(w) > 0)
                  .length.toLocaleString("fa-IR")}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#0A1D37]/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">موجودی صفر</p>
              <p className="text-2xl font-bold text-gray-600">
                {wallets
                  .filter((w) => getWalletBalance(w) === 0)
                  .length.toLocaleString("fa-IR")}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#0A1D37]/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">موجودی منفی</p>
              <p className="text-2xl font-bold text-red-600">
                {wallets
                  .filter((w) => getWalletBalance(w) < 0)
                  .length.toLocaleString("fa-IR")}
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
                className="w-full pr-10 pl-3 py-2 border border-[#0A1D37]/20 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={balanceFilter}
              onChange={(e) => setBalanceFilter(e.target.value)}
              className="px-3 py-2 border border-[#0A1D37]/20 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] transition-colors"
            >
              <option value="">همه موجودی‌ها</option>
              <option value="positive">موجودی مثبت</option>
              <option value="zero">موجودی صفر</option>
              <option value="negative">موجودی منفی</option>
            </select>
          </div>
        </div>
      </div>

      {/* Wallets Table */}
      <div className="bg-white rounded-xl border border-[#0A1D37]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  کاربر
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  موجودی
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تعداد تراکنش‌ها
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  آخرین بروزرسانی
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWallets.map((wallet) => (
                <tr key={wallet._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {wallet.userId.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {`${wallet.userId.firstName || ""} ${
                            wallet.userId.lastName || ""
                          }`.trim() || "نام تعریف نشده"}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          {wallet.userId.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-medium ${getBalanceColor(
                        getWalletBalance(wallet)
                      )}`}
                    >
                      {formatCurrency(getWalletBalance(wallet))}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex flex-col gap-1">
                      <span className="text-green-600">
                        واریزی: {wallet.inComes.length}
                      </span>
                      <span className="text-red-600">
                        برداشتی: {wallet.outComes.length}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(wallet.updatedAt).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openWalletDetails(wallet)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="مشاهده جزئیات"
                      >
                        <FiEye />
                      </button>
                      <button
                        onClick={() => openEditWallet(wallet)}
                        className="p-2 text-[#0A1D37] hover:bg-orange-50 rounded-lg transition-colors"
                        title="ویرایش"
                      >
                        <FiEdit3 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredWallets.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            هیچ کیف پولی یافت نشد
          </div>
        )}
      </div>

      {/* Wallet Details Modal */}
      {showWalletDetails && selectedWallet && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full h-[90vh] overflow-y-auto shadow-2xl border border-[#0A1D37]/10">
            <div className="p-4 sm:p-6 border-b border-[#0A1D37]/10">
              <h2 className="text-xl font-bold text-[#0A1D37] flex items-center gap-3">
                <span className="w-3 h-3 bg-[#0A1D37] rounded-full"></span>
                جزئیات کیف پول - {selectedWallet.userId.username}
              </h2>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              {/* User Info */}
              <div className="bg-gray-50 rounded-xl p-4 border border-[#0A1D37]/10">
                <h3 className="text-base sm:text-lg font-semibold text-[#0A1D37] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#0A1D37] rounded-full"></span>
                  اطلاعات کاربر
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-600">
                      نام کاربری
                    </label>
                    <div className="text-sm sm:text-base text-[#0A1D37] mt-1 bg-white px-3 py-2 rounded-lg border border-[#0A1D37]/10">
                      {selectedWallet.userId.username}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-600">
                      نام کامل
                    </label>
                    <div className="text-sm sm:text-base text-[#0A1D37] mt-1 bg-white px-3 py-2 rounded-lg border border-[#0A1D37]/10">
                      {`${selectedWallet.userId.firstName || ""} ${
                        selectedWallet.userId.lastName || ""
                      }`.trim() || "تعریف نشده"}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-600">
                      شماره تلفن
                    </label>
                    <div className="text-sm sm:text-base text-[#0A1D37] mt-1 bg-white px-3 py-2 rounded-lg border border-[#0A1D37]/10 font-mono">
                      {selectedWallet.userId.phone}
                    </div>
                  </div>
                </div>
              </div>

              {/* Balance Info */}
              <div className="bg-gray-50 rounded-xl p-4 border border-[#0A1D37]/10">
                <h3 className="text-base sm:text-lg font-semibold text-[#0A1D37] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#0A1D37] rounded-full"></span>
                  موجودی کیف پول
                </h3>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-center">
                    <span
                      className={`text-2xl font-bold ${getBalanceColor(
                        getWalletBalance(selectedWallet)
                      )}`}
                    >
                      {formatCurrency(getWalletBalance(selectedWallet))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Income Transactions */}
              <div className="bg-gray-50 rounded-xl p-4 border border-[#0A1D37]/10">
                <h3 className="text-base sm:text-lg font-semibold text-[#0A1D37] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  تراکنش‌های واریزی ({selectedWallet.inComes.length})
                </h3>
                {selectedWallet.inComes.length > 0 ? (
                  <div className="space-y-3">
                    {selectedWallet.inComes.map((income, index) => (
                      <div
                        key={income._id || index}
                        className="bg-white p-3 sm:p-4 rounded-lg border"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">
                              #{index + 1}
                            </span>
                            <span
                              className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(
                                income.status
                              )}`}
                            >
                              {getStatusText(income.status)}
                            </span>
                          </div>
                          <span className="text-green-600 font-medium">
                            {formatCurrency(income.amount)}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-600">برچسب:</span>{" "}
                            {income.tag || "ندارد"}
                          </div>
                          <div>
                            <span className="text-gray-600">تاریخ:</span>{" "}
                            {new Date(income.date).toLocaleDateString("fa-IR")}
                          </div>
                        </div>
                        {income.description && (
                          <div className="mt-2 text-sm">
                            <span className="text-gray-600">توضیحات:</span>{" "}
                            {income.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 bg-white rounded border">
                    هیچ تراکنش واریزی ثبت نشده است
                  </div>
                )}
              </div>

              {/* Outcome Transactions */}
              <div className="bg-gray-50 rounded-xl p-4 border border-[#0A1D37]/10">
                <h3 className="text-base sm:text-lg font-semibold text-[#0A1D37] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  تراکنش‌های برداشتی ({selectedWallet.outComes.length})
                </h3>
                {selectedWallet.outComes.length > 0 ? (
                  <div className="space-y-3">
                    {selectedWallet.outComes.map((outcome, index) => (
                      <div
                        key={outcome._id || index}
                        className="bg-white p-3 sm:p-4 rounded-lg border"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">
                              #{index + 1}
                            </span>
                            <span
                              className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(
                                outcome.status
                              )}`}
                            >
                              {getStatusText(outcome.status)}
                            </span>
                          </div>
                          <span className="text-red-600 font-medium">
                            {formatCurrency(outcome.amount)}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-600">برچسب:</span>{" "}
                            {outcome.tag || "ندارد"}
                          </div>
                          <div>
                            <span className="text-gray-600">تاریخ:</span>{" "}
                            {new Date(outcome.date).toLocaleDateString("fa-IR")}
                          </div>
                        </div>
                        {outcome.description && (
                          <div className="mt-2 text-sm">
                            <span className="text-gray-600">توضیحات:</span>{" "}
                            {outcome.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 bg-white rounded border">
                    هیچ تراکنش برداشتی ثبت نشده است
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-[#0A1D37]/10 bg-gray-50 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setShowWalletDetails(false)}
                className="w-full sm:w-auto px-4 py-2 text-[#0A1D37] border border-[#0A1D37]/20 rounded-lg hover:bg-gray-100 transition-colors"
              >
                بستن
              </button>
              <button
                onClick={() => {
                  setShowWalletDetails(false);
                  openEditWallet(selectedWallet);
                }}
                className="w-full sm:w-auto px-4 py-2 bg-[#0A1D37] text-white rounded-lg hover:bg-[#0A1D37]/90 transition-colors"
              >
                ویرایش
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Wallet Modal */}
      {showEditWallet && selectedWallet && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full h-[90vh] overflow-y-auto shadow-2xl border border-[#0A1D37]/10">
            <div className="p-4 sm:p-6 border-b border-[#0A1D37]/10">
              <h2 className="text-xl font-bold text-[#0A1D37] flex items-center gap-3">
                <span className="w-3 h-3 bg-[#0A1D37] rounded-full"></span>
                ویرایش کیف پول - {selectedWallet.userId.username}
              </h2>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              {/* Balance Section */}
              <div className="bg-gray-50 rounded-xl p-4 border border-[#0A1D37]/10">
                <h3 className="text-base sm:text-lg font-semibold text-[#0A1D37] mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#0A1D37] rounded-full"></span>
                  موجودی کیف پول
                </h3>
                <div>
                  <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                    موجودی جدید (تومان)
                  </label>
                  <input
                    type="number"
                    value={editForm.balance}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        balance: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-[#0A1D37]/20 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] transition-colors"
                  />
                </div>
              </div>

              {/* Income Transactions */}
              <div className="bg-gray-50 rounded-xl p-4 border border-[#0A1D37]/10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base sm:text-lg font-semibold text-[#0A1D37] flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    تراکنش‌های واریزی
                  </h3>
                  <button
                    onClick={() => addTransaction("income")}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                  >
                    افزودن
                  </button>
                </div>
                <div className="space-y-3">
                  {editForm.inComes.map((income, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            مبلغ
                          </label>
                          <input
                            type="number"
                            value={income.amount}
                            onChange={(e) =>
                              updateTransaction(
                                "income",
                                index,
                                "amount",
                                Number(e.target.value)
                              )
                            }
                            className="w-full px-2 py-1 border rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            برچسب
                          </label>
                          <input
                            type="text"
                            value={income.tag}
                            onChange={(e) =>
                              updateTransaction(
                                "income",
                                index,
                                "tag",
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 border rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            وضعیت
                          </label>
                          <select
                            value={income.status}
                            onChange={(e) =>
                              updateTransaction(
                                "income",
                                index,
                                "status",
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 border rounded text-sm"
                          >
                            <option value="pending">در انتظار</option>
                            <option value="verified">تایید شده</option>
                            <option value="rejected">رد شده</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={() => removeTransaction("income", index)}
                            className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          توضیحات
                        </label>
                        <textarea
                          value={income.description}
                          onChange={(e) =>
                            updateTransaction(
                              "income",
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          className="w-full px-2 py-1 border rounded text-sm resize-none"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outcome Transactions */}
              <div className="bg-gray-50 rounded-xl p-4 border border-[#0A1D37]/10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base sm:text-lg font-semibold text-[#0A1D37] flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    تراکنش‌های برداشتی
                  </h3>
                  <button
                    onClick={() => addTransaction("outcome")}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                  >
                    افزودن
                  </button>
                </div>
                <div className="space-y-3">
                  {editForm.outComes.map((outcome, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            مبلغ
                          </label>
                          <input
                            type="number"
                            value={outcome.amount}
                            onChange={(e) =>
                              updateTransaction(
                                "outcome",
                                index,
                                "amount",
                                Number(e.target.value)
                              )
                            }
                            className="w-full px-2 py-1 border rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            برچسب
                          </label>
                          <input
                            type="text"
                            value={outcome.tag}
                            onChange={(e) =>
                              updateTransaction(
                                "outcome",
                                index,
                                "tag",
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 border rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            وضعیت
                          </label>
                          <select
                            value={outcome.status}
                            onChange={(e) =>
                              updateTransaction(
                                "outcome",
                                index,
                                "status",
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 border rounded text-sm"
                          >
                            <option value="pending">در انتظار</option>
                            <option value="verified">تایید شده</option>
                            <option value="rejected">رد شده</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={() => removeTransaction("outcome", index)}
                            className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          توضیحات
                        </label>
                        <textarea
                          value={outcome.description}
                          onChange={(e) =>
                            updateTransaction(
                              "outcome",
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          className="w-full px-2 py-1 border rounded text-sm resize-none"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-[#0A1D37]/10 flex justify-end gap-3">
              <button
                onClick={() => setShowEditWallet(false)}
                className="px-4 py-2 text-[#0A1D37] border border-[#0A1D37]/20 rounded-lg hover:bg-gray-50 transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={handleUpdateWallet}
                disabled={submitting}
                className="px-4 py-2 bg-[#0A1D37] text-white rounded-lg hover:bg-[#0A1D37]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

export default WalletsList;
