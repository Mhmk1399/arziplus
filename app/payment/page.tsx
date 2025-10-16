"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  FaReceipt,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSpinner,
  FaPlus,
  FaHistory,
  FaEye,
  FaArrowRight,
  FaWallet,
  FaShieldAlt,
  FaChartLine,
} from "react-icons/fa";

interface PaymentStats {
  totalAmount: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
}

interface RecentPayment {
  _id: string;
  authority: string;
  amount: number;
  currency: "IRR" | "IRT";
  description: string;
  status: "pending" | "paid" | "verified" | "failed" | "cancelled";
  createdAt: string;
}

const PaymentDashboard: React.FC = () => {
  const router = useRouter();
  const {
    user: currentUser,
    isLoggedIn,
    loading: userLoading,
  } = useCurrentUser();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([]);

  useEffect(() => {
    // Wait for user loading to complete before checking authentication
    if (userLoading) return;

    if (!isLoggedIn) {
      router.push("/auth/sms");
      return;
    }

    fetchDashboardData();
  }, [isLoggedIn, userLoading, router]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/payment/history?limit=5", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStats(data.data.statistics);
        setRecentPayments(data.data.payments);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return `${amount.toLocaleString("fa-IR")} تومان`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fa-IR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <FaCheckCircle className="text-green-500" />;
      case "paid":
        return <FaCheckCircle className="text-blue-500" />;
      case "pending":
        return <FaClock className="text-yellow-500" />;
      case "failed":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "verified":
        return "تایید شده";
      case "paid":
        return "پرداخت شده";
      case "pending":
        return "در انتظار";
      case "failed":
        return "ناموفق";
      case "cancelled":
        return "لغو شده";
      default:
        return status;
    }
  };

  // Show loading while checking authentication
  if (userLoading) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center"
        dir="rtl"
      >
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
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50"
      dir="rtl"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 mt-20">
          <div className="w-20 h-20 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] rounded-full flex items-center justify-center mx-auto mb-4">
            <FaWallet className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-[#0A1D37] mb-2">
            داشبورد پرداخت
          </h1>
          <p className="text-gray-600">مدیریت پرداخت‌ها و تراکنش‌های خود</p>
        </div>

        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-1">
                خوش آمدید، {currentUser.firstName || "کاربر محترم"}!
              </h2>
              <p className="text-white/80">
                پرداخت‌های خود را به راحتی مدیریت کنید
              </p>
            </div>
            <FaShieldAlt className="text-4xl text-white/20" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => router.push("/payment/request")}
            className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaPlus className="text-white text-xl" />
              </div>
              <FaArrowRight className="text-gray-400 group-hover:text-[#FF7A00] transition-colors" />
            </div>
            <h3 className="font-semibold text-[#0A1D37] mb-2">پرداخت جدید</h3>
            <p className="text-gray-600 text-sm">ایجاد درخواست پرداخت جدید</p>
          </button>

          <button
            onClick={() => router.push("/payment/status")}
            className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaSearch className="text-white text-xl" />
              </div>
              <FaArrowRight className="text-gray-400 group-hover:text-[#FF7A00] transition-colors" />
            </div>
            <h3 className="font-semibold text-[#0A1D37] mb-2">استعلام وضعیت</h3>
            <p className="text-gray-600 text-sm">بررسی وضعیت پرداخت</p>
          </button>

          <button
            onClick={() => router.push("/payment/history")}
            className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaHistory className="text-white text-xl" />
              </div>
              <FaArrowRight className="text-gray-400 group-hover:text-[#FF7A00] transition-colors" />
            </div>
            <h3 className="font-semibold text-[#0A1D37] mb-2">
              تاریخچه پرداخت
            </h3>
            <p className="text-gray-600 text-sm">مشاهده تمام پرداخت‌ها</p>
          </button>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    کل مبلغ پرداخت‌ها
                  </p>
                  <p className="text-2xl font-bold text-[#0A1D37]">
                    {formatAmount(stats.totalAmount)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] rounded-xl flex items-center justify-center">
                  <FaChartLine className="text-white text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">پرداخت‌های موفق</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.successfulPayments}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <FaCheckCircle className="text-green-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">در انتظار پرداخت</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.pendingPayments}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <FaClock className="text-yellow-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    پرداخت‌های ناموفق
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.failedPayments}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <FaTimesCircle className="text-red-600 text-xl" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Payments */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#0A1D37]">
                آخرین پرداخت‌ها
              </h3>
              <button
                onClick={() => router.push("/payment/history")}
                className="flex items-center gap-2 text-[#FF7A00] hover:text-[#e56a00] transition-colors"
              >
                <span>مشاهده همه</span>
                <FaArrowRight />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <FaSpinner className="animate-spin text-4xl text-[#FF7A00]" />
            </div>
          ) : recentPayments.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {recentPayments.map((payment) => (
                <div
                  key={payment._id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        {getStatusIcon(payment.status)}
                      </div>
                      <div>
                        <p className="font-semibold text-[#0A1D37] mb-1">
                          {formatAmount(payment.amount)}
                        </p>
                        <p className="text-sm text-gray-600 max-w-xs truncate">
                          {payment.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            payment.status === "verified"
                              ? "bg-green-100 text-green-800"
                              : payment.status === "paid"
                              ? "bg-blue-100 text-blue-800"
                              : payment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {getStatusText(payment.status)}
                        </span>
                        <button
                          onClick={() => {
                            if (
                              payment.status === "verified" ||
                              payment.status === "paid"
                            ) {
                              router.push(
                                `/payment/success?Authority=${payment.authority}`
                              );
                            } else {
                              router.push(
                                `/payment/failed?Authority=${payment.authority}`
                              );
                            }
                          }}
                          className="text-[#FF7A00] hover:text-[#e56a00] transition-colors"
                        >
                          <FaEye />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatDate(payment.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaReceipt className="text-4xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">هنوز پرداختی انجام نداده‌اید</p>
              <button
                onClick={() => router.push("/payment/request")}
                className="px-6 py-2 bg-[#FF7A00] text-white rounded-lg hover:bg-[#e56a00] transition-colors"
              >
                پرداخت جدید
              </button>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <FaShieldAlt className="text-white text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800 mb-1">پرداخت امن</h3>
              <p className="text-green-700 text-sm">
                تمامی پرداخت‌ها از طریق درگاه امن زرین‌پال با بالاترین
                استانداردهای امنیتی انجام می‌شود
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDashboard;
