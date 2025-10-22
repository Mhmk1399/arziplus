"use client";

import React, { Suspense } from "react";
import { FaSpinner } from "react-icons/fa";

interface DashboardTemplateProps {
  children: React.ReactNode;
}

const DashboardTemplate: React.FC<DashboardTemplateProps> = ({ children }) => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen   flex items-center justify-center">
          <div className="  p-2  w-full text-center">
            <FaSpinner className="animate-spin text-blue-500 text-4xl mx-auto mb-4" />
            <p className="text-gray-800">در حال بارگذاری داشبورد</p>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

export default DashboardTemplate;
