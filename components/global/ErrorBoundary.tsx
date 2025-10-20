"use client";

import React, { Component, ReactNode } from "react";
import { FaExclamationTriangle, FaHome } from "react-icons/fa";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log("Dashboard Error Boundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center" dir="rtl">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle className="text-white text-3xl" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              خطایی رخ داده است
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              متأسفانه در بارگذاری این صفحه مشکلی پیش آمده است. لطفاً صفحه را رفرش کنید یا با پشتیبانی تماس بگیرید.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#0A1D37] to-[#4DBFF0] text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                تلاش مجدد
              </button>
              
              <button
                onClick={() => window.location.href = "/dashboard"}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaHome className="text-sm" />
                بازگشت به داشبورد
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  جزئیات خطا (فقط در حالت توسعه)
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto text-red-600">
                  {this.state.error.message}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;