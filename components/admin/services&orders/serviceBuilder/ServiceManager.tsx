"use client";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  ServiceBuilderFormData,
  DynamicService,
} from "@/types/serviceBuilder/types";
import ServiceBuilder from "./ServiceBuilder";
import ServiceList from "./ServiceList";
import { useDynamicData } from "@/hooks/useDynamicData";
import { showToast } from "@/utilities/toast";
import FileUploaderModal from "@/components/FileUploaderModal";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaExclamationTriangle,
  FaLayerGroup,
  FaDollarSign,
  FaEye,
  FaTimes,
} from "react-icons/fa";

interface ServiceManagerProps {
  mode?: "admin" | "user";
  className?: string;
}

const ServiceManager: React.FC<ServiceManagerProps> = ({
  mode,
  className = "",
}) => {
  const [currentView, setCurrentView] = useState<"list" | "create" | "edit">(
    "list"
  );
  const [selectedService, setSelectedService] = useState<DynamicService | null>(
    null
  );
  const [isFileUploaderOpen, setIsFileUploaderOpen] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");

  const { mutate } = useDynamicData({
    endpoint: "/api/dynamicServices",
    page: 1,
    limit: 50,
  });

  const handleCreateService = async (data: ServiceBuilderFormData) => {
    try {
      const response = await fetch("/api/dynamicServices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create service");
      }

      const result = await response.json();
      if (result.success) {
        showToast.service.created(data.title);
        setCurrentView("list");
        mutate();
      } else {
        throw new Error(result.message || "Failed to create service");
      }
    } catch (error) {
      console.log("Error creating service:", error);
      throw error;
    }
  };

  const handleUpdateService = async (data: ServiceBuilderFormData) => {
    if (!selectedService?._id) return;

    try {
      const response = await fetch("/api/dynamicServices", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedService._id,
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update service");
      }

      const result = await response.json();
      if (result.success) {
        showToast.service.updated(data.title);
        setCurrentView("list");
        setSelectedService(null);
        mutate();
      } else {
        throw new Error(result.message || "Failed to update service");
      }
    } catch (error) {
      console.log("Error updating service:", error);
      throw error;
    }
  };

  const handleEditService = (service: DynamicService) => {
    setSelectedService(service);
    setCurrentView("edit");
  };

  const handleCancel = () => {
    setCurrentView("list");
    setSelectedService(null);
    setUploadedImageUrl("");
  };

  const handleFileUploaded = (fileUrl: string) => {
    setUploadedImageUrl(fileUrl);
    setIsFileUploaderOpen(false);
    showToast.success("تصویر با موفقیت آپلود شد!");
  };

  if (mode === "user") {
    return (
      <div className={`w-full relative ${className}`}>
        {/* Enhanced User Header */}
        <div className="mb-8 sm:mb-12">
          {/* Decorative Background */}
          <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-blue-50 via-indigo-50/50 to-transparent -z-10 rounded-3xl" />

          <div className="text-center relative">
            {/* Badge */}
            <div className="mb-6 flex justify-center">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                <span className="relative inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  سرویس‌های ویژه
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="mb-4 text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900">
              سرویس‌های موجود
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-4">
              سرویس مورد نظر خود را انتخاب کرده و درخواست دهید
            </p>

            {/* Decorative Line */}
            <div className="mt-8 flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full" />
            </div>
          </div>
        </div>

        <ServiceList
          filterStatus="active"
          showAsCards={true}
          className={className}
        />
      </div>
    );
  }

  // Admin mode - full management interface
  if (currentView === "create") {
    return (
      <>
        <ServiceBuilder
          onSave={handleCreateService}
          onCancel={handleCancel}
          isEditing={false}
          onImageUploadClick={() => setIsFileUploaderOpen(true)}
          uploadedImageUrl={uploadedImageUrl}
        />
        <FileUploaderModal
          isOpen={isFileUploaderOpen}
          onClose={() => setIsFileUploaderOpen(false)}
          onFileUploaded={handleFileUploaded}
          acceptedTypes={[".jpg", ".jpeg", ".png", ".gif", ".webp"]}
          title="آپلود تصویر سرویس"
        />
      </>
    );
  }

  if (currentView === "edit" && selectedService) {
    return (
      <>
        <ServiceBuilder
          initialData={selectedService}
          onSave={handleUpdateService}
          onCancel={handleCancel}
          isEditing={true}
          onImageUploadClick={() => setIsFileUploaderOpen(true)}
          uploadedImageUrl={uploadedImageUrl}
        />
        <FileUploaderModal
          isOpen={isFileUploaderOpen}
          onClose={() => setIsFileUploaderOpen(false)}
          onFileUploaded={handleFileUploaded}
          acceptedTypes={[".jpg", ".jpeg", ".png", ".gif", ".webp"]}
          title="آپلود تصویر سرویس"
        />
      </>
    );
  }

  // Default list view with admin controls
  return (
    <div className={`w-full relative ${className} max-w-7xl mx-auto`} dir="rtl">
      {/* Background Decoration */}
 
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl  overflow-hidden">
        {/* Enhanced Header */}
        <div className="  px-6 sm:px-8 py-2">
          <div className="flex  justify-end gap-4">
            <button
              onClick={() => setCurrentView("create")}
              className="group relative w-full sm:w-auto border flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <FaPlus className="text-sm group-hover:rotate-90 transition-transform duration-300" />
              <span>ایجاد سرویس جدید</span>
            </button>
          </div>
        </div>

        {/* Service List */}
        <div className="p-4 sm:p-6 lg:p-8">
          <AdminServiceList onEdit={handleEditService} />
        </div>
      </div>
    </div>
  );
};

// Enhanced Admin Service List
const AdminServiceList: React.FC<{
  onEdit: (service: DynamicService) => void;
}> = ({ onEdit }) => {
  const [filterStatus, setFilterStatus] = useState<
    "active" | "inactive" | "draft" | "all"
  >("all");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    service: DynamicService | null;
  }>({ isOpen: false, service: null });

  const {
    data: services,
    loading,
    error,
    mutate,
  } = useDynamicData({
    endpoint: "/api/dynamicServices",
    filters: filterStatus !== "all" ? { status: filterStatus } : {},
    page: 1,
    limit: 50,
  });

  const handleDelete = async () => {
    if (!deleteModal.service) return;

    try {
      const response = await fetch(
        `/api/dynamicServices?id=${deleteModal.service._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        showToast.service.deleted(deleteModal.service.title);
        mutate();
        setDeleteModal({ isOpen: false, service: null });
      } else {
        showToast.error("خطا در حذف سرویس");
      }
    } catch (error) {
      console.log("Error deleting service:", error);
      showToast.error("خطا در حذف سرویس");
    }
  };

  const toggleStatus = async (service: DynamicService) => {
    const newStatus = service.status === "active" ? "inactive" : "active";

    try {
      const response = await fetch("/api/dynamicServices", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: service._id,
          status: newStatus,
        }),
      });

      if (response.ok) {
        showToast.service.statusChanged(service.title, newStatus);
        mutate();
      } else {
        showToast.error("خطا در تغییر وضعیت");
      }
    } catch (error) {
      console.log("Error toggling status:", error);
      showToast.error("خطا در تغییر وضعیت");
    }
  };

  // Filter Buttons
  const filters = [
    { id: "all", label: "همه", count: services.length },
    {
      id: "active",
      label: "فعال",
      count: services.filter((s: DynamicService) => s.status === "active")
        .length,
    },
    {
      id: "inactive",
      label: "غیرفعال",
      count: services.filter((s: DynamicService) => s.status === "inactive")
        .length,
    },
    {
      id: "draft",
      label: "پیش‌نویس",
      count: services.filter((s: DynamicService) => s.status === "draft")
        .length,
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse" />
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        </div>
        <p className="mt-4 text-gray-600 font-medium">
          در حال بارگذاری سرویس‌ها...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <FaExclamationTriangle className="text-red-500 text-2xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          خطا در بارگذاری
        </h3>
        <p className="text-gray-600 text-center">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 sm:gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setFilterStatus(filter.id as "active" | "inactive" | "draft" | "all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
              filterStatus === filter.id
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <span>{filter.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                filterStatus === filter.id ? "bg-white/20" : "bg-gray-200"
              }`}
            >
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 gap-4">
        {services.map((service: DynamicService) => (
          <div
            key={service._id}
            className="group relative bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 hover:border-blue-300 p-4 sm:p-6 transition-all duration-300 hover:shadow-xl"
          >
            {/* Status Indicator */}
            <div className="absolute lg:bottom-4 top-4 left-4">
              <div
                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  service.status === "active"
                    ? "bg-green-100 text-green-700"
                    : service.status === "draft"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    service.status === "active"
                      ? "bg-green-500 animate-pulse"
                      : service.status === "draft"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                />
                {service.status === "active"
                  ? "فعال"
                  : service.status === "draft"
                  ? "پیش‌نویس"
                  : "غیرفعال"}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mt-8 sm:mt-0">
              {/* Service Info */}
              <div className="flex-1 space-y-3">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>

               

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                    <FaDollarSign className="text-blue-600 text-sm" />
                    <span className="text-sm font-semibold text-blue-900">
                      {service?.fee.toLocaleString("fa-IR")} تومان
                    </span>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg">
                    <FaLayerGroup className="text-purple-600 text-sm" />
                    <span className="text-sm font-semibold text-purple-900">
                      {service.fields.length} فیلد
                    </span>
                  </div>

                  {service.category && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg">
                      <span className="text-sm font-semibold text-indigo-900">
                        {service.category}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex  items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => onEdit(service)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  title="ویرایش"
                >
                  <FaEdit className="text-sm" />
                  <span className="text-sm font-medium">ویرایش</span>
                </button>

                <button
                  onClick={() => toggleStatus(service)}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl ${
                    service.status === "active"
                      ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                  title={
                    service.status === "active" ? "غیرفعال کردن" : "فعال کردن"
                  }
                >
                  {service.status === "active" ? (
                    <>
                      <FaToggleOff className="text-sm" />
                      <span className="text-sm font-medium hidden sm:inline">
                        غیرفعال
                      </span>
                    </>
                  ) : (
                    <>
                      <FaToggleOn className="text-sm" />
                      <span className="text-sm font-medium hidden sm:inline">
                        فعال
                      </span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setDeleteModal({ isOpen: true, service })}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  title="حذف"
                >
                  <FaTrash className="text-sm" />
                  <span className="text-sm font-medium hidden sm:inline">
                    حذف
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {services.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FaEye className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            هیچ سرویسی یافت نشد
          </h3>
          <p className="text-gray-600 text-center mb-6">
            در حال حاضر سرویسی با فیلتر انتخابی وجود ندارد
          </p>
          {filterStatus !== "all" && (
            <button
              onClick={() => setFilterStatus("all")}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              مشاهده همه سرویس‌ها
            </button>
          )}
        </div>
      )}

      {/* Enhanced Delete Modal */}
      {deleteModal.isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
            dir="rtl"
            onClick={() => setDeleteModal({ isOpen: false, service: null })}
          >
            <div
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl transform animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle className="text-red-600 text-2xl" />
              </div>

              {/* Content */}
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 text-center">
                تایید حذف سرویس
              </h3>
              <p className="text-gray-600 mb-2 text-center">
                آیا از حذف سرویس زیر اطمینان دارید؟
              </p>
              <p className="text-lg font-bold text-gray-900 mb-6 text-center">
                {deleteModal.service?.title}
              </p>

              {/* Warning */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-red-800 text-center">
                  ⚠️ این عملیات قابل بازگشت نیست
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() =>
                    setDeleteModal({ isOpen: false, service: null })
                  }
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <FaTimes className="text-sm" />
                  <span>انصراف</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  <FaTrash className="text-sm" />
                  <span>حذف قطعی</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default ServiceManager;
