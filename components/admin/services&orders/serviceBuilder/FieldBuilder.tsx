"use client";
import React, { useState } from "react";
import { ServiceField } from "@/types/serviceBuilder/types";
import { FaTrash } from "react-icons/fa";

interface FieldBuilderProps {
  field: ServiceField;
  onUpdate: (field: ServiceField) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  allFields?: ServiceField[]; // All fields in the form for conditional logic
}

const FieldBuilder: React.FC<FieldBuilderProps> = ({
  field,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  allFields = [],
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

  const handleFieldChange = (key: keyof ServiceField, value:string|boolean|{ key: string; value: string; }[]|{ field: string; value: string | boolean; } ) => {
    let updatedField = { ...field, [key]: value };
    
    // Clear options when field type is changed to non-select type
    if (key === 'type' && value !== 'select' && value !== 'multiselect') {
      // Remove options property entirely for non-select fields
      const { options, ...fieldWithoutOptions } = updatedField;
      updatedField = fieldWithoutOptions as ServiceField;
    }
    
    // Add empty options array when type is changed to select/multiselect
    if (key === 'type' && (value === 'select' || value === 'multiselect')) {
      if (!updatedField.options || updatedField.options.length === 0) {
        updatedField = { ...updatedField, options: [] };
      }
    }
    
    onUpdate(updatedField);
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

  const handleShowIfChange = (key: "field" | "value", value: string|boolean) => {
    const currentShowIf = field.showIf || { field: "", value: "" };
    const newShowIf = { ...currentShowIf, [key]: value };

    // If both field and value are empty, remove showIf entirely
    if (!newShowIf.field && !newShowIf.value) {
      const { showIf, ...fieldWithoutShowIf } = field;
      onUpdate(fieldWithoutShowIf as ServiceField);
    } else {
      handleFieldChange("showIf", newShowIf);
    }
  };

  // Get available fields that can be used for conditional logic (exclude current field)
  const availableFields = allFields.filter(
    (f) => f.name !== field.name && f.name.trim()
  );

  // Get possible values for the selected showIf field
  const getFieldValues = (fieldName: string) => {
    const targetField = allFields.find((f) => f.name === fieldName);
    if (!targetField) return [];

    switch (targetField.type) {
      case "boolean":
        return [
          { key: "true", value: "بله" },
          { key: "false", value: "خیر" },
        ];
      case "select":
      case "multiselect":
        return targetField.options || [];
      default:
        return [];
    }
  };

 

  return (
    <div
      className="relative group bg-gradient-to-br from-white/15 via-white/8 to-white/5 backdrop-blur-xl rounded-2xl border border-[#4DBFF0] shadow-2xl hover:shadow-[#0A1D37]/20 transition-all duration-500 overflow-hidden"
      dir="rtl"
    >
      <div className="relative z-10 p-6 space-y-6">
        {/* Enhanced Field Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="relative group/toggle w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center text-black/90 hover:text-white hover:shadow-lg hover:shadow-[#4DBFF0]/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#4DBFF0]/20 to-[#0A1D37]/20 rounded-xl opacity-0 group-hover/toggle:opacity-100 transition-opacity duration-300"></div>
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
              <h4 className="text-xl font-bold  text-[#0A1D37]">
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
              type="button"
              onClick={onMoveUp}
              disabled={!canMoveUp}
              className="group/btn relative w-10 h-10 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:shadow-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#4DBFF0]/20 to-transparent rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <span className="relative text-lg">↑</span>
            </button>
            <button
              type="button"
              onClick={onMoveDown}
              disabled={!canMoveDown}
              className="group/btn relative w-10 h-10 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:shadow-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#4DBFF0]/20 to-transparent rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <span className="relative text-lg">↓</span>
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="group/btn relative w-10 h-10 bg-gradient-to-br from-red-500/20 to-red-600/10 backdrop-blur-sm rounded-xl border border-[#4DBFF0] flex items-center justify-center text-[#0A1D37] hover:text-red-300 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
            >
              <span className="relative text-lg">
                <FaTrash />
              </span>
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-6 border-t border-white/10 pt-6">
            {/* Enhanced Basic Properties */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group/input">
                <label className="flex items-center gap-2 text-[#0A1D37] text-sm font-medium mb-3">
                  نام فیلد (name)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    className="w-full px-4 py-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-[#4DBFF0] rounded-xl text-[#0A1D37] placeholder:text-[#0A1D37]/50 focus:border-[#4DBFF0]/50 focus:outline-none focus:ring-2 focus:ring-[#4DBFF0] transition-all duration-300"
                    placeholder="account_username"
                  />
                </div>
              </div>

              <div className="group/input">
                <label className="flex items-center gap-2 text-[#0A1D37] text-sm font-medium mb-3">
                  برچسب (label)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => handleFieldChange("label", e.target.value)}
                    className="w-full px-4 py-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-[#4DBFF0] rounded-xl text-[#0A1D37] placeholder:text-[#0A1D37]/50 focus:border-[#4DBFF0]/50 focus:outline-none focus:ring-2 focus:ring-[#4DBFF0] transition-all duration-300"
                    placeholder="نام کاربری حساب"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0A1D37]/5 to-[#4DBFF0]/5 rounded-xl opacity-0 group-hover/input:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              <div className="group/select">
                <label className="flex items-center gap-2 text-[#0A1D37] text-sm font-medium mb-3">
                  نوع فیلد
                </label>
                <div className="relative">
                  <select
                    value={field.type}
                    onChange={(e) => handleFieldChange("type", e.target.value)}
                    className="w-full px-4 py-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-[#4DBFF0] rounded-xl text-[#0A1D37] placeholder:text-[#0A1D37]/50 focus:border-[#4DBFF0]/50 focus:outline-none focus:ring-2 focus:ring-[#4DBFF0] transition-all duration-300 appearance-none"
                  >
                    {fieldTypes.map((type) => (
                      <option
                        key={type.value}
                        value={type.value}
                        className=" text-[#4DBFF0]"
                      >
                        {type.label}
                      </option>
                    ))}
                  </select>

                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-xl opacity-0 group-hover/select:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              <div className="group/input">
                <label className="flex items-center gap-2 text-[#0A1D37] text-sm font-medium mb-3">
                  متن راهنما (placeholder)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={field.placeholder || ""}
                    onChange={(e) =>
                      handleFieldChange("placeholder", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-[#4DBFF0] rounded-xl text-[#0A1D37] placeholder:text-[#0A1D37]/50 focus:border-[#4DBFF0]/50 focus:outline-none focus:ring-2 focus:ring-[#4DBFF0] transition-all duration-300"
                    placeholder="نام کاربری خود را وارد کنید"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-teal-500/5 rounded-xl opacity-0 group-hover/input:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            </div>

            <div className="group/textarea">
              <label className="flex items-center gap-2 text-[#0A1D37] text-sm font-medium mb-3">
                توضیحات
              </label>
              <div className="relative">
                <textarea
                  value={field.description || ""}
                  onChange={(e) =>
                    handleFieldChange("description", e.target.value)
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-[#4DBFF0] rounded-xl text-[#0A1D37] placeholder:text-[#0A1D37]/50 focus:border-[#4DBFF0]/50 focus:outline-none focus:ring-2 focus:ring-[#4DBFF0] transition-all duration-300 resize-none"
                  placeholder="توضیحات اضافی در مورد این فیلد"
                />
              </div>
            </div>

            {/* Options for select/multiselect - Only show for select and multiselect field types */}
            {(field.type === "select" || field.type === "multiselect") && (
              <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <label className="flex items-center gap-2 border border-[#4DBFF0] px-4 py-2 rounded-md text-[#0A1D37] text-sm font-medium">
                    <span className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></span>
                    گزینه‌ها
                  </label>
                  <button
                    type="button"
                    onClick={handleOptionAdd}
                    className="group/add relative px-4 py-2 bg-gradient-to-r from-[#4DBFF0]/20 to-[#0A1D37]/20 backdrop-blur-sm border border-[#4DBFF0] text-[#0A1D37] text-sm rounded-lg hover:from-[#4DBFF0]/30 hover:to-[#0A1D37]/30 transition-all duration-300 flex items-center gap-2"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#4DBFF0]/10 to-[#0A1D37]/10 rounded-lg opacity-0 group-hover/add:opacity-100 transition-opacity duration-300"></div>
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
                          className="w-full px-3 py-2 bg-gradient-to-br from-white/5 to-white/0 border border-white/15 rounded-lg text-[#0A1D37] placeholder:text-[#0A1D37]/50 text-sm focus:border-[#4DBFF0]/40 focus:ring-1 focus:ring-[#4DBFF0]/20 transition-all duration-300"
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
                          className="w-full px-3 py-2 bg-gradient-to-br from-white/5 to-white/0 border border-white/15 rounded-lg text-[#0A1D37] placeholder:text-[#0A1D37]/50 text-sm focus:border-[#4DBFF0]/40 focus:ring-1 focus:ring-[#4DBFF0]/20 transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-lg opacity-0 group-hover/opt-input:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOptionDelete(index)}
                        className="group/del relative w-10 h-10 bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm rounded-lg border border-red-400/20 flex items-center justify-center text-red-400 hover:text-red-300 transition-all duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent rounded-lg opacity-0 group-hover/del:opacity-100 transition-opacity duration-300"></div>
                        <span className="relative text-sm">
                          <FaTrash />
                        </span>
                      </button>
                    </div>
                  ))}
                  {(!field.options || field.options.length === 0) && (
                    <div className="text-center py-6 text-[#0A1D37]/50 text-sm">
                      هنوز گزینه‌ای اضافه نشده
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Conditional Display */}
            {availableFields.length > 0 && (
              <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-xl p-4 border border-white/10">
                <h5 className="flex items-center gap-2 text-[#0A1D37] text-sm font-medium mb-4">
                  <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></span>
                  نمایش شرطی
                </h5>
                <div className="space-y-4">
                  <div className="text-[#0A1D37] text-xs mb-3">
                    این فیلد را فقط در صورت برقراری شرط خاص نمایش بده
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="group/select">
                      <label className="flex items-center gap-2 text-[#0A1D37] text-sm font-medium mb-2">
                        نمایش اگر فیلد
                      </label>
                      <div className="relative">
                        <select
                          value={field.showIf?.field || ""}
                          onChange={(e) =>
                            handleShowIfChange("field", e.target.value)
                          }
                          className="w-full px-4 py-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-[#4DBFF0] rounded-xl text-[#0A1D37] placeholder:text-[#0A1D37]/50 focus:border-[#4DBFF0]/50 focus:outline-none focus:ring-2 focus:ring-[#4DBFF0] transition-all duration-300 appearance-none"
                        >
                          <option value="" className="text-[#0A1D37]">
                            بدون شرط
                          </option>
                          {availableFields.map((availableField) => (
                            <option
                              key={availableField.name}
                              value={availableField.name}
                              className="  text-[#0A1D37]"
                            >
                              {availableField.label} ({availableField.name})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {field.showIf?.field && (
                      <div className="group/input">
                        <label className="flex items-center gap-2 text-[#0A1D37] text-sm font-medium mb-2">
                          برابر باشد با
                        </label>
                        <div className="relative">
                          {(() => {
                            const fieldValues = getFieldValues(
                              field.showIf.field
                            );
                            const targetField = allFields.find(
                              (f) => f.name === field.showIf?.field
                            );

                            if (fieldValues.length > 0) {
                              // Show dropdown for boolean, select, multiselect fields
                              return (
                                <>
                                  <select
                                    value={field.showIf?.value || ""}
                                    onChange={(e) => {
                                      const value =
                                        targetField?.type === "boolean"
                                          ? e.target.value === "true"
                                          : e.target.value;
                                      handleShowIfChange("value", value);
                                    }}
                                    className="w-full px-4 py-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-[#4DBFF0] rounded-xl text-[#0A1D37] placeholder:text-[#0A1D37]/50 focus:border-[#4DBFF0]/50 focus:outline-none focus:ring-2 focus:ring-[#4DBFF0] transition-all duration-300 appearance-none"
                                  >
                                    <option value="" className="text-[#0A1D37]">
                                      انتخاب کنید
                                    </option>
                                    {fieldValues.map((option) => (
                                      <option
                                        key={option.key}
                                        value={option.key}
                                        className="text-[#0A1D37]"
                                      >
                                        {option.value}
                                      </option>
                                    ))}
                                  </select>
                               
                                </>
                              );
                            } else {
                              // Show text input for string, number, etc.
                              return (
                                <input
                                  type="text"
                                  value={field.showIf?.value || ""}
                                  onChange={(e) =>
                                    handleShowIfChange("value", e.target.value)
                                  }
                                  className="w-full px-3 py-2 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-lg text-[#0A1D37] placeholder:text-white/50 focus:border-[#4DBFF0]/50 focus:ring-2 focus:ring-[#4DBFF0]/20 transition-all duration-300 text-sm"
                                  placeholder="مقدار مورد نظر را وارد کنید"
                                />
                              );
                            }
                          })()}
                        </div>
                      </div>
                    )}
                  </div>

                  {field.showIf?.field && field.showIf?.value && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg border border-blue-400/20">
                      <div className="flex items-center gap-2 text-[#0A1D37] text-xs">
                        <span className="text-sm">ℹ️</span>
                        <span>
                          این فیلد فقط زمانی نمایش داده می‌شود که فیلد 
                          {
                            allFields.find(
                              (f) => f.name === field.showIf?.field
                            )?.label
                          }
                           برابر با 
                          {(() => {
                            const targetField = allFields.find(
                              (f) => f.name === field.showIf?.field
                            );
                            if (targetField?.type === "boolean") {
                              return field.showIf?.value ? "بله" : "خیر";
                            }
                            const fieldValues = getFieldValues(
                              field.showIf.field
                            );
                            const matchingOption = fieldValues.find(
                              (opt) => opt.key === field.showIf?.value
                            );
                            return matchingOption
                              ? matchingOption.value
                              : field.showIf?.value;
                          })()}
                           باشد.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Field Settings */}
            <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-xl p-4 border border-white/10">
              <h5 className="flex items-center gap-2 text-[#0A1D37] text-sm font-medium mb-4">
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
                  </div>
                  <span className="text-[#0A1D37] text-sm font-medium">
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
