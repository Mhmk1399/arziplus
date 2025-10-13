"use client";
import React, { useState, useEffect } from "react";
import { DynamicService } from "@/types/serviceBuilder/types";

interface ServiceListProps {
  onServiceSelect?: (service: DynamicService) => void;
  showAsCards?: boolean;
  filterStatus?: "active" | "inactive" | "draft" | "all";
  className?: string;
}

const ServiceList: React.FC<ServiceListProps> = ({
  onServiceSelect,
  showAsCards = true,
  filterStatus = "active",
  className = "",
}) => {
  const [services, setServices] = useState<DynamicService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<DynamicService | null>(
    null
  );

  useEffect(() => {
    fetchServices();
  }, [filterStatus]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== "all") {
        params.append("status", filterStatus);
      }

      const response = await fetch(`/api/dynamicServices?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }

      const data = await response.json();
      if (data.success) {
        setServices(data.data);
      } else {
        throw new Error(data.message || "Failed to load services");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleServiceClick = (service: DynamicService) => {
    if (onServiceSelect) {
      onServiceSelect(service);
    } else {
      setSelectedService(service);
    }
  };

  const handleBackToList = () => {
    setSelectedService(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/70"></div>
        <span className="mr-3 text-[#0A1D37]/70">
          در حال بارگذاری سرویس‌ها...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">خطا در بارگذاری سرویس‌ها</div>
        <button
          onClick={fetchServices}
          className="px-4 py-2 bg-blue-600 text-[#0A1D37] rounded-lg hover:bg-blue-700 transition-colors"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  // Show selected service form
  if (selectedService) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 text-[#0A1D37]/70 hover:text-[#0A1D37] transition-colors"
          >
            ← بازگشت به لیست سرویس‌ها
          </button>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-[#0A1D37]/50 mb-4">هیچ سرویسی یافت نشد</div>
        <p className="text-[#0A1D37]/30 text-sm">
          {filterStatus === "active"
            ? "سرویس فعالی موجود نیست"
            : "سرویسی در این وضعیت موجود نیست"}
        </p>
      </div>
    );
  }

  if (!showAsCards) {
    // Simple list view
    return (
      <div className={`space-y-4 ${className}`}>
        {services.map((service) => (
          <div
            key={service._id}
            onClick={() => handleServiceClick(service)}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/15 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {service.icon && (
                  <span className="text-2xl">{service.icon}</span>
                )}
                <div>
                  <h3 className="text-[#0A1D37] font-medium">
                    {service.title}
                  </h3>
                  {service.description && (
                    <p className="text-[#0A1D37]/60 text-sm mt-1">
                      {service.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-left">
                <div className="text-[#0A1D37] font-medium">
                  {service.fee.toLocaleString("fa-IR")} تومان
                </div>
                <div
                  className={`text-xs px-2 py-1 rounded-full mt-1 ${
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
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Card view
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
      dir="rtl"
    >
      {services.map((service) => (
        <div
          key={service._id}
          onClick={() => handleServiceClick(service)}
          className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden hover:bg-white/15 hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          {service.image && (
            <div className="aspect-video overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          )}

          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {service.icon && (
                  <span className="text-2xl">{service.icon}</span>
                )}
                <h3 className="text-[#0A1D37] font-semibold text-lg group-hover:text-purple-200 transition-colors">
                  {service.title}
                </h3>
              </div>

              <div
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
              </div>
            </div>

            {service.description && (
              <p className="text-[#0A1D37]/60 text-sm mb-4 line-clamp-2">
                {service.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="text-[#0A1D37] font-bold text-lg">
                {service.fee.toLocaleString("fa-IR")} تومان
              </div>

              <div className="flex items-center gap-2 text-xs text-[#0A1D37]/50">
                <span>{service.fields.length} فیلد</span>
                {service.wallet && (
                  <span className="bg-purple-500/20 px-2 py-1 rounded-full text-purple-300">
                    کیف پول
                  </span>
                )}
              </div>
            </div>

            <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-purple-600/50 to-violet-600/50 border border-purple-400/30 text-[#0A1D37] rounded-lg hover:from-purple-600 hover:to-violet-600 transition-all duration-300 group-hover:shadow-lg">
              مشاهده و سفارش
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceList;
