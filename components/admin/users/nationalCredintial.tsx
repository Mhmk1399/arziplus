"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FaSearch,
  FaCheck,
  FaTimes,
  FaEye,
  FaFilter,
  FaIdCard,
  FaUser,
  FaImage,
} from "react-icons/fa";
import { showToast } from "@/utilities/toast";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface NationalCredential {
  _id: string;
  nationalCredentials: {
    firstName: string;
    lastName: string;
    nationalNumber: string;
    nationalCardImageUrl: string;
    verificationImageUrl: string;
    status: "accepted" | "rejected" | "pending_verification";
    rejectionNotes?: string;
  };
  verifications?: {
    identity?: {
      status: string;
      submittedAt: string;
    };
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

const NationalCredentialAdmin = () => {
  const { user: currentUser, isLoggedIn } = useCurrentUser();
  const [credentials, setCredentials] = useState<NationalCredential[]>([]);
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
  const [selectedCredential, setSelectedCredential] =
    useState<NationalCredential | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [reviewStatus, setReviewStatus] = useState<"accepted" | "rejected">(
    "accepted"
  );
  const [rejectionNotes, setRejectionNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch credentials data
  const fetchCredentials = async () => {
    if (!isLoggedIn) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
      });

      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `/api/users/nationalverifications?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("خطا در دریافت اطلاعات هویتی");
      }

      const data = await response.json();
      setCredentials(data.credentials);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای نامشخص");
    } finally {
      setLoading(false);
    }
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedCredential) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/users/nationalverifications", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedCredential._id,
          status: reviewStatus === "accepted" ? "approved" : "rejected",
          rejectionReason: reviewStatus === "rejected" ? rejectionNotes : "",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در به‌روزرسانی وضعیت");
      }

      showToast.success(
        reviewStatus === "accepted"
          ? "اطلاعات هویتی تایید شد"
          : "اطلاعات هویتی رد شد"
      );

      setShowReviewModal(false);
      setSelectedCredential(null);
      setRejectionNotes("");
      await fetchCredentials();
    } catch (err) {
      showToast.error(
        err instanceof Error ? err.message : "خطا در به‌روزرسانی"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Effects
  useEffect(() => {
    if (isLoggedIn) {
      fetchCredentials();
    }
  }, [isLoggedIn, currentPage, searchTerm, statusFilter]);

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "text-green-700 bg-green-100 border-green-300";
      case "rejected":
        return "text-red-700 bg-red-100 border-red-300";
      case "pending_verification":
        return "text-yellow-700 bg-yellow-100 border-yellow-300";
      default:
        return "text-gray-700 bg-gray-100 border-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "accepted":
        return "تایید شده";
      case "rejected":
        return "رد شده";
      case "pending_verification":
        return "در انتظار بررسی";
      default:
        return "نامشخص";
    }
  };

  const getUserName = (credential: NationalCredential) => {
    const { firstName, lastName } = credential.nationalCredentials;
    return `${firstName} ${lastName}`;
  };

  const openDetailsModal = (credential: NationalCredential) => {
    setSelectedCredential(credential);
    setShowDetailsModal(true);
  };

  const openReviewModal = (credential: NationalCredential) => {
    setSelectedCredential(credential);
    setReviewStatus("accepted");
    setRejectionNotes("");
    setShowReviewModal(true);
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ورود به سیستم لازم است
          </h2>
          <p className="text-gray-600">لطفاً وارد حساب کاربری خود شوید</p>
        </div>
      </div>
    );
  }

  if (
    !currentUser?.roles.includes("admin") &&
    !currentUser?.roles.includes("super_admin")
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            دسترسی غیر مجاز
          </h2>
          <p className="text-gray-600">شما به این بخش دسترسی ندارید</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <h1 className="md:text-3xl text-xl font-bold text-gray-900">
                مدیریت اطلاعات هویتی
              </h1>
              <p className="text-gray-600">
                بررسی و تایید اطلاعات هویتی کاربران
              </p>
            </div>
          </div>

          {/* Stats */}
        </div>

        {/* Filters */}
        <div className=" rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="جستجو بر اساس نام یا کد ملی..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">همه وضعیت‌ها</option>
              <option value="pending_verification">در انتظار بررسی</option>
              <option value="accepted">تایید شده</option>
              <option value="rejected">رد شده</option>
            </select>

            <button
              onClick={() => fetchCredentials()}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <FaFilter className="inline ml-2" />
              اعمال فیلتر
            </button>
          </div>
        </div>

        {/* Credentials Table */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => fetchCredentials()}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              تلاش مجدد
            </button>
          </div>
        ) : credentials.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <FaIdCard className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">هیچ درخواست هویتی یافت نشد</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      اطلاعات کاربر
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      کد ملی
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      مدارک
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
                  {credentials.map((credential) => (
                    <tr key={credential._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaUser className="text-gray-400 ml-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {getUserName(credential)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {credential._id.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900">
                          {credential.nationalCredentials.nationalNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              openImageModal(
                                credential.nationalCredentials
                                  .nationalCardImageUrl
                              )
                            }
                            className="text-blue-600 hover:text-blue-800"
                            title="مشاهده کارت ملی"
                          >
                            <FaIdCard />
                          </button>
                          <button
                            onClick={() =>
                              openImageModal(
                                credential.nationalCredentials
                                  .verificationImageUrl
                              )
                            }
                            className="text-green-600 hover:text-green-800"
                            title="مشاهده تصویر احراز هویت"
                          >
                            <FaImage />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                            credential.nationalCredentials.status
                          )}`}
                        >
                          {getStatusText(credential.nationalCredentials.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(credential.createdAt).toLocaleDateString(
                          "fa-IR"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openDetailsModal(credential)}
                            className="text-emerald-600 hover:text-emerald-900"
                          >
                            <FaEye />
                          </button>
                          {credential.nationalCredentials.status ===
                            "pending_verification" && (
                            <button
                              onClick={() => openReviewModal(credential)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <FaCheck />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  صفحه {pagination.currentPage} از {pagination.totalPages}{" "}
                  (مجموع {pagination.totalUsers} مورد)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={!pagination.hasPreviousPage}
                    className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    قبلی
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(pagination.totalPages, prev + 1)
                      )
                    }
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
      {showDetailsModal &&
        selectedCredential &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            dir="rtl"
          >
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">
                  جزئیات اطلاعات هویتی
                </h2>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      نام و نام خانوادگی
                    </label>
                    <div className="text-gray-900 mt-1">
                      {getUserName(selectedCredential)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      کد ملی
                    </label>
                    <div className="text-gray-900 mt-1 font-mono">
                      {selectedCredential.nationalCredentials.nationalNumber}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      وضعیت
                    </label>
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          selectedCredential.nationalCredentials.status
                        )}`}
                      >
                        {getStatusText(
                          selectedCredential.nationalCredentials.status
                        )}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      تاریخ ثبت
                    </label>
                    <div className="text-gray-900 mt-1">
                      {new Date(
                        selectedCredential.createdAt
                      ).toLocaleDateString("fa-IR")}
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">
                      تصویر کارت ملی
                    </label>
                    <div
                      className="border rounded-lg overflow-hidden cursor-pointer hover:opacity-90"
                      onClick={() =>
                        openImageModal(
                          selectedCredential.nationalCredentials
                            .nationalCardImageUrl
                        )
                      }
                    >
                      <img
                        src={
                          selectedCredential.nationalCredentials
                            .nationalCardImageUrl
                        }
                        alt="کارت ملی"
                        className="w-full h-78 object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">
                      تصویر احراز هویت
                    </label>
                    <div
                      className="border rounded-lg overflow-hidden cursor-pointer hover:opacity-90"
                      onClick={() =>
                        openImageModal(
                          selectedCredential.nationalCredentials
                            .verificationImageUrl
                        )
                      }
                    >
                      <img
                        src={
                          selectedCredential.nationalCredentials
                            .verificationImageUrl
                        }
                        alt="احراز هویت"
                        className="w-full h-78 object-cover"
                      />
                    </div>
                  </div>
                </div>

                {selectedCredential.nationalCredentials.rejectionNotes && (
                  <div>
                    <label className="text-sm font-medium text-red-600">
                      دلیل رد
                    </label>
                    <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                      {selectedCredential.nationalCredentials.rejectionNotes}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 border-t flex justify-end gap-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  بستن
                </button>
                {selectedCredential.nationalCredentials.status ===
                  "pending_verification" && (
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      openReviewModal(selectedCredential);
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    بررسی و تایید
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Review Modal */}
      {showReviewModal &&
        selectedCredential &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            dir="rtl"
          >
            <div className="bg-white rounded-2xl shadow-md border-[#0A1D37] border-2   max-w-xl w-full">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">
                  بررسی اطلاعات هویتی
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">
                    کاربر: {getUserName(selectedCredential)}
                  </div>
                  <div className="text-sm text-gray-600">
                    کد ملی:{" "}
                    {selectedCredential.nationalCredentials.nationalNumber}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    تصمیم
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="reviewStatus"
                        value="accepted"
                        checked={reviewStatus === "accepted"}
                        onChange={(e) =>
                          setReviewStatus(
                            e.target.value as "accepted" | "rejected"
                          )
                        }
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
                        onChange={(e) =>
                          setReviewStatus(
                            e.target.value as "accepted" | "rejected"
                          )
                        }
                        className="ml-2"
                      />
                      <span className="text-red-700">رد</span>
                    </label>
                  </div>
                </div>

                {reviewStatus === "rejected" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      دلیل رد
                    </label>
                    <textarea
                      value={rejectionNotes}
                      onChange={(e) => setRejectionNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      rows={3}
                      placeholder="لطفاً دلیل رد اطلاعات هویتی را توضیح دهید..."
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
                  disabled={
                    submitting ||
                    (reviewStatus === "rejected" && !rejectionNotes.trim())
                  }
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "در حال پردازش..." : "تایید"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Image Modal */}
      {showImageModal &&
        selectedImage &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 bg-black/10 backdrop-blur-2xl flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl max-h-[90vh]">
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 hover:bg-gray-100"
              >
                <FaTimes />
              </button>
              <img
                src={selectedImage}
                alt="مشاهده تصویر"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default NationalCredentialAdmin;
