"use client";
import React, { useState } from 'react';
import ServiceBuilder from '@/components/serviceBuilder/ServiceBuilder';
import { ServiceBuilderFormData } from '@/types/serviceBuilder/types';

export default function CreateChatGPTServiceExample() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Example data for ChatGPT account creation service
  const chatGPTServiceTemplate: Partial<ServiceBuilderFormData> = {
    title: 'ایجاد حساب ChatGPT',
    slug: 'create-chatgpt-account',
    fee: 150000,
    wallet: false,
    description: 'ایجاد حساب ChatGPT Plus با امکانات کامل و دسترسی به آخرین مدل‌های هوش مصنوعی',
    icon: '🤖',
    status: 'active',
    image: 'https://via.placeholder.com/400x200?text=ChatGPT',
    fields: [
      {
        name: 'email',
        label: 'آدرس ایمیل',
        type: 'email',
        placeholder: 'example@gmail.com',
        required: true,
        description: 'ایمیل مورد نظر برای ثبت حساب ChatGPT'
      },
      {
        name: 'password',
        label: 'رمز عبور دلخواه',
        type: 'password',
        placeholder: 'رمز عبور قوی وارد کنید',
        required: true,
        validation: {
          minLength: 8,
          message: 'رمز عبور باید حداقل ۸ کاراکتر باشد'
        },
        description: 'رمز عبوری که می‌خواهید برای حساب تنظیم شود'
      },
      {
        name: 'account_type',
        label: 'نوع حساب',
        type: 'select',
        required: true,
        options: [
          { key: 'free', value: 'حساب رایگان' },
          { key: 'plus', value: 'ChatGPT Plus' },
          { key: 'team', value: 'ChatGPT Team' }
        ],
        description: 'نوع حساب مورد نظر خود را انتخاب کنید'
      },
      {
        name: 'phone_verification',
        label: 'آیا تأیید شماره تلفن لازم است؟',
        type: 'boolean',
        defaultValue: true,
        description: 'برای برخی کشورها تأیید شماره تلفن الزامی است'
      },
      {
        name: 'phone_number',
        label: 'شماره تلفن',
        type: 'tel',
        placeholder: '+989123456789',
        showIf: {
          field: 'phone_verification',
          value: true
        },
        validation: {
          pattern: '^\\+[1-9]\\d{1,14}$',
          message: 'شماره تلفن را با کد کشور وارد کنید (+989123456789)'
        },
        description: 'شماره تلفن برای تأیید حساب (اختیاری)'
      },
      {
        name: 'country',
        label: 'کشور',
        type: 'select',
        required: true,
        options: [
          { key: 'US', value: 'آمریکا' },
          { key: 'UK', value: 'انگلستان' },
          { key: 'CA', value: 'کانادا' },
          { key: 'DE', value: 'آلمان' },
          { key: 'FR', value: 'فرانسه' },
          { key: 'other', value: 'سایر کشورها' }
        ],
        description: 'کشور مورد نظر برای ثبت حساب'
      },
      {
        name: 'delivery_time',
        label: 'زمان تحویل مورد نظر',
        type: 'select',
        required: true,
        options: [
          { key: '24h', value: '24 ساعت' },
          { key: '48h', value: '48 ساعت' },
          { key: '72h', value: '72 ساعت' }
        ],
        description: 'مدت زمان مورد انتظار برای آماده شدن حساب'
      },
      {
        name: 'special_requests',
        label: 'درخواست‌های خاص',
        type: 'textarea',
        placeholder: 'درخواست‌های خاص یا توضیحات اضافی...',
        description: 'هر گونه درخواست خاص یا نکته مهم را اینجا بنویسید'
      },
      {
        name: 'agree_terms',
        label: 'شرایط و قوانین را مطالعه کرده و قبول دارم',
        type: 'boolean',
        required: true,
        description: 'برای ادامه باید شرایط و قوانین را بپذیرید'
      }
    ]
  };

  const handleSave = async (data: ServiceBuilderFormData) => {
    try {
      const response = await fetch('/api/dynamicServices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create service');
      }

      const result = await response.json();
      if (result.success) {
        setIsSubmitted(true);
        alert('سرویس ChatGPT با موفقیت ایجاد شد!');
      } else {
        throw new Error(result.message || 'Failed to create service');
      }
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    if (confirm('آیا از لغو ایجاد سرویس اطمینان دارید؟')) {
      window.history.back();
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 p-8 text-center max-w-md">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            سرویس با موفقیت ایجاد شد!
          </h2>
          <p className="text-white/70 mb-6">
            سرویس ایجاد حساب ChatGPT با موفقیت در سیستم ثبت شد و آماده استفاده است.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.href = '/admin/services'}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-300"
            >
              مشاهده همه سرویس‌ها
            </button>
            <button
              onClick={() => setIsSubmitted(false)}
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              ایجاد سرویس جدید
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🤖</span>
            <div>
              <h1 className="text-2xl font-bold text-white">
                نمونه: ایجاد سرویس ChatGPT
              </h1>
              <p className="text-white/70">
                این صفحه نمونه‌ای از نحوه ایجاد سرویس پیچیده با فیلدهای مختلف است
              </p>
            </div>
          </div>
          
          <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-4">
            <h3 className="text-blue-300 font-medium mb-2">📝 اطلاعات این نمونه:</h3>
            <ul className="text-blue-200/80 text-sm space-y-1">
              <li>• شامل فیلدهای مختلف: ایمیل، رمز عبور، انتخاب از لیست، چک‌باکس و متن</li>
              <li>• دارای منطق شرطی: فیلد شماره تلفن تنها در صورت فعال بودن تأیید نمایش می‌یابد</li>
              <li>• شامل اعتبارسنجی: بررسی طول رمز عبور و فرمت شماره تلفن</li>
              <li>• فیلدهای اجباری و اختیاری متنوع</li>
            </ul>
          </div>
        </div>
      </div>

      <ServiceBuilder
        initialData={chatGPTServiceTemplate}
        onSave={handleSave}
        onCancel={handleCancel}
        isEditing={false}
      />
    </div>
  );
}