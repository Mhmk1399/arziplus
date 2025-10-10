"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaPhone, FaEnvelope, FaBars, FaSignOutAlt } from "react-icons/fa";

interface User {
  _id: string;
  username: string;
  contactInfo: {
    mobilePhone: string;
    email: string;
  };
  nationalCredentials?: {
    firstName?: string;
    lastName?: string;
  };
  roles: string[];
  status: string;
}

export default function AdminPanel() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/auth/sms');
      return;
    }

    // In a real app, you would verify the token with the server
    // For now, we'll just check if the token exists
    fetchUserData();
  }, [router]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      } else {
        router.push('/auth/sms');
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      router.push('/auth/sms');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/auth/sms');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <FaBars className="text-gray-600 ml-4" />
              <h1 className="text-2xl font-bold text-gray-800">پنل مدیریت آرزی پلاس</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">
                  {user.nationalCredentials?.firstName 
                    ? `${user.nationalCredentials.firstName} ${user.nationalCredentials.lastName || ''}`
                    : user.username
                  }
                </p>
                <p className="text-xs text-gray-600">{user.contactInfo.mobilePhone}</p>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <FaSignOutAlt className="ml-2" />
                خروج
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUser className="text-white text-2xl" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              خوش آمدید! 
            </h2>
            
            <p className="text-gray-600 mb-6">
              به پنل مدیریت آرزی پلاس خوش آمدید. از اینجا می‌توانید حساب کاربری خود را مدیریت کنید.
            </p>

            {!user.nationalCredentials?.firstName && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800">
                  برای استفاده کامل از امکانات، لطفاً اطلاعات پروفایل خود را تکمیل کنید.
                </p>
                <button
                  onClick={() => router.push('/complete-profile')}
                  className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  تکمیل پروفایل
                </button>
              </div>
            )}
          </div>
        </div>

        {/* User Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Phone Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <FaPhone className="text-green-600 text-xl ml-3" />
              <h3 className="text-lg font-semibold text-gray-800">شماره تلفن</h3>
            </div>
            <p className="text-gray-600 mb-2">{user.contactInfo.mobilePhone}</p>
            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              تایید شده
            </span>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <FaEnvelope className="text-blue-600 text-xl ml-3" />
              <h3 className="text-lg font-semibold text-gray-800">ایمیل</h3>
            </div>
            <p className="text-gray-600 mb-2">{user.contactInfo.email}</p>
            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
              {user.contactInfo.email.includes('@temp.') ? 'موقت' : 'فعال'}
            </span>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <FaUser className="text-purple-600 text-xl ml-3" />
              <h3 className="text-lg font-semibold text-gray-800">وضعیت حساب</h3>
            </div>
            <p className="text-gray-600 mb-2 capitalize">{user.status}</p>
            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
              user.status === 'active' 
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {user.status === 'active' ? 'فعال' : 'در انتظار تایید'}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">عملیات سریع</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/complete-profile')}
              className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="text-center">
                <FaUser className="text-2xl mb-2 mx-auto" />
                <p className="font-semibold">ویرایش پروفایل</p>
              </div>
            </button>

            <button
              onClick={() => router.push('/services')}
              className="p-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🛠️</div>
                <p className="font-semibold">مدیریت سرویس‌ها</p>
              </div>
            </button>

            <button
              onClick={() => router.push('/requests')}
              className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">📋</div>
                <p className="font-semibold">درخواست‌ها</p>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}