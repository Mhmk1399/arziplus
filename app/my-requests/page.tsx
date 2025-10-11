"use client";

import CustomerRequestsTable from "@/components/customer/CustomerRequestsTable";

export default function MyRequestsPage() {
  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-white via-[#E8F4FD] to-[#F0F9FF] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CustomerRequestsTable />
      </div>
    </div>
  );
}