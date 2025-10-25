"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaSearch, FaEdit, FaTrash, FaEye, FaUser } from "react-icons/fa";
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
    nationalCardImageUrl?: string;
    verificationImageUrl?: string;
    rejectionNotes?: string;
  };
  contactInfo?: {
    email?: string;
    mobilePhone?: string;
    homePhone?: number;
    postalCode: number;
    address?: string;
    rejectionNotes?: string;
    status?: "accepted" | "rejected" | "pending_verification";
  };
  verifications?: {
    email?: { isVerified: boolean };
    phone?: { isVerified: boolean; verifiedAt: Date };
    identity?: { status: string; rejectionReason: string };
  };
  profile?: {
    avatar?: string;
    bio?: string;
    preferences?: {
      language: string;
      notifications: {
        email: boolean;
        sms: boolean;
        push: boolean;
      };
    };
  };
  bankingInfo?: Array<{
    _id: string;
    bankName: string;
    cardNumber: number;
    shebaNumber: number;
    rejectionNotes: string;
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
  const {   isLoggedIn } = useCurrentUser();
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
  const [pageSize] = useState(10);
  console.log(setVerificationFilter);
  // Modal states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    username: "",
    roles: [] as string[],
    status: "pending_verification",
    nationalCredentials: {
      firstName: "",
      lastName: "",
      nationalNumber: "",
      status: "pending_verification",
      rejectionNotes: "",
    },
    contactInfo: {
      email: "",
      mobilePhone: "",
      homePhone: "",
      postalCode: "",
      address: "",
      status: "pending_verification",
      rejectionNotes: "",
    },
    profile: {
      bio: "",
      preferences: {
        language: "fa",
        notifications: {
          email: true,
          sms: true,
          push: true,
        },
      },
    },
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
  const openDeleteModal = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/users?userId=${userToDelete._id}`, {
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
      setShowDeleteModal(false);
      setUserToDelete(null);
      await fetchUsers();
    } catch (err) {
      showToast.error(err instanceof Error ? err.message : "خطا در حذف کاربر");
    }
  };

  // const oldHandleDeleteUser = async (userId: string) => {
  //   if (!confirm("آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟")) {
  //     return;
  //   }

  //   try {
  //     const token = localStorage.getItem("authToken");
  //     const response = await fetch(`/api/users?userId=${userId}`, {
  //       method: "DELETE",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || "خطا در حذف کاربر");
  //     }

  //     showToast.success("کاربر با موفقیت حذف شد");
  //     await fetchUsers();
  //   } catch (err) {
  //     showToast.error(err instanceof Error ? err.message : "خطا در حذف کاربر");
  //   }
  // };

  // Update user
  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");

      const requestData = {
        userId: selectedUser._id,
        username: editForm.username,
        roles: editForm.roles,
        status: editForm.status,
        nationalCredentials: editForm.nationalCredentials,
        contactInfo: editForm.contactInfo,
        profile: editForm.profile,
      };

      console.log("Sending user update data:", requestData);

      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "خطا در به‌روزرسانی کاربر");
      }

      showToast.success("اطلاعات کاربر با موفقیت به‌روزرسانی شد");

      // Update the selectedUser to reflect changes immediately
      if (selectedUser) {
        const updatedUser: User = {
          ...selectedUser,
          username: editForm.username,
          roles: editForm.roles,
          status: editForm.status as
            | "active"
            | "suspended"
            | "banned"
            | "pending_verification",
          nationalCredentials: {
            ...selectedUser.nationalCredentials,
            ...editForm.nationalCredentials,
            status:
              (editForm.nationalCredentials.status as
                | "accepted"
                | "rejected"
                | "pending_verification"
                | undefined) || "pending_verification",
          },
          contactInfo: {
            ...selectedUser.contactInfo,
            email: editForm.contactInfo.email,
            mobilePhone: editForm.contactInfo.mobilePhone,
            homePhone: editForm.contactInfo.homePhone
              ? parseInt(editForm.contactInfo.homePhone, 10)
              : selectedUser.contactInfo?.homePhone,
            postalCode: editForm.contactInfo.postalCode
              ? parseInt(editForm.contactInfo.postalCode, 10)
              : selectedUser.contactInfo?.postalCode || 0,
            address: editForm.contactInfo.address,
            rejectionNotes: editForm.contactInfo.rejectionNotes,
            status:
              (editForm.contactInfo.status as
                | "accepted"
                | "rejected"
                | "pending_verification"
                | undefined) || "pending_verification",
          },
          profile: {
            ...selectedUser.profile,
            ...editForm.profile,
          },
        };
        setSelectedUser(updatedUser);
      }

      setShowEditUser(false);
      // Refresh the users list to get the latest data from server
      console.log("Refreshing users list after update...");
      await fetchUsers();
      console.log("Users list refreshed successfully");
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
      fetchUsers();
    }
  }, [
    isLoggedIn,
    currentPage,
    pageSize,
    searchTerm,
    statusFilter,
    roleFilter,
    verificationFilter,
  ]);

  // Update selectedUser when users list changes
  useEffect(() => {
    if (selectedUser && users.length > 0) {
      const updatedUser = users.find((u) => u._id === selectedUser._id);
      if (updatedUser) {
        setSelectedUser(updatedUser);
        console.log("Updated selectedUser with fresh data:", updatedUser);
      }
    }
  }, [users]);

  // Force refresh user data
  const refreshUserData = async () => {
    await fetchUsers();
  };

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-black bg-green-100 border-green-300";
      case "suspended":
        return "text-yellow-700 bg-yellow-100 border-yellow-300";
      case "banned":
        return "text-red-700 bg-red-100 border-red-300";
      case "pending_verification":
        return "text-orange-700 bg-orange-100 border-orange-300";
      default:
        return "text-gray-700 bg-gray-100 border-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "فعال";
      case "suspended":
        return "معلق";
      case "banned":
        return "مسدود";
      case "pending_verification":
        return "در انتظار تایید";
      default:
        return "نامشخص";
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
    return roles.map((role) => roleMap[role] || role).join("، ");
  };

  const getUserName = (user: User) => {
    const { firstName, lastName } = user.nationalCredentials || {};
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    return user.username || "نام نامشخص";
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
      nationalCredentials: {
        firstName: user.nationalCredentials?.firstName || "",
        lastName: user.nationalCredentials?.lastName || "",
        nationalNumber: user.nationalCredentials?.nationalNumber || "",
        status: user.nationalCredentials?.status || "pending_verification",
        rejectionNotes: user.nationalCredentials?.rejectionNotes || "",
      },
      contactInfo: {
        email: user.contactInfo?.email || "",
        mobilePhone: user.contactInfo?.mobilePhone || "",
        homePhone: user.contactInfo?.homePhone?.toString() || "",
        postalCode: user.contactInfo?.postalCode?.toString() || "",
        address: user.contactInfo?.address || "",
        status: user.contactInfo?.status || "pending_verification",
        rejectionNotes: user.contactInfo?.rejectionNotes || "",
      },
      profile: {
        bio: user.profile?.bio || "",
        preferences: {
          language: user.profile?.preferences?.language || "fa",
          notifications: {
            email: user.profile?.preferences?.notifications?.email ?? true,
            sms: user.profile?.preferences?.notifications?.sms ?? true,
            push: user.profile?.preferences?.notifications?.push ?? true,
          },
        },
      },
    });
    setShowEditUser(true);
  };

  

  // if (
  //   !currentUser?.roles.includes("admin") &&
  //   !currentUser?.roles.includes("super_admin")
  // ) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-bold text-gray-900 mb-2">
  //           دسترسی غیر مجاز
  //         </h2>
  //         <p className="text-gray-600">شما به این بخش دسترسی ندارید</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className=" " dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl md:text-3xl font-bold text-gray-900">
                  مدیریت کاربران
                </h1>
                <p className="text-gray-600 text-xs md:text-sm">
                  مشاهده و مدیریت اطلاعات کاربران سیستم
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                جستجو
              </label>
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
               {" "}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وضعیت
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 text-sm py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">همه وضعیت‌ها</option>
                  <option value="active">فعال</option>
                  <option value="suspended">معلق</option>
                  <option value="banned">مسدود</option>
                  <option value="pending_verification">در انتظار تایید</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نقش
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-4 text-sm  py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">همه نقش‌ها</option>
                  <option value="user">کاربر</option>
                  <option value="admin">مدیر</option>
                  <option value="super_admin">مدیر کل</option>
                  <option value="moderator">ناظر</option>
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
                      تاریخ عضویت
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => {
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
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                              user.status
                            )}`}
                          >
                            {getStatusText(user.status)}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString("fa-IR")}
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

                            <button
                              onClick={() => openDeleteModal(user)}
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
                  صفحه {pagination.currentPage} از {pagination.totalPages}{" "}
                  (مجموع {pagination.totalUsers} کاربر)
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

      {/* User Details Modal */}
      {showUserDetails &&
        selectedUser &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 h-screen overflow-hidden bg-black/50 backdrop-blur-sm flex items-center justify-center z-555 p-2 sm:p-4"
            dir="rtl"
          >
            <div className="bg-white rounded-2xl w-full max-w-6xl max-h-screen overflow-hidden shadow-2xl border border-[#0A1D37]/20">
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gray-50 border-[#0A1D37]/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#0A1D37] rounded-full flex items-center justify-center">
                    <FaUser className="text-white text-sm" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#0A1D37]">
                    جزئیات کاربر
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={refreshUserData}
                    className="p-2 hover:bg-[#0A1D37]/10 rounded-lg transition-colors text-gray-500 hover:text-[#0A1D37]"
                    title="بروزرسانی اطلاعات"
                  >
                    🔄
                  </button>
                  <button
                    onClick={() => setShowUserDetails(false)}
                    className="p-2 hover:bg-[#0A1D37]/10 rounded-lg transition-colors text-gray-500 hover:text-[#0A1D37]"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-[75vh]">
                {/* Basic Info */}
                <div className="bg-gray-50 rounded-xl p-4 border border-[#0A1D37]/10">
                  <h3 className="text-base sm:text-lg font-semibold text-[#0A1D37] mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#0A1D37] rounded-full"></span>
                    اطلاعات پایه
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-600">
                        نام کاربری
                      </label>
                      <div className="text-sm sm:text-base text-[#0A1D37] mt-1 font-mono bg-white px-3 py-2 rounded-lg border border-[#0A1D37]/10">
                        {selectedUser.username || "تعریف نشده"}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-600">
                        نقش‌ها
                      </label>
                      <div className="text-sm sm:text-base text-[#0A1D37] mt-1">
                        <div className="flex flex-wrap gap-1">
                          {selectedUser.roles.map((role, index) => (
                            <span
                              key={index}
                              className="inline-flex px-2 py-1 bg-[#0A1D37]/10 text-[#0A1D37] text-xs rounded-full border border-[#0A1D37]/20"
                            >
                              {getRoleText([role])}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-600">
                        وضعیت حساب
                      </label>
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                            selectedUser.status
                          )}`}
                        >
                          {getStatusText(selectedUser.status)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-600">
                        تاریخ عضویت
                      </label>
                      <div className="text-sm sm:text-base text-[#0A1D37] mt-1 bg-white px-3 py-2 rounded-lg border border-[#0A1D37]/10">
                        {new Date(selectedUser.createdAt).toLocaleDateString(
                          "fa-IR"
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-600">
                        آخرین بروزرسانی
                      </label>
                      <div className="text-sm sm:text-base text-[#0A1D37] mt-1 bg-white px-3 py-2 rounded-lg border border-[#0A1D37]/10">
                        {new Date(selectedUser.updatedAt).toLocaleDateString(
                          "fa-IR"
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* National Credentials */}
                <div className="bg-gray-50 rounded-xl p-4 border border-[#0A1D37]/10">
                  <h3 className="text-base sm:text-lg font-semibold text-[#0A1D37] mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#0A1D37] rounded-full"></span>
                    اطلاعات هویتی
                  </h3>
                  {selectedUser.nationalCredentials &&
                  Object.keys(selectedUser.nationalCredentials).length > 0 ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-gray-600">
                            نام
                          </label>
                          <div className="text-sm sm:text-base text-gray-900 mt-1 bg-white px-2 py-1 rounded border">
                            {selectedUser.nationalCredentials.firstName ||
                              "تعریف نشده"}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-gray-600">
                            نام خانوادگی
                          </label>
                          <div className="text-sm sm:text-base text-gray-900 mt-1 bg-white px-2 py-1 rounded border">
                            {selectedUser.nationalCredentials.lastName ||
                              "تعریف نشده"}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-gray-600">
                            کد ملی
                          </label>
                          <div className="text-sm sm:text-base text-gray-900 mt-1 font-mono bg-white px-2 py-1 rounded border">
                            {selectedUser.nationalCredentials.nationalNumber ||
                              "تعریف نشده"}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-gray-600">
                            وضعیت تایید
                          </label>
                          <div className="mt-1">
                            <span
                              className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                selectedUser.nationalCredentials.status ===
                                "accepted"
                                  ? "bg-green-100 text-green-800"
                                  : selectedUser.nationalCredentials.status ===
                                    "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {selectedUser.nationalCredentials.status ===
                              "accepted"
                                ? "تایید شده"
                                : selectedUser.nationalCredentials.status ===
                                  "rejected"
                                ? "رد شده"
                                : "در انتظار بررسی"}
                            </span>
                          </div>
                        </div>
                        {selectedUser.nationalCredentials.rejectionNotes && (
                          <div>
                            <label className="text-xs sm:text-sm font-medium text-gray-600">
                              یادداشت رد
                            </label>
                            <div className="text-sm text-red-700 mt-1 bg-red-50 px-2 py-1 rounded border">
                              {selectedUser.nationalCredentials.rejectionNotes}
                            </div>
                          </div>
                        )}
                      </div>

                      {(selectedUser.nationalCredentials.nationalCardImageUrl ||
                        selectedUser.nationalCredentials
                          .verificationImageUrl) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          {selectedUser.nationalCredentials
                            .nationalCardImageUrl && (
                            <div>
                              <label className="text-xs sm:text-sm font-medium text-gray-600">
                                تصویر کارت ملی
                              </label>
                              <div className="mt-1 bg-white p-2 rounded border">
                                <img
                                  src={
                                    selectedUser.nationalCredentials
                                      .nationalCardImageUrl
                                  }
                                  alt="کارت ملی"
                                  className="w-full h-24 sm:h-32 object-cover rounded"
                                />
                              </div>
                            </div>
                          )}
                          {selectedUser.nationalCredentials
                            .verificationImageUrl && (
                            <div>
                              <label className="text-xs sm:text-sm font-medium text-gray-600">
                                تصویر احراز هویت
                              </label>
                              <div className="mt-1 bg-white p-2 rounded border">
                                <img
                                  src={
                                    selectedUser.nationalCredentials
                                      .verificationImageUrl
                                  }
                                  alt="احراز هویت"
                                  className="w-full h-24 sm:h-32 object-cover rounded"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500 bg-white rounded border">
                      هیچ اطلاعات هویتی ثبت نشده است
                    </div>
                  )}
                </div>

                {/* Contact Info */}
                <div className="bg-gray-50 rounded-xl p-4 border border-[#0A1D37]/10">
                  <h3 className="text-base sm:text-lg font-semibold text-[#0A1D37] mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#0A1D37] rounded-full"></span>
                    اطلاعات تماس
                  </h3>
                  {selectedUser.contactInfo ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-gray-600">
                            ایمیل
                          </label>
                          <div className="text-sm sm:text-base text-gray-900 mt-1 bg-white px-2 py-1 rounded border">
                            {selectedUser.contactInfo.email || "تعریف نشده"}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-gray-600">
                            شماره موبایل
                          </label>
                          <div className="text-sm sm:text-base text-gray-900 mt-1 font-mono bg-white px-2 py-1 rounded border">
                            {selectedUser.contactInfo.mobilePhone ||
                              "تعریف نشده"}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-gray-600">
                            تلفن ثابت
                          </label>
                          <div className="text-sm sm:text-base text-gray-900 mt-1 font-mono bg-white px-2 py-1 rounded border">
                            {selectedUser.contactInfo.homePhone || "تعریف نشده"}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-gray-600">
                            کد پستی
                          </label>
                          <div className="text-sm sm:text-base text-gray-900 mt-1 font-mono bg-white px-2 py-1 rounded border">
                            {selectedUser.contactInfo.postalCode ||
                              "تعریف نشده"}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-600">
                          آدرس
                        </label>
                        <div className="text-sm sm:text-base text-gray-900 mt-1 bg-white px-2 py-1 rounded border min-h-[2rem]">
                          {selectedUser.contactInfo.address || "تعریف نشده"}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-gray-600">
                            وضعیت تایید
                          </label>
                          <div className="mt-1">
                            <span
                              className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                selectedUser.contactInfo.status === "accepted"
                                  ? "bg-green-100 text-green-800"
                                  : selectedUser.contactInfo.status ===
                                    "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {selectedUser.contactInfo.status === "accepted"
                                ? "تایید شده"
                                : selectedUser.contactInfo.status === "rejected"
                                ? "رد شده"
                                : "در انتظار بررسی"}
                            </span>
                          </div>
                        </div>
                        {selectedUser.contactInfo.rejectionNotes && (
                          <div>
                            <label className="text-xs sm:text-sm font-medium text-gray-600">
                              یادداشت رد
                            </label>
                            <div className="text-sm text-red-700 mt-1 bg-red-50 px-2 py-1 rounded border">
                              {selectedUser.contactInfo.rejectionNotes}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500 bg-white rounded border">
                      هیچ اطلاعات تماسی ثبت نشده است
                    </div>
                  )}
                </div>

                {/* Banking Info */}
                <div className="bg-gray-50 rounded-xl p-4 border border-[#0A1D37]/10">
                  <h3 className="text-base sm:text-lg font-semibold text-[#0A1D37] mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#0A1D37] rounded-full"></span>
                    اطلاعات بانکی
                  </h3>
                  {selectedUser.bankingInfo &&
                  selectedUser.bankingInfo.length > 0 ? (
                    <div className="space-y-3">
                      {selectedUser.bankingInfo.map((bank, index) => (
                        <div
                          key={bank._id || index}
                          className="bg-white p-3 sm:p-4 rounded-lg border"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900 mb-2 sm:mb-0">
                              حساب بانکی #{index + 1}
                            </h4>
                            <span
                              className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                bank.status === "accepted"
                                  ? "bg-green-100 text-green-800"
                                  : bank.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {bank.status === "accepted"
                                ? "تایید شده"
                                : bank.status === "rejected"
                                ? "رد شده"
                                : "در انتظار بررسی"}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-medium text-gray-600">
                                نام بانک
                              </label>
                              <div className="text-sm text-gray-900 mt-1 bg-gray-50 px-2 py-1 rounded">
                                {bank.bankName || "تعریف نشده"}
                              </div>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600">
                                نام صاحب حساب
                              </label>
                              <div className="text-sm text-gray-900 mt-1 bg-gray-50 px-2 py-1 rounded">
                                {bank.accountHolderName || "تعریف نشده"}
                              </div>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600">
                                شماره کارت
                              </label>
                              <div className="text-sm text-gray-900 mt-1 font-mono bg-gray-50 px-2 py-1 rounded">
                                {bank.cardNumber || "تعریف نشده"}
                              </div>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600">
                                شماره شبا
                              </label>
                              <div className="text-sm text-gray-900 mt-1 font-mono bg-gray-50 px-2 py-1 rounded">
                                {bank.shebaNumber || "تعریف نشده"}
                              </div>
                            </div>
                          </div>

                          {bank.rejectionNotes && (
                            <div className="mt-3">
                              <label className="text-xs font-medium text-gray-600">
                                یادداشت رد
                              </label>
                              <div className="text-sm text-red-700 mt-1 bg-red-50 px-2 py-1 rounded border border-red-200">
                                {bank.rejectionNotes}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500 bg-white rounded border">
                      هیچ اطلاعات بانکی ثبت نشده است
                    </div>
                  )}
                </div>

                {/* Verification Status */}
                <div className="bg-gray-50 rounded-xl p-4 border border-[#0A1D37]/10">
                  <h3 className="text-base sm:text-lg font-semibold text-[#0A1D37] mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#0A1D37] rounded-full"></span>
                    وضعیت تایید
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-white p-3 rounded-lg border">
                      <label className="text-xs sm:text-sm font-medium text-gray-600">
                        تایید شماره تلفن
                      </label>
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            selectedUser.verifications?.phone?.isVerified
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedUser.verifications?.phone?.isVerified
                            ? "تایید شده"
                            : "تایید نشده"}
                        </span>
                        {selectedUser.verifications?.phone?.verifiedAt && (
                          <span className="text-xs text-gray-500">
                            {new Date(
                              selectedUser.verifications.phone.verifiedAt
                            ).toLocaleDateString("fa-IR")}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border">
                      <label className="text-xs sm:text-sm font-medium text-gray-600">
                        تایید هویت
                      </label>
                      <div className="mt-2 space-y-1">
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${
                            selectedUser.verifications?.identity?.status ===
                            "approved"
                              ? "bg-green-100 text-green-800"
                              : selectedUser.verifications?.identity?.status ===
                                "rejected"
                              ? "bg-red-100 text-red-800"
                              : selectedUser.verifications?.identity?.status ===
                                "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {selectedUser.verifications?.identity?.status ===
                          "approved"
                            ? "تایید شده"
                            : selectedUser.verifications?.identity?.status ===
                              "rejected"
                            ? "رد شده"
                            : selectedUser.verifications?.identity?.status ===
                              "pending"
                            ? "در انتظار بررسی"
                            : "ارسال نشده"}
                        </span>
                        {selectedUser.verifications?.identity
                          ?.rejectionReason && (
                          <div className="text-xs text-red-600 mt-1">
                            {
                              selectedUser.verifications.identity
                                .rejectionReason
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Information */}
                {selectedUser.profile && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-[#0A1D37]/10">
                    <h3 className="text-base sm:text-lg font-semibold text-[#0A1D37] mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#0A1D37] rounded-full"></span>
                      اطلاعات پروفایل
                    </h3>
                    <div className="space-y-3">
                      {selectedUser.profile.avatar && (
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-gray-600">
                            تصویر پروفایل
                          </label>
                          <div className="mt-1 bg-white p-2 rounded border">
                            <img
                              src={selectedUser.profile.avatar}
                              alt="تصویر پروفایل"
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full mx-auto"
                            />
                          </div>
                        </div>
                      )}

                      {selectedUser.profile.bio && (
                        <div>
                          <label className="text-xs sm:text-sm font-medium text-gray-600">
                            بیوگرافی
                          </label>
                          <div className="text-sm text-gray-900 mt-1 bg-white px-2 py-1 rounded border min-h-[2rem]">
                            {selectedUser.profile.bio}
                          </div>
                        </div>
                      )}

                      {selectedUser.profile.preferences && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs sm:text-sm font-medium text-gray-600">
                              زبان
                            </label>
                            <div className="text-sm text-gray-900 mt-1 bg-white px-2 py-1 rounded border">
                              {selectedUser.profile.preferences.language ===
                              "fa"
                                ? "فارسی"
                                : "انگلیسی"}
                            </div>
                          </div>

                          <div>
                            <label className="text-xs sm:text-sm font-medium text-gray-600">
                              تنظیمات اعلانات
                            </label>
                            <div className="mt-1 space-y-1">
                              <div className="flex items-center justify-between bg-white px-2 py-1 rounded border text-xs">
                                <span>ایمیل:</span>
                                <span
                                  className={
                                    selectedUser.profile.preferences
                                      .notifications?.email
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  {selectedUser.profile.preferences
                                    .notifications?.email
                                    ? "فعال"
                                    : "غیرفعال"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between bg-white px-2 py-1 rounded border text-xs">
                                <span>پیامک:</span>
                                <span
                                  className={
                                    selectedUser.profile.preferences
                                      .notifications?.sms
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  {selectedUser.profile.preferences
                                    .notifications?.sms
                                    ? "فعال"
                                    : "غیرفعال"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between bg-white px-2 py-1 rounded border text-xs">
                                <span>اعلانات:</span>
                                <span
                                  className={
                                    selectedUser.profile.preferences
                                      .notifications?.push
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  {selectedUser.profile.preferences
                                    .notifications?.push
                                    ? "فعال"
                                    : "غیرفعال"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-6 border-t border-[#0A1D37]/10 bg-gray-50 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="w-full sm:w-auto px-4 py-2 text-[#0A1D37] border border-[#0A1D37]/20 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  بستن
                </button>
                <button
                  onClick={() => {
                    setShowUserDetails(false);
                    openEditUser(selectedUser);
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-[#0A1D37] text-white rounded-lg hover:bg-[#0A1D37]/90 transition-colors"
                >
                  ویرایش
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Edit User Modal */}
      {showEditUser &&
        selectedUser &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            dir="rtl"
          >
            <div className="bg-white rounded-2xl max-w-6xl w-full h-[95vh] overflow-y-auto shadow-2xl border border-[#0A1D37]/10">
              <div className="p-4 sm:p-6 border-b border-[#0A1D37]/10">
                <h2 className="text-xl font-bold text-[#0A1D37] flex items-center gap-3">
                  <span className="w-3 h-3 bg-[#0A1D37] rounded-full"></span>
                  ویرایش کاربر
                </h2>
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                {/* Basic Info Section */}
                <div className="bg-gray-50 rounded-xl p-4 border border-[#0A1D37]/10">
                  <h3 className="text-base sm:text-lg font-semibold text-[#0A1D37] mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#0A1D37] rounded-full"></span>
                    اطلاعات پایه
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                        نام کاربری
                      </label>
                      <input
                        type="text"
                        value={editForm.username}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            username: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-[#0A1D37]/20 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                        وضعیت
                      </label>
                      <select
                        value={editForm.status}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            status: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-[#0A1D37]/20 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] transition-colors"
                      >
                        <option value="active">فعال</option>
                        <option value="suspended">معلق</option>
                        <option value="banned">مسدود</option>
                        <option value="pending_verification">
                          در انتظار تایید
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                      نقش‌ها
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        "user",
                        "admin",
                        "super_admin",
                        "moderator",
                        "support",
                      ].map((role) => (
                        <label key={role} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editForm.roles.includes(role)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditForm((prev) => ({
                                  ...prev,
                                  roles: [...prev.roles, role],
                                }));
                              } else {
                                setEditForm((prev) => ({
                                  ...prev,
                                  roles: prev.roles.filter((r) => r !== role),
                                }));
                              }
                            }}
                            className="ml-2 accent-[#0A1D37]"
                          />
                          <span className="text-sm">{getRoleText([role])}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* National Credentials Section */}
                <div className="bg-gray-50 rounded-xl p-4 border border-[#0A1D37]/10">
                  <h3 className="text-base sm:text-lg font-semibold text-[#0A1D37] mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#0A1D37] rounded-full"></span>
                    اطلاعات هویتی
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                        نام
                      </label>
                      <input
                        type="text"
                        value={editForm.nationalCredentials.firstName}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            nationalCredentials: {
                              ...prev.nationalCredentials,
                              firstName: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-[#0A1D37]/20 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                        نام خانوادگی
                      </label>
                      <input
                        type="text"
                        value={editForm.nationalCredentials.lastName}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            nationalCredentials: {
                              ...prev.nationalCredentials,
                              lastName: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-[#0A1D37]/20 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                        کد ملی
                      </label>
                      <input
                        type="text"
                        value={editForm.nationalCredentials.nationalNumber}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            nationalCredentials: {
                              ...prev.nationalCredentials,
                              nationalNumber: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-[#0A1D37]/20 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] transition-colors font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                        وضعیت تایید
                      </label>
                      <select
                        value={editForm.nationalCredentials.status}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            nationalCredentials: {
                              ...prev.nationalCredentials,
                              status: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-[#0A1D37]/20 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] transition-colors"
                      >
                        <option value="">انتخاب کنید</option>
                        <option value="accepted">تایید شده</option>
                        <option value="rejected">رد شده</option>
                        <option value="pending_verification">
                          در انتظار بررسی
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                        یادداشت رد
                      </label>
                      <textarea
                        value={editForm.nationalCredentials.rejectionNotes}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            nationalCredentials: {
                              ...prev.nationalCredentials,
                              rejectionNotes: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-[#0A1D37]/20 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] transition-colors resize-none"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Info Section */}
                <div className="bg-gray-50 rounded-xl p-4 border border-[#0A1D37]/10">
                  <h3 className="text-base sm:text-lg font-semibold text-[#0A1D37] mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#0A1D37] rounded-full"></span>
                    اطلاعات تماس
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                        ایمیل
                      </label>
                      <input
                        type="email"
                        value={editForm.contactInfo.email}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            contactInfo: {
                              ...prev.contactInfo,
                              email: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-[#0A1D37]/20 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                        شماره موبایل
                      </label>
                      <input
                        type="tel"
                        value={editForm.contactInfo.mobilePhone}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            contactInfo: {
                              ...prev.contactInfo,
                              mobilePhone: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-[#0A1D37]/20 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] transition-colors font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                        تلفن ثابت
                      </label>
                      <input
                        type="tel"
                        value={editForm.contactInfo.homePhone}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            contactInfo: {
                              ...prev.contactInfo,
                              homePhone: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-[#0A1D37]/20 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] transition-colors font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                        کد پستی
                      </label>
                      <input
                        type="text"
                        value={editForm.contactInfo.postalCode}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            contactInfo: {
                              ...prev.contactInfo,
                              postalCode: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-[#0A1D37]/20 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] transition-colors font-mono"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                      آدرس
                    </label>
                    <textarea
                      value={editForm.contactInfo.address}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          contactInfo: {
                            ...prev.contactInfo,
                            address: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-[#0A1D37]/20 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] transition-colors resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                        وضعیت تایید
                      </label>
                      <select
                        value={editForm.contactInfo.status}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            contactInfo: {
                              ...prev.contactInfo,
                              status: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-[#0A1D37]/20 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] transition-colors"
                      >
                        <option value="">انتخاب کنید</option>
                        <option value="accepted">تایید شده</option>
                        <option value="rejected">رد شده</option>
                        <option value="pending_verification">
                          در انتظار بررسی
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                        یادداشت رد
                      </label>
                      <textarea
                        value={editForm.contactInfo.rejectionNotes}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            contactInfo: {
                              ...prev.contactInfo,
                              rejectionNotes: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-[#0A1D37]/20 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] transition-colors resize-none"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Profile Section */}
                <div className="bg-gray-50 rounded-xl p-4 border border-[#0A1D37]/10">
                  <h3 className="text-base sm:text-lg font-semibold text-[#0A1D37] mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#0A1D37] rounded-full"></span>
                    اطلاعات پروفایل
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                        بیوگرافی
                      </label>
                      <textarea
                        value={editForm.profile.bio}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            profile: {
                              ...prev.profile,
                              bio: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-[#0A1D37]/20 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] transition-colors resize-none"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                          زبان
                        </label>
                        <select
                          value={editForm.profile.preferences.language}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              profile: {
                                ...prev.profile,
                                preferences: {
                                  ...prev.profile.preferences,
                                  language: e.target.value,
                                },
                              },
                            }))
                          }
                          className="w-full px-3 py-2 border border-[#0A1D37]/20 rounded-lg focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] transition-colors"
                        >
                          <option value="fa">فارسی</option>
                          <option value="en">انگلیسی</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                          تنظیمات اعلانات
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={
                                editForm.profile.preferences.notifications.email
                              }
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  profile: {
                                    ...prev.profile,
                                    preferences: {
                                      ...prev.profile.preferences,
                                      notifications: {
                                        ...prev.profile.preferences
                                          .notifications,
                                        email: e.target.checked,
                                      },
                                    },
                                  },
                                }))
                              }
                              className="ml-2 accent-[#0A1D37]"
                            />
                            <span className="text-sm">ایمیل</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={
                                editForm.profile.preferences.notifications.sms
                              }
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  profile: {
                                    ...prev.profile,
                                    preferences: {
                                      ...prev.profile.preferences,
                                      notifications: {
                                        ...prev.profile.preferences
                                          .notifications,
                                        sms: e.target.checked,
                                      },
                                    },
                                  },
                                }))
                              }
                              className="ml-2 accent-[#0A1D37]"
                            />
                            <span className="text-sm">پیامک</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={
                                editForm.profile.preferences.notifications.push
                              }
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  profile: {
                                    ...prev.profile,
                                    preferences: {
                                      ...prev.profile.preferences,
                                      notifications: {
                                        ...prev.profile.preferences
                                          .notifications,
                                        push: e.target.checked,
                                      },
                                    },
                                  },
                                }))
                              }
                              className="ml-2 accent-[#0A1D37]"
                            />
                            <span className="text-sm">اعلانات</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-[#0A1D37]/10 flex justify-end gap-3">
                <button
                  onClick={() => setShowEditUser(false)}
                  className="px-4 py-2 text-[#0A1D37] border border-[#0A1D37]/20 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  انصراف
                </button>
                <button
                  onClick={handleUpdateUser}
                  disabled={submitting}
                  className="px-4 py-2 bg-[#0A1D37] text-white rounded-lg hover:bg-[#0A1D37]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? "در حال بروزرسانی..." : "ذخیره تغییرات"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal &&
        userToDelete &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            dir="rtl"
          >
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-red-200">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTrash className="text-red-600 text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  حذف کاربر
                </h3>
                <p className="text-gray-600 mb-6">
                  آیا مطمئن هستید که میخواهید کاربر{" "}
                  <span className="font-semibold text-gray-900">
                    {getUserName(userToDelete)}
                  </span>{" "}
                  را حذف کنید؟ این عمل قابل بازگشت نیست.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setUserToDelete(null);
                    }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={handleDeleteUser}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    حذف کاربر
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default UsersList;
