'use client';

import Link from 'next/link';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface RequestNavigationProps {
  className?: string;
}

export default function RequestNavigation({ className = '' }: RequestNavigationProps) {
  const { user, isLoggedIn } = useCurrentUser();
  
  if (!isLoggedIn || !user) {
    return (
      <div className={`p-4 bg-gray-100 rounded-lg ${className}`}>
        <p className="text-gray-600">لطفاً برای مشاهده درخواست‌ها وارد شوید</p>
        <Link 
          href="/auth" 
          className="text-blue-600 hover:text-blue-800 underline"
        >
          ورود به حساب کاربری
        </Link>
      </div>
    );
  }

  const isAdmin = user.roles?.includes('admin');

  return (
    <div className={`p-4 bg-white rounded-lg shadow-md ${className}`}>
      <h3 className="text-lg font-bold mb-4 text-gray-800">
        مدیریت درخواست‌ها
      </h3>
      
      <div className="space-y-2">
        {/* Customer request link - available to all users */}
        <Link 
          href="/my-requests" 
          className="block w-full p-3 text-right bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-blue-700 font-medium">
              درخواست‌های من
            </span>
            <span className="text-blue-500 text-sm">
              مشاهده وضعیت درخواست‌ها
            </span>
          </div>
        </Link>

        {/* Admin request link - only for admins */}
        {isAdmin && (
          <Link 
            href="/admin/requests" 
            className="block w-full p-3 text-right bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 border border-red-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-red-700 font-medium">
                پنل مدیریت درخواست‌ها
              </span>
              <span className="text-red-500 text-sm">
                مدیریت همه درخواست‌ها
              </span>
            </div>
          </Link>
        )}

        {/* Create new request link */}
        <Link 
          href="/" 
          className="block w-full p-3 text-right bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 border border-green-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-green-700 font-medium">
              درخواست جدید
            </span>
            <span className="text-green-500 text-sm">
              ایجاد درخواست سرویس
            </span>
          </div>
        </Link>
      </div>

      {/* User info display */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          کاربر: <span className="font-medium">{user.firstName || user.id}</span>
          {isAdmin && (
            <span className="mr-2 px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
              مدیر
            </span>
          )}
        </p>
      </div>
    </div>
  );
}