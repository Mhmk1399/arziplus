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
        mutate(); // Refresh the data
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
        mutate(); // Refresh the data
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
    // User mode - only show service list for ordering
    return (
      <div className={`w-full relative ${className}`}>
        {/* Enhanced Header */}
        <div className="mb-8 text-center">
          {/* Badge */}
          <div className="mb-6 flex justify-center">
            <div className="relative group/badge">
              <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-white/20 via-white/10 to-white/5 backdrop-blur-sm border border-white/30 shadow-lg text-[#0A1D37]/90 relative z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4DBFF0]/10 to-[#0A1D37]/10 rounded-full group-hover/badge:from-[#4DBFF0]/20 group-hover/badge:to-[#0A1D37]/20 transition-all duration-300"></div>
                <span className="relative flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#4DBFF0] to-[#0A1D37] rounded-full animate-pulse"></div>
                  سرویس‌های ویژه
                </span>
              </span>
            </div>
          </div>

          <h1
            className="mb-4 text-4xl md:text-5xl leading-tight font-black text-center relative"
            style={{
              textShadow: "0 4px 20px rgba(0,0,0,0.1)",
              background:
                "linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            سرویس‌های موجود
            <div className="absolute inset-0 bg-gradient-to-r from-[#4DBFF0]/5 via-[#0A1D37]/5 to-[#0A1D37]/5 blur-xl -z-10"></div>
          </h1>

          <p className="text-[#0A1D37]/70 text-lg max-w-2xl mx-auto leading-relaxed">
            سرویس مورد نظر خود را انتخاب کرده و درخواست دهید
          </p>
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
    <div className={`w-full relative ${className}`} dir="rtl">
      <div
        className="bg-gradient-to-br from-white/15 via-white/8 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 shadow-2xl"
        style={{
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            {/* Badge */}

            <h1 className="md:text-4xl text-base font-black text-[#0A1D37]  relative">
              مدیریت سرویس‌ها
            </h1>
          </div>

          <button
            onClick={() => setCurrentView("create")}
            className="group relative overflow-hidden text-sm p-2 md:px-8 md:py-4 border-[#4DBFF0] text-[#0A1D37] font-bold rounded-md transition-all duration-500 shadow-xl  border hover:bg-[#0A1D37]/10 backdrop-blur-sm transform-gpu perspective-1000"
          >
            {/* Content */}
            <span className="relative flex items-center justify-center gap-3 z-10">
              <span className="tracking-wide">ایجاد سرویس جدید</span>
            </span>
          </button>
        </div>

        <AdminServiceList onEdit={handleEditService} />
      </div>
    </div>
  );
};

// Admin service list with edit functionality
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
  console.log(setFilterStatus);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/70"></div>
        <span className="mr-3 text-[#0A1D37]/70">در حال بارگذاری...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-400">
        خطا در بارگذاری سرویس‌ها: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4" dir="rtl">
      {services.map((service: DynamicService) => (
        <div
          key={service._id}
          className="bg-white/5 border border-[#4DBFF0] rounded-md p-4 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h3 className="text-[#0A1D37] font-medium text-lg">
                  {service.title}
                </h3>
                <div className="flex items-center gap-4 mt-1 border border-[#4DBFF0] p-2 rounded-md">
                  <span className="text-[#0A1D37]/60 text-sm">
                    {service?.fee.toLocaleString("fa-IR")} تومان
                  </span>
                  <span className="text-[#0A1D37]/60 text-sm">
                    {service.fields.length} فیلد
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      service.status === "active"
                        ? "bg-green-500/20 text-gray-700"
                        : service.status === "draft"
                        ? "bg-yellow-500/20 text-yellow-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {service.status === "active"
                      ? "فعال"
                      : service.status === "draft"
                      ? "پیش‌نویس"
                      : "غیرفعال"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(service)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                title="ویرایش"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={() => toggleStatus(service)}
                className={`p-2 rounded-md transition-colors ${
                  service.status === "active"
                    ? "text-yellow-600 hover:bg-yellow-50"
                    : "text-green-600 hover:bg-green-50"
                }`}
                title={
                  service.status === "active" ? "غیرفعال کردن" : "فعال کردن"
                }
              >
                {service.status === "active" ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setDeleteModal({ isOpen: true, service })}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="حذف"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}

      {services.length === 0 && (
        <div className="text-center py-12 text-[#0A1D37]/50">
          هیچ سرویسی یافت نشد
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            dir="rtl"
          >
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-bold text-[#0A1D37] mb-4">
                تایید حذف
              </h3>
              <p className="text-[#0A1D37]/70 mb-6">
                آیا از حذف سرویس {deleteModal.service?.title} اطمینان دارید؟
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() =>
                    setDeleteModal({ isOpen: false, service: null })
                  }
                  className="px-4 py-2 bg-gray-200 text-[#0A1D37] rounded-lg hover:bg-gray-300 transition-colors"
                >
                  انصراف
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  حذف
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
