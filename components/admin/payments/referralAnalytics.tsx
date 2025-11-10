"use client";

import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaGift,
  FaTrophy,
  FaChartLine,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaFilter,
} from "react-icons/fa";
import { showToast } from "@/utilities/toast";

interface ReferralAnalytics {
  overview: {
    totalReferrals: number;
    pendingReferrals: number;
    completedReferrals: number;
    rewardedReferrals: number;
    expiredReferrals: number;
    conversionRate: string;
    avgCompletionDays: string;
    usersWithNoReferrals: number;
  };
  rewards: {
    totalRewards: number;
    pendingRewards: number;
    claimedRewards: number;
    expiredRewards: number;
    totalValueDistributed: number;
    avgRewardValue: number;
    rewardsByType: Array<{
      _id: string;
      count: number;
      totalValue: number;
    }>;
  };
  topReferrers: Array<{
    _id: {
      nationalCredentials: {
        firstName: string;
        lastName: string;
      };
      referralCode: string;
    };
    totalReferrals: number;
    completedReferrals: number;
    rewardedReferrals: number;
    totalRewardAmount: number;
  }>;
  trends: Array<{
    _id: {
      year: number;
      month: number;
    };
    count: number;
    completed: number;
    rewarded: number;
  }>;
  recentActivity: Array<{
    _id: string;
    status: string;
    createdAt: string;
    referrer: {
      nationalCredentials: {
        firstName: string;
        lastName: string;
      };
      referralCode: string;
    };
    referee: {
      nationalCredentials: {
        firstName: string;
        lastName: string;
      };
    };
  }>;
}

const AdminReferralAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<ReferralAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeView, setActiveView] = useState<"overview" | "trends" | "top">("overview");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async (start?: string, end?: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      let url = "/api/referrals/analytics";
      
      const params = new URLSearchParams();
      if (start) params.append("startDate", start);
      if (end) params.append("endDate", end);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.data);
      } else {
        showToast.error("خطا در دریافت اطلاعات");
      }
    } catch (error) {
      console.log(error);
      showToast.error("خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  const applyDateFilter = () => {
    fetchAnalytics(startDate, endDate);
  };

  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
    fetchAnalytics();
  };

  const getRewardTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      wallet_credit: "اعتبار کیف پول",
      discount: "تخفیف",
      service_upgrade: "ارتقاء سرویس",
    };
    return types[type] || type;
  };

  const getMonthName = (month: number) => {
    const months = [
      "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
      "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
    ];
    return months[month - 1] || month.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center p-12">
        <p className="text-gray-600">خطا در بارگذاری اطلاعات</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Date Filter */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">تحلیل سیستم معرفی</h2>
            <p className="text-gray-600 text-sm">آمار و گزارش‌های کامل سیستم معرفی کاربران</p>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-500">تا</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={applyDateFilter}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <FaFilter />
              اعمال
            </button>
            {(startDate || endDate) && (
              <button
                onClick={clearDateFilter}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                پاک کردن
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <FaUsers className="text-4xl opacity-80" />
            <div className="text-right">
              <div className="text-3xl font-bold">{analytics.overview.totalReferrals}</div>
              <div className="text-blue-100 text-sm">کل معرفی‌ها</div>
            </div>
          </div>
          <div className="flex justify-between text-sm border-t border-blue-400 pt-3">
            <span>نرخ تبدیل:</span>
            <span className="font-bold">{analytics.overview.conversionRate}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <FaCheckCircle className="text-4xl opacity-80" />
            <div className="text-right">
              <div className="text-3xl font-bold">{analytics.overview.completedReferrals}</div>
              <div className="text-green-100 text-sm">تکمیل شده</div>
            </div>
          </div>
          <div className="flex justify-between text-sm border-t border-green-400 pt-3">
            <span>میانگین زمان:</span>
            <span className="font-bold">{analytics.overview.avgCompletionDays}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <FaGift className="text-4xl opacity-80" />
            <div className="text-right">
              <div className="text-3xl font-bold">{analytics.rewards.totalRewards}</div>
              <div className="text-purple-100 text-sm">کل پاداش‌ها</div>
            </div>
          </div>
          <div className="flex justify-between text-sm border-t border-purple-400 pt-3">
            <span>دریافت شده:</span>
            <span className="font-bold">{analytics.rewards.claimedRewards}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <FaChartLine className="text-4xl opacity-80" />
            <div className="text-right">
              <div className="text-3xl font-bold">
                {(analytics.rewards.totalValueDistributed / 1000000).toFixed(1)}M
              </div>
              <div className="text-orange-100 text-sm">ارزش توزیع شده</div>
            </div>
          </div>
          <div className="flex justify-between text-sm border-t border-orange-400 pt-3">
            <span>میانگین:</span>
            <span className="font-bold">{analytics.rewards.avgRewardValue.toLocaleString()} ت</span>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 text-center">
          <div className="text-yellow-600 text-2xl font-bold">{analytics.overview.pendingReferrals}</div>
          <div className="text-gray-600 text-sm mt-1">در انتظار</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 text-center">
          <div className="text-green-600 text-2xl font-bold">{analytics.overview.rewardedReferrals}</div>
          <div className="text-gray-600 text-sm mt-1">پاداش داده شده</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 text-center">
          <div className="text-red-600 text-2xl font-bold">{analytics.overview.expiredReferrals}</div>
          <div className="text-gray-600 text-sm mt-1">منقضی شده</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 text-center">
          <div className="text-gray-600 text-2xl font-bold">{analytics.overview.usersWithNoReferrals}</div>
          <div className="text-gray-600 text-sm mt-1">بدون معرفی</div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveView("overview")}
              className={`flex-1 px-4 py-3 font-medium transition-colors ${
                activeView === "overview"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              پاداش‌ها
            </button>
            <button
              onClick={() => setActiveView("trends")}
              className={`flex-1 px-4 py-3 font-medium transition-colors ${
                activeView === "trends"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              روند زمانی
            </button>
            <button
              onClick={() => setActiveView("top")}
              className={`flex-1 px-4 py-3 font-medium transition-colors ${
                activeView === "top"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              برترین معرف‌ها
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Rewards Overview */}
          {activeView === "overview" && (
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 mb-4">پاداش‌ها بر اساس نوع:</h3>
              {analytics.rewards.rewardsByType.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaGift className="text-5xl mx-auto mb-4 opacity-20" />
                  <p>هنوز پاداشی توزیع نشده است</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analytics.rewards.rewardsByType.map((type) => (
                    <div key={type._id} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-800">{getRewardTypeLabel(type._id)}</span>
                        <span className="text-2xl font-bold text-blue-600">{type.count}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        ارزش کل: <span className="font-bold">{type.totalValue.toLocaleString()} تومان</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center gap-3">
                    <FaClock className="text-yellow-600 text-2xl" />
                    <div>
                      <div className="text-2xl font-bold text-yellow-700">{analytics.rewards.pendingRewards}</div>
                      <div className="text-yellow-600 text-sm">پاداش در انتظار</div>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-600 text-2xl" />
                    <div>
                      <div className="text-2xl font-bold text-green-700">{analytics.rewards.claimedRewards}</div>
                      <div className="text-green-600 text-sm">دریافت شده</div>
                    </div>
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center gap-3">
                    <FaTimesCircle className="text-red-600 text-2xl" />
                    <div>
                      <div className="text-2xl font-bold text-red-700">{analytics.rewards.expiredRewards}</div>
                      <div className="text-red-600 text-sm">منقضی شده</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trends */}
          {activeView === "trends" && (
            <div className="space-y-3">
              <h3 className="font-bold text-gray-800 mb-4">روند معرفی‌ها در ماه‌های اخیر:</h3>
              {analytics.trends.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaChartLine className="text-5xl mx-auto mb-4 opacity-20" />
                  <p>داده‌ای برای نمایش وجود ندارد</p>
                </div>
              ) : (
                analytics.trends.map((trend, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">
                        {getMonthName(trend._id.month)} {trend._id.year}
                      </span>
                      <span className="text-2xl font-bold text-blue-600">{trend.count}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center p-2 bg-white rounded">
                        <div className="text-gray-600">کل</div>
                        <div className="font-bold text-gray-800">{trend.count}</div>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="text-blue-600">تکمیل شده</div>
                        <div className="font-bold text-blue-700">{trend.completed}</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="text-green-600">پاداش داده شده</div>
                        <div className="font-bold text-green-700">{trend.rewarded}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Top Referrers */}
          {activeView === "top" && (
            <div className="space-y-3">
              <h3 className="font-bold text-gray-800 mb-4">برترین معرف‌ها:</h3>
              {analytics.topReferrers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaTrophy className="text-5xl mx-auto mb-4 opacity-20" />
                  <p>هنوز معرفی انجام نشده است</p>
                </div>
              ) : (
                analytics.topReferrers.map((referrer, index) => (
                  <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-center gap-4">
                      <div className="bg-yellow-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-800">
                          {referrer._id?.nationalCredentials?.firstName || "کاربر"}{" "}
                          {referrer._id?.nationalCredentials?.lastName || ""}
                        </div>
                        <div className="text-sm text-gray-600">کد معرف: {referrer._id?.referralCode}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{referrer.totalReferrals}</div>
                        <div className="text-xs text-gray-600">معرفی</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-yellow-200">
                      <div className="text-center">
                        <div className="text-sm text-gray-600">تکمیل شده</div>
                        <div className="font-bold text-blue-700">{referrer.completedReferrals}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">پاداش داده شده</div>
                        <div className="font-bold text-green-700">{referrer.rewardedReferrals}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">کل پاداش</div>
                        <div className="font-bold text-orange-700">{referrer.totalRewardAmount.toLocaleString()} ت</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 className="font-bold text-gray-800 mb-4">فعالیت‌های اخیر:</h3>
        {analytics.recentActivity.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>فعالیت اخیری وجود ندارد</p>
          </div>
        ) : (
          <div className="space-y-2">
            {analytics.recentActivity.map((activity) => (
              <div key={activity._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="text-sm text-gray-800">
                    <span className="font-medium">
                      {activity.referrer?.nationalCredentials?.firstName || "کاربر"}
                    </span>
                    {" معرف "}
                    <span className="font-medium">
                      {activity.referee?.nationalCredentials?.firstName || "کاربر جدید"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(activity.createdAt).toLocaleString("fa-IR")}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    activity.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : activity.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {activity.status === "completed" ? "تکمیل شده" : activity.status === "pending" ? "در انتظار" : activity.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReferralAnalytics;
