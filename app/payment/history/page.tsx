"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  FaReceipt,
  FaCalendarAlt,
  FaSearch,
  FaFilter,
  FaDownload,
  FaEye,
  FaSpinner,
  FaCreditCard,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationTriangle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { showToast } from "@/utilities/toast";

interface Payment {
  _id: string;
  authority: string;
  amount: number;
  currency: 'IRR' | 'IRT';
  description: string;
  status: 'pending' | 'paid' | 'verified' | 'failed' | 'cancelled';
  zarinpalResponse?: {
    refId?: string;
    cardHash?: string;
    cardPan?: string;
    feeType?: string;
    fee?: number;
  };
  createdAt: string;
  verifiedAt?: string;
  user?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
}

interface PaymentHistory {
  payments: Payment[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPayments: number;
    limit: number;
  };
  statistics: {
    totalAmount: number;
    successfulPayments: number;
    failedPayments: number;
    pendingPayments: number;
  };
}

const PaymentHistoryPage: React.FC = () => {
  const router = useRouter();
  const { user: currentUser, isLoggedIn, loading: userLoading } = useCurrentUser();
  
  const [loading, setLoading] = useState(true);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    startDate: '',
    endDate: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Wait for user loading to complete before checking authentication
    if (userLoading) return;
    
    if (!isLoggedIn) {
      router.push("/auth/sms");
      return;
    }

    fetchPaymentHistory();
  }, [isLoggedIn, userLoading, router, currentPage]);

  const fetchPaymentHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...filters,
      });

      const response = await fetch(`/api/payment/history?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPaymentHistory(data.data);
      } else {
        showToast.error(data.error || "خطا در دریافت تاریخچه پرداخت");
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
      showToast.error("خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchPaymentHistory();
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      search: '',
      startDate: '',
      endDate: '',
    });
    setCurrentPage(1);
    fetchPaymentHistory();
  };

  const formatAmount = (amount: number, currency: 'IRR' | 'IRT') => {
    if (currency === 'IRT') {
      return `${amount.toLocaleString('fa-IR')} تومان`;
    }
    return `${amount.toLocaleString('fa-IR')} ریال`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <FaCheckCircle className="text-green-500" />;
      case 'paid':
        return <FaCheckCircle className="text-blue-500" />;
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'failed':
        return <FaTimesCircle className="text-red-500" />;
      case 'cancelled':
        return <FaExclamationTriangle className="text-gray-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified': return 'تایید شده';
      case 'paid': return 'پرداخت شده';
      case 'pending': return 'در انتظار';
      case 'failed': return 'ناموفق';
      case 'cancelled': return 'لغو شده';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const viewPaymentDetails = (payment: Payment) => {
    if (payment.status === 'verified' || payment.status === 'paid') {
      router.push(`/payment/success?Authority=${payment.authority}`);
    } else {
      router.push(`/payment/failed?Authority=${payment.authority}`);
    }
  };

  const exportHistory = () => {
    if (!paymentHistory?.payments.length) return;

    const csvContent = [
      'تاریخ,مبلغ,وضعیت,کد پیگیری,توضیحات',
      ...paymentHistory.payments.map(payment => 
        `${formatDate(payment.createdAt)},${formatAmount(payment.amount, payment.currency)},${getStatusText(payment.status)},${payment.authority},"${payment.description}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-history-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Show loading while checking authentication
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#FF7A00] mx-auto mb-4" />
          <p className="text-gray-600">در حال بررسی احراز هویت...</p>
        </div>
      </div>
    );
  }

  // Redirect if not logged in (after loading is complete)
  if (!isLoggedIn || !currentUser) {
    return null; // Component will unmount due to router.push in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] rounded-full flex items-center justify-center mx-auto mb-4">
            <FaReceipt className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-[#0A1D37] mb-2">تاریخچه پرداخت</h1>
          <p className="text-gray-600">مشاهده و مدیریت پرداخت‌های شما</p>
        </div>

        {/* Statistics */}
        {paymentHistory?.statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">کل مبلغ پرداخت‌ها</p>
                  <p className="text-xl font-bold text-[#0A1D37]">
                    {formatAmount(paymentHistory.statistics.totalAmount, 'IRR')}
                  </p>
                </div>
                <FaCreditCard className="text-3xl text-[#FF7A00]" />
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">پرداخت‌های موفق</p>
                  <p className="text-xl font-bold text-green-600">
                    {paymentHistory.statistics.successfulPayments}
                  </p>
                </div>
                <FaCheckCircle className="text-3xl text-green-500" />
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">پرداخت‌های ناموفق</p>
                  <p className="text-xl font-bold text-red-600">
                    {paymentHistory.statistics.failedPayments}
                  </p>
                </div>
                <FaTimesCircle className="text-3xl text-red-500" />
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">در انتظار پرداخت</p>
                  <p className="text-xl font-bold text-yellow-600">
                    {paymentHistory.statistics.pendingPayments}
                  </p>
                </div>
                <FaClock className="text-3xl text-yellow-500" />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#0A1D37]">فیلترها و جستجو</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaFilter />
                فیلترها
              </button>
              <button
                onClick={exportHistory}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <FaDownload />
                خروجی Excel
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">جستجو</label>
                <div className="relative">
                  <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pr-10 pl-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00]"
                    placeholder="جستجو در توضیحات یا کد پیگیری"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">وضعیت</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00]"
                >
                  <option value="">همه وضعیت‌ها</option>
                  <option value="verified">تایید شده</option>
                  <option value="paid">پرداخت شده</option>
                  <option value="pending">در انتظار</option>
                  <option value="failed">ناموفق</option>
                  <option value="cancelled">لغو شده</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">از تاریخ</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">تا تاریخ</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00]"
                />
              </div>
            </div>
          )}

          {showFilters && (
            <div className="flex gap-2">
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-[#FF7A00] text-white rounded-lg hover:bg-[#e56a00] transition-colors"
              >
                اعمال فیلتر
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                پاک کردن
              </button>
            </div>
          )}
        </div>

        {/* Payment List */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <FaSpinner className="animate-spin text-4xl text-[#FF7A00] mb-4" />
            </div>
          ) : paymentHistory?.payments.length ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        تاریخ
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        مبلغ
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        وضعیت
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        کد پیگیری
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        توضیحات
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        عملیات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paymentHistory.payments.map((payment) => (
                      <tr key={payment._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-gray-400" />
                            {formatDate(payment.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatAmount(payment.amount, payment.currency)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(payment.status)}
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                              {getStatusText(payment.status)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                          {payment.authority}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {payment.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => viewPaymentDetails(payment)}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          >
                            <FaEye />
                            مشاهده
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {paymentHistory.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                  <div className="text-sm text-gray-700">
                    صفحه {paymentHistory.pagination.currentPage} از {paymentHistory.pagination.totalPages}
                    ({paymentHistory.pagination.totalPayments} پرداخت)
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaChevronRight />
                      قبلی
                    </button>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === paymentHistory.pagination.totalPages}
                      className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      بعدی
                      <FaChevronLeft />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <FaReceipt className="text-4xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">هیچ پرداختی یافت نشد</p>
              <button
                onClick={() => router.push('/payment/request')}
                className="px-6 py-2 bg-[#FF7A00] text-white rounded-lg hover:bg-[#e56a00] transition-colors"
              >
                پرداخت جدید
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryPage;