"use client";
import React, { useState } from "react";
import { ServiceField } from "@/types/serviceBuilder/types";
import { FormField } from "@/types/dynamicTypes/types";

interface FieldBuilderProps {
  field: ServiceField;
  onUpdate: (field: ServiceField) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

const FieldBuilder: React.FC<FieldBuilderProps> = ({
  field,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}) => {
  const [isExpanded, setIsExpanded] = useState(true); // Default to expanded for new fields

  const fieldTypes = [
    { value: "string", label: "متن" },
    { value: "number", label: "عدد" },
    { value: "email", label: "ایمیل" },
    { value: "password", label: "رمز عبور" },
    { value: "tel", label: "تلفن" },
    { value: "textarea", label: "متن چندخطی" },
    { value: "select", label: "انتخاب از لیست" },
    { value: "multiselect", label: "انتخاب چندگانه" },
    { value: "boolean", label: "بله/خیر" },
    { value: "date", label: "تاریخ" },
    { value: "file", label: "فایل" },
  ];

  const handleFieldChange = (key: keyof ServiceField, value: any) => {
    onUpdate({ ...field, [key]: value });
  };

  const handleOptionAdd = () => {
    const newOptions = [...(field.options || []), { key: "", value: "" }];
    handleFieldChange("options", newOptions);
  };

  const handleOptionUpdate = (index: number, key: string, value: string) => {
    const newOptions = [...(field.options || [])];
    newOptions[index] = { ...newOptions[index], [key]: value };
    handleFieldChange("options", newOptions);
  };

  const handleOptionDelete = (index: number) => {
    const newOptions = field.options?.filter((_, i) => i !== index) || [];
    handleFieldChange("options", newOptions);
  };

  const getFieldIcon = () => {
    switch (field.type) {
      case "email":
        return "📧";
      case "password":
        return "🔐";
      case "number":
        return "🔢";
      case "select":
      case "multiselect":
        return "📋";
      case "boolean":
        return "✅";
      case "file":
        return "📁";
      case "date":
        return "📅";
      case "textarea":
        return "📄";
      case "tel":
        return "📞";
      default:
        return "📝";
    }
  };

  return (
    <div
      className="relative group bg-gradient-to-br from-white/15 via-white/8 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl hover:shadow-[#FF7A00]/20 transition-all duration-500 overflow-hidden"
      dir="rtl"
    >
      {/* Luxury Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FF7A00]/5 via-transparent to-[#4DBFF0]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Animated Border Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#FF7A00]/20 via-[#4DBFF0]/20 to-[#FF7A00]/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>

      <div className="relative z-10 p-6 space-y-6">
        {/* Enhanced Field Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="relative group/toggle w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center text-white/90 hover:text-white hover:shadow-lg hover:shadow-[#4DBFF0]/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#4DBFF0]/20 to-[#FF7A00]/20 rounded-xl opacity-0 group-hover/toggle:opacity-100 transition-opacity duration-300"></div>
              <span
                className="relative text-lg transform transition-transform duration-300"
                style={{
                  transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                }}
              >
                ◄
              </span>
            </button>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getFieldIcon()}</span>
              <h4 className="text-xl font-bold bg-gradient-to-r from-white via-[#4DBFF0] to-white bg-clip-text text-transparent">
                {field.label || field.name || "فیلد جدید"}
              </h4>
              {field.required && (
                <span className="px-2 py-1 bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 text-xs rounded-full border border-red-400/30">
                  اجباری
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMoveUp}
              disabled={!canMoveUp}
              className="group/btn relative w-10 h-10 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:shadow-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#4DBFF0]/20 to-transparent rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <span className="relative text-lg">↑</span>
            </button>
            <button
              onClick={onMoveDown}
              disabled={!canMoveDown}
              className="group/btn relative w-10 h-10 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:shadow-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#4DBFF0]/20 to-transparent rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <span className="relative text-lg">↓</span>
            </button>
            <button
              onClick={onDelete}
              className="group/btn relative w-10 h-10 bg-gradient-to-br from-red-500/20 to-red-600/10 backdrop-blur-sm rounded-xl border border-red-400/30 flex items-center justify-center text-red-400 hover:text-red-300 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-transparent rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <span className="relative text-lg">🗑️</span>
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-6 border-t border-white/10 pt-6">
            {/* Enhanced Basic Properties */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group/input">
                <label className="flex items-center gap-2 text-white/90 text-sm font-medium mb-3">
                  <span className="w-2 h-2 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] rounded-full"></span>
                  نام فیلد (name)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    className="w-full px-4 py-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white/90 placeholder:text-white/50 focus:border-[#4DBFF0]/50 focus:ring-2 focus:ring-[#4DBFF0]/20 transition-all duration-300"
                    placeholder="account_username"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF7A00]/5 to-[#4DBFF0]/5 rounded-xl opacity-0 group-hover/input:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              <div className="group/input">
                <label className="flex items-center gap-2 text-white/90 text-sm font-medium mb-3">
                  <span className="w-2 h-2 bg-gradient-to-r from-[#4DBFF0] to-[#FF7A00] rounded-full"></span>
                  برچسب (label)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => handleFieldChange("label", e.target.value)}
                    className="w-full px-4 py-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white/90 placeholder:text-white/50 focus:border-[#4DBFF0]/50 focus:ring-2 focus:ring-[#4DBFF0]/20 transition-all duration-300"
                    placeholder="نام کاربری حساب"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF7A00]/5 to-[#4DBFF0]/5 rounded-xl opacity-0 group-hover/input:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              <div className="group/select">
                <label className="flex items-center gap-2 text-white/90 text-sm font-medium mb-3">
                  <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></span>
                  نوع فیلد
                </label>
                <div className="relative">
                  <select
                    value={field.type}
                    onChange={(e) => handleFieldChange("type", e.target.value)}
                    className="w-full px-4 py-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white/90 focus:border-[#4DBFF0]/50 focus:ring-2 focus:ring-[#4DBFF0]/20 transition-all duration-300 appearance-none"
                  >
                    {fieldTypes.map((type) => (
                      <option
                        key={type.value}
                        value={type.value}
                        className="bg-gray-800 text-white"
                      >
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-white/50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-xl opacity-0 group-hover/select:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              <div className="group/input">
                <label className="flex items-center gap-2 text-white/90 text-sm font-medium mb-3">
                  <span className="w-2 h-2 bg-gradient-to-r from-green-400 to-teal-400 rounded-full"></span>
                  متن راهنما (placeholder)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={field.placeholder || ""}
                    onChange={(e) =>
                      handleFieldChange("placeholder", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white/90 placeholder:text-white/50 focus:border-[#4DBFF0]/50 focus:ring-2 focus:ring-[#4DBFF0]/20 transition-all duration-300"
                    placeholder="نام کاربری خود را وارد کنید"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-teal-500/5 rounded-xl opacity-0 group-hover/input:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            </div>

            <div className="group/textarea">
              <label className="flex items-center gap-2 text-white/90 text-sm font-medium mb-3">
                <span className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></span>
                توضیحات
              </label>
              <div className="relative">
                <textarea
                  value={field.description || ""}
                  onChange={(e) =>
                    handleFieldChange("description", e.target.value)
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white/90 placeholder:text-white/50 focus:border-[#4DBFF0]/50 focus:ring-2 focus:ring-[#4DBFF0]/20 transition-all duration-300 resize-none"
                  placeholder="توضیحات اضافی در مورد این فیلد"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-xl opacity-0 group-hover/textarea:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Options for select/multiselect */}
            {(field.type === "select" || field.type === "multiselect") && (
              <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <label className="flex items-center gap-2 text-white/90 text-sm font-medium">
                    <span className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></span>
                    گزینه‌ها
                  </label>
                  <button
                    type="button"
                    onClick={handleOptionAdd}
                    className="group/add relative px-4 py-2 bg-gradient-to-r from-[#4DBFF0]/20 to-[#FF7A00]/20 backdrop-blur-sm border border-[#4DBFF0]/30 text-[#4DBFF0] text-sm rounded-lg hover:from-[#4DBFF0]/30 hover:to-[#FF7A00]/30 transition-all duration-300 flex items-center gap-2"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#4DBFF0]/10 to-[#FF7A00]/10 rounded-lg opacity-0 group-hover/add:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative">+</span>
                    <span className="relative">افزودن گزینه</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {field.options?.map((option, index) => (
                    <div key={index} className="flex gap-3 group/option">
                      <div className="flex-1 relative group/opt-input">
                        <input
                          type="text"
                          value={option.key}
                          onChange={(e) =>
                            handleOptionUpdate(index, "key", e.target.value)
                          }
                          placeholder="کلید"
                          className="w-full px-3 py-2 bg-gradient-to-br from-white/5 to-white/0 border border-white/15 rounded-lg text-white/90 placeholder:text-white/40 text-sm focus:border-[#4DBFF0]/40 focus:ring-1 focus:ring-[#4DBFF0]/20 transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg opacity-0 group-hover/opt-input:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                      <div className="flex-1 relative group/opt-input">
                        <input
                          type="text"
                          value={option.value}
                          onChange={(e) =>
                            handleOptionUpdate(index, "value", e.target.value)
                          }
                          placeholder="مقدار"
                          className="w-full px-3 py-2 bg-gradient-to-br from-white/5 to-white/0 border border-white/15 rounded-lg text-white/90 placeholder:text-white/40 text-sm focus:border-[#4DBFF0]/40 focus:ring-1 focus:ring-[#4DBFF0]/20 transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-lg opacity-0 group-hover/opt-input:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOptionDelete(index)}
                        className="group/del relative w-10 h-10 bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm rounded-lg border border-red-400/20 flex items-center justify-center text-red-400 hover:text-red-300 transition-all duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent rounded-lg opacity-0 group-hover/del:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative text-sm">🗑️</span>
                      </button>
                    </div>
                  ))}
                  {(!field.options || field.options.length === 0) && (
                    <div className="text-center py-6 text-white/40 text-sm">
                      هنوز گزینه‌ای اضافه نشده
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Field Settings */}
            <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-xl p-4 border border-white/10">
              <h5 className="flex items-center gap-2 text-white/90 text-sm font-medium mb-4">
                <span className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"></span>
                تنظیمات فیلد
              </h5>
              <div className="flex items-center gap-6">
                <label className="group/check relative flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={field.required || false}
                      onChange={(e) =>
                        handleFieldChange("required", e.target.checked)
                      }
                      className="w-5 h-5 rounded border-white/20 bg-white/10 text-[#4DBFF0] focus:ring-[#4DBFF0]/20 focus:ring-2 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#4DBFF0]/20 to-[#FF7A00]/20 rounded opacity-0 group-hover/check:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  <span className="text-white/90 text-sm font-medium">
                    اجباری
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldBuilder;
