"use client";

import { useState, useEffect } from "react";
import { showToast } from "@/utilities/toast";
import { estedadBold } from "@/next-persian-fonts/estedad";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface Request {
  _id: string;
  requestNumber: string;
  service: {
    title: string;
    icon?: string;
    fee: number;
  };
  status: string;
  priority: string;
  paymentAmount: number;
  isPaid: boolean;
  createdAt: string;
  assignedTo?: {
    nationalCredentials: {
      firstName?: string;
      lastName?: string;
    };
  };
  rejectedReason?: string;
  adminNotes: Array<{
    note: string;
    addedBy: {
      nationalCredentials: {
        firstName?: string;
        lastName?: string;
      };
    };
    addedAt: string;
    isVisibleToCustomer: boolean;
  }>;
  estimatedCompletionDate?: string;
  actualCompletionDate?: string;
}

interface CustomerRequestsTableProps {
  className?: string;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  in_progress: "bg-blue-100 text-blue-800 border-blue-300",
  completed: "bg-green-100 text-green-800 border-green-300",
  rejected: "bg-red-100 text-red-800 border-red-300",
  cancelled: "bg-gray-100 text-gray-800 border-gray-300",
  requires_info: "bg-purple-100 text-purple-800 border-purple-300"
};

const statusLabels = {
  pending: "در انتظار بررسی",
  in_progress: "در حال انجام",
  completed: "تکمیل شده",
  rejected: "رد شده",
  cancelled: "لغو شده",
  requires_info: "نیاز به اطلاعات"
};

const statusDescriptions = {
  pending: "درخواست شما در انتظار بررسی توسط کارشناسان ما است",
  in_progress: "درخواست شما در حال پردازش و انجام است",
  completed: "درخواست شما با موفقیت تکمیل شده است",
  rejected: "متأسفانه درخواست شما رد شده است",
  cancelled: "درخواست شما لغو شده است",
  requires_info: "برای ادامه پردازش نیاز به اطلاعات بیشتری داریم"
};

export default function CustomerRequestsTable({ className = "" }: CustomerRequestsTableProps) {
  const { user, isLoggedIn } = useCurrentUser();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [customerResponse, setCustomerResponse] = useState("");
  const [submittingResponse, setSubmittingResponse] = useState(false);

  const fetchRequests = async () => {
    if (!isLoggedIn) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10"
      });

      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/customer/requests?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setRequests(data.data);
        setTotalPages(data.pagination.pages);
        setTotal(data.pagination.total);
      } else {
        showToast.error(data.error || "خطا در دریافت درخواست‌ها");
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      showToast.error("خطا در دریافت درخواست‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchRequests();
    }
  }, [currentPage, statusFilter, isLoggedIn]);

  const handleSubmitResponse = async () => {
    if (!selectedRequest || !customerResponse.trim()) {
      showToast.error("لطفاً پاسخ خود را وارد کنید");
      return;
    }

    setSubmittingResponse(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/customer/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          requestId: selectedRequest._id,
          response: customerResponse
        })
      });

      const data = await response.json();

      if (data.success) {
        showToast.success(data.message);
        setShowResponseModal(false);
        setCustomerResponse("");
        fetchRequests();
      } else {
        showToast.error(data.error || "خطا در ارسال پاسخ");
      }
    } catch (error) {
      console.error("Response error:", error);
      showToast.error("خطا در ارسال پاسخ");
    } finally {
      setSubmittingResponse(false);
    }
  };

  const openDetailModal = (request: Request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const openResponseModal = (request: Request) => {
    setSelectedRequest(request);
    setCustomerResponse("");
    setShowResponseModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const getAssignedToName = (assignedTo?: Request['assignedTo']) => {
    if (!assignedTo) return "تعیین نشده";
    const { firstName, lastName } = assignedTo.nationalCredentials;
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    return "کارشناس";
  };

  if (!isLoggedIn) {
    return (
      <div className="text-center p-8">
        <div className="mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-[#4DBFF0] to-[#FF7A00] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">🔐</span>
          </div>
          <h3 className="text-xl font-bold text-[#0A1D37] mb-2">ورود به سیستم لازم است</h3>
          <p className="text-[#0A1D37]/70 mb-4">برای مشاهده درخواست‌های خود لطفاً وارد حساب کاربری شوید</p>
          <a 
            href="/auth/sms" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#4DBFF0] to-[#FF7A00] text-white rounded-xl hover:shadow-lg transition-all"
          >
            ورود / ثبت نام
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`} dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4DBFF0]/10 to-[#FF7A00]/10 backdrop-blur-sm border border-[#4DBFF0]/30 rounded-2xl p-6 mb-6">
        <h1 className={`text-2xl ${estedadBold.className} text-[#0A1D37] mb-4`}>
          درخواست‌های من
        </h1>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white/80 border border-[#4DBFF0]/30 rounded-xl focus:ring-2 focus:ring-[#4DBFF0] focus:outline-none"
          >
            <option value="">همه وضعیت‌ها</option>
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <div className="text-sm text-[#0A1D37]/70 flex items-center">
            مجموع: {total} درخواست
          </div>

          {/* New Request Button */}
          <div className="mr-auto">
            <a 
              href="/services-client" 
              className="px-4 py-2 bg-gradient-to-r from-[#4DBFF0] to-[#FF7A00] text-white rounded-xl hover:shadow-lg transition-all text-sm"
            >
              درخواست جدید
            </a>
          </div>
        </div>
      </div>

      {/* Requests Grid */}
      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4DBFF0] mx-auto mb-4"></div>
          <p className="text-[#0A1D37]/60">در حال بارگذاری...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center p-12">
          <div className="w-16 h-16 bg-gradient-to-r from-[#4DBFF0]/20 to-[#FF7A00]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-[#4DBFF0] text-2xl">📋</span>
          </div>
          <h3 className="text-xl font-bold text-[#0A1D37] mb-2">هنوز درخواستی ثبت نکرده‌اید</h3>
          <p className="text-[#0A1D37]/70 mb-6">از طریق دکمه زیر اولین درخواست خود را ثبت کنید</p>
          <a 
            href="/services-client" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#4DBFF0] to-[#FF7A00] text-white rounded-xl hover:shadow-lg transition-all"
          >
            ثبت درخواست جدید
          </a>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((request) => (
              <div key={request._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#4DBFF0]/10 to-[#FF7A00]/10 px-6 py-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {request.service.icon && (
                        <span className="text-xl">{request.service.icon}</span>
                      )}
                      <div>
                        <h3 className="font-semibold text-[#0A1D37]">{request.service.title}</h3>
                        <p className="text-sm text-[#0A1D37]/60 font-mono">{request.requestNumber}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[request.status as keyof typeof statusColors]}`}>
                      {statusLabels[request.status as keyof typeof statusLabels]}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="text-sm text-[#0A1D37]/70">
                      {statusDescriptions[request.status as keyof typeof statusDescriptions]}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#0A1D37]/60">مبلغ:</span>
                      <span className="font-semibold text-[#0A1D37]">
                        {request.paymentAmount?.toLocaleString('fa-IR')} تومان
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#0A1D37]/60">تاریخ ثبت:</span>
                      <span className="text-sm text-[#0A1D37]">
                        {formatDate(request.createdAt)}
                      </span>
                    </div>

                    {request.assignedTo && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#0A1D37]/60">کارشناس:</span>
                        <span className="text-sm text-[#0A1D37]">
                          {getAssignedToName(request.assignedTo)}
                        </span>
                      </div>
                    )}

                    {request.estimatedCompletionDate && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#0A1D37]/60">تاریخ تحویل:</span>
                        <span className="text-sm text-[#0A1D37]">
                          {formatDate(request.estimatedCompletionDate)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Rejection Reason */}
                  {request.status === 'rejected' && request.rejectedReason && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="text-sm font-medium text-red-800 mb-1">دلیل رد:</div>
                      <div className="text-sm text-red-700">{request.rejectedReason}</div>
                    </div>
                  )}

                  {/* Admin Notes */}
                  {request.adminNotes.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-sm font-medium text-blue-800 mb-2">پیام‌های کارشناس:</div>
                      <div className="space-y-2">
                        {request.adminNotes.slice(-2).map((note, index) => (
                          <div key={index} className="text-sm text-blue-700">
                            {note.note}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t flex gap-2">
                  <button
                    onClick={() => openDetailModal(request)}
                    className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 text-[#0A1D37] rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    جزئیات
                  </button>
                  
                  {request.status === 'rejected' && (
                    <button
                      onClick={() => openResponseModal(request)}
                      className="flex-1 px-3 py-2 text-sm bg-gradient-to-r from-[#4DBFF0] to-[#FF7A00] text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      پاسخ
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                قبلی
              </button>
              
              <span className="text-sm text-[#0A1D37]/60">
                صفحه {currentPage} از {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                بعدی
              </button>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className={`text-xl ${estedadBold.className} text-[#0A1D37]`}>
                جزئیات درخواست {selectedRequest.requestNumber}
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#0A1D37]/60">سرویس</label>
                  <div className="text-[#0A1D37] mt-1">{selectedRequest.service.title}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#0A1D37]/60">وضعیت</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[selectedRequest.status as keyof typeof statusColors]}`}>
                      {statusLabels[selectedRequest.status as keyof typeof statusLabels]}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#0A1D37]/60">مبلغ</label>
                  <div className="text-[#0A1D37] mt-1">
                    {selectedRequest.paymentAmount?.toLocaleString('fa-IR')} تومان
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#0A1D37]/60">تاریخ ثبت</label>
                  <div className="text-[#0A1D37] mt-1">
                    {formatDate(selectedRequest.createdAt)}
                  </div>
                </div>
              </div>

              {selectedRequest.rejectedReason && (
                <div>
                  <label className="text-sm font-medium text-red-800">دلیل رد</label>
                  <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {selectedRequest.rejectedReason}
                  </div>
                </div>
              )}

              {selectedRequest.adminNotes.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-[#0A1D37]/60">پیام‌های کارشناس</label>
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                    {selectedRequest.adminNotes.map((note, index) => (
                      <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-blue-700 text-sm">{note.note}</div>
                        <div className="text-blue-600 text-xs mt-1">
                          {formatDate(note.addedAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2 bg-gradient-to-r from-[#4DBFF0] to-[#FF7A00] text-white rounded-xl hover:shadow-lg transition-all"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full">
            <div className="p-6 border-b">
              <h2 className={`text-xl ${estedadBold.className} text-[#0A1D37]`}>
                پاسخ به رد درخواست
              </h2>
            </div>
            
            <div className="p-6">
              {selectedRequest.rejectedReason && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-sm font-medium text-red-800 mb-1">دلیل رد:</div>
                  <div className="text-sm text-red-700">{selectedRequest.rejectedReason}</div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                  پاسخ شما
                </label>
                <textarea
                  value={customerResponse}
                  onChange={(e) => setCustomerResponse(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4DBFF0] focus:outline-none"
                  rows={4}
                  placeholder="توضیحات و پاسخ خود را در مورد دلیل رد وارد کنید..."
                />
              </div>
            </div>

            <div className="p-6 border-t flex gap-4 justify-end">
              <button
                onClick={() => setShowResponseModal(false)}
                className="px-4 py-2 text-[#0A1D37] border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                لغو
              </button>
              <button
                onClick={handleSubmitResponse}
                disabled={submittingResponse || !customerResponse.trim()}
                className="px-6 py-2 bg-gradient-to-r from-[#4DBFF0] to-[#FF7A00] text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
              >
                {submittingResponse ? "در حال ارسال..." : "ارسال پاسخ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}