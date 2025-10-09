"use client";
import React, { useState } from "react";
import {
  ServiceBuilderFormData,
  ServiceField,
} from "@/types/serviceBuilder/types";
import FieldBuilder from "./FieldBuilder";
import { showToast } from "@/utilities/toast";

interface ServiceBuilderProps {
  initialData?: Partial<ServiceBuilderFormData>;
  onSave: (data: ServiceBuilderFormData) => Promise<void>;
  onCancel?: () => void;
  isEditing?: boolean;
}

const ServiceBuilder: React.FC<ServiceBuilderProps> = ({
  initialData,
  onSave,
  onCancel,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<ServiceBuilderFormData>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    fee: initialData?.fee || 0,
    wallet: initialData?.wallet || false,
    description: initialData?.description || "",
    icon: initialData?.icon || "",
    status: initialData?.status || "draft",
    image: initialData?.image || "",
    fields: initialData?.fields || [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim();
  };

  const handleInputChange = (key: keyof ServiceBuilderFormData, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [key]: value };

      // Auto-generate slug from title
      if (key === "title" && !isEditing) {
        newData.slug = generateSlug(value);
      }

      return newData;
    });
  };

  const addNewField = () => {
    const fieldNumber = formData.fields.length + 1;
    const newField: ServiceField = {
      name: `field_${fieldNumber}`,
      label: `فیلد ${fieldNumber}`,
      type: "string",
      required: false,
      placeholder: `فیلد شماره ${fieldNumber} را وارد کنید`,
    };

    setFormData((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
  };

  const updateField = (index: number, field: ServiceField) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.map((f, i) => (i === index ? field : f)),
    }));
  };

  const deleteField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }));
  };

  const moveField = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formData.fields.length) return;

    setFormData((prev) => {
      const newFields = [...prev.fields];
      [newFields[index], newFields[newIndex]] = [
        newFields[newIndex],
        newFields[index],
      ];
      return { ...prev, fields: newFields };
    });
  };

  const validateFields = () => {
    const errors: string[] = [];

    // Check if any field has empty name or label
    formData.fields.forEach((field, index) => {
      if (!field.name.trim()) {
        errors.push(`فیلد ${index + 1}: نام فیلد الزامی است`);
      }
      if (!field.label.trim()) {
        errors.push(`فیلد ${index + 1}: برچسب فیلد الزامی است`);
      }

      // Check if select/multiselect fields have options
      if (field.type === "select" || field.type === "multiselect") {
        if (!field.options || field.options.length === 0) {
          errors.push(
            `فیلد ${index + 1}: فیلد انتخابی باید حداقل یک گزینه داشته باشد`
          );
        } else {
          // Check if options have both key and value
          const emptyOptions = field.options.some(
            (opt) => !opt.key.trim() || !opt.value.trim()
          );
          if (emptyOptions) {
            errors.push(
              `فیلد ${index + 1}: همه گزینه‌ها باید کلید و مقدار داشته باشند`
            );
          }
        }
      }
    });

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();



    // Basic validation
    if (!formData.title.trim()) {
      showToast.error("عنوان سرویس الزامی است");
      return;
    }

    if (!formData.slug.trim()) {
      showToast.error("نام مستعار (slug) الزامی است");
      return;
    }

    if (formData.fee < 0) {
      showToast.error("هزینه نمی‌تواند منفی باشد");
      return;
    }

    // Field validation
    const fieldErrors = validateFields();
    if (fieldErrors.length > 0) {
      showToast.validationError(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
      // Success toast will be handled by the parent component
    } catch (error) {
      console.error("Error saving service:", error);
      const errorMessage =
        error instanceof Error ? error.message : "خطا در ذخیره سرویس";
      showToast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden p-4"
      dir="rtl"
      style={{
        background: `
             radial-gradient(circle at 20% 80%, rgba(10, 29, 55, 0.1) 0%, transparent 50%),
             radial-gradient(circle at 80% 20%, rgba(255, 122, 0, 0.1) 0%, transparent 50%),
             radial-gradient(circle at 40% 40%, rgba(77, 191, 240, 0.1) 0%, transparent 50%),
             linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(10, 29, 55, 0.02) 100%)
           `,
      }}
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 animate-float"
            style={{
              left: `${10 + ((i * 12) % 80)}%`,
              top: `${15 + ((i * 9) % 70)}%`,
              width: `${6 + (i % 3) * 4}px`,
              height: `${6 + (i % 3) * 4}px`,
              background: `linear-gradient(45deg, 
                ${
                  i % 3 === 0 ? "#FF7A00" : i % 3 === 1 ? "#4DBFF0" : "#0A1D37"
                }, 
                ${
                  i % 3 === 0 ? "#FF7A00" : i % 3 === 1 ? "#4DBFF0" : "#0A1D37"
                })`,
              filter: "blur(1px)",
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + (i % 3)}s`,
            }}
          />
        ))}

        {/* Geometric Shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-[#4DBFF0]/20 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-32 left-16 w-24 h-24 border-2 border-[#FF7A00]/20 rotate-45 animate-pulse"></div>
        <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-gradient-to-br from-[#FF7A00]/10 to-[#4DBFF0]/10 rounded-lg rotate-12 animate-float"></div>
      </div>

      {/* Glass Morphism Overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div
          className="bg-gradient-to-br from-white/15 via-white/8 to-white/5 backdrop-blur-2xl rounded-3xl border border-[#4DBFF0] p-8 shadow-2xl"
          style={{
            boxShadow:
              "0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#0A1D37] bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text mb-2">
              {isEditing ? "ویرایش سرویس" : "ایجاد سرویس جدید"}
            </h1>
            <p className="text-[#0A1D37]">
              سرویس‌های پویا برای مدیریت فرم‌های مختلف ایجاد کنید
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Service Information */}
            <div className="bg-white/5 rounded-xl p-6 border border-[#4DBFF0]">
              <h2 className="text-xl font-semibold text-[#0A1D37] mb-4">
                اطلاعات پایه سرویس
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#0A1D37] text-sm mb-2">
                    عنوان سرویس *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-[#4DBFF0] rounded-lg text-[#0A1D37] placeholder:text-[#0A1D37]"
                    placeholder="مثال: ایجاد حساب ChatGPT"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#0A1D37] text-sm mb-2">
                    نام مستعار (Slug) *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-[#4DBFF0] rounded-lg text-[#0A1D37] placeholder:text-[#0A1D37]"
                    placeholder="chatgpt-account-creation"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#0A1D37] text-sm mb-2">
                    هزینه سرویس (تومان)
                  </label>
                  <input
                    type="number"
                    value={formData.fee}
                    onChange={(e) =>
                      handleInputChange("fee", parseInt(e.target.value) || 0)
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-[#4DBFF0] rounded-lg text-[#0A1D37] placeholder:text-[#0A1D37]/50"
                    placeholder="50000"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-[#0A1D37] text-sm mb-2">
                    وضعیت
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange(
                        "status",
                        e.target.value as "active" | "inactive" | "draft"
                      )
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-[#4DBFF0] rounded-lg text-[#4DBFF0]"
                  >
                    <option value="draft" className="text-[#4DBFF0}">
                      پیش‌نویس
                    </option>
                    <option value="active" className=" text-[#4DBFF0}">
                      فعال
                    </option>
                    <option value="inactive" className="text-[#4DBFF0}">
                      غیرفعال
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#0A1D37] text-sm mb-2">
                    تصویر (URL)
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => handleInputChange("image", e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-[#4DBFF0] rounded-lg text-[#0A1D37] placeholder:text-[#0A1D37]/50"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-[#0A1D37] text-sm mb-2">
                  توضیحات
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-[#4DBFF0] rounded-lg text-[#0A1D37] placeholder:text-[#0A1D37]/50"
                  placeholder="توضیحات کامل سرویس..."
                />
              </div>

              <div className="mt-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.wallet}
                    onChange={(e) =>
                      handleInputChange("wallet", e.target.checked)
                    }
                    className="w-5 h-5 text-purple-600 bg-white/10 border-[#4DBFF0] rounded focus:ring-[#FF7A00] focus:ring-2"
                  />
                  <span className="text-[#0A1D37]">نیاز به کیف پول دارد</span>
                </label>
              </div>
            </div>

            {/* Form Fields Builder */}
            <div className="bg-white/5 rounded-xl p-6 border border-[#4DBFF0]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="group relative overflow-hidden px-6 py-3  text-[#0A1D37] font-medium rounded-xl hover:from-[#FF7A00]/80 hover:to-[#4DBFF0]/80 transition-all duration-500 shadow-lg hover:shadow-[#FF7A00]/30 border border-[#4DBFF0] backdrop-blur-sm">
                  فیلدهای فرم
                </h2>
                <button
                  type="button"
                  onClick={addNewField}
                  className="group relative overflow-hidden px-6 py-3  text-[#0A1D37] font-medium rounded-xl hover:from-[#FF7A00]/80 hover:to-[#4DBFF0]/80 transition-all duration-500 shadow-lg hover:shadow-[#FF7A00]/30 border border-[#4DBFF0] backdrop-blur-sm"
                >
                  {/* Animated Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>

                  {/* Content */}
                  <span className="relative flex items-center gap-2 z-10">
                    <span className="text-lg">+</span>
                    <span>افزودن فیلد</span>

                    {/* Arrow Icon */}
                    <svg
                      className="w-4 h-4 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300"
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

              <div className="space-y-4">
                {formData.fields.length === 0 ? (
                  <div className="text-center py-12 text-[#0A1D37]/50">
                    <p className="text-lg mb-2">هنوز فیلدی اضافه نشده</p>
                    <p className="text-sm">
                      برای شروع، روی دکمه "افزودن فیلد" کلیک کنید
                    </p>
                  </div>
                ) : (
                  formData.fields.map((field, index) => (
                    <FieldBuilder
                      key={index}
                      field={field}
                      allFields={formData.fields}
                      onUpdate={(updatedField) =>
                        updateField(index, updatedField)
                      }
                      onDelete={() => deleteField(index)}
                      onMoveUp={() => moveField(index, "up")}
                      onMoveDown={() => moveField(index, "down")}
                      canMoveUp={index > 0}
                      canMoveDown={index < formData.fields.length - 1}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-[#4DBFF0]">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 text-[#0A1D37] bg-white/10 border border-[#FF7A00] rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                انصراف
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r  text-[#0A1D37] font-medium rounded-lg border-[#4DBFF0] border  transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                {isSubmitting
                  ? "در حال ذخیره..."
                  : isEditing
                  ? "بروزرسانی سرویس"
                  : "ایجاد سرویس"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceBuilder;
