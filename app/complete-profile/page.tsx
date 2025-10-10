"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaIdCard, FaEnvelope, FaSpinner } from "react-icons/fa";
import { showToast } from "@/utilities/toast";

export default function CompleteProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    nationalNumber: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/auth/sms');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName) {
      showToast.error("نام و نام خانوادگی الزامی است");
      return;
    }

    // Validate national number if provided
    if (formData.nationalNumber && !/^\d{10}$/.test(formData.nationalNumber)) {
      showToast.error("کد ملی باید ۱۰ رقم باشد");
      return;
    }

    // Validate email if provided
    if (formData.email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      showToast.error("فرمت ایمیل صحیح نیست");
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        showToast.success("پروفایل با موفقیت تکمیل شد");
        setTimeout(() => {
          router.push('/admin');
        }, 1000);
      } else {
        showToast.error(data.error);
      }
    } catch (error) {
      showToast.error("خطا در تکمیل پروفایل");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUser className="text-white text-xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              تکمیل پروفایل
            </h1>
            <p className="text-gray-600">
              لطفاً اطلاعات خود را تکمیل کنید
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div className="relative">
              <FaUser className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="نام *"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full pr-12 pl-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>

            {/* Last Name */}
            <div className="relative">
              <FaUser className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="نام خانوادگی *"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full pr-12 pl-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="ایمیل (اختیاری)"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full pr-12 pl-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* National Number */}
            <div className="relative">
              <FaIdCard className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="کد ملی (اختیاری)"
                value={formData.nationalNumber}
                onChange={(e) => setFormData({...formData, nationalNumber: e.target.value.replace(/\D/g, '')})}
                className="w-full pr-12 pl-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                maxLength={10}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin ml-2" />
                  در حال تکمیل...
                </>
              ) : (
                'تکمیل پروفایل'
              )}
            </button>
          </form>

          {/* Skip Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/admin')}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              رد کردن و ادامه
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}