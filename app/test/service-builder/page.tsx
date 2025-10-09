"use client";
import React, { useState } from 'react';
import ServiceBuilder from '@/components/serviceBuilder/ServiceBuilder';
import { ServiceBuilderFormData } from '@/types/serviceBuilder/types';

export default function TestServiceBuilderPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdService, setCreatedService] = useState<ServiceBuilderFormData | null>(null);

  const handleSave = async (data: ServiceBuilderFormData) => {
    // Simulate API call
    console.log('Service data to save:', data);
    
    // Validate that the service has meaningful data
    if (data.fields.length === 0) {
      throw new Error('سرویس باید حداقل یک فیلد داشته باشد');
    }
    
    // Check if fields are properly configured
    const incompleteFields = data.fields.filter(field => 
      !field.name.trim() || !field.label.trim()
    );
    
    if (incompleteFields.length > 0) {
      throw new Error('همه فیلدها باید نام و برچسب داشته باشند');
    }

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setCreatedService(data);
    setShowSuccess(true);
  };

  const handleCancel = () => {
    if (confirm('آیا از لغو ایجاد سرویس اطمینان دارید؟')) {
      window.history.back();
    }
  };

  const handleCreateAnother = () => {
    setShowSuccess(false);
    setCreatedService(null);
  };

  if (showSuccess && createdService) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4"
           style={{
             background: `
               radial-gradient(circle at 20% 80%, rgba(10, 29, 55, 0.1) 0%, transparent 50%),
               radial-gradient(circle at 80% 20%, rgba(255, 122, 0, 0.1) 0%, transparent 50%),
               radial-gradient(circle at 40% 40%, rgba(77, 191, 240, 0.1) 0%, transparent 50%),
               linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(10, 29, 55, 0.02) 100%)
             `,
           }}>
        
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-[#FF7A00]/20 to-[#4DBFF0]/20 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-32 right-32 w-80 h-80 bg-gradient-to-r from-[#4DBFF0]/20 to-[#FF7A00]/20 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative z-10 bg-gradient-to-br from-white/15 via-white/8 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 text-center max-w-2xl w-full shadow-2xl"
             style={{
               boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
             }}>
          
          {/* Success Animation */}
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent mb-2">
              🎉 سرویس با موفقیت ایجاد شد!
            </h2>
            
            <p className="text-white/70 mb-6">
              سرویس "{createdService.title}" با {createdService.fields.length} فیلد آماده استفاده است.
            </p>
          </div>

          {/* Service Summary */}
          <div className="bg-white/5 rounded-xl p-4 mb-6 text-right" dir="rtl">
            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
              <span className="text-2xl">{createdService.icon || '📋'}</span>
              خلاصه سرویس
            </h3>
            <div className="space-y-2 text-sm text-white/80">
              <div><span className="text-white/60">عنوان:</span> {createdService.title}</div>
              <div><span className="text-white/60">نام مستعار:</span> {createdService.slug}</div>
              <div><span className="text-white/60">هزینه:</span> {createdService.fee.toLocaleString('fa-IR')} تومان</div>
              <div><span className="text-white/60">تعداد فیلدها:</span> {createdService.fields.length}</div>
              <div><span className="text-white/60">وضعیت:</span> {createdService.status === 'active' ? 'فعال' : createdService.status === 'draft' ? 'پیش‌نویس' : 'غیرفعال'}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleCreateAnother}
              className="group relative overflow-hidden px-8 py-3 bg-gradient-to-r from-[#FF7A00] to-[#4DBFF0] text-white font-medium rounded-xl hover:from-[#FF7A00]/80 hover:to-[#4DBFF0]/80 transition-all duration-500 shadow-lg hover:shadow-[#FF7A00]/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
              <span className="relative">ایجاد سرویس جدید</span>
            </button>
            
            <button
              onClick={() => window.location.href = '/admin/services'}
              className="group relative overflow-hidden px-8 py-3 bg-white/10 border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              <span className="relative">مشاهده همه سرویس‌ها</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Info */}
      <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-400/20 rounded-xl p-4 mb-6 mx-4">
        <h3 className="text-blue-300 font-medium mb-2 flex items-center gap-2">
          <span className="text-2xl">🛠️</span>
          تست سرویس ساز
        </h3>
        <ul className="text-blue-200/80 text-sm space-y-1" dir="rtl">
          <li>• فیلدهای جدید به صورت باز (Expanded) نمایش داده می‌شوند</li>
          <li>• پیام موفقیت فقط پس از اعتبارسنجی کامل نمایش داده می‌شود</li>
          <li>• طراحی مطابق با الگوهای بصری پروژه</li>
          <li>• انیمیشن‌های روان و جذاب</li>
        </ul>
      </div>

      <ServiceBuilder
        onSave={handleSave}
        onCancel={handleCancel}
        isEditing={false}
      />
    </div>
  );
}