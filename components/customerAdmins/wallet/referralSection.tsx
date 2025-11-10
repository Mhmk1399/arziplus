"use client";

import React, { useState, useEffect } from "react";
import {
  FaShare,
  FaCopy,
  FaGift,
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaWhatsapp,
  FaTelegram,
  FaLink,
} from "react-icons/fa";
import { showToast } from "@/utilities/toast";

interface ReferralStats {
  userInfo: {
    referralCode: string;
    referralLink: string;
    name: string;
  };
  referralStats: {
    total: number;
    pending: number;
    completed: number;
    rewarded: number;
  };
  rewardStats: {
    totalRewards: number;
    pending: number;
    claimed: number;
    expired: number;
    totalValue: number;
    pendingValue: number;
    byType: {
      [key: string]: {
        count: number;
        totalValue: number;
        claimed: number;
        pending: number;
      };
    };
  };
  referrals: Array<{
    _id: string;
    status: string;
    createdAt: string;
    referee: {
      nationalCredentials: {
        firstName: string;
        lastName: string;
      };
    };
  }>;
  rewards: Array<{
    _id: string;
    rewardType: string;
    value: number;
    status: string;
    createdAt: string;
    claimedAt?: string;
  }>;
}

const CustomerReferralComponent: React.FC = () => {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "referrals" | "rewards">("overview");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/referrals/my-stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
        console.log(data,"sdasd")
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast.success("لینک کپی شد!");
  };

  const shareOnWhatsApp = () => {
    const message = `به ارزی پلاس بپیوندید و از خدمات ارزی برتر استفاده کنید!\n\n${stats?.userInfo.referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const shareOnTelegram = () => {
    const message = `به ارزی پلاس بپیوندید و از خدمات ارزی برتر استفاده کنید!`;
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(stats?.userInfo.referralLink || "")}&text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const claimReward = async (rewardId: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/referral-rewards", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: rewardId,
          status: "claimed",
        }),
      });

      if (response.ok) {
        showToast.success("پاداش با موفقیت دریافت شد!");
        fetchStats(); // Refresh stats
      } else {
        const data = await response.json();
        showToast.error(data.message || "خطا در دریافت پاداش");
      }
    } catch (error) {
      console.log(error);
      showToast.error("خطا در اتصال به سرور");
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: { label: string; class: string; icon: React.ReactNode } } = {
      pending: { label: "در انتظار", class: "bg-yellow-100 text-yellow-800", icon: <FaClock /> },
      completed: { label: "تکمیل شده", class: "bg-blue-100 text-blue-800", icon: <FaCheckCircle /> },
      rewarded: { label: "پاداش داده شده", class: "bg-green-100 text-green-800", icon: <FaGift /> },
      claimed: { label: "دریافت شده", class: "bg-green-100 text-green-800", icon: <FaCheckCircle /> },
      expired: { label: "منقضی شده", class: "bg-red-100 text-red-800", icon: <FaTimes /> },
    };

    const badge = badges[status] || badges.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.class}`}>
        {badge.icon}
        {badge.label}
      </span>
    );
  };

  const getRewardTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      wallet_credit: "اعتبار کیف پول",
      discount: "تخفیف",
      service_upgrade: "ارتقاء سرویس",
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center p-12">
        <p className="text-gray-600">خطا در بارگذاری اطلاعات</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">با ما همکاری کنید</h2>
            <p className="text-blue-100">دوستان خود را دعوت کنید و پاداش دریافت کنید</p>
          </div>
          <FaUsers className="text-5xl opacity-20" />
        </div>

        {/* Referral Link Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-3">
          <p className="text-sm text-blue-100">لینک اختصاصی شما:</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={stats.userInfo.referralLink}
              readOnly
              className="flex-1 bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              onClick={() => copyToClipboard(stats.userInfo.referralLink)}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <FaCopy />
              <span className="hidden sm:inline">کپی</span>
            </button>
          </div>

          {/* Share Buttons */}
          <div className="flex gap-2">
            <button
              onClick={shareOnWhatsApp}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <FaWhatsapp />
              <span className="hidden sm:inline">واتساپ</span>
            </button>
            <button
              onClick={shareOnTelegram}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <FaTelegram />
              <span className="hidden sm:inline">تلگرام</span>
            </button>
            <button
              onClick={() => copyToClipboard(stats.userInfo.referralLink)}
              className="flex-1 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <FaLink />
              <span className="hidden sm:inline">لینک</span>
            </button>
          </div>

          <p className="text-xs text-blue-100">کد معرف: {stats.userInfo.referralCode}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <FaUsers className="text-blue-600 text-2xl" />
            <span className="text-2xl font-bold text-gray-800">{stats.referralStats.total}</span>
          </div>
          <p className="text-gray-600 text-sm">کل دعوت‌ها</p>
          <div className="mt-2 text-xs text-gray-500">
            {stats.referralStats.completed} تکمیل شده
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <FaGift className="text-green-600 text-2xl" />
            <span className="text-2xl font-bold text-gray-800">{stats.rewardStats.totalRewards}</span>
          </div>
          <p className="text-gray-600 text-sm">کل پاداش‌ها</p>
          <div className="mt-2 text-xs text-gray-500">
            {stats.rewardStats.claimed} دریافت شده
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <FaCheckCircle className="text-purple-600 text-2xl" />
            <span className="text-2xl font-bold text-gray-800">
              {stats.rewardStats.totalValue.toLocaleString()}
            </span>
          </div>
          <p className="text-gray-600 text-sm">ارزش پاداش‌ها (تومان)</p>
          <div className="mt-2 text-xs text-gray-500">
            {stats.rewardStats.pendingValue.toLocaleString()} در انتظار
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-1 px-4 py-3 font-medium transition-colors ${
                activeTab === "overview"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              آمار کلی
            </button>
            <button
              onClick={() => setActiveTab("referrals")}
              className={`flex-1 px-4 py-3 font-medium transition-colors ${
                activeTab === "referrals"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              دعوت‌شدگان
            </button>
            <button
              onClick={() => setActiveTab("rewards")}
              className={`flex-1 px-4 py-3 font-medium transition-colors ${
                activeTab === "rewards"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              پاداش‌ها
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{stats.referralStats.pending}</div>
                  <div className="text-xs text-gray-600 mt-1">در انتظار</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.referralStats.completed}</div>
                  <div className="text-xs text-gray-600 mt-1">تکمیل شده</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.referralStats.rewarded}</div>
                  <div className="text-xs text-gray-600 mt-1">پاداش داده شده</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{stats.rewardStats.pending}</div>
                  <div className="text-xs text-gray-600 mt-1">پاداش در انتظار</div>
                </div>
              </div>

              {Object.keys(stats.rewardStats.byType).length > 0 && (
                <div className="mt-6">
                  <h3 className="font-bold text-gray-800 mb-3">پاداش‌ها بر اساس نوع:</h3>
                  <div className="space-y-2">
                    {Object.entries(stats.rewardStats.byType).map(([type, data]) => (
                      <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">{getRewardTypeLabel(type)}</span>
                        <div className="text-left">
                          <div className="font-bold text-gray-800">{data.totalValue.toLocaleString()} تومان</div>
                          <div className="text-xs text-gray-500">{data.claimed} دریافت شده از {data.count}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Referrals Tab */}
          {activeTab === "referrals" && (
            <div className="space-y-3">
              {stats.referrals.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FaUsers className="text-5xl mx-auto mb-4 opacity-20" />
                  <p>هنوز کسی را دعوت نکرده‌اید</p>
                </div>
              ) : (
                stats.referrals.map((referral) => (
                  <div key={referral._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <div className="font-medium text-gray-800">
                        {referral.referee?.nationalCredentials?.firstName || "کاربر"}{" "}
                        {referral.referee?.nationalCredentials?.lastName || ""}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(referral.createdAt).toLocaleDateString("fa-IR")}
                      </div>
                    </div>
                    {getStatusBadge(referral.status)}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Rewards Tab */}
          {activeTab === "rewards" && (
            <div className="space-y-3">
              {stats.rewards.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FaGift className="text-5xl mx-auto mb-4 opacity-20" />
                  <p>هنوز پاداشی دریافت نکرده‌اید</p>
                </div>
              ) : (
                stats.rewards.map((reward) => (
                  <div key={reward._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-800">{getRewardTypeLabel(reward.rewardType)}</span>
                        {getStatusBadge(reward.status)}
                      </div>
                      <div className="text-sm text-gray-600">{reward.value.toLocaleString()} تومان</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(reward.createdAt).toLocaleDateString("fa-IR")}
                        {reward.claimedAt && ` • دریافت شده: ${new Date(reward.claimedAt).toLocaleDateString("fa-IR")}`}
                      </div>
                    </div>
                    {reward.status === "pending" && (
                      <button
                        onClick={() => claimReward(reward._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                      >
                        دریافت پاداش
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerReferralComponent;
