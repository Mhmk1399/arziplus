"use client";
import React, { useState } from 'react';
import { ServiceField } from '@/types/serviceBuilder/types';
import { FormField } from '@/types/dynamicTypes/types';

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
  canMoveDown
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const fieldTypes = [
    { value: 'string', label: 'متن' },
    { value: 'number', label: 'عدد' },
    { value: 'email', label: 'ایمیل' },
    { value: 'password', label: 'رمز عبور' },
    { value: 'tel', label: 'تلفن' },
    { value: 'textarea', label: 'متن چندخطی' },
    { value: 'select', label: 'انتخاب از لیست' },
    { value: 'multiselect', label: 'انتخاب چندگانه' },
    { value: 'boolean', label: 'بله/خیر' },
    { value: 'date', label: 'تاریخ' },
    { value: 'file', label: 'فایل' }
  ];

  const handleFieldChange = (key: keyof ServiceField, value: any) => {
    onUpdate({ ...field, [key]: value });
  };

  const handleOptionAdd = () => {
    const newOptions = [...(field.options || []), { key: '', value: '' }];
    handleFieldChange('options', newOptions);
  };

  const handleOptionUpdate = (index: number, key: string, value: string) => {
    const newOptions = [...(field.options || [])];
    newOptions[index] = { ...newOptions[index], [key]: value };
    handleFieldChange('options', newOptions);
  };

  const handleOptionDelete = (index: number) => {
    const newOptions = field.options?.filter((_, i) => i !== index) || [];
    handleFieldChange('options', newOptions);
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 space-y-4" dir="rtl">
      {/* Field Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white/90 hover:text-white transition-colors"
          >
            {isExpanded ? '▼' : '◄'}
          </button>
          <h4 className="text-white/90 font-medium">
            {field.label || field.name || 'فیلد جدید'}
          </h4>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="p-2 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ↑
          </button>
          <button
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="p-2 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ↓
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-400 hover:text-red-300 transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 mt-4 border-t border-white/10 pt-4">
          {/* Basic Properties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/90 text-sm mb-2">نام فیلد (name)</label>
              <input
                type="text"
                value={field.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white/90 placeholder:text-white/50"
                placeholder="account_username"
              />
            </div>
            
            <div>
              <label className="block text-white/90 text-sm mb-2">برچسب (label)</label>
              <input
                type="text"
                value={field.label}
                onChange={(e) => handleFieldChange('label', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white/90 placeholder:text-white/50"
                placeholder="نام کاربری حساب"
              />
            </div>

            <div>
              <label className="block text-white/90 text-sm mb-2">نوع فیلد</label>
              <select
                value={field.type}
                onChange={(e) => handleFieldChange('type', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white/90"
              >
                {fieldTypes.map((type) => (
                  <option key={type.value} value={type.value} className="bg-gray-800">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/90 text-sm mb-2">متن راهنما (placeholder)</label>
              <input
                type="text"
                value={field.placeholder || ''}
                onChange={(e) => handleFieldChange('placeholder', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white/90 placeholder:text-white/50"
                placeholder="نام کاربری خود را وارد کنید"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/90 text-sm mb-2">توضیحات</label>
            <textarea
              value={field.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white/90 placeholder:text-white/50"
              placeholder="توضیحات اضافی در مورد این فیلد"
            />
          </div>

          {/* Options for select/multiselect */}
          {(field.type === 'select' || field.type === 'multiselect') && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-white/90 text-sm">گزینه‌ها</label>
                <button
                  onClick={handleOptionAdd}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + افزودن گزینه
                </button>
              </div>
              
              <div className="space-y-2">
                {field.options?.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={option.key}
                      onChange={(e) => handleOptionUpdate(index, 'key', e.target.value)}
                      placeholder="کلید"
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white/90 placeholder:text-white/50"
                    />
                    <input
                      type="text"
                      value={option.value}
                      onChange={(e) => handleOptionUpdate(index, 'value', e.target.value)}
                      placeholder="مقدار"
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white/90 placeholder:text-white/50"
                    />
                    <button
                      onClick={() => handleOptionDelete(index)}
                      className="px-3 py-2 text-red-400 hover:text-red-300"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Field Settings */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={field.required || false}
                onChange={(e) => handleFieldChange('required', e.target.checked)}
                className="rounded border-white/20 bg-white/10 text-blue-600"
              />
              <span className="text-white/90 text-sm">اجباری</span>
            </label>
          </div>

          {/* Validation Rules */}
          <div className="border-t border-white/10 pt-4">
            <h5 className="text-white/90 text-sm mb-3">قوانین اعتبارسنجی</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(field.type === 'string' || field.type === 'textarea') && (
                <>
                  <div>
                    <label className="block text-white/70 text-xs mb-1">حداقل طول</label>
                    <input
                      type="number"
                      value={field.validation?.minLength || ''}
                      onChange={(e) => handleFieldChange('validation', {
                        ...field.validation,
                        minLength: parseInt(e.target.value) || undefined
                      })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white/90 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-xs mb-1">حداکثر طول</label>
                    <input
                      type="number"
                      value={field.validation?.maxLength || ''}
                      onChange={(e) => handleFieldChange('validation', {
                        ...field.validation,
                        maxLength: parseInt(e.target.value) || undefined
                      })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white/90 text-sm"
                    />
                  </div>
                </>
              )}
              
              {field.type === 'number' && (
                <>
                  <div>
                    <label className="block text-white/70 text-xs mb-1">حداقل مقدار</label>
                    <input
                      type="number"
                      value={field.validation?.min || ''}
                      onChange={(e) => handleFieldChange('validation', {
                        ...field.validation,
                        min: parseInt(e.target.value) || undefined
                      })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white/90 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-xs mb-1">حداکثر مقدار</label>
                    <input
                      type="number"
                      value={field.validation?.max || ''}
                      onChange={(e) => handleFieldChange('validation', {
                        ...field.validation,
                        max: parseInt(e.target.value) || undefined
                      })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white/90 text-sm"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldBuilder;