"use client";
import { useState, useEffect } from "react";
import { 
  FaTicketAlt, 
  FaEye, 
  FaTimes, 
  FaClock, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaReply,
  FaSpinner,
  FaTrash,
  FaUser,
  FaCalendar,
  FaSearch,
  FaFilter
} from "react-icons/fa";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { showToast } from "@/utilities/toast";

// Interfaces
interface Ticket {
  _id: string;
  category: string;
  description: string;
  adminAnswer?: string;
  status: "open" | "in_progress" | "closed";
  createdAt: string;
  updatedAt: string;
  user: {
    _id: string;
    nationalCredentials?: {
      firstName?: string;
      lastName?: string;
    };
    personalInformations?: {
      firstName?: string;
      lastName?: string;
    };
  };
}

const AdminTicketsList = () => {
  const { user: currentUser, isLoggedIn } = useCurrentUser();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  
  // Form states
  const [adminResponse, setAdminResponse] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    in_progress: 0,
    closed: 0
  });

  // Ticket categories
  const ticketCategories = [
    "مشکل فنی",
    "سوال عمومی", 
    "مشکل پرداخت",
    "درخواست بازپرداخت",
    "مشکل احراز هویت",
    "مشکل خدمات",
    "پیشنهاد",
    "شکایت",
    "سایر موارد"
  ];

  // Check if user is admin
  useEffect(() => {
    const isAdmin = currentUser?.roles && (
      currentUser.roles.includes("admin") || 
      currentUser.roles.includes("super_admin")
    );
    if (isLoggedIn && !isAdmin) {
      setError("شما دسترسی ادمین ندارید");
      return;
    }
  }, [isLoggedIn, currentUser]);

  // Fetch tickets
  const fetchTickets = async () => {
    const isAdmin = currentUser?.roles && (
      currentUser.roles.includes("admin") || 
      currentUser.roles.includes("super_admin")
    );
    if (!isLoggedIn || !currentUser || !isAdmin) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      let url = "/api/tickets?";
      
      if (statusFilter !== "all") {
        url += `status=${statusFilter}&`;
      }
      if (categoryFilter !== "all") {
        url += `category=${encodeURIComponent(categoryFilter)}&`;
      }
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("خطا در دریافت تیکت‌ها");
      }

      const data = await response.json();
      const ticketList = data.success ? data.data : [];
      
      // Filter by search term on frontend
      const filteredTickets = searchTerm
        ? ticketList.filter((ticket: Ticket) =>
            ticket.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            getUserName(ticket.user).toLowerCase().includes(searchTerm.toLowerCase())
          )
        : ticketList;
      
      setTickets(filteredTickets);
      
      // Calculate stats
      setStats({
        total: ticketList.length,
        open: ticketList.filter((t: Ticket) => t.status === "open").length,
        in_progress: ticketList.filter((t: Ticket) => t.status === "in_progress").length,
        closed: ticketList.filter((t: Ticket) => t.status === "closed").length,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای نامشخص");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isAdmin = currentUser?.roles && (
      currentUser.roles.includes("admin") || 
      currentUser.roles.includes("super_admin")
    );
    if (isLoggedIn && isAdmin) {
      fetchTickets();
    }
  }, [isLoggedIn, currentUser, statusFilter, categoryFilter]);

  // Apply search filter when search term changes
  useEffect(() => {
    const isAdmin = currentUser?.roles && (
      currentUser.roles.includes("admin") || 
      currentUser.roles.includes("super_admin")
    );
    if (isLoggedIn && isAdmin) {
      fetchTickets();
    }
  }, [searchTerm]);

  // Respond to ticket
  const respondToTicket = async () => {
    if (!selectedTicket || !adminResponse.trim()) {
      showToast.error("لطفاً پاسخ خود را وارد کنید");
      return;
    }

    setIsResponding(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/tickets", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ticketId: selectedTicket._id,
          adminAnswer: adminResponse,
          status: "in_progress"
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "خطا در ارسال پاسخ");
      }

      showToast.success("پاسخ با موفقیت ارسال شد");
      setAdminResponse("");
      setShowDetailsModal(false);
      fetchTickets(); // Refresh the list
    } catch (error) {
      showToast.error(
        error instanceof Error ? error.message : "خطا در ارسال پاسخ"
      );
    } finally {
      setIsResponding(false);
    }
  };

  // Update ticket status
  const updateTicketStatus = async (ticketId: string, status: "open" | "in_progress" | "closed") => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/tickets", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ticketId,
          status
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "خطا در به‌روزرسانی وضعیت");
      }

      showToast.success("وضعیت تیکت به‌روزرسانی شد");
      fetchTickets(); // Refresh the list
    } catch (error) {
      showToast.error(
        error instanceof Error ? error.message : "خطا در به‌روزرسانی وضعیت"
      );
    }
  };

  // Delete ticket
  const deleteTicket = async (ticketId: string) => {
    if (!confirm("آیا از حذف این تیکت اطمینان دارید؟")) return;
    
    setIsDeleting(ticketId);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/tickets?ticketId=${ticketId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "خطا در حذف تیکت");
      }

      showToast.success("تیکت با موفقیت حذف شد");
      fetchTickets(); // Refresh the list
    } catch (error) {
      showToast.error(
        error instanceof Error ? error.message : "خطا در حذف تیکت"
      );
    } finally {
      setIsDeleting(null);
    }
  };

  // Utility functions
  const getUserName = (user: Ticket['user']) => {
    return user.nationalCredentials?.firstName && user.nationalCredentials?.lastName
      ? `${user.nationalCredentials.firstName} ${user.nationalCredentials.lastName}`
      : user.personalInformations?.firstName && user.personalInformations?.lastName
      ? `${user.personalInformations.firstName} ${user.personalInformations.lastName}`
      : "کاربر ناشناس";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "text-blue-700 bg-blue-100 border-blue-300";
      case "in_progress":
        return "text-orange-700 bg-orange-100 border-orange-300";
      case "closed":
        return "text-green-700 bg-green-100 border-green-300";
      default:
        return "text-gray-700 bg-gray-100 border-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "باز";
      case "in_progress":
        return "در حال بررسی";
      case "closed":
        return "بسته شده";
      default:
        return "نامشخص";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <FaClock className="text-sm" />;
      case "in_progress":
        return <FaSpinner className="text-sm animate-spin" />;
      case "closed":
        return <FaCheckCircle className="text-sm" />;
      default:
        return <FaClock className="text-sm" />;
    }
  };

  const openTicketDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setAdminResponse(ticket.adminAnswer || "");
    setShowDetailsModal(true);
  };

  const isCurrentUserAdmin = currentUser?.roles && (
    currentUser.roles.includes("admin") || 
    currentUser.roles.includes("super_admin")
  );

  if (!isCurrentUserAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#E8F4FD] to-[#F0F9FF] flex items-center justify-center px-4">
        <div className="text-center p-6 sm:p-8 lg:p-12 bg-white rounded-3xl shadow-2xl max-w-md border border-red-100">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <FaExclamationTriangle className="text-red-500 text-4xl sm:text-5xl" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0A1D37] mb-3 sm:mb-4">
            دسترسی غیرمجاز
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            شما دسترسی ادمین ندارید
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1D37] mb-2">
            مدیریت تیکت‌های پشتیبانی
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            مشاهده و پاسخ به درخواست‌های کاربران
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">کل تیکت‌ها</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <FaTicketAlt className="text-blue-500 text-2xl" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 sm:p-6 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">باز</p>
              <p className="text-2xl font-bold text-orange-900">{stats.open}</p>
            </div>
            <FaClock className="text-orange-500 text-2xl" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 sm:p-6 rounded-xl border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">در حال بررسی</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.in_progress}</p>
            </div>
            <FaSpinner className="text-yellow-500 text-2xl" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">بسته شده</p>
              <p className="text-2xl font-bold text-green-900">{stats.closed}</p>
            </div>
            <FaCheckCircle className="text-green-500 text-2xl" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-[#0A1D37] flex items-center gap-2">
          <FaFilter className="text-sm" />
          فیلترها
        </h3>
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="جستجو در تیکت‌ها..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] transition-colors"
          />
          <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37]"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="open">باز</option>
              <option value="in_progress">در حال بررسی</option>
              <option value="closed">بسته شده</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37]"
            >
              <option value="all">همه دسته‌ها</option>
              {ticketCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0A1D37]/20 border-t-[#0A1D37] mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">در حال بارگذاری تیکت‌ها...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8 sm:p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <FaExclamationTriangle className="text-3xl text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-red-700">خطا در بارگذاری</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => fetchTickets()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            تلاش مجدد
          </button>
        </div>
      ) : tickets.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 sm:p-16 text-center space-y-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-[#0A1D37]/10 to-[#4DBFF0]/10 rounded-full flex items-center justify-center mx-auto">
            <FaTicketAlt className="text-4xl sm:text-5xl text-gray-400" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0A1D37]">
              تیکتی یافت نشد
            </h3>
            <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              با فیلترهای انتخاب شده تیکتی وجود ندارد
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="group bg-white rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
            >
              <div className="bg-gradient-to-r from-[#0A1D37]/5 to-[#4DBFF0]/5 px-5 sm:px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] rounded-xl flex items-center justify-center">
                      <FaTicketAlt className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-lg font-bold text-[#0A1D37] group-hover:text-[#4DBFF0] transition-colors">
                        {ticket.category}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <FaUser className="text-xs" />
                        <span>{getUserName(ticket.user)}</span>
                        <span>•</span>
                        <FaCalendar className="text-xs" />
                        <span>{new Date(ticket.createdAt).toLocaleDateString("fa-IR")}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-nowrap text-xs sm:text-sm font-semibold ${getStatusColor(
                      ticket.status
                    )}`}
                  >
                    {getStatusIcon(ticket.status)}
                    {getStatusText(ticket.status)}
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">شرح درخواست:</h4>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {ticket.description}
                  </p>
                </div>

                {ticket.adminAnswer && (
                  <div className="mb-4 p-4 bg-green-50 border-r-4 border-green-500 rounded-lg">
                    <h4 className="text-sm font-semibold text-green-900 mb-2">پاسخ داده شده:</h4>
                    <p className="text-green-700 text-sm leading-relaxed line-clamp-2">
                      {ticket.adminAnswer}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => openTicketDetails(ticket)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white font-medium rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-sm"
                  >
                    <FaEye className="text-sm" />
                    مشاهده و پاسخ
                  </button>

                  {/* Status Update Buttons */}
                  {ticket.status !== "closed" && (
                    <button
                      onClick={() => updateTicketStatus(ticket._id, "closed")}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl hover:scale-[1.02] transition-all duration-300 text-sm"
                    >
                      <FaCheckCircle className="text-sm" />
                      بستن
                    </button>
                  )}

                  <button
                    onClick={() => deleteTicket(ticket._id)}
                    disabled={isDeleting === ticket._id}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl hover:scale-[1.02] transition-all duration-300 text-sm disabled:opacity-50"
                  >
                    {isDeleting === ticket._id ? (
                      <FaSpinner className="animate-spin text-sm" />
                    ) : (
                      <FaTrash className="text-sm" />
                    )}
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ticket Details Modal */}
      {showDetailsModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border-2 border-[#0A1D37]/20 animate-in zoom-in duration-300">
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] rounded-xl flex items-center justify-center">
                  <FaTicketAlt className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0A1D37]">جزئیات و پاسخ تیکت</h2>
                  <p className="text-sm text-gray-600">کد پیگیری: {selectedTicket._id.slice(-8)}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-10 h-10 flex items-center justify-center hover:bg-red-50 rounded-xl transition-colors text-gray-500 hover:text-red-600"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Ticket Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">کاربر</p>
                  <p className="font-semibold text-[#0A1D37]">{getUserName(selectedTicket.user)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">دسته‌بندی</p>
                  <p className="font-semibold text-[#0A1D37]">{selectedTicket.category}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">وضعیت</p>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-semibold ${getStatusColor(
                      selectedTicket.status
                    )}`}
                  >
                    {getStatusIcon(selectedTicket.status)}
                    {getStatusText(selectedTicket.status)}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">تاریخ ایجاد</p>
                  <p className="font-semibold text-[#0A1D37]">
                    {new Date(selectedTicket.createdAt).toLocaleDateString("fa-IR")}
                  </p>
                </div>
              </div>

              {/* User's Request */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-[#0A1D37] mb-4">درخواست کاربر</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedTicket.description}
                </p>
              </div>

              {/* Admin Response Section */}
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <FaReply />
                  پاسخ پشتیبانی
                </h3>
                <textarea
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  placeholder="پاسخ خود را اینجا بنویسید..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] transition-colors resize-none"
                />
                
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={respondToTicket}
                    disabled={isResponding || !adminResponse.trim()}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white font-bold rounded-xl hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResponding ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        در حال ارسال...
                      </>
                    ) : (
                      <>
                        <FaReply />
                        ارسال پاسخ
                      </>
                    )}
                  </button>

                  <div className="flex gap-2">
                    <select
                      onChange={(e) => updateTicketStatus(selectedTicket._id, e.target.value as "open" | "in_progress" | "closed")}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37]"
                    >
                      <option value="">تغییر وضعیت</option>
                      <option value="open">باز</option>
                      <option value="in_progress">در حال بررسی</option>
                      <option value="closed">بسته</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Previous Response */}
              {selectedTicket.adminAnswer && (
                <div className="bg-green-50 border-r-4 border-green-500 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-green-900 mb-4">پاسخ قبلی</h3>
                  <p className="text-green-700 leading-relaxed whitespace-pre-wrap">
                    {selectedTicket.adminAnswer}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTicketsList;