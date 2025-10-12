"use client";

import React, { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { FaUser, FaSearch, FaFilter, FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";

interface User {
  _id: string;
  username: string;
  roles: string[];
  status: "active" | "suspended" | "banned" | "pending_verification";
  nationalCredentials?: {
    firstName?: string;
    lastName?: string;
    nationalNumber?: string;
  };
  contactInfo?: {
    email?: string;
    mobilePhone?: string;
  };
  verifications?: {
    email?: { isVerified: boolean };
    phone?: { isVerified: boolean };
    identity?: { status: string };
  };
  bankingInfo?: Array<{
    _id: string;
    bankName: string;
    accountHolderName: string;
  }>;
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

const UserWrapper = () => {
  const { user: currentUser, isLoggedIn } = useCurrentUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    if (!isLoggedIn) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        ...(roleFilter && { role: roleFilter }),
        ...(verificationFilter && { verification: verificationFilter }),
      });

      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/users?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("خطا در دریافت اطلاعات کاربران");
      }

      const data = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای نامشخص");
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟")) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/users?userId=${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در حذف کاربر");
      }

      await fetchUsers(); // Refresh the list
      alert("کاربر با موفقیت حذف شد");
    } catch (err) {
      alert(err instanceof Error ? err.message : "خطا در حذف کاربر");
    }
  };

  // Update user security settings
  const handleUpdateUserSecurity = async (
    userId: string,
    updates: {
      username?: string;
      password?: string;
      roles?: string[];
      status?: string;
    }
  ) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          ...updates,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در به‌روزرسانی کاربر");
      }

      await fetchUsers(); // Refresh the list
      return true;
    } catch (err) {
      console.error("Update user error:", err);
      return false;
    }
  };

  // Update verification status
  const handleUpdateVerificationStatus = async (
    userId: string,
    status: string,
    rejectionReason?: string
  ) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/users/nationalverifications", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          status,
          rejectionReason,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در به‌روزرسانی وضعیت تایید");
      }

      await fetchUsers(); // Refresh the list
      return true;
    } catch (err) {
      console.error("Update verification error:", err);
      return false;
    }
  };

  // Effects
  useEffect(() => {
    if (isLoggedIn) {
      fetchUsers();
    }
  }, [isLoggedIn, currentPage, pageSize, searchTerm, statusFilter, roleFilter, verificationFilter]);

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-700 bg-green-100";
      case "suspended": return "text-yellow-700 bg-yellow-100";
      case "banned": return "text-red-700 bg-red-100";
      case "pending_verification": return "text-orange-700 bg-orange-100";
      default: return "text-gray-700 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "فعال";
      case "suspended": return "معلق";
      case "banned": return "مسدود";
      case "pending_verification": return "در انتظار تایید";
      default: return "نامشخص";
    }
  };

  const getRoleText = (roles: string[]) => {
    const roleMap: { [key: string]: string } = {
      user: "کاربر",
      admin: "مدیر",
      super_admin: "مدیر کل",
      moderator: "ناظر",
      support: "پشتیبانی",
    };
    return roles.map(role => roleMap[role] || role).join(", ");
  };

  const getVerificationStatusIcon = (isVerified: boolean) => {
    return isVerified ? "✅" : "❌";
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">دسترسی غیر مجاز</h2>
          <p className="text-gray-600">لطفاً ابتدا وارد شوید</p>
        </div>
      </div>
    );
  }

  if (!currentUser?.roles.includes("admin") && !currentUser?.roles.includes("super_admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">عدم دسترسی</h2>
          <p className="text-gray-600">شما مجوز دسترسی به این بخش را ندارید</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <FaUser className="text-indigo-700 text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">مدیریت کاربران</h1>
                <p className="text-gray-600 mt-1">مشاهده و مدیریت تمام کاربران سیستم</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateUser(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FaPlus className="text-sm" />
              کاربر جدید
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">جستجو</label>
              <div className="relative">
                <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="نام، ایمیل، تلفن..."
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">همه</option>
                <option value="active">فعال</option>
                <option value="suspended">معلق</option>
                <option value="banned">مسدود</option>
                <option value="pending_verification">در انتظار تایید</option>
              </select>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نقش</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">همه</option>
                <option value="user">کاربر</option>
                <option value="admin">مدیر</option>
                <option value="super_admin">مدیر کل</option>
                <option value="moderator">ناظر</option>
                <option value="support">پشتیبانی</option>
              </select>
            </div>

            {/* Verification Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تایید</label>
              <select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">همه</option>
                <option value="email_verified">ایمیل تایید شده</option>
                <option value="phone_verified">تلفن تایید شده</option>
                <option value="identity_approved">هویت تایید شده</option>
              </select>
            </div>

            {/* Page Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تعداد در صفحه</label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">در حال بارگذاری...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchUsers}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                تلاش مجدد
              </button>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">کاربری یافت نشد</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        کاربر
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        وضعیت
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        نقش‌ها
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        تایید
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        تاریخ عضویت
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        عملیات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.nationalCredentials?.firstName && user.nationalCredentials?.lastName
                                ? `${user.nationalCredentials.firstName} ${user.nationalCredentials.lastName}`
                                : user.username}
                            </div>
                            <div className="text-sm text-gray-500">{user.contactInfo?.email}</div>
                            <div className="text-xs text-gray-400">{user.contactInfo?.mobilePhone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                            {getStatusText(user.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getRoleText(user.roles)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex gap-2">
                            <span title="ایمیل">{getVerificationStatusIcon(user.verifications?.email?.isVerified || false)}</span>
                            <span title="تلفن">{getVerificationStatusIcon(user.verifications?.phone?.isVerified || false)}</span>
                            <span title="هویت">{getVerificationStatusIcon(user.verifications?.identity?.status === "approved")}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowUserDetails(true);
                              }}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="مشاهده جزئیات"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowEditUser(true);
                              }}
                              className="text-green-600 hover:text-green-900"
                              title="ویرایش"
                            >
                              <FaEdit />
                            </button>
                            {user._id !== currentUser?.id && (
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="text-red-600 hover:text-red-900"
                                title="حذف"
                              >
                                <FaTrash />
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
                <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    نمایش {((currentPage - 1) * pageSize) + 1} تا {Math.min(currentPage * pageSize, pagination.totalUsers)} از {pagination.totalUsers} کاربر
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={!pagination.hasPreviousPage}
                      className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      قبلی
                    </button>
                    <span className="px-3 py-1 bg-indigo-600 text-white rounded-lg">
                      {currentPage}
                    </span>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      بعدی
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals would go here - UserDetailsModal, EditUserModal, CreateUserModal */}
      {/* You can implement these as separate components */}
    </div>
  );
};

export default UserWrapper;