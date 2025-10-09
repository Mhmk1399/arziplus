"use client";
import React, { useState } from "react";
import {
  ServiceBuilderFormData,
  DynamicService,
} from "@/types/serviceBuilder/types";
import ServiceBuilder from "./ServiceBuilder";
import ServiceList from "./ServiceList";
import { useDynamicData } from "@/hooks/useDynamicData";
import { showToast } from "@/utilities/toast";

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
      console.error("Error creating service:", error);
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
      console.error("Error updating service:", error);
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
              <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-white/20 via-white/10 to-white/5 backdrop-blur-sm border border-white/30 shadow-lg text-white/90 relative z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-[#4DBFF0]/10 to-[#FF7A00]/10 rounded-full group-hover/badge:from-[#4DBFF0]/20 group-hover/badge:to-[#FF7A00]/20 transition-all duration-300"></div>
                <span className="relative flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#4DBFF0] to-[#FF7A00] rounded-full animate-pulse"></div>
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
            <div className="absolute inset-0 bg-gradient-to-r from-[#4DBFF0]/5 via-[#FF7A00]/5 to-[#0A1D37]/5 blur-xl -z-10"></div>
          </h1>

          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
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
      <ServiceBuilder
        onSave={handleCreateService}
        onCancel={handleCancel}
        isEditing={false}
      />
    );
  }

  if (currentView === "edit" && selectedService) {
    return (
      <ServiceBuilder
        initialData={selectedService}
        onSave={handleUpdateService}
        onCancel={handleCancel}
        isEditing={true}
      />
    );
  }

  // Default list view with admin controls
  return (
    <div className={`w-full relative ${className}`}>
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

            <h1
              className="text-4xl font-black mb-3 relative"
              style={{
                textShadow: "0 4px 20px rgba(0,0,0,0.1)",
                background:
                  "linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              مدیریت سرویس‌ها
              <div className="absolute inset-0 bg-gradient-to-r from-[#4DBFF0]/5 via-[#FF7A00]/5 to-[#0A1D37]/5 blur-xl -z-10"></div>
            </h1>

            <p className="text-white/70 text-lg">
              ایجاد، ویرایش و مدیریت سرویس‌های پویا
            </p>
          </div>

          <button
            onClick={() => setCurrentView("create")}
            className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] text-white font-bold rounded-2xl hover:from-[#FF7A00]/80 hover:to-[#4DBFF0]/80 transition-all duration-500 shadow-xl hover:shadow-[#FF7A00]/30 border border-white/10 backdrop-blur-sm transform-gpu perspective-1000"
          >
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>

            {/* Luxury Glow Effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            {/* Content */}
            <span className="relative flex items-center justify-center gap-3 z-10">
              <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                +
              </span>
              <span className="tracking-wide">ایجاد سرویس جدید</span>

              {/* Arrow Icon */}
              <svg
                className="w-5 h-5 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>

            {/* Bottom Highlight */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          </button>
        </div>

        {/* Enhanced Filter tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            {
              key: "all",
              label: "همه",
              icon: "📋",
              color: "from-gray-500/20 to-gray-600/20",
            },
            {
              key: "active",
              label: "فعال",
              icon: "✅",
              color: "from-green-500/20 to-emerald-600/20",
            },
            {
              key: "draft",
              label: "پیش‌نویس",
              icon: "📝",
              color: "from-yellow-500/20 to-orange-600/20",
            },
            {
              key: "inactive",
              label: "غیرفعال",
              icon: "❌",
              color: "from-red-500/20 to-red-600/20",
            },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`group relative px-6 py-3 bg-gradient-to-r ${tab.color} backdrop-blur-sm border border-white/20 text-white/80 hover:text-white rounded-xl transition-all duration-300 hover:shadow-lg overflow-hidden`}
            >
              {/* Hover Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Content */}
              <span className="relative flex items-center gap-2 font-medium">
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </span>

              {/* Bottom Border */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </button>
          ))}
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

  const handleDelete = async (service: DynamicService) => {
    if (!confirm("آیا از حذف این سرویس اطمینان دارید؟")) {
      return;
    }

    try {
      const response = await fetch(`/api/dynamicServices?id=${service._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showToast.service.deleted(service.title);
        mutate();
      } else {
        showToast.error("خطا در حذف سرویس");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
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
      console.error("Error toggling status:", error);
      showToast.error("خطا در تغییر وضعیت");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/70"></div>
        <span className="mr-3 text-white/70">در حال بارگذاری...</span>
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
          className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {service.icon && <span className="text-2xl">{service.icon}</span>}
              <div>
                <h3 className="text-white font-medium text-lg">
                  {service.title}
                </h3>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-white/60 text-sm">
                    {/* {service?.fee.toLocaleString('fa-IR')} تومان */}
                  </span>
                  <span className="text-white/60 text-sm">
                    {service.fields.length} فیلد
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      service.status === "active"
                        ? "bg-green-500/20 text-green-300"
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
                className="px-3 py-1 bg-blue-600/20 text-blue-300 border border-blue-400/30 rounded-lg hover:bg-blue-600/30 transition-colors text-sm"
              >
                ویرایش
              </button>
              <button
                onClick={() => toggleStatus(service)}
                className={`px-3 py-1 rounded-lg transition-colors text-sm ${
                  service.status === "active"
                    ? "bg-yellow-600/20 text-yellow-300 border border-yellow-400/30 hover:bg-yellow-600/30"
                    : "bg-green-600/20 text-green-300 border border-green-400/30 hover:bg-green-600/30"
                }`}
              >
                {service.status === "active" ? "غیرفعال کردن" : "فعال کردن"}
              </button>
              <button
                onClick={() => handleDelete(service)}
                className="px-3 py-1 bg-red-600/20 text-red-300 border border-red-400/30 rounded-lg hover:bg-red-600/30 transition-colors text-sm"
              >
                حذف
              </button>
            </div>
          </div>

          {service.description && (
            <p className="text-white/60 text-sm mt-2 pr-12">
              {service.description}
            </p>
          )}
        </div>
      ))}

      {services.length === 0 && (
        <div className="text-center py-12 text-white/50">
          هیچ سرویسی یافت نشد
        </div>
      )}
    </div>
  );
};

export default ServiceManager;
