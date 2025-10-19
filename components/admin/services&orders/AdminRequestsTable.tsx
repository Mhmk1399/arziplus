"use client";

import { useState, useEffect } from "react";
import { showToast } from "@/utilities/toast";
import { estedadBold } from "@/next-persian-fonts/estedad";

interface Request {
  _id: string;
  requestNumber: string;
  service: {
    title: string;
    icon?: string;
    fee: number;
  };
  data: Record<string, string>; // User submitted form data
  customer: {
    nationalCredentials: {
      firstName?: string;
      lastName?: string;
    };
    contactInfo: {
      email: string;
      mobilePhone: string;
    };
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
}

interface AdminRequestsTableProps {
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

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800"
};

const statusLabels = {
  pending: "در انتظار",
  in_progress: "در حال انجام",
  completed: "تکمیل شده",
  rejected: "رد شده",
  cancelled: "لغو شده",
  requires_info: "نیاز به اطلاعات"
};

const priorityLabels = {
  low: "کم",
  medium: "متوسط",
  high: "زیاد",
  urgent: "فوری"
};

export default function AdminRequestsTable({ className = "mt-20" }: AdminRequestsTableProps) {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Update form state
  const [updateForm, setUpdateForm] = useState({
    status: "",
    rejectedReason: "",
    priority: "",
    adminNote: "",
    isNoteVisibleToCustomer: false
  });

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        showToast.error("لطفاً وارد سیستم شوید");
        return;
      }

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10"
      });

      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/service-requests?${params}`, {
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
        showToast.error("خطا در دریافت درخواست‌ها");
      }
    } catch (error) {
      console.log("Error fetching requests:", error);
      showToast.error("خطا در دریافت درخواست‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentPage, statusFilter]);

  const handleUpdateRequest = async () => {
    if (!selectedRequest) return;

    setUpdating(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/requests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          requestId: selectedRequest._id,
          ...updateForm
        })
      });

      const data = await response.json();

      if (data.success) {
        showToast.success("درخواست با موفقیت به‌روزرسانی شد");
        setShowUpdateModal(false);
        fetchRequests();
      } else {
        showToast.error(data.error || "خطا در به‌روزرسانی");
      }
    } catch (error) {
      console.log("Update error:", error);
      showToast.error("خطا در به‌روزرسانی درخواست");
    } finally {
      setUpdating(false);
    }
  };

  const openUpdateModal = (request: Request) => {
    setSelectedRequest(request);
    setUpdateForm({
      status: request.status,
      rejectedReason: request.rejectedReason || "",
      priority: request.priority,
      adminNote: "",
      isNoteVisibleToCustomer: false
    });
    setShowUpdateModal(true);
  };

  const openDetailsModal = (request: Request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const renderFormData = (data: Record<string,string>, service: Request['service']) => {
    console.log(service)
    if (!data || Object.keys(data).length === 0) {
      return (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📝</div>
          <p className="text-[#0A1D37]/60">هیچ اطلاعات اضافی ارسال نشده است</p>
        </div>
      );
    }

    return Object.entries(data).map(([fieldName, value]) => {
      const displayValue = () => {
        if (value === null || value === undefined || value === '') {
          return <span className="text-[#0A1D37]/40 italic">خالی</span>;
        }
        
        if (Array.isArray(value)) {
          return (
            <div className="flex flex-wrap gap-2">
              {value.map((item, idx) => (
                <span key={idx} className="px-2 py-1 bg-[#4DBFF0]/10 text-[#4DBFF0] rounded-md text-sm">
                  {String(item)}
                </span>
              ))}
            </div>
          );
        }
        
        if (typeof value === 'boolean') {
          return (
            <span className={`px-2 py-1 rounded-md text-sm ${value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {value ? 'بله' : 'خیر'}
            </span>
          );
        }
        
        // Check if it's a file URL
        if (typeof value === 'string' && (value.startsWith('http') || value.includes('amazonaws.com') || value.includes('storage'))) {
          return (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 bg-[#4DBFF0]/10 text-[#4DBFF0] rounded-lg hover:bg-[#4DBFF0]/20 transition-colors text-sm"
                >
                  <span>📁</span>
                  مشاهده فایل
                </a>
                <span className="text-[#0A1D37]/60 text-xs">فایل آپلود شده</span>
              </div>
              
              {/* Image preview if it's an image */}
              {(value.includes('image') || value.match(/\.(jpg|jpeg|png|gif|webp)$/i)) && (
                <div className="mt-2">
                  <img
                    src={value}
                    alt="پیش‌نمایش فایل"
                    className="w-24 h-24 object-cover rounded-lg border border-[#4DBFF0]/30"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          );
        }
        
        return <span className="text-[#0A1D37]">{String(value)}</span>;
      };

      const fieldLabel = fieldName
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace(/([a-z])([A-Z])/g, '$1 $2');

      return (
        <div key={fieldName} className="space-y-2">
          <div className="p-4 bg-gradient-to-br from-white/50 to-white/20 backdrop-blur-sm border border-[#4DBFF0]/30 rounded-xl">
            <label className="flex items-center gap-2 text-[#0A1D37] font-medium mb-3">
              <span className="w-2 h-2 bg-[#4DBFF0] rounded-full"></span>
              {fieldLabel}
            </label>
            
            <div className="min-h-[44px] px-4 py-3 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm border border-[#4DBFF0]/20 rounded-lg flex items-center">
              {displayValue()}
            </div>
          </div>
        </div>
      );
    });
  };

  const getCustomerName = (customer: Request['customer']) => {
    if (!customer?.nationalCredentials) return "نام نامشخص";
    const { firstName, lastName } = customer.nationalCredentials;
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    return "نام نامشخص";
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

  return (
    <div className={`${className} p-6`} dir="rtl">
      {/* Filters */}
      <div className="bg-gradient-to-r from-[#4DBFF0]/10 to-[#FF7A00]/10 backdrop-blur-sm border border-[#4DBFF0]/30 rounded-2xl p-6 mb-6">
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

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 bg-white/80 border border-[#4DBFF0]/30 rounded-xl focus:ring-2 focus:ring-[#4DBFF0] focus:outline-none"
          >
            <option value="">همه اولویت‌ها</option>
            {Object.entries(priorityLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <div className="text-sm text-[#0A1D37]/70 flex items-center font-medium">
            مجموع: {total} درخواست
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4DBFF0] mx-auto mb-4"></div>
            <p className="text-[#0A1D37]/60">در حال بارگذاری...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#4DBFF0]/10 to-[#FF7A00]/10">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[#0A1D37]">شماره درخواست</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[#0A1D37]">سرویس</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[#0A1D37]">مشتری</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[#0A1D37]">وضعیت</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[#0A1D37]">اولویت</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[#0A1D37]">مبلغ</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[#0A1D37]">تاریخ</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[#0A1D37]">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {requests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-sm text-[#4DBFF0]">
                          {request.requestNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {request.service.icon && (
                            <span className="text-xl">{request.service.icon}</span>
                          )}
                          <div>
                            <div className="font-medium text-[#0A1D37]">{request.service.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-[#0A1D37]">
                            {getCustomerName(request.customer)}
                          </div>
                          
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[request.status as keyof typeof statusColors]}`}>
                          {statusLabels[request.status as keyof typeof statusLabels]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[request.priority as keyof typeof priorityColors]}`}>
                          {priorityLabels[request.priority as keyof typeof priorityLabels]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[#0A1D37]">
                          {request.paymentAmount?.toLocaleString('fa-IR')} تومان
                        </div>
                        {request.isPaid && (
                          <div className="text-green-600 text-xs">پرداخت شده</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#0A1D37]/60">
                        {formatDate(request.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openDetailsModal(request)}
                            className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            مشاهده جزئیات
                          </button>
                          <button
                            onClick={() => openUpdateModal(request)}
                            className="px-3 py-2 bg-gradient-to-r from-[#4DBFF0] to-[#FF7A00] text-white text-sm rounded-lg hover:shadow-lg transition-all"
                          >
                            ویرایش وضعیت
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
                <div className="text-sm text-[#0A1D37]/60">
                  صفحه {currentPage} از {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                  >
                    قبلی
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                  >
                    بعدی
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Update Modal */}
      {showUpdateModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className={`text-xl ${estedadBold.className} text-[#0A1D37]`}>
                ویرایش درخواست {selectedRequest.requestNumber}
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                  وضعیت
                </label>
                <select
                  value={updateForm.status}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4DBFF0] focus:outline-none"
                >
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                  اولویت
                </label>
                <select
                  value={updateForm.priority}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4DBFF0] focus:outline-none"
                >
                  {Object.entries(priorityLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Rejection Reason */}
              {updateForm.status === 'rejected' && (
                <div>
                  <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                    دلیل رد
                  </label>
                  <textarea
                    value={updateForm.rejectedReason}
                    onChange={(e) => setUpdateForm(prev => ({ ...prev, rejectedReason: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4DBFF0] focus:outline-none"
                    rows={3}
                    placeholder="دلیل رد درخواست را وارد کنید..."
                  />
                </div>
              )}

              {/* Admin Note */}
              <div>
                <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                  یادداشت مدیریتی
                </label>
                <textarea
                  value={updateForm.adminNote}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, adminNote: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4DBFF0] focus:outline-none"
                  rows={3}
                  placeholder="یادداشت اختیاری..."
                />
                <div className="mt-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={updateForm.isNoteVisibleToCustomer}
                      onChange={(e) => setUpdateForm(prev => ({ ...prev, isNoteVisibleToCustomer: e.target.checked }))}
                      className="rounded border-gray-300 text-[#4DBFF0] focus:ring-[#4DBFF0]"
                    />
                    <span className="mr-2 text-sm text-[#0A1D37]/70">
                      قابل مشاهده برای مشتری
                    </span>
                  </label>
                </div>
              </div>

              {/* Existing Notes */}
              {selectedRequest.adminNotes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-[#0A1D37] mb-2">
                    یادداشت‌های قبلی
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedRequest.adminNotes.map((note, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-[#0A1D37]">{note.note}</div>
                        <div className="text-xs text-[#0A1D37]/60 mt-1">
                          {formatDate(note.addedAt)} - {note.isVisibleToCustomer ? 'مشاهده مشتری' : 'داخلی'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t flex gap-4 justify-end">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 text-[#0A1D37] border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                لغو
              </button>
              <button
                onClick={handleUpdateRequest}
                disabled={updating}
                className="px-6 py-2 bg-gradient-to-r from-[#4DBFF0] to-[#FF7A00] text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
              >
                {updating ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b bg-gradient-to-r from-[#4DBFF0]/10 to-[#FF7A00]/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-xl ${estedadBold.className} text-[#0A1D37]`}>
                    جزئیات درخواست {selectedRequest.requestNumber}
                  </h2>
                  <p className="text-[#0A1D37]/70 text-sm mt-1">
                    سرویس: {selectedRequest.service.title}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-[#0A1D37]/60 hover:text-[#0A1D37] text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Customer Information */}
              <div className="mb-6">
                <h3 className={`text-lg ${estedadBold.className} text-[#0A1D37] mb-4`}>
                  اطلاعات مشتری
                </h3>
                <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium text-[#0A1D37]">نام:</span>
                    <span className="mr-2 text-[#0A1D37]/80">
                      {getCustomerName(selectedRequest.customer)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-[#0A1D37]">موبایل:</span>
                    <span className="mr-2 text-[#0A1D37]/80">
                      {selectedRequest.customer.contactInfo.mobilePhone}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-[#0A1D37]">ایمیل:</span>
                    <span className="mr-2 text-[#0A1D37]/80">
                      {selectedRequest.customer.contactInfo.email}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-[#0A1D37]">تاریخ درخواست:</span>
                    <span className="mr-2 text-[#0A1D37]/80">
                      {formatDate(selectedRequest.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Request Status */}
              <div className="mb-6">
                <h3 className={`text-lg ${estedadBold.className} text-[#0A1D37] mb-4`}>
                  وضعیت درخواست
                </h3>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusColors[selectedRequest.status as keyof typeof statusColors]}`}>
                    {statusLabels[selectedRequest.status as keyof typeof statusLabels]}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${priorityColors[selectedRequest.priority as keyof typeof priorityColors]}`}>
                    اولویت: {priorityLabels[selectedRequest.priority as keyof typeof priorityLabels]}
                  </span>
                  {selectedRequest.isPaid && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      پرداخت شده: {selectedRequest.paymentAmount?.toLocaleString('fa-IR')} تومان
                    </span>
                  )}
                </div>
              </div>

              {/* User Submitted Form Data */}
              <div className="mb-6">
                <h3 className={`text-lg ${estedadBold.className} text-[#0A1D37] mb-4`}>
                  اطلاعات ارسالی کاربر
                </h3>
                <div className="space-y-3 max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  {renderFormData(selectedRequest.data, selectedRequest.service)}
                </div>
              </div>

              {/* Admin Notes */}
              {selectedRequest.adminNotes.length > 0 && (
                <div className="mb-6">
                  <h3 className={`text-lg ${estedadBold.className} text-[#0A1D37] mb-4`}>
                    یادداشت‌های مدیریتی
                  </h3>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {selectedRequest.adminNotes.map((note, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${note.isVisibleToCustomer ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="text-sm text-[#0A1D37]">{note.note}</div>
                          <span className={`text-xs px-2 py-1 rounded-full ${note.isVisibleToCustomer ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                            {note.isVisibleToCustomer ? 'قابل مشاهده مشتری' : 'داخلی'}
                          </span>
                        </div>
                        <div className="text-xs text-[#0A1D37]/60">
                          {formatDate(note.addedAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Box - Admin Controls */}
              <div className="bg-gradient-to-r from-[#4DBFF0]/5 to-[#FF7A00]/5 border border-[#4DBFF0]/20 rounded-lg p-4">
                <h3 className={`text-lg ${estedadBold.className} text-[#0A1D37] mb-4`}>
                  عملیات مدیریتی
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      openUpdateModal(selectedRequest);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-[#4DBFF0] to-[#FF7A00] text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    تغییر وضعیت
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      openUpdateModal(selectedRequest);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    افزودن یادداشت
                  </button>
                  {selectedRequest.status === 'rejected' && (
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        openUpdateModal(selectedRequest);
                      }}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      ویرایش دلیل رد
                    </button>
                  )}
                </div>
                
                {/* Checkbox Explanation */}
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="text-yellow-600 mt-0.5">ℹ️</div>
                    <div>
                      <div className="font-medium text-yellow-800 text-sm">
                        درباره چک‌باکس قابل مشاهده برای مشتری:
                      </div>
                      <div className="text-yellow-700 text-xs mt-1 leading-relaxed">
                        • <strong>فعال:</strong> یادداشت برای مشتری نمایش داده می‌شود و او آن را در پنل خود خواهد دید
                        <br />
                        • <strong>غیرفعال:</strong> یادداشت فقط برای مدیران قابل مشاهده است و مشتری آن را نمی‌بیند
                        <br />
                        • از این ویژگی برای ارسال پیام به مشتری یا نگهداری یادداشت‌های داخلی استفاده کنید
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2 bg-white border border-gray-300 text-[#0A1D37] rounded-xl hover:bg-gray-50 transition-colors"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}