"use client";

import React, { useState, useEffect } from "react";
import { ServiceField } from "@/types/serviceBuilder/types";
import { showToast } from "@/utilities/toast";
import FileUploaderModal from "@/components/FileUploaderModal";

// Extended ServiceField interface to handle both options and items (backward compatibility)
interface ExtendedServiceField extends ServiceField {
  items?: Array<{
    key: string;
    value: string;
  }>;
}

interface Service {
  _id: string;
  title: string;
  slug: string;
  fee: number;
  wallet: boolean;
  description?: string;
  icon?: string;
  image?: string;
  status: string;
  fields: ExtendedServiceField[];
}

interface ServiceRendererProps {
  serviceId?: string; // If provided, render only this service
  services?: Service[]; // If provided, render these services
  onRequestSubmit?: (requestData: any) => void;
  customerId?: string; // Current user ID
  customerEmail?: string;
  customerName?: string;
}

const ServiceRenderer: React.FC<ServiceRendererProps> = ({
  serviceId,
  services: propServices,
  onRequestSubmit,
  customerId,
  customerEmail,
  customerName,
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [currentFileField, setCurrentFileField] = useState<string | null>(null);

  useEffect(() => {
    if (propServices) {
      setServices(propServices);
    } else {
      fetchServices();
    }
  }, [propServices, serviceId]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const url = serviceId
        ? `/api/dynamicServices?id=${serviceId}`
        : "/api/dynamicServices?status=active";
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setServices(serviceId ? [data.data] : data.data);
      } else {
        showToast.error("Failed to fetch services");
      }
    } catch (error) {
      showToast.error("Error fetching services");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setFormData({});
  };

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleFileUploadClick = (fieldName: string) => {
    setCurrentFileField(fieldName);
    setIsFileModalOpen(true);
  };

  const handleFileUploaded = (fileUrl: string) => {
    if (currentFileField) {
      handleInputChange(currentFileField, fileUrl);
      setCurrentFileField(null);
    }
    setIsFileModalOpen(false);
    showToast.success("فایل با موفقیت آپلود شد!");
  };

  const shouldShowField = (field: ExtendedServiceField): boolean => {
    if (!field.showIf) return true;

    const conditionValue = formData[field.showIf.field];
    return conditionValue === field.showIf.value;
  };

  const validateForm = (): boolean => {
    if (!selectedService) return false;

    const visibleFields = selectedService.fields.filter(shouldShowField);
    const requiredFields = visibleFields.filter((field) => field.required);

    for (const field of requiredFields) {
      if (!formData[field.name] || formData[field.name] === "") {
        showToast.error(`فیلد ${field.label || field.name} الزامی است`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService || !customerId) {
      showToast.error("Service selection and customer login required");
      return;
    }

    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const requestData = {
        service: selectedService._id,
        data: formData,
        customer: customerId,
        customerEmail,
        customerName,
      };

      if (onRequestSubmit) {
        await onRequestSubmit(requestData);
      } else {
        // Default API call
        const response = await fetch("/api/service-requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        });

        const result = await response.json();

        if (result.success) {
          showToast.service.requestSubmitted(selectedService.title);
          setSelectedService(null);
          setFormData({});
        } else {
          showToast.error(result.message || "Failed to submit request");
        }
      }
    } catch (error) {
      showToast.error("Error submitting request");
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: ExtendedServiceField) => {
    if (!shouldShowField(field)) return null;

    const value = formData[field.name] || "";

    const baseInputClasses = `
      w-full px-4 py-3 
      bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm 
      border border-[#4DBFF0] rounded-xl
      text-[#0A1D37] placeholder-[#0A1D37]/50
      focus:outline-none focus:ring-2 focus:ring-[#4DBFF0]/50 focus:border-[#4DBFF0]/50
      transition-all duration-300
    `;

    const renderInput = () => {
      switch (field.type) {
        case "string":
        case "email":
        case "password":
        case "tel":
          return (
            <input
              type={field.type === "string" ? "text" : field.type}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className={baseInputClasses}
              required={field.required}
            />
          );

        case "number":
          return (
            <input
              type="number"
              value={value}
              onChange={(e) =>
                handleInputChange(field.name, parseFloat(e.target.value) || "")
              }
              placeholder={field.placeholder}
              className={baseInputClasses}
              required={field.required}
            />
          );

        case "textarea":
          return (
            <textarea
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className={`${baseInputClasses} resize-none`}
              required={field.required}
            />
          );

        case "select":
          return (
            <select
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={baseInputClasses}
              required={field.required}
            >
              <option value="">انتخاب کنید</option>
              {[...(field.options || []), ...(field.items || [])].map(
                (option, index) => (
                  <option
                    key={index}
                    value={option.key}
                    className="bg-white text-[#0A1D37]"
                  >
                    {option.value}
                  </option>
                )
              )}
            </select>
          );

        case "multiselect":
          return (
            <div className="space-y-2">
              {[...(field.options || []), ...(field.items || [])].map(
                (option, index) => (
                  <label
                    key={index}
                    className="flex items-center space-x-reverse space-x-2 text-[#0A1D37]/90"
                  >
                    <input
                      type="checkbox"
                      checked={
                        Array.isArray(value) && value.includes(option.key)
                      }
                      onChange={(e) => {
                        const currentArray = Array.isArray(value) ? value : [];
                        if (e.target.checked) {
                          handleInputChange(field.name, [
                            ...currentArray,
                            option.key,
                          ]);
                        } else {
                          handleInputChange(
                            field.name,
                            currentArray.filter((v) => v !== option.key)
                          );
                        }
                      }}
                      className="rounded text-[#4DBFF0] focus:ring-[#4DBFF0]"
                    />
                    <span>{option.value}</span>
                  </label>
                )
              )}
            </div>
          );

        case "boolean":
          return (
            <label className="flex items-center space-x-reverse space-x-2 text-[#0A1D37]/90">
              <input
                type="checkbox"
                checked={!!value}
                onChange={(e) =>
                  handleInputChange(field.name, e.target.checked)
                }
                className="rounded text-[#4DBFF0] focus:ring-[#4DBFF0]"
                required={field.required}
              />
              <span>{field.placeholder || field.label}</span>
            </label>
          );

        case "date":
          return (
            <input
              type="date"
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={baseInputClasses}
              required={field.required}
            />
          );

        case "file":
          return (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={value || ""}
                  placeholder="فایل انتخاب نشده - از دکمه آپلود استفاده کنید"
                  className={`${baseInputClasses} flex-1`}
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => handleFileUploadClick(field.name)}
                  className="px-6 py-3 bg-gradient-to-r from-[#4DBFF0] to-[#FF7A00] text-white rounded-xl font-medium hover:from-[#4DBFF0]/80 hover:to-[#FF7A00]/80 transition-all duration-300 whitespace-nowrap"
                >
                  📁 آپلود فایل
                </button>
              </div>

              {/* File Preview */}
              {value && (
                <div className="p-3 bg-white/5 rounded-lg border border-[#4DBFF0]/30">
                  <p className="text-[#0A1D37]/70 text-sm mb-2">
                    فایل آپلود شده:
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-reverse space-x-2">
                      <span className="text-2xl">📎</span>
                      <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4DBFF0] hover:text-[#4DBFF0]/80 text-sm underline"
                      >
                        مشاهده فایل
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInputChange(field.name, "")}
                      className="text-[#FF7A00] hover:text-[#FF7A00]/80 text-sm"
                    >
                      حذف
                    </button>
                  </div>

                  {/* Image Preview if it's an image */}
                  {value &&
                    (value.includes("image") ||
                      value.match(/\.(jpg|jpeg|png|gif|webp)$/i)) && (
                      <div className="mt-2">
                        <img
                          src={value}
                          alt="پیش‌نمایش"
                          className="w-32 h-32 object-cover rounded-lg border border-[#4DBFF0]/50"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                </div>
              )}
            </div>
          );

        default:
          return (
            <input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className={baseInputClasses}
              required={field.required}
            />
          );
      }
    };

    return (
      <div key={field.name} className="space-y-2">
        <label className="block text-[#0A1D37] font-medium">
          {field.label || field.name}
          {field.required && <span className="text-[#FF7A00] ml-1">*</span>}
        </label>
        {field.description && (
          <p className="text-[#0A1D37]/60 text-sm">{field.description}</p>
        )}
        {renderInput()}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64 bg-gradient-to-br from-white via-[#E8F4FD] to-[#F0F9FF]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4DBFF0]"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-32 bg-gradient-to-br from-white via-[#E8F4FD] to-[#F0F9FF] p-6"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto">
        {!selectedService ? (
          // Services Grid
          <div>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-[#0A1D37] mb-4">
                خدمات موجود
              </h1>
              <p className="text-[#0A1D37]/70 text-lg">
                یکی از خدمات زیر را انتخاب کرده و درخواست خود را ثبت کنید
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-2xl font-bold text-[#0A1D37] mb-2">
                    هیچ خدمتی موجود نیست
                  </h3>
                  <p className="text-[#0A1D37]/60">
                    در حال حاضر هیچ خدمت فعالی برای درخواست وجود ندارد
                  </p>
                </div>
              ) : (
                services.map((service) => (
                  <div
                    key={service._id}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/15 via-white/8 to-white/5 backdrop-blur-xl border border-[#4DBFF0] shadow-2xl hover:shadow-[#FF7A00]/20 transition-all duration-500 cursor-pointer p-6"
                    onClick={() => handleServiceSelect(service)}
                  >
                    <div className="relative z-10">
                      {service.image && (
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-48 object-cover rounded-xl mb-4"
                        />
                      )}

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold text-[#0A1D37] group-hover:text-[#4DBFF0] transition-colors">
                            {service.title}
                          </h3>
                          {service.icon && (
                            <span className="text-2xl">{service.icon}</span>
                          )}
                        </div>

                        {service.description && (
                          <p className="text-[#0A1D37]/70 text-sm line-clamp-3">
                            {service.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-[#4DBFF0]/20"></div>

                        <button className="w-full text-[#0A1D37] border border-[#FF7A00] hover:bg-[#4DBFF0]/10 hover:border-[#4DBFF] py-3 rounded-xl font-medium hover:from-[#4DBFF0]/80 hover:to-[#FF7A00]/80 transition-all duration-300 transform group-hover:scale-105">
                          درخواست خدمت
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          // Service Form
          <div>
            <button
              onClick={() => setSelectedService(null)}
              className="mb-6 flex items-center space-x-reverse space-x-2 text-[#0A1D37]/70 hover:text-[#0A1D37] transition-colors"
            >
              <svg
                className="w-5 h-5 rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>بازگشت به خدمات</span>
            </button>

            <div className="max-w-2xl mx-auto">
              <div className="relative bg-gradient-to-br from-white/15 via-white/8 to-white/5 backdrop-blur-xl rounded-2xl border border-[#4DBFF0] shadow-2xl p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-[#0A1D37] mb-2">
                    {selectedService.title}
                  </h2>
                  {selectedService.description && (
                    <p className="text-[#0A1D37]/70">
                      {selectedService.description}
                    </p>
                  )}
                  <div className="mt-4 p-4 bg-gradient-to-r from-[#FF7A00]/10 to-[#4DBFF0]/10 border border-[#FF7A00]/20 rounded-xl">
                    <p className="text-[#FF7A00] font-medium">
                      هزینه خدمت: ${selectedService.fee}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {selectedService.fields.map(renderField)}

                  <div className="pt-6 border-t border-[#4DBFF0]/20">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-[#4DBFF0] to-[#FF7A00] text-white py-4 rounded-xl font-medium hover:from-[#4DBFF0]/80 hover:to-[#FF7A00]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-[#4DBFF0]/20"
                    >
                      {submitting ? (
                        <div className="flex items-center justify-center space-x-reverse space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>در حال ارسال...</span>
                        </div>
                      ) : (
                        "ثبت درخواست"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* File Upload Modal */}
      <FileUploaderModal
        isOpen={isFileModalOpen}
        onClose={() => {
          setIsFileModalOpen(false);
          setCurrentFileField(null);
        }}
        onFileUploaded={handleFileUploaded}
        acceptedTypes={[
          ".jpg",
          ".jpeg",
          ".png",
          ".gif",
          ".webp",
          ".pdf",
          ".doc",
          ".docx",
          ".txt",
        ]}
        maxFileSize={10 * 1024 * 1024} // 10MB
        title="آپلود فایل"
      />
    </div>
  );
};

export default ServiceRenderer;
