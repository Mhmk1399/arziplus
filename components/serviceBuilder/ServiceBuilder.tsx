"use client";
import React, { useState } from 'react';
import { ServiceBuilderFormData, ServiceField } from '@/types/serviceBuilder/types';
import FieldBuilder from './FieldBuilder';

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
  isEditing = false
}) => {
  const [formData, setFormData] = useState<ServiceBuilderFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    fee: initialData?.fee || 0,
    wallet: initialData?.wallet || false,
    description: initialData?.description || '',
    icon: initialData?.icon || '',
    status: initialData?.status || 'draft',
    image: initialData?.image || '',
    fields: initialData?.fields || []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleInputChange = (key: keyof ServiceBuilderFormData, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [key]: value };
      
      // Auto-generate slug from title
      if (key === 'title' && !isEditing) {
        newData.slug = generateSlug(value);
      }
      
      return newData;
    });
  };

  const addNewField = () => {
    const newField: ServiceField = {
      name: `field_${formData.fields.length + 1}`,
      label: 'فیلد جدید',
      type: 'string',
      required: false
    };
    
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (index: number, field: ServiceField) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) => i === index ? field : f)
    }));
  };

  const deleteField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formData.fields.length) return;

    setFormData(prev => {
      const newFields = [...prev.fields];
      [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
      return { ...prev, fields: newFields };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      alert('عنوان سرویس الزامی است');
      return;
    }
    
    if (!formData.slug.trim()) {
      alert('نام مستعار (slug) الزامی است');
      return;
    }
    
    if (formData.fee < 0) {
      alert('هزینه نمی‌تواند منفی باشد');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving service:', error);
      alert('خطا در ذخیره سرویس');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4" dir="rtl">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-32 right-32 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 p-6 shadow-2xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text mb-2">
              {isEditing ? 'ویرایش سرویس' : 'ایجاد سرویس جدید'}
            </h1>
            <p className="text-white/70">
              سرویس‌های پویا برای مدیریت فرم‌های مختلف ایجاد کنید
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Service Information */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">اطلاعات پایه سرویس</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/90 text-sm mb-2">عنوان سرویس *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white/90 placeholder:text-white/50"
                    placeholder="مثال: ایجاد حساب ChatGPT"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/90 text-sm mb-2">نام مستعار (Slug) *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white/90 placeholder:text-white/50"
                    placeholder="chatgpt-account-creation"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/90 text-sm mb-2">هزینه سرویس (تومان)</label>
                  <input
                    type="number"
                    value={formData.fee}
                    onChange={(e) => handleInputChange('fee', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white/90 placeholder:text-white/50"
                    placeholder="50000"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-white/90 text-sm mb-2">وضعیت</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value as 'active' | 'inactive' | 'draft')}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white/90"
                  >
                    <option value="draft" className="bg-gray-800">پیش‌نویس</option>
                    <option value="active" className="bg-gray-800">فعال</option>
                    <option value="inactive" className="bg-gray-800">غیرفعال</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/90 text-sm mb-2">آیکون</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => handleInputChange('icon', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white/90 placeholder:text-white/50"
                    placeholder="🤖"
                  />
                </div>

                <div>
                  <label className="block text-white/90 text-sm mb-2">تصویر (URL)</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white/90 placeholder:text-white/50"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-white/90 text-sm mb-2">توضیحات</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white/90 placeholder:text-white/50"
                  placeholder="توضیحات کامل سرویس..."
                />
              </div>

              <div className="mt-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.wallet}
                    onChange={(e) => handleInputChange('wallet', e.target.checked)}
                    className="w-5 h-5 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <span className="text-white/90">نیاز به کیف پول دارد</span>
                </label>
              </div>
            </div>

            {/* Form Fields Builder */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">فیلدهای فرم</h2>
                <button
                  type="button"
                  onClick={addNewField}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-300"
                >
                  + افزودن فیلد
                </button>
              </div>

              <div className="space-y-4">
                {formData.fields.length === 0 ? (
                  <div className="text-center py-12 text-white/50">
                    <p className="text-lg mb-2">هنوز فیلدی اضافه نشده</p>
                    <p className="text-sm">برای شروع، روی دکمه "افزودن فیلد" کلیک کنید</p>
                  </div>
                ) : (
                  formData.fields.map((field, index) => (
                    <FieldBuilder
                      key={index}
                      field={field}
                      onUpdate={(updatedField) => updateField(index, updatedField)}
                      onDelete={() => deleteField(index)}
                      onMoveUp={() => moveField(index, 'up')}
                      onMoveDown={() => moveField(index, 'down')}
                      canMoveUp={index > 0}
                      canMoveDown={index < formData.fields.length - 1}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-white/20">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 text-white/90 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                انصراف
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                {isSubmitting ? 'در حال ذخیره...' : (isEditing ? 'بروزرسانی سرویس' : 'ایجاد سرویس')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceBuilder;