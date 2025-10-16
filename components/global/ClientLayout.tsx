'use client'

import React, { Suspense } from 'react';
import { FaSpinner } from 'react-icons/fa';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <FaSpinner className="animate-spin text-blue-500 text-4xl mx-auto mb-4" />
          <p className="text-gray-600">در حال بارگذاری صفحه...</p>
        </div>
      </div>
    }>
      {children}
    </Suspense>
  );
};

export default ClientLayout;