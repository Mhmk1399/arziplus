"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

interface RewardRule {
  _id: string;
  name: string;
  description?: string;
  actionType: "lottery" | "dynamicServices" | "hozori" | "payment" | "signup";
  serviceSlug?: string;
  isActive: boolean;
  rewardType: "wallet" | "percentage" | "fixed";
  rewardAmount: number;
  rewardCurrency: string;
  minAmount?: number;
  maxRewardAmount?: number;
  maxUsesPerUser?: number;
  maxTotalUses?: number;
  currentTotalUses: number;
  rewardRecipient: "referrer" | "referee" | "both";
  referrerRewardAmount?: number;
  refereeRewardAmount?: number;
  validFrom?: string;
  validUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ReferralRewardRulesManager() {
  const [rules, setRules] = useState<RewardRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<RewardRule | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    actionType: "lottery" as RewardRule["actionType"],
    serviceSlug: "",
    isActive: true,
    rewardType: "fixed" as RewardRule["rewardType"],
    rewardAmount: 0,
    rewardCurrency: "IRT",
    minAmount: "",
    maxRewardAmount: "",
    maxUsesPerUser: "",
    maxTotalUses: "",
    rewardRecipient: "referrer" as RewardRule["rewardRecipient"],
    referrerRewardAmount: "",
    refereeRewardAmount: "",
    validFrom: "",
    validUntil: "",
  });

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("/api/referral-reward-rules", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRules(response.data.data || []);
    } catch (error) {
      console.error("Error fetching rules:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        ...formData,
        minAmount: formData.minAmount ? Number(formData.minAmount) : undefined,
        maxRewardAmount: formData.maxRewardAmount ? Number(formData.maxRewardAmount) : undefined,
        maxUsesPerUser: formData.maxUsesPerUser ? Number(formData.maxUsesPerUser) : undefined,
        maxTotalUses: formData.maxTotalUses ? Number(formData.maxTotalUses) : undefined,
        referrerRewardAmount: formData.referrerRewardAmount ? Number(formData.referrerRewardAmount) : undefined,
        refereeRewardAmount: formData.refereeRewardAmount ? Number(formData.refereeRewardAmount) : undefined,
      };

      if (editingRule) {
        await axios.put(
          "/api/referral-reward-rules",
          { id: editingRule._id, ...payload },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("/api/referral-reward-rules", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      resetForm();
      fetchRules();
    } catch (error) {
      console.error("Error saving rule:", error);
      alert("خطا در ذخیره قانون پاداش");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("آیا مطمئن هستید؟")) return;
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`/api/referral-reward-rules?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRules();
    } catch (error) {
      console.error("Error deleting rule:", error);
    }
  };

  const handleEdit = (rule: RewardRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      description: rule.description || "",
      actionType: rule.actionType,
      serviceSlug: rule.serviceSlug || "",
      isActive: rule.isActive,
      rewardType: rule.rewardType,
      rewardAmount: rule.rewardAmount,
      rewardCurrency: rule.rewardCurrency,
      minAmount: rule.minAmount?.toString() || "",
      maxRewardAmount: rule.maxRewardAmount?.toString() || "",
      maxUsesPerUser: rule.maxUsesPerUser?.toString() || "",
      maxTotalUses: rule.maxTotalUses?.toString() || "",
      rewardRecipient: rule.rewardRecipient,
      referrerRewardAmount: rule.referrerRewardAmount?.toString() || "",
      refereeRewardAmount: rule.refereeRewardAmount?.toString() || "",
      validFrom: rule.validFrom ? new Date(rule.validFrom).toISOString().split("T")[0] : "",
      validUntil: rule.validUntil ? new Date(rule.validUntil).toISOString().split("T")[0] : "",
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      actionType: "lottery",
      serviceSlug: "",
      isActive: true,
      rewardType: "fixed",
      rewardAmount: 0,
      rewardCurrency: "IRT",
      minAmount: "",
      maxRewardAmount: "",
      maxUsesPerUser: "",
      maxTotalUses: "",
      rewardRecipient: "referrer",
      referrerRewardAmount: "",
      refereeRewardAmount: "",
      validFrom: "",
      validUntil: "",
    });
    setEditingRule(null);
    setShowForm(false);
  };

  const getActionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      lottery: "لاتاری",
      dynamicServices: "خدمات پویا",
      hozori: "حضوری",
      payment: "پرداخت",
      signup: "ثبت‌نام",
    };
    return labels[type] || type;
  };

  const getRewardTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      wallet: "کیف پول",
      percentage: "درصدی",
      fixed: "ثابت",
    };
    return labels[type] || type;
  };

  if (loading) {
    return <div className="text-center p-8">در حال بارگذاری...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">مدیریت قوانین پاداش ارجاع</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? "لغو" : "افزودن قانون جدید"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold">نام قانون *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">نوع اقدام *</label>
              <select
                value={formData.actionType}
                onChange={(e) => setFormData({ ...formData, actionType: e.target.value as RewardRule["actionType"] })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="lottery">لاتاری</option>
                <option value="dynamicServices">خدمات پویا</option>
                <option value="hozori">حضوری</option>
                <option value="payment">پرداخت</option>
                <option value="signup">ثبت‌نام</option>
              </select>
            </div>

            {formData.actionType === "dynamicServices" && (
              <div>
                <label className="block mb-2 font-semibold">شناسه سرویس (Slug)</label>
                <input
                  type="text"
                  value={formData.serviceSlug}
                  onChange={(e) => setFormData({ ...formData, serviceSlug: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="مثال: buy-chatgpt-plus"
                />
              </div>
            )}

            <div>
              <label className="block mb-2 font-semibold">نوع پاداش *</label>
              <select
                value={formData.rewardType}
                onChange={(e) => setFormData({ ...formData, rewardType: e.target.value as RewardRule["rewardType"] })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="fixed">ثابت</option>
                <option value="percentage">درصدی</option>
                <option value="wallet">کیف پول</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                مبلغ پاداش * {formData.rewardType === "percentage" && "(درصد)"}
              </label>
              <input
                type="number"
                value={formData.rewardAmount}
                onChange={(e) => setFormData({ ...formData, rewardAmount: Number(e.target.value) })}
                className="w-full p-2 border rounded"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">گیرنده پاداش</label>
              <select
                value={formData.rewardRecipient}
                onChange={(e) => setFormData({ ...formData, rewardRecipient: e.target.value as RewardRule["rewardRecipient"] })}
                className="w-full p-2 border rounded"
              >
                <option value="referrer">ارجاع‌دهنده</option>
                <option value="referee">ارجاع‌شده</option>
                <option value="both">هر دو</option>
              </select>
            </div>

            {formData.rewardRecipient === "both" && (
              <>
                <div>
                  <label className="block mb-2 font-semibold">پاداش ارجاع‌دهنده</label>
                  <input
                    type="number"
                    value={formData.referrerRewardAmount}
                    onChange={(e) => setFormData({ ...formData, referrerRewardAmount: e.target.value })}
                    className="w-full p-2 border rounded"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold">پاداش ارجاع‌شده</label>
                  <input
                    type="number"
                    value={formData.refereeRewardAmount}
                    onChange={(e) => setFormData({ ...formData, refereeRewardAmount: e.target.value })}
                    className="w-full p-2 border rounded"
                    min="0"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block mb-2 font-semibold">حداقل مبلغ تراکنش</label>
              <input
                type="number"
                value={formData.minAmount}
                onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                className="w-full p-2 border rounded"
                min="0"
              />
            </div>

            {formData.rewardType === "percentage" && (
              <div>
                <label className="block mb-2 font-semibold">حداکثر مبلغ پاداش</label>
                <input
                  type="number"
                  value={formData.maxRewardAmount}
                  onChange={(e) => setFormData({ ...formData, maxRewardAmount: e.target.value })}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>
            )}

            <div>
              <label className="block mb-2 font-semibold">حداکثر استفاده هر کاربر</label>
              <input
                type="number"
                value={formData.maxUsesPerUser}
                onChange={(e) => setFormData({ ...formData, maxUsesPerUser: e.target.value })}
                className="w-full p-2 border rounded"
                min="1"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">حداکثر استفاده کل</label>
              <input
                type="number"
                value={formData.maxTotalUses}
                onChange={(e) => setFormData({ ...formData, maxTotalUses: e.target.value })}
                className="w-full p-2 border rounded"
                min="1"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">تاریخ شروع</label>
              <input
                type="date"
                value={formData.validFrom}
                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">تاریخ پایان</label>
              <input
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="col-span-full">
              <label className="block mb-2 font-semibold">توضیحات</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="ml-2"
              />
              <label>فعال</label>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {editingRule ? "به‌روزرسانی" : "ایجاد"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              لغو
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-right">نام</th>
              <th className="border p-2 text-right">نوع اقدام</th>
              <th className="border p-2 text-right">نوع پاداش</th>
              <th className="border p-2 text-right">مبلغ</th>
              <th className="border p-2 text-right">گیرنده</th>
              <th className="border p-2 text-right">استفاده</th>
              <th className="border p-2 text-right">وضعیت</th>
              <th className="border p-2 text-right">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule._id} className="hover:bg-gray-50">
                <td className="border p-2">{rule.name}</td>
                <td className="border p-2">
                  {getActionTypeLabel(rule.actionType)}
                  {rule.serviceSlug && (
                    <div className="text-xs text-gray-500">{rule.serviceSlug}</div>
                  )}
                </td>
                <td className="border p-2">{getRewardTypeLabel(rule.rewardType)}</td>
                <td className="border p-2">
                  {rule.rewardType === "percentage"
                    ? `${rule.rewardAmount}%`
                    : `${rule.rewardAmount.toLocaleString()} تومان`}
                </td>
                <td className="border p-2">
                  {rule.rewardRecipient === "referrer" && "ارجاع‌دهنده"}
                  {rule.rewardRecipient === "referee" && "ارجاع‌شده"}
                  {rule.rewardRecipient === "both" && "هر دو"}
                </td>
                <td className="border p-2">
                  {rule.currentTotalUses}
                  {rule.maxTotalUses && ` / ${rule.maxTotalUses}`}
                </td>
                <td className="border p-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      rule.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {rule.isActive ? "فعال" : "غیرفعال"}
                  </span>
                </td>
                <td className="border p-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(rule)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    >
                      ویرایش
                    </button>
                    <button
                      onClick={() => handleDelete(rule._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rules.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            هیچ قانونی یافت نشد. قانون جدید ایجاد کنید.
          </div>
        )}
      </div>
    </div>
  );
}
