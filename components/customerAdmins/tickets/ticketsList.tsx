"use client";
import { useState, useEffect } from "react";
import { 
  FaTicketAlt, 
  FaPlus, 
  FaEye, 
  FaTimes, 
  FaClock, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaPaperPlane,
  FaSpinner
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
}

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

const CustomerTicketsList = () => {
  const { user: currentUser, isLoggedIn } = useCurrentUser();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  
  // Form states
  const [newTicket, setNewTicket] = useState({
    category: "",
    description: ""
  });
  const [isCreating, setIsCreating] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch tickets
  const fetchTickets = async () => {
    if (!isLoggedIn || !currentUser) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      const url = `/api/tickets${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`;
      
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
      setTickets(data.success ? data.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای نامشخص");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchTickets();
    }
  }, [isLoggedIn, currentUser, statusFilter]);

  // Create new ticket
  const createTicket = async () => {
    if (!newTicket.category || !newTicket.description.trim()) {
      showToast.error("لطفاً تمام فیلدها را پر کنید");
      return;
    }

    setIsCreating(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTicket),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "خطا در ایجاد تیکت");
      }

      showToast.success("تیکت با موفقیت ایجاد شد");
      setShowCreateModal(false);
      setNewTicket({ category: "", description: "" });
      fetchTickets(); // Refresh the list
    } catch (error) {
      showToast.error(
        error instanceof Error ? error.message : "خطا در ایجاد تیکت"
      );
    } finally {
      setIsCreating(false);
    }
  };

  // Utility functions
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
    setShowDetailsModal(true);
  };

  return (
    <div className="space-y-6 sm:space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1D37] mb-2">
            تیکت‌های پشتیبانی
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            مشاهده و مدیریت درخواست‌های پشتیبانی خود
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          <FaPlus className="text-sm" />
          تیکت جدید
        </button>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-[#0A1D37] mb-4">فیلتر بر اساس وضعیت</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { value: "all", label: "همه" },
            { value: "open", label: "باز" },
            { value: "in_progress", label: "در حال بررسی" },
            { value: "closed", label: "بسته شده" }
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                statusFilter === filter.value
                  ? "bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {filter.label}
            </button>
          ))}
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
              هنوز تیکتی ندارید
            </h3>
            <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              برای دریافت پشتیبانی، اولین تیکت خود را ایجاد کنید
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
          >
            <FaPlus className="text-lg" />
            ایجاد تیکت جدید
          </button>
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
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
                      </p>
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
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {ticket.description}
                  </p>
                </div>

                {ticket.adminAnswer && (
                  <div className="mb-4 p-4 bg-blue-50 border-r-4 border-blue-500 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">پاسخ پشتیبانی:</h4>
                    <p className="text-blue-700 text-sm leading-relaxed">
                      {ticket.adminAnswer}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => openTicketDetails(ticket)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white font-bold rounded-xl hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 text-sm"
                  >
                    <FaEye className="text-base" />
                    مشاهده جزئیات
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border-2 border-[#0A1D37]/20 animate-in zoom-in duration-300">
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] rounded-xl flex items-center justify-center">
                  <FaTicketAlt className="text-white text-lg" />
                </div>
                <h2 className="text-xl font-bold text-[#0A1D37]">ایجاد تیکت جدید</h2>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-10 h-10 flex items-center justify-center hover:bg-red-50 rounded-xl transition-colors text-gray-500 hover:text-red-600"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  دسته‌بندی *
                </label>
                <select
                  value={newTicket.category}
                  onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] transition-colors"
                >
                  <option value="">دسته‌بندی را انتخاب کنید</option>
                  {ticketCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  شرح مسئله *
                </label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="لطفاً مسئله خود را به تفصیل شرح دهید..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0A1D37] focus:border-[#0A1D37] transition-colors resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  حداقل 10 کاراکتر وارد کنید
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={createTicket}
                  disabled={isCreating || !newTicket.category || newTicket.description.length < 10}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white font-bold rounded-xl hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      در حال ارسال...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      ارسال تیکت
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  disabled={isCreating}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors disabled:opacity-50"
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
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
                  <h2 className="text-xl font-bold text-[#0A1D37]">جزئیات تیکت</h2>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
           
              </div>

              {/* Description */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-[#0A1D37] mb-4">شرح درخواست</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedTicket.description}
                </p>
              </div>

              {/* Admin Answer */}
              {selectedTicket.adminAnswer && (
                <div className="bg-blue-50 border-r-4 border-blue-500 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-blue-900 mb-4">پاسخ پشتیبانی</h3>
                  <p className="text-blue-700 leading-relaxed whitespace-pre-wrap">
                    {selectedTicket.adminAnswer}
                  </p>
                </div>
              )}

              {/* No Answer Yet */}
              {!selectedTicket.adminAnswer && selectedTicket.status !== "closed" && (
                <div className="bg-orange-50 border-r-4 border-orange-500 p-6 rounded-xl text-center">
                  <FaClock className="text-orange-500 text-3xl mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-orange-900 mb-2">در انتظار پاسخ</h3>
                  <p className="text-orange-700">
                    تیکت شما در صف پشتیبانی قرار دارد و به زودی پاسخ داده خواهد شد
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

export default CustomerTicketsList;