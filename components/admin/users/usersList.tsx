"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaTrash, FaEye, FaFilter, FaUser, FaCheck, FaTimes, FaUserPlus } from "react-icons/fa";
import { showToast } from "@/utilities/toast";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface User {
  _id: string;
  username: string;
  roles: string[];
  status: "active" | "suspended" | "banned" | "pending_verification";
  nationalCredentials?: {
    firstName?: string;
    lastName?: string;
    nationalNumber?: string;
    status?: "accepted" | "rejected" | "pending_verification";
  };
  contactInfo?: {
    email?: string;
    mobilePhone?: string;
    status?: "accepted" | "rejected" | "pending_verification";
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
    status?: "accepted" | "rejected" | "pending_verification";
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

const UsersList = () => {
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
  const [showEditUser, setShowEditUser] = useState(false);
  const [showValidateUser, setShowValidateUser] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    username: "",
    roles: [] as string[],
    status: "",
  });
  const [submitting, setSubmitting] = useState(false);

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

      showToast.success("کاربر با موفقیت حذف شد");
      await fetchUsers();
    } catch (err) {
      showToast.error(err instanceof Error ? err.message : "خطا در حذف کاربر");
    }
  };

  // Update user
  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser._id,
          username: editForm.username,
          roles: editForm.roles,
          status: editForm.status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در به‌روزرسانی کاربر");
      }

      showToast.success("اطلاعات کاربر با موفقیت به‌روزرسانی شد");
      setShowEditUser(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (err) {
      showToast.error(err instanceof Error ? err.message : "خطا در به‌روزرسانی");
    } finally {
      setSubmitting(false);
    }
  };

  // Validate user (approve all credentials)
  const handleValidateUser = async (userId: string) => {
    try {
      const token = localStorage.getItem("authToken");
      
      // Update all credentials to accepted
      const promises = [
        // National credentials
        fetch("/api/users/nationalverifications", {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            status: "accepted",
          }),
        }),
        // Contact info
        fetch("/api/users/contact", {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            status: "accepted",
          }),
        }),
      ];

      // Update banking info if exists
      const user = users.find(u => u._id === userId);
      if (user?.bankingInfo && user.bankingInfo.length > 0) {
        user.bankingInfo.forEach(bank => {
          promises.push(
            fetch("/api/users/banckingifo", {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId,
                bankingInfoId: bank._id,
                status: "accepted",
              }),
            })
          );
        });
      }

      await Promise.all(promises);
      
      showToast.success("تمام اطلاعات کاربر تایید شد");
      await fetchUsers();
    } catch (err) {
      showToast.error("خطا در تایید اطلاعات کاربر");
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
      case "active": return "text-green-700 bg-green-100 border-green-300";
      case "suspended": return "text-yellow-700 bg-yellow-100 border-yellow-300";
      case "banned": return "text-red-700 bg-red-100 border-red-300";
      case "pending_verification": return "text-orange-700 bg-orange-100 border-orange-300";
      default: return "text-gray-700 bg-gray-100 border-gray-300";
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
    return roles.map(role => roleMap[role] || role).join("، ");
  };

  const getUserName = (user: User) => {
    const { firstName, lastName } = user.nationalCredentials || {};
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    return user.username || "نام نامشخص";
  };

  const getValidationStatus = (user: User) => {
    let total = 0;
    let completed = 0;

    // Check national credentials
    if (user.nationalCredentials?.firstName) {
      total++;
      if (user.nationalCredentials.status === "accepted") completed++;
    }

    // Check contact info
    if (user.contactInfo?.email) {
      total++;
      if (user.contactInfo.status === "accepted") completed++;
    }

    // Check banking info
    if (user.bankingInfo && user.bankingInfo.length > 0) {
      total++;
      if (user.bankingInfo.some(bank => bank.status === "accepted")) completed++;
    }

    if (total === 0) return { text: "بدون اطلاعات", color: "gray" };
    if (completed === total) return { text: "تکمیل شده", color: "green" };
    if (completed === 0) return { text: "در انتظار", color: "yellow" };
    return { text: "نیمه تکمیل", color: "orange" };
  };

  const openUserDetails = (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const openEditUser = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      username: user.username,
      roles: user.roles,
      status: user.status,
    });
    setShowEditUser(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">ورود به سیستم لازم است</h2>
          <p className="text-gray-600">لطفاً وارد حساب کاربری خود شوید</p>
        </div>
      </div>
    );
  }

  if (!currentUser?.roles.includes("admin") && !currentUser?.roles.includes("super_admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">دسترسی غیر مجاز</h2>
          <p className="text-gray-600">شما به این بخش دسترسی ندارید</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaUser className="text-3xl text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">مدیریت کاربران</h1>
                <p className="text-gray-600">مشاهده و مدیریت اطلاعات کاربران سیستم</p>
              </div>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <FaUserPlus />
              کاربر جدید
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "کل کاربران", value: pagination.totalUsers, color: "blue" },
              { 
                label: "فعال", 
                value: users.filter(u => u.status === "active").length, 
                color: "green" 
              },
              { 
                label: "در انتظار تایید", 
                value: users.filter(u => u.status === "pending_verification").length, 
                color: "yellow" 
              },
              { 
                label: "مسدود شده", 
                value: users.filter(u => u.status === "banned" || u.status === "suspended").length, 
                color: "red" 
              },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center">
                  <div className={`text-2xl font-bold text-${stat.color}-600`}>
                    {stat.value}
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">جستجو</label>
              <div className="relative">
                <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="جستجو بر اساس نام، نام کاربری یا ایمیل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">همه وضعیت‌ها</option>
                <option value="active">فعال</option>
                <option value="suspended">معلق</option>
                <option value="banned">مسدود</option>
                <option value="pending_verification">در انتظار تایید</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نقش</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">همه نقش‌ها</option>
                <option value="user">کاربر</option>
                <option value="admin">مدیر</option>
                <option value="super_admin">مدیر کل</option>
                <option value="moderator">ناظر</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تعداد نمایش</label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => fetchUsers()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              تلاش مجدد
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <FaUser className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">هیچ کاربری یافت نشد</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      کاربر
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      نقش
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      وضعیت
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      وضعیت احراز
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
                  {users.map((user) => {
                    const validationStatus = getValidationStatus(user);
                    return (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-10">
                              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                <FaUser className="text-gray-600" />
                              </div>
                            </div>
                            <div className="mr-4">
                              <div className="text-sm font-medium text-gray-900">
                                {getUserName(user)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.contactInfo?.email || user.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getRoleText(user.roles)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                            {getStatusText(user.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border text-${validationStatus.color}-700 bg-${validationStatus.color}-100 border-${validationStatus.color}-300`}>
                            {validationStatus.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString('fa-IR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openUserDetails(user)}
                              className="text-blue-600 hover:text-blue-900"
                              title="مشاهده جزئیات"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => openEditUser(user)}
                              className="text-green-600 hover:text-green-900"
                              title="ویرایش"
                            >
                              <FaEdit />
                            </button>
                            {validationStatus.text !== "تکمیل شده" && (
                              <button
                                onClick={() => handleValidateUser(user._id)}
                                className="text-emerald-600 hover:text-emerald-900"
                                title="تایید کل اطلاعات"
                              >
                                <FaCheck />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-600 hover:text-red-900"
                              title="حذف"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  صفحه {pagination.currentPage} از {pagination.totalPages} (مجموع {pagination.totalUsers} کاربر)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={!pagination.hasPreviousPage}
                    className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    قبلی
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
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

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">جزئیات کاربر</h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">اطلاعات پایه</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">نام کاربری</label>
                    <div className="text-gray-900 mt-1">{selectedUser.username}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">نقش‌ها</label>
                    <div className="text-gray-900 mt-1">{getRoleText(selectedUser.roles)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">وضعیت</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedUser.status)}`}>
                        {getStatusText(selectedUser.status)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">تاریخ عضویت</label>
                    <div className="text-gray-900 mt-1">{new Date(selectedUser.createdAt).toLocaleDateString('fa-IR')}</div>
                  </div>
                </div>
              </div>

              {/* National Credentials */}
              {selectedUser.nationalCredentials && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">اطلاعات هویتی</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">نام</label>
                      <div className="text-gray-900 mt-1">{selectedUser.nationalCredentials.firstName}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">نام خانوادگی</label>
                      <div className="text-gray-900 mt-1">{selectedUser.nationalCredentials.lastName}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">کد ملی</label>
                      <div className="text-gray-900 mt-1 font-mono">{selectedUser.nationalCredentials.nationalNumber}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Info */}
              {selectedUser.contactInfo && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">اطلاعات تماس</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">ایمیل</label>
                      <div className="text-gray-900 mt-1">{selectedUser.contactInfo.email}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">شماره موبایل</label>
                      <div className="text-gray-900 mt-1">{selectedUser.contactInfo.mobilePhone}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Banking Info */}
              {selectedUser.bankingInfo && selectedUser.bankingInfo.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">اطلاعات بانکی</h3>
                  <div className="space-y-2">
                    {selectedUser.bankingInfo.map((bank, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm">
                          <span className="font-medium">{bank.bankName}</span> - {bank.accountHolderName}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowUserDetails(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                بستن
              </button>
              <button
                onClick={() => {
                  setShowUserDetails(false);
                  openEditUser(selectedUser);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                ویرایش
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUser && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">ویرایش کاربر</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نام کاربری</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">فعال</option>
                  <option value="suspended">معلق</option>
                  <option value="banned">مسدود</option>
                  <option value="pending_verification">در انتظار تایید</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نقش‌ها</label>
                <div className="space-y-2">
                  {["user", "admin", "super_admin", "moderator", "support"].map(role => (
                    <label key={role} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editForm.roles.includes(role)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditForm(prev => ({ ...prev, roles: [...prev.roles, role] }));
                          } else {
                            setEditForm(prev => ({ ...prev, roles: prev.roles.filter(r => r !== role) }));
                          }
                        }}
                        className="ml-2"
                      />
                      <span>{getRoleText([role])}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowEditUser(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                انصراف
              </button>
              <button
                onClick={handleUpdateUser}
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default UsersList;
