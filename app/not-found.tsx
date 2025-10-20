import Link from "next/link";
import { FaHome, FaSearch } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center" dir="rtl">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-24 h-24 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] rounded-full flex items-center justify-center mx-auto mb-8 relative">
          <FaSearch className="text-white text-3xl" />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-lg font-bold">!</span>
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-gray-300 mb-4">۴۰۴</h1>
        <h2 className="text-2xl font-bold text-[#0A1D37] mb-4">
          صفحه پیدا نشد
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          متأسفانه صفحه‌ای که دنبال آن هستید وجود ندارد یا ممکن است حذف شده باشد.
        </p>
        
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <FaHome className="text-sm" />
            بازگشت به داشبورد
          </Link>
          
          <div className="text-center">
            <Link
              href="/auth/sms"
              className="text-[#0A1D37] hover:text-[#4DBFF0] transition-colors text-sm"
            >
              صفحه ورود
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-[#0A1D37]/10 to-[#4DBFF0]/10 rounded-full blur-xl opacity-50"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-tr from-[#4DBFF0]/10 to-[#0A1D37]/10 rounded-full blur-lg opacity-30"></div>
      </div>
    </div>
  );
}